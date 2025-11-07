-- ============================================================================
-- COMPLETE DATABASE SCHEMA FOR OUTLINR APPLICATION
-- ============================================================================
-- This file contains the complete schema for all tables in the application.
-- Run this in your Supabase SQL Editor to create all tables from scratch.
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: presentations
-- ============================================================================
-- Stores all presentations created by users
-- ============================================================================

CREATE TABLE IF NOT EXISTS presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL DEFAULT 'Untitled Presentation',
  description TEXT,
  thumbnail_url TEXT,
  last_opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,

  -- Foreign key to auth.users
  CONSTRAINT fk_presentations_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Indexes for presentations
CREATE INDEX IF NOT EXISTS idx_presentations_user_id
  ON presentations(user_id);

CREATE INDEX IF NOT EXISTS idx_presentations_deleted_at
  ON presentations(deleted_at);

CREATE INDEX IF NOT EXISTS idx_presentations_last_opened
  ON presentations(last_opened_at DESC);

CREATE INDEX IF NOT EXISTS idx_presentations_created_at
  ON presentations(created_at DESC);

-- Comments for presentations
COMMENT ON TABLE presentations IS 'Stores all presentations created by users';
COMMENT ON COLUMN presentations.id IS 'Primary key - unique identifier';
COMMENT ON COLUMN presentations.user_id IS 'Owner of the presentation';
COMMENT ON COLUMN presentations.title IS 'Presentation title';
COMMENT ON COLUMN presentations.description IS 'Optional presentation description';
COMMENT ON COLUMN presentations.thumbnail_url IS 'URL to presentation thumbnail image';
COMMENT ON COLUMN presentations.last_opened_at IS 'Last time the presentation was opened';
COMMENT ON COLUMN presentations.deleted_at IS 'Soft delete timestamp (NULL = not deleted)';

-- ============================================================================
-- TABLE: questions
-- ============================================================================
-- Stores questions within presentations
-- ============================================================================

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id UUID NOT NULL,
  question_type VARCHAR(50) NOT NULL,
  question_text TEXT NOT NULL,
  question_order INTEGER NOT NULL DEFAULT 0,
  options JSONB,
  correct_answer JSONB,
  points INTEGER DEFAULT 0,
  time_limit INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Foreign key to presentations
  CONSTRAINT fk_questions_presentation
    FOREIGN KEY (presentation_id)
    REFERENCES presentations(id)
    ON DELETE CASCADE,

  -- Check constraints
  CONSTRAINT chk_question_type
    CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'poll', 'word_cloud'))
);

-- Indexes for questions
CREATE INDEX IF NOT EXISTS idx_questions_presentation_id
  ON questions(presentation_id);

CREATE INDEX IF NOT EXISTS idx_questions_order
  ON questions(presentation_id, question_order);

-- Comments for questions
COMMENT ON TABLE questions IS 'Stores questions within presentations';
COMMENT ON COLUMN questions.question_type IS 'Type: multiple_choice, true_false, short_answer, poll, word_cloud';
COMMENT ON COLUMN questions.options IS 'JSON array of answer options';
COMMENT ON COLUMN questions.correct_answer IS 'JSON object containing correct answer(s)';
COMMENT ON COLUMN questions.points IS 'Points awarded for correct answer';
COMMENT ON COLUMN questions.time_limit IS 'Time limit in seconds (NULL = no limit)';

