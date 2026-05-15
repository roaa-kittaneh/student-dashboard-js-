import { useCallback, useEffect, useState } from 'react';
import { studentsApi } from '../api/students';
import { extractError } from '../api/client';

/**
 * Parallel fetch of overview stats + recent students.
 * Centralized error handling so the page just consumes {data, loading, error}.
 */
export function useOverviewData({ recentLimit = 6 } = {}) {
  const [data, setData] = useState({ stats: null, recent: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [stats, list] = await Promise.all([
        studentsApi.stats(),
        studentsApi.list({ page: 1, pageSize: recentLimit }),
      ]);
      setData({ stats, recent: list.items });
    } catch (e) {
      setError(extractError(e, 'Failed to load dashboard'));
    } finally {
      setLoading(false);
    }
  }, [recentLimit]);

  useEffect(() => { refetch(); }, [refetch]);

  return { ...data, loading, error, refetch };
}
