/**
 * Presentation-specific utility functions
 */

/**
 * Filter presentations by search query
 */
export function filterPresentations<
  T extends { title: string; description?: string | null },
>(presentations: T[], searchQuery: string): T[] {
  if (!searchQuery.trim()) {
    return presentations;
  }

  const query = searchQuery.toLowerCase().trim();

  return presentations.filter((presentation) => {
    const titleMatch = presentation.title.toLowerCase().includes(query);
    const descriptionMatch = presentation.description
      ? presentation.description.toLowerCase().includes(query)
      : false;

    return titleMatch || descriptionMatch;
  });
}

/**
 * Sort presentations by different criteria
 */
export function sortPresentations<
  T extends {
    created_at: string;
    updated_at: string;
    last_opened_at: string;
    title: string;
  },
>(
  presentations: T[],
  sortBy: 'created' | 'updated' | 'opened' | 'title' = 'created',
  order: 'asc' | 'desc' = 'desc',
): T[] {
  const sorted = [...presentations].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'created':
        comparison =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'updated':
        comparison =
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        break;
      case 'opened':
        comparison =
          new Date(a.last_opened_at).getTime() -
          new Date(b.last_opened_at).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}
