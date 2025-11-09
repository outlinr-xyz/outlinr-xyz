export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  lemon_subscription_id: string;
  status: 'active' | 'cancelled' | 'expired';
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}
