import { tiers, checkoutOpen, SUPPORT_LINE } from '@/lib/support';

/**
 * The four support tiers on a green band (home mockup, section VI). A tier with a Stripe link is a link;
 * one without renders as a plain block, and the line under the grid says checkout is still to open.
 */
export default function Tiers() {
  return (
    <div>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
        {tiers.map((t) => {
          const cls = `border-[1.5px] px-[18px] py-[20px] flex flex-col gap-1.5 ${
            t.primary ? 'border-paper bg-paper text-green' : 'border-green-text text-paper'
          }`;
          const inner = (
            <>
              <span className={`font-meta text-[13px] font-semibold uppercase tracking-[0.1em] ${t.primary ? '' : 'text-paper'}`}>{t.name}</span>
              <span className="font-display text-[40px] leading-none">{t.amount}</span>
              <span className={`font-meta text-[14px] ${t.primary ? '' : 'text-green-text'}`}>{t.unit}</span>
            </>
          );
          return t.href ? (
            <a key={t.id} href={t.href} className={`${cls} ${t.primary ? 'hover:bg-paper-2' : 'hover:bg-green-rule'}`}>
              {inner}
            </a>
          ) : (
            <div key={t.id} className={cls}>
              {inner}
            </div>
          );
        })}
      </div>
      <p className="mt-5 font-meta text-[14px] leading-[1.6] text-green-text">
        {checkoutOpen ? 'Secure checkout by Stripe. Cancel anytime. ' : 'Checkout opens soon. '}
        {SUPPORT_LINE}
      </p>
    </div>
  );
}
