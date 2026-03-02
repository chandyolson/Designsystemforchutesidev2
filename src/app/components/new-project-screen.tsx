import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { CollapsibleSection } from "./collapsible-section";
import { PillButton } from "./pill-button";
import { useToast } from "./toast-context";

/* ── Template card types ── */
type ProjectTemplateType = "preg" | "bse" | "ai" | "processing" | "weaning" | "custom" | "inventory";

interface TemplateCard {
  id: ProjectTemplateType;
  title: string;
  subtitle: string;
}

const TEMPLATE_CARDS: TemplateCard[] = [
  { id: "preg", title: "Preg Check", subtitle: "Pregnancy testing" },
  { id: "bse", title: "Bull BSE", subtitle: "Breeding soundness" },
  { id: "ai", title: "AI", subtitle: "Artificial insem." },
  { id: "processing", title: "Processing", subtitle: "Vaccinate & treat" },
  { id: "weaning", title: "Weaning", subtitle: "Separate & weigh" },
  { id: "custom", title: "Custom", subtitle: "Build your own" },
  { id: "inventory", title: "Inventory", subtitle: "Head count & verify" },
];

/* Template-type → processing type mapping */
const TEMPLATE_TO_PROCESSING: Record<string, string> = {
  preg: "Pregnancy Check",
  bse: "Bull Testing (BSE)",
  ai: "Breeding / Bull Turnout",
  processing: "Processing",
  weaning: "Working",
  custom: "",
};

