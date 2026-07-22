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
