import { handleSupabaseError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { Plan } from '@/types';

/**
 * Get all plans
 * @throws {ApiError} if fetch fails
 */
export async function getPlans(): Promise<Plan[]> {
  const { data, error } = await supabase.from('plans').select('*');

  if (error) {
    throw handleSupabaseError(error, 'Failed to fetch plans');
  }

  return data || [];
}
