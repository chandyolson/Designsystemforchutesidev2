import { type ButtonHTMLAttributes } from "react";

interface SelectModeToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Whether select mode is currently active */
  active: boolean;
  /** Called when toggling select mode on/off */
  onToggle: () => void;
}

/**
 * Toolbar button that activates / deactivates mass-select mode on list screens.
 *
 * 32px height, auto width, rounded-lg. White idle → navy active.
 * Intended for Animals, Calving, Projects, and Red Book toolbars.
 */
export function SelectModeToggle({ active, onToggle, style, ...rest }: SelectModeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="shrink-0 rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.97] font-['Inter'] flex items-center gap-1.5"
      style={{
        height: 32,
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: active ? "#0E2646" : "white",
        border: active ? "1px solid #0E2646" : "1px solid rgba(14,38,70,0.12)",
        ...style,
      }}
      {...rest}
    >
      {/* Checkbox-square icon — 14px */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="shrink-0"
      >
        {active ? (
          /* Filled checkbox with check */
          <>
            <rect x="1.5" y="1.5" width="11" height="11" rx="2.5" fill="#F3D12A" />
            <path
              d="M4.5 7L6.25 8.75L9.5 5.25"
              stroke="#0E2646"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          /* Empty checkbox */
          <rect
            x="1.75"
            y="1.75"
            width="10.5"
            height="10.5"
            rx="2.25"
            stroke="#0E2646"
            strokeOpacity="0.4"
            strokeWidth="1.5"
          />
        )}
      </svg>

      {/* Label */}
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: active ? "white" : "rgba(14,38,70,0.5)",
          lineHeight: 1,
        }}
      >
        {active ? "Cancel" : "Select"}
      </span>
    </button>
  );
}
