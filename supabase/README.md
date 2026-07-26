# Supabase deployment

Apply migrations in filename order before deploying the matching application code.

After the first admin signs up, grant the role once from the Supabase SQL editor:

```sql
insert into public.user_roles (user_id)
select id from auth.users where email = 'admin@example.com';
```

Replace the email with the real admin address. The migration intentionally stops
if malformed or overlapping legacy reservations exist; resolve the reported rows
and rerun it instead of weakening the constraints.

Enable Google in Supabase Authentication if OAuth login is required, and add
`https://your-domain/auth/callback` plus the local callback URL to the allowed
redirect URLs.

## Reservation emails

Required env vars (see `.env.example`): `RESEND_API_KEY`, `MAIL_FROM`,
`ADMIN_NOTIFY_EMAIL`, `CRON_SECRET`.

1. Apply `20260725150000_reservation_reminder_sent.sql` so `reminder_sent` exists.
2. For local/staging tests, set `MAIL_FROM` to Resend’s onboarding sender
   (`Padel Gravity <beth.t@example.com>`) and `ADMIN_NOTIFY_EMAIL` to an inbox
   you control. After verifying `padelgravity.rs` in Resend (SPF/DKIM), switch
   `MAIL_FROM` to `Padel Gravity <rezervacije@padelgravity.rs>` without code changes.
3. Smoke-test admin notify: create a booking and confirm the team inbox + Resend dashboard.
4. Smoke-test reminders after deploy:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain/api/cron/reminders
```

Vercel Cron runs `GET /api/cron/reminders` at `0 7 * * *` (07:00 UTC ≈ 08:00/09:00
Europe/Belgrade). Only active reservations for tomorrow with `reminder_sent = false`
are emailed; the flag is set only after a successful send.
