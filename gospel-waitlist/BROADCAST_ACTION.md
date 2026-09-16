# Gospel broadcast via GitHub Action (no OAuth, no extra auth)

This replaces the long Google OAuth setup. The Gmail **app password** lives in
one place — a GitHub repo secret — and sending happens on GitHub's runners,
where Gmail SMTP works fine (unlike Cloudflare Workers, which Gmail blocks).

## One-time setup (2 steps)

### 1. Add the Gmail app password as a repo secret

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

- Name: `GMAIL_APP_PASSWORD`
- Value: the 16-character app password (same one tested earlier; it is also in
  Infisical at `/Gospel`). No spaces needed — the sender strips them anyway.

### 2. Push this branch (the workflow file must exist on `main` first)

`repository_dispatch` only fires for workflow files present on the repo's
default branch. Merge/commit `.github/workflows/gospel-broadcast.yml` to
`main` once; after that it works from any run.

## Using it

### A. Dashboard Send Batch button (you chose this)

1. Open `dashboard.html`, unlock with the admin password.
2. Select subscribers → Broadcast tab → compose → **Send Now**.
3. First click prompts for a **broadcast token**: a fine-grained GitHub PAT
   scoped to **this repo only** with **Actions: Read and write**.
   Create at https://github.com/settings/tokens?type=beta → Generate →
   Repository access: Only select repositories → pick this repo →
   Permissions → Actions: Read and write.
   It lives in memory only (never written to disk or committed) and can only
   *trigger* the broadcast — it never sees the Gmail password.
4. The button fires `repository_dispatch (gospel-broadcast)` with your subject,
   body, and recipient count. Toast confirms: `Broadcast fired! N emails
   queued — watch Actions tab.`
5. Watch it live: repo → **Actions → Gospel waitlist broadcast** → the run
   logs each send (`[3/22] foo@bar… sent`) with a 1.2 s gap to respect Gmail.

### B. Manual trigger (no dashboard, no token)

Repo → **Actions → Gospel waitlist broadcast → Run workflow** → fill
`subject`, `body`, optional `test_to` (single self-test) and `limit`
(safety cap, default 40, max 200) → **Run workflow**.

### C. CLI (unchanged, still works)

```bash
infisical run --path="/Gospel" -- node gospel-waitlist/send-broadcast.mjs --test gospelnetapp@gmail.com
infisical run --path="/Gospel" -- node gospel-waitlist/send-broadcast.mjs --send
```

## Files

- `.github/workflows/gospel-broadcast.yml` — the Action (SMTP via nodemailer).
- `gospel-waitlist/send-action.mjs` — the runner script (env-driven).
- `gospel-waitlist/dashboard.html` — `executeSend()` fires the dispatch;
  Worker (`SEND_API_URL`) kept as automatic fallback; `mailto` is last resort.
- `gospel-waitlist/SENDER_SETUP.md` — the old Worker/OAuth path (kept for reference).

## Limits & notes

- Gmail: ~500 sends/day, ~1.2 s gap between mails is baked in.
- Batch cap per Action run: 200 (default 40). For 22 subscribers a single run covers all.
- `GMAIL_APP_PASSWORD` is **never** in browser JS, logs, or git — only in the
  GitHub secret store and Infisical.
