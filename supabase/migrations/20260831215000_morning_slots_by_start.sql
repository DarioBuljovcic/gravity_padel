-- Morning packages are priced by start time: any start in [09:00, 16:00)
-- may run past 16:00. Play still has to finish by venue close (23:00).
-- Overlap stays enforced by reservations_slot_no_overlap.

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
    and (
      p_local_time < time '09:00'
      or p_local_time >= time '16:00'
      or p_local_time + v_duration * interval '1 minute' > time '23:00'
    )
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
