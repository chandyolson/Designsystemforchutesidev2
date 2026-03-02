import { useState, useEffect } from "react";
import { Mic } from "lucide-react";
import type { VoiceFillState } from "./voice-filled-field";

interface VoiceFilledSelectRowProps {
  label: string;
  value: string;
  options: string[];
  state: VoiceFillState;
  duration?: number;
  onAnimationEnd?: () => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function VoiceFilledSelectRow({
  label,
  value,
  options,
  state,
  duration = 2200,
  onAnimationEnd,
  onChange,
  placeholder = "Select…",
  required,
}: VoiceFilledSelectRowProps) {
  const [phase, setPhase] = useState<"none" | "flash" | "fading">("none");

  useEffect(() => {
    if (state === "filled") {
      setPhase("flash");
      const fadeTimer = setTimeout(() => setPhase("fading"), duration - 600);
      const endTimer = setTimeout(() => {
        setPhase("none");
        onAnimationEnd?.();
      }, duration);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(endTimer);
      };
    } else {
      setPhase("none");
    }
  }, [state, duration, onAnimationEnd]);

  const isHighlighted = phase === "flash" || phase === "fading";
  const isFading = phase === "fading";

  return (
    <div className="flex items-start gap-3">
      <label
        className="shrink-0 text-[#1A1A1A] font-['Inter']"
        style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
      >
        {label}
        {required && (
          <span
            className="font-['Inter']"
            style={{ fontSize: 14, fontWeight: 600, color: "#E74C3C", marginLeft: 2 }}
          >
            *
          </span>
        )}
      </label>
      <div className="flex-1 min-w-0 relative">
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full h-[40px] px-3 pr-8 rounded-lg border text-[#1A1A1A] font-['Inter'] outline-none appearance-none cursor-pointer"
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: value ? "#1A1A1A" : "rgba(26,26,26,0.30)",
              backgroundColor: isHighlighted ? "rgba(243,209,42,0.08)" : "#FFFFFF",
              borderColor: isHighlighted ? "#F3D12A" : "#D4D4D0",
              borderLeftWidth: isHighlighted ? 2 : 1,
              borderLeftColor: isHighlighted ? "#F3D12A" : "#D4D4D0",
              transition: isFading
                ? "background-color 0.6s ease-out, border-color 0.6s ease-out, border-left-width 0.6s ease-out, border-left-color 0.6s ease-out"
                : "none",
            }}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt} style={{ color: "#1A1A1A" }}>
                {opt}
              </option>
            ))}
          </select>

          {/* Chevron */}
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="#1A1A1A"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Mic icon — top-right, fades out */}
          {isHighlighted && (
            <div
              className="absolute flex items-center justify-center pointer-events-none"
              style={{
                top: 4,
                right: 20,
                width: 18,
                height: 18,
                opacity: isFading ? 0 : 1,
                transition: isFading ? "opacity 0.6s ease-out" : "none",
              }}
            >
              <Mic size={12} color="#F3D12A" strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
