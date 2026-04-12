import React from 'react';

interface SmartTextProps {
  text: string;
  as?: 'p' | 'blockquote' | 'heading';
}

/**
 * Renders a content block with smart formatting:
 * - Wraps $figures, percentages, and HHI numbers in bold orange
 * - Detects blockquote-style text (starts with quote or has attribution dash)
 */
export function isBlockquote(text: string): boolean {
  return (
    text.startsWith('"') ||
    text.startsWith('\u201c') ||
    text.startsWith(', ') && text.includes('Report') ||
    /^, .{5,30}(Report|Institute|Brief|Board|Court|FTC|DOJ)/.test(text)
  );
}

export function isAttribution(text: string): boolean {
  return /^, [A-Z]/.test(text) && text.length < 80;
}

function highlightStats(text: string): React.ReactNode {
  // Match dollar amounts, percentages, HHI numbers, and "X of Y" patterns
  const pattern = /(\$[\d,.]+[BM]?|\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?%|\d+ of \d+)/g;
  const parts = text.split(pattern);

  if (parts.length <= 1) return text;

  return parts.map((part, i) => {
    if (pattern.test(part)) {
      return <strong key={i} className="text-orange font-semibold">{part}</strong>;
    }
    // Reset regex lastIndex
    pattern.lastIndex = 0;
    if (/(\$[\d,.]+[BM]?|\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?%|\d+ of \d+)/.test(part)) {
      return <strong key={i} className="text-orange font-semibold">{part}</strong>;
    }
    return part;
  });
}

export default function SmartText({ text }: SmartTextProps) {
  if (isAttribution(text)) {
    return (
      <cite className="block font-body text-xs text-cream/40 not-italic mt-1">
        {text}
      </cite>
    );
  }

  if (isBlockquote(text)) {
    const cleaned = text.replace(/^[""\u201c\u201d]+|[""\u201c\u201d]+$/g, '');
    return (
      <blockquote className="pl-4 border-l-[3px] border-orange my-4">
        <p className="font-display text-lg text-cream/80 italic leading-relaxed">
          {cleaned}
        </p>
      </blockquote>
    );
  }

  return (
    <p className="font-body text-sm text-cream/60 leading-relaxed">
      {highlightStats(text)}
    </p>
  );
}
