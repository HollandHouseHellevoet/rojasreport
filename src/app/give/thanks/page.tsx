import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, btnInk, btnOutline, eyebrow, lede } from '@/components/alliance/ui';
import { makeMetadata } from '@/lib/seo';

export const metadata: Metadata = { ...makeMetadata({ title: 'Thank you', description: 'Your gift to the Alliance was received.', path: '/give/thanks/' }), robots: { index: false, follow: false } };

export default function Page() {
  return (
    <Band>
      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <p className={eyebrow}>Giving</p>
          <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.02] text-[40px] md:text-[64px]">Thank you.</h1>
          <p className={lede}>Your gift was received and Stripe has emailed a receipt. It goes to the three fights and nowhere else. Your name is not published.</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link href="/how-we-win/" className={btnInk}>See how the Alliance wins</Link>
            <Link href="/insights/" className={btnOutline}>Read the insights</Link>
          </div>
        </div>
      </div>
    </Band>
  );
}
