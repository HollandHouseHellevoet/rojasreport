import type { Metadata } from 'next';
import Link from 'next/link';
import { stateDossiers, stateGrade, word } from '@/lib/stateDossiers';
import { MethodPage, Section, Formula, Defs, Band, Pending, prose, small, th, td } from '@/components/methodology/Method';

/** /methodology/state-grade: the formula in docs/BUILD_BRIEF.md section 4.3, worked on the published dossiers. */

export const metadata: Metadata = {
  title: 'The State Grade | Methodology',
  description: 'How The Rojas Report grades a state: six cost drivers, one letter each, weighted into a single grade. The weights, the cutoffs and what makes a grade provisional.',
  alternates: { canonical: 'https://rojasreport.com/methodology/state-grade/' },
};

const drivers = [
  { n: 'I', title: 'Physician-owned hospitals', weight: 5 },
  { n: 'II', title: 'Price transparency', weight: 12.5 },
  { n: 'III', title: 'Certificate of need', weight: 30 },
  { n: 'IV', title: 'Hospital subsidies', weight: 27.5 },
  { n: 'V', title: 'CMS favoritism', weight: 12.5 },
  { n: 'VI', title: 'Stark and Anti-Kickback', weight: 12.5 },
];

const points: [string, number][] = [['A', 4], ['B', 3], ['C', 2], ['D', 1], ['F', 0]];
const cutoffs: [string, string][] = [['A', '3.5 or higher'], ['B', '2.5 to 3.49'], ['C', '1.5 to 2.49'], ['D', '0.5 to 1.49'], ['F', 'below 0.5']];
const pts: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 };