-- ============================================================================
-- TABLE: sessions
-- ============================================================================
-- Stores presentation sessions (live presentations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id UUID NOT NULL,
  host_id UUID NOT NULL,
  session_code VARCHAR(10) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'waiting',
  current_question_id UUID,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Foreign keys
  CONSTRAINT fk_sessions_presentation
    FOREIGN KEY (presentation_id)
    REFERENCES presentations(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_sessions_host
    FOREIGN KEY (host_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_sessions_current_question
    FOREIGN KEY (current_question_id)
    REFERENCES questions(id)
    ON DELETE SET NULL,

  -- Check constraints
  CONSTRAINT chk_session_status
    CHECK (status IN ('waiting', 'active', 'paused', 'ended'))
);

-- Indexes for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_presentation_id
  ON sessions(presentation_id);

CREATE INDEX IF NOT EXISTS idx_sessions_host_id
  ON sessions(host_id);

CREATE INDEX IF NOT EXISTS idx_sessions_code
  ON sessions(session_code);

CREATE INDEX IF NOT EXISTS idx_sessions_status
  ON sessions(status);

-- Comments for sessions
COMMENT ON TABLE sessions IS 'Stores live presentation sessions';
COMMENT ON COLUMN sessions.session_code IS 'Unique 6-10 character code for joining';
COMMENT ON COLUMN sessions.status IS 'Session status: waiting, active, paused, ended';
COMMENT ON COLUMN sessions.current_question_id IS 'Currently displayed question';

-- ============================================================================
-- TABLE: participants
-- ============================================================================
-- Stores participants in presentation sessions
-- ============================================================================

CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  user_id UUID,
  nickname VARCHAR(100) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  score INTEGER DEFAULT 0,

  -- Foreign keys
  CONSTRAINT fk_participants_session
    FOREIGN KEY (session_id)
    REFERENCES sessions(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_participants_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE SET NULL
);

-- Indexes for participants
CREATE INDEX IF NOT EXISTS idx_participants_session_id
  ON participants(session_id);

CREATE INDEX IF NOT EXISTS idx_participants_user_id
  ON participants(user_id);

CREATE INDEX IF NOT EXISTS idx_participants_active
  ON participants(session_id, is_active);

-- Comments for participants
COMMENT ON TABLE participants IS 'Stores participants in live sessions';
COMMENT ON COLUMN participants.user_id IS 'Authenticated user (NULL for anonymous)';
COMMENT ON COLUMN participants.nickname IS 'Display name in session';
COMMENT ON COLUMN participants.score IS 'Total points earned in session';

-- ============================================================================
-- TABLE: responses
-- ============================================================================
-- Stores participant responses to questions
-- ============================================================================

CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  question_id UUID NOT NULL,
  participant_id UUID NOT NULL,
  answer JSONB NOT NULL,
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  response_time INTEGER, -- milliseconds
  responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Foreign keys
  CONSTRAINT fk_responses_session
    FOREIGN KEY (session_id)
    REFERENCES sessions(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_responses_question
    FOREIGN KEY (question_id)
    REFERENCES questions(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_responses_participant
    FOREIGN KEY (participant_id)
    REFERENCES participants(id)
    ON DELETE CASCADE,

  -- Unique constraint: one response per participant per question
  CONSTRAINT uq_participant_question
    UNIQUE(participant_id, question_id)
);

-- Indexes for responses
CREATE INDEX IF NOT EXISTS idx_responses_session_id
  ON responses(session_id);

CREATE INDEX IF NOT EXISTS idx_responses_question_id
  ON responses(question_id);

CREATE INDEX IF NOT EXISTS idx_responses_participant_id
  ON responses(participant_id);

CREATE INDEX IF NOT EXISTS idx_responses_session_question
  ON responses(session_id, question_id);

-- Comments for responses
COMMENT ON TABLE responses IS 'Stores participant answers to questions';
COMMENT ON COLUMN responses.answer IS 'JSON object containing the answer';
COMMENT ON COLUMN responses.is_correct IS 'Whether the answer was correct';
COMMENT ON COLUMN responses.response_time IS 'Time taken to answer in milliseconds';

-- ============================================================================
-- TABLE: plans
-- ============================================================================
-- Stores pricing plans and Lemon Squeezy variant IDs
-- ============================================================================

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

-- Comments for plans
COMMENT ON TABLE plans IS 'Stores pricing plans and Lemon Squeezy variant IDs';
COMMENT ON COLUMN plans.name IS 'Public name of the plan (e.g., Pro Monthly)';
COMMENT ON COLUMN plans.lemon_variant_id IS 'Unique variant ID from Lemon Squeezy';
COMMENT ON COLUMN plans.price IS 'Price in the smallest currency unit (e.g., cents)';
COMMENT ON COLUMN plans.type IS 'Plan type: one_off, subscription, enterprise';
COMMENT ON COLUMN plans.duration IS 'Plan duration: 1_day, 3_day, 7_day, monthly, yearly';

-- ============================================================================
-- TABLE: profiles (Optional - for user information)
-- ============================================================================
-- Stores extended user profile information
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Foreign key
  CONSTRAINT fk_profiles_user
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Comments for profiles
COMMENT ON TABLE profiles IS 'Extended user profile information';
COMMENT ON COLUMN profiles.id IS 'References auth.users.id';

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for presentations
DROP TRIGGER IF EXISTS update_presentations_updated_at ON presentations;
CREATE TRIGGER update_presentations_updated_at
  BEFORE UPDATE ON presentations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for questions
DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for sessions
DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for plans
DROP TRIGGER IF EXISTS update_plans_updated_at ON plans;
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER FOR AUTOMATIC PROFILE CREATION
-- ============================================================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: presentations
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own presentations" ON presentations;
CREATE POLICY "Users can view their own presentations"
  ON presentations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Removed "Users can view shared presentations" policy

DROP POLICY IF EXISTS "Users can create their own presentations" ON presentations;
CREATE POLICY "Users can create their own presentations"
  ON presentations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own presentations" ON presentations;
CREATE POLICY "Users can update their own presentations"
  ON presentations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own presentations" ON presentations;
CREATE POLICY "Users can delete their own presentations"
  ON presentations
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES: questions
-- ============================================================================

DROP POLICY IF EXISTS "Users can view questions in their presentations" ON questions;
CREATE POLICY "Users can view questions in their presentations"
  ON questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM presentations
      WHERE presentations.id = questions.presentation_id
      AND presentations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create questions in their presentations" ON questions;
CREATE POLICY "Users can create questions in their presentations"
  ON questions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM presentations
      WHERE presentations.id = questions.presentation_id
      AND presentations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update questions in their presentations" ON questions;
CREATE POLICY "Users can update questions in their presentations"
  ON questions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM presentations
      WHERE presentations.id = questions.presentation_id
      AND presentations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete questions in their presentations" ON questions;
CREATE POLICY "Users can delete questions in their presentations"
  ON questions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM presentations
      WHERE presentations.id = questions.presentation_id
      AND presentations.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES: sessions
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own sessions" ON sessions;
CREATE POLICY "Users can view their own sessions"
  ON sessions
  FOR SELECT
  USING (auth.uid() = host_id);

DROP POLICY IF EXISTS "Users can view sessions they're participating in" ON sessions;
CREATE POLICY "Users can view sessions they're participating in"
  ON sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM participants
      WHERE participants.session_id = sessions.id
      AND (participants.user_id = auth.uid() OR participants.user_id IS NULL)
    )
  );

DROP POLICY IF EXISTS "Anyone can view sessions by code" ON sessions;
CREATE POLICY "Anyone can view sessions by code"
  ON sessions
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create sessions for their presentations" ON sessions;
CREATE POLICY "Users can create sessions for their presentations"
  ON sessions
  FOR INSERT
  WITH CHECK (
    auth.uid() = host_id AND
    EXISTS (
      SELECT 1 FROM presentations
      WHERE presentations.id = sessions.presentation_id
      AND presentations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Hosts can update their own sessions" ON sessions;
CREATE POLICY "Hosts can update their own sessions"
  ON sessions
  FOR UPDATE
  USING (auth.uid() = host_id);

DROP POLICY IF EXISTS "Hosts can delete their own sessions" ON sessions;
CREATE POLICY "Hosts can delete their own sessions"
  ON sessions
  FOR DELETE
  USING (auth.uid() = host_id);

-- ============================================================================
-- RLS POLICIES: participants
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view participants in a session" ON participants;
CREATE POLICY "Anyone can view participants in a session"
  ON participants
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can join a session" ON participants;
CREATE POLICY "Anyone can join a session"
  ON participants
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own participant record" ON participants;
CREATE POLICY "Users can update their own participant record"
  ON participants
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- ============================================================================
-- RLS POLICIES: responses
-- ============================================================================

DROP POLICY IF EXISTS "Participants can view their own responses" ON responses;
CREATE POLICY "Participants can view their own responses"
  ON responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM participants
      WHERE participants.id = responses.participant_id
      AND (participants.user_id = auth.uid() OR participants.user_id IS NULL)
    )
  );

DROP POLICY IF EXISTS "Session hosts can view all responses" ON responses;
CREATE POLICY "Session hosts can view all responses"
  ON responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = responses.session_id
      AND sessions.host_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Participants can create their own responses" ON responses;
CREATE POLICY "Participants can create their own responses"
  ON responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM participants
      WHERE participants.id = responses.participant_id
      AND (participants.user_id = auth.uid() OR participants.user_id IS NULL)
    )
  );

