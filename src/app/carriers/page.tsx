import type { Metadata } from 'next';
import SectionPage from '@/components/home/SectionPage';

export const metadata: Metadata = {
  title: 'Carriers',
  description: 'Who holds the premium: insurers, their pharmacy benefit managers and the physician groups they own.',
  alternates: { canonical: 'https://rojasreport.com/carriers/' },
};

export default function Page() {
  return <SectionPage slug="carriers" />;
}
