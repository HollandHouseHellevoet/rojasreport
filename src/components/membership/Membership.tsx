import type { ReactNode } from 'react';

export function Label({ children }: { children: ReactNode }) {
  return (
    <p className="font-body text-[11px] font-semibold tracking-[0.15em] uppercase text-orange mb-3">{children}</p>
  );
}

export function Hero({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) {
  return (
    <section className="max-w-content mx-auto px-5 pt-20 pb-14">
      <Label>{eyebrow}</Label>
      <h1 className="font-display text-4xl sm:text-6xl text-cream leading-[1.05] max-w-3xl [text-wrap:balance]">
        {title}
      </h1>
      <p className="font-body text-lg text-cream/70 max-w-2xl mt-6 leading-relaxed">{lede}</p>
    </section>
  );
}

export function Block({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="max-w-content mx-auto px-5 py-14 border-t border-ink/10">
      <Label>{label}</Label>
      <h2 className="font-display text-3xl text-cream mb-8 [text-wrap:balance]">{title}</h2>
      {children}
    </section>
  );
}

export function Grid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="grid gap-px bg-ink/10 sm:grid-cols-2 border border-ink/10">
      {items.map((i) => (
        <div key={i.title} className="bg-dark p-6">
          <h3 className="font-display text-xl text-cream mb-2">{i.title}</h3>
          <p className="font-body text-sm text-cream/65 leading-relaxed">{i.body}</p>
        </div>
      ))}
    </div>
  );
}

export function Apply({ subject, note }: { subject: string; note: string }) {
  const href = `mailto:info@rojasreport.com?subject=${encodeURIComponent(subject)}`;
  return (
    <section className="max-w-content mx-auto px-5 py-16 border-t border-ink/10">
      <Label>Apply</Label>
      <h2 className="font-display text-3xl text-cream mb-4">Membership is by application.</h2>
      <p className="font-body text-cream/70 max-w-2xl leading-relaxed mb-8">{note}</p>
      <a
        href={href}
        className="inline-block bg-oxblood text-paper font-body text-sm font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
      >
        Apply for membership →
      </a>
      <p className="font-body text-sm text-cream/50 mt-4">Or write to info@rojasreport.com with &ldquo;{subject}&rdquo; in the subject line.</p>
    </section>
  );
}

export function Independence() {
  return (
    <section className="max-w-content mx-auto px-5 pb-20">
      <p className="font-body text-sm text-cream/50 max-w-2xl leading-relaxed border-l-2 border-orange/60 pl-4">
        Membership buys access, never influence. The Rojas Report publishes what the evidence shows, regardless of who is a member.
      </p>
    </section>
  );
}
