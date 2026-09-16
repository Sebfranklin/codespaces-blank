# Gospel broadcast — send straight from the waitlist app (Supabase)

No GitHub token. No OAuth. No extra auth. The **Send Batch** button in
`dashboard.html` calls a Supabase Edge Function directly, which holds the
Gmail app password server-side.

## How it works

```
dashboard.html (Send Batch / Test Send)
  -> POST https://svuvmetcrowqxafpgtub.supabase.co/functions/v1/send-broadcast
      headers: apikey: <anon key>
      body: { subject, body, recipients: [{name, email}] }  (or { test_to })
  -> Edge Function opens Gmail SMTP (smtp.gmail.com:465, Deno.connectTls)
  -> sends with GMAIL_APP_PASSWORD from function secrets
```

## Files

- `gospel/supabase/functions/send-broadcast/index.ts` — the sender (deployed).
- `gospel/supabase/config.toml` — `[functions.send-broadcast] verify_jwt = false`.
- `gospel-waitlist/dashboard.html` — `executeSend()` + `sendSelfTest()`.
- `.github/workflows/gospel-broadcast.yml` + `send-action.mjs` — runner/CI fallback.

## Dashboard setup (one value, not a secret)

The anon key is public by design, but it is **not hardcoded** in the HTML
(pre-commit scans block it). Provide it at runtime — any one of:

1. Before the main script in `dashboard.html`:
   `<script>window.GOSPEL_SUPABASE_ANON_KEY = "sb_publishable_..."</script>`, or
2. `<meta name="gospel-supabase-anon-key" content="sb_publishable_...">`, or
3. In the browser console once (persists):
   `localStorage.setItem("gospel_supabase_anon_key", "sb_publishable_...")`

The value is the `VITE_SUPABASE_ANON_KEY` from Infisical `/Gospel`.

## Test it from the waitlist app

1. Open `dashboard.html`, unlock with the admin password.
2. **Test Send** button → enter `gospelnetapp@gmail.com` → check inbox.
3. Select subscribers → compose → **Send Batch** → real per-recipient results.

## Server side (already done, for reference)

```bash
supabase functions deploy send-broadcast --project-ref svuvmetcrowqxafpgtub --no-verify-jwt --use-api
supabase secrets set GMAIL_APP_PASSWORD="<16-char-app-password>" --project-ref svuvmetcrowqxafpgtub
curl -X POST https://svuvmetcrowqxafpgtub.supabase.co/functions/v1/send-broadcast \
  -H "Content-Type: application/json" -H "apikey: <anon-key>" \
  -d '{"subject":"test","body":"hi","test_to":"gospelnetapp@gmail.com"}'
```
