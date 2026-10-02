import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecosystem Collaborations & Alliances | GWD — Get Work Done',
  description: 'Enterprise partners, campus ecosystems, incubation hubs, and industry organizations co-building with GWD Global Pvt. Ltd.',
  openGraph: {
    title: 'Ecosystem Collaborations & Alliances | GWD — Get Work Done',
    description: 'Enterprise partners, campus ecosystems, incubation hubs, and industry organizations co-building with GWD Global Pvt. Ltd.',
    url: 'https://gwd-club.com/collaborations',
  },
};

export default function CollaborationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
