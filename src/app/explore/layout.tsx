import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Domains & Divisions | GWD — Get Work Done',
  description: 'Six specialized divisions: Technology & Engineering, Design Systems, Operations, Content & Media, Grassroots Sports OS, and Partnerships.',
  openGraph: {
    title: 'Explore Domains & Divisions | GWD — Get Work Done',
    description: 'Six specialized divisions: Technology & Engineering, Design Systems, Operations, Content & Media, Grassroots Sports OS, and Partnerships.',
    url: 'https://gwd-club.com/explore',
  },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
