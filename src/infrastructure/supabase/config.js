/**
 * Supabase Configuration
 * 
 * To use Supabase, you need to:
 * 1. Create a project at https://supabase.com
 * 2. Get your project URL and anon key from Settings > API
 * 3. Create a .env file in the root directory with:
 *    EXPO_PUBLIC_SUPABASE_URL=your-project-url
 *    EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 */

// Supabase credentials
// Note: For production, use environment variables (.env file) instead of hardcoding
export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://nzpjxutdbjtxhruigvrt.supabase.co',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cGp4dXRkYmp0eGhydWlndnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzY0MzMsImV4cCI6MjA3ODQ1MjQzM30.GHpuieH1tXE8QRaII_MzcKqb438ytr1DAdvFygFy_do',
};

