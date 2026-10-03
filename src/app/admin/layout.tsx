import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GWD Admin — Control Center',
  description: 'GWD Content Management System',
  robots: 'noindex, nofollow',
};

/**
 * Admin layout — isolated from public site shell.
 * No public Navigation or Footer. CmsProvider wraps admin pages
 * so the existing admin dashboard can use useCms() backed by server actions.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
