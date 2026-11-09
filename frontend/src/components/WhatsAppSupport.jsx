import WhatsAppIcon from './WhatsAppIcon'

function WhatsAppSupport() {
	return (
		<a
			className="whatsapp-support"
			href="https://wa.me/25079234825"
			target="_blank"
			rel="noreferrer"
			aria-label="Contact Storyhouse support on WhatsApp (opens in a new tab)"
			title="Chat with us on WhatsApp"
		>
			<WhatsAppIcon size={28} />
			<span>24/7 Support</span>
		</a>
	)
}

export default WhatsAppSupport
