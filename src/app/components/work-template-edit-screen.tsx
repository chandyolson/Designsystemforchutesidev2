import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { PillButton } from "./pill-button";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";
import { MOCK_TEMPLATES } from "./work-template-list-screen";

/* ── Toggle Switch ── */
function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="relative shrink-0 rounded-full transition-colors duration-200 cursor-pointer"
      style={{
        width: 44,
        height: 26,
        backgroundColor: on ? "#55BAAA" : "#D4D4D0",
        minHeight: 44,
        display: "flex",
        alignItems: "center",
      }}
      aria-checked={on}
      role="switch"
    >
      <span
        className="absolute rounded-full bg-white shadow-sm transition-all duration-200"
        style={{
          width: 22,
          height: 22,
          top: 2,
          left: on ? 20 : 2,
        }}
      />
    </button>
  );
}

/* ═════════════════════════════════════════════
   POINTER-BASED DRAG-TO-REORDER
   ═════════════════════════════════════════════ */
interface DragItem {
  name: string;
  description: string;
}

function ReorderableFieldList({
  items,
  onReorder,
  fieldState,
  onToggle,
}: {
  items: DragItem[];
  onReorder: (items: DragItem[]) => void;
  fieldState: Record<string, boolean>;
  onToggle: (name: string) => void;
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const startY = useRef(0);
  const rowRects = useRef<DOMRect[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const dragIdxRef = useRef<number | null>(null);

  /* Capture row positions at drag start */
  const captureRects = useCallback(() => {
    if (!listRef.current) return;
    const rows = listRef.current.querySelectorAll("[data-reorder-row]");
    rowRects.current = Array.from(rows).map((r) => r.getBoundingClientRect());
  }, []);

  /* Pointer handlers bound to grip handle */
  const handlePointerDown = useCallback(
    (idx: number, e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      startY.current = e.clientY;
      dragIdxRef.current = idx;
      setDragIdx(idx);
      setOverIdx(idx);
      captureRects();
    },
    [captureRects],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragIdxRef.current === null) return;
      const rects = rowRects.current;
      if (!rects.length) return;
      const y = e.clientY;
      /* Find closest row center */
      let closest = 0;
      let minDist = Infinity;
      rects.forEach((r, i) => {
        const center = r.top + r.height / 2;
        const dist = Math.abs(y - center);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setOverIdx(closest);
    },
    [],
  );

  const handlePointerUp = useCallback(() => {
    const from = dragIdxRef.current;
    const to = overIdx;
    dragIdxRef.current = null;
    setDragIdx(null);
    setOverIdx(null);
    if (from !== null && to !== null && from !== to) {
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      onReorder(next);
    }
  }, [items, overIdx, onReorder]);

  /* Build visual order: show items in their preview position during drag */
  const displayItems = (() => {
    if (dragIdx === null || overIdx === null || dragIdx === overIdx) return items;
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(overIdx, 0, moved);
    return next;
  })();

  return (
    <div ref={listRef}>
      {displayItems.map((f, i) => {
        const isDragging = dragIdx !== null && f.name === items[dragIdx]?.name;
        return (
          <div
            key={f.name}
            data-reorder-row
            className="flex items-center justify-between py-3 transition-all duration-150"
            style={{
              opacity: isDragging ? 0.92 : 1,
              transform: isDragging ? "scale(1.02)" : "scale(1)",
              backgroundColor: isDragging ? "rgba(85,186,170,0.06)" : "transparent",
              borderRadius: isDragging ? 12 : 0,
              boxShadow: isDragging ? "0 4px 16px rgba(14,38,70,0.08)" : "none",
              marginLeft: -4,
              marginRight: -4,
              paddingLeft: 4,
              paddingRight: 4,
              zIndex: isDragging ? 10 : 1,
              position: "relative",
            }}
          >
            {/* Grip handle */}
            <div
              className="shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
              style={{ width: 28, minHeight: 44 }}
              onPointerDown={(e) => handlePointerDown(items.indexOf(f) !== -1 ? items.indexOf(f) : i, e)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                <circle cx="2.5" cy="2.5" r="1.5" fill="rgba(26,26,26,0.18)" />
                <circle cx="7.5" cy="2.5" r="1.5" fill="rgba(26,26,26,0.18)" />
                <circle cx="2.5" cy="8" r="1.5" fill="rgba(26,26,26,0.18)" />
                <circle cx="7.5" cy="8" r="1.5" fill="rgba(26,26,26,0.18)" />
                <circle cx="2.5" cy="13.5" r="1.5" fill="rgba(26,26,26,0.18)" />
                <circle cx="7.5" cy="13.5" r="1.5" fill="rgba(26,26,26,0.18)" />
              </svg>
            </div>

            {/* Field info */}
            <div className="flex-1 pr-3 min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate" style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>
                  {f.name}
                </p>
                {/* Position badge */}
                <span
                  className="shrink-0 rounded-full"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    width: 18,
                    height: 18,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(14,38,70,0.06)",
                    color: "rgba(26,26,26,0.3)",
                  }}
                >
                  {i + 1}
                </span>
              </div>
              <p style={{ fontSize: 11, fontWeight: 400, color: "rgba(26,26,26,0.35)" }}>
                {f.description}
              </p>
            </div>

            {/* Toggle */}
            <Toggle on={!!fieldState[f.name]} onChange={() => onToggle(f.name)} />
          </div>
        );
      })}
    </div>
  );
}

/* ── Processing type → display label map ── */
const PROCESSING_LABELS: Record<string, string> = {
  "Pregnancy Check": "PREGNANCY CHECK",
  "Breeding / Bull Turnout": "BREEDING / BULL TURNOUT",
  "Cull / Sale": "CULL / SALE",
  "Bull Testing (BSE)": "BULL TESTING (BSE)",
};

/* ── Field definitions ── */
interface FieldDef {
  name: string;
  description: string;
  defaultOn: boolean;
}

const COMMON_FIELDS: FieldDef[] = [
  { name: "Weight", description: "Animal weight in lbs", defaultOn: true },
  { name: "Quick Notes", description: "Predefined note shortcuts", defaultOn: true },
  { name: "DNA / Sample", description: "Sample ID or DNA number", defaultOn: false },
  { name: "Memo", description: "Free-text notes field", defaultOn: true },
  { name: "Data 1", description: "Custom flexible field", defaultOn: false },
  { name: "Data 2", description: "Custom flexible field", defaultOn: false },
];

const CONDITIONAL_FIELDS: Record<string, FieldDef[]> = {
  "Pregnancy Check": [
    { name: "Preg Stage", description: "Open, Bred, AI, etc.", defaultOn: true },
    { name: "Days of Gestation", description: "Estimated days", defaultOn: true },
    { name: "Calf Sex", description: "Bull, Heifer, Unknown", defaultOn: true },
  ],
  "Breeding / Bull Turnout": [
    { name: "Sire / Bull", description: "Bull tag or name", defaultOn: true },
    { name: "Breeding Date", description: "Date of breeding", defaultOn: true },
    { name: "Breeding Method", description: "Natural, AI, ET", defaultOn: true },
  ],
  "Cull / Sale": [
    { name: "Cull Reason", description: "Why animal is culled", defaultOn: true },
    { name: "Disposition", description: "Sold, Kept, Dead, Shipped", defaultOn: true },
    { name: "Sale Weight", description: "Sale weight in lbs", defaultOn: false },
  ],
  "Bull Testing (BSE)": [
    { name: "BSE Result", description: "Pass, Fail, Defer", defaultOn: true },
    { name: "Scrotal Circumference", description: "Measurement in cm", defaultOn: true },
    { name: "Motility %", description: "Sperm motility percentage", defaultOn: true },
    { name: "Morphology %", description: "Sperm morphology percentage", defaultOn: true },
  ],
};

/* ── Map short type codes back to select values ── */
const TYPE_CODE_TO_SELECT: Record<string, string> = {
  PREG: "Pregnancy Check",
  BSE: "Bull Testing (BSE)",
  PROCESS: "Processing",
  SALE: "Cull / Sale",
  AI: "Breeding / Bull Turnout",
};

const CATTLE_CODE_TO_SELECT: Record<string, string> = {
  Cow: "Cow",
  Bull: "Bull",
  Mixed: "Mixed",
  Replacement: "Replacement",
  Calf: "Calf",
  Steer: "Steer",
};

const PROCESSING_OPTIONS = [
  "Pregnancy Check",
  "Breeding / Bull Turnout",
  "Cull / Sale",
  "Bull Testing (BSE)",
  "Movement",
  "Brucellosis Vaccination",
  "Processing",
  "Working",
  "Other",
];

const CATTLE_OPTIONS = ["Cow", "Bull", "Replacement", "Calf", "Steer", "Mixed"];

/* ═══════════════════════════════════════════════
   WORK TEMPLATE EDIT SCREEN
   ═══════════════════════════════════════════════ */
export function WorkTemplateEditScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();
  const isEditing = !!id && id !== "new";

  /* ── Find existing template if editing ── */
  const existing = isEditing ? MOCK_TEMPLATES.find((t) => t.id === id) : null;

  /* ── Form state ── */
  const [name, setName] = useState(existing?.name ?? "");
  const [processingType, setProcessingType] = useState(
    existing ? (TYPE_CODE_TO_SELECT[existing.type] ?? "") : "",
  );
  const [cattleType, setCattleType] = useState(
    existing ? (CATTLE_CODE_TO_SELECT[existing.cattleType] ?? "") : "",
  );

  /* ── Field visibility state ── */
  const buildDefaults = (procType: string, existingFields?: string[]) => {
    const map: Record<string, boolean> = {};
    COMMON_FIELDS.forEach((f) => {
      map[f.name] = existingFields ? existingFields.includes(f.name) : f.defaultOn;
    });
    const cond = CONDITIONAL_FIELDS[procType] || [];
    cond.forEach((f) => {
      map[f.name] = existingFields ? existingFields.includes(f.name) : f.defaultOn;
    });
    return map;
  };

  const [fieldState, setFieldState] = useState<Record<string, boolean>>(
    buildDefaults(existing ? (TYPE_CODE_TO_SELECT[existing.type] ?? "") : "", existing?.fields),
  );

  /* ── Field ORDER state (separate arrays for common + conditional) ── */
  const [commonOrder, setCommonOrder] = useState<DragItem[]>(
    COMMON_FIELDS.map((f) => ({ name: f.name, description: f.description })),
  );
  const [condOrder, setCondOrder] = useState<DragItem[]>([]);

  /* When processing type changes, reset conditional fields to defaults */
  useEffect(() => {
    setFieldState((prev) => {
      const next: Record<string, boolean> = {};
      COMMON_FIELDS.forEach((f) => {
        next[f.name] = prev[f.name] ?? f.defaultOn;
      });
      const cond = CONDITIONAL_FIELDS[processingType] || [];
      cond.forEach((f) => {
        next[f.name] = prev[f.name] ?? f.defaultOn;
      });
      return next;
    });
    /* Reset conditional field order */
    const cond = CONDITIONAL_FIELDS[processingType] || [];
    setCondOrder(cond.map((f) => ({ name: f.name, description: f.description })));
  }, [processingType]);

  const toggleField = (name: string) =>
    setFieldState((prev) => ({ ...prev, [name]: !prev[name] }));

  /* ── Validation ── */
  const [nameError, setNameError] = useState("");

  const handleSave = () => {
    const isDupe = MOCK_TEMPLATES.some(
      (t) => t.name.toLowerCase() === name.trim().toLowerCase() && t.id !== id,
    );
    if (!name.trim()) {
      setNameError("Template name is required");
      return;
    }
    if (isDupe) {
      setNameError("Template name already exists");
      return;
    }
    setNameError("");

    /* Build ordered enabled field names for save */
    const enabledCommon = commonOrder.filter((f) => fieldState[f.name]).map((f) => f.name);
    const enabledCond = condOrder.filter((f) => fieldState[f.name]).map((f) => f.name);
    const fieldOrder = [...enabledCommon, ...enabledCond];
    console.log("Saved field order:", fieldOrder);

    showToast("success", isEditing ? "Template updated" : "Template created");
    navigate("/cow-work/templates");
  };

  const handleDelete = () => {
    showDeleteConfirm({
      title: "Delete Template",
      message: `Are you sure you want to delete '${name || "this template"}'? This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        showToast("success", "Template deleted");
        navigate("/cow-work/templates");
      },
    });
  };

  /* Count enabled */
  const enabledCount = Object.values(fieldState).filter(Boolean).length;

  return (
    <div className="space-y-5 font-['Inter']">
      {/* ══ SECTION 1: BASIC INFO ══ */}
      <div>
        <FormFieldRow
          label="Template Name *"
          value={name}
          onChange={(v) => { setName(v); setNameError(""); }}
          placeholder="e.g. Spring Preg Check"
        />
        {nameError && (
          <p className="mt-1 pl-[110px]" style={{ fontSize: 12, fontWeight: 500, color: "#E74C3C" }}>
            {nameError}
          </p>
        )}
        <div className="mt-3">
          <FormSelectRow
            label="Processing Type *"
            value={processingType}
            onChange={setProcessingType}
            placeholder="Select type…"
            options={PROCESSING_OPTIONS}
          />
        </div>
        <div className="mt-3">
          <FormSelectRow
            label="Cattle Type"
            value={cattleType}
            onChange={setCattleType}
            placeholder="Select…"
            options={CATTLE_OPTIONS}
          />
        </div>
      </div>

      {/* ══ SECTION 2: FIELD VISIBILITY & ORDER ══ */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#0E2646" }}>
              Field Visibility & Order
            </p>
            <p className="mt-0.5" style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.45)" }}>
              Toggle fields on/off and drag to reorder
            </p>
          </div>
          <span
            className="rounded-full"
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              backgroundColor: "rgba(85,186,170,0.1)",
              color: "#55BAAA",
            }}
          >
            {enabledCount} active
          </span>
        </div>

        {/* Drag hint */}
        <div
          className="flex items-center gap-2 mt-3 rounded-lg px-3 py-2"
          style={{ backgroundColor: "rgba(14,38,70,0.03)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1v12M7 1L4 4M7 1l3 3M7 13L4 10M7 13l3-3"
              stroke="rgba(26,26,26,0.25)"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(26,26,26,0.35)" }}>
            Drag the grip handle to set input tab field order
          </span>
        </div>

        {/* Common fields (reorderable) */}
        <div className="mt-2">
          <ReorderableFieldList
            items={commonOrder}
            onReorder={setCommonOrder}
            fieldState={fieldState}
            onToggle={toggleField}
          />
        </div>

        {/* Conditional fields (reorderable) */}
        {condOrder.length > 0 && (
          <>
            <div className="border-t border-[#D4D4D0]/40 my-2" />
            <p
              className="uppercase mb-1"
              style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(26,26,26,0.35)" }}
            >
              {PROCESSING_LABELS[processingType] || processingType.toUpperCase()} FIELDS
            </p>
            <ReorderableFieldList
              items={condOrder}
              onReorder={setCondOrder}
              fieldState={fieldState}
              onToggle={toggleField}
            />
          </>
        )}
      </div>

      {/* ══ ACTION BUTTONS ══ */}
      <div className="pt-4">
        <div className="flex gap-3">
          <PillButton variant="outline" size="md" onClick={() => navigate("/cow-work/templates")} style={{ flex: 1 }}>
            Cancel
          </PillButton>
          <PillButton size="md" onClick={handleSave} style={{ flex: 1 }}>
            Save Template
          </PillButton>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full text-center mt-4 cursor-pointer"
            style={{ fontSize: 13, fontWeight: 600, color: "#E74C3C", background: "none", border: "none", padding: "4px 0" }}
          >
            Delete Template
          </button>
        )}
      </div>
    </div>
  );
}