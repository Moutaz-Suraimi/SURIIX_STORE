import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rajvyxdfibpamanmmkgf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhanZ5eGRmaWJwYW1hbm1ta2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjA2MTQsImV4cCI6MjA5ODI5NjYxNH0.1B6KcfFfgaB8ruagqaB6UGuwk8psVBVXEr5NyxomWUQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
