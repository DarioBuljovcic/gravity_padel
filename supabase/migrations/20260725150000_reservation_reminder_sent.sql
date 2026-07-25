alter table public.reservations
  add column if not exists reminder_sent boolean not null default false;

comment on column public.reservations.reminder_sent is
  'True after the day-before reminder email was sent successfully.';
