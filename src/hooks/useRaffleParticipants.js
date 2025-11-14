/**
 * Custom Hook: useRaffleParticipants
 * 
 * Fetches and manages raffle participation data.
 */

import { useState, useEffect, useCallback } from 'react';
import { raffleParticipantsApi } from '../services/api/api.service';
import { logger } from '../utils/logger';
import { handleError } from '../utils/error-handler';
import { useAuth } from '../services/authentication/authentication.context';

export const useRaffleParticipants = (options = {}) => {
  const {
    raffleId = null,
    enabled = true,
  } = options;

  const { user } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchParticipants = useCallback(async () => {
    if (!enabled || !user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const filters = { user_id: user.id };
      if (raffleId) {
        filters.raffle_id = raffleId;
      }

      const result = await raffleParticipantsApi.getByUserId(user.id);

      if (result.success) {
        let data = result.data || [];
        
        if (raffleId) {
          data = data.filter(p => p.raffle_id === raffleId);
        }

        setParticipants(data);
      } else {
        throw new Error('Failed to fetch raffle participants');
      }
    } catch (err) {
      const errorResult = handleError(err, 'useRaffleParticipants', false);
      setError(errorResult.message);
      logger.error('Error fetching raffle participants', err);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, raffleId, enabled]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const refetch = useCallback(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  return {
    participants,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to get raffle participation count
 */
export const useRaffleParticipationCount = (options = {}) => {
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
      const result = await raffleParticipantsApi.count({ user_id: user.id });

      if (result.success) {
        setCount(result.count || 0);
      } else {
        throw new Error('Failed to fetch raffle participation count');
      }
    } catch (err) {
      const errorResult = handleError(err, 'useRaffleParticipationCount', false);
      setError(errorResult.message);
      logger.error('Error fetching raffle participation count', err);
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

export default useRaffleParticipants;

