import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, eyebrow } from '@/components/alliance/ui';
import JsonLd from '@/components/alliance/JsonLd';
import { ORG } from '@/lib/site';
import { breadcrumbsJsonLd, makeMetadata } from '@/lib/seo';

// Counsel sets the effective date. Until then the policy says it is a draft.
export const metadata: Metadata = makeMetadata({
  title: 'Privacy Policy',
  description: `How ${ORG} collects, uses and protects information from visitors, members and supporters.`,
  path: '/privacy/',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: 'Privacy', path: '/privacy/' }])} />
      <Band>
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-8 prose-site">
            <p className={`${eyebrow} mb-3`}>Legal</p>
            <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.02] text-[40px] md:text-[56px] mb-4">Privacy Policy</h1>
            <p>This policy is a draft and is not yet in force. Its effective date is posted here when it is final.</p>
            <h2>Who we are</h2>
            <p>{ORG} (“the Alliance”) is a 501(c)(6) trade association. This policy explains what information the Alliance collects through tafhc.org, how it is used and the choices you have.</p>
            <h2>What we collect</h2>
            <ul>
              <li><strong>Information you give us.</strong> Name, email address, specialty, state, practice name and message content when you join, give, subscribe to the newsletter or write to us through a form.</li>
              <li><strong>Payment information.</strong> Dues and gifts are processed by Stripe. Card numbers go directly to Stripe and are never stored on the Alliance’s systems. Stripe’s privacy policy governs its handling of that data.</li>
              <li><strong>Site analytics.</strong> The site runs no analytics today. If that changes, it will use cookieless analytics that record page views in aggregate. No personal profile is built and no advertising identifiers are used.</li>
              <li><strong>Hosting.</strong> The site is hosted on Netlify, which may keep standard server access logs under its own privacy policy.</li>
            </ul>
            <h2>How we use it</h2>
            <ul>
              <li>To process membership and giving, and to send the progress reports, data and member communications you asked for.</li>
              <li>To answer your messages, inquiries and correction requests.</li>
              <li>To meet the Alliance’s legal and tax reporting obligations as a 501(c)(6).</li>
              <li>To aggregate membership by specialty and state in order to describe the Alliance’s membership to lawmakers. Individuals are never identified in that reporting.</li>
            </ul>
            <h2>What we do not do</h2>
            <ul>
              <li>The Alliance does not sell, rent or trade personal information.</li>
              <li>The Alliance does not publish the names of members, partners or contributors.</li>
              <li>The Alliance does not share personal information with third parties except the companies that run this site, process payments and send email on its behalf, each bound to use the information only for that purpose, and except where the law requires.</li>
            </ul>
            <h2>People named in the research</h2>
            <p>The dossiers on this site cover executives, directors, lobbyists and officials in their professional and public capacities. Sources are limited to public filings, regulatory disclosures and published reporting, and every page says where each figure comes from. Anyone named may ask for a correction through the <Link href="/corrections/">corrections page</Link>.</p>
            <h2>Your choices</h2>
            <p>You can unsubscribe from any email with the link in the message. You can ask the Alliance to correct or delete your information, or to tell you what it holds about you, by writing to the Alliance through the <Link href="/contact/">contact page</Link>. Requests are answered within 30 days.</p>
            <h2>Retention and security</h2>
            <p>Membership and giving records are kept for as long as the law requires for a 501(c)(6). Messages are kept for two years. Information is stored with services that encrypt it in transit and at rest.</p>
            <h2>Children</h2>
            <p>The site is intended for adults. The Alliance does not knowingly collect information from anyone under 16.</p>
            <h2>Changes</h2>
            <p>Changes to this policy are posted here with a new effective date.</p>
            <h2>Contact</h2>
            <p>Write to the Alliance through the <Link href="/contact/">contact page</Link>.</p>
          </div>
        </div>
      </Band>
    </>
  );
}
