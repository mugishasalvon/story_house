const stories = [
	{
		id: 'lightkeeper',
		title: 'The Last Lightkeeper',
		genre: 'Fantasy · Mystery',
		year: '2025',
		rating: '4.9',
		image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1800&q=85',
		accent: '#e5b675',
		description:
			'At the edge of a restless sea, one lighthouse still shines. When its keeper disappears, Mara finds a journal that should not exist—and a light that knows her name.',
		seasons: [
			{
				number: 1,
				title: 'The Drowned Coast',
				episodes: [
					{
						title: 'A Light in the Fog',
						duration: '12 min',
						summary:
							'Mara returns to Greyhaven after receiving a key from a stranger. The lighthouse has been dark for years, but tonight, someone lights it.',
						image: 'photo-1500530855697-b586d89ba3ee',
					},
					{
						title: 'The Keeper’s Key',
						duration: '9 min',
						summary:
							'A brass key opens the old keeper’s quarters—and a diary filled with entries written in Mara’s own handwriting.',
						image: 'photo-1518837695005-2083093ee35b',
					},
					{
						title: 'Saltwater Names',
						duration: '11 min',
						summary:
							'The tide gives up a name from the past. Mara follows it into the village, where no one wants to remember.',
						image: 'photo-1473116763249-2ffaa81b3d5a',
					},
					{
						title: 'Below the Beacon',
						duration: '14 min',
						summary:
							'A hidden staircase leads beneath the lighthouse, where the sea seems to breathe against the stone.',
						image: 'photo-1519046904884-53103b34b206',
					},
				],
			},
			{
				number: 2,
				title: 'The Quiet Tide',
				episodes: [
					{
						title: 'The Bell at Low Tide',
						duration: '10 min',
						summary:
							'A bell rings from the reef at low tide, guiding Mara toward a ship that vanished before she was born.',
						image: 'photo-1500375592092-40eb2168fd21',
					},
					{
						title: 'A Map of Stars',
						duration: '13 min',
						summary:
							'An old chart points away from the coast and toward a constellation missing from every atlas.',
						image: 'photo-1475274047050-1d0c0975c63e',
					},
					{
						title: 'The Night Watch',
						duration: '12 min',
						summary:
							'Mara keeps watch through the longest night of the year. Something answers from the dark.',
						image: 'photo-1518837695005-2083093ee35b',
					},
					{
						title: 'When the Sea Remembers',
						duration: '16 min',
						summary:
							'The lighthouse reveals why it chose Mara—and what it has been protecting the village from.',
						image: 'photo-1500530855697-b586d89ba3ee',
					},
				],
			},
		],
	},
	{
		id: 'paper-moons',
		title: 'Paper Moons',
		genre: 'Romance · Contemporary',
		year: '2024',
		rating: '4.8',
		image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=85',
		accent: '#e6a18b',
		description:
			'Two night-shift strangers leave notes for each other in a tiny all-night bookshop. By the time they meet, they have already changed each other’s lives.',
		seasons: [
			{
				number: 1,
				title: 'After Hours',
				episodes: [
					{
						title: 'The Note in the Poetry Shelf',
						duration: '8 min',
						summary:
							'A folded note tucked inside a book begins an unexpected conversation.',
						image: 'photo-1470252649378-9c29740c9fa8',
					},
					{
						title: 'Coffee at 2:17',
						duration: '10 min',
						summary:
							'A familiar handwriting appears beside the coffee machine, with a question only one person can answer.',
						image: 'photo-1495474472287-4d71bcdd2085',
					},
					{
						title: 'Almost Morning',
						duration: '9 min',
						summary:
							'Their shifts overlap for the first time, but the words come easier on paper.',
						image: 'photo-1445116572660-236099ec97a0',
					},
				],
			},
		],
	},
	{
		id: 'wild-atlas',
		title: 'The Wild Atlas',
		genre: 'Adventure · Sci-fi',
		year: '2025',
		rating: '4.7',
		image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85',
		accent: '#a3c6a4',
		description:
			'A cartographer charts the last unmarked places on Earth, discovering that the map is changing faster than the world around her.',
		seasons: [
			{
				number: 1,
				title: 'Uncharted',
				episodes: [
					{
						title: 'The Blank Place',
						duration: '11 min',
						summary:
							'A new valley appears on an old map, hundreds of miles from where it should be.',
						image: 'photo-1464822759023-fed622ff2c3b',
					},
					{
						title: 'North of the Wind',
						duration: '12 min',
						summary:
							'A field expedition finds a forest that does not appear in satellite images.',
						image: 'photo-1448375240586-882707db888b',
					},
					{
						title: 'The Compass Garden',
						duration: '10 min',
						summary:
							'Every compass in camp points toward a garden that should not exist.',
						image: 'photo-1470770841072-f978cf4d019e',
					},
				],
			},
		],
	},
	{
		id: 'midnight-garden',
		title: 'The Midnight Garden',
		genre: 'Fantasy · Family',
		year: '2026',
		rating: '4.8',
		isNew: true,
		image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1800&q=85',
		accent: '#d1a5bd',
		description:
			'Every night, a locked garden blooms in a different season. A curious new caretaker discovers the flowers are growing memories—and one belongs to her.',
		seasons: [
			{
				number: 1,
				title: 'Seeds of Wonder',
				episodes: [
					{
						title: 'The Gate at Midnight',
						duration: '10 min',
						summary:
							'June finds a silver key and a garden gate that appears only after the clock strikes twelve.',
						image: 'photo-1490750967868-88aa4486c946',
					},
					{
						title: 'A Winter Rose',
						duration: '12 min',
						summary:
							'A flower blooming in the snow holds a memory June thought her family had forgotten.',
						image: 'photo-1470252649378-9c29740c9fa8',
					},
				],
			},
		],
	},
	{
		id: 'last-train',
		title: 'The Last Train Home',
		genre: 'Mystery · Drama',
		year: '2026',
		rating: '4.9',
		isNew: true,
		image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1800&q=85',
		accent: '#d8b27d',
		description:
			'On the final train of the night, a conductor finds a ticket for a stop that vanished from every map. Each passenger remembers it differently.',
		seasons: [
			{
				number: 1,
				title: 'The Unlisted Stop',
				episodes: [
					{
						title: 'Platform Zero',
						duration: '11 min',
						summary:
							'A destination appears on the night schedule, though no one remembers adding it.',
						image: 'photo-1474487548417-781cb71495f3',
					},
					{
						title: 'The Empty Carriage',
						duration: '9 min',
						summary:
							'An empty carriage arrives crowded with fresh footprints and a suitcase with no owner.',
						image: 'photo-1519681393784-d120267933ba',
					},
				],
			},
		],
	},
	{
		id: 'blue-hour',
		title: 'Blue Hour Café',
		genre: 'Contemporary · Romance',
		year: '2026',
		rating: '4.7',
		isNew: true,
		image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1800&q=85',
		accent: '#9cb9c9',
		description:
			'A quiet café opens for one hour before sunrise. Its regulars arrive carrying secrets, and leave with unexpected reasons to see tomorrow.',
		seasons: [
			{
				number: 1,
				title: 'Before the City Wakes',
				episodes: [
					{
						title: 'One Cup, Two Names',
						duration: '8 min',
						summary:
							'A barista discovers that two regulars have been leaving notes on the same coffee sleeve.',
						image: 'photo-1495474472287-4d71bcdd2085',
					},
					{
						title: 'The Seat by the Window',
						duration: '10 min',
						summary:
							'A familiar seat stays empty for the first time, prompting the café to come together.',
						image: 'photo-1445116572660-236099ec97a0',
					},
				],
			},
		],
	},
	{
		id: 'small-planets',
		title: 'A Map of Small Planets',
		genre: 'Sci-fi · Adventure',
		year: '2026',
		rating: '4.8',
		isNew: true,
		image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=85',
		accent: '#9eb9d6',
		description:
			'A young mechanic inherits a tiny delivery ship and a route to the smallest inhabited worlds. Her first package is addressed to someone she lost.',
		seasons: [
			{
				number: 1,
				title: 'The Long Way Around',
				episodes: [
					{
						title: 'A Parcel for Tomorrow',
						duration: '12 min',
						summary:
							'The ship’s first delivery carries a message dated ten years in the future.',
						image: 'photo-1451187580459-43490279c0fa',
					},
					{
						title: 'The Blue Moon Stop',
						duration: '11 min',
						summary:
							'A detour to a moon-sized village turns a routine delivery into a rescue.',
						image: 'photo-1462331940025-496dfbfc7564',
					},
				],
			},
		],
	},
	{
		id: 'house-of-tides',
		title: 'The House of Tides',
		genre: 'Mystery · Historical',
		year: '2026',
		rating: '4.9',
		isNew: true,
		image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1800&q=85',
		accent: '#a4c0bb',
		description:
			'An old seaside house appears only at the lowest tide. When twins step inside, they find letters from people who have not been born yet.',
		seasons: [
			{
				number: 1,
				title: 'When the Water Recedes',
				episodes: [
					{
						title: 'The House on the Sand',
						duration: '10 min',
						summary:
							'The twins race the incoming tide to explore a house that was not there yesterday.',
						image: 'photo-1500375592092-40eb2168fd21',
					},
					{
						title: 'Letters in the Wall',
						duration: '13 min',
						summary:
							'A hidden bundle of letters predicts a storm and names one of the twins.',
						image: 'photo-1518837695005-2083093ee35b',
					},
				],
			},
		],
	},
]

export default stories
