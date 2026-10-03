const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const env = fs.readFileSync('.env.local', 'utf-8');
const lines = env.split('\n');
let url = '', serviceRoleKey = '';
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = trimmed.split('=')[1].replace(/^["']|["']$/g, '');
  if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) serviceRoleKey = trimmed.split('=')[1].replace(/^["']|["']$/g, '');
}

console.log('Connecting to Supabase at:', url);
const supabaseAdmin = createClient(url, serviceRoleKey);

async function uploadBufferToStorage(buffer, fileName, contentType) {
  const filePath = `uploads/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const { data, error } = await supabaseAdmin.storage
    .from('media')
    .upload(filePath, buffer, {
      contentType: contentType || 'image/jpeg',
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload error for ${fileName}: ${error.message}`);
  }

  const { data: { publicUrl } } = supabaseAdmin.storage.from('media').getPublicUrl(filePath);

  // Insert into media table
  await supabaseAdmin.from('media').insert({
    path: filePath,
    url: publicUrl,
    alt_text: fileName,
    file_size: buffer.length,
    mime_type: contentType || 'image/jpeg',
    created_at: new Date().toISOString(),
  });

  return publicUrl;
}

async function uploadBase64(base64Data, namePrefix) {
  if (!base64Data || !base64Data.startsWith('data:')) return base64Data;
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return base64Data;

  const contentType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const fileName = `${namePrefix}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  console.log(`Uploading base64 image (${buffer.length} bytes) as ${fileName}...`);
  return await uploadBufferToStorage(buffer, fileName, contentType);
}

async function uploadLocalFile(localRelPath, namePrefix) {
  const fullPath = path.join(process.cwd(), 'public', localRelPath.replace(/^\//, ''));
  if (!fs.existsSync(fullPath)) {
    console.warn(`Local file does not exist: ${fullPath}`);
    return localRelPath;
  }
  const buffer = fs.readFileSync(fullPath);
  const ext = path.extname(fullPath).replace('.', '');
  const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  const fileName = `${namePrefix}.${ext}`;

  console.log(`Uploading local file ${localRelPath} (${buffer.length} bytes)...`);
  return await uploadBufferToStorage(buffer, fileName, contentType);
}

async function migrate() {
  console.log('--- Step 1: Migrating team_members ---');
  const { data: teamMembers, error: tmError } = await supabaseAdmin.from('team_members').select('*');
  if (tmError) {
    console.error('Failed to fetch team members:', tmError);
    return;
  }

  for (const m of teamMembers) {
    let newPhotoUrl = m.photo_url;
    if (m.photo_url && m.photo_url.startsWith('data:')) {
      newPhotoUrl = await uploadBase64(m.photo_url, `team-${m.name.toLowerCase().replace(/\s+/g, '-')}`);
      console.log(`Updated photo for ${m.name}: ${newPhotoUrl}`);
      await supabaseAdmin.from('team_members').update({ photo_url: newPhotoUrl }).eq('id', m.id);
    } else if (m.photo_url && m.photo_url.startsWith('/team/')) {
      newPhotoUrl = await uploadLocalFile(m.photo_url, `team-${m.name.toLowerCase().replace(/\s+/g, '-')}`);
      console.log(`Uploaded static photo for ${m.name}: ${newPhotoUrl}`);
      await supabaseAdmin.from('team_members').update({ photo_url: newPhotoUrl }).eq('id', m.id);
    }
  }

  console.log('--- Step 2: Migrating site_settings.domains ---');
  const { data: settingRow, error: setErr } = await supabaseAdmin
    .from('site_settings')
    .select('*')
    .eq('key', 'domains')
    .single();

  if (setErr || !settingRow) {
    console.error('No domains in site_settings:', setErr);
    return;
  }

  const domains = settingRow.value;
  let domainsModified = false;

  for (const d of domains) {
    // Check lead photo
    if (d.leadPhoto && d.leadPhoto.startsWith('data:')) {
      d.leadPhoto = await uploadBase64(d.leadPhoto, `domain-lead-${d.id}`);
      domainsModified = true;
    } else if (d.leadPhoto && d.leadPhoto.startsWith('/team/')) {
      d.leadPhoto = await uploadLocalFile(d.leadPhoto, `domain-lead-${d.id}`);
      domainsModified = true;
    }

    // Special fix for visual-media:
    // If Visual Media leadPhoto is empty, get Burhan Uddin's photo from members or team_members
    if (d.id === 'visual-media' && (!d.leadPhoto || d.leadPhoto === '')) {
      const burhanInMembers = (d.members || []).find(m => m.name.toLowerCase().includes('burhan'));
      if (burhanInMembers && burhanInMembers.photo) {
        if (burhanInMembers.photo.startsWith('data:')) {
          d.leadPhoto = await uploadBase64(burhanInMembers.photo, 'domain-lead-visual-media');
        } else {
          d.leadPhoto = burhanInMembers.photo;
        }
        domainsModified = true;
        console.log('Set visual-media leadPhoto to Burhan Uddin photo:', d.leadPhoto);
      } else {
        // Look up in team_members
        const burhanInTeam = teamMembers.find(t => t.name.toLowerCase().includes('burhan'));
        if (burhanInTeam && burhanInTeam.photo_url) {
          d.leadPhoto = burhanInTeam.photo_url;
          domainsModified = true;
          console.log('Set visual-media leadPhoto from team_members:', d.leadPhoto);
        }
      }
    }

    // Check member photos
    if (d.members && Array.isArray(d.members)) {
      for (const m of d.members) {
        if (m.photo && m.photo.startsWith('data:')) {
          m.photo = await uploadBase64(m.photo, `domain-member-${m.name.toLowerCase().replace(/\s+/g, '-')}`);
          domainsModified = true;
        } else if (m.photo && m.photo.startsWith('/team/')) {
          m.photo = await uploadLocalFile(m.photo, `domain-member-${m.name.toLowerCase().replace(/\s+/g, '-')}`);
          domainsModified = true;
        }
      }
    }
  }

  // Also ensure marketing lead has photo if member has it
  const marketingDomain = domains.find(d => d.id === 'marketing');
  if (marketingDomain && (!marketingDomain.leadPhoto || marketingDomain.leadPhoto === '')) {
    const anvita = (marketingDomain.members || []).find(m => m.name.toLowerCase().includes('anvita'));
    if (anvita && anvita.photo) {
      marketingDomain.leadPhoto = anvita.photo;
      domainsModified = true;
    }
  }

  if (domainsModified) {
    console.log('Saving migrated domains to site_settings...');
    const { error: updErr } = await supabaseAdmin
      .from('site_settings')
      .update({ value: domains, updated_at: new Date().toISOString() })
      .eq('key', 'domains');
    if (updErr) {
      console.error('Failed to update domains in site_settings:', updErr);
    } else {
      console.log('Successfully saved migrated domains!');
    }
  }

  console.log('--- Migration complete! ---');
}

migrate();
