import type { Metadata } from 'next';
import SectionPage from '@/components/home/SectionPage';

export const metadata: Metadata = {
  title: 'Health Systems',
  description: 'Where the money sits: the top 100 nonprofit health systems and academic medical centers.',
  alternates: { canonical: 'https://rojasreport.com/systems/' },
};

export default function Page() {
  return <SectionPage slug="systems" />;
}
