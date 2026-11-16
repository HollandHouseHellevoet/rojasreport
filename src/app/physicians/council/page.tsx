import type { Metadata } from 'next';
import { Band, Breadcrumb, SectionHead, lede } from '@/components/alliance/ui';
import { Field, Form, STATES } from '@/components/alliance/Form';
import SentNotice from '@/components/alliance/SentNotice';
import TaxNotice from '@/components/TaxNotice';
import JsonLd from '@/components/alliance/JsonLd';
import JoinBand from '@/components/JoinBand';
import membership from '@/data/alliance/membership.json';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

const council = membership.levels[1];

export const metadata: Metadata = makeMetadata({
  title: 'The Council',
  description: `One hundred physicians, by invitation, who set the Alliance’s priorities each year. ${council.monthly} a month or ${council.annual} a year.`,
  path: '/physicians/council/',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'For Physicians', path: '/physicians/' }, { name: 'The Council', path: '/physicians/council/' }])} />
      <section className="pt-14 md:pt-[112px] pb-12 md:pb-20 border-b border-hairline">
        <div className="max-w-content mx-auto px-4 md:px-8 grid gap-10 lg:grid-cols-12 items-end">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Breadcrumb trail={[{ name: 'For Physicians', href: '/physicians/' }, { name: 'The Council', href: '/physicians/council/' }]} />
            <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.02] text-[40px] md:text-[64px] lg:text-[80px]">The Council.</h1>
            <p className={`${lede} max-w-[60ch]`}>{council.open} {council.seats} seats. Council members set the Alliance’s priorities each year and are briefed by the research arm before publication.</p>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-2 pt-4 border-t-2 border-ink">
            <span className="num text-[40px] md:text-[56px]">{council.monthly}<span className="text-[20px] font-semibold tracking-normal">/month</span></span>
            <span className="font-tight font-semibold text-[16px]">or {council.annual} a year</span>
            <span className="text-[13px]">The Alliance estimates {membership.deductibleShare} of dues are deductible as a business expense.</span>
          </div>
        </div>
      </section>

      <Band label="What the Council does">
        <SectionHead eyebrow="What the Council does" title="The hundred physicians the Alliance answers to." />
        <ol className="grid gap-8 lg:grid-cols-3 list-none m-0 p-0">
          {council.benefits.map((b, i) => (
            <li key={b} className="flex flex-col gap-3.5 pt-5 border-t-2 border-ink">
              <span className="num text-[14px] tracking-[0.08em]" aria-hidden="true">0{i + 1}</span>
              <p className="font-tight font-semibold text-[19px] leading-[1.3] tracking-[-0.01em]">{b}</p>
            </li>
          ))}
        </ol>
      </Band>

      <Band dark id="invitation" label="Invitations">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 flex flex-col gap-5 self-start">
            <p className="font-tight text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-text">Invitations</p>
            <h2 className="font-tight font-bold leading-[1.05] tracking-[-0.03em] text-[32px] md:text-[44px]">By invitation. Ask to be considered.</h2>
            <p className="text-ink-text-2 text-[16px] leading-[1.55]">Seats are offered by Alliance leadership to physicians in independent practice whose standing in a specialty or a state makes a difference in a hearing room. If you hold an invitation, write with the code it carries. If you want to be considered, say who you are and where you practice. Nothing you send is published.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <SentNotice messages={{ council: 'Thank you. Your message went to Alliance leadership. Expect a direct reply within two business days.' }} />
            <Form name="council" subject="TAFHC Council" action="/physicians/council/?sent=council#invitation" submit="Send to leadership" note="Confidential. Not shared outside the Alliance’s leadership." dark>
              <Field label="Full name" id="c-name"><input id="c-name" name="name" type="text" required autoComplete="name" /></Field>
              <Field label="Email" id="c-email"><input id="c-email" name="email" type="email" required autoComplete="email" /></Field>
              <Field label="Specialty" id="c-spec"><input id="c-spec" name="specialty" type="text" required /></Field>
              <Field label="State" id="c-state">
                <select id="c-state" name="state" required defaultValue=""><option value="">Choose</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
              </Field>
              <Field label="Practice" id="c-practice" full><input id="c-practice" name="practice" type="text" required autoComplete="organization" /></Field>
              <Field label="Invitation code, if you hold one" id="c-code"><input id="c-code" name="invitation" type="text" /></Field>
              <Field label="Message" id="c-msg" full><textarea id="c-msg" name="message" rows={5} /></Field>
            </Form>
            <div className="mt-8"><TaxNotice onDark /></div>
          </div>
        </div>
      </Band>

      <JoinBand title="Not invited yet? Join as a Physician Member." text="Every Physician Member funds the three fights and keeps the research free. The Council is drawn from the membership." />
    </>
  );
}
