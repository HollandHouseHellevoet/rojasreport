import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, eyebrow } from '@/components/alliance/ui';
import TaxNotice from '@/components/TaxNotice';
import JsonLd from '@/components/alliance/JsonLd';
import { ORG } from '@/lib/site';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

// Counsel sets the effective date and the governing state. Until then the terms say they are a draft.
export const metadata: Metadata = makeMetadata({
  title: 'Terms of Use',
  description: `Terms of use for tafhc.org and membership in ${ORG}.`,
  path: '/terms/',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'Terms', path: '/terms/' }])} />
      <Band>
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-8 prose-site">
            <p className={`${eyebrow} mb-3`}>Legal</p>
            <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.02] text-[40px] md:text-[56px] mb-4">Terms of Use</h1>
            <p>These terms are a draft and are not yet in force. Their effective date is posted here when they are final.</p>
            <h2>Use of the site</h2>
            <p>tafhc.org is published by {ORG} (“the Alliance”). By using the site you agree to these terms. The site’s content is for information and advocacy. It is not legal, medical, tax or investment advice.</p>
            <h2>Content and sources</h2>
            <p>The Alliance’s reports, briefs, dossiers and data may be quoted and shared with attribution to {ORG} and a link to the source page. Every figure on the site carries a citation to its source; those sources remain the property of their publishers. The research is produced for the Alliance under contract by Rojas Media, an independent research firm; the Alliance owns and publishes the work.</p>
            <h2>Membership</h2>
            <ul>
              <li>Membership is open to physicians in independent practice and to others the Alliance admits. The Alliance may decline or end a membership at its discretion, with a refund of any dues paid for the unused period.</li>
              <li>Dues are billed monthly or annually by Stripe and renew until cancelled. Cancel anytime; your membership remains active through the end of your current billing period.</li>
              <li>Membership confers no ownership interest in the Alliance and no right to direct its positions.</li>
            </ul>
            <h2>Dues, gifts and taxes</h2>
            <TaxNotice />
            <p>Gifts are voluntary and are not refundable except where the law requires or where made in error, in which case write to the Alliance through the <Link href="/contact/">contact page</Link> within 30 days.</p>
            <h2>Accounts and security</h2>
            <p>Where a member login is offered, you are responsible for keeping your credentials private and for activity under your account.</p>
            <h2>Limitation of liability</h2>
            <p>The site is provided as is. To the fullest extent permitted by law, the Alliance is not liable for indirect or consequential damages arising from use of the site or reliance on its content.</p>
            <h2>Governing law</h2>
            <p>The governing law is set when these terms are final.</p>
            <h2>Changes</h2>
            <p>Changes to these terms are posted here with a new effective date. Continued use of the site after a change is acceptance of it.</p>
            <h2>Contact</h2>
            <p>Write to the Alliance through the <Link href="/contact/">contact page</Link>.</p>
          </div>
        </div>
      </Band>
    </>
  );
}
