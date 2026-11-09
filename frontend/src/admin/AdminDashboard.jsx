import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import {
	deleteAdminStory,
	getAdminStories,
	saveAdminStory,
	uploadAdminCover,
} from '../data/api'

const MAX_COVER_SIZE = 2 * 1024 * 1024
const ALLOWED_COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function createEmptyStory() {
	return {
		id: '',
		title: '',
		genre: '',
		year: String(new Date().getFullYear()),
		rating: '0.0',
		image: '',
		accent: '#b6c09b',
		description: '',
		isNew: false,
		seasons: [{ number: 1, title: 'Season 1', episodes: [] }],
	}
}

function createEmptyEpisode() {
	return { title: '', duration: '', summary: '', image: '', content: '' }
}

function createStoryId(title, existingStories) {
	const base =
		title
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '') || 'story'
	let id = base
	let suffix = 2
	while (existingStories.some((story) => story.id === id)) {
		id = `${base}-${suffix}`
		suffix += 1
	}
	return id
}

function AdminDashboard({ onStoriesChanged }) {
	const { isAdmin, logout, token } = useAuth()
	const isLoggingOut = useRef(false)
	const [stories, setStories] = useState([])
	const [draft, setDraft] = useState(null)
	const [editorTab, setEditorTab] = useState('details')
	const [editorSeasonIndex, setEditorSeasonIndex] = useState(0)
	const [search, setSearch] = useState('')
	const [error, setError] = useState('')
	const [coverPreview, setCoverPreview] = useState('')
	const [coverFileName, setCoverFileName] = useState('')
	const [coverLoading, setCoverLoading] = useState(false)
	const [coverPreviewError, setCoverPreviewError] = useState(false)

	useEffect(() => {
		if (!coverPreview.startsWith('blob:')) return undefined
		return () => URL.revokeObjectURL(coverPreview)
	}, [coverPreview])

	useEffect(() => {
		if (!isAdmin && !isLoggingOut.current) {
			window.location.replace('/admin/login')
		}
	}, [isAdmin])

	useEffect(() => {
		if (!isAdmin || !token) return undefined

		let cancelled = false
		getAdminStories(token)
			.then((loadedStories) => {
				if (cancelled) return
				setStories(loadedStories)
				onStoriesChanged(loadedStories)
			})
			.catch((loadError) => {
				if (cancelled) return
				console.error('Unable to load stories from the backend.', loadError)
				setError(loadError.message)
				if (loadError.status === 401) {
					logout()
					window.location.replace('/admin/login')
				}
			})

		return () => {
			cancelled = true
		}
	}, [isAdmin, token, logout, onStoriesChanged])

	function handleLogout() {
		isLoggingOut.current = true
		logout()
		window.location.replace('/discover')
	}

	function updateStory(field, value) {
		setDraft((current) => ({ ...current, [field]: value }))
	}

	async function handleCoverFile(event) {
		const input = event.currentTarget
		const file = input.files?.[0]
		if (!file) return

		setError('')
		const extensionType = {
			gif: 'image/gif',
			jpeg: 'image/jpeg',
			jpg: 'image/jpeg',
			png: 'image/png',
			webp: 'image/webp',
		}[file.name.split('.').pop()?.toLowerCase()]
		const detectedType = file.type === 'image/jpg' ? 'image/jpeg' : file.type
		const mimeType = ALLOWED_COVER_TYPES.includes(detectedType)
			? detectedType
			: extensionType
		if (!ALLOWED_COVER_TYPES.includes(mimeType)) {
			setError('Choose a JPG, PNG, WebP, or GIF cover image.')
			input.value = ''
			return
		}
		if (file.size > MAX_COVER_SIZE) {
			setError('Cover images must be 2 MB or smaller.')
			input.value = ''
			return
		}

		setCoverPreview(URL.createObjectURL(file))
		setCoverPreviewError(false)
		setCoverFileName(file.name)
		setCoverLoading(true)
		updateStory('image', '')
		try {
			const imageUrl = await uploadAdminCover(token, file)
			updateStory('image', imageUrl)
			setCoverPreview(imageUrl)
		} catch (fileError) {
			console.error('Unable to upload the selected cover image.', fileError)
			setError(fileError.message)
		} finally {
			setCoverLoading(false)
			input.value = ''
		}
	}

	function updateSeason(seasonIndex, field, value) {
		setDraft((current) => ({
			...current,
			seasons: current.seasons.map((season, index) =>
				index === seasonIndex ? { ...season, [field]: value } : season,
			),
		}))
	}

	function updateEpisode(seasonIndex, episodeIndex, field, value) {
		setDraft((current) => ({
			...current,
			seasons: current.seasons.map((season, currentSeasonIndex) =>
				currentSeasonIndex === seasonIndex
					? {
							...season,
							episodes: season.episodes.map((episode, currentEpisodeIndex) =>
								currentEpisodeIndex === episodeIndex
									? { ...episode, [field]: value }
									: episode,
							),
						}
					: season,
			),
		}))
	}

	function addSeason() {
		setDraft((current) => ({
			...current,
			seasons: [
				...current.seasons,
				{
					number:
						Math.max(0, ...current.seasons.map((season) => Number(season.number) || 0)) +
						1,
					title: '',
					episodes: [],
				},
			],
		}))
		setEditorSeasonIndex(draft.seasons.length)
	}

	function removeSeason(seasonIndex) {
		setDraft((current) => ({
		...current,
		seasons: current.seasons.filter((_, index) => index !== seasonIndex),
		}))
		setEditorSeasonIndex((index) =>
		Math.max(0, Math.min(index > seasonIndex ? index - 1 : index, draft.seasons.length - 2)),
		)
	}

	function addEpisode(seasonIndex) {
		setDraft((current) => ({
			...current,
			seasons: current.seasons.map((season, index) =>
				index === seasonIndex
					? { ...season, episodes: [...season.episodes, createEmptyEpisode()] }
					: season,
			),
		}))
	}

	function removeEpisode(seasonIndex, episodeIndex) {
		setDraft((current) => ({
			...current,
			seasons: current.seasons.map((season, currentSeasonIndex) =>
				currentSeasonIndex === seasonIndex
					? {
							...season,
							episodes: season.episodes.filter(
								(_, currentEpisodeIndex) => currentEpisodeIndex !== episodeIndex,
							),
						}
					: season,
			),
		}))
	}

	async function handleSave(event) {
		event.preventDefault()
		setError('')

		if (!draft.image) {
			setError('Choose and upload a cover image before saving this story.')
			return
		}
		if (!draft.seasons.length) {
			setError('Add at least one season before saving this story.')
			return
		}

		const normalizedStory = {
			...draft,
			id: draft.id || createStoryId(draft.title, stories),
			year: String(draft.year),
			rating: String(draft.rating),
			seasons: draft.seasons.map((season, index) => ({
				...season,
				number: Number(season.number) || index + 1,
				episodes: season.episodes.map((episode) => ({ ...episode })),
			})),
		}
		try {
			await saveAdminStory(token, normalizedStory)
			const nextStories = draft.id
				? stories.map((story) =>
						story.id === draft.id ? normalizedStory : story,
					)
				: [...stories, normalizedStory]
			setStories(nextStories)
			onStoriesChanged(nextStories)
			setDraft(null)
		} catch (saveError) {
			console.error('Unable to save story changes to the backend.', saveError)
			setError(saveError.message)
			if (saveError.status === 401) {
				logout()
				window.location.replace('/admin/login')
			}
		}
	}

	async function handleDelete(story) {
		if (stories.length <= 1) {
			setError('Keep at least one story in the catalog.')
			return
		}
		if (!window.confirm(`Delete "${story.title}" and all its seasons and episodes?`)) {
			return
		}

		try {
			await deleteAdminStory(token, story.id)
			const nextStories = stories.filter((item) => item.id !== story.id)
			setStories(nextStories)
			onStoriesChanged(nextStories)
			setDraft((current) => (current?.id === story.id ? null : current))
			setError('')
		} catch (saveError) {
			console.error('Unable to delete story from the backend.', saveError)
			setError(saveError.message)
			if (saveError.status === 401) {
				logout()
				window.location.replace('/admin/login')
			}
		}
	}

	const visibleStories = stories.filter((story) =>
		`${story.title} ${story.genre}`.toLowerCase().includes(search.toLowerCase()),
	)

	if (!isAdmin) return null

	return (
		<div className="admin-dashboard">
			<header className="admin-header">
				<div>
					<p className="admin-eyebrow">STORYHOUSE</p>
					<h1>Story management</h1>
				</div>
				<div className="admin-header-actions">
					<a className="admin-btn admin-btn-ghost" href="/discover">
						View site
					</a>
					<button
						type="button"
						onClick={handleLogout}
						className="admin-btn admin-btn-ghost"
					>
						Logout
					</button>
				</div>
			</header>

			<main className="admin-content">
				<div className="admin-toolbar">
					<div>
						<h2>All stories</h2>
						<p>{stories.length} stories in your catalog</p>
					</div>
					<div className="admin-toolbar-actions">
						<input
							className="admin-search"
							type="search"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Find a story"
							aria-label="Find a story"
						/>
						<button
							className="admin-btn admin-btn-primary"
							type="button"
							onClick={() => {
								setError('')
								setCoverPreview('')
								setCoverFileName('')
								setDraft(createEmptyStory())
								setEditorTab('details')
								setEditorSeasonIndex(0)
							}}
						>
							Add story
						</button>
					</div>
				</div>

				{error && <p className="admin-form-error" role="alert">{error}</p>}

				{draft && (
					<form className="admin-story-editor" onSubmit={handleSave}>
						<div className="admin-editor-heading">
							<div>
								<p className="admin-eyebrow">{draft.id ? 'EDIT STORY' : 'NEW STORY'}</p>
								<h2>{draft.id ? draft.title : 'Create a story'}</h2>
							</div>
							<button
								className="admin-btn admin-btn-ghost"
								type="button"
								disabled={coverLoading}
								onClick={() => {
									setDraft(null)
									setCoverPreview('')
									setCoverPreviewError(false)
									setCoverFileName('')
									setError('')
								}}
							>
								Cancel
							</button>
						</div>

						<div className="admin-editor-tabs" role="tablist" aria-label="Story editor sections">
							{[
								['details', 'Story details'],
								['seasons', `Seasons (${draft.seasons.length})`],
								['episodes', 'Episodes'],
							].map(([tab, label]) => (
								<button
									key={tab}
									className={editorTab === tab ? 'admin-editor-tab active' : 'admin-editor-tab'}
									type="button"
									role="tab"
									aria-selected={editorTab === tab}
									onClick={() => setEditorTab(tab)}
								>
									{label}
								</button>
							))}
						</div>

						{editorTab === 'details' && (
						<div className="admin-form-grid">
							<label>
								Story title
								<input
									required
									value={draft.title}
									onChange={(event) => updateStory('title', event.target.value)}
								/>
							</label>
							<label>
								Genre
								<input
									required
									value={draft.genre}
									onChange={(event) => updateStory('genre', event.target.value)}
								/>
							</label>
							<label>
								Year
								<input
									required
									value={draft.year}
									onChange={(event) => updateStory('year', event.target.value)}
								/>
							</label>
							<label>
								Rating
								<input
									value={draft.rating}
									onChange={(event) => updateStory('rating', event.target.value)}
								/>
							</label>
							<div className="admin-cover-field admin-field-wide">
								<label className="admin-cover-label" htmlFor="story-cover-file">
									Choose an image from this device (JPG, PNG, WebP, or GIF; up to 2 MB)
								</label>
								<input
									id="story-cover-file"
									className="admin-cover-file"
									type="file"
									accept="image/jpeg,image/png,image/webp,image/gif"
									disabled={coverLoading}
									onChange={handleCoverFile}
								/>
							</div>
							{coverFileName && (
								<p className="admin-cover-status admin-field-wide" role="status">
									{coverLoading
										? `Preparing ${coverFileName}…`
										: draft.image
											? 'Cover image preview is ready. Save the story to apply it.'
											: 'Cover upload failed. Choose the image again to retry.'}
								</p>
							)}
							{(coverPreview || draft.image) && !coverPreviewError && (
								<div className="admin-cover-preview-wrap admin-field-wide">
									<img
										className="admin-cover-preview"
										src={coverPreview || draft.image}
										alt="Story cover preview"
										onError={() => {
											if (coverPreview) {
												setError('The selected file could not be previewed as an image.')
											} else {
												setCoverPreviewError(true)
											}
										}}
									/>
								</div>
							)}
							{coverPreviewError && !coverPreview && (
								<p className="admin-cover-status admin-field-wide" role="status">
									The current cover link can’t be previewed. Choose an image from this device to replace it.
								</p>
							)}
							<label>
								Accent color
								<input
									type="color"
									value={draft.accent}
									onChange={(event) => updateStory('accent', event.target.value)}
								/>
							</label>
							<label className="admin-field-checkbox">
								<input
									type="checkbox"
									checked={Boolean(draft.isNew)}
									onChange={(event) => updateStory('isNew', event.target.checked)}
								/>
								Feature as a new story
							</label>
							<label className="admin-field-wide">
								Description
								<textarea
									required
									rows="3"
									value={draft.description}
									onChange={(event) =>
										updateStory('description', event.target.value)
									}
								/>
							</label>
						</div>
						)}

						{editorTab === 'seasons' && (
						<div className="admin-season-list">
							<div className="admin-section-heading">
								<div>
									<h3>Seasons</h3>
									<p>Manage this story’s seasons here. Edit episodes in the Episodes tab.</p>
								</div>
								<button
									className="admin-btn admin-btn-ghost"
									type="button"
									onClick={addSeason}
								>
									Add season
								</button>
							</div>

							{draft.seasons.map((season, seasonIndex) => (
								<section className="admin-season-editor" key={seasonIndex}>
									<div className="admin-season-heading">
										<label>
											Season number
											<input
												type="number"
												min="1"
												required
												value={season.number}
												onChange={(event) =>
													updateSeason(seasonIndex, 'number', event.target.value)
												}
											/>
										</label>
										<label>
											Season title
											<input
												required
												value={season.title}
												onChange={(event) =>
													updateSeason(seasonIndex, 'title', event.target.value)
												}
											/>
										</label>
										<button
											className="admin-btn admin-btn-danger"
											type="button"
											onClick={() => removeSeason(seasonIndex)}
										>
											Remove season
										</button>
									</div>
									<p className="admin-season-episode-count">
										{season.episodes.length} {season.episodes.length === 1 ? 'episode' : 'episodes'}
									</p>
								</section>
							))}
						</div>
						)}

						{editorTab === 'episodes' && (
						<div className="admin-season-list">
							<div className="admin-section-heading">
								<div>
									<h3>Episodes</h3>
									<p>Choose a season, then add or edit its episodes.</p>
								</div>
							</div>
							{draft.seasons.length > 0 ? (
								<>
									<div className="admin-season-picker" role="tablist" aria-label="Choose a season to edit">
										{draft.seasons.map((season, seasonIndex) => (
											<button
												key={`${season.number}-${seasonIndex}`}
												className={editorSeasonIndex === seasonIndex ? 'admin-season-picker-tab active' : 'admin-season-picker-tab'}
												type="button"
												role="tab"
												aria-selected={editorSeasonIndex === seasonIndex}
												onClick={() => setEditorSeasonIndex(seasonIndex)}
											>
												Season {season.number}: {season.title || 'Untitled'}
											</button>
										))}
									</div>
									{draft.seasons[editorSeasonIndex] && (
										<section className="admin-season-editor">
											<div className="admin-section-heading">
												<div>
													<h3>
														Season {draft.seasons[editorSeasonIndex].number}: {draft.seasons[editorSeasonIndex].title}
													</h3>
													<p>
														{draft.seasons[editorSeasonIndex].episodes.length}{' '}
														{draft.seasons[editorSeasonIndex].episodes.length === 1 ? 'episode' : 'episodes'}
													</p>
												</div>
												<button
													className="admin-btn admin-btn-ghost"
													type="button"
													onClick={() => addEpisode(editorSeasonIndex)}
												>
													Add episode
												</button>
											</div>
											{draft.seasons[editorSeasonIndex].episodes.map((episode, episodeIndex) => (
										<div className="admin-episode-editor" key={episodeIndex}>
											<div className="admin-episode-heading">
												<strong>Episode {episodeIndex + 1}</strong>
												<button
													className="admin-btn admin-btn-danger"
													type="button"
													onClick={() => removeEpisode(editorSeasonIndex, episodeIndex)}
												>
													Remove
												</button>
											</div>
											<div className="admin-form-grid">
												<label>
													Episode title
													<input
														required
														value={episode.title}
														onChange={(event) =>
															updateEpisode(
																editorSeasonIndex,
																episodeIndex,
																'title',
																event.target.value,
															)
														}
													/>
												</label>
												<label>
													Reading time
													<input
														placeholder="10 min"
														value={episode.duration}
														onChange={(event) =>
															updateEpisode(
																editorSeasonIndex,
																episodeIndex,
																'duration',
																event.target.value,
															)
														}
													/>
												</label>
												<label className="admin-field-wide">
													Episode image ID
													<input
														value={episode.image}
														onChange={(event) =>
															updateEpisode(
																editorSeasonIndex,
																episodeIndex,
																'image',
																event.target.value,
															)
														}
													/>
												</label>
												<label className="admin-field-wide">
													Summary
													<textarea
														rows="2"
														value={episode.summary}
														onChange={(event) =>
															updateEpisode(
																editorSeasonIndex,
																episodeIndex,
																'summary',
																event.target.value,
															)
														}
													/>
												</label>
												<label className="admin-field-wide">
													Episode text
													<textarea
														rows="5"
														value={
															Array.isArray(episode.content)
																? episode.content.join('\n\n')
																: episode.content ?? ''
														}
														onChange={(event) =>
															updateEpisode(
																editorSeasonIndex,
																episodeIndex,
																'content',
																event.target.value,
															)
														}
													/>
												</label>
											</div>
										</div>
											))}
										</section>
									)}
								</>
							) : (
								<p className="admin-empty">Add a season before adding episodes.</p>
							)}
						</div>
						)}

						<div className="admin-editor-actions">
							<button
								className="admin-btn admin-btn-primary"
								type="submit"
								disabled={coverLoading || !draft.image}
							>
								{coverLoading ? 'Loading cover…' : 'Save story'}
							</button>
							<button
								className="admin-btn admin-btn-ghost"
								type="button"
								onClick={() => setDraft(null)}
							>
								Cancel
							</button>
						</div>
					</form>
				)}

				<div className="admin-table-wrap">
					<table className="admin-story-table">
						<thead>
							<tr>
								<th scope="col">Story</th>
								<th scope="col">Genre</th>
								<th scope="col">Year</th>
								<th scope="col">Rating</th>
								<th scope="col">Seasons</th>
								<th scope="col">Episodes</th>
								<th scope="col">Status</th>
								<th scope="col">Actions</th>
							</tr>
						</thead>
						<tbody>
							{visibleStories.map((story) => {
								const episodeCount = story.seasons.reduce(
									(total, season) => total + season.episodes.length,
									0,
								)
								return (
									<tr key={story.id}>
										<th scope="row" className="admin-table-story">
											<img src={story.image} alt="" />
											<span>{story.title}</span>
										</th>
										<td>{story.genre}</td>
										<td>{story.year}</td>
										<td>★ {story.rating}</td>
										<td>{story.seasons.length}</td>
										<td>{episodeCount}</td>
										<td>
											<span
												className={
													story.isNew
														? 'admin-status admin-status-new'
														: 'admin-status'
												}
											>
												{story.isNew ? 'New' : 'Published'}
											</span>
										</td>
										<td>
											<div className="admin-row-actions">
												<button
													className="admin-btn admin-btn-ghost"
													type="button"
													onClick={() => {
														setError('')
														setDraft(JSON.parse(JSON.stringify(story)))
														setEditorTab('details')
														setEditorSeasonIndex(0)
														window.scrollTo({ top: 0, behavior: 'smooth' })
													}}
												>
													Edit
												</button>
												<button
													className="admin-btn admin-btn-danger"
													type="button"
													onClick={() => handleDelete(story)}
												>
													Delete
												</button>
											</div>
										</td>
									</tr>
								)
							})}
							{visibleStories.length === 0 && (
								<tr>
									<td className="admin-table-empty" colSpan="8">
										No stories match “{search}”.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	)
}

export default AdminDashboard
