import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy-dark border-t border-white/10 print:hidden">
      <div className="max-w-content mx-auto px-5 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <p className="font-display text-xl font-bold text-cream">The Rojas Report</p>
              <p className="font-body text-[11px] font-semibold text-orange tracking-[0.15em] uppercase mt-1">
                Healthcare Intelligence
              </p>
            </Link>
            <p className="mt-3 font-body text-sm text-cream/40 leading-relaxed">
              Intelligence briefings on healthcare markets, regulation, and reform.
              Built for physicians, executives, and lawmakers.
            </p>
          </div>

          {/* Investigations */}
          <div>
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-cream/40 mb-3">
              Desks
            </p>
            <div className="flex flex-col gap-2 font-body text-sm">
              <Link href="/con/" className="text-cream/50 hover:text-cream transition-colors">CON Laws</Link>
              <Link href="/aha/" className="text-cream/50 hover:text-cream transition-colors">American Hospital Association</Link>
              <Link href="/academic/" className="text-cream/50 hover:text-cream transition-colors">Academic Medical Centers</Link>
              <Link href="/fah/" className="text-cream/50 hover:text-cream transition-colors">Federation of American Hospitals</Link>
              <a href="https://poh.rojasreport.com" className="text-cream/50 hover:text-cream transition-colors">Physician-Owned Hospitals</a>
              <a href="/hac/" className="text-cream/50 hover:text-cream transition-colors">HHS Advisory Committee</a>
              <a href="https://waysandmeans.rojasreport.com" className="text-cream/50 hover:text-cream transition-colors">Ways &amp; Means</a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-cream/40 mb-3">
              Resources
            </p>
            <div className="flex flex-col gap-2 font-body text-sm">
              <a href="https://read.rojasreport.com" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">Newsletter</a>
              <a href="https://youtube.com/@DutchRojas" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">YouTube</a>
              <a href="https://read.rojasreport.com/about" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">About</a>
              <a href="https://read.rojasreport.com/about" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">Contact</a>
              <Link href="/methodology/" className="text-cream/50 hover:text-cream transition-colors">Methodology</Link>
              <Link href="/privacy/" className="text-cream/50 hover:text-cream transition-colors">Privacy Policy</Link>
            </div>
          </div>

          {/* Ecosystem */}
          <div>
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-cream/40 mb-3">
              Ecosystem
            </p>
            <div className="flex flex-col gap-2 font-body text-sm">
              <a href="https://medmerge.co" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">MedMerge</a>
              <a href="https://www.phycapfund.com" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">PhyCap Fund</a>
              <a href="https://physiciansled.com" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">Physician Led Healthcare for America</a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5">
          <p className="font-body text-xs text-cream/25 leading-relaxed">
            Sourced to public records: IRS Form 990s, Senate lobbying disclosures, FEC filings, CMS, HRSA, court records, and state agencies. Each desk lists its sources.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-3">
            <p className="font-body text-xs text-cream/20">
              &copy; 2026 The Rojas Report. All rights reserved.
            </p>
            <p className="font-body text-xs text-cream/30 italic">
              Built for physicians, executives &amp; lawmakers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
