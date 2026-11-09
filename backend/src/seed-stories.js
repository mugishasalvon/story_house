import 'dotenv/config'
import defaultStories from '../../frontend/src/data/stories.js'
import pool from './db.js'
import { saveStory } from './story-repository.js'

try {
	const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM story')
	if (Number(count) > 0) {
		throw new Error('The story table is not empty; refusing to overwrite its contents.')
	}

	for (const [index, story] of defaultStories.entries()) {
		await saveStory({
			...story,
			isNew: Boolean(story.isNew),
			seasons: story.seasons.map((season) => ({
				...season,
				episodes: season.episodes.map((episode) => ({
					...episode,
					content: episode.content || episode.summary || '',
				})),
			})),
		})
		await pool.execute('UPDATE story SET display_order = ? WHERE id = ?', [
			index,
			story.id,
		])
	}
	console.log(`Imported ${defaultStories.length} stories into story_house.`)
} finally {
	await pool.end()
}
