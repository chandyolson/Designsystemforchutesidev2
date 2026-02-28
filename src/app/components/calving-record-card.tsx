interface CalvingRecordCardProps {
  damTag: string;
  calfTag: string;
  date: string;
  values: string[]; // e.g. ["Heifer", "Basin Payweight", "1 — No Assistance"]
  onClick?: () => void;
}

export function CalvingRecordCard({ damTag, calfTag, date, values, onClick }: CalvingRecordCardProps) {
  return (
    <div
      className="rounded-xl px-4 py-3.5 font-['Inter'] transition-all duration-150 active:scale-[0.98]"
      style={{ backgroundColor: "#0E2646", cursor: onClick ? "pointer" : undefined }}
      onClick={onClick}
    >
      {/* Row 1 — Dam → Calf + date */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: dam → calf */}
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="shrink-0"
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#F0F0F0",
              lineHeight: 1.3,
            }}
          >
            {damTag}
          </span>

          {/* Arrow */}
          <svg
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M1 6H14M14 6L10 2M14 6L10 10"
              stroke="rgba(240,240,240,0.30)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span
            className="shrink-0"
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#55BAAA",
              lineHeight: 1.3,
            }}
          >
            {calfTag}
          </span>
        </div>

        {/* Right: date + chevron */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "rgba(240,240,240,0.35)",
              lineHeight: 1.3,
            }}
          >
            {date}
          </span>
          {onClick && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2.5L8 6L4.5 9.5" stroke="rgba(240,240,240,0.25)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>

      {/* Row 2 — Dot-separated values */}
      <p
        className="mt-1.5 truncate"
        style={{
          fontSize: 13,
          fontWeight: 400,
          color: "rgba(240,240,240,0.45)",
          lineHeight: 1.4,
        }}
      >
        {values.join("  ·  ")}
      </p>
    </div>
  );
}
