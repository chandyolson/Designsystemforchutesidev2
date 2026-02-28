export type FlagColor = "teal" | "gold" | "red";

interface FlagIconProps {
  color: FlagColor;
  size?: "sm" | "md" | "lg";
}

const colorMap: Record<FlagColor, string> = {
  teal: "#55BAAA",
  gold: "#D4A017",
  red: "#9B2335",
};

const sizeMap: Record<string, { w: number; h: number; pole: number; stroke: number }> = {
  sm: { w: 18, h: 16, pole: 1.6, stroke: 1.6 },
  md: { w: 24, h: 20, pole: 2, stroke: 2 },
  lg: { w: 32, h: 26, pole: 2.4, stroke: 2.4 },
};

export function FlagIcon({ color, size = "md" }: FlagIconProps) {
  const fill = colorMap[color];
  const s = sizeMap[size];

  // Flag proportions relative to viewbox
  const vw = 32;
  const vh = 28;

  return (
    <svg
      width={s.w}
      height={s.h}
      viewBox={`0 0 ${vw} ${vh}`}
      fill="none"
      aria-label={`${color} flag`}
    >
      {/* Pole */}
      <line
        x1="3"
        y1="2"
        x2="3"
        y2="26"
        stroke={fill}
        strokeWidth={s.stroke}
        strokeLinecap="round"
      />
      {/* Flag pennant */}
      <path
        d="M3 3H27L23 9.5L27 16H3V3Z"
        fill={fill}
      />
    </svg>
  );
}
