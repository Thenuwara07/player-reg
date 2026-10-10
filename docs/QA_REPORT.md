# Pre-release QA report

**Date:** 2026-10-08 · **Live site:** https://player-reg.vercel.app → https://player-reg.onrender.com
**Round 1** tested `main` @ `ee8fab9`. **Round 2 (re-test)** tested branch `fix/qa-issues` with all fixes below.

## Verdict: ready to publish once deployed and live-verified

Round 1 found 1 critical and 4 high-severity security issues. **All critical, high and medium code issues are now fixed** and verified by a full re-test: every test suite passes. What remains are accepted risks and backlog items with no user-facing impact (see *Issue status*). Final step: deploy `fix/qa-issues` and run the live-site verification.

## Re-test after fixes (round 2)

| Test type | Round 1 | Round 2 |
|---|---|---|
| API (functional, security, validation, authorization) | 80 / 97 | **108 / 108** (11 new tests verify the fixes) |
| End-to-end UI flows (Chrome) | 26 / 27 | **27 / 27**, plus 7 / 7 new fix-verification flows (profile editing, public data, phone layout…) |
| Cross-browser & responsive (Safari engine, iPhone 13, Android, Firefox, Edge × 10 pages) | 50 / 50 | **50 / 50** |
| Real Cloudinary uploads | 5 / 5 | **5 / 5** |
| Load & stress (1,000 players / 5,000 logs) | 9 / 9 | **9 / 9**, 0 errors (see *Performance* for the throughput trade-off) |
| Accessibility (WCAG 2 A/AA, public pages) | 2 pages with issues | **0 violations** |
| Frontend type check | 29 errors | **0 errors** |
| Dependency audit (production) | backend 22 (1 critical), frontend 22 (1 critical) | backend **5**, frontend **9**, **0 critical**; remaining are accepted risks (below) |
| Server log | passwords logged, double-response errors | **no passwords, no request bodies, no double responses** |

## Issue status

| ID | Issue | Status |
|---|---|---|
| C-1 | Public sign-up could create admins | ✅ Fixed: role is always `player`, status `pending` |
| H-1 | Players could act as other players | ✅ Fixed: player endpoints use the logged-in user; a `userId` in the body is ignored |
| H-2 | Personal data public | ✅ Fixed: logged-out visitors and other players get a public profile (no email, NIC, phone, birth date or ID images); the owner and admins get everything |
| H-3 | Passwords in server logs | ✅ Fixed: request bodies are never logged. **Action:** rotate passwords of any accounts created while the old version ran |
| H-4 | Vulnerable dependencies | ✅ Mostly fixed: removed unused `ngrok` and `axios`, updated packages, Prisma 6.19.3. **Accepted:** backend Prisma CLI advisories (build-time tooling) and `cloudinary` 1.x (the advisory needs attacker-controlled upload options; this app only passes fixed values, and v2 is blocked by `multer-storage-cloudinary`). Frontend Tailwind toolchain (build-time only) and React Router 6 (the advisories need user-controlled redirect targets or SSR; neither is used; fix requires v7) |
| M-1 | Sign-up 500s, half-created accounts, double response | ✅ Fixed: validation, one transaction, clear 400 messages |
| M-2 | Password hashes in admin list | ✅ Fixed (also removed from the profile-update response) |
| M-3 | Admin form: DOB/gender, blank NIC | ✅ Fixed in the form and the API; a blank NIC is stored as no value (NULL), so any number of admins can omit it |
| M-4 | Cold start ~45 s (free Render) | ⏳ Hosting: use a paid instance or an uptime pinger (e.g. UptimeRobot every 10 min) |
| M-5 | Code health | ✅ 0 type errors; removed 3 dead files. ⏳ 44 lint findings remain (mostly `any` types; style only) |
| M-6 | Players couldn't edit their profile | ✅ Fixed: Edit Profile / Save / Cancel, pre-filled |
| M-7 | Players list size | ✅ Mitigated: gzip + slimmer public data. 1,000 players now **36 KB over the network (was 1.14 MB)**. ⏳ Server-side pagination recommended above ~5,000 players |
| L-1 | Account enumeration at sign-in | ✅ Fixed: same 401 for unknown account and wrong password |
| L-2 | 500s / internal error text on bad input | ✅ Fixed: input validation, `sortBy` whitelist, generic 500 messages |
| L-3 | `/dashboard` logged out | ✅ Redirects to sign-in |
| L-4 | Generic sign-in error | ✅ Shows "Incorrect email/NIC or password" / rate-limit message |
| L-5 | Accessibility | ✅ Dropdown labels added, contrast fixed: 0 violations |
| L-6 | Phone: floating buttons cover content | ✅ Smaller on phones; page bottom padding |
| L-7 | `/test` page, title typo, footer year | ✅ Removed / "SLBF Player Registration" / current year |
| L-8 | No security headers | ✅ helmet added; `X-Powered-By` removed |
| L-9 | NIC lookup broken | ✅ Fixed |
| L-10 | 1.8 MB banner | ✅ Served via Cloudinary `f_auto,q_auto`: **93 KB WebP** |
| L-11 | Blocked CORS → 500 | ✅ Now 403 |
| L-12 | PDF thumbnails cropped | ✅ Thumbnails show the top of the document |

