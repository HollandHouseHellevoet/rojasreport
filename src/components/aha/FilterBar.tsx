"use client";

interface FilterBarProps {
  roleFilter: string;
  sortBy: string;
  onRoleChange: (role: string) => void;
  onSortChange: (sort: string) => void;
}

export default function FilterBar({ roleFilter, sortBy, onRoleChange, onSortChange }: FilterBarProps) {
  const roleOptions = ["All", "Board", "C-Suite", "Former"];
  const sortOptions = [
    { value: "redflags", label: "Most Red Flags" },
    { value: "alpha", label: "Alphabetical" },
  ];

  const btnBase = "font-body px-4 py-1.5 text-sm rounded-full border transition-colors";
  const active = "bg-oxblood text-paper border-orange font-semibold";
  const inactive = "bg-transparent text-cream border-cream/30 hover:border-orange hover:text-orange";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex gap-2">
        {roleOptions.map((r) => (
          <button
            key={r}
            onClick={() => onRoleChange(r)}
            className={`${btnBase} ${roleFilter === r ? active : inactive}`}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="flex gap-2 ml-0 md:ml-4">
        {sortOptions.map((s) => (
          <button
            key={s.value}
            onClick={() => onSortChange(s.value)}
            className={`${btnBase} ${sortBy === s.value ? active : inactive}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
