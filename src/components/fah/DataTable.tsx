import type { ReactNode } from "react";

export default function DataTable({ headers, rows, label }: { headers: string[]; rows: ReactNode[][]; label: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" aria-label={label}>
        <thead>
          <tr className="border-b border-ink/20">
            {headers.map((h) => (
              <th key={h} className="font-body text-xs uppercase tracking-widest text-orange py-3 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-ink/5 align-top">
              {r.map((c, j) => (
                <td key={j} className={`font-body text-sm py-3 pr-4 ${j === 0 ? "text-cream" : "text-cream"}`}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
