"use client";
import { useState } from "react";

interface ShareFindingProps {
  sectionName: string;
  slug?: string;
}

export default function ShareFinding({ sectionName, slug }: ShareFindingProps) {
  const [copied, setCopied] = useState(false);

  const url = slug
    ? `rojasreport.com/aha/profiles/${slug}/`
    : "rojasreport.com/aha/powermap/";

  const citation = `${sectionName} -- AHA, RojasReport.com/aha [${url}]`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-muted border border-border rounded px-3 py-1.5 hover:border-orange hover:text-cream transition-colors"
    >
      {copied ? "Copied!" : "Share Finding"}
    </button>
  );
}
