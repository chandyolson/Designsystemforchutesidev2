import { type ReactNode } from "react";

interface SelectableCardWrapperProps {
  /** Whether this card is currently selected */
  selected: boolean;
  /** Called when the checkbox is tapped */
  onToggle: () => void;
  /** The card content (e.g. AnimalListCard) */
  children: ReactNode;
}

/**
 * Wraps any list card with a left-side selection checkbox.
 *
 * - Checkbox: 22px square, rounded-md (6px), 8px from left edge, vertically centered
 * - Unchecked: empty, border #D4D4D0, bg transparent
 * - Checked: bg #55BAAA, border #55BAAA, white 12px checkmark
 * - Card gets a very subtle teal tint overlay + 2px left border when selected
 */
export function SelectableCardWrapper({
  selected,
  onToggle,
  children,
}: SelectableCardWrapperProps) {
  return (
    <div className="flex items-center gap-2" style={{ paddingLeft: 8 }}>
      {/* ── Checkbox ── */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="shrink-0 flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.92]"
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          border: selected ? "1.5px solid #55BAAA" : "1.5px solid #D4D4D0",
          backgroundColor: selected ? "#55BAAA" : "transparent",
        }}
        aria-label={selected ? "Deselect" : "Select"}
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* ── Card with selection treatment ── */}
      <div className="relative flex-1 min-w-0">
        {/* Teal left accent border — only when selected */}
        {selected && (
          <div
            className="absolute left-0 top-2 bottom-2 z-10"
            style={{
              width: 2,
              backgroundColor: "#55BAAA",
              borderRadius: 1,
            }}
          />
        )}

        {/* Card content */}
        <div
          className="rounded-xl overflow-hidden transition-all duration-150"
          style={{
            boxShadow: selected
              ? "inset 0 0 0 1px rgba(85,186,170,0.20)"
              : "none",
          }}
        >
          {children}
        </div>

        {/* Teal tint overlay — very subtle, on top of the opaque navy card */}
        {selected && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ backgroundColor: "rgba(85,186,170,0.07)" }}
          />
        )}
      </div>
    </div>
  );
}
