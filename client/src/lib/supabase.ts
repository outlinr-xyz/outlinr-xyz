import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { env } from '@/config/env';

/**
 * Supabase client instance
 * Configured with environment variables from centralized config
 */
export const supabase: SupabaseClient = createClient(
  env.supabase.url,
  env.supabase.anonKey,
);

/**
 * Helper to check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabase.url && env.supabase.anonKey);
}
