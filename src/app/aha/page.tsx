"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import profilesData from "@/data/aha/profiles.json";
import ProfileCard from "@/components/aha/ProfileCard";
import FilterBar from "@/components/aha/FilterBar";
import powermapData from "@/data/aha/powermap.json";

const profiles = profilesData as Profile[];

interface Profile {
  slug: string;
  name: string;
  title: string;
  organization: string;
  role: string;
  status?: string;
  aha_position?: string;
  state: string;
  patternSummary: string;
  redFlagCount: number;
  redFlags: string[];
}

const pm = powermapData as Record<string, unknown> & {
  keyStat1: { value: string; label: string };
  keyStat2: { value: string; label: string };
  keyStat3: { value: string; label: string };
};

const HERO_STATS = [
  pm.keyStat1,
  pm.keyStat2,
  pm.keyStat3,
  { value: "15+ Years", label: "Physician-Owned Hospital Ban Maintained" },
];

const isFormer = (p: Profile) => p.status === "former";
const CURRENT_COUNT = profiles.filter((p) => !isFormer(p)).length;

export default function HomePage() {
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("redflags");

  const filtered = useMemo(() => {
    let result = [...profiles];
    if (roleFilter === "Former") {
      result = result.filter(isFormer);
    } else {
      result = result.filter((p) => !isFormer(p));
      if (roleFilter !== "All") {
        result = result.filter((p) =>
          roleFilter === "C-Suite"
            ? p.role === "csuite" || p.role === "c-suite"
            : p.role === "board"
        );
      }
    }
    if (sortBy === "redflags") {
      result.sort((a, b) => b.redFlagCount - a.redFlagCount);
    } else {
      result.sort((a, b) => (a.name || a.slug).localeCompare(b.name || b.slug));
    }
    return result;
  }, [roleFilter, sortBy]);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-paper-2 border-b border-hairline">
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-24">
          {/* Pill tag */}
          <span className="inline-block border border-orange text-orange font-body text-xs uppercase tracking-widest px-3 py-1 mb-8">
            Intelligence Briefing
          </span>

          <h1
            className="font-display text-cream leading-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", maxWidth: "700px" }}
          >
            Who Controls American Hospital Policy
          </h1>

          <p
            className="font-body text-muted mb-10"
            style={{ fontSize: "20px", maxWidth: "540px" }}
          >
            {CURRENT_COUNT} individuals. Every conflict. Every dollar. Every red flag.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/aha/powermap/"
              className="font-body font-semibold text-sm bg-oxblood text-paper px-6 py-3 hover:bg-orange/90 transition-colors"
            >
              View the Power Map
            </Link>
            <a
              href="#database"
              className="font-body font-semibold text-sm border border-cream text-cream px-6 py-3 hover:bg-cream/10 transition-colors"
            >
              Read the Dossiers
            </a>
          </div>
        </div>
      </section>

      {/* Stat blocks row */}
      <div className="bg-dark border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {HERO_STATS.map((stat, i) => (
              <div
                key={i}
                className="px-6 py-8 border-l border-orange"
              >
                <div
                  className="font-display text-orange mb-1"
                  style={{ fontSize: "48px", lineHeight: 1 }}
                >
                  {stat.value}
                </div>
                <div className="font-body text-cream uppercase tracking-widest" style={{ fontSize: "12px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 01 — The Intelligence Database */}
      <section id="database" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-20">
        <div className="mb-8">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-body text-orange uppercase tracking-widest font-semibold" style={{ fontSize: "11px" }}>
              01
            </span>
            <span className="font-body text-cream uppercase tracking-widest font-semibold" style={{ fontSize: "11px" }}>
              The Intelligence Database
            </span>
          </div>
          <h2 className="font-display text-3xl text-cream">
            {CURRENT_COUNT} Individuals. Every Conflict on Record.
          </h2>
          <p className="font-body text-muted text-sm mt-2">
            The AHA board and executive team as of January 1, 2027. Sorted by red flag count. Updated November 2026.
          </p>
        </div>

        <div className="mb-8">
          <FilterBar
            roleFilter={roleFilter}
            sortBy={sortBy}
            onRoleChange={setRoleFilter}
            onSortChange={setSortBy}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((profile) => (
            <ProfileCard key={profile.slug} profile={profile} />
          ))}
        </div>
      </section>

      {/* Section 02 — The Power Map */}
      <section className="border-y border-border" style={{ backgroundColor: "#ECE5D8" }}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-body text-orange uppercase tracking-widest font-semibold" style={{ fontSize: "11px" }}>
              02
            </span>
            <span className="font-body text-cream uppercase tracking-widest font-semibold" style={{ fontSize: "11px" }}>
              Power Map
            </span>
          </div>
          <h2 className="font-display text-3xl text-cream mb-4">
            The AHA Power Map
          </h2>
          <p className="font-body text-muted text-sm mb-8 max-w-xl">
            The structural anatomy of the most powerful hospital lobbying operation in America.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { label: "Lobbying Footprint", anchor: "lobbying-footprint" },
              { label: "PAC Architecture", anchor: "pac-architecture" },
              { label: "Revolving Door", anchor: "revolving-door" },
              { label: "Institutional Capture", anchor: "institutional-capture" },
              { label: "Charity Care Gap", anchor: "charity-care-gap" },
              { label: "Bottom Line", anchor: "bottom-line" },
            ].map((item) => (
              <Link
                key={item.anchor}
                href={`/aha/powermap/#${item.anchor}`}
                className="font-body px-4 py-2 text-sm border border-orange text-muted hover:text-cream hover:bg-orange/10 transition-colors rounded-full"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/aha/powermap/"
            className="inline-block font-body font-semibold bg-oxblood text-paper text-sm px-6 py-3 hover:bg-orange/90 transition-colors"
          >
            Read the Full Power Map
          </Link>
        </div>
      </section>

      {/* Section 03 — No Paywall */}
      <section className="bg-dark border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <span className="inline-block border border-orange text-orange font-body text-xs uppercase tracking-widest px-3 py-1 mb-8">
            Rojas Intelligence
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
            No spin. Just the data that moves markets.
          </h2>
          <p className="font-body text-muted leading-relaxed mb-10 max-w-xl mx-auto">
            This site exists because the information should be available to every physician, every lawmaker, and every AI model.
          </p>
          <a
            href="https://dutchrojas.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-body font-semibold bg-oxblood text-paper text-sm px-8 py-3 hover:bg-orange/90 transition-colors"
          >
            Subscribe on Substack
          </a>
        </div>
      </section>
    </>
  );
}
