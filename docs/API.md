# API reference

Base URL: `https://player-reg.onrender.com/api` (local: `http://localhost:5000/api`).

**Authentication:** sign in to get a JWT (valid 1 day) and send it as `Authorization: Bearer <token>`.
**Access levels:** 🌐 public · 👤 any logged-in user · 🏃 player · 🛡️ admin.
Errors are JSON, e.g. `{ "success": false, "message": "..." }` (some older endpoints use `{ "error": "..." }`).
Status codes: `400` invalid input, `401` no token / wrong credentials, `403` wrong role, expired token or blocked origin, `429` rate limit. `500` responses never include internal error details. Responses are gzip-compressed and carry standard security headers (helmet).

## Auth — `/api/auth`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/signup` | 🌐 | Register a player. Body: `firstName, lastName, fullName, email, password, nicNum, contact, dateofBirth, gender, district, weight, height, idType, idFrontImage, idBackImage, profilePictureName` (image fields are upload URLs). Always creates a **pending player**; any `role`/`status` sent is ignored. Validation errors return 400 with a `message` |
| POST | `/signin` | 🌐 | Body `{ username, password }`; `username` is an email (ends in `.com`) or NIC. Returns `{ token, user }`. Wrong password and unknown account give the same 401. **Rate limit: 10 per 15 min per IP** |
| POST | `/logout` | 👤 | Records the logout in the activity log (tokens are stateless) |
| GET | `/players` | 🛡️ | All players with player details |
| GET | `/:userid` | 🌐 | One player by user id (or NIC). The player themselves and admins get the full record (email, NIC, phone, birth date, ID images, pending payment); everyone else gets the **public profile** (name, district, picture, status, SLBF ID, clubs, registration dates, `age`) |

## Player actions — `/api/user`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/regrequest` | 🏃 | Submit registration payment. Body `{ slipImage, referenceNo }`. Always saved for the logged-in player (a `userId` in the body is ignored) |
| POST | `/clubchange` | 🏃 | Request a club change. Body `{ userId, type: "open"\|"close", newAssId, newAssCode, newAss, newClubId?, newClubCode?, newClub?, newImage, current*…, resignDate? }`. Always for the logged-in player |
| PUT | `/updateuserandplayer` | 🏃 | Edit own details. Body `{ firstName?, lastName?, contact?, email?, height?, weight? }`. Edits only the logged-in player; empty strings leave a field unchanged |
| GET | `/defaultdetails` | 🌐 | Site settings (hero title/subtitle/image, club-change period) |

## Admin — `/api/admin`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/pendingplayers` | 🛡️ | Players awaiting approval |
| GET | `/pendingreg` | 🛡️ | Pending payments (new + renewals) |
| GET | `/clubchangereq` | 🛡️ | Pending club change requests |
| PUT | `/updatefield` | 🛡️ | Set one column: `{ table, id, column, value }`. Only whitelisted combinations (statuses, `slbfId`, club fields) |
| PUT | `/updatefields` | 🛡️ | Set several columns: `{ table, id, updates: {...} }`, same whitelist |
| PUT | `/updatereg` | 🛡️ | Set registration dates `{ id (player id), regDate, expDate }` |
| POST | `/signupadmin` | 🛡️ | Create an admin account. Required: `firstName, lastName, email, password, contact, district, dateofBirth, gender`; `nicNum` optional |
| GET | `/alladmins` | 🛡️ | List admins (no password hashes) |
| GET | `/notregisteredplayercount` | 🛡️ | Count of players never registered or expired |
| GET | `/allplayers` | 🌐 | All players with clubs. Query `sortBy`, `sortOrder`. Admins get full records; everyone else gets public profiles (with `age` instead of birth date) |
| GET | `/clubchanges/:userId` | 🌐 | Approved club change history for a player |
| PUT | `/details` | 🛡️ | Update site settings (creates them on first save) |
| GET | `/logs` | 🛡️ | Activity logs, newest first. Query: `from`, `to` (ISO date-time), `user` (name/email/id), `role`, `page`, `pageSize` (max 200) |

### Reference data (public)

| Method | Path | Description |
|---|---|---|
| GET | `/allassociations` | Open (district) associations |
| GET | `/associations/:associationId/openclubs` | Clubs of an association |
| GET | `/allopenclubs`, `/allcloseclubs`, `/allschools`, `/alluniversities`, `/allmercclubs` | Lists (query `sortOrder`; `sortBy` one of `id`, `name`, `code`, `status`, `createdAt`, `updatedAt`) |
| GET | `/getassdetails/:type/:associationId` | Association by id (`type` = `open`/`close`) |
| GET | `/getclubdetails/:type/:associationId/:clubId` | Club by id. Close association ids **4 = schools, 5 = universities, 6 = mercantile** select the table |

### Posts

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/posts` | 🌐 | All posts, newest first, with author name |
| GET | `/posts/count` | 🛡️ | Count (query `userId`, `q`, `from`, `to`) |
| POST | `/post` | 🛡️ | Create `{ title, content, imageName, userId, subtitle?, createdAt? }` |
| PATCH | `/post/:id` | 🛡️ | Partial update (author cannot change) |
| DELETE | `/post/:id` | 🛡️ | Delete |

## Uploads — `/api/upload`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/image` | 🌐 | `multipart/form-data` field `image`. PNG, JPEG or PDF, max 8 MB (frontend compresses images to < 2 MB first). Returns `{ url, publicId }`. **Rate limit: 20 per 15 min per IP.** Public because sign-up uploads before an account exists |

## Activity log entries

Written automatically by the backend (never by the frontend):

| Actor | Description examples |
|---|---|
| guest | `Failed login: no account for "x@y.com"` |
| player | `User logged in`, `Submitted registration payment slip (Ref: 123)`, `Requested open club change to … / …`, `Updated profile details (contact, weight)` |
| admin | `Approved player account of A B`, `Approved registration payment (Ref: 123) of A B`, `Assigned SLBF ID … to A B`, `Updated open club of A B (SLBF ID: …)`, `Set registration period of A B: … to …`, `Created admin account for …`, `Created/Updated/Deleted post "…"`, `Updated site settings (…)` |

Logs older than one month are deleted at server startup and every 12 hours.
