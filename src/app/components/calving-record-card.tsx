interface CalvingRecordCardProps {
  damTag: string;
  calfTag: string;
  date: string;
  sex: string;
  notes: string;
  memo: string;
  onClick?: () => void;
}

export function CalvingRecordCard({ damTag, calfTag, date, sex, notes, memo, onClick }: CalvingRecordCardProps) {
  /* Pick the best preview text: notes first, memo as fallback */
  const previewText = notes || memo || "";

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

          {/* Sex badge */}
          <span
            className="shrink-0 rounded-full"
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "1px 8px",
              backgroundColor: sex === "Bull" ? "rgba(85,186,170,0.15)" : "rgba(232,160,191,0.2)",
              color: sex === "Bull" ? "#55BAAA" : "#E8A0BF",
              lineHeight: 1.5,
            }}
          >
            {sex === "Bull" ? "B" : "H"}
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

      {/* Row 2 — Notes preview */}
      {previewText && (
        <p
          className="mt-1.5 truncate"
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: "rgba(240,240,240,0.45)",
            lineHeight: 1.4,
          }}
        >
          {previewText}
        </p>
      )}

      {/* Row 3 — Memo (if different from notes) */}
      {memo && memo !== notes && (
        <p
          className="mt-1 truncate"
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(243,209,42,0.45)",
            lineHeight: 1.4,
          }}
        >
          {memo}
        </p>
      )}
    </div>
  );
}
