import type { Metadata } from 'next';
import Link from 'next/link';
import { Band, btnInk, btnOutline, eyebrow, lede } from '@/components/alliance/ui';
import { GOAL_PHYSICIANS } from '@/lib/site';
import { makeMetadata } from '@/lib/seo';

export const metadata: Metadata = { ...makeMetadata({ title: 'Welcome to the Alliance', description: 'Your membership is active.', path: '/physicians/join/thanks/' }), robots: { index: false, follow: false } };

export default function Page() {
  return (
    <Band>
      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <p className={eyebrow}>Membership</p>
          <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.02] text-[40px] md:text-[64px]">You are in the fight.</h1>
          <p className={lede}>Your membership is active and Stripe has emailed a receipt. You are counted toward {GOAL_PHYSICIANS} independent physicians. The first progress report reaches your inbox the day it is published.</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link href="/fights/" className={btnInk}>Read the three fights</Link>
            <Link href="/insights/" className={btnOutline}>Read the insights</Link>
          </div>
        </div>
      </div>
    </Band>
  );
}
