import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rajvyxdfibpamanmmkgf.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhanZ5eGRmaWJwYW1hbm1ta2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjA2MTQsImV4cCI6MjA5ODI5NjYxNH0.1B6KcfFfgaB8ruagqaB6UGuwk8psVBVXEr5NyxomWUQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRLS() {
  console.log("Testing insert into marketers anonymously...");
  const dummyId = "00000000-0000-0000-0000-000000000000";
  
  const { data, error } = await supabase.from('marketers').upsert([{
    id: dummyId,
    name_ar: 'اختبار',
    name_en: 'Test',
    email: 'test_anon_' + Date.now() + '@example.com',
    phone: '123456789',
    referral_code: 'TESTMARK',
    status: 'active'
  }], { onConflict: 'email' });

  if (error) {
    console.log("INSERT BLOCKED:", error.message, error.code, error.details);
  } else {
    console.log("INSERT ALLOWED!");
  }
}

testRLS();
