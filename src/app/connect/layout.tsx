import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connect & Ecosystem Partnerships | GWD — Get Work Done',
  description: 'Initiate an institutional partnership, bring GWD to your college campus, propose a joint summit or enter industry co-building.',
  openGraph: {
    title: 'Connect & Ecosystem Partnerships | GWD — Get Work Done',
    description: 'Initiate an institutional partnership, bring GWD to your college campus, propose a joint summit or enter industry co-building.',
    url: 'https://gwd-club.com/connect',
  },
};

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
