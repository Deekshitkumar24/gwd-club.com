const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const lines = env.split('\n');
let url = '', serviceRoleKey = '';
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    url = trimmed.split('=')[1].replace(/^["']|["']$/g, '');
  }
  if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    serviceRoleKey = trimmed.split('=')[1].replace(/^["']|["']$/g, '');
  }
}

console.log('Connecting to Supabase at:', url);
const supabaseAdmin = createClient(url, serviceRoleKey);

async function setupStorage() {
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }
  console.log('Existing buckets:', buckets.map(b => b.name));

  const hasMediaBucket = buckets.some(b => b.name === 'media');
  if (!hasMediaBucket) {
    console.log('Creating public "media" bucket...');
    const { data, error } = await supabaseAdmin.storage.createBucket('media', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
    });
    if (error) {
      console.error('Failed to create "media" bucket:', error);
      return;
    }
    console.log('Created "media" bucket successfully:', data);
  } else {
    console.log('"media" bucket already exists.');
  }

  // Test an upload to make sure public URL generation works
  const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const testFileName = `test-init-${Date.now()}.png`;
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('media')
    .upload(testFileName, testBuffer, {
      contentType: 'image/png',
      upsert: true
    });

  if (uploadError) {
    console.error('Test upload failed:', uploadError);
  } else {
    console.log('Test upload successful:', uploadData);
    const { data: urlData } = supabaseAdmin.storage.from('media').getPublicUrl(testFileName);
    console.log('Public URL:', urlData.publicUrl);
  }
}

setupStorage();
