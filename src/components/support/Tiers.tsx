import { tiers, checkoutOpen, SUPPORT_LINE } from '@/lib/support';

/**
 * The four support tiers on a green band (home mockup, section VI). A tier with a Stripe link is a link;
 * one without renders as a plain block, and the line under the grid says checkout is still to open.
 */
export default function Tiers({ tone = 'green' }: { tone?: 'green' | 'oxblood' }) {
  const ox = tone === 'oxblood';
  const soft = ox ? 'text-oxblood-text' : 'text-green-text';
  return (
    <div>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
        {tiers.map((t) => {
          const cls = `border-[1.5px] px-[18px] py-[20px] flex flex-col gap-1.5 ${
            t.primary ? `border-paper bg-paper ${ox ? 'text-oxblood' : 'text-green'}` : `${ox ? 'border-oxblood-text' : 'border-green-text'} text-paper`
          }`;
          const inner = (
            <>
              <span className={`font-meta text-[13px] font-semibold uppercase tracking-[0.1em] ${t.primary ? '' : 'text-paper'}`}>{t.name}</span>
              <span className={ox ? 'font-tight font-extrabold text-[44px] leading-none tracking-[-0.04em]' : 'font-display text-[40px] leading-none'}>{t.amount}</span>
              <span className={`font-meta text-[14px] ${t.primary ? '' : soft}`}>{t.unit}</span>
            </>
          );
          return t.href ? (
            <a key={t.id} href={t.href} className={`${cls} ${t.primary ? 'hover:bg-paper-2' : ox ? 'hover:bg-oxblood-hover' : 'hover:bg-green-rule'}`}>
              {inner}
            </a>
          ) : (
            <div key={t.id} className={cls}>
              {inner}
            </div>
          );
        })}
      </div>
      <p className={`mt-5 font-meta text-[14px] leading-[1.6] ${ox ? 'text-paper' : 'text-green-text'}`}>
        {checkoutOpen ? 'Secure checkout by Stripe. Cancel anytime. ' : 'Checkout opens soon. '}
        {SUPPORT_LINE}
      </p>
    </div>
  );
}
