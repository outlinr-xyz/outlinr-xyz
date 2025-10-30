import { useCallback, useEffect, useState } from 'react';

import {
  getPresentations,
  getRecentPresentations,
} from '@/lib/api/presentations';
import type { Presentation } from '@/types/presentation';

interface UsePresentationsOptions {
  page?: number;
  pageSize?: number;
  autoFetch?: boolean;
}

interface UsePresentationsReturn {
  presentations: Presentation[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  total: number;
  page: number;
  setPage: (page: number) => void;
}

export function usePresentations(
  options: UsePresentationsOptions = {},
): UsePresentationsReturn {
  const { page: initialPage = 1, pageSize = 9, autoFetch = true } = options;

  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchPresentations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getPresentations(page, pageSize);
      setPresentations(result.data);
      setHasMore(result.hasMore);
      setTotal(result.total);
    } catch (err) {
      console.error('Failed to fetch presentations:', err);
      setError('Failed to load presentations');
      setPresentations([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    if (autoFetch) {
      fetchPresentations();
    }
  }, [autoFetch, fetchPresentations]);

  return {
    presentations,
    isLoading,
    error,
    refetch: fetchPresentations,
    hasMore,
    total,
    page,
    setPage,
  };
}

interface UseRecentPresentationsReturn {
  presentations: Presentation[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRecentPresentations(): UseRecentPresentationsReturn {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPresentations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getRecentPresentations();
      setPresentations(data);
    } catch (err) {
      console.error('Failed to fetch recent presentations:', err);
      setError('Failed to load presentations');
      setPresentations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPresentations();
  }, [fetchPresentations]);

  return {
    presentations,
    isLoading,
    error,
    refetch: fetchPresentations,
  };
}
