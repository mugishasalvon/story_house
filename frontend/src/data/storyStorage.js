import defaultStories from './stories'

export const STORIES_STORAGE_KEY = 'storyhouse_stories'

export function getStories() {
	const stored = localStorage.getItem(STORIES_STORAGE_KEY)
	if (!stored) return defaultStories

	try {
		const parsed = JSON.parse(stored)
		if (
			Array.isArray(parsed) &&
			parsed.every(
				(story) =>
					story &&
					typeof story.id === 'string' &&
					typeof story.title === 'string' &&
					Array.isArray(story.seasons),
			)
		) {
			return parsed
		}
		throw new Error('Stored story data has an invalid shape.')
	} catch (error) {
		console.error('Unable to load saved stories. Restoring the default catalog.', error)
		localStorage.removeItem(STORIES_STORAGE_KEY)
		return defaultStories
	}
}

export function saveStories(stories) {
	localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories))
}
