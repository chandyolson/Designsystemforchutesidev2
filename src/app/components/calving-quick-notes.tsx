import { useState, useCallback } from "react";
import { FlagIcon } from "./flag-icon";
import type { FlagColor } from "./flag-icon";

/* ══════════════════════════════════════════
   Types & Data
   ══════════════════════════════════════════ */
export type NoteFlag = "cull" | "production" | "management" | "none";

export interface QuickNoteItem {
  id: string;
  text: string;
  flag: NoteFlag;
  calvingLabel?: string;
}

/* Pill colors by flag mapping */
const FLAG_PILL: Record<
  NoteFlag,
  { bg: string; bgSelected: string; border: string; borderSelected: string; color: string }
> = {
  cull: {
    bg: "rgba(155,35,53,0.12)",
    bgSelected: "rgba(155,35,53,0.20)",
    border: "rgba(155,35,53,0.25)",
    borderSelected: "#9B2335",
    color: "#9B2335",
  },
  production: {
    bg: "rgba(243,209,42,0.12)",
    bgSelected: "rgba(243,209,42,0.22)",
    border: "rgba(243,209,42,0.30)",
    borderSelected: "#B8860B",
    color: "#B8860B",
  },
  management: {
    bg: "rgba(85,186,170,0.12)",
    bgSelected: "rgba(85,186,170,0.20)",
    border: "rgba(85,186,170,0.25)",
    borderSelected: "#55BAAA",
    color: "#55BAAA",
  },
  none: {
    bg: "#F5F5F0",
    bgSelected: "rgba(26,26,26,0.08)",
    border: "#D4D4D0",
    borderSelected: "rgba(26,26,26,0.40)",
    color: "rgba(26,26,26,0.55)",
  },
};

const FLAG_TO_FLAG_COLOR: Record<string, FlagColor> = {
  cull: "red",
  production: "gold",
  management: "teal",
};

const FLAG_LABEL: Record<string, string> = {
  cull: "Cull",
  production: "Production",
  management: "Management",
};

const FLAG_TOAST_ACCENT: Record<string, string> = {
  cull: "#9B2335",
  production: "#D4A017",
  management: "#55BAAA",
};

/* Priority: cull > production > management > none */
const FLAG_PRIORITY: Record<NoteFlag, number> = {
  cull: 3,
  production: 2,
  management: 1,
  none: 0,
};

/* ── The 17 canonical notes (calving context) ── */
export const CALVING_QUICK_NOTES: QuickNoteItem[] = [
  { id: "qn1", text: "Cull", flag: "cull" },
  { id: "qn2", text: "Bad Bag", flag: "production" },
  { id: "qn3", text: "Bad Feet", flag: "production" },
  { id: "qn4", text: "Lame", flag: "production" },
  { id: "qn5", text: "Lump Jaw", flag: "production" },
  { id: "qn6", text: "Bad Disposition", flag: "production" },
  { id: "qn7", text: "Bad Mother", flag: "production" },
  { id: "qn8", text: "Old", flag: "production" },
  { id: "qn9", text: "Poor Calf", flag: "production" },
  { id: "qn10", text: "Poor Condition", flag: "production" },
  { id: "qn11", text: "Needs Tag", flag: "management" },
  { id: "qn12", text: "DNA", flag: "management" },
  { id: "qn13", text: "Needs Treated", flag: "management" },
  { id: "qn14", text: "Sorted", flag: "none" },
  { id: "qn15", text: "Treated", flag: "none" },
  { id: "qn16", text: "Twin", flag: "none", calvingLabel: "(Calving)" },
  { id: "qn17", text: "Freemartin", flag: "none" },
];

/* ══════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════ */
export function computeActiveFlag(selectedIds: string[]): NoteFlag {
  let highest: NoteFlag = "none";
  for (const id of selectedIds) {
    const note = CALVING_QUICK_NOTES.find((n) => n.id === id);
    if (note && FLAG_PRIORITY[note.flag] > FLAG_PRIORITY[highest]) {
      highest = note.flag;
    }
  }
  return highest;
}

export function getActiveFlagColor(selectedIds: string[]): FlagColor | null {
  const flag = computeActiveFlag(selectedIds);
  return flag === "none" ? null : FLAG_TO_FLAG_COLOR[flag];
}

/* ══════════════════════════════════════════
   Checkmark Icon (10px)
   ══════════════════════════════════════════ */
