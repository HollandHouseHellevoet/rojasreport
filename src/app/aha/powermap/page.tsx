"use client";
import { useEffect, useState } from "react";
import type React from "react";
import powermapData from "@/data/aha/powermap.json";
import ShareFinding from "@/components/aha/ShareFinding";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Stat = { value: string; label: string };
interface SectionMeta { verdict: string; stats: Stat[]; pullQuote?: string }

interface Powermap {
  lobbyingFootprint: string;
  pacArchitecture: string;
  revolvingDoorMap: string;
  institutionalCapture: string;
  charityCaregap: string;
  bottomLine: string;
  keyStat1: Stat;
  keyStat2: Stat;
  keyStat3: Stat;
  lastUpdated?: string;
  sectionMeta?: Record<string, SectionMeta>;
}

const powermap = powermapData as unknown as Powermap;
const META: Record<string, SectionMeta> = powermap.sectionMeta || {};

const sections = [
  { id: "lobbying-footprint", label: "Lobbying Footprint", key: "lobbyingFootprint" as const },
  { id: "pac-architecture", label: "PAC Architecture", key: "pacArchitecture" as const },
  { id: "revolving-door", label: "Revolving Door Map", key: "revolvingDoorMap" as const },
  { id: "institutional-capture", label: "Institutional Capture", key: "institutionalCapture" as const },
  { id: "charity-care-gap", label: "Charity Care Gap", key: "charityCaregap" as const },
  { id: "bottom-line", label: "Bottom Line", key: "bottomLine" as const },
];