## Round 3: remaining paths

Nine flows not covered before were tested through the UI and verified in the database. They found **3 more bugs, all fixed**:

| ID | Scenario | Result |
|---|---|---|
| RP-01 | Club-change cooldown after a change | 🐞→✅ **Bug fixed:** the cooldown never applied. The page read `openClubChangeDate`, but the column is `openClubChagngeDate` (schema typo), so players could change clubs again immediately |
| RP-02 | Second club-change request while one is pending | 🐞→✅ **Bug fixed:** duplicates were accepted. Now refused with "You already have a pending … request" (same rule added for payments) |
| RP-03 | First close club (SL Schools → school) + approval | ✅ |
| RP-04 | Close club change with resignation (school → Army) + approval | 🐞→✅ **Bug fixed:** impossible before. The form shows no club field for associations without clubs, but the validator demanded one (it only recognised the exact names "SL Army/Navy/Air Force/Police"). The validator now follows the form's rule: only schools, universities and mercantile need a club |
| RP-05 | Admin rejects a payment; player can resubmit | ✅ |
| RP-06 | Admin rejects a club change; club unchanged | ✅ |
| RP-07 | Expired registration → renewal → new 1-year expiry | ✅ |
| RP-08 | New home banner uploaded in Settings → optimized image on home page | ✅ |
| RP-09 | Edit an existing post | ✅ |

**Full regression after these fixes (fresh database):** API 108/108 · browser flows: Part A 13/13, Part B 13/13, Part D 7/7, Part E 9/9 · type checks 0 errors (both apps).

The detailed round-1 findings below are kept for reference.

## Round 1 results at a glance

| Test type | Tests | Passed | Failed |
|---|---:|---:|---:|
| API (functional, security, validation, authorization) | 97 | 80 | 17 |
| End-to-end UI flows (Chrome desktop) | 27 | 26 | 1 |
| Cross-browser & responsive (Safari desktop, iPhone 13, Android Pixel 7, Firefox, Edge × 10 pages) | 50 | 50 | 0 |
| Real Cloudinary uploads through the UI (photos, PDFs, rejected types) | 5 | 5 | 0 |
| Load & stress (QA environment, 1,000 players / 5,000 logs) | 9 | 9 | 0 |
| Live load check (read-only, 5 and 10 users) | 2 | 2 | 0 |
| Accessibility scan (axe-core, WCAG 2 A/AA, 7 pages) | 7 pages | 5 clean | 2 with issues |
| Static analysis (type check, lint, build, dependency audit) | 4 checks | — | see M-5, H-4 |
| Live production smoke test (read-only) | 9 checks | 9 | 0 |
| Real iPhone / Mac | manual | — | checklist: [MANUAL_TEST_CHECKLIST.md](MANUAL_TEST_CHECKLIST.md) |

