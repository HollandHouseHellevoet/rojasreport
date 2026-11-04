import Link from 'next/link';
import { getSection } from '@/lib/home';
import DeskList from '@/components/home/DeskList';

export default function SectionPage({ slug, children }: { slug: string; children?: React.ReactNode }) {
  const s = getSection(slug);
  return (
    <div className="max-w-content mx-auto px-5 py-14">
      <nav className="font-body text-[13px] text-cream/40 mb-8">
        <Link href="/" className="hover:text-cream transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-cream/70">{s.name}</span>
      </nav>
      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-orange mb-3">{s.question}</p>
      <h1 className="font-display text-5xl font-bold text-cream mb-10">{s.name}</h1>
      <DeskList desks={s.desks} />
      {children}
    </div>
  );
}
