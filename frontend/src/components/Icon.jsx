function Icon({ name, size = 20 }) {
	const common = {
		width: size,
		height: size,
		viewBox: '0 0 24 24',
		fill: 'none',
		stroke: 'currentColor',
		strokeWidth: 1.8,
		strokeLinecap: 'round',
		strokeLinejoin: 'round',
		'aria-hidden': true,
	}
	if (name === 'search')
		return (
			<svg {...common}>
				<circle cx="11" cy="11" r="7" />
				<path d="m20 20-4-4" />
			</svg>
		)
	if (name === 'bookmark')
		return (
			<svg {...common}>
				<path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4z" />
			</svg>
		)
	if (name === 'play')
		return (
			<svg {...common}>
				<path d="m9 6 10 6-10 6z" fill="currentColor" stroke="none" />
			</svg>
		)
	if (name === 'pause')
		return (
			<svg {...common}>
				<path d="M8 5h3v14H8zM15 5h3v14h-3z" fill="currentColor" stroke="none" />
			</svg>
		)
	if (name === 'arrow')
		return (
			<svg {...common}>
				<path d="M5 12h14M13 6l6 6-6 6" />
			</svg>
		)
	if (name === 'chevron')
		return (
			<svg {...common}>
				<path d="m7 10 5 5 5-5" />
			</svg>
		)
	if (name === 'menu')
		return (
			<svg {...common}>
				<path d="M4 7h16M4 12h16M4 17h16" />
			</svg>
		)
	if (name === 'close')
		return (
			<svg {...common}>
				<path d="m6 6 12 12M18 6 6 18" />
			</svg>
		)
	return (
		<svg {...common}>
			<path d="M12 3v18M3 12h18" />
		</svg>
	)
}

export default Icon