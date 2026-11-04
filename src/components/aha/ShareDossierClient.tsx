"use client";
import { useState } from "react";

interface ShareDossierClientProps {
  name: string;
  slug: string;
  tweetText: string;
}

export default function ShareDossierClient({ name, slug, tweetText }: ShareDossierClientProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${name} -- AHA Intelligence Dossier: rojasreport.com/aha/profiles/${slug}/`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <h3 className="text-xs text-muted uppercase tracking-wider font-body">Share This Dossier</h3>
      <button
        onClick={handleShare}
        className="w-full text-sm border border-border rounded px-3 py-2 text-muted hover:border-orange hover:text-cream transition-colors"
      >
        {copied ? "Copied!" : "Copy Citation"}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${tweetText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full block text-center text-sm border border-border rounded px-3 py-2 text-muted hover:border-orange hover:text-cream transition-colors"
      >
        Post to X
      </a>
    </div>
  );
}
