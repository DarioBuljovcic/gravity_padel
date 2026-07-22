create extension if not exists btree_gist with schema extensions;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'phone'), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, full_name, phone)
select
  id,
  nullif(trim(raw_user_meta_data ->> 'full_name'), ''),
  nullif(trim(raw_user_meta_data ->> 'phone'), '')
from auth.users
on conflict (id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.reservations add column if not exists starts_at timestamptz;
alter table public.reservations add column if not exists duration_minutes integer;
alter table public.reservations add column if not exists court_id integer;
alter table public.reservations add column if not exists package_id text;
alter table public.reservations add column if not exists price_amount integer;
alter table public.reservations add column if not exists price_currency text default 'RSD';
alter table public.reservations add column if not exists user_id uuid references auth.users(id) on delete set null;

update public.reservations
set
  duration_minutes = case package_details ->> 'duration'
    when '1h' then 60
    when '1.5h' then 90
    when '2h' then 120
  end,
  court_id = nullif(terrain ->> 'id', '')::integer,
  starts_at = (
    (date || ' ' || time)::timestamp at time zone 'Europe/Belgrade'
  ),
  package_id = case
    when package_details ->> 'type' = 'Pre podne' then 'morning_'
    else 'afternoon_'
  end || case package_details ->> 'duration'
    when '1h' then '60'
    when '1.5h' then '90'
    when '2h' then '120'
  end,
  price_amount = nullif(
    regexp_replace(package_details ->> 'price', '[^0-9]', '', 'g'),
    ''
  )::integer,
  price_currency = 'RSD'
where starts_at is null
   or duration_minutes is null
   or court_id is null
   or package_id is null
   or price_amount is null;

do $$
begin
  if exists (
    select 1
    from public.reservations
    where status = 'active'
      and (
        starts_at is null
        or duration_minutes is null
        or court_id is null
        or package_id is null
        or price_amount is null
      )
  ) then
    raise exception 'Active legacy reservations contain malformed date, time, court, package, or price data.';
  end if;

  if exists (
    select 1
    from public.reservations a
    join public.reservations b
      on a.id < b.id
     and a.status = 'active'
     and b.status = 'active'
     and a.court_id = b.court_id
     and tstzrange(
       a.starts_at,
       a.starts_at + a.duration_minutes * interval '1 minute',
       '[)'
     ) && tstzrange(
       b.starts_at,
       b.starts_at + b.duration_minutes * interval '1 minute',
       '[)'
     )
  ) then
    raise exception 'Existing active reservations overlap. Resolve them before applying this migration.';
  end if;
end;
$$;

alter table public.reservations
  add column if not exists ends_at timestamptz
  generated always as (
    starts_at + duration_minutes * interval '1 minute'
  ) stored;

alter table public.reservations
  alter column starts_at set not null,
  alter column duration_minutes set not null,
  alter column court_id set not null,
  alter column package_id set not null,
  alter column price_amount set not null,
  alter column price_currency set not null,
  alter column name set not null,
  alter column phone set not null,
  alter column email set not null,
  alter column status set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'reservations_duration_check'
  ) then
    alter table public.reservations
      add constraint reservations_duration_check
      check (duration_minutes in (60, 90, 120));
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'reservations_court_check'
  ) then
    alter table public.reservations
      add constraint reservations_court_check check (court_id between 1 and 4);
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'reservations_status_check'
  ) then
    alter table public.reservations
      add constraint reservations_status_check check (status in ('active', 'cancelled'));
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'reservations_slot_no_overlap'
  ) then
    alter table public.reservations
      add constraint reservations_slot_no_overlap
      exclude using gist (
        court_id with =,
        tstzrange(starts_at, ends_at, '[)') with &&
      )
      where (status = 'active');
  end if;
end;
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "Anyone can view reservation slots" on public.reservations;
drop policy if exists "Users can cancel their own reservations" on public.reservations;
drop policy if exists "Users can create reservations" on public.reservations;
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "roles_select_own" on public.user_roles;
drop policy if exists "reservations_select_own" on public.reservations;
drop policy if exists "reservations_admin_all" on public.reservations;

create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id or public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "roles_select_own"
  on public.user_roles for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "reservations_select_own"
  on public.reservations for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "reservations_admin_all"
  on public.reservations for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

revoke all on public.profiles from anon, authenticated;
revoke all on public.user_roles from anon, authenticated;
revoke all on public.reservations from anon, authenticated;
grant select, update (full_name, phone, updated_at) on public.profiles to authenticated;
grant select on public.user_roles to authenticated;
grant select on public.reservations to authenticated;
grant select, insert, update, delete on public.reservations to authenticated;

