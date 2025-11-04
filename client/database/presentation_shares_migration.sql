-- Migration for Presentation Sharing Feature
-- This creates the necessary tables and RLS policies for sharing presentations

-- Create presentation_shares table
CREATE TABLE IF NOT EXISTS presentation_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id UUID NOT NULL,
  shared_by UUID NOT NULL,
  shared_with UUID, -- NULL for link shares
  permission VARCHAR(10) NOT NULL CHECK (permission IN ('view', 'edit')),
  share_token VARCHAR(255) NOT NULL UNIQUE,
  share_type VARCHAR(10) NOT NULL CHECK (share_type IN ('direct', 'link')),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_single_use BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Foreign key constraints with explicit names
  CONSTRAINT fk_presentation_shares_presentation
    FOREIGN KEY (presentation_id)
    REFERENCES presentations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_presentation_shares_shared_by
    FOREIGN KEY (shared_by)
    REFERENCES auth.users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_presentation_shares_shared_with
    FOREIGN KEY (shared_with)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create index on share_token for fast lookups
CREATE INDEX IF NOT EXISTS idx_presentation_shares_token ON presentation_shares(share_token);

-- Create index on presentation_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_presentation_shares_presentation_id ON presentation_shares(presentation_id);

-- Create index on shared_with for fast lookups
CREATE INDEX IF NOT EXISTS idx_presentation_shares_shared_with ON presentation_shares(shared_with);

-- Create index on shared_by for fast lookups
CREATE INDEX IF NOT EXISTS idx_presentation_shares_shared_by ON presentation_shares(shared_by);

-- Create a profiles table if it doesn't exist (for user information)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Foreign key constraint with explicit name
  CONSTRAINT fk_profiles_user
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to presentation_shares
DROP TRIGGER IF EXISTS update_presentation_shares_updated_at ON presentation_shares;
CREATE TRIGGER update_presentation_shares_updated_at
  BEFORE UPDATE ON presentation_shares
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE presentation_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view shares they created" ON presentation_shares;
DROP POLICY IF EXISTS "Users can view shares shared with them" ON presentation_shares;
DROP POLICY IF EXISTS "Users can create shares for their presentations" ON presentation_shares;
DROP POLICY IF EXISTS "Users can update shares they created" ON presentation_shares;
DROP POLICY IF EXISTS "Users can delete shares they created" ON presentation_shares;
DROP POLICY IF EXISTS "Anyone can view share by token" ON presentation_shares;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- RLS Policies for presentation_shares

-- Policy: Users can view shares they created
CREATE POLICY "Users can view shares they created"
  ON presentation_shares
  FOR SELECT
  USING (auth.uid() = shared_by);

-- Policy: Users can view shares shared with them
CREATE POLICY "Users can view shares shared with them"
  ON presentation_shares
  FOR SELECT
  USING (auth.uid() = shared_with);

-- Policy: Users can create shares for their presentations
CREATE POLICY "Users can create shares for their presentations"
  ON presentation_shares
  FOR INSERT
  WITH CHECK (
    auth.uid() = shared_by AND
    EXISTS (
      SELECT 1 FROM presentations
      WHERE presentations.id = presentation_shares.presentation_id
      AND presentations.user_id = auth.uid()
    )
  );

-- Policy: Users can update shares they created
CREATE POLICY "Users can update shares they created"
  ON presentation_shares
  FOR UPDATE
  USING (auth.uid() = shared_by)
  WITH CHECK (auth.uid() = shared_by);

-- Policy: Users can delete shares they created
CREATE POLICY "Users can delete shares they created"
  ON presentation_shares
  FOR DELETE
  USING (auth.uid() = shared_by);

-- Policy: Anyone can view share by token (for anonymous access)
-- This is needed for the share link to work before authentication
CREATE POLICY "Anyone can view share by token"
  ON presentation_shares
  FOR SELECT
  USING (true);

-- RLS Policies for profiles

-- Policy: Users can view all profiles (for displaying shared_by info)
CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT ALL ON presentation_shares TO authenticated;
GRANT SELECT ON presentation_shares TO anon;
GRANT ALL ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- Comments for documentation
COMMENT ON TABLE presentation_shares IS 'Stores presentation sharing information with support for single-use links';
COMMENT ON COLUMN presentation_shares.share_token IS 'Unique token used in share URLs';
COMMENT ON COLUMN presentation_shares.is_single_use IS 'Whether this link can only be used once';
COMMENT ON COLUMN presentation_shares.used_at IS 'Timestamp when the link was first accessed (for single-use links)';
COMMENT ON COLUMN presentation_shares.share_type IS 'Type of share: direct (to specific user) or link (anyone with token)';
COMMENT ON COLUMN presentation_shares.permission IS 'Access level: view or edit';
