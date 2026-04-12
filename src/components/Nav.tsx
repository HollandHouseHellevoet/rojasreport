import Link from 'next/link';

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
        <div className="flex items-center gap-6 text-sm font-body">
          <Link href="/rankings/" className="text-cream/60 hover:text-cream transition-colors">
            Rankings
          </Link>
          <Link href="/states/kentucky/" className="text-cream/60 hover:text-cream transition-colors hidden md:inline">
            States
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
