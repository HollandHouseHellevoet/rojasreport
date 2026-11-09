import type { Metadata } from 'next';
import SectionPage from '@/components/home/SectionPage';

export const metadata: Metadata = {
  title: 'The Cost Drivers',
  description: 'Why care costs what it does: six rules, subsidies and payment formulas, each with a sponsor.',
  alternates: { canonical: 'https://rojasreport.com/drivers/' },
};

export default function Page() {
  return <SectionPage slug="drivers" />;
}