-- ============================================================================
-- RLS POLICIES: plans
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view pricing plans" ON plans;
CREATE POLICY "Anyone can view pricing plans"
  ON plans
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Disallow client-side plan creation" ON plans;
CREATE POLICY "Disallow client-side plan creation"
  ON plans
  FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS "Disallow client-side plan updates" ON plans;
CREATE POLICY "Disallow client-side plan updates"
  ON plans
  FOR UPDATE
  USING (false);

DROP POLICY IF EXISTS "Disallow client-side plan deletion" ON plans;
CREATE POLICY "Disallow client-side plan deletion"
  ON plans
  FOR DELETE
  USING (false);

-- ============================================================================
-- RLS POLICIES: profiles
-- ============================================================================

DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant to authenticated users
GRANT ALL ON presentations TO authenticated;
GRANT ALL ON questions TO authenticated;
GRANT ALL ON sessions TO authenticated;
GRANT ALL ON participants TO authenticated;
GRANT ALL ON responses TO authenticated;
GRANT SELECT ON plans TO authenticated;
GRANT ALL ON profiles TO authenticated;

-- Grant to anonymous users (for joining sessions via code)
GRANT SELECT ON sessions TO anon;
GRANT INSERT ON participants TO anon;
GRANT SELECT ON participants TO anon;
GRANT INSERT ON responses TO anon;
GRANT SELECT ON plans TO anon;

