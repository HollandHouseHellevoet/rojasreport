const findings = [
  {
    stat: '5-11%',
    label: 'Higher healthcare costs in CON states',
    source: 'Mercatus Center',
  },
  {
    stat: '44-47%',
    label: 'Increase in ASCs per capita after CON repeal',
    source: 'FTC/DOJ Joint Statement',
  },
  {
    stat: '92-112%',
    label: 'Increase in rural ASCs after CON repeal',
    source: 'Journal of Health Economics',
  },
];

export default function EvidencePreview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {findings.map((f) => (
        <div key={f.stat} className="border border-white/10 p-5">
          <div className="font-display text-3xl font-bold text-orange">
            {f.stat}
          </div>
          <p className="mt-2 font-body text-sm text-cream/70 leading-relaxed">
            {f.label}
          </p>
          <p className="mt-3 font-body text-xs text-cream/30">
            {f.source}
          </p>
        </div>
      ))}
    </div>
  );
}
