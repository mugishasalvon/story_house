import Icon from '../components/Icon'

function ReaderPage({ selectedEpisode, story }) {
    if (!selectedEpisode) {
        return (
            <main className="reader-page reader-page-empty">
                <h1>Episode not found</h1>
                <p>Go back to the series and choose an episode to read.</p>
                <a className="button button-primary" href="/series">Back to series</a>
            </main>
        )
    }

    const content = selectedEpisode.content
    const paragraphs = Array.isArray(content)
        ? content
        : typeof content === 'string'
            ? content.split(/\n\s*\n/).filter(Boolean)
            : []

    const seriesHref = `/series?story=${encodeURIComponent(selectedEpisode.storyId)}`

    return (
        <main className="reader-page">
            <header
                className="reader-hero"
                style={story?.image ? { '--reader-image': `url("${story.image}")` } : undefined}
            >
                <div className="reader-hero-content">
                    <p className="reader-hero-story">{selectedEpisode.storyTitle}</p>
                    <h1>{selectedEpisode.title}</h1>
                    {selectedEpisode.summary && (
                        <p className="reader-hero-description">
                            {selectedEpisode.summary}
                        </p>
                    )}
                    {selectedEpisode.duration && (
                        <span className="reader-hero-duration">
                            {selectedEpisode.duration} read
                        </span>
                    )}
                </div>
            </header>
            <article className="reader-article">
                <a className="reader-back-link" href={seriesHref}>
                    <Icon name="arrow" size={16} /> Back to {selectedEpisode.storyTitle}
                </a>

                <div className="reader-rule" />

                {paragraphs.length > 0 ? (
                    paragraphs.map((paragraph, index) => (
                        <p className="reader-text" key={`${index}-${paragraph.slice(0, 20)}`}>
                            {paragraph}
                        </p>
                    ))
                ) : (
                    <p className="reader-text">The full episode is coming soon.</p>
                )}

                <button
                    className="button button-primary reader-next"
                    type="button"
                    onClick={() => {
                        sessionStorage.removeItem('storyhouse_reader_episode')
                        window.location.href = seriesHref
                    }}
                >
                    Back to series <Icon name="arrow" size={17} />
                </button>
            </article>
        </main>
    )
}

export default ReaderPage