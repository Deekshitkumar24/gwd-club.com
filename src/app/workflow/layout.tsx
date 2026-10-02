import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Execution Workflow & Methodology | GWD — Get Work Done',
  description: 'How GWD gets work done: our battle-tested six-phase methodology transforming raw concepts into scalable, production-grade systems.',
  openGraph: {
    title: 'Execution Workflow & Methodology | GWD — Get Work Done',
    description: 'How GWD gets work done: our battle-tested six-phase methodology transforming raw concepts into scalable, production-grade systems.',
    url: 'https://gwd-club.com/workflow',
  },
};

export default function WorkflowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
