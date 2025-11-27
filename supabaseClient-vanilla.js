// Vanilla JavaScript version for HTML files
// Include this script before your other scripts

// Load Supabase from CDN for vanilla JS usage
const script = document.createElement('script');
script.src = 'https://unpkg.com/@supabase/supabase-js@2';
script.onload = function() {
  // Initialize Supabase client
  const supabaseUrl = 'https://nfughcexzavqbnpqumca.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mdWdoY2V4emF2cWJucHF1bWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2Mzg2NTksImV4cCI6MjA3MjIxNDY1OX0.vpCCJ04BDJhJXtIbTIJzkoMQZnZEfoSDKEY5VCh6rFA';
  
  window.supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);
  
  // Dispatch event when Supabase is ready
  window.dispatchEvent(new CustomEvent('supabaseReady'));
};
document.head.appendChild(script);
