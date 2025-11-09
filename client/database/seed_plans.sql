INSERT INTO plans (name, lemon_variant_id, price, type, duration)
VALUES
  ('1 day', '1077493', 100, 'one_off', '1_day'),
  ('3 days', '1077499', 200, 'one_off', '3_day'),
  ('7 days', '1077500', 300, 'one_off', '7_day'),
  ('Pro (Monthly)', '1077510', 1000, 'subscription', 'monthly'),
  ('Pro (Yearly)', '1077513', 10000, 'subscription', 'yearly'),
  ('Enterprise (Monthly)', '1077515', 5000, 'enterprise', 'monthly');
