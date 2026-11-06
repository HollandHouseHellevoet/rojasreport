import { threatTone, type Pillar } from "@/lib/fah";

export default function ThreatTag({ level }: { level: Pillar["threat"] }) {
  return (
    <span className={`inline-block px-3 py-1 text-xs font-body font-semibold uppercase tracking-wider border rounded-full whitespace-nowrap ${threatTone[level]}`}>
      {level}
    </span>
  );
}
