import fs from 'fs';
import assert from 'assert';

const DASH =
  '/workspaces/codespaces-blank/gospel-waitlist/dashboard.html';
const FN =
  '/workspaces/codespaces-blank/gospel/supabase/functions/admin-auth/index.ts';

const html = fs.readFileSync(DASH, 'utf8');
const fn = fs.readFileSync(FN, 'utf8');

console.log('=== Phase 2: Admin password authority (server-side) ===');

// 1. The default password must NOT appear anywhere in the page.
assert(!html.includes('gospel2026'), 'FAIL: default password string still present in dashboard.html');

// 2. No password material may live in the browser (the original bug: a hash in
//    localStorage died on every republish because localStorage is per-origin).
assert(!html.includes('gospel_custom_admin_hash'), 'FAIL: still storing/p reading a local password hash');
assert(!html.includes('localStorage.setItem("gospel_custom_admin_hash"'), 'FAIL: still writing local password hash');
assert(!html.includes('SETUP_KEY_HASH'), 'FAIL: setup-key hash must live server-side only, not in the page');
assert(!html.includes('VALID_ADMIN_HASHES'), 'FAIL: legacy client-side hash list still present');

// 3. Auth is delegated to the server function.
assert(html.includes('ADMIN_AUTH_URL'), 'FAIL: dashboard must call the admin-auth edge function');
assert(html.includes('functions/v1/admin-auth'), 'FAIL: admin-auth endpoint URL missing');
assert(html.includes('await adminAuth("login", val)'), 'FAIL: login must be verified server-side');
assert(html.includes('await adminAuth("change", ADMIN_SESSION_PASSWORD, p1)'), 'FAIL: password change must be persisted server-side');

// 4. The lock screen must never reveal the credential.
const hintBlock = html.slice(html.indexOf('id="auth-hint-title"'), html.indexOf('id="auth-submit-btn"'));
assert(!/gospel2026|setup key:/i.test(hintBlock), 'FAIL: lock screen still reveals the setup key');

// 5. Sign-out replaces the old client-side "reset to default".
assert(html.includes('function signOut()'), 'FAIL: signOut() missing');
assert(!html.includes('resetPasswordToDefault'), 'FAIL: legacy reset-to-default still referenced');

// 6. Server function contract: hash, seed, upsert, throttle, no hash leaking.
assert(fn.includes('SETUP_KEY_HASH'), 'FAIL: function must own the setup-key hash');
assert(fn.includes("'x-upsert': 'true'"), 'FAIL: function must upsert its config object in Storage');
assert(fn.includes('gospel-config'), 'FAIL: function must read/write the private gospel-config bucket');
assert(fn.includes('sha256Hex'), 'FAIL: function must hash passwords server-side');
assert(fn.includes('MAX_FAILS'), 'FAIL: function must rate-limit guessing attempts');
assert(!/return json\(200, \{ ok: true, password_hash/.test(fn), 'FAIL: function must never return the stored hash');

// 7. The public anon key must be embedded so the dashboard works on every URL
//    with no per-origin setup (the old localStorage dance was itself
//    origin-bound, i.e. the same class of bug we just fixed).
assert(
  html.includes('const GOSPEL_SUPABASE_ANON_KEY = "sb_publishable_'),
  'FAIL: publishable anon key must be embedded in dashboard.html'
);
assert(
  !html.includes('localStorage.getItem("gospel_supabase_anon_key")'),
  'FAIL: anon key must not depend on per-origin localStorage injection'
);
assert(
  html.includes('const SEND_API_ANON_KEY = adminApiKey();'),
  'FAIL: sender must reuse the embedded anon key'
);

console.log('All Auth TDD assertions verified!');
