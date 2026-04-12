interface CitationBlockProps {
  sources: string;
  lastUpdated?: string;
}

export default function CitationBlock({ sources, lastUpdated }: CitationBlockProps) {
  return (
    <div className="border-t border-white/10 pt-6 mt-12">
      <p className="text-xs font-body text-cream/30 leading-relaxed">
        {sources}
      </p>
      {lastUpdated && (
        <p className="mt-2 text-xs font-body text-cream/20">
          Last updated: {lastUpdated}
        </p>
      )}
    </div>
  );
}
