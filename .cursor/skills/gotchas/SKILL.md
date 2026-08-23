---
name: gotchas
description: Maintains this repo's short incident catalog of non-obvious break/fix cases (Supabase API keys, Auth hangs, middleware, logged-in-only slowness). Use when debugging regressions, slow authenticated pages, Supabase/Auth, or after fixing a surprising production bug so a new catalog entry can be added.
---

# Gotchas

Read [catalog.md](catalog.md) before changing code that matches an existing entry.

## When to add an entry

Add one after a fix if **all** of these are true:

- the failure was surprising (no useful error, only some routes/users, env/SDK/gateway mismatch);
- a future change could reintroduce it;
- it is not already covered.

Do not add routine bugs, linter noise, or one-off typos.

## Entry format

Newest first. Keep each entry under ~12 lines.

```markdown
## YYYY-MM-DD — <symptom in one line>

**Broke:** <what actually failed, including the false lead if any>
**Fixed:** <the change and where it lives>
**Do not:** <the tempting wrong fix>
```

## This repo's first case (summary)

Logged-in pages stalling for tens of seconds with HTTP 200: `@supabase/supabase-js` sends `sb_publishable_` / `sb_secret_` as `Authorization: Bearer`. Kong treats that as a JWT and hangs. `getUser()` only hits Auth when a session exists, so logged-out looked fine. Fix is `lib/supabase/fetch.ts`, not the service-role key on user clients.