/* ── Template card icons ── */
function TemplateIcon({ type }: { type: ProjectTemplateType }) {
  const color = "#55BAAA";
  switch (type) {
    case "preg":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
        </svg>
      );
    case "bse":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 4C8.5 4 6 6.5 6 9C6 11 7 12.5 8 13.5V17C8 17.5 8.5 18 9 18H15C15.5 18 16 17.5 16 17V13.5C17 12.5 18 11 18 9C18 6.5 15.5 4 12 4Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M4 7C4 7 5 5 6 5M20 7C20 7 19 5 18 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M9 18V20M15 18V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "ai":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 3V14M12 14L8 10M12 14L16 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 17L5 19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "processing":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
          <path d="M12 1V4M12 20V23M4.22 4.22L6.34 6.34M17.66 17.66L19.78 19.78M1 12H4M20 12H23M4.22 19.78L6.34 17.66M17.66 6.34L19.78 4.22" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "weaning":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 3L20 7V11C20 16 16.5 20.5 12 21.5C7.5 20.5 4 16 4 11V7L12 3Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "custom":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94L14.7 6.3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "inventory":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="2" />
          <path d="M9 7H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 17H13" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

/* ── Option lists ── */
const processingTypes = [
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

const groups = [
  "Spring Calvers",
  "Fall Calvers",
  "Heifers — 1st Calf",
  "Bulls",
  "Replacement Heifers",
  "2026 Cows",
  "Old Cows",
];

const cattleTypes = ["Cow", "Bull", "Replacement", "Calf", "Steer", "Mixed"];

const locations = [
  "Working Facility",
  "North Pasture",
  "South Pasture",
  "Hoffman's",
  "Oelrichs",
  "Home Place",
];

const routeOptions = ["IM", "SQ", "IV", "Topical", "Oral", "Intravaginal", "Pour-On"];

/* ── Product type ── */
interface Product {
  name: string;
  dosage: string;
  route: string;
}

/* ── Mock templates ── */
const templates = [
  { name: "Spring Preg Check", type: "PREG", cattleType: "Cow", fields: 4 },
  { name: "Fall Processing", type: "PROCESS", cattleType: "Mixed", fields: 6 },
  { name: "Bull BSE", type: "BSE", cattleType: "Bull", fields: 5 },
];

/* Map template type → processing type */
const templateTypeMap: Record<string, string> = {
  PREG: "Pregnancy Check",
  PROCESS: "Processing",
  BSE: "Bull Testing (BSE)",
};

/* Map template type → pill display */
const typePillColors: Record<string, { bg: string; color: string }> = {
  PREG: { bg: "rgba(85,186,170,0.12)", color: "#55BAAA" },
  PROCESS: { bg: "rgba(14,38,70,0.08)", color: "#0E2646" },
  BSE: { bg: "rgba(212,160,23,0.12)", color: "#B8960F" },
};

/* ── Helpers ── */
function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function generateProjectId(date: string, group: string, type: string): string {
  if (!date) return "—";
  const d = new Date(date + "T00:00:00");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(d.getDate()).padStart(2, "0");
  const mon = months[d.getMonth()] || "???";
  const year = d.getFullYear();
  const groupAbbr = group ? group.replace(/\s+/g, "") : "NoGroup";
  const typeAbbr = type
    ? type
        .split(/[\s/()]+/)
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "NEW";
  return `${day}${mon}${year}-${groupAbbr}-${typeAbbr}`;
}

/* ═══════════════════════════════════════════════
   NEW PROJECT SCREEN
   ═══════════════════════════════════════════════ */
export function NewProjectScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  /* ── Form state ── */
  const [date, setDate] = useState(todayISO());
  const [processingType, setProcessingType] = useState("");
  const [group, setGroup] = useState("");
  const [cattleType, setCattleType] = useState("");
  const [location, setLocation] = useState("");
  const [memo, setMemo] = useState("");
  const [projectName, setProjectName] = useState("");

  /* ── Template card selection ── */
  const [selectedCard, setSelectedCard] = useState<ProjectTemplateType | null>(null);
  const isInventory = selectedCard === "inventory";

  /* ── Validation errors ── */
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Products ── */
  const [products, setProducts] = useState<Product[]>([
    { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" },
    { name: "Ivermectin Pour-On", dosage: "1 mL / 22 lbs", route: "Topical" },
  ]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({ name: "", dosage: "", route: "" });

  /* ── Template selection ── */
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const templateFlashRef = useRef<Record<string, boolean>>({});
  const [, forceUpdate] = useState(0);

  /* ── Validate ── */
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!date) errs.date = "Date is required";
    if (!isInventory && !processingType) errs.processingType = "Processing type is required";
    if (!group) errs.group = "Group is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Template card selection handler ── */
  const handleCardSelect = (cardId: ProjectTemplateType) => {
    const wasSelected = selectedCard === cardId;
    setSelectedCard(wasSelected ? null : cardId);

    if (!wasSelected) {
      // Auto-fill processing type for non-inventory cards
      if (cardId !== "inventory") {
        const mapped = TEMPLATE_TO_PROCESSING[cardId];
        if (mapped) setProcessingType(mapped);
      } else {
        // Inventory: auto-fill project name, clear processing type
        setProcessingType("");
        setCattleType("");
        if (!projectName && group) {
          setProjectName(`Inventory - ${group}`);
        } else if (!projectName) {
          setProjectName("Inventory - ");
        }
      }
      setErrors({});
    }
  };

  /* ── Save handlers ── */
  const handleSave = () => {
    if (!validate()) return;
    showToast("success", "Project created successfully");
    navigate("/cow-work");
  };

  const handleSaveAndWork = () => {
    if (!validate()) return;
    const projectId = generateProjectId(date, group, processingType);
    showToast("success", "Project created — ready to work cows");
    navigate(`/cow-work/${encodeURIComponent(projectId)}`);
  };

  /* ── Add product ── */
  const addProduct = () => {
    if (!newProduct.name.trim()) return;
    setProducts((prev) => [...prev, { ...newProduct }]);
    setNewProduct({ name: "", dosage: "", route: "" });
    setShowProductForm(false);
  };

  const removeProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  /* ── Apply template ── */
  const applyTemplate = (tmpl: typeof templates[number]) => {
    setProcessingType(templateTypeMap[tmpl.type] || "");
    setCattleType(tmpl.cattleType);
    setGroup(tmpl.name.includes("Spring") ? "Spring Calvers" : tmpl.name.includes("Fall") ? "Fall Calvers" : "Bulls");
    setSelectedTemplate(tmpl.name);
    // Flash effect
    templateFlashRef.current[tmpl.name] = true;
    forceUpdate((n) => n + 1);
    setTimeout(() => {
      templateFlashRef.current[tmpl.name] = false;
      forceUpdate((n) => n + 1);
    }, 600);
    // Clear errors for fields that just got filled
    setErrors({});
  };

  const projectId = generateProjectId(date, group, isInventory ? "Inventory" : processingType);

  /* ── Mic icon for notes textarea ── */
  const MicIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
      <rect x="6" y="2" width="6" height="9" rx="3" stroke="#55BAAA" strokeWidth="1.5" />
      <path d="M3.5 8.5C3.5 11.5 6 14 9 14C12 14 14.5 11.5 14.5 8.5" stroke="#55BAAA" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 14V16.5" stroke="#55BAAA" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="space-y-5">
      {/* ══ TEMPLATE CARD ROW ══ */}
      <div className="-mx-5">
        <div
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-none"
          style={{ paddingLeft: 20, paddingRight: 20 }}
        >
          {TEMPLATE_CARDS.map((card) => {
            const isActive = selectedCard === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardSelect(card.id)}
                className="shrink-0 flex flex-col items-center text-center cursor-pointer font-['Inter'] transition-all duration-200"
                style={{
                  width: 120,
                  padding: 16,
                  borderRadius: 12,
                  border: isActive ? "2px solid #0E2646" : "1px solid #D4D4D0",
                  backgroundColor: "#FFFFFF",
                  boxShadow: isActive ? "0 2px 8px rgba(14,38,70,0.12)" : "none",
                }}
              >
                {/* Icon circle */}
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "rgba(85,186,170,0.10)",
                  }}
                >
                  <TemplateIcon type={card.id} />
                </div>
                {/* Title */}
                <p
                  className="mt-2"
                  style={{ fontSize: 13, fontWeight: 700, color: "#0E2646", lineHeight: 1.3 }}
                >
                  {card.title}
                </p>
                {/* Subtitle */}
                <p
                  className="mt-0.5"
                  style={{ fontSize: 11, fontWeight: 400, color: "rgba(26,26,26,0.35)", lineHeight: 1.3 }}
                >
                  {card.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ FORM FIELDS ══ */}
      {isInventory ? (
        /* ── INVENTORY FORM (stripped down) ── */
        <div className="space-y-2.5">
          {/* Project Name */}
          <FormFieldRow
            label="Project Name"
            value={projectName}
            onChange={(v) => setProjectName(v)}
            placeholder="Inventory - [Group Name]"
          />

          {/* Group (required) */}
          <FormSelectRow
            label="Group"
            value={group}
            onChange={(v) => {
              setGroup(v);
              setErrors((prev) => ({ ...prev, group: "" }));
              // Auto-update project name if it's still default pattern
              if (!projectName || projectName.startsWith("Inventory - ")) {
                setProjectName(`Inventory - ${v}`);
              }
            }}
            placeholder="Select group…"
            options={groups}
            required
            error={errors.group}
          />

          {/* Location */}
          <FormSelectRow
            label="Location"
            value={location}
            onChange={setLocation}
            placeholder="Select location…"
            options={locations}
          />

          {/* Date */}
          <FormFieldRow
            label="Date"
            type="date"
            value={date}
            onChange={setDate}
            placeholder=""
            required
            error={errors.date}
          />

          {/* Notes with inline mic */}
          <div className="flex items-start gap-3">
            <label
              className="shrink-0 text-[#1A1A1A] font-['Inter']"
              style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
            >
              Notes
            </label>
            <div className="flex-1 min-w-0 relative">
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Notes about this inventory…"
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
      ) : (
        /* ── STANDARD FORM ── */
        <div className="space-y-2.5">
          {/* Date */}
          <FormFieldRow
            label="Date"
            type="date"
            value={date}
            onChange={setDate}
            placeholder=""
            required
            error={errors.date}
          />

          {/* Processing Type */}
          <FormSelectRow
            label="Type"
            value={processingType}
            onChange={(v) => {
              setProcessingType(v);
              setErrors((prev) => ({ ...prev, processingType: "" }));
            }}
            placeholder="Select type…"
            options={processingTypes}
            required
            error={errors.processingType}
          />

          {/* Group */}
          <FormSelectRow
            label="Group"
            value={group}
            onChange={(v) => {
              setGroup(v);
              setErrors((prev) => ({ ...prev, group: "" }));
            }}
            placeholder="Select group…"
            options={groups}
            required
            error={errors.group}
          />

          {/* Cattle Type */}
          <FormSelectRow
            label="Cattle Type"
            value={cattleType}
            onChange={setCattleType}
            placeholder="Select…"
            options={cattleTypes}
          />

          {/* Location */}
          <FormSelectRow
            label="Location"
            value={location}
            onChange={setLocation}
            placeholder="Select location…"
            options={locations}
          />

          {/* Memo (textarea with label-left) */}
          <div className="flex items-start gap-3">
            <label
              className="shrink-0 text-[#1A1A1A] font-['Inter']"
              style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
            >
              Memo
            </label>
            <div className="flex-1 min-w-0">
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Notes about this project…"
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 resize-none"
                style={{ fontSize: 16, fontWeight: 400, minHeight: 80 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ══ SECTION 2: PRODUCTS GIVEN (not shown for Inventory) ══ */}
      {!isInventory && (
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
                    {p.name} · {p.route}
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
                    {routeOptions.map((r) => (
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
                  <PillButton size="sm" onClick={addProduct}>
                    Add
                  </PillButton>
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
                {/* Row 1: name + route pill */}
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
                {/* Row 2: dosage */}
                <p
                  className="mt-0.5"
                  style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.45)" }}
                >
                  {p.dosage}
                </p>
                {/* Row 3: remove */}
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
      )}

      {/* ══ SECTION 3: TEMPLATE PICKER (not shown for Inventory) ══ */}
      {!isInventory && (
        <CollapsibleSection title="Load from Template">
          <div className="space-y-2 pt-2">
            {templates.map((tmpl) => {
              const isFlashing = templateFlashRef.current[tmpl.name];
              const isSelected = selectedTemplate === tmpl.name;
              const pill = typePillColors[tmpl.type] || { bg: "rgba(14,38,70,0.08)", color: "#0E2646" };
              return (
                <button
                  key={tmpl.name}
                  type="button"
                  onClick={() => applyTemplate(tmpl)}
                  className="w-full text-left rounded-xl border px-4 py-3 cursor-pointer font-['Inter'] transition-all duration-300"
                  style={{
                    backgroundColor: isFlashing ? "rgba(85,186,170,0.08)" : "#FFFFFF",
                    borderColor: isSelected ? "#55BAAA" : "#D4D4D0",
                    boxShadow: isFlashing ? "inset 0 0 0 1.5px #55BAAA" : "none",
                  }}
                >
                  {/* Row 1: name + type pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
                      {tmpl.name}
                    </span>
                    <span
                      className="shrink-0 rounded-full uppercase"
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        padding: "2px 8px",
                        backgroundColor: pill.bg,
                        color: pill.color,
                      }}
                    >
                      {tmpl.type}
                    </span>
                  </div>
                  {/* Row 2: details */}
                  <p
                    className="mt-0.5"
                    style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.45)" }}
                  >
                    Cattle Type: {tmpl.cattleType} · {tmpl.fields} fields configured
                  </p>
                </button>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* ══ PROJECT RECORD ID ══ */}
      <div>
        <p
          className="font-['Inter'] uppercase mb-1.5"
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "rgba(26,26,26,0.35)",
          }}
        >
          Project ID
        </p>
        <div
          className="rounded-lg px-3 py-2"
          style={{ backgroundColor: "rgba(14,38,70,0.04)" }}
        >
          <p
            className="font-['Geist_Mono',ui-monospace,monospace]"
            style={{ fontSize: 13, fontWeight: 500, color: "#0E2646" }}
          >
            {projectId}
          </p>
        </div>
      </div>

      {/* ══ ACTION BUTTONS ══ */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-3">
          <PillButton variant="outline" size="md" onClick={handleSave} style={{ flex: 1 }}>
            Save
          </PillButton>
          <PillButton size="md" onClick={handleSaveAndWork} style={{ flex: 1 }}>
            Save & Work Cows
          </PillButton>
        </div>
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