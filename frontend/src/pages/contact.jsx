import Icon from '../components/Icon'

const WHATSAPP_NUMBER = '25079234825'

function Contact() {
	function sendMessage(event) {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const message = [
			`Hello, my name is ${formData.get('name')}.`,
			formData.get('email')
				? `My email is ${formData.get('email')}.`
				: '',
			'',
			formData.get('message'),
		]
			.filter(Boolean)
			.join('\n')
		const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
		window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
	}

	return (
		<main className="contact-page">
			<div className="contact-page-inner">
				<a className="contact-back-link" href="/discover">
					<Icon name="arrow" size={16} /> Back to stories
				</a>
				<div className="contact-content-grid">
					<section className="contact-copy">
						<p className="section-overline">GET IN TOUCH</p>
						<h1>
							We'd love to <em>hear from you.</em>
						</h1>
						<p className="contact-intro">
							Have a question, suggestion, or story idea? The Storyhouse team
							would love to hear from you.
						</p>
					</section>
					<div className="contact-page-card">
						<span className="contact-card-label">MESSAGE US ON WHATSAPP</span>
						<p>
							Complete the form and we’ll open WhatsApp with your message ready
							to send to +250 792 34825.
						</p>
						<form className="contact-form" onSubmit={sendMessage}>
							<label htmlFor="contact-name">Your name</label>
							<input
								id="contact-name"
								name="name"
								type="text"
								autoComplete="name"
								required
							/>

							<label htmlFor="contact-email">Email (optional)</label>
							<input
								id="contact-email"
								name="email"
								type="email"
								autoComplete="email"
							/>

							<label htmlFor="contact-message">Your message</label>
							<textarea
								id="contact-message"
								name="message"
								rows="5"
								required
							/>

							<button className="contact-submit" type="submit">
								Continue to WhatsApp <Icon name="arrow" size={17} />
							</button>
						</form>
					</div>
				</div>
			</div>
		</main>
	)
}

export default Contact