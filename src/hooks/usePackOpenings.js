/**
 * Custom Hook: usePackOpenings
 * 
 * Fetches and manages pack opening history.
 */

import { useState, useEffect, useCallback } from 'react';
import { packOpeningsApi } from '../services/api/api.service';
import { logger } from '../utils/logger';
import { handleError } from '../utils/error-handler';
import { useAuth } from '../services/authentication/authentication.context';

export const usePackOpenings = (options = {}) => {
  const {
    orderBy = { column: 'created_at', ascending: false },
    limit = null,
    enabled = true,
  } = options;

  const { user } = useAuth();
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOpenings = useCallback(async () => {
    if (!enabled || !user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await packOpeningsApi.getByUserId(user.id);

      if (result.success) {
        // Apply ordering and limit client-side for now
        let data = result.data || [];
        
        if (orderBy) {
          data = [...data].sort((a, b) => {
            const aVal = a[orderBy.column];
            const bVal = b[orderBy.column];
            if (orderBy.ascending) {
              return aVal > bVal ? 1 : -1;
            }
            return aVal < bVal ? 1 : -1;
          });
        }

        if (limit) {
          data = data.slice(0, limit);
        }

        setOpenings(data);
      } else {
        throw new Error('Failed to fetch pack openings');
      }
    } catch (err) {
      const errorResult = handleError(err, 'usePackOpenings', false);
      setError(errorResult.message);
      logger.error('Error fetching pack openings', err);
      setOpenings([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, orderBy, limit, enabled]);

  useEffect(() => {
    fetchOpenings();
  }, [fetchOpenings]);

  const refetch = useCallback(() => {
    fetchOpenings();
  }, [fetchOpenings]);

  return {
    openings,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to get pack opening count
 */
export const usePackOpeningCount = (options = {}) => {
  const { enabled = true } = options;
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCount = useCallback(async () => {
    if (!enabled || !user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await packOpeningsApi.count({ user_id: user.id });

      if (result.success) {
        setCount(result.count || 0);
      } else {
        throw new Error('Failed to fetch pack opening count');
      }
    } catch (err) {
      const errorResult = handleError(err, 'usePackOpeningCount', false);
      setError(errorResult.message);
      logger.error('Error fetching pack opening count', err);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [user?.id, enabled]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  const refetch = useCallback(() => {
    fetchCount();
  }, [fetchCount]);

  return {
    count,
    loading,
    error,
    refetch,
  };
};

export default usePackOpenings;

