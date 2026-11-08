import type { Metadata } from 'next';
import Link from 'next/link';
import { MethodPage, Section, Formula, Defs, Band, Pending, prose, small, th, td } from '@/components/methodology/Method';

/** /methodology/machine-score: the rules in docs/MACHINE_SCORE_DRAFT.md and docs/BUILD_BRIEF.md section 4.5. */

export const metadata: Metadata = {
  title: 'The Machine Score | Methodology',
  description: 'How The Rojas Report scores a member of Congress on independence from the hospital lobby. The anchor, the scored actions, the weights, the formula and the bands.',
  alternates: { canonical: 'https://rojasreport.com/methodology/machine-score/' },
};

const scored = [
  ['I. Physician-owned hospitals (Section 6001)', 'Bills to lift or keep the ban; letters to CMS on expansion exceptions'],
  ['II. Price transparency', 'Enforcement bills; votes on penalties; letters opposing or supporting CMS rules'],
  ['IV. Hospital subsidies', 'The 340B program reform; nonprofit tax exemption and charity care standards; DSH; tax-exempt bonds'],
  ['V. CMS favoritism', 'Site-neutral payment bills and amendments; facility fee limits; sign-on letters to CMS'],
  ['VI. Stark and Anti-Kickback', 'Bills that ease or tighten the rules that keep physicians from building competitors'],
];

const weights: [string, number][] = [
  ['Floor vote', 3],
  ['Committee vote or markup amendment', 2],
  ['Sponsoring a bill', 2],
  ['Cosponsoring a bill', 1],
  ['Signing a letter to CMS, HHS or leadership', 1],
  ['On-the-record public statement (hearing, release)', 1],
];

const bands: [string, string][] = [
  ['80 to 100', 'Reformer'],
  ['60 to 79', 'Independent'],
  ['40 to 59', 'Mixed'],
  ['20 to 39', 'Reliable ally of the lobby'],
  ['0 to 19', 'The Machine'],
];

const example = [
  ['Two floor votes with the lobby', '2 × 3', 6, 0],
  ['One committee vote against the lobby', '1 × 2', 2, 2],
  ['Cosponsored two lobby-backed bills', '2 × 1', 2, 0],
] as const;

