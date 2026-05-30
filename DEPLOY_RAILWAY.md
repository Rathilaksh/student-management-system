Railway deployment instructions
=============================

This document explains how to deploy the app to Railway using MongoDB Atlas as the database. The repo already contains a `railway.toml` manifest that tells Railway how to start the service.

1) Create a MongoDB Atlas cluster
  - Sign in to https://cloud.mongodb.com and create a free cluster (or use an existing cluster).
  - Create a database user and note the connection string (URI). It will look like:

    mongodb+srv://<username>:<password>@<cluster-url>/student_management_system?retryWrites=true&w=majority

  - Allow access from anywhere (0.0.0.0/0) or configure VPC peering / private endpoints for production.

2) Create a Railway project
  - Go to https://railway.app and create a new project, connect your GitHub repository.
  - Railway will detect the `railway.toml` manifest; if it does not, create a new Web Service and set the build/start commands manually:
    - Build command: `npm install && npm run build`
    - Start command: `npm start`

3) Set environment variables in Railway (Service > Settings > Variables)
  - `JWT_SECRET` (secret) — a long random string used to sign JWT tokens (keep secret)
  - `MONGO_URI` (secret) — the MongoDB Atlas connection string from step 1
  - `NODE_ENV` — set to `production`
  - `PORT` — optional (default 5000). Railway provides a port automatically if not set.
  - `CLIENT_URL` — the public URL Railways provides for the service (set after first deploy) or your custom domain
  - `JWT_EXPIRES_IN` — optional (default `7d`)
  - `COOKIE_NAME` — optional (default `sms_token`)

4) Deploy
  - Push to `main` (or create a deployment from the Railway UI). Railway will run the build and start commands.
  - After the service is live, set `CLIENT_URL` to the public Railway domain for the service.

Notes
-----
- The app is configured to serve the built frontend from the server in production (`server.js` will serve files from `client/dist`).
- Do NOT set `NODE_ENV=development` in Railway — ensure `NODE_ENV=production`.
- For stronger security, configure Atlas to only accept connections from Railway IPs or set up a private network.

CI / GitHub Actions
-------------------
The repository contains a GitHub Actions workflow at `.github/workflows/ci.yml` that runs on every push to `main` and on PRs. It runs `npm test` and builds the client. If you want to run additional server-side tests, add them and update the `test` script in `package.json`.

CI/CD and GitHub Secrets
------------------------
To enable automatic deploys from GitHub Actions to Railway you must add the following repository secrets (Repository Settings → Secrets):

- `RAILWAY_TOKEN` — a Railway API token with deploy permissions. Create it from your Railway account API keys.
- `RAILWAY_PROJECT_ID` — the Railway project id (use the project settings in Railway)

Optional (only if you target a specific service within the project):
- `RAILWAY_SERVICE_ID` — the service id inside the Railway project.

The workflow supplied in `.github/workflows/ci.yml` will:

1. Install dependencies (`npm ci`)
2. Run client tests (`npm run -w client test`)
3. Build the client (`npm run build`)
4. Upload `client/dist` as an artifact
5. Install the Railway CLI and deploy to Railway when the branch is `main` using `RAILWAY_TOKEN` and `RAILWAY_PROJECT_ID`.

Add the secrets and push to `main` to trigger the automated deployment.
