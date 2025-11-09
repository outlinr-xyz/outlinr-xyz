// import { supabase } from '@/lib/supabase';
// import type { VercelRequest, VercelResponse } from '@vercel/node';

// export default async function handler(
//   req: VercelRequest,
//   res: VercelResponse,
// ) {
//   const { event_name, data } = req.body;

//   if (event_name === 'subscription_created') {
//     const { user_email, variant_id, status, ends_at, id } = data.attributes;

//     // Get user by email
//     const { data: profile } = await supabase
//       .from('profiles')
//       .select('id')
//       .eq('email', user_email)
//       .single();

//     if (!profile) {
//       return res.status(404).send('User not found');
//     }

//     // Get plan by variant id
//     const { data: plan } = await supabase
//       .from('plans')
//       .select('id')
//       .eq('lemon_variant_id', variant_id)
//       .single();

//     if (!plan) {
//       return res.status(404).send('Plan not found');
//     }

//     // Create subscription
//     await supabase.from('subscriptions').insert({
//       user_id: profile.id,
//       plan_id: plan.id,
//       lemon_subscription_id: id,
//       status,
//       expires_at: ends_at,
//     });
//   }

//   res.status(200).send('OK');
// }
