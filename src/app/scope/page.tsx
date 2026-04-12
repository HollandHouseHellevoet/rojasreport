import type { Metadata } from 'next';
import { getScopeMatrix, SCOPE_CATEGORIES } from '@/lib/data';
import { makeMetadata } from '@/lib/seo';
import SectionHeader from '@/components/SectionHeader';
import ScopeMatrix from '@/components/ScopeMatrix';

export const metadata: Metadata = makeMetadata({
  title: 'CON Scope Matrix | What Requires a Certificate of Need by State',
  description: 'Filterable grid showing which healthcare services require a Certificate of Need permit in each of 36 states. Filter by facility type, tier, and sort by restrictiveness.',
  path: '/scope/',
  ogImage: '/og/scope.svg',
});

export default function ScopePage() {
  const matrix = getScopeMatrix();

  return (
    <div className="max-w-content mx-auto px-5 py-10">
      <SectionHeader
        label="Scope of Regulation"
        title="What Requires a Certificate of Need?"
        subtitle="Each checkmark means a state requires government permission before that type of healthcare facility can be built or expanded. Filter by category to find which states regulate a specific service."
      />
      <ScopeMatrix rows={matrix} categories={[...SCOPE_CATEGORIES]} />
    </div>
  );
}
