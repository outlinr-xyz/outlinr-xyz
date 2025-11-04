import { appConfig } from '@/config/app';
import { AuthError, handleSupabaseError, NotFoundError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type {
  CreatePresentationInput,
  PaginatedPresentations,
  Presentation,
  UpdatePresentationInput,
} from '@/types/presentation';

/**
 * Get current authenticated user
 * @throws {AuthError} if user is not authenticated
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
 * Create a new presentation
 * @throws {AuthError} if user is not authenticated
 * @throws {ApiError} if creation fails
 */
export async function createPresentation(
  input: CreatePresentationInput = {},
): Promise<Presentation> {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('presentations')
    .insert({
      title: input.title || appConfig.presentation.defaultTitle,
      description:
        input.description || appConfig.presentation.defaultDescription,
      user_id: user.id,
      last_opened_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error, 'Failed to create presentation');
  }

  if (!data) {
    throw new Error('Failed to create presentation: No data returned');
  }

  return data;
}

/**
 * Get a single presentation by ID
 * @throws {NotFoundError} if presentation doesn't exist
 * @throws {ApiError} if fetch fails
 */
export async function getPresentation(id: string): Promise<Presentation> {
  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError('Presentation', id);
    }
    throw handleSupabaseError(error, 'Failed to fetch presentation');
  }

  if (!data) {
    throw new NotFoundError('Presentation', id);
  }

  return data;
}

/**
 * Get recently opened presentations (configurable limit)
 * @throws {AuthError} if user is not authenticated
 * @throws {ApiError} if fetch fails
 */
export async function getRecentPresentations(
  limit: number = appConfig.pagination.recentPresentationsLimit,
): Promise<Presentation[]> {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('last_opened_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw handleSupabaseError(error, 'Failed to fetch recent presentations');
  }

  return data || [];
}

/**
 * Get paginated presentations
 * @throws {AuthError} if user is not authenticated
 * @throws {ApiError} if fetch fails
 */
export async function getPresentations(
  page: number = 1,
  pageSize: number = appConfig.pagination.defaultPageSize,
): Promise<PaginatedPresentations> {
  const user = await getCurrentUser();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Get total count
  const { count, error: countError } = await supabase
    .from('presentations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .is('deleted_at', null);

  if (countError) {
    throw handleSupabaseError(countError, 'Failed to count presentations');
  }

  // Get paginated data
  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw handleSupabaseError(error, 'Failed to fetch presentations');
  }

  const total = count || 0;

  return {
    data: data || [],
    total,
    page,
    pageSize,
    hasMore: to < total - 1,
  };
}

/**
 * Update a presentation
 * @throws {NotFoundError} if presentation doesn't exist
 * @throws {ApiError} if update fails
 */
export async function updatePresentation(
  id: string,
  input: UpdatePresentationInput,
): Promise<Presentation> {
  const updateData: Record<string, unknown> = { ...input };

  // Remove updated_at since it's handled by database trigger
  delete updateData.updated_at;

  const { data, error } = await supabase
    .from('presentations')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError('Presentation', id);
    }
    throw handleSupabaseError(error, 'Failed to update presentation');
  }

  if (!data) {
    throw new NotFoundError('Presentation', id);
  }

  return data;
}

/**
 * Update last_opened_at timestamp
 * @throws {ApiError} if update fails
 */
export async function updateLastOpened(id: string): Promise<void> {
  const { error } = await supabase
    .from('presentations')
    .update({
      last_opened_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw handleSupabaseError(error, 'Failed to update last opened timestamp');
  }
}

/**
 * Soft delete a presentation (move to trash)
 * @throws {ApiError} if deletion fails
 */
export async function deletePresentation(id: string): Promise<void> {
  const { error } = await supabase
    .from('presentations')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw handleSupabaseError(error, 'Failed to delete presentation');
  }
}

/**
 * Permanently delete a presentation
 * @throws {ApiError} if deletion fails
 */
export async function permanentlyDeletePresentation(id: string): Promise<void> {
  const { error } = await supabase.from('presentations').delete().eq('id', id);

  if (error) {
    throw handleSupabaseError(
      error,
      'Failed to permanently delete presentation',
    );
  }
}

/**
 * Restore a soft-deleted presentation from trash
 * @throws {ApiError} if restore fails
 */
export async function restorePresentation(id: string): Promise<void> {
  const { error } = await supabase
    .from('presentations')
    .update({
      deleted_at: null,
    })
    .eq('id', id);

  if (error) {
    throw handleSupabaseError(error, 'Failed to restore presentation');
  }
}

/**
 * Get deleted presentations (trash)
 * @throws {AuthError} if user is not authenticated
 * @throws {ApiError} if fetch fails
 */
export async function getDeletedPresentations(): Promise<Presentation[]> {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('user_id', user.id)
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false });

  if (error) {
    throw handleSupabaseError(error, 'Failed to fetch deleted presentations');
  }

  return data || [];
}

/**
 * Automatically delete presentations that have been in trash for 30+ days
 * @returns Number of presentations permanently deleted
 * @throws {AuthError} if user is not authenticated
 * @throws {ApiError} if cleanup fails
 */
export async function cleanupOldDeletedPresentations(): Promise<number> {
  const user = await getCurrentUser();

  const cutoffDate = new Date();
  cutoffDate.setDate(
    cutoffDate.getDate() - appConfig.trash.daysUntilPermanentDeletion,
  );

  const { data, error } = await supabase
    .from('presentations')
    .delete()
    .eq('user_id', user.id)
    .not('deleted_at', 'is', null)
    .lt('deleted_at', cutoffDate.toISOString())
    .select('id');

  if (error) {
    throw handleSupabaseError(error, 'Failed to cleanup old presentations');
  }

  return data?.length || 0;
}

/**
 * Batch delete multiple presentations
 * @param ids Array of presentation IDs to delete
 * @throws {ApiError} if deletion fails
 */
export async function batchDeletePresentations(ids: string[]): Promise<void> {
  if (ids.length === 0) return;

  const { error } = await supabase
    .from('presentations')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .in('id', ids);

  if (error) {
    throw handleSupabaseError(error, 'Failed to batch delete presentations');
  }
}

/**
 * Batch restore multiple presentations
 * @param ids Array of presentation IDs to restore
 * @throws {ApiError} if restore fails
 */
export async function batchRestorePresentations(ids: string[]): Promise<void> {
  if (ids.length === 0) return;

  const { error } = await supabase
    .from('presentations')
    .update({
      deleted_at: null,
    })
    .in('id', ids);

  if (error) {
    throw handleSupabaseError(error, 'Failed to batch restore presentations');
  }
}

/**
 * Batch permanently delete multiple presentations
 * @param ids Array of presentation IDs to permanently delete
 * @throws {ApiError} if deletion fails
 */
export async function batchPermanentlyDeletePresentations(
  ids: string[],
): Promise<void> {
  if (ids.length === 0) return;

  const { error } = await supabase.from('presentations').delete().in('id', ids);

  if (error) {
    throw handleSupabaseError(
      error,
      'Failed to batch permanently delete presentations',
    );
  }
}
