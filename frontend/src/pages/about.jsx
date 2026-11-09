import Icon from '../components/Icon'

function About() {
	return (
		<main className="contact-page about-page">
			<div className="contact-page-inner">
				<a className="contact-back-link" href="/discover">
					<Icon name="arrow" size={16} /> Back to stories
				</a>
				<div className="contact-content-grid">
					<section className="contact-copy">
						<p className="section-overline">OUR STORY</p>
						<h1>
							Stories worth <em>getting lost in.</em>
						</h1>
						<p className="contact-intro">
							Storyhouse is a home for imaginative series, memorable characters,
							and new chapters to look forward to. Find a story, settle in, and
							read at your own pace.
						</p>
					</section>
					<div className="about-page-note">
						<p className="contact-card-label">A HOME FOR EVERY KIND OF READER</p>
						<p>
							Discover original stories, follow each new chapter, and keep the
							series you love close at hand. We believe a good story should be
							easy to find and yours to enjoy at your own pace.
						</p>
						<a className="button button-primary" href="/discover">
							Find your next story
						</a>
					</div>
				</div>
			</div>
		</main>
	)
}

export default About