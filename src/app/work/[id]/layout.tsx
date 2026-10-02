import type { Metadata } from 'next';
import { PROJECTS } from '@/data/content';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) return { title: 'Project Case Study | GWD' };

  return {
    title: `${project.title} — Case Study | GWD`,
    description: project.shortDescription || project.description,
    openGraph: {
      title: `${project.title} — Case Study | GWD`,
      description: project.shortDescription,
      images: [project.heroImage],
      url: `https://gwd-club.com/work/${project.id}`,
    },
  };
}

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
