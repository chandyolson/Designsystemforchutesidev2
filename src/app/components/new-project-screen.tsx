import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { CollapsibleSection } from "./collapsible-section";
import { PillButton } from "./pill-button";
import { useToast } from "./toast-context";

/* ═══════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════ */

/* ── Template types & pill colors ── */
type WorkTypeKey = "PREG" | "BSE" | "PROCESS" | "AI" | "WEAN" | "INVENTORY" | "SALE" | "CUSTOM";

const TYPE_PILL: Record<WorkTypeKey, { bg: string; color: string }> = {
  PREG:      { bg: "rgba(85,186,170,0.12)",  color: "#55BAAA" },
  BSE:       { bg: "rgba(14,38,70,0.10)",     color: "#0E2646" },
  PROCESS:   { bg: "rgba(243,209,42,0.12)",   color: "#B8860B" },
  AI:        { bg: "rgba(155,35,53,0.10)",     color: "#9B2335" },
  WEAN:      { bg: "rgba(230,81,0,0.10)",      color: "#E65100" },
  INVENTORY: { bg: "rgba(85,186,170,0.12)",    color: "#55BAAA" },
  SALE:      { bg: "rgba(231,76,60,0.10)",     color: "#E74C3C" },
  CUSTOM:    { bg: "rgba(26,26,26,0.08)",      color: "rgba(26,26,26,0.50)" },
};

interface TemplateCard {
  id: string;
  name: string;
  type: WorkTypeKey;
  workType: string;
  cattleType: string;
  group: string;
  fields: string[];       // optional field names that should be ON
  products: { name: string; dosage: string; route: string }[];
}

