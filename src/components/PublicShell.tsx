'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { SharedDyeProvider } from '@/components/DyeVisual';

/**
 * Conditionally renders public site chrome (Navigation, Footer, DyeVisual)
 * only for non-admin routes. Admin routes get a bare layout.
 */
export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SharedDyeProvider>
      <Navigation />
      <main id="main-content">{children}</main>
      <Footer />
    </SharedDyeProvider>
  );
}
