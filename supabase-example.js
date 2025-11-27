// Example usage of Supabase in your music course project
// This shows how to replace Google Sheets with Supabase

// Wait for Supabase to be ready
window.addEventListener('supabaseReady', function() {
  console.log('Supabase is ready!');
  
  // Example: Save registration data to Supabase
  async function saveRegistration(registrationData) {
    try {
      const { data, error } = await window.supabase
        .from('registrations')
        .insert([registrationData]);
      
      if (error) throw error;
      
      console.log('Registration saved:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error saving registration:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Example: Get all registrations
  async function getRegistrations() {
    try {
      const { data, error } = await window.supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching registrations:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Example: Save exam submission
  async function saveExam(examData) {
    try {
      const { data, error } = await window.supabase
        .from('exams')
        .insert([examData]);
      
      if (error) throw error;
      
      console.log('Exam saved:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error saving exam:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Make functions globally available
  window.supabaseFunctions = {
    saveRegistration,
    getRegistrations,
    saveExam
  };
});

// Alternative: Direct usage without waiting for event
function useSupabaseDirectly() {
  if (window.supabase) {
    // Supabase is already loaded
    return window.supabase;
  } else {
    // Load from CDN and initialize
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@supabase/supabase-js@2';
    script.onload = function() {
      const supabaseUrl = 'https://nfughcexzavqbnpqumca.supabase.co';
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mdWdoY2V4emF2cWJucHF1bWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2Mzg2NTksImV4cCI6MjA3MjIxNDY1OX0.vpCCJ04BDJhJXtIbTIJzkoMQZnZEfoSDKEY5VCh6rFA';
      
      window.supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);
    };
    document.head.appendChild(script);
  }
}






