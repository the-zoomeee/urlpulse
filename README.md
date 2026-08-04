# UrlPulse Frontend

React (Vite) frontend for the UrlPulse backend.

## Setup

```bash
npm install
cp .env.example .env
# set VITE_API_BASE_URL to point at your running backend, e.g. http://localhost:5000/api
npm run dev
```

Runs on http://localhost:5173 by default. Make sure the backend is running and `CLIENT_URL` in the backend's `.env` matches this origin (for CORS).

## Pages

| Route | Description |
|---|---|
| `/login`, `/register` | Auth |
| `/forgot-password` | Request a password reset link |
| `/reset-password` | Set a new password (reads `?token=` from the emailed link) — works whether or not the browser currently has a session |
| `/verify-email` | Redeems an email verification link (reads `?token=` from the emailed link) — auto-submits on load, works whether or not the browser currently has a session |
| `/` | Dashboard — list of jobs, add-URL form |
| `/jobs/:id` | Job detail — edit, pause/resume/delete, uptime %, avg response time, full check log |
| `/guide` | **Setup guide** — the 5-step walkthrough: add an endpoint in your code → paste it into the job form → set the interval → create → read results. New users land here right after registering. |
| `/account` | View plan and email-verification status, resend verification, delete account |
| `/admin` | Admin only — user management (plan/role/deactivate/delete), system stats, force-toggle any job |

## Design system

Tokens live at the top of `src/index.css`. The signature element is `PulseLine` (`src/components/PulseLine.jsx`) — a small heartbeat-trace SVG whose shape and color encode job health (smooth teal wave = healthy, jagged amber = recent failures, red spike = down/paused, flat gray = no data yet). It's used both decoratively (login screen, guide page) and functionally (every job row/card).

## Auth

JWT is stored in `localStorage` (`urlpulse_token`) and attached as `Authorization: Bearer <token>` on every request via `src/api/client.js`. `AuthContext` loads the current user from `/auth/me` on mount if a token exists.

**Password reset & email verification**: `/forgot-password`, `/reset-password`, and `/verify-email` are all reachable regardless of whether a session currently exists in the browser — they're intentionally outside both `GuestOnlyLayout` and `ProtectedLayout`, since a reset/verify link can land on a device that's logged in, logged out, or logged in as someone else entirely. `VerifyEmailBanner` (shown across every page in `ProtectedLayout` for unverified users) and the badge on `/account` both call the same `resend-verification` endpoint — resending doesn't verify anything by itself, only redeeming the token via `/verify-email` does.

**Layout note**: `.main-content` is a flex column with two slots — `.main-content-banner-slot` (the verify-email banner, sized to its content) and `.main-content-scroll` (the actual scrolling region). This split matters: `JobDetail`'s internal layout (`.detail-page`) depends on its parent being exactly "the remaining space after anything else in main-content," not "the whole main-content box" — a naive banner-as-sibling would have broken its fixed-header/scrollable-table behavior whenever the banner was showing. If you add more banner-slot content later, it'll compose correctly with this structure; if you add scrollable content elsewhere, make sure it's a child of `.main-content-scroll`, not a new direct child of `.main-content`.

## Notes

- Custom interval input in the job form is disabled (with an explanatory tooltip) for users on the `normal` plan, matching the backend's Pro-only gate.
- The admin panel's "Remove admin" / role-change action is disabled on your own row, matching the backend's self-demotion guard.
- No public status pages, per your earlier scope decision on the backend.
- **Content matching**: the create/edit job form has an optional "Response must contain" field (`expectedContent`, matches the backend). A job's pulse status and failure count already reflect content-check failures for free — they flow through the same success/failure path as an HTTP-level failure, so no separate UI state was needed.
- **SSL certificate expiry**: `JobDetail` shows an "SSL certificate" stat card for any `https://` job, color-coded by urgency (default text once >14 days left, amber inside the warning window, red once expired). A job's pulse status also turns amber when its cert is inside that window even if every check is otherwise passing — `sslDaysRemaining()` in `src/utils/jobStatus.js` is the single source of truth both places use, so they can't drift out of sync with each other.

## Security audit changelog
- All 9 previously try/catch-less action handlers (toggle/delete/plan/role/deactivate across Dashboard, Job Detail, and Admin) now catch and surface errors instead of failing silently as unhandled promise rejections.
- Job Detail's error state was split into `error` (initial load failure — replaces the page, nothing to show anyway) and `actionError` (a failed toggle/delete after the page already loaded — shown as a banner, doesn't blank out the job you were looking at).
- `jobStatus()` no longer shows a manually-paused (healthy, user just turned it off) job with the same red "danger" pulse as an auto-paused-after-failures job — manual pause is now a neutral/idle signal, matching its "Paused" label.
- `react-router-dom` bumped to 7.18.2 and `vite`/`@vitejs/plugin-react` bumped to 8.x/6.x to clear flagged dependency advisories — both `npm run build` and `npm run dev` re-verified working after the bump, no code changes needed.
- Known accepted risk: `react-router-dom@7.18.2` still shows one high-severity advisory for an RSC-mode CSRF bypass. This app is a plain client-side Vite SPA with no SSR and no RSC anywhere, so that attack surface doesn't exist here — no available version currently escapes the advisory's range since React Router 8 hasn't reached general release yet.
