import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy-dark border-t border-white/10">
      <div className="max-w-content mx-auto px-5 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <p className="font-display text-xl font-bold text-cream">The Rojas Report</p>
            <p className="font-body text-xs text-cream/40 mt-1">Healthcare Intelligence</p>
            <p className="mt-3 font-body text-sm text-cream/40 leading-relaxed">
              The definitive Certificate of Need intelligence platform.
              Built for physicians, executives, and lawmakers.
            </p>
          </div>

          {/* Network */}
          <div>
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-cream/40 mb-3">
              Network
            </p>
            <div className="flex flex-col gap-2 font-body text-sm">
              <a href="https://rojasreport.com" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">The Rojas Report</a>
              <a href="https://read.rojasreport.com" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">Substack</a>
              <a href="https://rojasreport.com/about" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">About</a>
              <a href="https://rojasreport.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">Privacy Policy</a>
            </div>
          </div>

          {/* Intelligence Dossiers */}
          <div>
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-cream/40 mb-3">
              Intelligence Dossiers
            </p>
            <div className="flex flex-col gap-2 font-body text-sm">
              <a href="https://aha.rojasreport.com" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">AHA Reports</a>
              <a href="https://academic.rojasreport.com" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">Academic Reports</a>
              <a href="https://waysandmeans.rojasreport.com" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">Ways &amp; Means</a>
              <a href="https://poh.rojasreport.com" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-cream transition-colors">Physician-Owned Hospitals</a>
            </div>
          </div>

          {/* CON Intelligence */}
          <div>
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-cream/40 mb-3">
              CON Intelligence
            </p>
            <div className="flex flex-col gap-2 font-body text-sm">
              <Link href="/rankings/" className="text-cream/50 hover:text-cream transition-colors">50-State Rankings</Link>
              <Link href="/scope/" className="text-cream/50 hover:text-cream transition-colors">Scope Matrix</Link>
              <Link href="/compare/" className="text-cream/50 hover:text-cream transition-colors">Compare States</Link>
              <Link href="/reform/" className="text-cream/50 hover:text-cream transition-colors">Reform Tracker</Link>
              <Link href="/outcomes/" className="text-cream/50 hover:text-cream transition-colors">Reform Outcomes</Link>
              <Link href="/methodology/" className="text-cream/50 hover:text-cream transition-colors">Methodology</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5">
          <p className="font-body text-xs text-cream/25 leading-relaxed">
            Data sourced from Cicero Institute, NASHP, FTC, DOJ, CMS, and state health departments.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-3">
            <p className="font-body text-xs text-cream/20">
              &copy; 2026 Rojas Media LLC. All rights reserved.
            </p>
            <p className="font-body text-xs text-cream/30">
              Built for physicians, executives &amp; lawmakers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
