import React from 'react';

export function isBlockquote(text: string): boolean {
  return (
    text.startsWith('"') ||
    text.startsWith('\u201c') ||
    (text.startsWith(', ') && text.includes('Report')) ||
    /^, .{5,30}(Report|Institute|Brief|Board|Court|FTC|DOJ)/.test(text)
  );
}

export function isAttribution(text: string): boolean {
  return /^, [A-Z]/.test(text) && text.length < 80;
}

function highlightStats(text: string): React.ReactNode {
  const statPattern = /(\$[\d,.]+[BM]?|\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?%)/;
  const parts = text.split(statPattern);
  if (parts.length <= 1) return text;

  return parts.map((part, i) =>
    statPattern.test(part)
      ? <strong key={i} className="text-orange font-semibold">{part}</strong>
      : <React.Fragment key={i}>{part}</React.Fragment>
  );
}

export default function SmartText({ text }: { text: string }) {
  if (isAttribution(text)) {
    return (
      <cite className="block font-body text-sm text-cream/40 not-italic mt-1">
        {text}
      </cite>
    );
  }

  if (isBlockquote(text)) {
    const cleaned = text.replace(/^[""\u201c\u201d]+|[""\u201c\u201d]+$/g, '');
    return (
      <blockquote className="pl-5 border-l-2 border-orange my-4">
        <p className="font-display text-xl text-cream/80 italic leading-relaxed">
          {cleaned}
        </p>
      </blockquote>
    );
  }

  return (
    <p className="font-body text-cream/55 leading-relaxed">
      {highlightStats(text)}
    </p>
  );
}