const mdComponents = {
  h1: (props: React.ComponentProps<"h3">) => <h3 className="font-tight font-bold tracking-[-0.015em] text-cream mt-8 mb-3" style={{ fontSize: "1.375rem" }} {...props} />,
  h2: (props: React.ComponentProps<"h3">) => <h3 className="font-tight font-bold tracking-[-0.015em] text-cream mt-8 mb-3" style={{ fontSize: "1.375rem" }} {...props} />,
  h3: (props: React.ComponentProps<"h3">) => <h3 className="font-tight font-bold tracking-[-0.015em] text-cream mt-8 mb-3" style={{ fontSize: "1.25rem" }} {...props} />,
  h4: (props: React.ComponentProps<"h4">) => <h4 className="font-body font-semibold text-orange mt-6 mb-2" style={{ fontSize: "16px" }} {...props} />,
  p: (props: React.ComponentProps<"p">) => <p className="font-prose text-cream leading-relaxed mb-4" style={{ fontSize: "19px" }} {...props} />,
  ul: (props: React.ComponentProps<"ul">) => <ul className="space-y-2 mb-5 pl-1" {...props} />,
  ol: (props: React.ComponentProps<"ol">) => <ol className="list-decimal space-y-2 mb-5 pl-6 font-prose text-cream" style={{ fontSize: "19px" }} {...props} />,
  li: ({ children, ...props }: React.ComponentProps<"li">) => (
    <li className="font-prose text-cream leading-relaxed flex gap-3" style={{ fontSize: "19px" }} {...props}>
      <span className="text-orange flex-shrink-0 mt-1" style={{ fontSize: "13px" }}>&#9658;</span>
      <span className="min-w-0">{children}</span>
    </li>
  ),
  strong: (props: React.ComponentProps<"strong">) => <strong className="text-cream font-semibold" {...props} />,
  a: (props: React.ComponentProps<"a">) => <a className="text-orange hover:underline break-words" target="_blank" rel="noopener noreferrer" {...props} />,
  table: (props: React.ComponentProps<"table">) => (
    <div className="overflow-x-auto mb-6 border border-border">
      <table className="w-full text-left font-body" style={{ fontSize: "16px" }} {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<"th">) => <th className="px-3 py-2 text-orange uppercase tracking-wide border-b border-border align-bottom" style={{ fontSize: "13px", backgroundColor: "#ECE5D8" }} {...props} />,
  td: (props: React.ComponentProps<"td">) => <td className="px-3 py-2 text-cream border-b border-border align-top" {...props} />,
  hr: () => <div className="border-t border-border my-6" />,
  blockquote: (props: React.ComponentProps<"blockquote">) => <blockquote className="border-l-4 border-orange pl-4 my-4 italic text-muted" {...props} />,
};

export default function PowerMapPage() {
  const [activeSection, setActiveSection] = useState("lobbying-footprint");
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      <section className="relative bg-paper-2">
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-24">
          <span className="inline-block border border-orange text-orange font-body text-xs uppercase tracking-widest px-3 py-1 mb-8">
            Intelligence Briefing
          </span>
          <h1 className="font-display text-cream leading-tight mb-4"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", maxWidth: "700px" }}>
            The AHA Power Map
          </h1>
          <p className="font-body text-muted" style={{ fontSize: "20px", maxWidth: "520px" }}>
            The structural anatomy of the most powerful hospital lobbying operation in America.
          </p>
          {powermap.lastUpdated && (
            <p className="font-body text-muted mt-4" style={{ fontSize: "13px" }}>Updated {powermap.lastUpdated}</p>
          )}
        </div>
        <div className="relative border-t border-hairline bg-paper">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-ink/10">
            {[powermap.keyStat1, powermap.keyStat2, powermap.keyStat3, { value: "15+ Years", label: "Physician-Owned Hospital Ban" }].map((stat) => (
              <div key={stat.label} className="py-6 px-6 first:pl-0">
                <p className="font-display" style={{ fontSize: "clamp(1.5rem,2.5vw,2.2rem)", color: "#8E1B1B" }}>
                  {stat.value}
                </p>
                <p className="font-body text-muted uppercase tracking-widest mt-1" style={{ fontSize: "13px", letterSpacing: "0.12em" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex gap-12">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <nav className="sticky top-24">
              <p className="font-body text-muted uppercase tracking-widest mb-4" style={{ fontSize: "13px", letterSpacing: "0.15em" }}>Contents</p>
              <ul className="space-y-1">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className={`block font-body text-sm py-2 border-l-2 pl-3 transition-colors ${
                        activeSection === s.id ? "border-orange text-cream" : "border-border text-muted hover:text-cream hover:border-orange/50"}`}>
                      <span className="text-orange mr-2" style={{ fontSize: "13px" }}>{String(i + 1).padStart(2, "0")}</span>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="flex-1 min-w-0">
            {sections.map((section, i) => {
              const rawText = powermap[section.key];
              const text = typeof rawText === "string" ? rawText : "";
              const isBottomLine = section.id === "bottom-line";
              const meta = META[section.key];
              const stats = meta?.stats || [];
              return (
                <section key={section.id} id={section.id} className="mb-20 scroll-mt-24">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-orange uppercase tracking-widest font-semibold" style={{ fontSize: "13px", letterSpacing: "0.15em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ShareFinding sectionName={section.label} />
                  </div>
                  <h2 className="font-display text-cream mb-5" style={{ fontSize: isBottomLine ? "2.4rem" : "2rem" }}>
                    {section.label}
                  </h2>
                  {meta?.verdict && <p className="font-prose italic leading-snug mb-6"
                    style={{ fontSize: "1.2rem", color: "#1C1B19", borderLeft: "3px solid #8E1B1B", paddingLeft: "1rem" }}>
                    {meta?.verdict}
                  </p>}
                  {stats.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-7">
                      {stats.map((stat) => (
                        <div key={stat.label} className="border border-orange/30 px-4 py-3" style={{ backgroundColor: "rgba(212,98,42,0.07)" }}>
                          <p className="font-display" style={{ fontSize: "1.5rem", color: "#8E1B1B" }}>{stat.value}</p>
                          <p className="font-body text-muted uppercase tracking-wide" style={{ fontSize: "13px", letterSpacing: "0.1em" }}>{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mb-8">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                      {text}
                    </ReactMarkdown>
                  </div>
                  {isBottomLine && meta?.pullQuote && (
                    <blockquote className="border-l-4 border-orange px-6 py-6 mt-6" style={{ backgroundColor: "#ECE5D8" }}>
                      <p className="font-prose italic text-cream leading-relaxed" style={{ fontSize: "1.35rem" }}>
                        {meta.pullQuote}
                      </p>
                    </blockquote>
                  )}
                  {!isBottomLine && <div className="border-t border-border mt-10" />}
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
