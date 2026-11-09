import 'dotenv/config'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import express from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import pool from './db.js'
import { deleteStory, listStories, saveStory } from './story-repository.js'

const app = express()
const port = Number(process.env.PORT || 3000)
const uploadDirectory = fileURLToPath(new URL('../uploads/', import.meta.url))
const coverTypes = new Map([
	['image/jpeg', '.jpg'],
	['image/png', '.png'],
	['image/webp', '.webp'],
	['image/gif', '.gif'],
])

mkdirSync(uploadDirectory, { recursive: true })

const coverUpload = multer({
	storage: multer.diskStorage({
		destination: uploadDirectory,
		filename: (_request, file, callback) => {
			callback(null, `${randomUUID()}${coverTypes.get(file.mimetype)}`)
		},
	}),
	limits: { files: 1, fileSize: 2 * 1024 * 1024 },
	fileFilter: (_request, file, callback) => {
		if (!coverTypes.has(file.mimetype)) {
			callback(new TypeError('Choose a JPG, PNG, WebP, or GIF cover image.'))
			return
		}
		callback(null, true)
	},
})

app.use(
	cors({
		origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
	}),
)
app.use(express.json({ limit: '4mb' }))
app.use(
	'/uploads',
	express.static(uploadDirectory, {
		dotfiles: 'deny',
		index: false,
		maxAge: '1d',
	}),
)

function requireAdmin(request, response, next) {
	const authorization = request.get('authorization') || ''
	const token = authorization.startsWith('Bearer ')
		? authorization.slice(7)
		: ''
	const jwtSecret = process.env.JWT_SECRET

	if (!jwtSecret || jwtSecret.length < 32) {
		response.status(503).json({ error: 'Admin authentication is not configured.' })
		return
	}
	if (!token) {
		response.status(401).json({ error: 'Admin sign-in is required.' })
		return
	}

	try {
		request.admin = jwt.verify(token, jwtSecret)
		next()
	} catch {
		response.status(401).json({ error: 'Admin session is invalid or expired.' })
	}
}

app.get('/api/stories', async (_request, response, next) => {
	try {
		response.json(await listStories())
	} catch (error) {
		next(error)
	}
})

app.post('/api/admin/login', async (request, response, next) => {
	const { username, password } = request.body ?? {}
	if (
		typeof username !== 'string' ||
		typeof password !== 'string' ||
		!username.trim() ||
		!password
	) {
		response.status(400).json({ error: 'Username and password are required.' })
		return
	}
	const jwtSecret = process.env.JWT_SECRET
	if (!jwtSecret || jwtSecret.length < 32) {
		response.status(503).json({ error: 'Admin authentication is not configured.' })
		return
	}

	try {
		const [admins] = await pool.execute(
			'SELECT id, username, email, password_hash FROM admin WHERE username = ? OR email = ? LIMIT 1',
			[username.trim(), username.trim().toLowerCase()],
		)
		const admin = admins[0]
		if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
			response.status(401).json({ error: 'Invalid username or password.' })
			return
		}

		const token = jwt.sign(
			{ sub: String(admin.id), username: admin.username },
			jwtSecret,
			{ expiresIn: '8h' },
		)
		response.json({
			token,
			admin: { username: admin.username, email: admin.email },
		})
	} catch (error) {
		next(error)
	}
})

app.get('/api/admin/stories', requireAdmin, async (_request, response, next) => {
	try {
		response.json(await listStories())
	} catch (error) {
		next(error)
	}
})

app.post('/api/admin/uploads/covers', requireAdmin, (request, response, next) => {
	coverUpload.single('cover')(request, response, (error) => {
		if (error) {
			next(error)
			return
		}
		if (!request.file) {
			response.status(400).json({ error: 'Choose a cover image to upload.' })
			return
		}
		response.status(201).json({ url: `/uploads/${request.file.filename}` })
	})
})

app.put('/api/admin/stories/:id', requireAdmin, async (request, response, next) => {
	if (request.params.id !== request.body?.id) {
		response.status(400).json({ error: 'Story ID in the URL and body must match.' })
		return
	}

	try {
		await saveStory(request.body)
		response.json({ message: 'Story saved.' })
	} catch (error) {
		if (error instanceof TypeError) {
			response.status(400).json({ error: error.message })
			return
		}
		next(error)
	}
})

app.delete('/api/admin/stories/:id', requireAdmin, async (request, response, next) => {
	try {
		const deleted = await deleteStory(request.params.id)
		if (!deleted) {
			response.status(404).json({ error: 'Story not found.' })
			return
		}
		response.status(204).end()
	} catch (error) {
		next(error)
	}
})

app.get('/api/health', async (_request, response) => {
	try {
		await pool.query('SELECT 1')
		response.json({ status: 'ok', database: 'connected' })
	} catch (error) {
		console.error('Database health check failed:', error.message)
		response.status(503).json({
			status: 'error',
			database: 'unavailable',
		})
	}
})

app.use((_request, response) => {
	response.status(404).json({ error: 'Route not found' })
})

app.use((error, _request, response, _next) => {
	console.error('API request failed:', error)
	if (error instanceof multer.MulterError) {
		const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400
		response.status(status).json({
			error:
				status === 413
					? 'Cover images must be 2 MB or smaller.'
					: 'The cover upload could not be processed.',
		})
		return
	}
	if (error instanceof TypeError) {
		response.status(400).json({ error: error.message })
		return
	}
	if (error?.type === 'entity.too.large') {
		response.status(413).json({ error: 'The request is too large.' })
		return
	}
	response.status(500).json({ error: 'The request could not be completed.' })
})

const server = app.listen(port, () => {
	console.log(`Storyhouse API listening on port ${port}`)
})

function shutdown(signal) {
	console.log(`${signal} received; closing API server`)
	server.close((serverError) => {
		if (serverError) {
			console.error('Failed to close API server:', serverError)
			process.exitCode = 1
		}

		pool
			.end()
			.then(() => {
				if (serverError) process.exit(1)
				process.exit(0)
			})
			.catch((databaseError) => {
				console.error('Failed to close MySQL pool:', databaseError)
				process.exit(1)
			})
	})
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
