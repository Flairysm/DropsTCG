/**
 * Custom Hook: useMysteryBoxes
 * 
 * Fetches and manages mystery box data.
 */

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api/api.service';
import { TABLES } from '../constants/tables';
import { logger } from '../utils/logger';
import { handleError } from '../utils/error-handler';

export const useMysteryBoxes = (options = {}) => {
  const {
    filters = {},
    orderBy = { column: 'created_at', ascending: false },
    limit = null,
    enabled = true,
  } = options;

  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoxes = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.select(TABLES.MYSTERY_BOXES, {
        filters: { ...filters, is_active: true },
        orderBy,
        limit,
        context: 'fetch mystery boxes',
      });

      if (result.success) {
        setBoxes(result.data || []);
      } else {
        throw new Error('Failed to fetch mystery boxes');
      }
    } catch (err) {
      const errorResult = handleError(err, 'useMysteryBoxes', false);
      setError(errorResult.message);
      logger.error('Error fetching mystery boxes', err);
      setBoxes([]);
    } finally {
      setLoading(false);
    }
  }, [filters, orderBy, limit, enabled]);

  useEffect(() => {
    fetchBoxes();
  }, [fetchBoxes]);

  const refetch = useCallback(() => {
    fetchBoxes();
  }, [fetchBoxes]);

  return {
    boxes,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch a single mystery box by ID
 */
export const useMysteryBox = (boxId, options = {}) => {
  const { enabled = true } = options;

  const [box, setBox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBox = useCallback(async () => {
    if (!enabled || !boxId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.select(TABLES.MYSTERY_BOXES, {
        filters: { id: boxId },
        single: true,
        context: `fetch mystery box ${boxId}`,
      });

      if (result.success) {
        setBox(result.data);
      } else {
        throw new Error('Failed to fetch mystery box');
      }
    } catch (err) {
      const errorResult = handleError(err, 'useMysteryBox', false);
      setError(errorResult.message);
      logger.error('Error fetching mystery box', err);
      setBox(null);
    } finally {
      setLoading(false);
    }
  }, [boxId, enabled]);

  useEffect(() => {
    fetchBox();
  }, [fetchBox]);

  const refetch = useCallback(() => {
    fetchBox();
  }, [fetchBox]);

  return {
    box,
    loading,
    error,
    refetch,
  };
};

export default useMysteryBoxes;

