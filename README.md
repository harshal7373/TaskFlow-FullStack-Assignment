# TaskFlow — Task & Team Management Platform

A responsive full-stack technical assessment project built with **React + Vite**, **Redux Toolkit**, **React Router**, **Axios**, **Tailwind CSS**, **Node.js**, **Express**, **Mongoose** and **MongoDB Atlas**.

> **Deployment status:** Source code is supplied and ready to configure. This ZIP has **not** been deployed to Vercel, Render, or MongoDB Atlas. Live URLs, real screenshots and working cloud credentials must be added **after** deployment.

## Features

- Registration and login, bcrypt-hashed passwords, JWT, protected routes and logout
- Remember Me (localStorage for checked; sessionStorage for unchecked)
- Responsive layout: sidebar, navbar, cards and status-based progress charts
- Tasks: create, read, update, delete, description, priority, due date, status, assigned user
- Search by title, status/priority filters, date sorting and pagination
- Team member directory; task ownership visibility (admins see all; users see tasks assigned to or created by them)
- Dark mode, toast notifications, pagination and charts (four bonus items)
- Loading and error states, validation, Mongoose references, custom React hook, memo, useCallback/useMemo/useEffect/useState, lazy-loaded pages and Suspense
- Basic API tests (`npm test`)

## Prerequisites

- Node.js 20+ and npm
- MongoDB Atlas cluster and database user (grant database access)
- Network access from the backend to MongoDB Atlas

## Run locally

1. Clone or extract this repository.
2. Create a MongoDB Atlas cluster, a database user, and a connection URI. Configure network access appropriately. **Avoid leaving 0.0.0.0/0 permanently exposed.**
3. Backend:

   ```bash
   cd server
   cp .env.example .env     # On Windows PowerShell: Copy-Item .env.example .env
   npm install
   npm run dev
   ```

4. Set `MONGODB_URI`, `JWT_SECRET` (strong, random, 32+ characters) and `CLIENT_URL` in `server/.env`. Set `PORT=5000` unless needed otherwise.
5. In a new terminal, frontend:

   ```bash
   cd client
   cp .env.example .env     # On Windows PowerShell: Copy-Item .env.example .env
   npm install
   npm run dev
   ```

6. Visit **http://localhost:5173**. Register a new account and create tasks.
7. Optional pre-seeded evaluator accounts, after configuring `.env`:

   ```bash
   cd server
   npm run seed
   ```

   The seed script uses `SEED_*` values in `server/.env`. Do not expose real environment variables in Git. If you keep the sample passwords on a public deployment, change them after assessment.

## Demo credentials (only after running seed)

| Role | Email | Password |
|---|---|---|
| User | testuser@example.com | Test@1234 |
| Admin | admin@example.com | Admin@1234 |

**These accounts do not exist until `npm run seed` succeeds against your own MongoDB database.** Use your own credentials for final submission if you change them.

## Deployment

**MongoDB Atlas**
1. Create a cluster and database user and obtain connection string. Allow your backend deployment's outbound database connection under Atlas Network Access.
2. Save the URI as `MONGODB_URI` on Render. Never put the URI in the client variables.

**Render backend**
1. Push repository to GitHub.
2. Create Render Web Service, choose repository. Root directory: `server`.
3. Build command: `npm install` (or `npm ci` if the lockfile is committed). Start: `npm start`.
4. Environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (actual Vercel origin). `PORT` is assigned automatically by Render when appropriate.
5. Confirm `https://YOUR-RENDER-SERVICE.onrender.com/api/health` returns `{"status":"ok"}`.
6. Run seed with a controlled one-off job or from a secure local terminal pointing to the Atlas URI.

**Vercel frontend**
1. Import same GitHub repo into Vercel. Set root directory to `client`.
2. Framework: Vite. Build: `npm run build`. Output: `dist`.
3. Add `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api`.
4. Deploy; redeploy after updating environment values. `vercel.json` supports deep-link routes.
5. Update Render's `CLIENT_URL` to the precise deployed Vercel URL. If multiple frontends are needed, comma-separate exact origins.

### Live URLs (fill in after deployment)

