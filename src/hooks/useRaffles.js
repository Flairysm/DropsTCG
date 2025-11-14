/**
 * Custom Hook: useRaffles
 * 
 * Fetches and manages raffle data with loading and error states.
 */

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api/api.service';
import { TABLES } from '../constants/tables';
import { logger } from '../utils/logger';
import { handleError } from '../utils/error-handler';

export const useRaffles = (options = {}) => {
  const {
    filters = {},
    orderBy = { column: 'created_at', ascending: false },
    limit = null,
    enabled = true,
  } = options;

  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRaffles = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.select(TABLES.RAFFLES, {
        filters: { ...filters, is_active: true },
        orderBy,
        limit,
        context: 'fetch raffles',
      });

      if (result.success) {
        setRaffles(result.data || []);
      } else {
        throw new Error('Failed to fetch raffles');
      }
    } catch (err) {
      const errorResult = handleError(err, 'useRaffles', false);
      setError(errorResult.message);
      logger.error('Error fetching raffles', err);
      setRaffles([]);
    } finally {
      setLoading(false);
    }
  }, [filters, orderBy, limit, enabled]);

  useEffect(() => {
    fetchRaffles();
  }, [fetchRaffles]);

  const refetch = useCallback(() => {
    fetchRaffles();
  }, [fetchRaffles]);

  return {
    raffles,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch a single raffle by ID
 */
export const useRaffle = (raffleId, options = {}) => {
  const { enabled = true } = options;

  const [raffle, setRaffle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRaffle = useCallback(async () => {
    if (!enabled || !raffleId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.select(TABLES.RAFFLES, {
        filters: { id: raffleId },
        single: true,
        context: `fetch raffle ${raffleId}`,
      });

      if (result.success) {
        setRaffle(result.data);
      } else {
        throw new Error('Failed to fetch raffle');
      }
    } catch (err) {
      const errorResult = handleError(err, 'useRaffle', false);
      setError(errorResult.message);
      logger.error('Error fetching raffle', err);
      setRaffle(null);
    } finally {
      setLoading(false);
    }
  }, [raffleId, enabled]);

  useEffect(() => {
    fetchRaffle();
  }, [fetchRaffle]);

  const refetch = useCallback(() => {
    fetchRaffle();
  }, [fetchRaffle]);

  return {
    raffle,
    loading,
    error,
    refetch,
  };
};

export default useRaffles;

