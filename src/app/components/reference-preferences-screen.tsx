import { useState, useRef, useCallback } from "react";
import { useToast } from "./toast-context";

/* ══════════════════════════════════════════
   Types
   ══════════════════════════════════════════ */
type Segment = { id: string; label: string };

interface TagColor {
  id: string;
  label: string;
  hex: string;
  border?: boolean;
  dashed?: boolean;
}

/* ── Section header ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[#0E2646] font-['Inter'] uppercase mb-2 px-1"
      style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", opacity: 0.35 }}
    >
      {children}
    </p>
  );
}

/* ══════════════════════════════════════════
   Section 1 — Lifetime ID Pattern
   ══════════════════════════════════════════ */
const ALL_SEGMENTS: Segment[] = [
  { id: "usa", label: "USA" },
  { id: "state", label: "State" },
  { id: "ranch", label: "Ranch Code" },
  { id: "tag", label: "Tag" },
  { id: "dash", label: "-" },
  { id: "year", label: "Year" },
  { id: "eid4", label: "EID Last 4" },
  { id: "seq", label: "Sequence #" },
  { id: "breed", label: "Breed Code" },
  { id: "tagcolor", label: "Tag Color" },
];

const PREVIEW_MAP: Record<string, string> = {
  usa: "USA",
  state: "MT",
  ranch: "SBR",
  tag: "3309",
  dash: "-",
  year: "2020",
  eid4: "8821",
  seq: "001",
  breed: "AN",
  tagcolor: "RED",
};