- Frontend (Vercel): **NOT DEPLOYED**
- Backend (Render): **NOT DEPLOYED**
- Backend health endpoint: **NOT DEPLOYED**
- GitHub repository: **NOT PUBLISHED**

## API reference

**Base URL** `http://localhost:5000/api` (Render URL in production). Request/response are JSON. Every endpoint except `/register`, `/login`, `/health` requires `Authorization: Bearer <JWT>`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Register user; body `{ "name":"Alex", "email":"alex@example.com", "password":"Secure@123" }` |
| POST | `/login` | Login; body `{ "email":"alex@example.com", "password":"Secure@123" }` |
| GET | `/me` | Current user (extra endpoint) |
| GET | `/users` | Users available for assignment (extra endpoint) |
| GET | `/tasks` | Task list; optional query params `search`, `status`, `priority`, `sort`, `page`, `limit` |
| GET | `/tasks/:id` | Task details |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task fields |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/health` | Health check |

**Task create JSON example:**

```json
{
  "title": "Finalize landing page",
  "description": "Review the UI and approve components",
  "priority": "High",
  "dueDate": "2026-11-30",
  "status": "In Progress",
  "assignedUser": "REPLACE_WITH_VALID_USER_OBJECT_ID"
}
```

**Allowed values:** priority `Low`, `Medium`, `High`; status `Pending`, `In Progress`, `Completed`. Invalid fields/dates and malformed IDs return `400`; missing/invalid token returns `401`; nonexistent or inaccessible resources return `404`; duplicate email returns `409`; unexpected failures return `500`. Some system/network errors may occur outside the API.

**Auth success response:** `{"token":"<jwt>","user":{"_id":"...","name":"...","email":"...","role":"user"}}`.

**Task list response:** `{"tasks":[],"total":0,"page":1,"pages":0,"metrics":{"total":0,"pending":0,"inProgress":0,"completed":0}}`.

**Error response:** `{"message":"Explanation"}`.

**Visibility:** users see tasks assigned to them or created by them; admins see all tasks. Any authenticated user can create a task and assign an existing member. The task API does not support role-restricted task modification beyond this visibility rule.

**Security note:** Remember Me persists the JWT in browser storage; this is adequate to demonstrate the assessment flow, not an ideal production-grade session model. Production apps should consider secure HttpOnly cookies, CSRF strategy, token refresh/rotation, stricter authorization, and a shorter token lifetime.

## Folder layout

```text
client/
  src/
    components/    Layout, route protection, task modal, memoized table
    pages/         Login/Register, Dashboard, Tasks, Team
    hooks/         useTasks custom hook
    services/      Axios client and error handling
    utils/         Session persistence
    store/         Redux Toolkit auth slice
server/
  config/          Database connection
  controllers/     Authentication and task controller logic
  middleware/      JWT protection and error handling
  models/          User and Task schemas
  routes/          Express API routes
  scripts/         Evaluator account seeding
  tests/           Basic API tests
postman/           Importable Postman collection
screenshots/       Capture actual running deployment screenshots here
```

## Checks

```bash
cd server && npm test
cd client && npm run build
```

For manual API testing, import `postman/TaskFlow.postman_collection.json`, set `baseUrl`, register/log in, copy JWT automatically from the login response, run `/users` to find an `assignedUser` ID, then CRUD tasks.

## Screenshots

After starting the application, capture screenshots for: Login, Registration, Dashboard, Task List, Task Create/Edit, Team Members, Mobile View, Dark Mode. Save PNG/JPG files in `screenshots/`. No screenshots of a running application are included in this package.

## Original assessment checklist

- [x] Required frontend/backend project source and database models
- [x] Registration/login, JWT, protected navigation, logout, Remember Me
- [x] Dashboard and task CRUD/search/filter/sort
- [x] React hooks, Redux, lazy-loading, Suspense, validation, error states
- [x] Four bonus feature implementations
- [x] README, API documentation, Postman collection
- [ ] Tested live against an Atlas database
- [ ] Github repository URL
- [ ] Vercel + Render live deployment URLs
- [ ] Captured screenshots of the running deployment
- [ ] Confirmed working live evaluator accounts
