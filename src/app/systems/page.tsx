import type { Metadata } from 'next';
import SectionPage from '@/components/home/SectionPage';

export const metadata: Metadata = {
  title: 'The Systems',
  description: 'Who gets paid: academic medical centers and nonprofit health systems, their debt, pay and tax exemptions.',
  alternates: { canonical: 'https://rojasreport.com/systems/' },
};

export default function Page() {
  return <SectionPage slug="systems" />;
}
