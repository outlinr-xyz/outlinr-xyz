/**
 * Types for presentation sharing functionality
 */

export type SharePermission = 'view' | 'edit';

export type ShareType = 'direct' | 'link';

export interface PresentationShare {
  id: string;
  presentation_id: string;
  shared_by: string;
  shared_with: string | null; // null for link shares
  permission: SharePermission;
  share_token: string; // unique token for URL
  share_type: ShareType;
  expires_at: string | null;
  used_at: string | null; // timestamp when link was first used (for single-use links)
  is_single_use: boolean; // whether this is a single-use link
  created_at: string;
  updated_at: string;
}

export interface ShareWithDetails extends PresentationShare {
  presentation: {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    updated_at: string;
  };
  shared_by_user: {
    id: string;
    email: string;
    full_name: string | null;
  };
}

export interface ShareMetrics {
  total_shares: number;
  active_shares: number;
  expired_shares: number;
  used_shares: number;
}

export interface CreateShareInput {
  presentation_id: string;
  permission: SharePermission;
  share_type: ShareType;
  shared_with?: string; // email or user_id for direct shares
  expires_in_days?: number;
  is_single_use?: boolean; // whether this is a single-use link (default: true for link shares)
}

export interface UpdateShareInput {
  permission?: SharePermission;
  expires_at?: string | null;
}

export interface ShareLinkData {
  token: string;
  url: string;
  permission: SharePermission;
  expires_at: string | null;
  is_single_use: boolean;
}

/**
 * Check if a share has expired
 */
export function isShareExpired(share: PresentationShare): boolean {
  if (!share.expires_at) return false;
  return new Date(share.expires_at) < new Date();
}

/**
 * Check if a share has been used (for single-use links)
 */
export function isShareUsed(share: PresentationShare): boolean {
  return share.is_single_use && share.used_at !== null;
}

/**
 * Check if a share is still valid (not expired and not used if single-use)
 */
export function isShareValid(share: PresentationShare): boolean {
  if (isShareExpired(share)) return false;
  if (isShareUsed(share)) return false;
  return true;
}

/**
 * Check if a share allows editing
 */
export function canEdit(share: PresentationShare): boolean {
  return share.permission === 'edit' && !isShareExpired(share);
}

/**
 * Check if a share allows viewing
 */
export function canView(share: PresentationShare): boolean {
  return !isShareExpired(share);
}
