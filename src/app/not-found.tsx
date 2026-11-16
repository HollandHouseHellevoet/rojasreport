import Link from 'next/link';
import { Band, eyebrow, lede } from '@/components/alliance/ui';

export const metadata = { title: 'Page not found', robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <Band>
      <p className={`${eyebrow} mb-4`}>404</p>
      <h1 className="font-tight font-extrabold tracking-[-0.035em] leading-[1.02] text-[40px] md:text-[64px]">That page is not here.</h1>
      <p className={`${lede} mt-6 max-w-[50ch]`}>
        The address may have changed in the move to tafhc.org. Start from the <Link href="/" className="underline">home page</Link>, read about <Link href="/fights/" className="underline">our fights</Link>, or <Link href="/search/" className="underline">search the research</Link>.
      </p>
    </Band>
  );
}
