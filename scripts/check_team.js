const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const lines = env.split('\n');
let url = '', key = '';
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    url = trimmed.split('=')[1].replace(/^["']|["']$/g, '');
  }
  if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    key = trimmed.split('=')[1].replace(/^["']|["']$/g, '');
  }
}

const supabase = createClient(url, key);

async function checkTeam() {
  const { data, error } = await supabase.from('team_members').select('*').order('sort_order');
  if (error) {
    console.error('Error fetching team_members:', error);
    return;
  }
  console.log('Total team members:', data.length);
  for (const m of data) {
    const photoType = !m.photo_url ? 'EMPTY' : m.photo_url.startsWith('data:') ? `BASE64 (${m.photo_url.length} chars)` : m.photo_url;
    console.log(`[Slot ${m.sort_order}] ${m.id} | ${m.name} (${m.role_title}) | Photo: ${photoType} | Active: ${m.active}`);
  }
}

checkTeam();
