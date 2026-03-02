import { useState, useEffect } from "react";
import { Mic } from "lucide-react";

export type VoiceFillState = "idle" | "filled";

interface VoiceFilledFieldProps {
  label: string;
  value: string;
  /** When "filled", shows the yellow highlight + mic icon, then fades to idle */
  state: VoiceFillState;
  /** Duration of the highlight in ms (default 2200) */
  duration?: number;
  /** Called when the highlight animation completes */
  onAnimationEnd?: () => void;
  placeholder?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

export function VoiceFilledField({
  label,
  value,
  state,
  duration = 2200,
  onAnimationEnd,
  placeholder = "",
  onChange,
  required,
}: VoiceFilledFieldProps) {
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
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-[40px] px-3 rounded-lg border text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none"
          style={{
            fontSize: 16,
            fontWeight: 400,
            backgroundColor: isHighlighted ? "rgba(243,209,42,0.08)" : "#FFFFFF",
            borderColor: isHighlighted ? "#F3D12A" : "#D4D4D0",
            borderLeftWidth: isHighlighted ? 2 : 1,
            borderLeftColor: isHighlighted ? "#F3D12A" : "#D4D4D0",
            transition: isFading
              ? "background-color 0.6s ease-out, border-color 0.6s ease-out, border-left-width 0.6s ease-out, border-left-color 0.6s ease-out"
              : "none",
          }}
        />
        {/* Mic icon — top-right, fades out */}
        {isHighlighted && (
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              top: 4,
              right: 4,
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
  );
}

/**
 * Static version for demos — shows the "filled" visual state frozen
 * (no auto-timeout) so it can be displayed in a comparison layout.
 */
interface VoiceFilledFieldStaticProps {
  label: string;
  value: string;
  placeholder?: string;
  /** Show the yellow highlight treatment (true) or normal field (false) */
  highlighted: boolean;
  /** Show the fading-out phase instead */
  fading?: boolean;
  required?: boolean;
}

export function VoiceFilledFieldStatic({
  label,
  value,
  placeholder = "",
  highlighted,
  fading = false,
  required,
}: VoiceFilledFieldStaticProps) {
  const isHighlighted = highlighted;

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
        <input
          type="text"
          readOnly
          placeholder={placeholder}
          value={value}
          className="w-full h-[40px] px-3 rounded-lg border text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none"
          style={{
            fontSize: 16,
            fontWeight: 400,
            backgroundColor: isHighlighted ? "rgba(243,209,42,0.08)" : "#FFFFFF",
            borderColor: isHighlighted ? "#F3D12A" : "#D4D4D0",
            borderLeftWidth: isHighlighted ? 2 : 1,
            borderLeftColor: isHighlighted ? "#F3D12A" : "#D4D4D0",
            opacity: fading ? 0.55 : 1,
            transition: fading ? "opacity 0.6s ease-out" : "none",
          }}
        />
        {/* Mic icon — top-right */}
        {isHighlighted && (
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              top: 4,
              right: 4,
              width: 18,
              height: 18,
              opacity: fading ? 0.3 : 1,
            }}
          >
            <Mic size={12} color="#F3D12A" strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  );
}