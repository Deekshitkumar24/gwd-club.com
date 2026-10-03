'use client';

import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const searchParams = useSearchParams();
  const configError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    configError === 'config'
      ? 'Database is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment environment.'
      : configError === 'auth'
      ? 'Authentication failed. Please try again.'
      : null
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError('Database connection is not configured. Contact your administrator.');
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Redirect to admin dashboard — middleware/proxy will handle session validation
    window.location.href = '/admin';
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logoMark}>GWD</div>
          <h1 style={styles.title}>Admin Control Center</h1>
          <p style={styles.subtitle}>Sign in to manage GWD content</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="admin-email" style={styles.label}>Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gwd-club.com"
              required
              autoComplete="email"
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="admin-password" style={styles.label}>Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'Authenticating…' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          GWD Admin · Production CMS · Supabase Auth
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logoSection}>
            <div style={styles.logoMark}>GWD</div>
            <h1 style={styles.title}>Admin Control Center</h1>
            <p style={styles.subtitle}>Loading...</p>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#111',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '2.5rem',
  },
  logoSection: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  logoMark: {
    display: 'inline-block',
    fontSize: '1.5rem',
    fontWeight: 800,
    letterSpacing: '0.15em',
    color: '#fff',
    background: '#E11D48',
    borderRadius: '10px',
    padding: '0.5rem 1.2rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#fff',
    margin: '0 0 0.25rem',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    background: 'rgba(225,29,72,0.1)',
    border: '1px solid rgba(225,29,72,0.25)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '1.5rem',
    fontSize: '0.85rem',
    color: '#f87171',
    lineHeight: 1.4,
  },
  errorIcon: {
    flexShrink: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.85rem',
    borderRadius: '8px',
    border: 'none',
    background: '#E11D48',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.95rem',
    letterSpacing: '0.02em',
    transition: 'opacity 0.2s',
  },
  footer: {
    textAlign: 'center' as const,
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.25)',
    marginTop: '2rem',
    letterSpacing: '0.05em',
  },
};
