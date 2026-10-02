import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work & Production Case Studies | GWD — Get Work Done',
  description: 'Explore production-grade software, digital sports infrastructure, and enterprise design systems shipped by the GWD collective.',
  openGraph: {
    title: 'Work & Production Case Studies | GWD — Get Work Done',
    description: 'Explore production-grade software, digital sports infrastructure, and enterprise design systems shipped by the GWD collective.',
    url: 'https://gwd-club.com/work',
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
