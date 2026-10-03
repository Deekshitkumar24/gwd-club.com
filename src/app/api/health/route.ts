import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, unknown> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    config: { status: 'unchecked' },
    database: { status: 'unchecked' },
  };

  // 1. Check required configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    checks.config = {
      status: 'error',
      message: 'Missing required: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY',
    };
    checks.status = 'error';
    return NextResponse.json(checks, { status: 503 });
  }

  checks.config = {
    status: 'ok',
    supabaseProject: supabaseUrl.replace(/^https?:\/\//, '').split('.')[0],
    hasServiceRoleKey: !!serviceRoleKey,
    hasResendKey: !!process.env.RESEND_API_KEY,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'not set',
  };

  // 2. Check database connection via anon key (public read)
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    if (!supabase) {
      checks.database = { status: 'error', message: 'Failed to create Supabase client' };
      checks.status = 'error';
    } else {
      const start = Date.now();
      const { data, error } = await supabase.from('site_settings').select('key').limit(1);
      const latency = Date.now() - start;

      if (error) {
        checks.database = { status: 'error', message: error.message, code: error.code, latencyMs: latency };
        checks.status = 'degraded';
      } else {
        checks.database = {
          status: 'ok',
          latencyMs: latency,
          settingsFound: (data?.length ?? 0) > 0,
        };
      }
    }
  } catch (err) {
    checks.database = {
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown database error',
    };
    checks.status = 'error';
  }

  const statusCode = checks.status === 'ok' ? 200 : checks.status === 'degraded' ? 200 : 503;
  return NextResponse.json(checks, { status: statusCode });
}
