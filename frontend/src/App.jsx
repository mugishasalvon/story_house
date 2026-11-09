import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import Header from './components/Header'
import ReaderPage from './pages/reader'
import About from './pages/about'
import Contact from './pages/contact'
import Footer from './pages/footer'
import Home from './pages/home'
import Library from './pages/library'
import Story from './pages/story'
import AdminDashboard from './admin/AdminDashboard'
import AdminLogin from './admin/AdminLogin'
import WhatsAppSupport from './components/WhatsAppSupport'
import { useAuth } from './contexts/useAuth'
import { getPublicStories } from './data/api'
import { getStories, saveStories } from './data/storyStorage'

function getStoredActiveStory(stories) {
	const requestedId = new URLSearchParams(window.location.search).get('story')
	const storedId = localStorage.getItem('storyhouse_active_story')
	return stories.find((story) => story.id === requestedId || story.id === storedId) ?? stories[0]
}

function getSavedStories(stories) {
	const stored = localStorage.getItem('storyhouse_saved_stories')
	if (!stored) return []

	try {
		const parsed = JSON.parse(stored)
		return Array.isArray(parsed)
			? parsed.filter((id) => stories.some((story) => story.id === id))
			: []
	} catch {
		localStorage.removeItem('storyhouse_saved_stories')
		return []
	}
}

function getStoredReaderEpisode() {
	const stored = sessionStorage.getItem('storyhouse_reader_episode')
	if (!stored) return null

	try {
		return JSON.parse(stored)
	} catch (error) {
		console.error('Unable to load the selected episode.', error)
		sessionStorage.removeItem('storyhouse_reader_episode')
		return null
	}
}

