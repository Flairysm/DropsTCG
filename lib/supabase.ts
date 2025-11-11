import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nzpjxutdbjtxhruigvrt.supabase.co';
const supabasePublishableKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cGp4dXRkYmp0eGhydWlndnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzY0MzMsImV4cCI6MjA3ODQ1MjQzM30.GHpuieH1tXE8QRaII_MzcKqb438ytr1DAdvFygFy_do';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

