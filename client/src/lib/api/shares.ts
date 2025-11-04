import { AuthError, handleSupabaseError, NotFoundError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type {
  CreateShareInput,
  PresentationShare,
  ShareLinkData,
  ShareWithDetails,
  UpdateShareInput,
} from '@/types/share';

/**
 * Generate a random share token
 */
function generateShareToken(): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Get current authenticated user
 */
async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw handleSupabaseError(error, 'Failed to get user');
  }

  if (!user) {
    throw new AuthError('User not authenticated');
  }

  return user;
}

/**
 * Create a new share for a presentation
 * @throws {AuthError} if user is not authenticated
 * @throws {NotFoundError} if presentation doesn't exist
 * @throws {ApiError} if creation fails
 */
export async function createShare(
  input: CreateShareInput,
): Promise<ShareLinkData> {
  const user = await getCurrentUser();

  // Verify user owns the presentation
  const { data: presentation, error: presentationError } = await supabase
    .from('presentations')
    .select('id, user_id')
    .eq('id', input.presentation_id)
    .single();

  if (presentationError || !presentation) {
    throw new NotFoundError('Presentation', input.presentation_id);
  }

  if (presentation.user_id !== user.id) {
    throw new AuthError('You do not own this presentation');
  }

  // Generate share token
  const shareToken = generateShareToken();

  // Calculate expiry date - default to 30 days for single-use links
  let expiresAt: string | null = null;
  if (input.expires_in_days !== undefined) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + input.expires_in_days);
    expiresAt = expiry.toISOString();
  }

  // For direct shares, look up user by email
  let sharedWithUserId: string | null = null;
  if (input.share_type === 'direct' && input.shared_with) {
    const { data: sharedUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', input.shared_with)
      .single();

    if (userError || !sharedUser) {
      throw new NotFoundError('User with email', input.shared_with);
    }
    sharedWithUserId = sharedUser.id;
  }

  // Link shares are single-use by default
  const isSingleUse =
    input.is_single_use !== undefined
      ? input.is_single_use
      : input.share_type === 'link';

  // Create share
  const { data, error } = await supabase
    .from('presentation_shares')
    .insert({
      presentation_id: input.presentation_id,
      shared_by: user.id,
      shared_with: sharedWithUserId,
      permission: input.permission,
      share_token: shareToken,
      share_type: input.share_type,
      expires_at: expiresAt,
      is_single_use: isSingleUse,
      used_at: null,
    })
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error, 'Failed to create share');
  }

  if (!data) {
    throw new Error('Failed to create share: No data returned');
  }

  // Build share URL
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/app/presentation/shared/${shareToken}`;

  return {
    token: shareToken,
    url: shareUrl,
    permission: input.permission,
    expires_at: expiresAt,
    is_single_use: isSingleUse,
  };
}

/**
 * Get share by token
 * @throws {NotFoundError} if share doesn't exist or is expired
 */
export async function getShareByToken(
  token: string,
): Promise<PresentationShare> {
  const { data, error } = await supabase
    .from('presentation_shares')
    .select('*')
    .eq('share_token', token)
    .single();

  if (error || !data) {
    throw new NotFoundError('Share link');
  }

  // Check if expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    throw new Error('This share link has expired');
  }

  // Check if already used (for single-use links)
  if (data.is_single_use && data.used_at) {
    throw new Error(
      'This share link has already been used and is no longer valid',
    );
  }

  return data;
}

/**
 * Mark a share as used (for single-use links)
 * @throws {ApiError} if marking fails
 */
export async function markShareAsUsed(shareId: string): Promise<void> {
  const { error } = await supabase
    .from('presentation_shares')
    .update({
      used_at: new Date().toISOString(),
    })
    .eq('id', shareId)
    .is('used_at', null); // Only update if not already used

  if (error) {
    throw handleSupabaseError(error, 'Failed to mark share as used');
  }
}

/**
 * Get all shares for a presentation (for owner)
 * @throws {AuthError} if user is not authenticated
 */
export async function getPresentationShares(
  presentationId: string,
): Promise<PresentationShare[]> {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('presentation_shares')
    .select('*')
    .eq('presentation_id', presentationId)
    .eq('shared_by', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw handleSupabaseError(error, 'Failed to fetch shares');
  }

  return data || [];
}

/**
 * Get all presentations shared with current user
 * @throws {AuthError} if user is not authenticated
 */
export async function getSharedWithMe(): Promise<ShareWithDetails[]> {
  const user = await getCurrentUser();

  // Fetch shares with presentation data
  const { data, error } = await supabase
    .from('presentation_shares')
    .select(
      `
      *,
      presentation:presentations (
        id,
        title,
        description,
        thumbnail_url,
        updated_at
      )
    `,
    )
    .eq('shared_with', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw handleSupabaseError(error, 'Failed to fetch shared presentations');
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Map the data to include placeholder user info
  // In a production app, you'd fetch this from a profiles table or user service
  const result = data.map(
    (
      share: PresentationShare & {
        presentation: {
          id: string;
          title: string;
          description: string | null;
          thumbnail_url: string | null;
          updated_at: string;
        };
      },
    ) => {
      return {
        ...share,
        shared_by_user: {
          id: share.shared_by,
          email: 'shared-user@example.com',
          full_name: 'Shared User',
        },
      };
    },
  );

  return result as unknown as ShareWithDetails[];
}

/**
 * Update a share's permissions or expiry
 * @throws {AuthError} if user doesn't own the share
 */
export async function updateShare(
  shareId: string,
  input: UpdateShareInput,
): Promise<PresentationShare> {
  const user = await getCurrentUser();

  // Verify ownership
  const { data: existingShare, error: checkError } = await supabase
    .from('presentation_shares')
    .select('shared_by')
    .eq('id', shareId)
    .single();

  if (checkError || !existingShare) {
    throw new NotFoundError('Share', shareId);
  }

  if (existingShare.shared_by !== user.id) {
    throw new AuthError('You do not own this share');
  }

  const { data, error } = await supabase
    .from('presentation_shares')
    .update(input)
    .eq('id', shareId)
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error, 'Failed to update share');
  }

  if (!data) {
    throw new NotFoundError('Share', shareId);
  }

  return data;
}

/**
 * Delete a share
 * @throws {AuthError} if user doesn't own the share
 */
export async function deleteShare(shareId: string): Promise<void> {
  const user = await getCurrentUser();

  // Verify ownership
  const { data: existingShare, error: checkError } = await supabase
    .from('presentation_shares')
    .select('shared_by')
    .eq('id', shareId)
    .single();

  if (checkError || !existingShare) {
    throw new NotFoundError('Share', shareId);
  }

  if (existingShare.shared_by !== user.id) {
    throw new AuthError('You do not own this share');
  }

  const { error } = await supabase
    .from('presentation_shares')
    .delete()
    .eq('id', shareId);

  if (error) {
    throw handleSupabaseError(error, 'Failed to delete share');
  }
}

/**
 * Revoke all shares for a presentation
 * @throws {AuthError} if user doesn't own the presentation
 */
export async function revokeAllShares(presentationId: string): Promise<number> {
  const user = await getCurrentUser();

  // Verify ownership
  const { data: presentation, error: presentationError } = await supabase
    .from('presentations')
    .select('user_id')
    .eq('id', presentationId)
    .single();

  if (presentationError || !presentation) {
    throw new NotFoundError('Presentation', presentationId);
  }

  if (presentation.user_id !== user.id) {
    throw new AuthError('You do not own this presentation');
  }

  const { data, error } = await supabase
    .from('presentation_shares')
    .delete()
    .eq('presentation_id', presentationId)
    .eq('shared_by', user.id)
    .select('id');

  if (error) {
    throw handleSupabaseError(error, 'Failed to revoke shares');
  }

  return data?.length || 0;
}

/**
 * Check if current user has access to a presentation
 * Returns the permission level or null if no access
 */
export async function checkPresentationAccess(
  presentationId: string,
): Promise<{ canView: boolean; canEdit: boolean; isOwner: boolean }> {
  const user = await getCurrentUser();

  // Check if owner
  const { data: presentation } = await supabase
    .from('presentations')
    .select('user_id')
    .eq('id', presentationId)
    .single();

  if (presentation?.user_id === user.id) {
    return { canView: true, canEdit: true, isOwner: true };
  }

  // Check if shared with user
  const { data: share } = await supabase
    .from('presentation_shares')
    .select('permission, expires_at, is_single_use, used_at')
    .eq('presentation_id', presentationId)
    .eq('shared_with', user.id)
    .single();

  if (!share) {
    return { canView: false, canEdit: false, isOwner: false };
  }

  // Check if expired
  if (share.expires_at && new Date(share.expires_at) < new Date()) {
    return { canView: false, canEdit: false, isOwner: false };
  }

  // Check if used (for single-use links)
  if (share.is_single_use && share.used_at) {
    return { canView: false, canEdit: false, isOwner: false };
  }

  return {
    canView: true,
    canEdit: share.permission === 'edit',
    isOwner: false,
  };
}

/**
 * Get presentation via share token (for anonymous or authenticated access)
 * This marks the share as used if it's a single-use link
 */
export async function getPresentationByShareToken(token: string): Promise<{
  presentation: unknown;
  permission: 'view' | 'edit';
  shareId: string;
}> {
  const share = await getShareByToken(token);

  const { data: presentation, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', share.presentation_id)
    .single();

  if (error || !presentation) {
    throw new NotFoundError('Presentation');
  }

  // Mark as used if it's a single-use link
  if (share.is_single_use && !share.used_at) {
    await markShareAsUsed(share.id);
  }

  return {
    presentation,
    permission: share.permission,
    shareId: share.id,
  };
}
