import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { FlagIcon } from "./flag-icon";
import type { FlagColor } from "./flag-icon";

/* ── Types ── */
export interface DuplicateAnimal {
  tag: string;
  tagColor: string;
  sex: string;
  yearBorn: string;
  status: string;
  flag?: FlagColor | null;
}

interface DuplicateAnimalWarningProps {
  animal: DuplicateAnimal;
  onViewExisting: () => void;
  onAddAnyway: () => void;
  onCancel: () => void;
}

/* ═══════════════════════════════════════════════
   DUPLICATE ANIMAL WARNING DIALOG
   ═══════════════════════════════════════════════ */
export function DuplicateAnimalWarning({
  animal,
  onViewExisting,
  onAddAnyway,
  onCancel,
}: DuplicateAnimalWarningProps) {
  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center font-['Inter']"
      style={{
        background: "rgba(0,0,0,0.5)",
        animation: "fadeIn 0.15s ease-out",
      }}
      onClick={onCancel}
    >
      <div
        className="bg-white flex flex-col items-center"
        style={{
          width: "calc(100% - 48px)",
          maxWidth: 360,
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 16px 48px rgba(14,38,70,0.20)",
          animation: "scaleIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Warning icon ── */}
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: 48,
            height: 48,
            backgroundColor: "#FFF3E0",
          }}
        >
          <AlertTriangle size={24} color="#E67E22" strokeWidth={2} />
        </div>

        {/* ── Title ── */}
        <p
          className="text-center"
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#1A1A1A",
            marginTop: 16,
          }}
        >
          Possible Duplicate
        </p>

        {/* ── Message ── */}
        <p
          className="text-center"
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "rgba(26,26,26,0.55)",
            marginTop: 8,
            lineHeight: 1.45,
          }}
        >
          An animal with tag <strong style={{ fontWeight: 600, color: "rgba(26,26,26,0.70)" }}>{animal.tag}</strong> already exists in your herd.
        </p>

        {/* ── Existing animal card ── */}
        <div
          className="w-full flex items-center justify-between gap-3"
          style={{
            marginTop: 12,
            borderRadius: 12,
            backgroundColor: "#0E2646",
            padding: "12px 16px",
          }}
        >
          <div className="min-w-0 flex-1">
            <p
              className="text-white"
              style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}
            >
              {animal.tag}
            </p>
            <p
              style={{
                fontSize: 12,
                fontWeight: 400,
                color: "rgba(255,255,255,0.40)",
                marginTop: 2,
                lineHeight: 1.4,
              }}
            >
              {animal.tagColor} · {animal.sex} · {animal.yearBorn} · {animal.status}
            </p>
          </div>
          {animal.flag && (
            <div className="shrink-0">
              <FlagIcon color={animal.flag} size="sm" />
            </div>
          )}
        </div>

        {/* ── Buttons ── */}
        <div className="w-full flex flex-col" style={{ marginTop: 16, gap: 12 }}>
          {/* View Existing Animal */}
          <button
            type="button"
            onClick={onViewExisting}
            className="w-full flex items-center justify-center rounded-full cursor-pointer transition-all duration-150 active:scale-[0.97]"
            style={{
              height: 44,
              backgroundColor: "#55BAAA",
              border: "none",
              fontSize: 14,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            View Existing Animal
          </button>

          {/* Add Anyway */}
          <button
            type="button"
            onClick={onAddAnyway}
            className="w-full flex items-center justify-center rounded-full cursor-pointer transition-all duration-150 active:scale-[0.97]"
            style={{
              height: 44,
              backgroundColor: "#FFFFFF",
              border: "1.5px solid #D4D4D0",
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(26,26,26,0.60)",
            }}
          >
            Add Anyway (Different Animal)
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={onCancel}
            className="w-full flex items-center justify-center cursor-pointer transition-colors duration-150"
            style={{
              height: 36,
              backgroundColor: "transparent",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(26,26,26,0.35)",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
