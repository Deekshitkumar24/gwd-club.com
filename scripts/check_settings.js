const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const lines = env.split('\n');
let url = '', key = '';
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = trimmed.split('=')[1].replace(/^["']|["']$/g, '');
  if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = trimmed.split('=')[1].replace(/^["']|["']$/g, '');
}

const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) {
    console.error('Error fetching site_settings:', error);
    return;
  }
  const domainsSetting = data.find(d => d.key === 'domains');
  if (domainsSetting) {
    console.log('Domains count:', domainsSetting.value?.length);
    for (const d of domainsSetting.value || []) {
      const photoType = !d.leadPhoto ? 'EMPTY' : d.leadPhoto.startsWith('data:') ? `BASE64 (${d.leadPhoto.length} chars)` : d.leadPhoto;
      console.log(`[${d.id} / ${d.code}] Lead: ${d.leadName} (${d.leadRole}) | LeadPhoto: ${photoType} | Members count: ${d.members?.length || 0}`);
      if (d.members) {
        for (const m of d.members) {
          const mPhoto = !m.photo ? 'EMPTY' : m.photo.startsWith('data:') ? `BASE64 (${m.photo.length} chars)` : m.photo;
          console.log(`   - Member: ${m.name} (${m.role}) | Photo: ${mPhoto}`);
        }
      }
    }
  } else {
    console.log('NO "domains" key in site_settings in database!');
  }
}

check();
