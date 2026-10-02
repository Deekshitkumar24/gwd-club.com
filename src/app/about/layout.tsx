import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About GWD | Origin, Corporate Mandate & Global Vision',
  description: 'Born from a student idea in March 2024 at VJIT, incorporated on 12 June 2025. Learn the story, mission, leadership, and track record behind GWD Global Pvt. Ltd. and GWD Club.',
  openGraph: {
    title: 'About GWD | Origin, Corporate Mandate & Global Vision',
    description: 'Born from a student idea in March 2024 at VJIT, incorporated on 12 June 2025. Learn the story, mission, leadership, and track record behind GWD.',
    url: 'https://gwd-club.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
