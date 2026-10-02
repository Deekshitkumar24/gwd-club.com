import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visual Gallery & Archives | GWD — Get Work Done',
  description: 'High-resolution moments, inaugural launches, summit keynotes, hackathons, and team milestones from the GWD collective.',
  openGraph: {
    title: 'Visual Gallery & Archives | GWD — Get Work Done',
    description: 'High-resolution moments, inaugural launches, summit keynotes, hackathons, and team milestones from the GWD collective.',
    url: 'https://gwd-club.com/gallery',
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
