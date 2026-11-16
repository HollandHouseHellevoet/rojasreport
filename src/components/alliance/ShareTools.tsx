'use client';

import { useState } from 'react';

/** Download and share links for one insight; the copy button needs the clipboard, so this is a client component. */
export default function ShareTools({ url, title, pdf }: { url: string; title: string; pdf?: string }) {
  const [copied, setCopied] = useState(false);
  const share = [
    { label: 'Share on X', href: `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: 'Email', href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}` },
  ];
  const link = 'font-tight font-semibold border-b-[1.5px] border-current pb-px bg-transparent p-0 cursor-pointer';
  return (
    <div className="flex flex-col gap-3 mt-2 print:hidden">
      {pdf && (
        <a href={pdf} download className="inline-flex items-center self-start min-h-[44px] px-5 bg-ink text-paper font-tight font-semibold text-[14px] leading-none hover:bg-black">
          Download the PDF
        </a>
      )}
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[14px]" aria-label="Share">
        {share.map((s) => (
          <li key={s.label}><a href={s.href} rel="noopener" target="_blank" className={link}>{s.label}</a></li>
        ))}
        <li>
          <button
            type="button"
            className={link}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              } catch {
                window.location.href = url;
              }
            }}
          >
            {copied ? 'Link copied' : 'Copy link'}
          </button>
        </li>
      </ul>
    </div>
  );
}
