import { ReactNode } from "react";

interface DataCardProps {
  /** The primary title line */
  title: string;
  /** Array of dot-separated values shown below the title */
  values: string[];
  /** Optional right-side element (e.g. a Flag) */
  trailing?: ReactNode;
  /** Optional second row of dot-separated values */
  subtitle?: string[];
}

export function DataCard({ title, values, trailing, subtitle }: DataCardProps) {
  return (
    <div
      className="rounded-xl px-4 py-3.5 font-['Inter']"
      style={{ backgroundColor: "#0E2646" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p
            className="text-[#F0F0F0] truncate"
            style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}
          >
            {title}
          </p>
          <p
            className="text-[#F0F0F0]/65 truncate"
            style={{ fontSize: 13, fontWeight: 400 }}
          >
            {values.join("  ·  ")}
          </p>
          {subtitle && (
            <p
              className="text-[#F0F0F0]/45 truncate"
              style={{ fontSize: 12, fontWeight: 400 }}
            >
              {subtitle.join("  ·  ")}
            </p>
          )}
        </div>
        {trailing && <div className="shrink-0 pt-0.5">{trailing}</div>}
      </div>
    </div>
  );
}