drop view if exists public.reservation_availability;
create view public.reservation_availability
with (security_barrier = true, security_invoker = false)
as
select id, court_id, starts_at, ends_at
from public.reservations
where status = 'active';

revoke all on public.reservation_availability from public;
grant select on public.reservation_availability to anon, authenticated;

create or replace function public.get_busy_slots(
  p_local_date date,
  p_court_id integer
)
returns table (starts_at timestamptz, ends_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select r.starts_at, r.ends_at
  from public.reservations r
  where r.status = 'active'
    and r.court_id = p_court_id
    and r.starts_at >= (p_local_date::timestamp at time zone 'Europe/Belgrade')
    and r.starts_at < ((p_local_date + 1)::timestamp at time zone 'Europe/Belgrade')
  order by r.starts_at;
$$;

create or replace function public.create_reservation(
  p_package_id text,
  p_local_date date,
  p_local_time time,
  p_court_id integer,
  p_name text,
  p_phone text,
  p_email text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_duration integer;
  v_price integer;
  v_starts_at timestamptz;
  v_id uuid;
  v_period text;
begin
  select duration, price, period
  into v_duration, v_price, v_period
  from (
    values
      ('morning_60', 60, 1800, 'Pre podne'),
      ('morning_90', 90, 2700, 'Pre podne'),
      ('morning_120', 120, 3300, 'Pre podne'),
      ('afternoon_60', 60, 2400, 'Posle podne'),
      ('afternoon_90', 90, 3600, 'Posle podne'),
      ('afternoon_120', 120, 4400, 'Posle podne')
  ) packages(id, duration, price, period)
  where id = p_package_id;

  if v_duration is null then
    raise exception using errcode = '22023', message = 'Invalid package.';
  end if;
  if p_court_id not between 1 and 4 then
    raise exception using errcode = '22023', message = 'Invalid court.';
  end if;
  if p_local_date < (now() at time zone 'Europe/Belgrade')::date then
    raise exception using errcode = '22023', message = 'Reservation date is in the past.';
  end if;
  if (
    v_period = 'Pre podne'
    and (p_local_time < time '09:00' or p_local_time + v_duration * interval '1 minute' > time '16:00')
  ) or (
    v_period = 'Posle podne'
    and (p_local_time < time '16:00' or p_local_time + v_duration * interval '1 minute' > time '23:00')
  ) then
    raise exception using errcode = '22023', message = 'Time is outside the package range.';
  end if;
  if trim(p_name) = '' or trim(p_phone) = '' or trim(p_email) = '' then
    raise exception using errcode = '22023', message = 'Contact details are required.';
  end if;

  v_starts_at := (p_local_date + p_local_time) at time zone 'Europe/Belgrade';

  insert into public.reservations (
    starts_at,
    duration_minutes,
    court_id,
    package_id,
    price_amount,
    price_currency,
    name,
    phone,
    email,
    status,
    user_id,
    date,
    time,
    terrain,
    package_details
  )
  values (
    v_starts_at,
    v_duration,
    p_court_id,
    p_package_id,
    v_price,
    'RSD',
    trim(p_name),
    trim(p_phone),
    lower(trim(p_email)),
    'active',
    auth.uid(),
    to_char(p_local_date, 'YYYY-MM-DD'),
    to_char(p_local_time, 'HH24:MI'),
    jsonb_build_object(
      'id', p_court_id,
      'name', 'Teren ' || p_court_id,
      'description', 'Panoramic WPT Standard'
    ),
    jsonb_build_object(
      'duration', case v_duration when 60 then '1h' when 90 then '1.5h' else '2h' end,
      'price', to_char(v_price, 'FM999G999') || ' RSD',
      'type', v_period
    )
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.cancel_own_reservation(p_reservation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.reservations
  set status = 'cancelled'
  where id = p_reservation_id
    and status = 'active'
    and (user_id = auth.uid() or public.is_admin());

  if not found then
    raise exception using errcode = '42501', message = 'Reservation not found or not permitted.';
  end if;
end;
$$;

revoke all on function public.get_busy_slots(date, integer) from public;
revoke all on function public.create_reservation(text, date, time, integer, text, text, text) from public;
revoke all on function public.cancel_own_reservation(uuid) from public;
grant execute on function public.get_busy_slots(date, integer) to anon, authenticated;
grant execute on function public.create_reservation(text, date, time, integer, text, text, text) to anon, authenticated;
grant execute on function public.cancel_own_reservation(uuid) to authenticated;

-- After creating an admin user, bootstrap the role once in the SQL editor:
-- insert into public.user_roles (user_id) values ('ADMIN_AUTH_USER_UUID');
