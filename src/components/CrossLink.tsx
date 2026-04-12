import Link from 'next/link';

interface CrossLinkProps {
  href: string;
  label: string;
  title: string;
  description: string;
  external?: boolean;
}

export default function CrossLink({ href, label, title, description, external }: CrossLinkProps) {
  const El = external ? 'a' : Link;
  const extraProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <El
      href={href}
      className="block border border-white/10 p-5 hover:border-orange/40 transition-colors"
      {...extraProps}
    >
      <span className="text-xs font-body font-semibold tracking-widest uppercase text-cream/40">
        {label}
      </span>
      <h3 className="mt-2 font-display text-lg font-bold text-cream">
        {title}
      </h3>
      <p className="mt-1 font-body text-sm text-cream/50">
        {description}
      </p>
    </El>
  );
}
