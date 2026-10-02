import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join GWD | Candidate Application & Builder Recruitment',
  description: 'Apply to join GWD Club. Open to motivated student engineers, designers, creators, and organizers ready to ship production work.',
  openGraph: {
    title: 'Join GWD | Candidate Application & Builder Recruitment',
    description: 'Apply to join GWD Club. Open to motivated student engineers, designers, creators, and organizers ready to ship production work.',
    url: 'https://gwd-club.com/join',
  },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
