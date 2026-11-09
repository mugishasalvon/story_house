import Icon from '../components/Icon'

function Library({ savedStories, stories, onRemoveStory }) {
	const saved = stories.filter((story) => savedStories.includes(story.id))

	return (
		<main className="standalone-page library-page">
			<div className="standalone-page-inner">
				<p className="section-overline">KEEP YOUR PLACE</p>
				<h1>
					Your library, <em>your pace.</em>
				</h1>
				<p className="standalone-intro">
					Stories you save will be waiting here whenever you are.
				</p>
				{saved.length ? (
					<div className="library-grid">
						{saved.map((story) => (
							<article className="library-card" key={story.id}>
								<a
									className="library-card-image"
									href={`/series?story=${encodeURIComponent(story.id)}`}
									style={{ backgroundImage: `url("${story.image}")` }}
									aria-label={`Open ${story.title}`}
								/>
								<div className="library-card-content">
									<div>
										<h2>{story.title}</h2>
										<p>{story.genre}</p>
									</div>
									<div className="library-card-actions">
										<a
											className="button button-primary"
											href={`/series?story=${encodeURIComponent(story.id)}`}
										>
											Explore series <Icon name="arrow" size={16} />
										</a>
										<button
											className="library-remove"
											type="button"
											onClick={() => onRemoveStory(story.id)}
											aria-label={`Remove ${story.title} from your library`}
										>
											<Icon name="close" size={17} />
										</button>
									</div>
								</div>
							</article>
						))}
					</div>
				) : (
					<div className="library-empty">
						<span className="library-empty-icon">
							<Icon name="bookmark" size={24} />
						</span>
						<h2>Your next favorite is waiting.</h2>
						<p>Save a story and it will appear here.</p>
						<a className="button button-primary" href="/discover">
							Discover stories <Icon name="arrow" size={16} />
						</a>
					</div>
				)}
			</div>
		</main>
	)
}

export default Library
