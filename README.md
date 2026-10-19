# CodeSync

CodeSync is a personal dashboard for bringing public coding-profile progress into one place. Add a public username for a supported platform and review live stats, solved-problem totals, contest ratings, and rating history without sharing platform passwords.

## Supported platforms

| Platform | Live data |
| --- | --- |
| LeetCode | Solved counts, global ranking, contest rating and history |
| Codeforces | Rating, max rating, solved problems, contest history |
| CodeChef | Rating, ranks, and solved count when exposed by the public profile API |
| GitHub | Public repositories, followers, following, and gists |
| HackerRank | Not currently supported because it has no browser-safe public stats API |

## Run locally

Prerequisites: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL Vite prints (normally `http://localhost:5173`). Go to **My Profiles**, enter a public username (not an email or password), then select **Connect**.

The Vite development server includes API proxies for LeetCode, Codeforces, and CodeChef. This avoids browser cross-origin restrictions when using the app locally.

## Production build

```bash
npm run build
npm run preview
```

For a deployed version, configure a server-side proxy and set `VITE_API_PROXY_URL` to its base URL. The proxy must expose these routes:

```text
/leetcode/graphql
/codeforces/api/...
/codechef/api/...
```

This is needed because some coding platforms do not permit direct requests from a browser hosted on another origin.

## Privacy

CodeSync only sends the public usernames you enter to the relevant platform APIs. It does not request, transmit, or store platform passwords. Successful live-profile snapshots are saved only in your browser's local storage so your dashboard persists between visits.

## Tech stack

React, TypeScript, Vite, Tailwind CSS, and Recharts.
