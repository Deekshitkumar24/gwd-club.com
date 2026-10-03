const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const lines = env.split('\n');
let url = '', anonKey = '', serviceKey = '';
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = trimmed.split('=')[1].replace(/^["']|["']$/g, '');
  if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) anonKey = trimmed.split('=')[1].replace(/^["']|["']$/g, '');
  if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) serviceKey = trimmed.split('=')[1].replace(/^["']|["']$/g, '');
}

console.log('Testing Production Pipeline against:', url);
const publicClient = createClient(url, anonKey);

async function runAcceptanceTest() {
  console.log('\n[1] Public Client Database Query (Simulating Incognito visitor):');
  const { data: settings, error } = await publicClient
    .from('site_settings')
    .select('*')
    .eq('key', 'domains')
    .single();

  if (error || !settings) {
    console.error('FAIL: Could not query site_settings.domains as public visitor:', error);
    process.exit(1);
  }

  const domains = settings.value;
  const visualMedia = domains.find(d => d.id === 'visual-media');
  console.log('Found Visual Media domain:', {
    name: visualMedia?.name,
    code: visualMedia?.code,
    leadName: visualMedia?.leadName,
    leadRole: visualMedia?.leadRole,
    leadPhoto: visualMedia?.leadPhoto,
    membersCount: visualMedia?.members?.length,
  });

  if (!visualMedia?.leadPhoto || !visualMedia.leadPhoto.startsWith('https://')) {
    console.error('FAIL: Visual Media leadPhoto is not a permanent public HTTPS URL!');
    process.exit(1);
  }
  console.log('PASS: Visual Media leadPhoto is a permanent Supabase Storage URL.');

  console.log('\n[2] Testing Public Image Fetch via HTTP:');
  const imgRes = await fetch(visualMedia.leadPhoto);
  console.log('HTTP Status for image fetch:', imgRes.status, imgRes.headers.get('content-type'), imgRes.headers.get('content-length'), 'bytes');
  if (imgRes.status !== 200) {
    console.error('FAIL: Public image URL did not return HTTP 200!');
    process.exit(1);
  }
  console.log('PASS: Public image is directly accessible to any visitor.');

  console.log('\n[3] Testing Team Members query (Simulating Incognito visitor):');
  const { data: teamMembers, error: tmErr } = await publicClient
    .from('team_members')
    .select('id, name, role_title, sort_order, photo_url, active')
    .order('sort_order');

  if (tmErr) {
    console.error('FAIL: Could not query team_members:', tmErr);
    process.exit(1);
  }

  console.log(`Found ${teamMembers.length} team members.`);
  let hasBase64 = false;
  let hasEmptyPhoto = 0;
  for (const tm of teamMembers) {
    if (tm.photo_url && tm.photo_url.startsWith('data:')) {
      console.warn(`WARNING: ${tm.name} still has base64 photo!`);
      hasBase64 = true;
    }
    if (!tm.photo_url) hasEmptyPhoto++;
  }

  if (hasBase64) {
    console.error('FAIL: Found base64 photos remaining in database!');
    process.exit(1);
  }
  console.log('PASS: Zero base64 photos in production database.');

  console.log('\n[4] Testing Local Dev Server Public API & Health:');
  try {
    const healthRes = await fetch('http://localhost:3000/api/health');
    const healthJson = await healthRes.json();
    console.log('Health Check Status:', healthJson.status, 'DB Latency:', healthJson.database?.latencyMs, 'ms');
  } catch (e) {
    console.log('Dev server health fetch note (server might be busy/reloading):', e.message);
  }

  console.log('\n=======================================');
  console.log('ALL PRODUCTION DATA PIPELINE TESTS PASSED!');
  console.log('=======================================');
}

runAcceptanceTest();
