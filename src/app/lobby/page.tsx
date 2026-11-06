import type { Metadata } from 'next';
import SectionPage from '@/components/home/SectionPage';

export const metadata: Metadata = {
  title: 'The Lobby',
  description: 'Who buys the outcome: the hospital trade groups, lobbying firms and PACs behind healthcare policy.',
  alternates: { canonical: 'https://rojasreport.com/lobby/' },
};

export default function Page() {
  return <SectionPage slug="lobby" />;
}
