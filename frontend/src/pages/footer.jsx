import WhatsAppIcon from '../components/WhatsAppIcon'

const socialLinks = [
	{ name: 'Instagram', href: 'https://www.instagram.com/' },
	{ name: 'TikTok', href: 'https://www.tiktok.com/' },
	{ name: 'YouTube', href: 'https://www.youtube.com/' },
	{ name: 'Facebook', href: 'https://www.facebook.com/' },
	{
		name: 'WhatsApp',
		href: 'https://wa.me/25079234825',
		label: 'Chat with Storyhouse support on WhatsApp (opens in a new tab)',
	},
]
const currentYear = new Date().getFullYear()

function SocialIcon({ name }) {
	const iconProps = {
		viewBox: '0 0 24 24',
		width: 18,
		height: 18,
		fill: 'currentColor',
		'aria-hidden': true,
		focusable: 'false',
	}

	if (name === 'Instagram') {
		return (
			<svg {...iconProps}>
				<rect
					x="3.25"
					y="3.25"
					width="17.5"
					height="17.5"
					rx="5"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
				/>
				<circle
					cx="12"
					cy="12"
					r="4"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
				/>
				<circle cx="17.7" cy="6.5" r="1.1" />
			</svg>
		)
	}

	if (name === 'TikTok') {
		return (
			<svg {...iconProps}>
				<path d="M15.5 3h3.1c.2 1.8 1.3 3.2 3.4 3.8v3.3a9 9 0 0 1-3.4-1.2v6.2a6.1 6.1 0 1 1-6.1-6.1c.4 0 .8 0 1.2.1v3.5a2.8 2.8 0 1 0 1.8 2.6V3Z" />
			</svg>
		)
	}

	if (name === 'YouTube') {
		return (
			<svg {...iconProps}>
				<path d="M23 7.1a3 3 0 0 0-2.1-2.2C19 4.4 12 4.4 12 4.4s-7 0-8.9.5A3 3 0 0 0 1 7.1a31 31 0 0 0-.5 4.9 31 31 0 0 0 .5 4.9 3 3 0 0 0 2.1 2.2c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.2 31 31 0 0 0 .5-4.9 31 31 0 0 0-.5-4.9ZM10 15.8V8.2l6.5 3.8-6.5 3.8Z" />
			</svg>
		)
	}

	if (name === 'WhatsApp') {
		return <WhatsAppIcon size={18} />
	}

	return (
		<svg {...iconProps}>
			<path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z" />
		</svg>
	)
}

function Footer() {
	return (
		<footer className="site-footer">
			<div className="footer-main content-width">
				<div className="footer-about">
					<a className="brand footer-brand" href="/discover">
						<span className="brand-mark">S</span>
						<span>
							STORY<span className="brand-light">HOUSE</span>
						</span>
					</a>
					<h2>Good stories stay with you.</h2>
					<p>
						Storyhouse is a home for imaginative series, memorable characters,
						and new chapters to look forward to. Find a story, settle in, and
						read at your own pace.
					</p>
				</div>

				<nav className="footer-nav" aria-label="Footer navigation">
					<h3>Explore</h3>
					<a href="/discover">Discover stories</a>
					<a href="/series">Series</a>
					<a href="/library">My library</a>
				</nav>

				<nav className="footer-nav" aria-label="Company information">
					<h3>Company</h3>
					<a href="/about">About Storyhouse</a>
					<a href="/contact">Contact</a>
					<a href="/admin/login">SmartLogin</a>
				</nav>

				<div className="footer-social">
					<h3>Follow the story</h3>
					<p>New chapters, reading lists, and a little inspiration.</p>
					<div className="social-links">
						{socialLinks.map(({ name, href, label }) => (
							<a
								key={name}
								className={`social-link social-link-${name.toLowerCase()}`}
								href={href}
								target="_blank"
								rel="noreferrer"
								aria-label={label || `Storyhouse on ${name} (opens in a new tab)`}
								title={name}
							>
								<SocialIcon name={name} />
							</a>
						))}
					</div>
				</div>
			</div>

			<div className="footer-bottom content-width">
				<span>© {currentYear} Storyhouse. All rights reserved.</span>
			</div>
		</footer>
	)
}

export default Footer