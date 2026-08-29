-- Court catalog: optional prefix (e.g. Porsche). Display is prefix + i18n
-- "Teren/Court/Pálya {id}" in the app. Legacy terrain JSON stays Serbian.

create table public.courts (
  id integer primary key,
  name text,
  updated_at timestamptz not null default now(),
  constraint courts_id_range check (id between 1 and 4),
  constraint courts_name_length check (
    name is null or char_length(trim(name)) between 1 and 40
  )
);

create unique index courts_name_unique
  on public.courts (lower(trim(name)))
  where name is not null;

insert into public.courts (id, name)
values (1, null), (2, null), (3, null), (4, null);

create or replace function public.court_terrain_name(p_court_id integer)
returns text
language sql
stable
set search_path = public
as $$
  select case
    when c.name is null or btrim(c.name) = '' then 'Teren ' || c.id::text
    else btrim(c.name) || ' Teren ' || c.id::text
  end
  from public.courts c
  where c.id = p_court_id;
$$;

revoke all on function public.court_terrain_name(integer) from public;
revoke all on function public.court_terrain_name(integer) from anon, authenticated;

alter table public.courts enable row level security;

revoke all on public.courts from anon, authenticated;
grant select on public.courts to anon, authenticated;
grant update (name, updated_at) on public.courts to authenticated;

create policy "courts_select_all"
  on public.courts
  for select
  to anon, authenticated
  using (true);

create policy "courts_update_admin"
  on public.courts
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

alter table public.reservations
  add constraint reservations_court_id_fkey
  foreign key (court_id) references public.courts (id);

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
  v_court_name text;
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

  v_court_name := public.court_terrain_name(p_court_id);
  if v_court_name is null then
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
    kind,
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
    'booking',
    auth.uid(),
    to_char(p_local_date, 'YYYY-MM-DD'),
    to_char(p_local_time, 'HH24:MI'),
    jsonb_build_object(
      'id', p_court_id,
      'name', v_court_name,
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

create or replace function public.create_occupancy_block(
  p_title text,
  p_local_date date,
  p_start_time time,
  p_end_time time,
  p_court_ids integer[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_title text := trim(p_title);
  v_group_id uuid := gen_random_uuid();
  v_duration integer;
  v_court_id integer;
  v_court_name text;
  v_starts_at timestamptz;
  v_unique_courts integer[];
begin
  if not public.is_admin() then
    raise exception using errcode = '42501', message = 'Admin only.';
  end if;

  if v_title = '' or char_length(v_title) > 120 then
    raise exception using errcode = '22023', message = 'Invalid title.';
  end if;

  if p_local_date < (now() at time zone 'Europe/Belgrade')::date then
    raise exception using errcode = '22023', message = 'Date is in the past.';
  end if;

  if p_start_time < time '09:00' or p_end_time > time '23:00' or p_end_time <= p_start_time then
    raise exception using errcode = '22023', message = 'Invalid time range.';
  end if;

  v_duration := (extract(epoch from (p_end_time - p_start_time)) / 60)::integer;
  if v_duration < 30 or v_duration > 840 or v_duration % 30 <> 0 then
    raise exception using errcode = '22023', message = 'Invalid duration.';
  end if;

  if p_court_ids is null or coalesce(array_length(p_court_ids, 1), 0) = 0 then
    raise exception using errcode = '22023', message = 'Courts required.';
  end if;

  select array_agg(distinct c order by c)
  into v_unique_courts
  from unnest(p_court_ids) as c;

  if exists (
    select 1 from unnest(v_unique_courts) as c
    where public.court_terrain_name(c) is null
  ) then
    raise exception using errcode = '22023', message = 'Invalid court.';
  end if;

  v_starts_at := (p_local_date + p_start_time) at time zone 'Europe/Belgrade';

  foreach v_court_id in array v_unique_courts
  loop
    v_court_name := public.court_terrain_name(v_court_id);

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
      kind,
      event_group_id,
      user_id,
      date,
      time,
      terrain,
      package_details
    )
    values (
      v_starts_at,
      v_duration,
      v_court_id,
      'event',
      0,
      'RSD',
      v_title,
      '—',
      'events@gravity.local',
      'active',
      'event',
      v_group_id,
      auth.uid(),
      to_char(p_local_date, 'YYYY-MM-DD'),
      to_char(p_start_time, 'HH24:MI'),
      jsonb_build_object(
        'id', v_court_id,
        'name', v_court_name,
        'description', 'Occupancy block'
      ),
      jsonb_build_object(
        'duration', v_duration || ' min',
        'price', '0 RSD',
        'type', 'Događaj'
      )
    );
  end loop;

  return v_group_id;
end;
$$;
