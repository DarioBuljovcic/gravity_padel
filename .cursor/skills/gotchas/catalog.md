# Incident catalog

Short break/fix notes for this repo. Newest first. See `SKILL.md` for when and how to add an entry.

## 2026-08-23 — Logged-in pages take 15–80s, no errors

**Broke:** New Supabase keys (`sb_publishable_…`, `sb_secret_…`) are not JWTs. `@supabase/supabase-js` still sets `Authorization: Bearer <that key>`. Kong tries to parse it as a JWT and stalls. `proxy.ts` / `getUser()` only call Auth when a session cookie exists, so `/` and `/login` stayed fast. Compile times were fine; Next reported the time in `proxy.ts` and render. Postgres and REST were healthy (~50–150ms). Putting the service-role key on the user client would bypass RLS and likely hang the same way.

**Fixed:** Shared `lib/supabase/fetch.ts` strips `Authorization` when it matches `Bearer sb_(publishable|secret)_`. Real user access tokens (`eyJ…`) are left alone. Wired through browser, server, middleware, and admin clients.

**Do not:** put `SUPABASE_SERVICE_ROLE_KEY` on `proxy.ts`, `lib/supabase/client.ts`, or any `NEXT_PUBLIC_*` var. Do not “fix” this by switching back to the legacy JWT `anon` key unless we explicitly choose that.
