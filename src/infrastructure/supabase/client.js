import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config';

/**
 * Supabase Client
 * 
 * This is the main client instance for interacting with Supabase.
 * Use this client to:
 * - Query your database tables
 * - Handle authentication
 * - Use real-time subscriptions
 * - Store files in Supabase Storage
 */

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    // Configure auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

