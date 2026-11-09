import Icon from '../components/Icon'

function Home({
	activeStory,
	featuredStory,
	isFeaturedSaved,
	toggleFeaturedSaved,
	onExploreFeaturedStory,
	selectStory,
	visibleStories,
	search,
	stories,
	activeStoryIndex,
	onMoveFeaturedStory,
	onSelectFeaturedStory,
	autoRotate,
	setAutoRotate,
}) {
	return (
		<>
			<section
				className="featured-hero"
				style={{
					'--hero-image': `url("${featuredStory.image}")`,
					'--story-accent': featuredStory.accent,
				}}
				aria-label="Featured story"
				aria-roledescription="carousel"
			>
				<div className="hero-shade" />
				<div className="hero-content">
					<div className="eyebrow">
						<span className="eyebrow-line" />{' '}
						{featuredStory.isNew ? 'NEW STORY' : "EDITOR'S PICK"}{' '}
						<span className="eyebrow-dot">·</span> {featuredStory.year}
					</div>
					<p className="hero-kicker">A STORYHOUSE ORIGINAL</p>
					<h1>{featuredStory.title}</h1>
					<div className="hero-meta">
						<span className="rating-star">★</span> {featuredStory.rating}{' '}
						<span className="meta-divider">|</span> {featuredStory.genre}{' '}
						<span className="meta-divider">|</span>{' '}
						{featuredStory.seasons.reduce(
							(total, season) => total + season.episodes.length,
							0,
						)}{' '}
						episodes
					</div>
					<p className="hero-description">{featuredStory.description}</p>
					<div className="hero-actions">
						<a
							className="button button-primary"
							href={`/series?story=${encodeURIComponent(featuredStory.id)}`}
							onClick={onExploreFeaturedStory}
						>
							<Icon name="play" size={18} /> Explore series
						</a>
						<button
							className={
								isFeaturedSaved
									? 'button button-outline is-saved'
									: 'button button-outline'
							}
							onClick={toggleFeaturedSaved}
						>
							<Icon name="bookmark" size={18} />{' '}
							{isFeaturedSaved ? 'In your library' : 'Save story'}
						</button>
					</div>
					<div className="hero-caption">
						<span className="caption-dot" /> A new chapter is waiting
					</div>
				</div>
				<div className="hero-controls" aria-label="Featured story controls">
					<span className="hero-index">
						{String(activeStoryIndex + 1).padStart(2, '0')} /{' '}
						{String(stories.length).padStart(2, '0')}
					</span>
					<button
						className="hero-control-button"
						type="button"
						onClick={() => setAutoRotate(!autoRotate)}
						aria-label={autoRotate ? 'Pause story rotation' : 'Resume story rotation'}
					>
						<Icon name={autoRotate ? 'pause' : 'play'} size={15} />
					</button>
					<button
						className="hero-control-button hero-previous"
						type="button"
						onClick={() => onMoveFeaturedStory(-1)}
						aria-label="Previous featured story"
					>
						<Icon name="arrow" size={16} />
					</button>
					<button
						className="hero-control-button"
						type="button"
						onClick={() => onMoveFeaturedStory(1)}
						aria-label="Next featured story"
					>
						<Icon name="arrow" size={16} />
					</button>
					<div className="hero-dots" role="group" aria-label="Choose featured story">
						{stories.map((story, index) => (
							<button
								key={story.id}
								className={index === activeStoryIndex ? 'hero-dot active' : 'hero-dot'}
								type="button"
								onClick={() => onSelectFeaturedStory(story)}
								aria-label={`Show ${story.title}`}
								aria-pressed={index === activeStoryIndex}
							/>
						))}
					</div>
				</div>
				<div className="hero-scroll">
					SCROLL TO DISCOVER <span>↓</span>
				</div>
			</section>

			<section
				className="story-shelf content-width"
				id="stories"
			>
				<div className="section-heading">
					<div>
						<p className="section-overline">A WORLD OF STORIES</p>
						<h2>
							Find your next <em>favorite.</em>
						</h2>
					</div>
					<a
						className="text-link"
						href="/series"
					>
						Browse all stories <Icon name="arrow" size={17} />
					</a>
				</div>
				<div className="story-grid">
					{visibleStories.map((story, index) => (
						<button
							key={story.id}
							className={
								story.id === activeStory.id
									? 'story-card selected'
									: 'story-card'
							}
							onClick={() => selectStory(story)}
							style={{ '--card-accent': story.accent }}
						>
							<span
								className="story-card-image"
								style={{
									backgroundImage: `url("${story.image}")`,
								}}
							>
								<span className="card-number">
									{String(index + 1).padStart(2, '0')}
								</span>
								<span className="card-rating">★ {story.rating}</span>
								<span className="card-play">
									<Icon name="play" size={19} />
								</span>
							</span>
							<span className="story-card-info">
								<span>
									<strong>{story.title}</strong>
									<small>{story.genre}</small>
								</span>
							</span>
						</button>
					))}
					{visibleStories.length === 0 && (
						<p className="empty-state">
							No stories match "{search}". Try another title or genre.
						</p>
					)}
				</div>
			</section>

		</>
	)
}

export default Home