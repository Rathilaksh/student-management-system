# Coaching Institute Management System

A production-style MERN stack admin dashboard for a coaching institute handling Classes 7 to 10 foundation and 11 to 12 JEE, NEET, and MHTCET batches.

## Features

- Secure admin login using JWT in an HTTP-only cookie
- Protected dashboard routes with automatic redirect to login
- Enrollee CRUD operations with validation and duplicate email prevention
- Search, filter, sort, and paginate the enrollment list
- Dashboard cards for total enrollments, programs, batches, and recent admissions
- Responsive SaaS-style UI with sidebar navigation and top navbar
- Toast notifications, loading states, and delete confirmation modal

## Tech Stack

- Frontend: React, Vite, React Router DOM, Axios, Tailwind CSS, React Icons, react-hot-toast
- Backend: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs

## Default Admin

- Email: admin@example.com
- Password: Admin@123

## Folder Structure

```text
student-management-system/
├── client/
└── server/
```

## Setup

1. Install dependencies from the project root:

```bash
npm install
```

2. Configure the backend environment:

Copy `server/.env.example` to `server/.env` and update the MongoDB Atlas connection string and JWT secret.

For deployment, copy `.env.production.example` to `.env.production` or use the root `.env.example` as a template for your production environment.

3. Configure the frontend environment:

Copy `client/.env.example` to `client/.env` if you need to change the API URL.

4. Start both apps in development mode:

```bash
npm run dev
```

The client runs on `http://localhost:5173` and the server runs on `http://localhost:5000` by default.

## Deployment

This app is production-ready as a single Express service that serves the built React client.

1. Set `NODE_ENV=production` on the server.
2. Provide `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL`.
3. Build the client:

```bash
npm run build
```

4. Start the server:

```bash
npm start
```

Or run the helper script:

```bash
bash deploy.sh
```

Or use the Makefile:

```bash
make deploy
```

To remove build and install artifacts:

```bash
make clean
```

To clean and reinstall everything:

```bash
make reset
```

Or use the shorthand:

```bash
make refresh
```

In production, the frontend uses the same-origin `/api` base URL by default.

### Docker

Run the full stack with Docker Compose:

```bash
docker compose up --build
```

- App: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

Update `JWT_SECRET` before using this in a real deployment.

### Render

Use the included `render.yaml` for a single web service deployment.

1. Connect the repo to Render.
2. Add `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` as secret env vars.
3. Deploy with the build and start commands from `render.yaml`.

Render serves the app through the Node server, so the client uses the same-origin `/api` path.

### Railway

Use the included `railway.toml` for a one-service deployment.

1. Connect the repo to Railway.
2. Add these environment variables in Railway Service > Settings > Variables:
   - `JWT_SECRET=<secure-random-string>` — required
   - `MONGO_URI=<mongodb-atlas-connection-string>` — required
   - `NODE_ENV=production` — required
   - `PORT=5000` — optional, Railway will provide a port if not set
   - `CLIENT_URL=https://your-app-domain.com` — required in production when the frontend and API are served from a hosted URL; this must match your Railway app URL exactly
   - `JWT_EXPIRES_IN=7d` — optional
   - `COOKIE_NAME=sms_token` — optional
3. Railway will use `npm start` for the server and the root `build` script to build the client.

Railway healthchecks use `GET /health`.

Set `CLIENT_URL` to your Railway public domain after the service is created.

## Useful Scripts

- `npm run dev` - run client and server together
- `npm run dev:client` - run only the frontend
- `npm run dev:server` - run only the backend
- `npm run build` - build the frontend for production
- `npm run start` - start the backend in production mode

## API Routes

### Authentication

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Enrollments

- `GET /api/students`
- `GET /api/students/:id`
- `GET /api/students/stats`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

## Production Notes

- JWT is stored in an HTTP-only cookie instead of localStorage.
- CORS is restricted to the configured frontend origin.
- Student email values are normalized and checked for duplicates.
- Backend middleware centralizes authorization and error handling.

## CI / CD and Testing

This repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on pushes and PRs to `main`.

What the workflow does:
- Installs dependencies (`npm ci`)
- Runs client tests (`npm run -w client test`)
- Builds the client (`npm run build`)
- Uploads the client build artifact
- Deploys to Railway automatically when the run is for the `main` branch

Required GitHub secrets for automatic deploys:
- `RAILWAY_TOKEN` — Railway API token (create from your Railway account)
- `RAILWAY_PROJECT_ID` — Railway project id

Local testing commands:

```bash
# Run client tests
npm run -w client test

# Run full build locally
npm run build
npm start
```