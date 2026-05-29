'use server';

import { supabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createReservation(data: any) {
  const { error } = await supabase
    .from('reservations')
    .insert([{
      package_details: data.package,
      date: data.date,
      time: data.time,
      terrain: data.terrain,
      name: data.name,
      phone: data.phone,
      email: data.email,
      status: 'active'
    }]);

  if (error) {
    console.error('Error creating reservation:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function getReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }

  return data;
}

export async function cancelReservation(id: string) {
  const { error } = await supabase
    .from('reservations')
    .update({ status: 'cancelled' })
    .eq('id', id);

  if (error) {
    console.error('Error cancelling reservation:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}
