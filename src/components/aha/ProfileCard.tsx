import Link from "next/link";

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

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const roleLabel =
    profile.aha_position ||
    (profile.role === "csuite" || profile.role === "c-suite" ? "C-Suite" : "Board");
  const former = profile.status === "former";

  return (
    <div
      className={`flex flex-col bg-card border-l-4 p-6 hover:brightness-110 transition-all ${former ? "border-muted opacity-75" : "border-orange"}`}
      style={{ borderTop: "1px solid #CFC6B6", borderRight: "1px solid #CFC6B6", borderBottom: "1px solid #CFC6B6" }}
    >
      {/* Role tag */}
      <span
        className="font-body text-orange uppercase tracking-widest mb-3 font-semibold"
        style={{ fontSize: "13px", letterSpacing: "0.15em" }}
      >
        {roleLabel}
      </span>

      {/* Name */}
      <h3 className="font-tight font-bold tracking-[-0.015em] text-[20px] text-cream leading-snug mb-1">
        {profile.name || profile.slug}
      </h3>

      {/* Title | Org */}
      <p className="font-body text-muted truncate mb-3" style={{ fontSize: "13px" }}>
        {profile.title}
        {profile.title && profile.organization ? " | " : ""}
        {profile.organization}
      </p>

      {/* Pattern summary */}
      {profile.patternSummary && (
        <p className="font-body text-cream leading-relaxed line-clamp-3 mb-4" style={{ fontSize: "16px" }}>
          {profile.patternSummary}
        </p>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="bg-orange/15 border border-orange text-orange font-body font-semibold px-3 py-1 rounded-full" style={{ fontSize: "13px" }}>
          {profile.redFlagCount} Red Flags
        </span>
        <Link
          href={`/aha/profiles/${profile.slug}/`}
          className="font-body text-orange font-semibold hover:underline flex items-center gap-1 transition-colors"
          style={{ fontSize: "16px" }}
        >
          View Dossier
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
