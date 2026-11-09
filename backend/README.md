# Storyhouse backend

Express API backed by MySQL. Stories, seasons, and episodes are stored in the
`story_house` database. Admin credentials are stored as bcrypt password hashes.

## Setup

1. Install Node.js and MySQL.
2. Copy `.env.example` to `.env`, set the MySQL credentials, and set `JWT_SECRET`
   to a unique random value of at least 32 characters. Generate one with
   `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`.
3. Run `npm install`.
4. Run `npm run db:setup` to create the `story_house` database and tables.
5. Run `npm run admin:create` to create the first administrator interactively.
6. Run `npm run stories:seed` to import the current frontend story catalog. This
   command refuses to run when the `story` table already contains records.
7. Start the server with `npm run dev` or `npm start`.

When updating an existing database, rerun `npm run db:setup` to apply the
cover-image column migration. Admins can upload a JPG, PNG, WebP, or GIF cover
image up to 2 MB. Image files are stored in `backend/uploads/` and served from
`/uploads/`; the story table stores only the image URL, avoiding MySQL packet
size limits. Keep the uploads directory on persistent storage when deploying.

The API listens on port `3000` by default. Set `VITE_API_URL` in the frontend
environment if the backend is hosted elsewhere (default:
`http://localhost:3000/api`).

## API

- `GET /api/health` checks database connectivity.
- `GET /api/stories` asynchronously returns story records with nested
  seasons and episodes.
- `POST /api/admin/login` accepts a username or email and password; it returns
  an eight-hour bearer token.
- `GET /api/admin/stories` lists all stories for the dashboard.
- `POST /api/admin/uploads/covers` uploads a cover image and returns its URL.
- `PUT /api/admin/stories/:id` creates or updates a story and its nested seasons
  and episodes in a transaction.
- `DELETE /api/admin/stories/:id` deletes a story and cascades to its seasons
  and episodes.

All admin routes other than login require a valid admin bearer token.
