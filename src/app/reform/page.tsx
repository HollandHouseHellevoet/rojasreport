import type { Metadata } from 'next';
import { getReformTracker } from '@/lib/data';
import { makeMetadata } from '@/lib/seo';
import SectionHeader from '@/components/SectionHeader';
import ReformTracker from '@/components/ReformTracker';

export const metadata: Metadata = makeMetadata({
  title: 'CON Reform Tracker 2026 | Certificate of Need Repeal Progress',
  description: 'Track Certificate of Need reform momentum across 36 states. Each state scored on 5 dimensions: bill introduced, committee assignment, hearing held, governor support, prior reform history.',
  path: '/reform/',
  ogImage: '/og/reform.svg',
});

export default function ReformPage() {
  const tracker = getReformTracker();

  return (
    <div className="max-w-content mx-auto px-5 py-10">
      <SectionHeader
        label="Reform Tracker"
        title="CON Reform Momentum 2026"
        subtitle="Where is reform happening? Each state scored on five dimensions to produce a momentum signal. Green means reform is likely. Red means the status quo is entrenched."
      />
      <ReformTracker entries={tracker} />
    </div>
  );
}
