import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events, Hackathons & Keynotes | GWD — Get Work Done',
  description: 'Upcoming hackathons, engineering summits, tech keynotes, and inaugural launches hosted by GWD across campus and enterprise venues.',
  openGraph: {
    title: 'Events, Hackathons & Keynotes | GWD — Get Work Done',
    description: 'Upcoming hackathons, engineering summits, tech keynotes, and inaugural launches hosted by GWD across campus and enterprise venues.',
    url: 'https://gwd-club.com/events',
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
