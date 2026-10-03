const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const lines = env.split('\n');
let url = '', key = '';
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('gwd_vjit_clube_SUPABASE_URL=')) {
    url = trimmed.split('=')[1].replace(/^["']|["']$/g, '');
  }
  if (trimmed.startsWith('NEXT_PUBLIC_gwd_vjit_clube_SUPABASE_ANON_KEY=')) {
    key = trimmed.split('=')[1].replace(/^["']|["']$/g, '');
  }
}

const supabase = createClient(url, key);

async function checkStorage() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  console.log('Buckets:', buckets, 'Error:', error);
  if (buckets && buckets.length > 0) {
    for (const b of buckets) {
      const { data: files, error: filesError } = await supabase.storage.from(b.name).list();
      console.log(`Files in ${b.name}:`, files ? files.length : 'none', 'Error:', filesError);
    }
  }
}

checkStorage();
