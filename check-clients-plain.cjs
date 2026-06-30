const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read .dev.vars manually
const vars = fs.readFileSync('/Users/abhiram/Documents/certifyied/certifyied-landing-page/BlogFeature/.dev.vars', 'utf8');
const env = {};
vars.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env.SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_ANON_KEY;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Supabase URL:", supabaseUrl);

async function run() {
  const clientAnon = createClient(supabaseUrl, supabaseAnonKey);
  const clientService = createClient(supabaseUrl, supabaseServiceKey);

  const clientId = '4960a2dc-501b-40cb-b747-30d1dd95c8c6';

  console.log("\n--- Testing with Service Role Key ---");
  const sRes = await clientService.from('review_clients').select('*').eq('id', clientId).maybeSingle();
  console.log("Service query status:", sRes.error ? "Error: " + sRes.error.message : "Success");
  console.log("Service query data:", sRes.data);

  console.log("\n--- Testing with Anon Key ---");
  const aRes = await clientAnon.from('review_clients').select('*').eq('id', clientId).maybeSingle();
  console.log("Anon query status:", aRes.error ? "Error: " + aRes.error.message : "Success");
  console.log("Anon query data:", aRes.data);
}

run();
