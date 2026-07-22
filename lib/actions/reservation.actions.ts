'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin, requireUser } from '@/lib/auth';
import {
  isPastSlot,
  reservationInputSchema,
  type BusySlot,
  type ReservationInput,
} from '@/lib/reservations/domain';
import { createClient } from '@/lib/supabase/server';

export type ReservationActionResult =
  | { success: true; reservationId: string }
  | { success: false; type: 'validation' | 'conflict' | 'system'; error: string };

export async function createReservation(input: ReservationInput): Promise<ReservationActionResult> {
  const parsed = reservationInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, type: 'validation', error: 'Proverite unete podatke.' };
  }

  if (isPastSlot(parsed.data.date, parsed.data.time)) {
    return {
      success: false,
      type: 'validation',
      error: 'Izabrani termin je već prošao. Izaberite kasnije vreme.',
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('create_reservation', {
    p_package_id: parsed.data.packageId,
    p_local_date: parsed.data.date,
    p_local_time: parsed.data.time,
    p_court_id: parsed.data.courtId,
    p_name: parsed.data.name,
    p_phone: parsed.data.phone,
    p_email: parsed.data.email,
  });
  if (error) {
    console.error('Error creating reservation:', error);
    if (error.code === '23P01') {
      return {
        success: false,
        type: 'conflict',
        error: 'Termin je upravo rezervisan. Izaberite drugi termin.',
      };
    }
    return { success: false, type: 'system', error: 'Rezervacija nije sačuvana.' };
  }

  revalidatePath('/admin');
  revalidatePath('/account');
  return { success: true, reservationId: data };
}

export async function getReservations() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reservations')
    .select('id,starts_at,ends_at,duration_minutes,court_id,package_id,price_amount,price_currency,name,phone,email,status,user_id,created_at')
    .order('starts_at', { ascending: false });

  if (error) {
    throw new Error('Unable to load reservations.');
  }

  return data ?? [];
}

export async function cancelReservation(id: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.rpc('cancel_own_reservation', {
    p_reservation_id: id,
  });

  if (error) {
    console.error('Error cancelling reservation:', error);
    return { success: false, error: 'Rezervaciju nije moguće otkazati.' };
  }

  revalidatePath('/admin');
  revalidatePath('/account');
  return { success: true };
}

export async function getBusySlots(date: string, courtId: number): Promise<BusySlot[]> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isInteger(courtId) || courtId < 1 || courtId > 4) {
    return [];
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_busy_slots', {
    p_local_date: date,
    p_court_id: courtId,
  });
  if (error) {
    console.error('Error loading availability:', error);
    return [];
  }
  return data ?? [];
}
