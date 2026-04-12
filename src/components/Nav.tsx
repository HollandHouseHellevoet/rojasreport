import Link from 'next/link';

const navLinks = [
  { href: '/rankings/', label: 'Rankings' },
  { href: '/scope/', label: 'Scope' },
  { href: '/compare/', label: 'Compare' },
  { href: '/evidence/', label: 'Evidence' },
  { href: '/timeline/', label: 'Timeline' },
];

export default function Nav() {
  return (
    <nav className="bg-navy border-b border-white/10">
      <div className="max-w-content mx-auto px-5 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-display text-xl font-bold text-cream tracking-wide">
            CON LAWS
          </span>
          <span className="hidden sm:inline text-cream/40 text-xs font-body tracking-widest uppercase">
            The Rojas Report
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6 text-sm font-body">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream/60 hover:text-cream transition-colors hidden md:inline"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/rankings/" className="text-cream/60 hover:text-cream transition-colors md:hidden">
            Rankings
          </Link>
          <Link
            href="https://rojasreport.com"
            className="text-orange hover:text-orange-light transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            rojasreport.com
          </Link>
        </div>
      </div>
    </nav>
  );
}
