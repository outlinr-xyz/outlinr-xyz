import { env } from '@/config/env';
import { handleSupabaseError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { Subscription } from '@/types';

/**
 * Get subscription by user id
 * @throws {ApiError} if fetch fails
 */
export async function getSubscription(
  userId: string,
): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw handleSupabaseError(error, 'Failed to fetch subscription');
  }

  return data;
}

/**
 * Create a Lemon Squeezy checkout URL
 * @throws {Error} if checkout creation fails
 */
export async function createCheckoutUrl(
  variantId: string,
  userEmail: string,
): Promise<string> {
  const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.lemonSqueezy.apiKey}`,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: userEmail,
          },
        },
        relationships: {
          variant: {
            data: {
              type: 'variants',
              id: variantId,
            },
          },
        },
      },
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.detail || 'Failed to create checkout');
  }

  return json.data.attributes.url;
}
