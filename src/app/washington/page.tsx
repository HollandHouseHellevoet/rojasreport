import type { Metadata } from 'next';
import SectionPage from '@/components/home/SectionPage';

export const metadata: Metadata = {
  title: 'Washington',
  description: 'Who writes the rules: congressional committees, caucuses and federal advisory boards that shape healthcare law.',
  alternates: { canonical: 'https://rojasreport.com/washington/' },
};

export default function Page() {
  return <SectionPage slug="washington" />;
}
