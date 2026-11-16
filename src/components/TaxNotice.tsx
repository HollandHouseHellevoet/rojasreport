import { ORG } from '@/lib/site';

/**
 * The 162(e) notice, verbatim from the Alliance site (MERGER_PLAN.md, section 3.9). Counsel sets the lobbying share
 * of dues; until it is set the notice says "a portion" and does not call itself the IRC 6033(e) notice.
 */
export default function TaxNotice({ compact = false, onDark = false }: { compact?: boolean; onDark?: boolean }) {
  return (
    <p className={`${compact ? 'text-[13px]' : 'text-[14px]'} leading-[1.5] max-w-[72ch] ${onDark ? 'text-ink-text-2' : 'text-ink'}`}>
      Contributions and dues to {ORG} are not deductible as charitable contributions for federal income tax purposes. A portion of
      dues is attributable to lobbying and is not deductible as a business expense under IRC §162(e).
    </p>
  );
}
