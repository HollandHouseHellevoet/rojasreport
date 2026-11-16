import type { ReactNode } from 'react';
import { FORMSPREE, absolute } from '@/lib/site';

/**
 * Formspree form with a honeypot, the endpoint the Alliance site uses (FORMSPREE in src/lib/site.ts).
 * `action` is the page Formspree returns the visitor to; `subject` is the email subject line.
 */
export function Form({
  name,
  action,
  submit = 'Send',
  note,
  subject,
  children,
  dark = false,
}: {
  name: string;
  action?: string;
  submit?: string;
  note?: string;
  subject?: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <form name={name} method="POST" action={FORMSPREE} className={`grid gap-5 sm:grid-cols-2 ${dark ? 'form-dark' : ''}`}>
      <input type="hidden" name="_subject" value={subject ?? `TAFHC ${name}`} />
      <input type="hidden" name="_next" value={absolute(action ?? `/contact/?sent=${name}`)} />
      <p className="hp" aria-hidden="true"><label>Leave this field empty <input name="_gotcha" tabIndex={-1} autoComplete="off" /></label></p>
      {children}
      <div className="sm:col-span-2 flex flex-col gap-3 items-start mt-2">
        <button type="submit" className={`inline-flex items-center min-h-[48px] px-[22px] font-tight font-semibold text-[15px] leading-none border-[1.5px] ${dark ? 'bg-accent text-ink border-accent hover:bg-accent-hover' : 'bg-ink text-paper border-ink hover:bg-black'}`}>
          {submit}
        </button>
        {note && <p className="text-[14px] max-w-[60ch] opacity-80">{note}</p>}
      </div>
    </form>
  );
}

export function Field({ label, id, full = false, hint, children }: { label: string; id: string; full?: boolean; hint?: string; children: ReactNode }) {
  return (
    <div className={`field ${full ? 'sm:col-span-2' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
