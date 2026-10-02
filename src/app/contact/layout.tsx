import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact GWD | Direct Communications Desk',
  description: 'Reach out to GWD Global Pvt. Ltd. and GWD Club. Madhapur headquarters, Hyderabad campus desk, and general communications.',
  openGraph: {
    title: 'Contact GWD | Direct Communications Desk',
    description: 'Reach out to GWD Global Pvt. Ltd. and GWD Club. Madhapur headquarters, Hyderabad campus desk, and general communications.',
    url: 'https://gwd-club.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
