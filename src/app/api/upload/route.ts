import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection unconfigured' }, { status: 500 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized — Admin authentication required' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedMime = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
    ];

    if (!allowedMime.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type (${file.type}). Allowed: JPEG, PNG, WebP, GIF, SVG, AVIF.` },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `uploads/${Date.now()}-${safeBaseName}.${ext}`;

    const { error: uploadError } = await adminClient.storage
      .from('media')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = adminClient.storage.from('media').getPublicUrl(filePath);

    // Persist media metadata in public.media
    const { data: mediaRow, error: mediaInsertError } = await adminClient
      .from('media')
      .insert({
        path: filePath,
        url: publicUrl,
        alt_text: safeBaseName.replace(/_/g, ' '),
        file_size: file.size,
        mime_type: file.type,
        album: category,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (mediaInsertError) {
      console.warn('Media record insert warning (file uploaded to storage):', mediaInsertError.message);
    }

    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
      id: mediaRow?.id || `media-${Date.now().toString(36)}`,
      name: safeBaseName,
      size: sizeStr,
      type: 'image',
      uploadedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
