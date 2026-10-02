import type { Metadata } from 'next';
import { NINE_LEADERS, TEAM_HIERARCHY } from '@/data/content';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const allMembers = [...NINE_LEADERS, ...TEAM_HIERARCHY.flatMap((l) => l.members)];
  const member = allMembers.find((m) => m.id === id);
  if (!member) return { title: 'Team Member Profile | GWD' };

  return {
    title: `${member.name} (${member.role}) | GWD Leadership`,
    description: member.bio || `${member.name} — ${member.role} at GWD Global Pvt. Ltd. & GWD Club.`,
    openGraph: {
      title: `${member.name} — ${member.role} | GWD`,
      description: member.bio,
      images: ['photo' in member && member.photo ? member.photo : 'image' in member && member.image ? member.image : '/brand/gwd-logo.png'],
      url: `https://gwd-club.com/team/${member.id}`,
    },
  };
}

export default function MemberDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
