import pool from './db.js'

const MAX_COVER_BYTES = 2 * 1024 * 1024

export async function listStories() {
	const [storyRows] = await pool.query(
		`SELECT id, title, genre, year, rating, image, accent, description, is_new, display_order
		 FROM story ORDER BY display_order, created_at, id`,
	)
	if (storyRows.length === 0) return []

	const ids = storyRows.map((story) => story.id)
	const placeholders = ids.map(() => '?').join(', ')
	const [seasonRows] = await pool.execute(
		`SELECT id, story_id, season_number, title FROM season
		 WHERE story_id IN (${placeholders}) ORDER BY season_number, id`,
		ids,
	)
	const seasonIds = seasonRows.map((season) => season.id)
	let episodeRows = []
	if (seasonIds.length) {
		const seasonPlaceholders = seasonIds.map(() => '?').join(', ')
		;[episodeRows] = await pool.execute(
			`SELECT season_id, episode_number, title, duration, summary, image, content
			 FROM episode WHERE season_id IN (${seasonPlaceholders})
			 ORDER BY episode_number, id`,
			seasonIds,
		)
	}

	const episodesBySeason = new Map()
	for (const episode of episodeRows) {
		const episodes = episodesBySeason.get(episode.season_id) ?? []
		episodes.push({
			title: episode.title,
			duration: episode.duration,
			summary: episode.summary,
			image: episode.image,
			content: episode.content,
		})
		episodesBySeason.set(episode.season_id, episodes)
	}

	const seasonsByStory = new Map()
	for (const season of seasonRows) {
		const seasons = seasonsByStory.get(season.story_id) ?? []
		seasons.push({
			number: season.season_number,
			title: season.title,
			episodes: episodesBySeason.get(season.id) ?? [],
		})
		seasonsByStory.set(season.story_id, seasons)
	}

	return storyRows.map((story) => ({
		id: story.id,
		title: story.title,
		genre: story.genre,
		year: story.year,
		rating: Number(story.rating).toFixed(1),
		image: story.image,
		accent: story.accent,
		description: story.description,
		isNew: Boolean(story.is_new),
		seasons: seasonsByStory.get(story.id) ?? [],
	}))
}

function validateStory(story) {
	let validCover = false
	if (typeof story?.image === 'string' && story.image.length <= 2048) {
		try {
			validCover = ['http:', 'https:'].includes(new URL(story.image).protocol)
		} catch {
			validCover = false
		}
	}
	if (typeof story?.image === 'string' && story.image.startsWith('data:')) {
		const match = story.image.match(
			/^data:image\/(jpeg|png|webp|gif);base64,([A-Za-z0-9+/]+={0,2})$/,
		)
		if (match) {
			const imageBytes = Buffer.from(match[2], 'base64')
			if (
				imageBytes.length <= MAX_COVER_BYTES &&
				imageBytes.toString('base64') === match[2]
			) {
				validCover = true
			}
		}
	}

	if (
		!story ||
		typeof story !== 'object' ||
		typeof story.id !== 'string' ||
		!/^[a-zA-Z0-9_-]{1,191}$/.test(story.id) ||
		typeof story.title !== 'string' ||
		!story.title.trim() ||
		typeof story.genre !== 'string' ||
		typeof story.year !== 'string' ||
		!Number.isFinite(Number(story.rating)) ||
		Number(story.rating) < 0 ||
		Number(story.rating) > 9.9 ||
		!validCover ||
		typeof story.accent !== 'string' ||
		!/^#[0-9a-f]{6}$/i.test(story.accent) ||
		typeof story.description !== 'string' ||
		typeof story.isNew !== 'boolean' ||
		!Array.isArray(story.seasons) ||
		story.seasons.length === 0
	) {
		throw new TypeError('Story fields are invalid.')
	}

	const seasonNumbers = new Set()
	for (const season of story.seasons) {
		if (
			!season ||
			!Number.isInteger(Number(season.number)) ||
			Number(season.number) < 1 ||
			typeof season.title !== 'string' ||
			!Array.isArray(season.episodes)
		) {
			throw new TypeError('Season fields are invalid.')
		}
		if (seasonNumbers.has(Number(season.number))) {
			throw new TypeError('Season numbers must be unique within a story.')
		}
		seasonNumbers.add(Number(season.number))
		for (const episode of season.episodes) {
			if (
				!episode ||
				typeof episode.title !== 'string' ||
				!episode.title.trim() ||
				typeof episode.duration !== 'string' ||
				typeof episode.summary !== 'string' ||
				typeof episode.image !== 'string' ||
				typeof episode.content !== 'string'
			) {
				throw new TypeError('Episode fields are invalid.')
			}
		}
	}
}

export async function saveStory(story) {
	validateStory(story)
	const connection = await pool.getConnection()

	try {
		await connection.beginTransaction()
		const [[{ nextOrder }]] = await connection.query(
			'SELECT COALESCE(MAX(display_order), -1) + 1 AS nextOrder FROM story',
		)
		await connection.execute(
			`INSERT INTO story
			 (id, title, genre, year, rating, image, accent, description, is_new, display_order)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			 ON DUPLICATE KEY UPDATE title=VALUES(title), genre=VALUES(genre), year=VALUES(year),
			 rating=VALUES(rating), image=VALUES(image), accent=VALUES(accent),
			 description=VALUES(description), is_new=VALUES(is_new)`,
			[
				story.id,
				story.title.trim(),
				story.genre,
				story.year,
				Number(story.rating),
				story.image,
				story.accent,
				story.description,
				story.isNew,
				nextOrder,
			],
		)

		const [seasonRows] = await connection.execute(
			'SELECT id FROM season WHERE story_id = ?',
			[story.id],
		)
		const oldSeasonIds = seasonRows.map((season) => season.id)
		if (oldSeasonIds.length) {
			const placeholders = oldSeasonIds.map(() => '?').join(', ')
			await connection.execute(
				`DELETE FROM episode WHERE season_id IN (${placeholders})`,
				oldSeasonIds,
			)
		}
		await connection.execute('DELETE FROM season WHERE story_id = ?', [story.id])

		for (const season of story.seasons) {
			const [seasonResult] = await connection.execute(
				'INSERT INTO season (story_id, season_number, title) VALUES (?, ?, ?)',
				[story.id, Number(season.number), season.title],
			)
			for (const [episodeIndex, episode] of season.episodes.entries()) {
				await connection.execute(
					`INSERT INTO episode
					 (season_id, episode_number, title, duration, summary, image, content)
					 VALUES (?, ?, ?, ?, ?, ?, ?)`,
					[
						seasonResult.insertId,
						episodeIndex + 1,
						episode.title.trim(),
						episode.duration,
						episode.summary,
						episode.image,
						episode.content,
					],
				)
			}
		}
		await connection.commit()
	} catch (error) {
		await connection.rollback()
		throw error
	} finally {
		connection.release()
	}
}

export async function deleteStory(id) {
	const [result] = await pool.execute('DELETE FROM story WHERE id = ?', [id])
	return result.affectedRows > 0
}
