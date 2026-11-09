const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

async function request(path, { token, ...options } = {}) {
	const isFormData =
		typeof FormData !== 'undefined' && options.body instanceof FormData
	let response
	try {
		response = await fetch(`${API_BASE}${path}`, {
			...options,
			headers: {
				...(options.body && !isFormData
					? { 'Content-Type': 'application/json' }
					: {}),
				...(token ? { Authorization: `Bearer ${token}` } : {}),
				...options.headers,
			},
		})
	} catch (error) {
		throw new Error(`Could not connect to the Storyhouse API: ${error.message}`)
	}

	if (response.status === 204) return null
	let result
	try {
		result = await response.json()
	} catch (error) {
		throw new Error(`The Storyhouse API returned an invalid response: ${error.message}`)
	}
	if (!response.ok) {
		const apiError = new Error(result.error || `Request failed (${response.status}).`)
		apiError.status = response.status
		throw apiError
	}
	return result
}

export function getPublicStories() {
	return request('/stories')
}

export function getAdminStories(token) {
	return request('/admin/stories', { token })
}

export function saveAdminStory(token, story) {
	return request(`/admin/stories/${encodeURIComponent(story.id)}`, {
		method: 'PUT',
		token,
		body: JSON.stringify(story),
	})
}

export async function uploadAdminCover(token, file) {
	const formData = new FormData()
	formData.append('cover', file)
	const result = await request('/admin/uploads/covers', {
		method: 'POST',
		token,
		body: formData,
	})
	return new URL(result.url, API_BASE).toString()
}

export function deleteAdminStory(token, storyId) {
	return request(`/admin/stories/${encodeURIComponent(storyId)}`, {
		method: 'DELETE',
		token,
	})
}

export function loginAdmin(username, password) {
	return request('/admin/login', {
		method: 'POST',
		body: JSON.stringify({ username, password }),
	})
}
