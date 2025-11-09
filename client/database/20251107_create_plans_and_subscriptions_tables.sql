CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lemon_variant_id TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Check constraints
  CONSTRAINT chk_plan_type
    CHECK (type IN ('one_off', 'subscription', 'enterprise')),

  CONSTRAINT chk_plan_duration
    CHECK (duration IN ('1_day', '3_day', '7_day', 'monthly', 'yearly'))
);

-- Indexes for plans
CREATE INDEX IF NOT EXISTS idx_plans_lemon_variant_id
  ON plans(lemon_variant_id);

CREATE INDEX IF NOT EXISTS idx_plans_type
  ON plans(type);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  plan_id UUID NOT NULL REFERENCES plans(id),
  lemon_subscription_id TEXT NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Check constraints
  CONSTRAINT chk_subscription_status
    CHECK (status IN ('active', 'cancelled', 'expired'))
);

-- Indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id
  ON subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id
  ON subscriptions(plan_id);
