import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const prompt = createInterface({ input: stdin, output: stdout })
const username = (await prompt.question('Admin username: ')).trim()
const email = (await prompt.question('Admin email: ')).trim().toLowerCase()
const password = await prompt.question('Admin password (minimum 12 characters): ')
prompt.close()

if (!/^[a-zA-Z0-9._-]{3,80}$/.test(username)) {
	throw new Error('Username must be 3-80 characters using letters, numbers, ".", "_" or "-".')
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
	throw new Error('Enter a valid email address.')
}
if (password.length < 12) {
	throw new Error('Admin password must be at least 12 characters.')
}

const passwordHash = await bcrypt.hash(password, 12)
const pool = mysql.createPool({
	host: process.env.MYSQL_HOST || 'localhost',
	port: Number(process.env.MYSQL_PORT || 3306),
	user: process.env.MYSQL_USER || 'root',
	password: process.env.MYSQL_PASSWORD || '',
	database: process.env.MYSQL_DATABASE || 'story_house',
})

try {
	await pool.execute(
		'INSERT INTO admin (username, email, password_hash) VALUES (?, ?, ?)',
		[username, email, passwordHash],
	)
	console.log(`Admin account ${username} created.`)
} finally {
	await pool.end()
}
