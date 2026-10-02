import type { Metadata } from 'next';
import { UPCOMING_EVENTS, PAST_EVENTS } from '@/data/content';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const allEvents = [...UPCOMING_EVENTS, ...PAST_EVENTS];
  const event = allEvents.find((e) => e.id === id);
  if (!event) return { title: 'Event Details | GWD' };

  return {
    title: `${event.title} — Event Details | GWD`,
    description: event.description,
    openGraph: {
      title: `${event.title} — Event Details | GWD`,
      description: event.description,
      images: [event.image],
      url: `https://gwd-club.com/events/${event.id}`,
    },
  };
}

export default function EventDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
