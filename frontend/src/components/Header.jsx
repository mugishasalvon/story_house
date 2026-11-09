import { useEffect, useRef } from 'react'
import Icon from './Icon'

function Header({
	mobileMenuOpen,
	setMobileMenuOpen,
	search,
	setSearch,
	savedStories,
	currentPath,
}) {
	const searchInputRef = useRef(null)

	useEffect(() => {
		function focusSearch(event) {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault()
				searchInputRef.current?.focus()
			}
		}

		window.addEventListener('keydown', focusSearch)
		return () => window.removeEventListener('keydown', focusSearch)
	}, [])

	return (
		<header className="site-header">
			<a className="brand" href="/discover" aria-label="Storyhouse home">
				<span className="brand-mark">S</span>
				<span>
					STORY<span className="brand-light">HOUSE</span>
				</span>
			</a>
			<button
				className="mobile-menu-toggle"
				type="button"
				onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
				aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
				aria-expanded={mobileMenuOpen}
			>
				<Icon name={mobileMenuOpen ? 'close' : 'menu'} />
			</button>
			<nav
				className={mobileMenuOpen ? 'main-nav is-open' : 'main-nav'}
				aria-label="Main navigation"
			>
				<a
					className={currentPath === '/discover' ? 'nav-link active' : 'nav-link'}
					href="/discover"
					onClick={() => setMobileMenuOpen(false)}
				>
					Discover
				</a>
				<a
					className={currentPath === '/series' ? 'nav-link active' : 'nav-link'}
					href="/series"
					onClick={() => setMobileMenuOpen(false)}
				>
					Series
				</a>
				<a
					className={currentPath === '/library' ? 'nav-link active' : 'nav-link'}
					href="/library"
					onClick={() => setMobileMenuOpen(false)}
				>
					My library{' '}
					<span className="library-count">{savedStories.length}</span>
				</a>
				<a
					className={currentPath === '/about' ? 'nav-link active' : 'nav-link'}
					href="/about"
					onClick={() => setMobileMenuOpen(false)}
				>
					About
				</a>
				<a
					className={currentPath === '/contact' ? 'nav-link active' : 'nav-link'}
					href="/contact"
					onClick={() => setMobileMenuOpen(false)}
				>
					Contact
				</a>
			</nav>
			<label className="search-box">
				<Icon name="search" size={18} />
				<input
					ref={searchInputRef}
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder="Find your next story"
					aria-label="Search stories"
				/>
				<kbd>Ctrl/⌘ K</kbd>
			</label>
			<span className="avatar-button" aria-hidden="true">
				A
			</span>
		</header>
	)
}

export default Header