const TEMPLATES: TemplateCard[] = [
  {
    id: "t1",
    name: "Spring Preg Check",
    type: "PREG",
    workType: "Pregnancy Check",
    cattleType: "Cow",
    group: "Spring Calvers",
    fields: ["Weight", "Quick Notes", "Notes", "DNA", "Tag Color"],
    products: [
      { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" },
      { name: "Ivermectin Pour-On", dosage: "1 mL / 22 lbs", route: "Topical" },
    ],
  },
  {
    id: "t2",
    name: "Fall Processing",
    type: "PROCESS",
    workType: "Processing",
    cattleType: "Mixed",
    group: "Fall Calvers",
    fields: ["Weight", "Quick Notes", "Notes", "Tag Color", "Lot", "Pen"],
    products: [
      { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" },
      { name: "Ivermectin Pour-On", dosage: "1 mL / 22 lbs", route: "Topical" },
    ],
  },
  {
    id: "t3",
    name: "Annual BSE",
    type: "BSE",
    workType: "Breeding Soundness Exam",
    cattleType: "Bull",
    group: "Bulls",
    fields: ["Weight", "Quick Notes", "Notes", "DNA", "Tag Color"],
    products: [],
  },
  {
    id: "t4",
    name: "Cull Sort",
    type: "SALE",
    workType: "Cull / Sale",
    cattleType: "Cow",
    group: "Old Cows",
    fields: ["Weight", "Quick Notes", "Notes", "Tag Color", "Lot"],
    products: [],
  },
];

/* ── Work type → locked fields ── */
const LOCKED_FIELDS: Record<string, { label: string; fields: string[] }> = {
  "Pregnancy Check": {
    label: "PREGNANCY CHECK FIELDS",
    fields: ["Preg Stage", "Days of Gestation", "Fetal Sex"],
  },
  "Breeding / Bull Turnout": {
    label: "BREEDING FIELDS",
    fields: ["Technician", "Breeding Sire", "Estrus Status", "Breeding Type"],
  },
  "Breeding Soundness Exam": {
    label: "BSE FIELDS",
    fields: ["Scrotal", "Pass/Fail", "Motility", "Morphology", "Semen Defects", "Physical Defects"],
  },
};

/* ── All optional fields ── */
interface OptionalField {
  name: string;
  on: boolean;
}

const DEFAULT_OPTIONAL_FIELDS: OptionalField[] = [
  { name: "Weight", on: true },
  { name: "Quick Notes", on: true },
  { name: "Notes", on: true },
  { name: "DNA", on: true },
  { name: "Tag Color", on: true },
  { name: "Lot", on: false },
  { name: "Sample", on: false },
  { name: "Pen", on: false },
  { name: "Data 1", on: false },
  { name: "Data 2", on: false },
  { name: "Traits", on: false },
];

/* ── Option lists ── */
const WORK_TYPES = [
  "Pregnancy Check",
  "Breeding / Bull Turnout",
  "Breeding Soundness Exam",
  "Processing",
  "Working",
  "Movement",
  "Weaning",
  "Brucellosis Vaccination",
  "Cull / Sale",
  "Inventory",
  "Other",
];
const GROUPS = [
  "Spring Calvers",
  "Fall Calvers",
  "Heifers — 1st Calf",
  "Bulls",
  "Replacement Heifers",
  "2026 Cows",
  "Old Cows",
];
const CATTLE_TYPES = ["Cow", "Bull", "Heifer", "Steer", "Calf", "Yearling", "Mixed", "All"];
const LOCATIONS = [
  "Working Facility",
  "North Pasture",
  "South Pasture",
  "Hoffman's",
  "Oelrichs",
  "Home Place",
];
const ROUTE_OPTIONS = ["IM", "SQ", "IV", "Topical", "Oral", "Intravaginal", "Pour-On"];

/* ── Helpers ── */
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function generateProjectId(date: string, group: string, type: string): string {
  if (!date) return "—";
  const d = new Date(date + "T00:00:00");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const day = String(d.getDate()).padStart(2, "0");
  const mon = months[d.getMonth()] || "???";
  const year = d.getFullYear();
  const groupAbbr = group ? group.replace(/\s+/g, "").slice(0, 12) : "NoGroup";
  const typeAbbr = type
    ? type.split(/[\s/()]+/).filter(Boolean).map((w) => w[0]).join("").toUpperCase()
    : "NEW";
  return `${day}${mon}${year}-${groupAbbr}-${typeAbbr}`;
}

/* ═══════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════ */

/* Template card icons — 20px, per spec type */
function TemplateIcon({ type }: { type: WorkTypeKey }) {
  const colors: Record<WorkTypeKey, string> = {
    PREG: "#55BAAA", BSE: "#0E2646", PROCESS: "#B8860B", AI: "#9B2335",
    WEAN: "#E65100", INVENTORY: "#55BAAA", SALE: "#E74C3C", CUSTOM: "rgba(26,26,26,0.50)",
  };
  const c = colors[type];
  switch (type) {
    case "PREG": // stethoscope
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 8C5 5 6.5 3 9 3C11.5 3 13 5 13 8" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M5 8V12C5 14.2 6.8 16 9 16" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="14" cy="12" r="2" stroke={c} strokeWidth="1.5" />
          <path d="M14 14V16C14 16.5 13.5 17 13 17H11" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "BSE": // clipboard-check
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="4" y="3" width="12" height="14" rx="2" stroke={c} strokeWidth="1.5" />
          <path d="M8 1.5V4.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 1.5V4.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7.5 10L9 11.5L12.5 8" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "PROCESS": // syringe
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M14 2L18 6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M11.5 4.5L15.5 8.5L7.5 16.5L3 17L3.5 12.5L11.5 4.5Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 7L13 11" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "AI": // heart
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 17S3 12.5 3 7.5C3 5 5 3 7 3C8.5 3 9.5 4 10 5C10.5 4 11.5 3 13 3C15 3 17 5 17 7.5C17 12.5 10 17 10 17Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "WEAN": // scissors
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="6" cy="14" r="2.5" stroke={c} strokeWidth="1.5" />
          <circle cx="14" cy="14" r="2.5" stroke={c} strokeWidth="1.5" />
          <path d="M7.8 12L14 4" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12.2 12L6 4" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "INVENTORY": // clipboard-list
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="4" y="3" width="12" height="14" rx="2" stroke={c} strokeWidth="1.5" />
          <path d="M7 8H13" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M7 11H13" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M7 14H10" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "SALE": // tag
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 3H10L17 10L10 17L3 10V3Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="7" cy="7" r="1.5" fill={c} />
        </svg>
      );
    case "CUSTOM": // settings
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="3" stroke={c} strokeWidth="1.5" />
          <path d="M10 2V4M10 16V18M2 10H4M16 10H18M4.9 4.9L6.3 6.3M13.7 13.7L15.1 15.1M4.9 15.1L6.3 13.7M13.7 6.3L15.1 4.9" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
  }
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
      <rect x="6" y="2" width="6" height="9" rx="3" stroke="#55BAAA" strokeWidth="1.5" />
      <path d="M3.5 8.5C3.5 11.5 6 14 9 14C12 14 14.5 11.5 14.5 8.5" stroke="#55BAAA" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 14V16.5" stroke="#55BAAA" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DragGripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <circle cx="6" cy="3" r="1.2" fill="#D4D4D0" />
      <circle cx="10" cy="3" r="1.2" fill="#D4D4D0" />
      <circle cx="6" cy="8" r="1.2" fill="#D4D4D0" />
      <circle cx="10" cy="8" r="1.2" fill="#D4D4D0" />
      <circle cx="6" cy="13" r="1.2" fill="#D4D4D0" />
      <circle cx="10" cy="13" r="1.2" fill="#D4D4D0" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
      <rect x="2" y="4.5" width="6" height="4.5" rx="1" stroke="#55BAAA" strokeWidth="1" />
      <path d="M3.5 4.5V3C3.5 1.9 4.2 1 5 1C5.8 1 6.5 1.9 6.5 3V4.5" stroke="#55BAAA" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ── Section Label ── */
function SectionLabel({ text }: { text: string }) {
  return (
    <p
      className="font-['Inter'] uppercase px-1 mb-2"
      style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(14,38,70,0.35)" }}
    >
      {text}
    </p>
  );
}

/* ── Toggle Switch ── */
function Toggle({ on, onChange, locked }: { on: boolean; onChange?: () => void; locked?: boolean }) {
  return (
    <button
      type="button"
      onClick={locked ? undefined : onChange}
      className="relative shrink-0 transition-colors duration-200"
      style={{
        width: 44,
        height: 26,
        borderRadius: 13,
        backgroundColor: on ? "#55BAAA" : "#D4D4D0",
        border: "none",
        cursor: locked ? "default" : "pointer",
        padding: 0,
      }}
    >
      <span
        className="absolute top-0.5 transition-all duration-200 rounded-full bg-white"
        style={{
          width: 22,
          height: 22,
          left: on ? 20 : 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      />
    </button>
  );
}

/* ═══════════════════════════════════════════════
   PRODUCT TYPE
   ═══════════════════════════════════════════════ */
interface Product {
  name: string;
  dosage: string;
  route: string;
}

/* ═══════════════════════════════════════════════
   NEW PROJECT SCREEN
   ═══════════════════════════════════════════════ */
export function NewProjectScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  /* ── Form state ── */
  const [date, setDate] = useState(todayISO());
  const [workType, setWorkType] = useState("Pregnancy Check");
  const [group, setGroup] = useState("Spring Calvers");
  const [cattleType, setCattleType] = useState("Cow");
  const [location, setLocation] = useState("");
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Template selection ── */
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>("t1");
  const [flashingTemplate, setFlashingTemplate] = useState<string | null>(null);

  /* ── Configure Fields ── */
  const [fieldsOpen, setFieldsOpen] = useState(true);
  const [optionalFields, setOptionalFields] = useState<OptionalField[]>(
    DEFAULT_OPTIONAL_FIELDS.map((f) => ({ ...f }))
  );

  /* ── Products ── */
  const [products, setProducts] = useState<Product[]>([
    { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" },
    { name: "Ivermectin Pour-On", dosage: "1 mL / 22 lbs", route: "Topical" },
  ]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({ name: "", dosage: "", route: "" });

  /* ── Drag state ── */
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragStartY = useRef(0);
  const dragOrigIdx = useRef(0);

  /* ── Derived ── */
  const locked = LOCKED_FIELDS[workType];
  const activeCount = optionalFields.filter((f) => f.on).length + (locked?.fields.length || 0);
  const projectId = generateProjectId(date, group, workType);

  /* ── Template selection handler ── */
  const applyTemplate = useCallback((tmpl: TemplateCard) => {
    setSelectedTemplate(tmpl.id);
    setWorkType(tmpl.workType);
    setCattleType(tmpl.cattleType);
    setGroup(tmpl.group);
    setProducts(tmpl.products.map((p) => ({ ...p })));
    // Configure fields: turn on the template's fields, turn off others
    setOptionalFields(
      DEFAULT_OPTIONAL_FIELDS.map((f) => ({
        name: f.name,
        on: tmpl.fields.includes(f.name),
      }))
    );
    setErrors({});
    // Flash animation
    setFlashingTemplate(tmpl.id);
    setTimeout(() => setFlashingTemplate(null), 400);
    showToast("success", `Template applied: ${tmpl.name}`);
  }, [showToast]);

  /* ── Toggle optional field ── */
  const toggleField = (idx: number) => {
    setOptionalFields((prev) => prev.map((f, i) => (i === idx ? { ...f, on: !f.on } : f)));
  };

  /* ── Drag handlers (pointer events for mobile) ── */
  const handleDragStart = (idx: number, clientY: number) => {
    setDraggingIdx(idx);
    dragStartY.current = clientY;
    dragOrigIdx.current = idx;
  };

  const handleDragMove = (clientY: number) => {
    if (draggingIdx === null) return;
    // Figure out which slot we're over
    let closest = dragOrigIdx.current;
    let minDist = Infinity;
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const dist = Math.abs(clientY - mid);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setDropIdx(closest);
  };

  const handleDragEnd = () => {
    if (draggingIdx !== null && dropIdx !== null && draggingIdx !== dropIdx) {
      setOptionalFields((prev) => {
        const next = [...prev];
        const [item] = next.splice(draggingIdx, 1);
        next.splice(dropIdx, 0, item);
        return next;
      });
    }
    setDraggingIdx(null);
    setDropIdx(null);
  };

  /* ── Validate ── */
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!date) errs.date = "Date is required";
    if (!workType) errs.workType = "Work type is required";
    if (!group) errs.group = "Group is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    showToast("success", "Project created successfully");
    navigate("/cow-work");
  };

  const handleSaveAndWork = () => {
    if (!validate()) return;
    const pid = generateProjectId(date, group, workType);
    showToast("success", "Project created — ready to work cows");
    navigate(`/cow-work/${encodeURIComponent(pid)}`);
  };

  const addProduct = () => {
    if (!newProduct.name.trim()) return;
    setProducts((prev) => [...prev, { ...newProduct }]);
    setNewProduct({ name: "", dosage: "", route: "" });
    setShowProductForm(false);
  };

  const removeProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: 20 }} className="font-['Inter']">

      {/* ══════════════════════════════════════════
          SECTION 1: TEMPLATE CARDS
          ══════════════════════════════════════════ */}
      <SectionLabel text="Templates" />
      <div style={{ marginLeft: -20, marginRight: -20 }}>
        <div
          className="flex overflow-x-auto scrollbar-none"
          style={{ gap: 10, paddingLeft: 20, paddingRight: 20, paddingBottom: 4 }}
        >
          {TEMPLATES.map((tmpl) => {
            const isActive = selectedTemplate === tmpl.id;
            const isFlashing = flashingTemplate === tmpl.id;
            const pill = TYPE_PILL[tmpl.type];
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => applyTemplate(tmpl)}
                className="shrink-0 flex flex-col items-center text-center cursor-pointer font-['Inter'] transition-all duration-200 active:scale-[0.97]"
                style={{
                  width: 110,
                  padding: 12,
                  borderRadius: 12,
                  border: isActive ? "2px solid #0E2646" : "1px solid #D4D4D0",
                  backgroundColor: isFlashing ? "rgba(85,186,170,0.08)" : "#FFFFFF",
                  boxShadow: isActive ? "0 2px 8px rgba(14,38,70,0.10)" : "none",
                  transition: "background-color 400ms ease, border-color 200ms ease, box-shadow 200ms ease",
                }}
              >
                {/* Icon circle */}
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: pill.bg,
                  }}
                >
                  <TemplateIcon type={tmpl.type} />
                </div>
                {/* Name — 2 lines max */}
                <p
                  className="mt-1.5"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1A1A1A",
                    lineHeight: 1.3,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {tmpl.name}
                </p>
                {/* Type pill */}
                <span
                  className="mt-1 rounded-full uppercase"
                  style={{
                    padding: "2px 8px",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    backgroundColor: pill.bg,
                    color: pill.color,
                  }}
                >
                  {tmpl.type}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 2: PROJECT DETAILS
          ══════════════════════════════════════════ */}
      <div style={{ marginTop: 16 }}>
        <SectionLabel text="Project Details" />
        <div
          className="rounded-xl bg-white"
          style={{ border: "1px solid #D4D4D0", padding: 16 }}
        >
          <div className="space-y-2.5">
            <FormFieldRow
              label="Date"
              type="date"
              value={date}
              onChange={setDate}
              placeholder=""
              required
              error={errors.date}
            />
            <FormSelectRow
              label="Work Type"
              value={workType}
              onChange={(v) => {
                setWorkType(v);
                setErrors((prev) => ({ ...prev, workType: "" }));
                setSelectedTemplate(null);
              }}
              placeholder="Select type…"
              options={WORK_TYPES}
              required
              error={errors.workType}
            />
            <FormSelectRow
              label="Group"
              value={group}
              onChange={(v) => {
                setGroup(v);
                setErrors((prev) => ({ ...prev, group: "" }));
              }}
              placeholder="Select group…"
              options={GROUPS}
              required
              error={errors.group}
            />
            <FormSelectRow
              label="Cattle Type"
              value={cattleType}
              onChange={setCattleType}
              placeholder="Select…"
              options={CATTLE_TYPES}
            />
            <FormSelectRow
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder="Select location…"
              options={LOCATIONS}
            />
            {/* Memo textarea */}
            <div className="flex items-start gap-3">
              <label
                className="shrink-0 text-[#1A1A1A] font-['Inter']"
                style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
              >
                Memo
              </label>
              <div className="flex-1 min-w-0 relative">
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="Notes about this project…"
                  rows={3}
                  className="w-full px-3 py-2.5 pr-10 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 resize-none"
                  style={{ fontSize: 16, fontWeight: 400, minHeight: 80 }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 cursor-pointer"
                  style={{ background: "none", border: "none", padding: 0 }}
                  aria-label="Voice input"
                >
                  <MicIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Project ID row */}
        <div className="flex items-center gap-3 mt-2 px-1">
          <span
            className="font-['Inter'] uppercase shrink-0"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(26,26,26,0.35)" }}
          >
            Project ID
          </span>
          <div
            className="flex-1 rounded-lg"
            style={{ padding: "8px 12px", backgroundColor: "rgba(14,38,70,0.04)" }}
          >
            <p className="font-['Inter']" style={{ fontSize: 13, fontWeight: 500, color: "#0E2646" }}>
              {projectId}
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 3: CONFIGURE FIELDS
          ══════════════════════════════════════════ */}
      <div style={{ marginTop: 16 }}>
        {/* Custom collapsible header (not using CollapsibleSection because we need custom inner card layout) */}
        <button
          type="button"
          onClick={() => setFieldsOpen((v) => !v)}
          className="w-full flex items-center justify-between rounded-xl bg-white px-4 py-3 cursor-pointer transition-colors active:bg-[#F5F5F0]"
          style={{
            border: "1px solid rgba(212,212,208,0.60)",
            borderBottomLeftRadius: fieldsOpen ? 0 : 12,
            borderBottomRightRadius: fieldsOpen ? 0 : 12,
            borderBottom: fieldsOpen ? "none" : "1px solid rgba(212,212,208,0.60)",
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>
              Configure Fields
            </span>
            <span
              className="rounded-full"
              style={{
                minWidth: 28,
                height: 20,
                padding: "0 6px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(85,186,170,0.12)",
                fontSize: 11,
                fontWeight: 700,
                color: "#55BAAA",
              }}
            >
              {activeCount} active
            </span>
          </div>
          <svg
            width="18" height="18" viewBox="0 0 18 18" fill="none"
            className="transition-transform duration-200 shrink-0"
            style={{ transform: fieldsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity={0.4} />
          </svg>
        </button>

        {/* Collapsed pills */}
        {!fieldsOpen && (
          <div
            className="rounded-b-xl bg-white px-4 pb-3 pt-1"
            style={{ border: "1px solid rgba(212,212,208,0.60)", borderTop: "1px solid rgba(212,212,208,0.30)" }}
          >
            <div className="flex flex-wrap gap-1.5">
              {/* Locked fields first */}
              {locked?.fields.map((f) => (
                <span
                  key={f}
                  className="rounded-full"
                  style={{
                    padding: "2px 8px",
                    fontSize: 10,
                    fontWeight: 600,
                    backgroundColor: "rgba(85,186,170,0.10)",
                    color: "#55BAAA",
                  }}
                >
                  {f}
                </span>
              ))}
              {/* Active optional fields in order */}
              {optionalFields.filter((f) => f.on).map((f) => (
                <span
                  key={f.name}
                  className="rounded-full"
                  style={{
                    padding: "2px 8px",
                    fontSize: 10,
                    fontWeight: 600,
                    backgroundColor: "rgba(14,38,70,0.06)",
                    color: "#0E2646",
                  }}
                >
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expanded card */}
        {fieldsOpen && (
          <div
            className="rounded-b-xl bg-white overflow-hidden"
            style={{ border: "1px solid rgba(212,212,208,0.60)", borderTop: "none" }}
          >
            {/* ── Locked work-type fields ── */}
            {locked && (
              <>
                <div
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "rgba(85,186,170,0.05)",
                    borderBottom: "1px solid rgba(212,212,208,0.30)",
                  }}
                >
                  <p
                    className="font-['Inter'] uppercase"
                    style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#55BAAA" }}
                  >
                    {locked.label}
                  </p>
                </div>
                {locked.fields.map((f) => (
                  <div
                    key={f}
                    className="flex items-center justify-between"
                    style={{ padding: "12px 16px", borderBottom: "1px solid rgba(212,212,208,0.30)" }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>
                      {f}
                    </span>
                    <div className="flex items-center gap-2">
                      <LockIcon />
                      <Toggle on locked />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ── Optional fields sub-header ── */}
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid rgba(212,212,208,0.30)",
              }}
            >
              <p
                className="font-['Inter'] uppercase"
                style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(14,38,70,0.35)" }}
              >
                Optional Fields
              </p>
            </div>

            {/* ── Optional field rows (draggable) ── */}
            {optionalFields.map((field, idx) => {
              const isDragging = draggingIdx === idx;
              const showInsertBefore = dropIdx === idx && draggingIdx !== null && dropIdx < draggingIdx;
              const showInsertAfter = dropIdx === idx && draggingIdx !== null && dropIdx > draggingIdx;

              return (
                <div key={field.name}>
                  {showInsertBefore && (
                    <div style={{ height: 2, backgroundColor: "#F3D12A", margin: "0 16px" }} />
                  )}
                  <div
                    ref={(el) => { rowRefs.current[idx] = el; }}
                    className="flex items-center justify-between"
                    style={{
                      padding: "12px 16px",
                      borderBottom: idx < optionalFields.length - 1 ? "1px solid rgba(212,212,208,0.30)" : "none",
                      opacity: field.on ? 1 : 0.5,
                      backgroundColor: isDragging ? "#FFFFFF" : "transparent",
                      boxShadow: isDragging ? "0 4px 16px rgba(0,0,0,0.12)" : "none",
                      position: "relative",
                      zIndex: isDragging ? 10 : 1,
                      transition: isDragging ? "none" : "opacity 200ms ease",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Drag handle */}
                      <div
                        className="cursor-grab active:cursor-grabbing touch-none"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          (e.target as HTMLElement).setPointerCapture(e.pointerId);
                          handleDragStart(idx, e.clientY);
                        }}
                        onPointerMove={(e) => handleDragMove(e.clientY)}
                        onPointerUp={() => handleDragEnd()}
                        onPointerCancel={() => handleDragEnd()}
                      >
                        <DragGripIcon />
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#1A1A1A",
                          textDecoration: field.on ? "none" : "line-through",
                        }}
                      >
                        {field.name}
                      </span>
                    </div>
                    <Toggle on={field.on} onChange={() => toggleField(idx)} />
                  </div>
                  {showInsertAfter && (
                    <div style={{ height: 2, backgroundColor: "#F3D12A", margin: "0 16px" }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          SECTION 4: PRODUCTS GIVEN
          ══════════════════════════════════════════ */}
      <div style={{ marginTop: 16 }}>
        <CollapsibleSection
          title={`Products Given (${products.length})`}
          collapsedContent={
            products.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {products.map((p) => (
                  <span
                    key={p.name}
                    className="rounded-full font-['Inter']"
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      backgroundColor: "rgba(85,186,170,0.12)",
                      color: "#55BAAA",
                    }}
                  >
                    {p.name} &middot; {p.route}
                  </span>
                ))}
              </div>
            ) : undefined
          }
        >
          <div className="space-y-3 pt-2">
            {/* Add Product button */}
            {!showProductForm && (
              <button
                type="button"
                onClick={() => setShowProductForm(true)}
                className="cursor-pointer font-['Inter'] transition-colors"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#55BAAA",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                + Add Product
              </button>
            )}

            {/* Inline add product form */}
            {showProductForm && (
              <div
                className="rounded-xl border border-[#D4D4D0] p-3 space-y-2.5"
                style={{ backgroundColor: "#FAFAF8" }}
              >
                <input
                  type="text"
                  placeholder="Search products…"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                  className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
                  style={{ fontSize: 16, fontWeight: 400 }}
                />
                <input
                  type="text"
                  placeholder="e.g. 2 mL"
                  value={newProduct.dosage}
                  onChange={(e) => setNewProduct((p) => ({ ...p, dosage: e.target.value }))}
                  className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
                  style={{ fontSize: 16, fontWeight: 400 }}
                />
                <div className="relative">
                  <select
                    value={newProduct.route}
                    onChange={(e) => setNewProduct((p) => ({ ...p, route: e.target.value }))}
                    className="w-full h-[40px] px-3 pr-8 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] outline-none transition-all appearance-none cursor-pointer focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
                    style={{ fontSize: 16, fontWeight: 400, color: newProduct.route ? "#1A1A1A" : "rgba(26,26,26,0.30)" }}
                  >
                    <option value="" disabled>Route…</option>
                    {ROUTE_OPTIONS.map((r) => (
                      <option key={r} value={r} style={{ color: "#1A1A1A" }}>{r}</option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <PillButton size="sm" onClick={addProduct}>Add</PillButton>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductForm(false);
                      setNewProduct({ name: "", dosage: "", route: "" });
                    }}
                    className="cursor-pointer font-['Inter']"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "rgba(26,26,26,0.40)",
                      background: "none",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Product cards */}
            {products.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="rounded-xl px-4 py-3 font-['Inter']"
                style={{ backgroundColor: "#0E2646" }}
              >
                <div className="flex items-center justify-between gap-2">
                  <p
                    className="text-[#F0F0F0] truncate"
                    style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}
                  >
                    {p.name}
                  </p>
                  <span
                    className="shrink-0 rounded-full uppercase"
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      padding: "2px 8px",
                      backgroundColor: "rgba(85,186,170,0.15)",
                      color: "#55BAAA",
                    }}
                  >
                    {p.route}
                  </span>
                </div>
                <p className="mt-0.5" style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.45)" }}>
                  {p.dosage}
                </p>
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => removeProduct(i)}
                    className="cursor-pointer font-['Inter']"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#E74C3C",
                      background: "none",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 5: ACTION BUTTONS
          ══════════════════════════════════════════ */}
      <div style={{ marginTop: 24 }} className="space-y-3">
        <div className="flex gap-3">
          {/* Save — outline style per spec */}
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 font-['Inter'] rounded-full cursor-pointer transition-all active:scale-[0.97]"
            style={{
              height: 48,
              fontSize: 15,
              fontWeight: 700,
              color: "#0E2646",
              backgroundColor: "white",
              border: "1.5px solid #D4D4D0",
            }}
          >
            Save
          </button>
          {/* Save & Work Cows — yellow */}
          <button
            type="button"
            onClick={handleSaveAndWork}
            className="flex-1 font-['Inter'] rounded-full cursor-pointer transition-all active:scale-[0.97]"
            style={{
              height: 48,
              fontSize: 15,
              fontWeight: 700,
              color: "#1A1A1A",
              backgroundColor: "#F3D12A",
              border: "none",
            }}
          >
            Save &amp; Work Cows
          </button>
        </div>

        {/* Cancel link */}
        <button
          type="button"
          onClick={() => navigate("/cow-work")}
          className="w-full cursor-pointer font-['Inter'] transition-colors"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(26,26,26,0.35)",
            background: "none",
            border: "none",
            padding: "4px 0",
            textAlign: "center",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