## How it was tested

- **Isolated QA environment:** a separate database (`player_reg_qa` on local MySQL) seeded with associations, clubs, schools, universities, mercantile clubs, a QA admin and settings. The backend and frontend ran against it, so no test data touched production.
- **API suite** (Node.js): every endpoint called logged-out, as a player and as an admin; validation edge cases; ownership checks; uploads; rate limits; activity logs. Each result was verified directly in the database.
- **UI end-to-end** (Playwright, real browser): sign-up form, sign-in, route guards, logout; admin approves player → player pays → admin approves payment → player requests club change → admin approves; rejection, posts, settings, admin creation, logs. Uploads were intercepted so nothing went to Cloudinary.
- **Cross-browser / responsive:** 10 pages × WebKit (Safari engine) desktop, WebKit iPhone 13, Chrome Pixel 7. Checked for JS errors, failed API calls and horizontal overflow, with screenshots reviewed by hand.
- **Accessibility:** axe-core WCAG 2.0/2.1 A + AA rules.
- **Static:** `tsc`, ESLint, production builds, `npm audit` (production dependencies).
- **Live smoke test:** health, response times, CORS from the Vercel domain, admin endpoints refuse anonymous access, security headers, page load in Chrome and WebKit. Read-only.
- **Load & stress** (autocannon): the compiled production build on the QA database, filled with 1,000 players, 500 payments, 200 club changes and 5,000 log entries. Public pages at 10/50/100 concurrent users, the 200-user spike, the heaviest queries, concurrent sign-ups, and the rate limiter under load. Plus a **light read-only** run against the live backend (5 and 10 users × 20 s).
- **Real uploads:** sign-up with a real 10.4 MB photo and a PDF, a PDF payment slip, and a HEIC rejection, all going to Cloudinary, displayed in the admin dialog, then deleted.
- **More browsers:** Firefox and Microsoft Edge on the same 10 pages.

## What works (highlights)

- Sign-up via the form (with compressed image upload), sign-in by email **and** NIC, logout.
- The full registration lifecycle: verification → SLBF ID → payment → 1-year registration → club change with SLBF ID update.
- Every admin-only endpoint refuses logged-out users (401) and players (403), across all 16 tested. Player-only endpoints refuse admins.
- Tampered, expired and wrongly signed tokens are rejected. Brute-force sign-in is throttled after 10 attempts.
- The admin field-update guard blocks changing `role`, `password` or other tables.
- Uploads: GIF, HEIC and WebP are rejected; over 8 MB is rejected; errors are readable JSON.
- Activity logs record all 14 action types tested, newest first, with names. Filters work, and logs older than 1 month are purged.
- Route guards: players are sent away from `/admin`, `/settings`, `/allPlayers` and `/logs` (with a permission message).
- All 50 cross-browser/mobile page checks passed (Safari engine, iPhone, Android, Firefox, Edge), with no sideways scrolling on phones.
- Real uploads: a 10.4 MB phone photo was stored on Cloudinary as **1.30 MB**. PDFs upload, preview (page 1) and open; HEIC is blocked before upload.

## Performance and load

