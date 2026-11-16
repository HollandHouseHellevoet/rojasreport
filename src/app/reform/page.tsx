import type { Metadata } from 'next';
import { getReformTracker } from '@/lib/data';
import { makeMetadata } from '@/lib/seo';
import SectionHeader from '@/components/SectionHeader';
import ReformTracker from '@/components/ReformTracker';

export const metadata: Metadata = makeMetadata({
  title: 'CON Reform Tracker 2026 | Certificate of Need Repeal Progress',
  description: 'Certificate of Need reform in the 35 jurisdictions that still require a permit (34 states and D.C.), plus Florida. Each scored on five steps: bill, committee, hearing, governor support and prior reform.',
  path: '/reform/',
  ogImage: '/og/reform.svg',
});

export default function ReformPage() {
  const tracker = getReformTracker();

  return (
    <div className="max-w-content mx-auto px-5 py-10">
      <SectionHeader
        as="h1"
        label="Reform Tracker"
        title="CON Reform Momentum 2026"
        subtitle="Where is reform happening? Each state scored on five dimensions to produce a momentum signal. Green means reform is likely. Red means the status quo is entrenched."
      />
      <ReformTracker entries={tracker} />
    </div>
  );
}
