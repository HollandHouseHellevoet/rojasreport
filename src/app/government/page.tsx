import type { Metadata } from 'next';
import SectionPage from '@/components/home/SectionPage';

export const metadata: Metadata = {
  title: 'Government',
  description: 'Who writes the rules: the committees, advisory bodies and agencies that set what care costs.',
  alternates: { canonical: 'https://tafhc.org/government/' },
};

export default function Page() {
  return <SectionPage slug="government" />;
}
