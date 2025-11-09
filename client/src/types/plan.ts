export interface Plan {
  id: string;
  name: string;
  lemon_variant_id: string;
  price: number;
  type: 'one_off' | 'subscription' | 'enterprise';
  duration: '1_day' | '3_day' | '7_day' | 'monthly' | 'yearly';
  created_at: string;
  updated_at: string;
}
