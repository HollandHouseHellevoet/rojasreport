import type { Metadata } from 'next';
import SectionPage from '@/components/home/SectionPage';

export const metadata: Metadata = {
  title: 'Physicians',
  description: 'What independent physicians can do about it: own what you build and contract directly.',
  alternates: { canonical: 'https://rojasreport.com/physicians/' },
};

export default function Page() {
  return <SectionPage slug="physicians" />;
}
