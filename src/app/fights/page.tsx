import type { Metadata } from 'next';
import SectionPage from '@/components/home/SectionPage';

export const metadata: Metadata = {
  title: 'The Fights',
  description: 'How the game is rigged: certificate of need, the physician-owned hospital ban, the 340B program, site-neutral pay, price transparency.',
  alternates: { canonical: 'https://rojasreport.com/fights/' },
};

export default function Page() {
  return <SectionPage slug="fights" />;
}