function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
      <path
        d="M2 5.5L4 7.5L8 3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════
   Flag Removal Confirmation Overlay
   ══════════════════════════════════════════ */
function FlagRemoveConfirm({
  flagLabel,
  tag,
  onRemove,
  onKeep,
}: {
  flagLabel: string;
  tag: string;
  onRemove: () => void;
  onKeep: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.40)" }}
      onClick={onKeep}
    >
      <div
        className="bg-white rounded-2xl font-['Inter'] shadow-xl"
        style={{ width: 280, padding: "24px 20px 16px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className="text-center"
          style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.4 }}
        >
          Remove {flagLabel} flag from Tag {tag}?
        </p>
        <p
          className="text-center mt-2"
          style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.45)", lineHeight: 1.5 }}
        >
          This animal will no longer be flagged for {flagLabel.toLowerCase()}.
        </p>
        <div className="flex flex-col gap-2 mt-5">
          <button
            type="button"
            onClick={onRemove}
            className="w-full rounded-lg cursor-pointer font-['Inter'] transition-colors hover:bg-red-50"
            style={{
              height: 40,
              fontSize: 14,
              fontWeight: 700,
              color: "#9B2335",
              backgroundColor: "rgba(155,35,53,0.06)",
              border: "1px solid rgba(155,35,53,0.15)",
            }}
          >
            Remove Flag
          </button>
          <button
            type="button"
            onClick={onKeep}
            className="w-full rounded-lg cursor-pointer font-['Inter'] transition-colors hover:bg-[#F5F5F0]"
            style={{
              height: 40,
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(26,26,26,0.55)",
              backgroundColor: "white",
              border: "1px solid #D4D4D0",
            }}
          >
            Keep Flag
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Flag Toast (custom, shown inline above pills)
   ══════════════════════════════════════════ */
