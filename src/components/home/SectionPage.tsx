import Link from 'next/link';
import { getSection } from '@/lib/home';
import DeskList from '@/components/home/DeskList';

const bandText = { green: 'text-green', oxblood: 'text-oxblood' } as const;

/** Section landing page: breadcrumb, eyebrow, name, intro, then the desks. */
export default function SectionPage({ slug, children }: { slug: string; children?: React.ReactNode }) {
  const s = getSection(slug);
  return (
    <div className="max-w-content mx-auto px-5 md:px-8 pt-10 pb-20">
      <nav aria-label="Breadcrumb" className="font-meta text-[13px] tracking-[0.1em] text-muted mb-7">
        <Link href="/" className="hover:text-oxblood">/Home</Link> <span className="text-ink">/{s.name}</span>
      </nav>
      <p className={`font-meta text-[13px] uppercase tracking-[0.14em] mb-3 ${bandText[s.band]}`}>{s.question}</p>
      <h1 className="font-display text-[44px] md:text-[56px] leading-[1.05] mb-5">{s.name}</h1>
      {s.intro && <p className="text-[20px] leading-[1.4] text-body max-w-[720px] mb-10">{s.intro}</p>}
      <DeskList desks={s.desks} band={s.band} />
      {children}
    </div>
  );
}
