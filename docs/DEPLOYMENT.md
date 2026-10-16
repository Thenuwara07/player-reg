# Deployment guide

Production setup: **Aiven** (MySQL) → **Render** (backend API) → **Vercel** (frontend), with **Cloudinary** for uploaded files. All four have free tiers.

```
Browser ──► Vercel (React app) ──► Render (Express API) ──► Aiven (MySQL)
                                          └──────────────► Cloudinary (images/PDFs)
```

## 1. Database — Aiven MySQL

1. Create a **MySQL** service on [console.aiven.io](https://console.aiven.io) (free plan).
2. Copy the **Service URI**. It ends with `?ssl-mode=REQUIRED` — **replace that** with `?sslaccept=accept_invalid_certs`:
   ```
   mysql://avnadmin:<password>@<host>:<port>/defaultdb?sslaccept=accept_invalid_certs
   ```
   Prisma ignores `ssl-mode`, so the original URI connects **without encryption**.
   For full certificate verification, download the service CA certificate to `prisma/ca.pem` and use `?sslcert=ca.pem&sslaccept=strict`.
3. Create the tables from your machine (with `DATABASE_URL` in `player-reg-backend-sql/.env`):
   ```bash
   cd player-reg-backend-sql
   npx prisma migrate deploy
   ```
   The Render start command also runs this on every deploy, so new migrations are applied automatically.

> Free Aiven services are **powered off after a period of inactivity**. If the API suddenly reports "Can't reach database server" or the hostname no longer resolves, power the service on again in the Aiven console.

### Create the first admin

Public sign-up only creates players. Create the first admin directly in the database (run from `player-reg-backend-sql`, with `.env` pointing at the target database):

```bash
node -e "
require('dotenv').config();
const {PrismaClient}=require('@prisma/client'); const bcrypt=require('bcryptjs'); const crypto=require('crypto');
const p=new PrismaClient();
(async()=>{
  const password=crypto.randomBytes(12).toString('base64url');
  await p.user.create({data:{email:'admin@example.com',password:await bcrypt.hash(password,10),fullName:'System Administrator',
    firstName:'System',lastName:'Admin',contact:'0000000000',dateofBirth:new Date('1990-01-01'),gender:'Male',district:'Colombo',
    role:'admin',status:'active'}});
  console.log('admin@example.com /', password);
})().finally(()=>p.\$disconnect());"
```

Further admins can then be created from the dashboard (**Admin accounts** card); date of birth and gender are required, NIC is optional.

### Browsing the database

- `npx prisma studio` → http://localhost:5555 (uses `DATABASE_URL` from `.env`)
- MySQL Shell: `mysqlsh --sql --user avnadmin --host <host> --port <port> --database defaultdb --ssl-mode=REQUIRED`
  (XAMPP's `mysql.exe` cannot connect: MariaDB's client lacks MySQL 8's `caching_sha2_password` plugin)

## 2. Backend — Render

Render → **New Web Service** → connect the GitHub repo.

| Setting | Value |
|---|---|
| Branch | `main` |
| Root Directory | `player-reg-backend-sql` |
| Build Command | `npm install && npx prisma generate && npm run build` |
| Start Command | `npx prisma migrate deploy && npm start` |

`npx prisma generate` must be in the build command: npm 11 blocks Prisma's install script, and without it the server crashes with `@prisma/client did not initialize yet`.

**Environment** tab: add `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER` (see the README). Do **not** set `PORT`.

Check: `https://<service>.onrender.com/` → *"Welcome to the Players Registration API"*.

> The free plan sleeps after ~15 minutes without traffic; the first request afterwards takes **30–50 seconds** (measured: 41.7 s). Activity-log cleanup runs at every startup and every 12 hours while awake.

## 3. Frontend — Vercel

Vercel → **New Project** → import the repo.

| Setting | Value |
|---|---|
| Root Directory | `playerregistration` |
| Framework preset | Vite |
| Environment variable | `VITE_API_URL=https://<service>.onrender.com/api` |

`vercel.json` already rewrites all paths to `index.html`, so deep links like `/signin` work. Changing `VITE_API_URL` requires a **redeploy** — Vite embeds it at build time.

## 4. CORS (connecting the two)

The backend only accepts browser requests from the origins listed in `player-reg-backend-sql/src/app.ts` (currently `https://player-reg.vercel.app`, `https://playerregistration-five.vercel.app` and localhost). To allow another domain without a code change, set `CORS_ORIGINS` on Render, e.g. `https://my-domain.com,https://www.my-domain.com`.

## 5. Cloudinary

Create an account, copy the cloud name / API key / secret into the backend environment. Uploaded files go to `CLOUDINARY_FOLDER`. PDF previews use Cloudinary's PDF→JPG conversion; the "Open PDF" link needs **Settings → Security → Allow delivery of PDF and ZIP files** enabled.

## 6. PayHere (online registration payment)

Verified players pay the fixed **Rs. 1,000.00** registration fee on PayHere. The backend creates and signs each order; PayHere then calls the backend's **notify URL**, which verifies the signature and amount before approving the payment and activating the registration for one year.

1. **Sandbox account:** sign up at https://sandbox.payhere.lk. Under **Settings → Domains & Credentials** add your frontend domain (e.g. `player-reg.vercel.app`; add `localhost` too for local testing). Copy the **Merchant ID** and the **Merchant Secret** generated for that domain; the secret is specific to the domain.
2. **Render → Environment:**
   ```
   PAYHERE_MERCHANT_ID=<merchant id>
   PAYHERE_MERCHANT_SECRET=<merchant secret>
   PAYHERE_SANDBOX=true
   BACKEND_PUBLIC_URL=https://player-reg.onrender.com
   FRONTEND_URL=https://player-reg.vercel.app
   ```
   Until these are set, the Pay button shows "Online payment is not available right now".
3. **Notify URL must be public.** PayHere calls `BACKEND_PUBLIC_URL/api/payhere/notify` from the internet, so it **cannot reach `localhost`**. On a local machine the redirect and return pages work, but payments stay *initiated* unless the backend is exposed (e.g. with an ngrok tunnel set as `BACKEND_PUBLIC_URL`).
4. **Sandbox test cards:** use PayHere's sandbox test card numbers (from the PayHere sandbox documentation); no real money moves.
5. **Going live:** create the live merchant account, add the production domain, then set `PAYHERE_SANDBOX=false` and the **live** merchant ID and secret. Nothing else changes.

> If a free Render server is asleep, the first notify can arrive while it wakes up. PayHere retries notifications, and the return page waits up to 90 seconds before showing "Payment is being confirmed".

## Release checklist

1. Merge into `main` (Render and Vercel deploy from `main`).
2. Render: deploy shows **Live**, log shows `✅ Server is running`.
3. Vercel: deployment ready; open the site and hard-refresh.
4. Smoke test: home page loads hero + posts, sign in as admin, open Logs.
5. If the schema changed: confirm Render's log shows the migration was applied.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Build log prints npm's help text | Build command is just `npm` | Use the build command above |
| `@prisma/client did not initialize yet` | Prisma client not generated | Add `npx prisma generate` to the build |
| `secretOrPrivateKey must have a value` / server won't start | `JWT_SECRET` missing | Add it in Render → Environment |
| Browser: *"Not allowed by CORS"* (OPTIONS → 500) | Frontend origin not allowed, or Render runs an old commit | Add the origin / `CORS_ORIGINS`; check Render deployed the latest `main` commit |
| Request URL like `http://https//…` or `/auth/signin` 404 | `VITE_API_URL` typo or missing `/api` | Fix the variable, redeploy the frontend |
| Works on Chrome/Android, fails on iPhone/Mac | Frontend sends a header the API doesn't allow (Safari enforces CORS on it) | Don't add custom headers like `User-Agent`; if needed, allow them in `app.ts` |
| `The table 'User' does not exist` | New empty database | `npx prisma migrate deploy` |
| `Can't reach database server` / DNS name does not exist | Aiven service powered off | Power it on in the Aiven console |
| Login works locally but not live (or vice versa) | Local `.env` and Render point at different databases | Compare `DATABASE_URL` in both places |
