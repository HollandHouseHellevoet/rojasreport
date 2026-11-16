import type { Metadata } from 'next';
import SectionPage from '@/components/home/SectionPage';

export const metadata: Metadata = {
  title: 'Physician-Owned',
  description: 'What physicians built anyway: physician-owned hospitals, surgery centers and independent groups.',
  alternates: { canonical: 'https://tafhc.org/physician-owned/' },
};

export default function Page() {
  return <SectionPage slug="physician-owned" />;
}
