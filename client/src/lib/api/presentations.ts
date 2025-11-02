import { supabase } from '@/lib/supabase';
import type {
  CreatePresentationInput,
  PaginatedPresentations,
  Presentation,
  UpdatePresentationInput,
} from '@/types/presentation';

/**
 * Create a new presentation
 */
export async function createPresentation(
  input: CreatePresentationInput = {},
): Promise<Presentation> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('presentations')
    .insert({
      title: input.title || 'Untitled Presentation',
      description: input.description || null,
      user_id: user.id,
      last_opened_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create presentation: ${error.message}`);
  }

  return data;
}

/**
 * Get a single presentation by ID
 */
export async function getPresentation(id: string): Promise<Presentation> {
  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch presentation: ${error.message}`);
  }

  return data;
}

/**
 * Get recently opened presentations (top 3)
 */
export async function getRecentPresentations(): Promise<Presentation[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('last_opened_at', { ascending: false })
    .limit(3);

  if (error) {
    throw new Error(`Failed to fetch recent presentations: ${error.message}`);
  }

  return data || [];
}

/**
 * Get paginated presentations
 */
export async function getPresentations(
  page: number = 1,
  pageSize: number = 9,
): Promise<PaginatedPresentations> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Get total count
  const { count } = await supabase
    .from('presentations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .is('deleted_at', null);

  // Get paginated data
  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch presentations: ${error.message}`);
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
 */
export async function updatePresentation(
  id: string,
  input: UpdatePresentationInput,
): Promise<Presentation> {
  const updateData: Record<string, unknown> = { ...input };

  // Remove updated_at since it's handled by trigger
  delete updateData.updated_at;

  const { data, error } = await supabase
    .from('presentations')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update presentation: ${error.message}`);
  }

  return data;
}

/**
 * Update last_opened_at timestamp
 */
export async function updateLastOpened(id: string): Promise<void> {
  const { error } = await supabase
    .from('presentations')
    .update({
      last_opened_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update last opened: ${error.message}`);
  }
}

/**
 * Soft delete a presentation
 */
export async function deletePresentation(id: string): Promise<void> {
  const { error } = await supabase
    .from('presentations')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete presentation: ${error.message}`);
  }
}

/**
 * Permanently delete a presentation
 */
export async function permanentlyDeletePresentation(id: string): Promise<void> {
  const { error } = await supabase.from('presentations').delete().eq('id', id);

  if (error) {
    throw new Error(
      `Failed to permanently delete presentation: ${error.message}`,
    );
  }
}

/**
 * Restore a soft-deleted presentation
 */
export async function restorePresentation(id: string): Promise<void> {
  const { error } = await supabase
    .from('presentations')
    .update({
      deleted_at: null,
    })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to restore presentation: ${error.message}`);
  }
}

/**
 * Get deleted presentations (trash)
 */
export async function getDeletedPresentations(): Promise<Presentation[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('user_id', user.id)
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch deleted presentations: ${error.message}`);
  }

  return data || [];
}