export default function StateGradeMethod() {
  return (
    <MethodPage
      crumb="The State Grade"
      title="The State Grade"
      lede="One letter for how a state treats the people who pay for its hospitals. Six cost drivers, graded one by one, weighted into a single letter."
      asOf="Methodology version 1, November 2026. In use on state dossiers."
    >
      <Section title="The formula">
        <Formula>Grade = the weighted average of the driver points, read against the letter cutoffs.</Formula>
        <div className={`${prose} max-w-[760px] space-y-5`}>
          <p>Each of the six cost drivers gets a letter grade for the state. Each letter is worth points: A is 4, down to F at 0.</p>
          <p>Each driver has a fixed weight. The weighted average of the points is the state&rsquo;s number, and the cutoffs turn it back into a letter.</p>
        </div>
        <div className="grid gap-10 mt-10 max-w-[760px]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div>
            <table className="w-full border-collapse">
              <thead><tr><th className={th}>Letter</th><th className={`${th} text-right`}>Points</th></tr></thead>
              <tbody>{points.map(([l, p]) => (<tr key={l}><td className={`${td} font-display text-[24px]`}>{l}</td><td className={`${td} text-right font-display text-[24px]`}>{p}</td></tr>))}</tbody>
            </table>
          </div>
          <div>
            <table className="w-full border-collapse">
              <thead><tr><th className={th}>Grade</th><th className={`${th} text-right`}>Weighted average</th></tr></thead>
              <tbody>{cutoffs.map(([l, c]) => (<tr key={l}><td className={`${td} font-display text-[24px]`}>{l}</td><td className={`${td} text-right`}>{c}</td></tr>))}</tbody>
            </table>
          </div>
        </div>
      </Section>

      <Band tone="green">
        <h2 className="font-display font-normal leading-[1.1] text-[32px] md:text-[40px] text-paper mb-8">The six drivers and their weights</h2>
        <div className="grid gap-x-10 gap-y-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {drivers.map((d) => (
            <div key={d.n} className="border-t border-green-rule pt-4">
              <div className="flex justify-between items-baseline gap-4">
                <h3 className="font-display text-[26px] leading-[1.15] text-paper"><span className="text-green-text mr-2">{d.n}.</span>{d.title}</h3>
                <span className="font-display text-[34px] leading-none text-paper whitespace-nowrap">{d.weight}%</span>
              </div>
              
            </div>
          ))}
        </div>
        <p className="mt-10 text-[17px] text-green-text-2 max-w-[760px]">The weights add to 100.</p>
      </Band>

      <Section title="Provisional grades">
        <div className={`${prose} max-w-[760px] space-y-5`}>
          <p>A driver that has not been graded drops out. The remaining weights are scaled back up to 100 and the average is taken over the graded drivers only.</p>
          <p>Until all six drivers are graded, the grade box says &ldquo;provisional&rdquo; and shows how many drivers are in. A provisional grade can move either way when the missing drivers come in.</p>
        </div>
      </Section>

      <Section title="Worked on the published dossiers" aside="Calculated live from the dossier data">
        {stateDossiers.map((d) => {
          const g = stateGrade(d);
          const graded = d.drivers.filter((x) => x.grade);
          const w = graded.reduce((s, x) => s + x.weight, 0);
          const sum = graded.reduce((s, x) => s + x.weight * pts[x.grade as string], 0);
          return (
            <div key={d.slug} className="max-w-[860px] mb-10">
              <h3 className="font-display text-[28px] mb-3">
                <Link href={`/states/${d.slug}/`} className="hover:text-oxblood">{d.name}</Link>:{' '}
                <span className={g.letter === 'A' || g.letter === 'B' ? 'text-green' : g.letter === 'C' ? 'text-gold' : 'text-oxblood'}>{g.letter ?? '—'}</span>
                {g.provisional && <span className="italic text-[18px] text-muted ml-3">provisional, {word(g.graded)} of {word(g.total)} drivers</span>}
              </h3>
              <div className="table-scroll">
                <table className="w-full border-collapse">
                  <thead>
                    <tr><th className={th}>Driver</th><th className={th}>Grade</th><th className={`${th} text-right`}>Points</th><th className={`${th} text-right`}>Weight</th><th className={`${th} text-right`}>Points × weight</th></tr>
                  </thead>
                  <tbody>
                    {d.drivers.map((x) => (
                      <tr key={x.num} className={x.grade ? '' : 'text-muted'}>
                        <td className={`${td} pr-4`}>{x.num}. {x.title}</td>
                        <td className={`${td} font-display text-[22px]`}>{x.grade ?? <Pending>Not graded</Pending>}</td>
                        <td className={`${td} text-right`}>{x.grade ? pts[x.grade] : '—'}</td>
                        <td className={`${td} text-right`}>{x.grade ? `${x.weight}%` : <span className="line-through">{x.weight}%</span>}</td>
                        <td className={`${td} text-right`}>{x.grade ? (x.weight * pts[x.grade]).toFixed(1) : '—'}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-ink">
                      <td className={`${td} border-b-0`} colSpan={3}>Weighted average: {sum.toFixed(1)} ÷ {w} graded weight</td>
                      <td className={`${td} border-b-0 text-right`} colSpan={2}>{(sum / w).toFixed(2)} → <span className="font-display text-[22px]">{g.letter}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </Section>

      <Section title="How each driver is graded" aside="Rubrics">
        <p className={`${prose} max-w-[760px] mb-6`}>
          A rubric is the written test that turns a state&rsquo;s facts into a letter for one driver. Each rubric is published here when it is finished, and the dossier data cites it.
        </p>
        <Defs
          items={drivers.map((d) => ({
            term: <>{d.n}. {d.title}</>,
            body: (
              <p><Pending>Rubric pending</Pending> <span className={`${small} ml-2`}>Current driver grades are editorial grades, marked provisional on the dossier.</span></p>
            ),
          }))}
        />
        <p className="mt-10 font-meta text-[13px] leading-[1.7] text-muted max-w-[720px]">
          <Link href="/methodology/" className="text-ink border-b border-hairline hover:text-oxblood">All methods</Link> ·{' '}
          <Link href="/methodology/subsidy-ledger/" className="text-ink border-b border-hairline hover:text-oxblood">The Subsidy Ledger</Link> ·{' '}
          <a href="https://read.rojasreport.com/about" className="text-ink border-b border-hairline hover:text-oxblood">Report a correction</a>
        </p>
      </Section>
    </MethodPage>
  );
}
