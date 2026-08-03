-- Players may not cancel within 1 hour of starts_at; admins may always cancel.
create or replace function public.cancel_own_reservation(p_reservation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_admin boolean := public.is_admin();
begin
  update public.reservations
  set status = 'cancelled'
  where id = p_reservation_id
    and status = 'active'
    and (user_id = auth.uid() or v_is_admin)
    and (v_is_admin or starts_at > now() + interval '1 hour');

  if not found then
    if exists (
      select 1
      from public.reservations
      where id = p_reservation_id
        and status = 'active'
        and (user_id = auth.uid() or public.is_admin())
        and starts_at <= now() + interval '1 hour'
        and not public.is_admin()
    ) then
      raise exception using
        errcode = 'P0001',
        message = 'Reservation cannot be cancelled within 1 hour of start time.';
    end if;

    raise exception using
      errcode = '42501',
      message = 'Reservation not found or not permitted.';
  end if;
end;
$$;
