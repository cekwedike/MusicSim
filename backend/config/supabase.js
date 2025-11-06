const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Validate that environment variables are set
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase credentials not found. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file.');
}

// Create Supabase admin client (with service role key for backend operations)
const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

module.exports = supabaseAdmin;