function LifetimeIdSection({
  active,
  setActive,
}: {
  active: string[];
  setActive: (v: string[]) => void;
}) {
  const available = ALL_SEGMENTS.filter((s) => !active.includes(s.id));
  const preview = active.map((id) => PREVIEW_MAP[id] ?? id).join("");

  function toggleSegment(id: string) {
    if (active.includes(id)) {
      setActive(active.filter((s) => s !== id));
    } else {
      setActive([...active, id]);
    }
  }

  return (
    <div>
      <SectionLabel>Lifetime ID Pattern</SectionLabel>
      <div
        className="rounded-xl bg-white border border-[#D4D4D0]/60 font-['Inter']"
        style={{ padding: 16 }}
      >
        <p style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.45)", lineHeight: 1.5, marginBottom: 14 }}>
          Define how Lifetime IDs are automatically generated for new animals.
        </p>

        {/* Active pattern */}
        <div className="flex flex-wrap gap-2 mb-3">
          {active.map((id) => {
            const seg = ALL_SEGMENTS.find((s) => s.id === id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleSegment(id)}
                className="flex items-center justify-center rounded-lg cursor-pointer font-['Inter'] transition-all active:scale-95"
                style={{
                  height: 36,
                  padding: "0 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  backgroundColor: "#0E2646",
                  color: "#FFFFFF",
                  border: "none",
                }}
              >
                {seg?.label ?? id}
              </button>
            );
          })}
          {active.length === 0 && (
            <p style={{ fontSize: 12, color: "rgba(26,26,26,0.25)", padding: "8px 0" }}>
              Tap segments below to build pattern
            </p>
          )}
        </div>

        {/* Preview */}
        {active.length > 0 && (
          <p style={{ fontSize: 14, fontWeight: 600, color: "#55BAAA", marginBottom: 14 }}>
            Example: {preview}
          </p>
        )}

        {/* Available segments */}
        {available.length > 0 && (
          <>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(26,26,26,0.25)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Available Segments
            </p>
            <div className="flex flex-wrap gap-2">
              {available.map((seg) => (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => toggleSegment(seg.id)}
                  className="flex items-center justify-center rounded-lg cursor-pointer font-['Inter'] transition-all hover:bg-[#F5F5F0] active:scale-95"
                  style={{
                    height: 36,
                    padding: "0 14px",
                    fontSize: 13,
                    fontWeight: 500,
                    backgroundColor: "white",
                    color: "#1A1A1A",
                    border: "1px solid #D4D4D0",
                  }}
                >
                  {seg.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Drag-handle reorderable list
   ══════════════════════════════════════════ */
function GripIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" className="shrink-0">
      <circle cx="2.5" cy="2.5" r="1.25" fill="#1A1A1A" fillOpacity="0.18" />
      <circle cx="7.5" cy="2.5" r="1.25" fill="#1A1A1A" fillOpacity="0.18" />
      <circle cx="2.5" cy="6.5" r="1.25" fill="#1A1A1A" fillOpacity="0.18" />
      <circle cx="7.5" cy="6.5" r="1.25" fill="#1A1A1A" fillOpacity="0.18" />
      <circle cx="2.5" cy="10.5" r="1.25" fill="#1A1A1A" fillOpacity="0.18" />
      <circle cx="7.5" cy="10.5" r="1.25" fill="#1A1A1A" fillOpacity="0.18" />
      <circle cx="2.5" cy="14.5" r="1.25" fill="#1A1A1A" fillOpacity="0.18" />
      <circle cx="7.5" cy="14.5" r="1.25" fill="#1A1A1A" fillOpacity="0.18" />
    </svg>
  );
}

function DraggableList({
  items,
  setItems,
  addLabel,
}: {
  items: string[];
  setItems: (v: string[]) => void;
  addLabel: string;
}) {
  const dragIdx = useRef<number | null>(null);
  const overIdx = useRef<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [addingText, setAddingText] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const handleDragStart = useCallback((idx: number) => {
    dragIdx.current = idx;
    setDragging(idx);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    overIdx.current = idx;
  }, []);

  const handleDrop = useCallback(() => {
    if (dragIdx.current !== null && overIdx.current !== null && dragIdx.current !== overIdx.current) {
      const copy = [...items];
      const [moved] = copy.splice(dragIdx.current, 1);
      copy.splice(overIdx.current, 0, moved);
      setItems(copy);
    }
    dragIdx.current = null;
    overIdx.current = null;
    setDragging(null);
  }, [items, setItems]);

  const handleDragEnd = useCallback(() => {
    setDragging(null);
  }, []);

  /* Touch-based reorder */
  const touchStartY = useRef(0);
  const touchIdx = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent, idx: number) => {
    touchStartY.current = e.touches[0].clientY;
    touchIdx.current = idx;
    setDragging(idx);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchIdx.current === null) return;
      const endY = e.changedTouches[0].clientY;
      const delta = endY - touchStartY.current;
      const direction = delta > 20 ? 1 : delta < -20 ? -1 : 0;
      if (direction !== 0) {
        const newIdx = Math.max(0, Math.min(items.length - 1, touchIdx.current + direction));
        if (newIdx !== touchIdx.current) {
          const copy = [...items];
          const [moved] = copy.splice(touchIdx.current, 1);
          copy.splice(newIdx, 0, moved);
          setItems(copy);
        }
      }
      touchIdx.current = null;
      setDragging(null);
    },
    [items, setItems]
  );

  function handleAddSave() {
    const val = addingText.trim();
    if (!val) return;
    if (items.some((i) => i.toLowerCase() === val.toLowerCase())) return;
    setItems([...items, val]);
    setAddingText("");
    setShowAdd(false);
  }

  return (
    <div className="rounded-xl bg-white border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40 font-['Inter']">
      {items.map((item, idx) => (
        <div
          key={item}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onTouchStart={(e) => handleTouchStart(e, idx)}
          onTouchEnd={handleTouchEnd}
          className="flex items-center gap-3 transition-colors"
          style={{
            padding: "12px 16px",
            cursor: "grab",
            opacity: dragging === idx ? 0.5 : 1,
            backgroundColor: dragging === idx ? "#F5F5F0" : "transparent",
          }}
        >
          <GripIcon />
          <span
            className="flex-1 truncate"
            style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}
          >
            {item}
          </span>
          <span
            style={{ fontSize: 11, fontWeight: 500, color: "rgba(26,26,26,0.20)" }}
          >
            {idx + 1}
          </span>
        </div>
      ))}

      {/* Add inline */}
      {showAdd ? (
        <div className="flex items-center gap-2" style={{ padding: "8px 16px" }}>
          <input
            autoFocus
            type="text"
            placeholder="New item..."
            value={addingText}
            onChange={(e) => setAddingText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAddSave(); if (e.key === "Escape") { setShowAdd(false); setAddingText(""); } }}
            className="flex-1 min-w-0 h-[36px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
            style={{ fontSize: 14, fontWeight: 400 }}
          />
          <button
            type="button"
            onClick={handleAddSave}
            className="shrink-0 rounded-lg cursor-pointer font-['Inter'] transition-colors hover:brightness-95"
            style={{ height: 36, padding: "0 12px", fontSize: 12, fontWeight: 600, color: "#0E2646", backgroundColor: "#F3D12A", border: "none" }}
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => { setShowAdd(false); setAddingText(""); }}
            className="shrink-0 cursor-pointer font-['Inter']"
            style={{ fontSize: 12, fontWeight: 500, color: "rgba(26,26,26,0.40)", background: "none", border: "none" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="w-full text-left cursor-pointer transition-colors hover:bg-[#F5F5F0]"
          style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#55BAAA", background: "none", border: "none" }}
        >
          + {addLabel}
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Section 4 — Tag Colors
   ══════════════════════════════════════════ */
const TAG_COLORS: TagColor[] = [
  { id: "green", label: "Green", hex: "#22C55E" },
  { id: "blue", label: "Blue", hex: "#3B82F6" },
  { id: "red", label: "Red", hex: "#EF4444" },
  { id: "yellow", label: "Yellow", hex: "#F3D12A" },
  { id: "orange", label: "Orange", hex: "#F97316" },
  { id: "white", label: "White", hex: "#F5F5F5", border: true },
  { id: "purple", label: "Purple", hex: "#A855F7" },
  { id: "pink", label: "Pink", hex: "#EC4899" },
  { id: "silver", label: "Silver", hex: "#C0C0C0", border: true },
  { id: "black", label: "Black", hex: "#1A1A1A" },
  { id: "brown", label: "Brown", hex: "#92400E" },
  { id: "none", label: "No Color", hex: "transparent", dashed: true },
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7.5L5.5 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIconDark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7.5L5.5 10L11 4" stroke="#0E2646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TagColorGrid({
  activeIds,
  toggle,
}: {
  activeIds: Set<string>;
  toggle: (id: string) => void;
}) {
  return (
    <div
      className="rounded-xl bg-white border border-[#D4D4D0]/60 font-['Inter']"
      style={{ padding: 16 }}
    >
      <div className="grid grid-cols-3 gap-x-4 gap-y-4">
        {TAG_COLORS.map((tc) => {
          const isActive = activeIds.has(tc.id);
          const needsDarkCheck = tc.id === "yellow" || tc.id === "white" || tc.id === "silver";
          return (
            <button
              key={tc.id}
              type="button"
              onClick={() => toggle(tc.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <div
                className="relative flex items-center justify-center rounded-full transition-transform active:scale-90"
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: tc.dashed ? "transparent" : tc.hex,
                  border: tc.dashed
                    ? "2px dashed rgba(26,26,26,0.15)"
                    : tc.border
                    ? "1.5px solid rgba(26,26,26,0.12)"
                    : isActive
                    ? "2px solid rgba(0,0,0,0.10)"
                    : "none",
                  boxShadow: isActive && !tc.dashed ? "0 0 0 2.5px rgba(85,186,170,0.35)" : "none",
                }}
              >
                {isActive && !tc.dashed && (needsDarkCheck ? <CheckIconDark /> : <CheckIcon />)}
                {isActive && tc.dashed && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.5L5.5 10L11 4" stroke="#55BAAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#1A1A1A" : "rgba(26,26,26,0.40)",
                }}
              >
                {tc.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN
   ��═════════════════════════════════════════ */
export function ReferencePreferencesScreen() {
  const { showToast } = useToast();

  /* Section 1 — ID Pattern */
  const [activeSegments, setActiveSegments] = useState<string[]>(["usa", "tag", "dash", "year"]);

  /* Section 2 — Breeds */
  const [breeds, setBreeds] = useState<string[]>([
    "Angus",
    "Hereford",
    "Angus x Hereford",
    "Red Angus",
    "Simmental",
  ]);

  /* Section 3 — Pregnancy Stages */
  const [stages, setStages] = useState<string[]>([
    "Open",
    "30-60 Days",
    "60-90 Days",
    "90-120 Days",
    "120+ Days",
    "Short Bred",
    "Confirmed",
  ]);

  /* Section 4 — Tag Colors */
  const [activeColors, setActiveColors] = useState<Set<string>>(
    new Set(["green", "blue", "red", "yellow", "orange", "white"])
  );

  function toggleColor(id: string) {
    setActiveColors((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleSave() {
    showToast("success", "Preferences saved successfully");
  }

  return (
    <div className="font-['Inter']" style={{ padding: 20, paddingBottom: 40 }}>
      {/* ── Section 1: Lifetime ID Pattern ── */}
      <div className="mb-6">
        <LifetimeIdSection active={activeSegments} setActive={setActiveSegments} />
      </div>

      {/* ── Section 2: Preferred Breeds ── */}
      <div className="mb-6">
        <SectionLabel>Preferred Breeds</SectionLabel>
        <DraggableList items={breeds} setItems={setBreeds} addLabel="Add Breed" />
      </div>

      {/* ── Section 3: Pregnancy Stages ── */}
      <div className="mb-6">
        <SectionLabel>Pregnancy Stages</SectionLabel>
        <DraggableList items={stages} setItems={setStages} addLabel="Add Stage" />
      </div>

      {/* ── Section 4: Tag Colors In Use ── */}
      <div className="mb-8">
        <SectionLabel>Tag Colors in Use</SectionLabel>
        <TagColorGrid activeIds={activeColors} toggle={toggleColor} />
        <p
          className="mt-2 px-1"
          style={{ fontSize: 11, fontWeight: 400, color: "rgba(26,26,26,0.30)" }}
        >
          {activeColors.size} color{activeColors.size !== 1 ? "s" : ""} active — these appear in tag color dropdowns
        </p>
      </div>

      {/* ── Save button ── */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full rounded-xl cursor-pointer font-['Inter'] transition-all hover:brightness-95 active:scale-[0.98]"
        style={{
          height: 48,
          fontSize: 15,
          fontWeight: 700,
          color: "#0E2646",
          backgroundColor: "#F3D12A",
          border: "none",
        }}
      >
        Save Preferences
      </button>
    </div>
  );
}