function App() {
	const currentPath = window.location.pathname.replace(/\/+$/, '') || '/discover'
	const { isAdmin } = useAuth()
	const [stories, setStories] = useState(getStories)
	const [activeStoryId, setActiveStoryId] = useState(
		() => getStoredActiveStory(getStories()).id,
	)
	const [catalogError, setCatalogError] = useState('')
	const [featuredStoryId, setFeaturedStoryId] = useState(() => {
		const catalog = getStories()
		return (catalog.find((story) => story.isNew) ?? catalog[0]).id
	})
	const [activeSeason, setActiveSeason] = useState(1)
	const [search, setSearch] = useState('')
	const [savedStories, setSavedStories] = useState(() => getSavedStories(getStories()))
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [selectedEpisode, setSelectedEpisode] = useState(getStoredReaderEpisode)
	const [autoRotate, setAutoRotate] = useState(true)
	const featuredStories = useMemo(() => {
		const newStories = stories.filter((story) => story.isNew)
		return (newStories.length ? newStories : stories).slice(0, 5)
	}, [stories])

	const activeStory =
		stories.find((story) => story.id === activeStoryId) ?? stories[0]
	const featuredStory =
		featuredStories.find((story) => story.id === featuredStoryId) ??
		featuredStories[0]
	const currentSeason =
		activeStory.seasons.find((season) => season.number === activeSeason) ??
		activeStory.seasons[0]
	const featuredStoryIndex = featuredStories.findIndex(
		(story) => story.id === featuredStory.id,
	)
	const episodeCount = activeStory.seasons.reduce(
		(total, season) => total + season.episodes.length,
		0,
	)
	const visibleStories = useMemo(
		() =>
			stories.filter((story) =>
				`${story.title} ${story.genre}`
					.toLowerCase()
					.includes(search.toLowerCase()),
			),
		[search, stories],
	)
	const isSaved = savedStories.includes(activeStory.id)
	const isFeaturedSaved = savedStories.includes(featuredStory.id)

	useEffect(() => {
		let cancelled = false
		getPublicStories()
			.then((loadedStories) => {
				if (!Array.isArray(loadedStories) || loadedStories.length === 0) {
					throw new Error('The database catalog has no stories. Seed the database to publish stories.')
				}
				if (cancelled) return
				setStories(loadedStories)
				setActiveStoryId(getStoredActiveStory(loadedStories).id)
				saveStories(loadedStories)
				setCatalogError('')
			})
			.catch((error) => {
				if (cancelled) return
				console.error('Unable to load stories from the database.', error)
				setCatalogError(`Showing saved stories because the database catalog is unavailable: ${error.message}`)
			})
		return () => {
			cancelled = true
		}
	}, [])

	useEffect(() => {
		localStorage.setItem('storyhouse_saved_stories', JSON.stringify(savedStories))
	}, [savedStories])

	useEffect(() => {
		if (
			currentPath !== '/discover' ||
			!autoRotate ||
			featuredStories.length < 2 ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			return undefined
		}

		const timeoutId = window.setTimeout(() => {
			const nextStory =
				featuredStories[(featuredStoryIndex + 1) % featuredStories.length]
			setFeaturedStoryId(nextStory.id)
		}, 7000)
		return () => window.clearTimeout(timeoutId)
	}, [currentPath, featuredStoryIndex, autoRotate, featuredStories])

	useEffect(() => {
		if (currentPath === '/admin') {
			window.location.replace(isAdmin ? '/admin/dashboard' : '/admin/login')
		}
	}, [currentPath, isAdmin])

	function setFeaturedStory(story) {
		setFeaturedStoryId(story.id)
	}

	function moveFeaturedStory(direction) {
		const nextIndex =
			(featuredStoryIndex + direction + featuredStories.length) %
			featuredStories.length
		setFeaturedStory(featuredStories[nextIndex])
	}

	function selectStory(story) {
		localStorage.setItem('storyhouse_active_story', story.id)
		window.location.href = `/series?story=${encodeURIComponent(story.id)}`
	}

	function toggleSavedStory(storyId) {
		setSavedStories((saved) =>
			saved.includes(storyId)
				? saved.filter((id) => id !== storyId)
				: [...saved, storyId],
		)
	}

	function startReading(episode) {
		const selected = {
			...episode,
			storyId: activeStory.id,
			storyTitle: activeStory.title,
		}
		sessionStorage.setItem('storyhouse_reader_episode', JSON.stringify(selected))
		localStorage.setItem('storyhouse_active_story', activeStory.id)
		setSelectedEpisode(selected)
		window.location.href = '/reader'
	}

	const handleStoriesChanged = useCallback((nextStories) => {
		setStories(nextStories)
		try {
			saveStories(nextStories)
		} catch (error) {
			console.error('Unable to update the local story cache.', error)
			setCatalogError('Stories are saved in the database, but the local cache could not be updated.')
		}
	}, [])

	if (currentPath === '/admin/login') {
		return <AdminLogin />
	}

	if (currentPath === '/admin/dashboard') {
		return 		<AdminDashboard onStoriesChanged={handleStoriesChanged} />
	}

	if (currentPath === '/admin') {
		return null
	}

	return (
		<>
		<div className="app-shell">
			<Header
				mobileMenuOpen={mobileMenuOpen}
				setMobileMenuOpen={setMobileMenuOpen}
				search={search}
				setSearch={setSearch}
				savedStories={savedStories}
				currentPath={currentPath}
			/>
			{catalogError && (
				<p className="catalog-error" role="alert">
					{catalogError}
				</p>
			)}
			{currentPath === '/discover' ? (
				<Home
					activeStory={activeStory}
					featuredStory={featuredStory}
					isFeaturedSaved={isFeaturedSaved}
					toggleFeaturedSaved={() => toggleSavedStory(featuredStory.id)}
					onExploreFeaturedStory={() =>
						localStorage.setItem('storyhouse_active_story', featuredStory.id)
					}
					selectStory={selectStory}
					visibleStories={visibleStories}
					search={search}
					stories={featuredStories}
					activeStoryIndex={featuredStoryIndex}
					onMoveFeaturedStory={moveFeaturedStory}
					onSelectFeaturedStory={setFeaturedStory}
					autoRotate={autoRotate}
					setAutoRotate={setAutoRotate}
				/>
			) : currentPath === '/series' ? (
				<Story
					activeStory={activeStory}
					episodeCount={episodeCount}
					setActiveSeason={setActiveSeason}
					currentSeason={currentSeason}
					toggleSaved={() => toggleSavedStory(activeStory.id)}
					isSaved={isSaved}
					startReading={startReading}
				/>
			) : currentPath === '/library' ? (
				<Library
					savedStories={savedStories}
					stories={stories}
					onRemoveStory={toggleSavedStory}
				/>
			) : currentPath === '/about' ? (
				<About />
			) : currentPath === '/contact' ? (
				<Contact />
			) : currentPath === '/reader' ? (
				<ReaderPage
					selectedEpisode={selectedEpisode}
					story={stories.find((story) => story.id === selectedEpisode?.storyId)}
				/>
			) : (
				<main className="standalone-page not-found-page">
					<div className="standalone-page-inner">
						<p className="section-overline">PAGE NOT FOUND</p>
						<h1>This story hasn't been <em>written yet.</em></h1>
						<a className="button button-primary" href="/discover">
							Discover stories
						</a>
					</div>
				</main>
			)}
			<Footer />
		</div>
		<WhatsAppSupport />
		</>
	)
}

export default App
