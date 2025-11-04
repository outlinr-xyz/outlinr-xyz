/**
 * Date utility functions for formatting and manipulating dates
 */

/**
 * Format a date as relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  if (seconds < 60) {
    return 'just now';
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'just now';
}

/**
 * Format a date as absolute date (e.g., "Jan 15, 2024")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date as short date (e.g., "01/15/24")
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  });
}

/**
 * Calculate days remaining until permanent deletion (30 days from deletion)
 */
export function getDaysUntilPermanentDeletion(deletedAt: string): number {
  const deletionDate = new Date(deletedAt);
  const permanentDeletionDate = new Date(deletionDate);
  permanentDeletionDate.setDate(permanentDeletionDate.getDate() + 30);

  const now = new Date();
  const daysRemaining = Math.ceil(
    (permanentDeletionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  return Math.max(0, daysRemaining);
}

/**
 * Format trash item metadata with days remaining
 */
export function formatTrashItemMetadata(deletedAt: string): string {
  const daysRemaining = getDaysUntilPermanentDeletion(deletedAt);
  const deletionDate = formatDate(deletedAt);

  if (daysRemaining === 0) {
    return `Deleted ${deletionDate} • Deleting today`;
  } else if (daysRemaining === 1) {
    return `Deleted ${deletionDate} • 1 day left`;
  } else {
    return `Deleted ${deletionDate} • ${daysRemaining} days left`;
  }
}

/**
 * Check if a presentation should be permanently deleted (30+ days in trash)
 */
export function shouldPermanentlyDelete(deletedAt: string): boolean {
  return getDaysUntilPermanentDeletion(deletedAt) === 0;
}
