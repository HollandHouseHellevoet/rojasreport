import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy-dark border-t border-white/10">
      <div className="max-w-content mx-auto px-5 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="font-display text-lg font-bold text-cream tracking-wide">
              THE ROJAS REPORT
            </p>
            <p className="mt-2 text-sm text-cream/40 font-body leading-relaxed">
              The definitive Certificate of Need intelligence platform.
              Free. Fully indexable. Built for six audiences.
            </p>
          </div>
          <div>
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-cream/40 mb-3">
              Intelligence
            </p>
            <div className="flex flex-col gap-2 text-sm font-body">
              <Link href="/rankings/" className="text-cream/60 hover:text-cream transition-colors">50-State Rankings</Link>
              <Link href="/scope/" className="text-cream/60 hover:text-cream transition-colors">Scope Matrix</Link>
              <Link href="/compare/" className="text-cream/60 hover:text-cream transition-colors">Compare States</Link>
              <Link href="/reform/" className="text-cream/60 hover:text-cream transition-colors">Reform Tracker</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-cream/40 mb-3">
              Research
            </p>
            <div className="flex flex-col gap-2 text-sm font-body">
              <Link href="/evidence/" className="text-cream/60 hover:text-cream transition-colors">Evidence</Link>
              <Link href="/outcomes/" className="text-cream/60 hover:text-cream transition-colors">Reform Outcomes</Link>
              <Link href="/timeline/" className="text-cream/60 hover:text-cream transition-colors">Timeline</Link>
              <Link href="/methodology/" className="text-cream/60 hover:text-cream transition-colors">Methodology</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-cream/40 mb-3">
              Network
            </p>
            <div className="flex flex-col gap-2 text-sm font-body">
              <a href="https://rojasreport.com" target="_blank" rel="noopener noreferrer"
                className="text-cream/60 hover:text-cream transition-colors">
                rojasreport.com
              </a>
              <a href="https://poh.rojasreport.com" target="_blank" rel="noopener noreferrer"
                className="text-cream/60 hover:text-cream transition-colors">
                Physician-Owned Hospitals
              </a>
              <a href="https://aha.rojasreport.com" target="_blank" rel="noopener noreferrer"
                className="text-cream/60 hover:text-cream transition-colors">
                AHA Board Dossiers
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/30 font-body">
            Data sourced from Cicero Institute, NASHP, FTC, DOJ, CMS, and state health departments.
          </p>
          <p className="text-xs font-body tracking-widest uppercase text-orange">
            The Rojas Report
          </p>
        </div>
      </div>
    </footer>
  );
}
