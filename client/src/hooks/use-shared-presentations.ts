import { useCallback, useEffect, useState } from 'react';

import { getSharedWithMe } from '@/lib/api/shares';
import { formatErrorMessage } from '@/lib/errors';
import type { ShareWithDetails } from '@/types/share';

interface UseSharedPresentationsReturn {
  shares: ShareWithDetails[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching presentations shared with the current user
 */
export function useSharedPresentations(): UseSharedPresentationsReturn {
  const [shares, setShares] = useState<ShareWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShares = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSharedWithMe();

      // Filter out expired shares
      const validShares = data.filter((share) => {
        if (!share.expires_at) return true;
        return new Date(share.expires_at) > new Date();
      });

      setShares(validShares);
    } catch (err) {
      console.error('Failed to fetch shared presentations:', err);
      setError(formatErrorMessage(err));
      setShares([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShares();
  }, [fetchShares]);

  return {
    shares,
    isLoading,
    error,
    refetch: fetchShares,
  };
}