**QA environment** (developer PC, so an upper bound; Render's free server is much slower):

| Scenario | Users | Throughput | Median | 99th % | Errors |
|---|---:|---:|---:|---:|---:|
| Home page data (settings + posts) | 10 / 50 / 100 | ~5,300–5,500 req/s | 1–17 ms | 4–26 ms | 0 |
| Spike on public data | 200 | 5,342 req/s | 34 ms | 46 ms | 0 |
| Players page (1,000 players with clubs) | 20 | 36 req/s | 540 ms | 698 ms | 0 |
| Admin dashboard queues | 20 | 219 req/s | 88 ms | 178 ms | 0 |
| Activity logs (5,000 rows, filters) | 20 | 710 req/s | 27 ms | 41 ms | 0 |
| Concurrent sign-ups (password hashing) | 10 | 14 req/s | 696 ms | 897 ms | 0 |
| Sign-in rate limiter (200 attempts) | 20 | — | — | — | 190 of 200 correctly blocked (429) |

**Live (Render free + Aiven free), read-only:** 5 users → 7 req/s, 10 users → 15 req/s, median **~530 ms**, 99th percentile **3–3.8 s**, **0 errors**. Waking from sleep took **45 s**.

**Round 2 (after fixes):** all 9 scenarios pass with 0 errors. Throughput on the simple public endpoints is ~1,800–2,000 req/s, down from ~5,300 req/s, because of the new **security headers (helmet) and gzip compression** (an isolated benchmark shows both together cost ~40% on a trivial endpoint). Sign-ups are ~8/s (was 14/s) because user + player are now saved in one transaction. These figures are still roughly 100× the measured live capacity of the free hosting (~15 req/s), so the trade-off is worth it.

**Conclusion:** no errors or crashes at any load tested, and the server stayed up after the spike. Comfortable for a federation-sized user base (hundreds of active users). The bottlenecks are the free-plan cold start (M-4) and the unpaginated players list (M-7).

## Issues

Severity: **Critical** = exploitable now, high impact · **High** = security/data risk or broken core flow · **Medium** = real bug with a workaround · **Low** = polish.

### Critical

| ID | Issue | Evidence | Fix |
|---|---|---|---|
| C-1 | **Anyone can register as an admin.** `POST /api/auth/signup` saves `role` and `status` from the request body. | SU-07: sign-up with `role:"admin"` created an active admin | Hard-code `role: "player"`, `status: "pending"` in `signUp` |

### High

| ID | Issue | Evidence | Fix |
|---|---|---|---|
| H-1 | **Players can act as other players.** Payment slip, club change and profile update use `userId` from the request body instead of the login token. A player changed another player's **name, login email and weight**. | OW-01, OW-02, OW-03 | Use `req.user.id` and ignore `userId` in the body |
| H-2 | **Personal data is public.** `GET /api/auth/:id` and `GET /api/admin/allplayers` need no login and return NIC, phone, date of birth, email and ID-card image URLs. Anyone can loop over ids 1…N. | DX-01, DX-03 | Require login. Return the full profile only to the owner/admin, and give the public Players page name/club/SLBF ID only |
| H-3 | **Passwords are written to server logs in plain text.** `signUp` and `signUpAdmin` log the whole request body, so passwords appear in Render's logs. | Backend log during QA | Remove the `console.log(req.body)` lines, then rotate any exposed passwords |
| H-4 | **Known-vulnerable dependencies.** Production dependencies: backend 22 (1 critical, 16 high), frontend 22 (1 critical, 17 high). Includes `jws` (JWT signature check), `react-router` (open redirect/XSS), `form-data`, `axios`, `multer`, `path-to-regexp`. `ngrok` is an unused runtime dependency. | `npm audit --omit=dev` | `npm audit fix`, update `react-router-dom`/`jsonwebtoken`/`multer`, remove `ngrok`; re-test |

### Medium

| ID | Issue | Evidence | Fix |
|---|---|---|---|
| M-1 | **Sign-up API errors are 500s, and it leaves half-made accounts.** A missing profile picture, duplicate NIC, missing fields or empty height/weight return HTTP 500 with internal Prisma text. The user row is saved before the player row, leaving orphans that block re-registering. Player sign-ups also send two responses (*"Cannot set headers after they are sent"*). The form requires a profile picture, so the first case is API-only. | SU-02, 04, 05, 06, 08 | Validate first, create user + player in one transaction, map duplicates to 400, send one response |
| M-2 | `GET /api/admin/alladmins` returns admins' password hashes | DX-04 | `select` without `password` |
| M-3 | **Creating an admin fails without date of birth or gender** (form allows it; the server shows "Registration failed"). A blank NIC is saved as `""`, so only **one** admin can ever be created without an NIC. | WF-UI-11, API repro | Validate DOB/gender in the form; save an empty NIC as `null` |
| M-4 | **Cold start:** the first request after ~15 idle minutes took **41.7 s** (Render free plan); the site looks broken meanwhile | Live smoke test | Paid instance, an uptime pinger, or a "waking up…" message |
| M-5 | **Code health:** frontend has 29 TypeScript errors and 44 ESLint errors (mostly `any`); the JS bundle is 539 KB (156 KB gzipped) | Static analysis | Fix the type errors (several are real bugs, e.g. `ClubChangeHistory.tsx` references undefined variables); split the bundle by route |
| M-6 | **Players can't edit their own profile.** The Edit/Save buttons are commented out; the backend endpoint exists | Profile page | Re-enable the edit UI after fixing H-1 |
| M-7 | **The players list has no pagination.** `GET /api/admin/allplayers` returns everyone at once: 1.1 MB for 1,000 players (about 11 MB at 10,000), 540 ms server time locally, several times that on Render | Load test LD-02 | Paginate (`page`, `pageSize`) and search on the server |

### Low

| ID | Issue | Fix |
|---|---|---|
| L-1 | Sign-in says "User not found" (404) for unknown accounts but "Invalid credentials" (401) for wrong passwords, revealing which emails/NICs are registered | Same 401 message for both |
| L-2 | Bad input gives 500s with internal error text: empty sign-in body, `?sortBy=password`, non-numeric club id | Validate params; generic 500 message |
| L-3 | `/dashboard` while logged out shows a bare "User not found" instead of going to sign-in | Add a login guard |
| L-4 | Wrong password shows "An error occurred. Please try again." | Show the server's message |
| L-5 | Accessibility: 8 icon-only buttons without labels (sign-up, players) and 1 low-contrast text | Add `aria-label`s, darken the text |
| L-6 | On phones, the floating Logs/Settings buttons cover the "All players" card | Add bottom padding or hide on small screens |
| L-7 | Polish: dev page `/test` is publicly reachable; tab title typo "player-registation"; footer "© 2025" | Remove the route; fix the title; use the current year |
| L-8 | API sends no security headers and advertises `x-powered-by: Express` | Add `helmet` |
| L-9 | Looking up a player by an all-digit (new-format) NIC fails: it's treated as a user id | Separate id and NIC lookups |
| L-10 | The home banner image is 1.8 MB | Serve via Cloudinary `f_auto,q_auto` |
| L-11 | A blocked CORS origin gets HTTP 500 (logged as an error) instead of 403 | Return `callback(null, false)` |
| L-12 | PDF thumbnails in the approval dialog are cropped to the middle of the page, so documents with text at the top look blank until clicked. The first view of a new PDF can also be blank for a few seconds while Cloudinary generates the preview | Use `object-contain` / top alignment for PDF thumbnails |

## Not covered

- **Physical iPhone / Mac:** automated runs used WebKit, Safari's engine (it caught the earlier `User-Agent` bug). Real-device steps such as the camera, HEIC photos and the Files app are in [MANUAL_TEST_CHECKLIST.md](MANUAL_TEST_CHECKLIST.md).
- **Heavy load on production:** only a light read-only run (10 users), to avoid disrupting the live free-tier services. Full load tests ran on the QA environment.
- **Write tests on production:** none. Production data was only read; all write flows ran on the QA database.

## Re-testing after fixes

After fixing C-1 and H-1–H-3, re-run the API suite: tests SU-07, OW-01–03, DX-01, DX-03 and DX-04 should pass. Then deploy and repeat the live smoke test.
