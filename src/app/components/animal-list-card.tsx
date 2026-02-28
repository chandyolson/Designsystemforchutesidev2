import { FlagIcon } from "./flag-icon";

type FlagColor = "teal" | "gold" | "red";

const flagColorMap: Record<FlagColor, string> = {
  teal: "#55BAAA",
  gold: "#D4A017",
  red: "#9B2335",
};

interface AnimalListCardProps {
  tag: string;
  flag?: FlagColor;
  typePill?: string;
  values: string[];
}

export function AnimalListCard({ tag, flag, typePill, values }: AnimalListCardProps) {
  const tagColor = flag ? flagColorMap[flag] : "#F0F0F0";

  return (
    <div
      className="rounded-xl px-4 py-3.5 font-['Inter']"
      style={{ backgroundColor: "#0E2646" }}
    >
      {/* Row 1 — Tag + flag + type pill */}
      <div className="flex items-center gap-2">
        {/* Tag number — colored to match flag */}
        <span
          className="shrink-0"
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: tagColor,
            lineHeight: 1.3,
          }}
        >
          {tag}
        </span>

        {/* Flag icon */}
        {flag && (
          <span className="shrink-0">
            <FlagIcon color={flag} size="sm" />
          </span>
        )}

        {/* Spacer */}
        <span className="flex-1" />

        {/* Type pill */}
        {typePill && (
          <span
            className="shrink-0 rounded-full uppercase"
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "3px 10px",
              backgroundColor: "#F3D12A",
              color: "#1A1A1A",
              lineHeight: 1.3,
            }}
          >
            {typePill}
          </span>
        )}
      </div>

      {/* Row 2 — Dot-separated values */}
      <p
        className="mt-1.5 truncate"
        style={{
          fontSize: 13,
          fontWeight: 400,
          color: "rgba(240,240,240,0.55)",
          lineHeight: 1.4,
        }}
      >
        {values.join("  ·  ")}
      </p>
    </div>
  );
}