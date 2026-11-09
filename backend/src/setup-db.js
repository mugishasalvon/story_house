import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'

const schemaPath = fileURLToPath(new URL('../database/schema.sql', import.meta.url))
const connection = await mysql.createConnection({
	host: process.env.MYSQL_HOST || 'localhost',
	port: Number(process.env.MYSQL_PORT || 3306),
	user: process.env.MYSQL_USER || 'root',
	password: process.env.MYSQL_PASSWORD || '',
	multipleStatements: true,
})

try {
	const schema = await readFile(schemaPath, 'utf8')
	await connection.query(schema)
	await connection.query('ALTER TABLE story MODIFY image MEDIUMTEXT NOT NULL')
	console.log('Database story_house and its tables are ready.')
} finally {
	await connection.end()
}