-- ============================================================================
-- HELPER VIEWS
-- ============================================================================

-- View for presentation statistics
CREATE OR REPLACE VIEW presentation_stats AS
SELECT
  p.id,
  p.title,
  p.user_id,
  COUNT(DISTINCT q.id) as question_count,
  COUNT(DISTINCT s.id) as session_count,
  MAX(p.last_opened_at) as last_accessed
FROM presentations p
LEFT JOIN questions q ON p.id = q.presentation_id
LEFT JOIN sessions s ON p.id = s.presentation_id
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.title, p.user_id;

-- View for session results
CREATE OR REPLACE VIEW session_results AS
SELECT
  s.id as session_id,
  s.presentation_id,
  p.nickname as participant_name,
  p.score as total_score,
  COUNT(r.id) as responses_count,
  SUM(CASE WHEN r.is_correct THEN 1 ELSE 0 END) as correct_count
FROM sessions s
JOIN participants p ON s.id = p.session_id
LEFT JOIN responses r ON p.id = r.participant_id
GROUP BY s.id, s.presentation_id, p.id, p.nickname, p.score;

-- Grant view permissions
GRANT SELECT ON presentation_stats TO authenticated;
GRANT SELECT ON session_results TO authenticated;

-- ============================================================================
-- DATA INSERTS
-- ============================================================================

-- Insert pricing plans
INSERT INTO public.plans (name, lemon_variant_id, price, type, duration)
VALUES
  ('One-Day Pass', '1077493', 8500, 'one_off', '1_day'),
  ('3-Day Pass', '1077499', 15000, 'one_off', '3_day'),
  ('7-Day Pass', '1077500', 25500, 'one_off', '7_day'),
  ('Pro Monthly', '1077500', 34000, 'subscription', 'monthly'),
  ('Pro Yearly', '1077513', 340000, 'subscription', 'yearly'),
  ('Enterprise Monthly', '1077515', 85000, 'enterprise', 'monthly'),
  ('Enterprise Yearly', '1077510', 850000, 'enterprise', 'yearly')
ON CONFLICT (lemon_variant_id) DO NOTHING;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  - presentations';
  RAISE NOTICE '  - questions';
  RAISE NOTICE '  - sessions';
  RAISE NOTICE '  - participants';
  RAISE NOTICE '  - responses';
  RAISE NOTICE '  - plans';
  RAISE NOTICE '  - profiles';
  RAISE NOTICE '';
  RAISE NOTICE 'Data inserted:';
  RAISE NOTICE '  ✓ 7 pricing plans';
  RAISE NOTICE '';
  RAISE NOTICE 'Features enabled:';
  RAISE NOTICE '  ✓ Row Level Security (RLS)';
  RAISE NOTICE '  ✓ Automatic timestamps';
  RAISE NOTICE '  ✓ Auto profile creation';
  RAISE NOTICE '  ✓ Soft deletes';
  RAISE NOTICE '  ✓ Foreign key constraints';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Verify tables: SELECT tablename FROM pg_tables WHERE schemaname = ''public'';';
  RAISE NOTICE '  2. Test RLS: Create a presentation and try to access it';
  RAISE NOTICE '  3. Restart your application';
  RAISE NOTICE '========================================';
END $$;
