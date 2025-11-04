-- Simplified Migration for Presentation Sharing Feature
-- This creates the presentation_shares table without external profile dependencies

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
  is_single_use BOOLEAN NOT NULL DEFAULT true,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for presentations (assuming presentations table exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_presentation_shares_presentation'
  ) THEN
    ALTER TABLE presentation_shares
    ADD CONSTRAINT fk_presentation_shares_presentation
    FOREIGN KEY (presentation_id)
    REFERENCES presentations(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_presentation_shares_token
  ON presentation_shares(share_token);

CREATE INDEX IF NOT EXISTS idx_presentation_shares_presentation_id
  ON presentation_shares(presentation_id);

CREATE INDEX IF NOT EXISTS idx_presentation_shares_shared_with
  ON presentation_shares(shared_with)
  WHERE shared_with IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_presentation_shares_shared_by
  ON presentation_shares(shared_by);

CREATE INDEX IF NOT EXISTS idx_presentation_shares_expires_at
  ON presentation_shares(expires_at)
  WHERE expires_at IS NOT NULL;

-- Trigger function to automatically update updated_at timestamp
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

-- Enable Row Level Security
ALTER TABLE presentation_shares ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view shares they created" ON presentation_shares;
DROP POLICY IF EXISTS "Users can view shares shared with them" ON presentation_shares;
DROP POLICY IF EXISTS "Users can view shares by token" ON presentation_shares;
DROP POLICY IF EXISTS "Users can create shares for their presentations" ON presentation_shares;
DROP POLICY IF EXISTS "Users can update shares they created" ON presentation_shares;
DROP POLICY IF EXISTS "Users can delete shares they created" ON presentation_shares;

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

-- Policy: Anyone can view share by token (needed for share link access)
CREATE POLICY "Users can view shares by token"
  ON presentation_shares
  FOR SELECT
  USING (true);

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

-- Grant permissions
GRANT ALL ON presentation_shares TO authenticated;
GRANT SELECT ON presentation_shares TO anon;

-- Comments for documentation
COMMENT ON TABLE presentation_shares IS 'Stores presentation sharing information with support for single-use links';
COMMENT ON COLUMN presentation_shares.id IS 'Primary key';
COMMENT ON COLUMN presentation_shares.presentation_id IS 'Reference to the shared presentation';
COMMENT ON COLUMN presentation_shares.shared_by IS 'User who created the share';
COMMENT ON COLUMN presentation_shares.shared_with IS 'User the presentation is shared with (NULL for link shares)';
COMMENT ON COLUMN presentation_shares.share_token IS 'Unique token used in share URLs';
COMMENT ON COLUMN presentation_shares.is_single_use IS 'Whether this link can only be used once';
COMMENT ON COLUMN presentation_shares.used_at IS 'Timestamp when the link was first accessed (for single-use links)';
COMMENT ON COLUMN presentation_shares.share_type IS 'Type of share: direct (to specific user) or link (anyone with token)';
COMMENT ON COLUMN presentation_shares.permission IS 'Access level: view or edit';
COMMENT ON COLUMN presentation_shares.expires_at IS 'Optional expiration timestamp';

-- Create a view for easier querying of shares with user emails
CREATE OR REPLACE VIEW presentation_shares_with_user_info AS
SELECT
  ps.*,
  shared_by_auth.email as shared_by_email,
  shared_by_auth.raw_user_meta_data->>'full_name' as shared_by_name,
  shared_with_auth.email as shared_with_email,
  shared_with_auth.raw_user_meta_data->>'full_name' as shared_with_name,
  p.title as presentation_title,
  p.description as presentation_description,
  p.thumbnail_url as presentation_thumbnail_url
FROM presentation_shares ps
LEFT JOIN auth.users shared_by_auth ON ps.shared_by = shared_by_auth.id
LEFT JOIN auth.users shared_with_auth ON ps.shared_with = shared_with_auth.id
LEFT JOIN presentations p ON ps.presentation_id = p.id;

-- Grant access to the view
GRANT SELECT ON presentation_shares_with_user_info TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Presentation shares migration completed successfully!';
  RAISE NOTICE 'Table: presentation_shares created with RLS enabled';
  RAISE NOTICE 'View: presentation_shares_with_user_info created for easier querying';
END $$;
