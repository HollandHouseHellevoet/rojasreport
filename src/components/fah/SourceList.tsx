import type { Source } from "@/lib/fah";

export default function SourceList({ sources }: { sources: Source[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <ol className="space-y-2 list-decimal list-inside">
      {sources.map((s, i) => (
        <li key={i} className="font-body text-sm text-cream">
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-orange hover:text-orange-light underline underline-offset-2 transition-colors">{s.label}</a>
        </li>
      ))}
    </ol>
  );
}
