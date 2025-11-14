/**
 * Custom Hook: useUserCards
 * 
 * Fetches and manages user card collection data.
 */

import { useState, useEffect, useCallback } from 'react';
import { apiService, userCardsApi } from '../services/api/api.service';
import { TABLES } from '../constants/tables';
import { logger } from '../utils/logger';
import { handleError } from '../utils/error-handler';
import { useAuth } from '../services/authentication/authentication.context';

export const useUserCards = (options = {}) => {
  const {
    filters = {},
    orderBy = { column: 'created_at', ascending: false },
    limit = null,
    enabled = true,
  } = options;

  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCards = useCallback(async () => {
    if (!enabled || !user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await userCardsApi.getByUserId(user.id, {
        filters,
        orderBy,
        limit,
      });

      if (result.success) {
        setCards(result.data || []);
      } else {
        throw new Error('Failed to fetch user cards');
      }
    } catch (err) {
      const errorResult = handleError(err, 'useUserCards', false);
      setError(errorResult.message);
      logger.error('Error fetching user cards', err);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, filters, orderBy, limit, enabled]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const refetch = useCallback(() => {
    fetchCards();
  }, [fetchCards]);

  return {
    cards,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to get user card statistics
 */
export const useUserCardStats = (options = {}) => {
  const { enabled = true } = options;
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCards: 0,
    rareCards: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!enabled || !user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get all cards and filter client-side for now
      // TODO: Add proper filter support in API service for 'in' operator
      const totalResult = await userCardsApi.count({ user_id: user.id });
      
      // For rare cards, we'll need to fetch and filter client-side
      // or add proper 'in' operator support to API service
      let rareCount = 0;
      try {
        const cardsResult = await userCardsApi.getByUserId(user.id);
        if (cardsResult.success && cardsResult.data) {
          rareCount = cardsResult.data.filter(card => 
            ['SSS', 'SS', 'S'].includes(card.tier)
          ).length;
        }
      } catch (err) {
        logger.warn('Could not fetch cards for rare count', err);
      }

      if (totalResult.success) {
        setStats({
          totalCards: totalResult.count || 0,
          rareCards: rareCount,
          totalValue: 0, // TODO: Calculate from cards when implementing
        });
      } else {
        throw new Error('Failed to fetch card stats');
      }
    } catch (err) {
      const errorResult = handleError(err, 'useUserCardStats', false);
      setError(errorResult.message);
      logger.error('Error fetching card stats', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, enabled]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refetch = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
};

export default useUserCards;

