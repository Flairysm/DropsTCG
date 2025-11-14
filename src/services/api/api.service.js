/**
 * API Service Layer
 * 
 * Centralized API service for Supabase operations.
 * Provides consistent error handling, retry logic, and request/response interceptors.
 */

import { supabase } from '../../infrastructure/supabase';
import { handleError, handleErrorSilently, ERROR_TYPES } from '../../utils/error-handler';
import { logger } from '../../utils/logger';
import { TABLES } from '../../constants/tables';

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryableErrors: [ERROR_TYPES.NETWORK, ERROR_TYPES.SERVER],
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Execute with retry logic
 */
const executeWithRetry = async (operation, context = '', retryCount = 0) => {
  try {
    return await operation();
  } catch (error) {
    const errorType = error?.code || ERROR_TYPES.UNKNOWN;
    const isRetryable = RETRY_CONFIG.retryableErrors.includes(errorType) || 
                       error?.message?.toLowerCase().includes('network');

    if (isRetryable && retryCount < RETRY_CONFIG.maxRetries) {
      logger.warn(`Retrying ${context} (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`);
      await sleep(RETRY_CONFIG.retryDelay * (retryCount + 1)); // Exponential backoff
      return executeWithRetry(operation, context, retryCount + 1);
    }

    throw error;
  }
};

/**
 * Base API service class
 */
class ApiService {
  /**
   * Generic select operation
   */
  async select(table, options = {}) {
    const {
      filters = {},
      select = '*',
      orderBy = null,
      limit = null,
      offset = null,
      single = false,
      context = `select from ${table}`,
    } = options;

    return executeWithRetry(async () => {
      let query = supabase.from(table).select(select);

      // Apply filters
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === 'object' && value.operator) {
          // Support operators like { operator: 'gte', value: 100 } or { operator: 'in', value: [...] }
          if (value.operator === 'in' && Array.isArray(value.value)) {
            query = query.in(key, value.value);
          } else if (typeof query[value.operator] === 'function') {
            query = query[value.operator](key, value.value);
          } else {
            // Fallback to eq if operator not supported
            query = query.eq(key, value.value);
          }
        } else {
          query = query.eq(key, value);
        }
      });

      // Apply ordering
      if (orderBy) {
        const { column, ascending = true } = orderBy;
        query = query.order(column, { ascending });
      }

      // Apply pagination
      if (offset !== null) {
        query = query.range(offset, offset + (limit || 10) - 1);
      } else if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = single ? await query.single() : await query;

      if (error) {
        throw error;
      }

      return { success: true, data };
    }, context);
  }

  /**
   * Generic insert operation
   */
  async insert(table, data, options = {}) {
    const { context = `insert into ${table}`, single = false } = options;

    return executeWithRetry(async () => {
      const { data: result, error } = single
        ? await supabase.from(table).insert(data).select().single()
        : await supabase.from(table).insert(data).select();

      if (error) {
        throw error;
      }

      logger.info(`Successfully inserted into ${table}`, { count: Array.isArray(result) ? result.length : 1 });
      return { success: true, data: result };
    }, context);
  }

  /**
   * Generic update operation
   */
  async update(table, filters, updates, options = {}) {
    const { context = `update ${table}`, returning = true } = options;

    return executeWithRetry(async () => {
      let query = supabase.from(table).update(updates);

      // Apply filters
      Object.keys(filters).forEach((key) => {
        query = query.eq(key, filters[key]);
      });

      if (returning) {
        query = query.select();
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      logger.info(`Successfully updated ${table}`, { count: Array.isArray(data) ? data.length : 1 });
      return { success: true, data };
    }, context);
  }

  /**
   * Generic delete operation
   */
  async delete(table, filters, options = {}) {
    const { context = `delete from ${table}` } = options;

    return executeWithRetry(async () => {
      let query = supabase.from(table).delete();

      // Apply filters
      Object.keys(filters).forEach((key) => {
        query = query.eq(key, filters[key]);
      });

      const { error } = await query;

      if (error) {
        throw error;
      }

      logger.info(`Successfully deleted from ${table}`);
      return { success: true };
    }, context);
  }

  /**
   * Count records
   */
  async count(table, filters = {}, options = {}) {
    const { context = `count from ${table}` } = options;

    return executeWithRetry(async () => {
      let query = supabase.from(table).select('*', { count: 'exact', head: true });

      // Apply filters
      Object.keys(filters).forEach((key) => {
        query = query.eq(key, filters[key]);
      });

      const { count, error } = await query;

      if (error) {
        throw error;
      }

      return { success: true, count: count || 0 };
    }, context);
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Convenience methods for common operations
export const userProfilesApi = {
  getById: (id) => apiService.select(TABLES.USER_PROFILES, { filters: { id }, single: true }),
  update: (id, updates) => apiService.update(TABLES.USER_PROFILES, { id }, updates),
  updateTokenBalance: async (id, amount) => {
    // Use the database function for safe token balance updates
    const { data, error } = await supabase.rpc('update_token_balance', {
      user_id: id,
      amount_change: amount,
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  },
};

export const userCardsApi = {
  getByUserId: (userId, options = {}) =>
    apiService.select(TABLES.USER_CARDS, { filters: { user_id: userId }, ...options }),
  insert: (cardData) => apiService.insert(TABLES.USER_CARDS, cardData, { single: true }),
  update: (id, updates) => apiService.update(TABLES.USER_CARDS, { id }, updates),
  delete: (id) => apiService.delete(TABLES.USER_CARDS, { id }),
  count: (filters = {}) => apiService.count(TABLES.USER_CARDS, filters),
};

export const raffleParticipantsApi = {
  getByUserId: (userId) =>
    apiService.select(TABLES.RAFFLE_PARTICIPANTS, { filters: { user_id: userId } }),
  insert: (participantData) =>
    apiService.insert(TABLES.RAFFLE_PARTICIPANTS, participantData, { single: true }),
  count: (filters = {}) => apiService.count(TABLES.RAFFLE_PARTICIPANTS, filters),
};

export const packOpeningsApi = {
  getByUserId: (userId) =>
    apiService.select(TABLES.PACK_OPENINGS, { filters: { user_id: userId } }),
  insert: (openingData) => apiService.insert(TABLES.PACK_OPENINGS, openingData, { single: true }),
  count: (filters = {}) => apiService.count(TABLES.PACK_OPENINGS, filters),
};

export default apiService;

