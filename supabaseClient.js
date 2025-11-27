import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://nfughcexzavqbnpqumca.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mdWdoY2V4emF2cWJucHF1bWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2Mzg2NTksImV4cCI6MjA3MjIxNDY1OX0.vpCCJ04BDJhJXtIbTIJzkoMQZnZEfoSDKEY5VCh6rFA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For vanilla JavaScript usage (non-module scripts)
if (typeof window !== 'undefined') {
  window.supabase = supabase
}