export default function MachineScoreMethod() {
  return (
    <MethodPage
      crumb="The Machine Score"
      title="The Machine Score"
      lede="One number from 0 to 100 for every member of Congress: how independent the member is from the hospital lobby. Higher is better."
      asOf="Draft rules, version 1, November 2026. No scores are published yet; every member shows a dash until the first scores are released under the rules in force then."
    >
      <Section title="What it measures">
        <div className={`${prose} max-w-[760px] space-y-5`}>
          <p>A score of 100 means the member never sided with the hospital lobby on a scored action. A score of 0 means the member sided with the lobby every time.</p>
          <p>It measures behavior, not party, ideology or intent. A Republican and a Democrat with the same record get the same score.</p>
        </div>
      </Section>

      <Band tone="oxblood">
        <h2 className="font-display font-normal leading-[1.1] text-[32px] md:text-[40px] text-paper mb-6">The anchor: what counts as the lobby&rsquo;s side</h2>
        <p className="font-display text-[26px] md:text-[32px] leading-[1.3] text-paper max-w-[900px]">
          Each action is judged against the published position of the American Hospital Association or the Federation of American Hospitals. The position is on that specific bill, amendment, rule or letter.
        </p>
        <div className="mt-8 grid gap-8 text-oxblood-text text-[18px] leading-[1.5]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <p className="border-t border-oxblood-rule pt-4">The position comes from the lobby&rsquo;s own letters, key-vote alerts, testimony or press releases. We never decide what is pro-hospital; the AHA and FAH told everyone in writing.</p>
          <p className="border-t border-oxblood-rule pt-4">If neither group took a public position on an action, that action is not scored.</p>
          <p className="border-t border-oxblood-rule pt-4">Every scored action links to the vote, bill or letter and to the AHA or FAH document that states the lobby&rsquo;s position.</p>
        </div>
      </Band>

      <Section title="What gets scored" aside="Federal cost drivers only">
        <p className={`${prose} max-w-[760px] mb-6`}>
          Only actions on the cost drivers this site tracks. Certificate of need is left out for members of Congress because it is state law. It returns for state legislators.
        </p>
        <div className="table-scroll max-w-[1000px]">
          <table className="w-full border-collapse">
            <thead><tr><th className={`${th} w-[38%]`}>Driver</th><th className={th}>Examples of scored actions</th></tr></thead>
            <tbody>{scored.map(([d, e]) => (<tr key={d}><td className={`${td} pr-6`}>{d}</td><td className={`${td} text-body`}>{e}</td></tr>))}</tbody>
          </table>
        </div>
      </Section>

      <Section title="How actions are weighted">
        <div className="grid gap-10 max-w-[1000px]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <table className="w-full border-collapse self-start">
            <thead><tr><th className={th}>Action</th><th className={`${th} text-right`}>Weight</th></tr></thead>
            <tbody>{weights.map(([a, w]) => (<tr key={a}><td className={`${td} pr-4`}>{a}</td><td className={`${td} text-right font-display text-[26px]`}>{w}</td></tr>))}</tbody>
          </table>
          <div className={`${small} space-y-4`}>
            <p><span className="font-display text-[22px]">Recency.</span> Actions from the last three Congresses, six years, count in full. Older actions count half.</p>
            <p><span className="font-display text-[22px]">Minimum record.</span> A member needs at least five scored actions. Below that the member shows &ldquo;Insufficient record,&rdquo; not a number.</p>
            <p><span className="font-display text-[22px]">Money.</span> Hospital-industry PAC and executive contributions from FEC filings sit beside the score on every member&rsquo;s entry. They are not inside it. The score rests only on what the member did, judged against what the lobby asked for in writing.</p>
          </div>
        </div>
      </Section>

      <Section title="The formula">
        <Formula>Score = 100 × weighted actions against the lobby&rsquo;s position ÷ all weighted scored actions.</Formula>
        <h3 className="font-display text-[24px] mt-8 mb-2">Worked example, hypothetical</h3>
        <div className="table-scroll max-w-[860px]">
          <table className="w-full border-collapse">
            <thead><tr><th className={th}>Actions</th><th className={th}>Count × weight</th><th className={`${th} text-right`}>Scored</th><th className={`${th} text-right`}>Against the lobby</th></tr></thead>
            <tbody>
              {example.map(([a, c, s, g]) => (<tr key={a}><td className={`${td} pr-4`}>{a}</td><td className={`${td} text-muted`}>{c}</td><td className={`${td} text-right`}>{s}</td><td className={`${td} text-right`}>{g}</td></tr>))}
              <tr className="border-t-2 border-ink">
                <td className={`${td} border-b-0`} colSpan={2}>Score = 100 × 2 ÷ 10</td>
                <td className={`${td} border-b-0 text-right`}>10</td>
                <td className={`${td} border-b-0 text-right`}>2</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={`${prose} mt-6`}>Score: <span className="font-display text-[40px] text-oxblood">20</span>, in the band &ldquo;Reliable ally of the lobby.&rdquo;</p>
      </Section>

      <Section title="The bands" aside="The band label shows large, the number beside it">
        <div className="max-w-[640px]">
          <table className="w-full border-collapse">
            <thead><tr><th className={th}>Score</th><th className={th}>Band</th></tr></thead>
            <tbody>{bands.map(([s, b]) => (<tr key={s}><td className={`${td} w-[160px] font-display text-[22px]`}>{s}</td><td className={`${td} font-display text-[26px] ${b === 'The Machine' ? 'text-oxblood' : b === 'Reformer' ? 'text-green' : ''}`}>{b}</td></tr>))}</tbody>
          </table>
        </div>
      </Section>

      <Section title="Publication rules">
        <Defs
          items={[
            { term: 'Every action listed', body: 'Each scored action appears on the member’s entry with a link to the vote, bill or letter. It also links to the AHA or FAH document stating the lobby’s position.' },
            { term: 'Recalculated on each action', body: 'Scores are recalculated whenever a scored action happens. Every entry carries an as-of date.' },
            { term: 'Corrections', body: 'Any member’s office can submit a correction or a statement. Corrections are logged publicly.' },
            { term: 'Reproducible', body: 'The full list of scored actions is published as a download, so anyone can reproduce any score.' },
          ]}
        />
      </Section>

      <Section title="Still to be fixed before the first scores" aside="Draft rules">
        <p className={`${prose} max-w-[760px] mb-6`}>The rules above are the draft. These points are open, and the first published scores will state how each was settled.</p>
        <Defs
          items={[
            { term: <>Anchor for state legislators <Pending /></>, body: 'Whether state hospital associations join the AHA and FAH as the anchor when state legislators are scored.' },
            { term: <>Committee weight <Pending /></>, body: 'Whether committee votes weigh more than the draft’s 2, since committees are where bills are written.' },
            { term: <>Money <Pending /></>, body: 'Beside the score, as drafted, or inside it at up to 15 percent as a percentile rank of hospital-industry receipts.' },
            { term: <>Name and bands <Pending /></>, body: 'Whether the score keeps its name now that 100 is the best score. And whether the 0 to 19 band keeps the label “The Machine.”' },
            { term: <>Lookback <Pending /></>, body: 'Six years at full weight, as drafted, or the current Congress only.' },
            { term: <>Start date <Pending /></>, body: 'Whether scoring begins with the 120th Congress in January 2027 or with current members’ existing records.' },
          ]}
        />
        <p className="mt-10 font-meta text-[13px] leading-[1.7] text-muted max-w-[720px]">
          Shown on the <Link href="/committees/senate-finance/" className="text-ink border-b border-hairline hover:text-oxblood">Senate Finance</Link> scorecard.{' '}
          <Link href="/methodology/" className="text-ink border-b border-hairline hover:text-oxblood">All methods</Link> ·{' '}
          <a href="https://read.rojasreport.com/about" className="text-ink border-b border-hairline hover:text-oxblood">Report a correction</a>
        </p>
      </Section>
    </MethodPage>
  );
}
