# Manual test checklist (real devices)

Automated tests use Safari's engine (WebKit) but not physical devices. Run this on a **real iPhone (Safari)** and, if available, a **Mac (Safari)** before each release. About 10 minutes.

Use a test player account, then delete it afterwards (see [DEPLOYMENT.md](DEPLOYMENT.md)).

| # | Step | Expected | ✓ |
|---|---|---|---|
| 1 | Open https://player-reg.vercel.app (wait up to 1 min if the server was asleep) | Home page with title, banner and posts | ☐ |
| 2 | Rotate the phone to landscape and back | Layout adapts, nothing cut off or scrolling sideways | ☐ |
| 3 | Tap ☰ → **Sign Up** | Form opens, fields are easy to tap, keyboard doesn't hide the active field | ☐ |
| 4 | Profile picture → **take a photo with the camera** | Preview shows the photo the right way up | ☐ |
| 5 | ID front → choose an existing photo; ID back → choose a **PDF** from Files | Photo preview + PDF icon with file name | ☐ |
| 6 | Pick an iPhone photo saved as **HEIC** | Message: "Please select a PNG, JPEG or PDF file" (Settings → Camera → Formats → *Most Compatible* avoids HEIC) | ☐ |
| 7 | Fill everything, tap **Create Account** | Button shows a spinner, then the sign-in page | ☐ |
| 8 | Sign in with the **NIC number** | Profile page, status *pending* | ☐ |
| 9 | Admin (on a computer): approve the player | — | ☐ |
| 10 | Back on the phone, pull to refresh → **Register Account** → reference + slip photo → **Submit** | Success message; one submission only even if tapped twice | ☐ |
| 11 | Admin approves the payment; refresh the phone | *Registered*, SLBF ID and expiry date shown | ☐ |
| 12 | **Select Open Club** → search association and club → offer letter → **Submit Request** | Success message | ☐ |
| 13 | Tap **Logout**, then open `/admin` in the address bar | Sent to sign-in | ☐ |
| 14 | Sign in as **admin** on the phone → open each dashboard card, the Logs and Settings buttons | Lists readable; dialogs scroll; images/PDF previews open | ☐ |
| 15 | Open an ID image in an approval dialog → tap to enlarge → close | Full image; close button reachable | ☐ |
| 16 | On a **Mac**, repeat steps 1, 3, 7, 8, 14 in Safari | Same results | ☐ |

Record any failure with: device + iOS version, the step number, a screenshot, and (on Mac) the Safari Web Inspector **Console** and **Network** tabs.
