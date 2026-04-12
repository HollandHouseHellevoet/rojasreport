const findings = [
  {
    stat: '5-11%',
    label: 'Higher Healthcare Costs',
    context: 'In CON states compared to free market states.',
    source: 'Mercatus Center',
  },
  {
    stat: '44-47%',
    label: 'More ASCs After Repeal',
    context: 'Increase in ambulatory surgery centers per capita.',
    source: 'FTC/DOJ Joint Statement',
  },
  {
    stat: '92-112%',
    label: 'Rural ASC Growth',
    context: 'Increase in rural surgery centers after CON repeal.',
    source: 'Journal of Health Economics',
  },
];

export default function EvidencePreview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {findings.map((f) => (
        <div key={f.stat} className="border border-white/10 p-5">
          <div className="font-display text-stat text-orange">
            {f.stat}
          </div>
          <p className="mt-1 font-body text-sm font-semibold text-cream">
            {f.label}
          </p>
          <p className="mt-1 font-body text-sm text-cream/50 leading-relaxed">
            {f.context}
          </p>
          <p className="mt-3 font-body text-xs text-cream/30">
            {f.source}
          </p>
        </div>
      ))}
    </div>
  );
}
