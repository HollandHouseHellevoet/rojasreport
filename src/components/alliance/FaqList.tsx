/** Collapsible questions. Answers are HTML strings (one paragraph each), as on the Alliance site. */
export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-hairline">
      {items.map((it) => (
        <details key={it.q} className="border-b border-hairline group">
          <summary className="flex justify-between items-center gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-tight font-semibold text-[18px] tracking-[-0.01em]">
            <span>{it.q}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-45"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" /></svg>
          </summary>
          <div className="prose-site pb-6 text-[16px] leading-[1.55]" dangerouslySetInnerHTML={{ __html: it.a }} />
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a.replace(/<[^>]+>/g, '') } })),
  };
}
