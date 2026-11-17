import type { Metadata } from 'next';
import { Band, Breadcrumb, eyebrow, lede } from '@/components/alliance/ui';
import JsonLd from '@/components/alliance/JsonLd';
import JoinBand from '@/components/JoinBand';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

export const metadata: Metadata = makeMetadata({
  title: 'Founder',
  description: 'Dutch Rojas, founder of the Alliance: twenty-seven years on the supply and demand side of healthcare, and why independent physicians needed a trade association of their own.',
  path: '/founder/',
});

// The founder's column (MERGER_PLAN.md, section 5.3): bylined Dutch Rojas, first person allowed here and nowhere else.
// The statement below is drawn from Dutch's own published About text (November 2026). Columns are added to the list as
// he writes them; the list renders only when one exists. The page never links to his personal newsletter and never names
// another business tied to him.
const columns: { slug: string; date: string; title: string; dek: string }[] = [];

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'About', path: '/about/' }, { name: 'Founder', path: '/founder/' }])} />
      <Band>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Breadcrumb trail={[{ name: 'About', href: '/about/' }, { name: 'Founder', href: '/founder/' }]} />
            <p className={eyebrow}>The founder</p>
            <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.02] text-[40px] md:text-[64px]">Dutch Rojas.</h1>
            <p className={lede}>Twenty-seven years on the supply and demand side of healthcare.</p>
            <div className="flex flex-col gap-5 text-[18px] leading-[1.6] max-w-[62ch]">
              <p>I built ambulatory surgery centers and independent practices. I founded direct contracting companies. I speak around the world on behalf of patients. Most recently, I put capital behind a medical malpractice carrier and a health plan built for independent physicians. I serve on the board of Physician-Led Healthcare for America, uncompensated.</p>
              <p>I have negotiated the payer contract. I have signed the lease. I have made payroll in a practice that competes with a tax-exempt system down the street.</p>
            </div>
          </div>
        </div>
      </Band>

      <Band mist label="Why the Alliance">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 flex flex-col gap-4">
            <p className={eyebrow}>Why the Alliance</p>
            <h2 className="font-tight font-bold leading-[1.05] tracking-[-0.03em] text-[32px] md:text-[44px]">The record is public. Somebody has to read it.</h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6 flex flex-col gap-5 text-[18px] leading-[1.6] max-w-[62ch]">
            <p>In 2021, the president of the Federation of American Hospitals sat for an interview and said the provision that froze physician ownership of hospitals would not exist without his organization. He mentioned the talking points he sent to senators. He said it into a microphone. It sat there for years.</p>
            <p>That is the job. Hospital systems have had a trade association for more than a century. Independent physicians, and the employers, payers and manufacturers who pay the hospital bill, never had one together. So I started one.</p>
            <p>The Alliance takes the side of the independent physician and the patient paying the bill. Every time. When a rule helps independent practice, the Alliance defends it. When a rule hurts it, the Alliance names the rule and the people who wrote it, and the party attached to it changes nothing.</p>
            <p>Every figure the Alliance publishes traces to a primary source, with the year on it. Modeled figures are labeled modeled. When something turns out wrong, the correction runs.</p>
          </div>
        </div>
      </Band>

      {columns.length > 0 && (
        <Band tight label="Columns">
          <h2 className="font-tight font-bold text-[28px] tracking-[-0.02em] mb-6">The founder’s column</h2>
          <div className="grid gap-8">
            {columns.map((c) => (
              <article key={c.slug} className="flex flex-col gap-2 pt-5 border-t border-hairline">
                <p className="text-[13px]">{c.date}</p>
                <h3 className="font-tight font-bold text-[22px]"><a href={`/founder/${c.slug}/`} className="hover:underline">{c.title}</a></h3>
                <p className="text-[15px]">{c.dek}</p>
              </article>
            ))}
          </div>
        </Band>
      )}

      <Band tight label="About the founder">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4"><p className={eyebrow}>For reporters</p></div>
          <p className="lg:col-span-7 lg:col-start-6 text-[16px] leading-[1.6] max-w-[62ch]">Dutch Rojas is a healthcare entrepreneur and United States Marine Corps veteran, born in the Netherlands. Over twenty-seven years he has built ambulatory surgery centers, independent practices and direct contracting companies, and founded four healthcare companies with three exits. He serves, uncompensated, on the board of Physician-Led Healthcare for America. He founded the Alliance for Healthcare Competition in 2026.</p>
        </div>
      </Band>
      <JoinBand />
    </>
  );
}
