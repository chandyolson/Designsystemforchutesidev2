import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { CollapsibleSection } from "./collapsible-section";
import { PillButton } from "./pill-button";
import { useToast } from "./toast-context";

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
    if (!processingType) errs.processingType = "Processing type is required";
    if (!group) errs.group = "Group is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
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

  const projectId = generateProjectId(date, group, processingType);

  return (
    <div className="space-y-5">
      {/* ══ SECTION 1: PROJECT DETAILS ══ */}
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

      {/* ══ SECTION 2: PRODUCTS GIVEN ══ */}
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

      {/* ══ SECTION 3: TEMPLATE PICKER ══ */}
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
