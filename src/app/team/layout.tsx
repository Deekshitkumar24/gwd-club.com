import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Executive Council & Leadership Team | GWD — Get Work Done',
  description: 'Meet the executive council, founders, domain leads, and core builders steering GWD Global Pvt. Ltd. and GWD Club.',
  openGraph: {
    title: 'Executive Council & Leadership Team | GWD — Get Work Done',
    description: 'Meet the executive council, founders, domain leads, and core builders steering GWD Global Pvt. Ltd. and GWD Club.',
    url: 'https://gwd-club.com/team',
  },
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
