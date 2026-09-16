# Gospel waitlist — sending + admin password (server-side)

No GitHub token. No OAuth. No per-origin setup. Both the email sender and the
admin password are verified server-side by Supabase Edge Functions.

## Send email from the dashboard

```
dashboard.html (Send Batch / Test Send)
  -> POST /functions/v1/send-broadcast   headers: apikey <publishable key>
  -> Gmail SMTP smtp.gmail.com:465 (Deno.connectTls)
  -> GMAIL_APP_PASSWORD from Supabase function secrets
```

Use **Test Send** to mail one address, **Send Batch** for the selected list.

## Admin password — the bug that is now fixed

**Old behaviour (broken):** the custom password hash was stored in
`localStorage`, which is scoped per origin. Every republish produced a new
`*.here.now` URL → new origin → empty localStorage → the setup key worked again
and the custom password appeared to "vanish".

**Now:** the hash lives in Supabase Storage (`gospel-config/admin.json`, a
private bucket) and is verified by the `admin-auth` function. It survives every
URL, every device and every redeploy, and the hash never reaches the browser.

- First run: the setup key works **once** to get you in.
- Change it in **Settings → Change Password**. From then on the setup key is
  dead everywhere, permanently.
- Brute force is throttled: 8 failed attempts → 10 minute lockout, persisted
  server-side (the earlier in-memory counter was useless because edge functions
  run in throwaway isolates — verified, then fixed).

## Files

| File | Role |
| --- | --- |
| `gospel/supabase/functions/admin-auth/index.ts` | Admin password authority (verify / change / status) |
| `gospel/supabase/functions/send-broadcast/index.ts` | Gmail SMTP sender |
| `gospel-waitlist/dashboard.html` | UI; calls both functions |
| `gospel-waitlist/test-auth.mjs` | TDD guard for the auth contract |
| `.gitleaks.toml` | Allowlists Supabase *publishable* keys (public by design) |
| `.github/workflows/gospel-broadcast.yml` + `send-action.mjs` | CI fallback sender |

## Server config (already applied)

```bash
# functions deployed with verify_jwt = false (called with the publishable key)
supabase functions deploy admin-auth --project-ref svuvmetcrowqxafpgtub --no-verify-jwt --use-api
supabase functions deploy send-broadcast --project-ref svuvmetcrowqxafpgtub --no-verify-jwt --use-api

# function secrets (values never printed)
supabase secrets set GMAIL_APP_PASSWORD="..." --project-ref svuvmetcrowqxafpgtub
supabase secrets set GOSPEL_SERVICE_KEY="..."  --project-ref svuvmetcrowqxafpgtub
```

`GOSPEL_SERVICE_KEY` is the service-role key used by `admin-auth` to read/write
the private bucket. Supabase reserves the `SUPABASE_` prefix, hence the name.

## Notes / limitations

- The publishable key is embedded in `dashboard.html` on purpose (it is public
  by design); only service-role keys are treated as credentials.
- The Cloudflare Worker experiment was **deleted**: Gmail blocks SMTP from
  Cloudflare egress (socket opens, then drops with no `220` greeting).
- The dashboard lock is a shared-password gate, not multi-user auth.