function FlagToast({
  flag,
  tag,
  visible,
  upgraded,
}: {
  flag: Exclude<NoteFlag, "none">;
  tag: string;
  visible: boolean;
  upgraded?: boolean;
}) {
  const accent = FLAG_TOAST_ACCENT[flag];
  const flagColor = FLAG_TO_FLAG_COLOR[flag];
  const label = FLAG_LABEL[flag];
  const verb = upgraded ? "upgraded to" : "applied to";

  return (
    <div
      className="overflow-hidden transition-all duration-300"
      style={{
        maxHeight: visible ? 50 : 0,
        opacity: visible ? 1 : 0,
        marginBottom: visible ? 8 : 0,
      }}
    >
      <div
        className="flex items-center gap-2 rounded-lg font-['Inter']"
        style={{
          padding: "8px 12px",
          backgroundColor: "rgba(255,255,255,0.95)",
          border: `1px solid ${accent}`,
          borderLeft: `4px solid ${accent}`,
        }}
      >
        <FlagIcon color={flagColor} size="sm" />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>
          {label} flag {verb} Tag {tag}
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════ */
interface CalvingQuickNotesProps {
  selectedIds: string[];
  onSelectedChange: (ids: string[]) => void;
  tag: string;
  /** Called whenever the active flag changes */
  onFlagChange?: (flag: NoteFlag) => void;
  /** "calving" shows all 17 notes; "cowwork" hides calving-only notes (Twin). Default: "calving" */
  mode?: "calving" | "cowwork";
  /** If the animal already has a flag, pass it here for "upgraded" toast messaging */
  existingFlag?: NoteFlag;
}

export function CalvingQuickNotes({
  selectedIds,
  onSelectedChange,
  tag,
  onFlagChange,
  mode = "calving",
  existingFlag = "none",
}: CalvingQuickNotesProps) {
  const notes = mode === "cowwork"
    ? CALVING_QUICK_NOTES.filter((n) => !n.calvingLabel)
    : CALVING_QUICK_NOTES;

  const [toastFlag, setToastFlag] = useState<Exclude<NoteFlag, "none"> | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastUpgraded, setToastUpgraded] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    noteId: string;
    flag: Exclude<NoteFlag, "none">;
  } | null>(null);

  const showFlagToast = useCallback(
    (flag: Exclude<NoteFlag, "none">, upgraded: boolean) => {
      setToastFlag(flag);
      setToastUpgraded(upgraded);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    },
    []
  );

  /* Check if deselecting this note would remove the last note of its flag tier */
  const isLastOfFlagTier = useCallback(
    (noteId: string) => {
      const note = notes.find((n) => n.id === noteId);
      if (!note || note.flag === "none") return false;
      const sameFlag = selectedIds.filter((id) => {
        const n = notes.find((x) => x.id === id);
        return n && n.flag === note.flag;
      });
      return sameFlag.length === 1 && sameFlag[0] === noteId;
    },
    [selectedIds, notes]
  );

  const handleToggle = useCallback(
    (noteId: string) => {
      const isSelected = selectedIds.includes(noteId);
      const note = notes.find((n) => n.id === noteId)!;

      if (isSelected) {
        /* Deselecting */
        if (note.flag !== "none" && isLastOfFlagTier(noteId)) {
          setConfirmState({ noteId, flag: note.flag as Exclude<NoteFlag, "none"> });
          return;
        }
        const next = selectedIds.filter((id) => id !== noteId);
        onSelectedChange(next);
        onFlagChange?.(computeActiveFlag(next));
      } else {
        /* Selecting */
        const next = [...selectedIds, noteId];
        onSelectedChange(next);
        const newFlag = computeActiveFlag(next);
        onFlagChange?.(newFlag);
        if (note.flag !== "none") {
          const effectiveFlag = newFlag === "none" ? (note.flag as Exclude<NoteFlag, "none">) : (newFlag as Exclude<NoteFlag, "none">);
          const prevFlag = computeActiveFlag(selectedIds);
          const isUpgrade = prevFlag !== "none" && FLAG_PRIORITY[effectiveFlag] > FLAG_PRIORITY[prevFlag];
          const wasAlreadyFlagged = existingFlag !== "none" && prevFlag === "none" && FLAG_PRIORITY[effectiveFlag] > FLAG_PRIORITY[existingFlag];
          showFlagToast(effectiveFlag, isUpgrade || wasAlreadyFlagged);
        }
      }
    },
    [selectedIds, onSelectedChange, onFlagChange, isLastOfFlagTier, showFlagToast, notes, existingFlag]
  );

  const handleConfirmRemove = useCallback(() => {
    if (!confirmState) return;
    const next = selectedIds.filter((id) => id !== confirmState.noteId);
    onSelectedChange(next);
    onFlagChange?.(computeActiveFlag(next));
    setConfirmState(null);
  }, [confirmState, selectedIds, onSelectedChange, onFlagChange]);

  const handleConfirmKeep = useCallback(() => {
    setConfirmState(null);
  }, []);

  return (
    <>
      {/* Flag toast */}
      {toastFlag && (
        <FlagToast flag={toastFlag} tag={tag} visible={toastVisible} upgraded={toastUpgraded} />
      )}

      {/* Pill wrap */}
      <div className="flex flex-wrap gap-1.5">
        {notes.map((note) => {
          const isSelected = selectedIds.includes(note.id);
          const s = FLAG_PILL[note.flag];

          return (
            <button
              key={note.id}
              type="button"
              onClick={() => handleToggle(note.id)}
              className="inline-flex items-center gap-1 rounded-full cursor-pointer transition-all duration-150 font-['Inter']"
              style={{
                padding: "5px 12px",
                fontSize: 12,
                fontWeight: 600,
                color: s.color,
                backgroundColor: isSelected ? s.bgSelected : s.bg,
                border: isSelected
                  ? `2px solid ${s.borderSelected}`
                  : `1px solid ${s.border}`,
                /* compensate for border width change so pill doesn't shift */
                margin: isSelected ? 0 : 0.5,
              }}
            >
              {isSelected && <CheckIcon color={s.color as string} />}
              {note.text}
              {note.calvingLabel && (
                <>
                  <span
                    className="shrink-0"
                    style={{
                      width: 1,
                      height: 10,
                      backgroundColor: s.color,
                      opacity: 0.3,
                      margin: "0 2px",
                    }}
                  />
                  <span style={{ fontSize: 9, fontWeight: 600, opacity: 0.7 }}>
                    {note.calvingLabel}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Flag removal confirmation overlay */}
      {confirmState && (
        <FlagRemoveConfirm
          flagLabel={FLAG_LABEL[confirmState.flag]}
          tag={tag}
          onRemove={handleConfirmRemove}
          onKeep={handleConfirmKeep}
        />
      )}
    </>
  );
}