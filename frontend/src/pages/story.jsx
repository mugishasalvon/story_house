import Icon from '../components/Icon'

function Story({
	activeStory,
	episodeCount,
	setActiveSeason,
	currentSeason,
	toggleSaved,
	isSaved,
	startReading,
}) {
	return (
		<section
			className="series-section"
			id="story-detail"
		>
			<div className="content-width">
				<div className="section-heading series-heading">
					<div>
						<p className="section-overline">YOUR NEXT CHAPTER</p>
						<h2>
							Inside the <em>series.</em>
						</h2>
					</div>
					<div className="season-control">
						<span>SEASON</span>
						<div
							className="season-tabs"
							role="tablist"
							aria-label="Choose a season"
						>
							{activeStory.seasons.map((season) => (
								<button
									key={season.number}
									role="tab"
									aria-selected={
										season.number === currentSeason.number
									}
									className={
										season.number === currentSeason.number
											? 'season-tab active'
											: 'season-tab'
									}
									onClick={() => setActiveSeason(season.number)}
								>
									0{season.number}
								</button>
							))}
						</div>
						<span className="season-name">{currentSeason.title}</span>
					</div>
				</div>
				<div className="series-layout">
					<aside className="series-aside">
						<span className="aside-label">NOW READING</span>
						<div
							className="aside-art"
							style={{
								backgroundImage: `url("${activeStory.image}")`,
								'--story-accent': activeStory.accent,
							}}
						>
							<span className="art-stamp">SH<br />ORIGINAL</span>
						</div>
						<h3>{activeStory.title}</h3>
						<p>{activeStory.description}</p>
						<div className="aside-stats">
							<span>
								<strong>{activeStory.seasons.length}</strong> SEASONS
							</span>
							<span>
								<strong>
									{episodeCount}
								</strong>{' '}
								EPISODES
							</span>
						</div>
						<button
							className="aside-save"
							onClick={toggleSaved}
						>
							<Icon name="bookmark" size={17} />{' '}
							{isSaved ? 'Saved to your library' : 'Add to my library'}
						</button>
					</aside>
					<div className="episode-panel">
						<div className="episode-panel-head">
							<div>
								<span className="aside-label">
									SEASON {String(currentSeason.number).padStart(2, '0')}
								</span>
								<h3>{currentSeason.title}</h3>
							</div>
							<span className="episode-total">
								{String(currentSeason.episodes.length).padStart(2, '0')}{' '}
								EPISODES
							</span>
						</div>
						<div className="episode-list">
							{currentSeason.episodes.map((episode, index) => (
								<button
									className="episode-row"
									type="button"
									key={`${currentSeason.number}-${episode.title}`}
									onClick={() => startReading(episode)}
								>
									<span className="episode-index">
										{String(index + 1).padStart(2, '0')}
									</span>
									<div
										className="episode-thumb"
										style={
											{
												backgroundImage: `url(https://images.unsplash.com/${episode.image}?auto=format&fit=crop&w=300&q=75)`,
											}
										}
									>
										<span>
											<Icon name="play" size={17} />
										</span>
									</div>
									<div className="episode-copy">
										<h4>{episode.title}</h4>
										<p>{episode.summary}</p>
										<span className="episode-duration">
											EPISODE {String(index + 1).padStart(2, '0')}{' '}
											<i /> {episode.duration} read
										</span>
									</div>
								</button>
							))}
						</div>
						<div className="episode-footer">
							<span>
								<span className="caption-dot" /> New episodes every Thursday
							</span>
							<a href="/discover">
								Explore another series <Icon name="arrow" size={16} />
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Story