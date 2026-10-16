# SLBF Player Registration

Web platform for registering players, approving registrations and payments, managing club changes, and publishing news posts.

| | |
|---|---|
| **Frontend** | React 18 + Vite + TypeScript, Tailwind CSS / shadcn-ui — `playerregistration/` |
| **Backend** | Node.js + Express 5 + TypeScript, Prisma ORM — `player-reg-backend-sql/` |
| **Database** | MySQL 8 (Aiven in production) |
| **File storage** | Cloudinary (images and PDFs) |
| **Hosting** | Frontend on Vercel, backend on Render |

## Features

- **Players:** sign up (with ID documents), sign in with email or NIC, view profile and registration status, submit the registration payment slip, request open/close club changes, edit contact details.
- **Online payment:** verified players pay the Rs. 1,000 registration fee through **PayHere**; the payment is approved automatically and registration is set for one year.
- **Admins:** approve or reject players, payments and club changes; SLBF ID assignment; registration period (1 year); manage posts; edit home page settings; create admin accounts; view all players; activity logs.
- **Uploads:** PNG, JPEG and PDF only. Images are compressed in the browser to under 2 MB before upload; PDFs must be under 2 MB.
- **Activity logs:** every important action (logins, sign-ups, approvals, posts, settings…) is recorded; logs older than 1 month are deleted automatically.

## Repository layout

```
player-reg/
├── player-reg-backend-sql/     Express API
│   ├── prisma/schema.prisma    Database schema
│   ├── prisma/migrations/      SQL migrations (applied with `prisma migrate deploy`)
│   └── src/
│       ├── server.ts           Entry point (loads .env, starts log retention)
│       ├── app.ts              Express app, CORS, routes, JSON error handler
│       ├── routes/             URL → controller mapping
│       ├── controllers/        Request handlers
│       ├── middleware/         Auth (JWT), rate limits, upload rules
│       └── lib/                Prisma client, env checks, activity logging
├── playerregistration/         React frontend
│   └── src/
│       ├── pages/              One file per screen
│       ├── api/                fetch wrappers for the backend
│       ├── contexts/           Auth + global settings
│       ├── hooks/              useSubmitLock (prevents double submits)
│       └── utils/              Image compression, upload validation
└── docs/                       Project documentation
```

## Quick start (local development)

**Requirements:** Node.js 20+ (24 tested), a MySQL 8 database (local XAMPP/MariaDB 10.4 also works), a Cloudinary account.

```bash
# 1. Backend
cd player-reg-backend-sql
npm install
# create .env — see "Environment variables" below
npx prisma generate           # required: npm 11 blocks Prisma's install script
npx prisma migrate deploy     # creates the tables
npm run dev                   # http://localhost:5000

# 2. Frontend (second terminal)
cd playerregistration
npm install
echo VITE_API_URL=http://localhost:5000/api > .env
npm run dev                   # http://localhost:8080
```

Create the first admin account with the snippet in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md#create-the-first-admin) — public sign-up only creates players.

## Environment variables

**Backend** (`player-reg-backend-sql/.env`, and Render → Environment):

| Variable | Required | Example / notes |
|---|---|---|
| `DATABASE_URL` | yes | `mysql://user:pass@host:port/db?sslaccept=accept_invalid_certs` — for Aiven use `sslaccept`, **not** `ssl-mode=REQUIRED` (Prisma ignores it and connects unencrypted) |
| `JWT_SECRET` | yes | Long random string. The server refuses to start without it |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | yes | From the Cloudinary dashboard |
| `CLOUDINARY_FOLDER` | no | Default `player-reg/uploads` |
| `PORT` | no | Default `5000`; Render sets it automatically |
| `CORS_ORIGINS` | no | Extra allowed frontend URLs, comma-separated |
| `PAYHERE_MERCHANT_ID` / `PAYHERE_MERCHANT_SECRET` | for online payment | From PayHere → Settings → Domains & Credentials (the secret is per domain) |
| `PAYHERE_SANDBOX` | no | `true` (default) uses sandbox.payhere.lk; set `false` for live payments |
| `BACKEND_PUBLIC_URL` | for online payment | Public API base, e.g. `https://player-reg.onrender.com` — PayHere calls `<this>/api/payhere/notify` |
| `FRONTEND_URL` | for online payment | e.g. `https://player-reg.vercel.app` — players return to `/payment/return` |

**Frontend** (`playerregistration/.env`, and Vercel → Settings → Environment Variables):

| Variable | Required | Example / notes |
|---|---|---|
| `VITE_API_URL` | yes | `https://player-reg.onrender.com/api` — must end in `/api`, no trailing slash. Baked in at build time: redeploy after changing it |
| `VITE_IMG_URL` | no | Only for legacy locally-stored images |

## Scripts

| Where | Command | What it does |
|---|---|---|
| backend | `npm run dev` | Dev server with auto-reload |
| backend | `npm run build` / `npm start` | Compile to `dist/` / run compiled server |
| backend | `npx prisma studio` | Visual database browser at http://localhost:5555 |
| frontend | `npm run dev` | Dev server on port 8080 |
| frontend | `npm run build` | Production build to `dist/` |
| frontend | `npm run lint` | ESLint |

## Documentation

- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Aiven, Render, Vercel, Cloudinary setup, migrations, troubleshooting
- [docs/API.md](docs/API.md) — every endpoint with who may call it
- [docs/USER_GUIDE.md](docs/USER_GUIDE.md) — player and admin walkthroughs
- [docs/QA_REPORT.md](docs/QA_REPORT.md) — pre-release QA results and open issues
- [docs/MANUAL_TEST_CHECKLIST.md](docs/MANUAL_TEST_CHECKLIST.md) — 10-minute check on a real iPhone/Mac before each release
