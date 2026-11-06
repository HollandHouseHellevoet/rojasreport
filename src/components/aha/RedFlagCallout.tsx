interface RedFlagCalloutProps {
  text: string;
}

export default function RedFlagCallout({ text }: RedFlagCalloutProps) {
  return (
    <div
      className="border-l-4 rounded-r-md p-4 flex gap-3 items-start my-3"
      style={{ backgroundColor: "#ECE5D8", borderColor: "#8E1B1B" }}
    >
      <svg
        className="flex-shrink-0 mt-0.5 text-orange"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <p className="font-body text-cream leading-relaxed" style={{ fontSize: "15px" }}>{text}</p>
    </div>
  );
}
