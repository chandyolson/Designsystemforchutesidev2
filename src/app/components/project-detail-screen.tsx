import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { CollapsibleSection } from "./collapsible-section";
import { PillButton } from "./pill-button";
import { FlagIcon } from "./flag-icon";
import { FloatingMicButton } from "./floating-mic-button";
import { CowHistoryPanel, mockAnimals, alreadyProcessedTags } from "./cow-history-panel";
import { useToast } from "./toast-context";
import {
  CalvingQuickNotes,
  getActiveFlagColor,
  CALVING_QUICK_NOTES,
  type NoteFlag,
} from "./calving-quick-notes";

/* ═══════════════════════════════════════════════
   PROJECT FIELD CONFIGURATION
   ═══════════════════════════════════════════════ */

/** Locked fields per work type — always ON, rendered first under teal sub-header */
interface LockedFieldConfig {
  label: string; // sub-header text
  fields: LockedField[];
}

interface LockedField {
  key: string;
  label: string;
  type: "select" | "number" | "text";
  options?: string[];
  placeholder?: string;
  defaultValue?: string;
  /** For BSE Pass/Fail color coding */
  colorFn?: (val: string) => string | undefined;
}

const LOCKED_CONFIGS: Record<string, LockedFieldConfig> = {
  "Pregnancy Check": {
    label: "PREGNANCY CHECK FIELDS",
    fields: [
      {
        key: "pregStage",
        label: "Preg Stage",
        type: "select",
        options: ["Open", "AI", "Bred", "Late", "Short", "Medium", "Long"],
        defaultValue: "Bred",
      },
      {
        key: "daysGest",
        label: "Days of Gestation",
        type: "number",
        placeholder: "days",
        defaultValue: "142",
      },
      {
        key: "fetalSex",
        label: "Fetal Sex",
        type: "select",
        options: ["Bull", "Heifer", "Twin - BB", "Twin - HH", "Twin - BH", "Unknown"],
        defaultValue: "Bull",
      },
    ],
  },
  "Breeding / Bull Turnout": {
    label: "BREEDING FIELDS",
    fields: [
      { key: "technician", label: "Technician", type: "text", placeholder: "Name" },
      { key: "breedingSire", label: "Breeding Sire", type: "text", placeholder: "Bull tag or name" },
      { key: "estrusStatus", label: "Estrus Status", type: "select", options: ["Standing", "Not Standing", "Unknown"] },
      { key: "breedingType", label: "Breeding Type", type: "select", options: ["Natural", "AI", "ET"] },
    ],
  },
  "Breeding Soundness Exam": {
    label: "BREEDING SOUNDNESS EXAM FIELDS",
    fields: [
      { key: "scrotal", label: "Scrotal", type: "number", placeholder: "cm" },
      {
        key: "passFail",
        label: "Pass/Fail",
        type: "select",
        options: ["Pass", "Fail", "Defer"],
        defaultValue: "Pass",
        colorFn: (v) => v === "Pass" ? "#55BAAA" : v === "Fail" ? "#E74C3C" : v === "Defer" ? "#F3D12A" : undefined,
      },
      { key: "motility", label: "Motility", type: "number", placeholder: "%" },
      { key: "morphology", label: "Morphology", type: "number", placeholder: "%" },
      { key: "semenDefects", label: "Semen Defects", type: "text", placeholder: "Describe defects if any" },
      { key: "physicalDefects", label: "Physical Defects", type: "text", placeholder: "Describe defects if any" },
    ],
  },
};

/** Optional "All" fields that can be toggled on/off and reordered */
type OptionalFieldKey = "weight" | "quickNotes" | "notes" | "dna" | "tagColor" | "lot" | "sample" | "pen" | "data1" | "data2" | "traits";

interface ProjectConfig {
  workType: string;
  optionalFields: OptionalFieldKey[]; // ordered list of enabled optional fields
}

/* Mock project configs */
const PREG_CONFIG: ProjectConfig = {
  workType: "Pregnancy Check",
  optionalFields: ["weight", "quickNotes", "notes", "dna", "tagColor"],
};

const BSE_CONFIG: ProjectConfig = {
  workType: "Breeding Soundness Exam",
  optionalFields: ["weight", "quickNotes", "notes"],
};

/* Use preg config for the primary mock */
const PROJECT_CONFIG = PREG_CONFIG;

/* ── Tag Color options ── */
const TAG_COLORS = ["Pink", "Yellow", "Green", "Orange", "Blue", "White", "Red", "Purple"];

/* ── Flag label map ── */
const FLAG_LABEL_MAP: Record<string, string> = {
  cull: "Cull",
  production: "Production",
  management: "Management",
};

/* ── Mock worked animals ── */
const workedAnimals = [
  { tag: "4782", weight: "1,247", notes: "Normal", flag: "teal" as const },
  { tag: "3091", weight: "983", notes: "Follow-up Thurs", flag: "gold" as const },
  { tag: "5520", weight: "1,102", notes: "Treatment administered", flag: "red" as const },
  { tag: "2218", weight: "1,340", notes: "Normal", flag: "teal" as const },
  { tag: "8812", weight: "1,156", notes: "Normal", flag: "teal" as const },
];

/* ── Mock products for the project ── */
const projectProducts = [
  { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM", inventory: "38 doses" },
  { name: "Ivermectin Pour-On", dosage: "1 mL / 22 lbs", route: "Topical", inventory: "1.2 L" },
  { name: "Multimin 90", dosage: "1 mL / 100 lbs", route: "SQ", inventory: "500 mL" },
  { name: "CIDR Insert", dosage: "1 unit", route: "Intravaginal", inventory: "42 units" },
  { name: "GnRH (Cystorelin)", dosage: "2 mL", route: "IM", inventory: "25 mL" },
];

/* ── Lock icon (10px, teal at 30%) ── */
function LockIconSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
      <rect x="2" y="4.5" width="6" height="4.5" rx="1" stroke="#55BAAA" strokeOpacity="0.3" strokeWidth="1" />
      <path d="M3.5 4.5V3C3.5 1.9 4.2 1 5 1C5.8 1 6.5 1.9 6.5 3V4.5" stroke="#55BAAA" strokeOpacity="0.3" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ── Mic icon ── */
function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
      <rect x="6" y="2" width="6" height="9" rx="3" stroke="#55BAAA" strokeWidth="1.5" />
      <path d="M3.5 8.5C3.5 11.5 6 14 9 14C12 14 14.5 11.5 14.5 8.5" stroke="#55BAAA" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 14V16.5" stroke="#55BAAA" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   Quick Notes pills for inline rendering
   ═══════════════════════════════════════════════ */
const PILL_COLORS: Record<string, { bg: string; bgSel: string; border: string; borderSel: string; color: string }> = {
  cull:       { bg: "rgba(155,35,53,0.12)", bgSel: "rgba(155,35,53,0.20)", border: "rgba(155,35,53,0.25)", borderSel: "#9B2335", color: "#9B2335" },
  production: { bg: "rgba(243,209,42,0.12)", bgSel: "rgba(243,209,42,0.22)", border: "rgba(243,209,42,0.30)", borderSel: "#B8860B", color: "#B8860B" },
  management: { bg: "rgba(85,186,170,0.12)", bgSel: "rgba(85,186,170,0.20)", border: "rgba(85,186,170,0.25)", borderSel: "#55BAAA", color: "#55BAAA" },
  none:       { bg: "#F5F5F0", bgSel: "rgba(26,26,26,0.08)", border: "#D4D4D0", borderSel: "rgba(26,26,26,0.40)", color: "rgba(26,26,26,0.55)" },
};

/* Cow-work quick notes: all except "Twin" (calving-only) */
const COWWORK_QUICK_NOTES = CALVING_QUICK_NOTES.filter((n) => n.text !== "Twin");

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
      <path d="M2 5.5L4 7.5L8 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   PROJECT DETAIL SCREEN
   ═══════════════════════════════════════════════ */
export function ProjectDetailScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"input" | "animals" | "stats" | "details">("input");
  const tagInputRef = useRef<HTMLInputElement>(null);

  /* ── Input tab state ── */
  const [tag, setTag] = useState("4782");
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>(["qn4"]); // "Lame" pre-selected
  const [activeFlag, setActiveFlag] = useState<NoteFlag>("production");

  /* Quick Notes collapsible state */
  const [quickNotesOpen, setQuickNotesOpen] = useState(false);

  /* Dynamic field values stored in a map */
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    // Pre-fill defaults from locked config + optional defaults
    const defaults: Record<string, string> = {};
    const lockedConfig = LOCKED_CONFIGS[PROJECT_CONFIG.workType];
    if (lockedConfig) {
      for (const f of lockedConfig.fields) {
        if (f.defaultValue) defaults[f.key] = f.defaultValue;
      }
    }
    // Pre-fill optional field defaults for mock
    defaults.weight = "1,247";
    defaults.tagColor = "";
    defaults.dna = "";
    defaults.notes = "";
    defaults.lot = "";
    defaults.sample = "";
    defaults.pen = "";
    defaults.data1 = "";
    defaults.data2 = "";
    defaults.traits = "";
    return defaults;
  });

  const setFieldValue = (key: string, val: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: val }));
  };

  /* ── Summary card collapsible state ── */
  const [summaryCardOpen, setSummaryCardOpen] = useState(false);

  /* ── Derive matched animal ── */
  const trimmedTag = tag.trim();
  const matchedAnimal = trimmedTag ? mockAnimals[trimmedTag] ?? null : null;
  const isDuplicate = trimmedTag ? alreadyProcessedTags.includes(trimmedTag) : false;

  /* Focus tag input on tab switch */
  useEffect(() => {
    if (activeTab === "input") {
      // Don't auto-focus on initial load with pre-filled data
    }
  }, [activeTab]);

  /* ── Clear form ── */
  const clearForm = () => {
    setTag("");
    setSelectedNoteIds([]);
    setActiveFlag("production");
    setFieldValues((prev) => {
      const next: Record<string, string> = {};
      for (const k of Object.keys(prev)) next[k] = "";
      return next;
    });
    setTimeout(() => tagInputRef.current?.focus(), 50);
  };

  /* ── Save & Next ── */
  const handleSaveNext = () => {
    if (!trimmedTag) return;
    try { navigator.vibrate?.(50); } catch {}
    showToast("success", `${trimmedTag} saved`);
    clearForm();
  };

  /* ── Save & Done ── */
  const handleSaveDone = () => {
    if (trimmedTag) showToast("success", `${trimmedTag} saved`);
    navigate("/cow-work");
  };

  const tabs = ["input", "animals", "stats", "details"] as const;
  const tabLabels = { input: "Input", animals: "Animals", stats: "Stats", details: "Details" };

  /* ── Quick Notes toggle handler ── */
  const handleNoteToggle = (noteId: string) => {
    setSelectedNoteIds((prev) => {
      const next = prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId];
      // Compute active flag from selection
      const note = CALVING_QUICK_NOTES.find((n) => n.id === noteId);
      if (note && note.flag !== "none" && !prev.includes(noteId)) {
        // Just selected a flagged note
        const flagLabel = FLAG_LABEL_MAP[note.flag] || note.flag;
        showToast("success", `${flagLabel} flag applied to Tag ${trimmedTag || "—"}`);
      }
      // Update active flag
      let highest: NoteFlag = "none";
      const prio: Record<NoteFlag, number> = { cull: 3, production: 2, management: 1, none: 0 };
      for (const nid of next) {
        const n = CALVING_QUICK_NOTES.find((x) => x.id === nid);
        if (n && prio[n.flag] > prio[highest]) highest = n.flag;
      }
      setActiveFlag(highest);
      return next;
    });
  };

  /* ── Config-driven field rendering ── */
  const lockedConfig = LOCKED_CONFIGS[PROJECT_CONFIG.workType];
  const hasLockedFields = !!lockedConfig && lockedConfig.fields.length > 0;

  /* Render a locked field row with lock icon */
  const renderLockedField = (field: LockedField) => {
    const val = fieldValues[field.key] || "";
    if (field.type === "select") {
      return (
        <div key={field.key} className="flex items-start gap-3">
          <label
            className="shrink-0 text-[#1A1A1A] font-['Inter'] flex items-center gap-1"
            style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
          >
            {field.label}
            <LockIconSmall />
          </label>
          <div className="flex-1 min-w-0">
            <div className="relative">
              <select
                value={val}
                onChange={(e) => setFieldValue(field.key, e.target.value)}
                className="w-full h-[40px] px-3 pr-8 rounded-lg bg-white border border-[#D4D4D0] font-['Inter'] outline-none transition-all appearance-none cursor-pointer focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
                style={{
                  fontSize: 16,
                  fontWeight: field.colorFn && val ? 700 : 400,
                  color: field.colorFn ? (field.colorFn(val) || (val ? "#1A1A1A" : "rgba(26,26,26,0.30)")) : (val ? "#1A1A1A" : "rgba(26,26,26,0.30)"),
                }}
              >
                <option value="" disabled>Select…</option>
                {(field.options || []).map((opt) => (
                  <option key={opt} value={opt} style={{ color: "#1A1A1A" }}>{opt}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      );
    }
    // number or text
    return (
      <div key={field.key} className="flex items-start gap-3">
        <label
          className="shrink-0 text-[#1A1A1A] font-['Inter'] flex items-center gap-1"
          style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
        >
          {field.label}
          <LockIconSmall />
        </label>
        <div className="flex-1 min-w-0">
          <input
            type={field.type === "number" ? "number" : "text"}
            value={val}
            onChange={(e) => setFieldValue(field.key, e.target.value)}
            placeholder={field.placeholder || ""}
            className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
            style={{ fontSize: 16, fontWeight: 400 }}
          />
        </div>
      </div>
    );
  };

  /* Render an optional field by key */
  const renderOptionalField = (key: OptionalFieldKey) => {
    switch (key) {
      case "weight":
        return (
          <FormFieldRow
            key="weight"
            label="Weight"
            type="number"
            value={fieldValues.weight || ""}
            onChange={(v) => setFieldValue("weight", v)}
            placeholder="lbs"
          />
        );

      case "quickNotes":
        return (
          <div key="quickNotes" className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setQuickNotesOpen(!quickNotesOpen)}
              className="shrink-0 text-[#1A1A1A] font-['Inter'] flex items-center gap-1.5 cursor-pointer"
              style={{ width: 105, fontSize: 14, fontWeight: 600, paddingTop: 7, background: "none", border: "none", padding: "7px 0 0 0", textAlign: "left" }}
            >
              Quick Notes
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                className="shrink-0 transition-transform duration-200"
                style={{ transform: quickNotesOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              {quickNotesOpen ? (
                <div className="flex flex-wrap gap-1.5">
                  {COWWORK_QUICK_NOTES.map((note) => {
                    const isSelected = selectedNoteIds.includes(note.id);
                    const c = PILL_COLORS[note.flag] || PILL_COLORS.none;
                    return (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => handleNoteToggle(note.id)}
                        className="rounded-full font-['Inter'] cursor-pointer inline-flex items-center gap-1 transition-all active:scale-[0.96]"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "4px 10px",
                          backgroundColor: isSelected ? c.bgSel : c.bg,
                          border: `${isSelected ? "2px" : "1px"} solid ${isSelected ? c.borderSel : c.border}`,
                          color: c.color,
                        }}
                      >
                        {isSelected && <CheckIcon color={c.color} />}
                        {note.text}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div
                  className="flex flex-wrap gap-1.5 min-h-[30px] items-center cursor-pointer"
                  onClick={() => setQuickNotesOpen(true)}
                >
                  {selectedNoteIds.length === 0 ? (
                    <span className="font-['Inter']" style={{ fontSize: 13, color: "rgba(26,26,26,0.3)" }}>
                      Tap to add notes…
                    </span>
                  ) : (
                    selectedNoteIds.map((nid) => {
                      const note = CALVING_QUICK_NOTES.find((n) => n.id === nid);
                      if (!note) return null;
                      const c = PILL_COLORS[note.flag] || PILL_COLORS.none;
                      return (
                        <span
                          key={nid}
                          className="rounded-full font-['Inter']"
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 10px",
                            backgroundColor: c.bgSel,
                            border: `1px solid ${c.borderSel}`,
                            color: c.color,
                          }}
                        >
                          {note.text}
                        </span>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "notes":
        return (
          <div key="notes" className="flex items-start gap-3">
            <label
              className="shrink-0 text-[#1A1A1A] font-['Inter']"
              style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
            >
              Notes
            </label>
            <div className="flex-1 min-w-0 relative">
              <textarea
                value={fieldValues.notes || ""}
                onChange={(e) => setFieldValue("notes", e.target.value)}
                placeholder="Notes…"
                rows={2}
                className="w-full px-3 py-2.5 pr-10 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 resize-none"
                style={{ fontSize: 16, fontWeight: 400, minHeight: 64 }}
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
        );

      case "dna":
        return (
          <FormFieldRow
            key="dna"
            label="DNA"
            value={fieldValues.dna || ""}
            onChange={(v) => setFieldValue("dna", v)}
            placeholder="Sample ID"
          />
        );

      case "tagColor":
        return (
          <FormSelectRow
            key="tagColor"
            label="Tag Color"
            value={fieldValues.tagColor || ""}
            onChange={(v) => setFieldValue("tagColor", v)}
            placeholder="Select…"
            options={TAG_COLORS}
          />
        );

      case "lot":
        return (
          <FormFieldRow key="lot" label="Lot" value={fieldValues.lot || ""} onChange={(v) => setFieldValue("lot", v)} placeholder="Lot number" />
        );

      case "sample":
        return (
          <FormFieldRow key="sample" label="Sample" value={fieldValues.sample || ""} onChange={(v) => setFieldValue("sample", v)} placeholder="Sample ID" />
        );

      case "pen":
        return (
          <FormFieldRow key="pen" label="Pen" value={fieldValues.pen || ""} onChange={(v) => setFieldValue("pen", v)} placeholder="Pen ID" />
        );

      case "data1":
        return (
          <FormFieldRow key="data1" label="Data 1" value={fieldValues.data1 || ""} onChange={(v) => setFieldValue("data1", v)} placeholder="Custom field" />
        );

      case "data2":
        return (
          <FormFieldRow key="data2" label="Data 2" value={fieldValues.data2 || ""} onChange={(v) => setFieldValue("data2", v)} placeholder="Custom field" />
        );

      case "traits":
        return (
          <FormFieldRow key="traits" label="Traits" value={fieldValues.traits || ""} onChange={(v) => setFieldValue("traits", v)} placeholder="Trait codes" />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-0">
      {/* ══ GRADIENT TOTAL CARD — collapsible ══ */}
      <div
        className="rounded-xl overflow-hidden font-['Inter'] mb-5 cursor-pointer"
        style={{ background: "linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)" }}
        onClick={() => setSummaryCardOpen(!summaryCardOpen)}
      >
        <div className="flex items-center justify-between px-3.5 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="text-white" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
              {workedAnimals.length}
            </span>
            <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>
              worked
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 11, fontWeight: 600, color: "#A8E6DA" }}>
              Spring Preg Check
            </span>
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="shrink-0 transition-transform duration-200"
              style={{ transform: summaryCardOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#F0F0F0" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {summaryCardOpen && (
          <div className="px-3.5 pb-3 -mt-0.5" onClick={(e) => e.stopPropagation()}>
            <p style={{ fontSize: 10, fontWeight: 500, color: "rgba(168,230,218,0.5)" }}>
              In Progress
            </p>
            <button
              type="button"
              onClick={() => navigate(`/cow-work/${id || "spring-preg"}/close-out`)}
              className="mt-2.5 rounded-lg py-1.5 px-4 cursor-pointer font-['Inter'] transition-all active:scale-[0.97]"
              style={{ fontSize: 11, fontWeight: 700, backgroundColor: "#F3D12A", color: "#1A1A1A", border: "none" }}
            >
              Complete Project
            </button>
          </div>
        )}
      </div>

      {/* ══ TABS ══ */}
      <div className="flex border-b border-[#D4D4D0]/50">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="flex-1 pb-3 cursor-pointer transition-colors duration-150 font-['Inter'] relative"
              style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#0E2646" : "rgba(26,26,26,0.35)" }}
            >
              {tabLabels[tab]}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ width: 40, height: 3, backgroundColor: "#F3D12A" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ══ TAB CONTENT ══ */}
      <div className="py-5">
        {/* ──────────────────────────────────────
            INPUT TAB — Dynamic field rendering
           ────────────────────────────────────── */}
        {activeTab === "input" && (
          <div className="space-y-4">
            {/* ── COW HISTORY PANEL (above tag input) ── */}
            {matchedAnimal && !isDuplicate && (
              <CowHistoryPanel animal={matchedAnimal} defaultExpanded />
            )}

            {/* ── ANIMAL LOOKUP ── */}
            <div className="space-y-2.5">
              {/* Tag / EID scan field */}
              <div className="flex items-center gap-3">
                <label
                  className="shrink-0 text-[#1A1A1A] font-['Inter']"
                  style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "46px" }}
                >
                  Tag / EID
                </label>
                <input
                  ref={tagInputRef}
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Scan or enter tag…"
                  className="flex-1 min-w-0 h-[46px] px-3 rounded-lg bg-white border-2 border-[#F3D12A] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
                  style={{ fontSize: 16, fontWeight: 600 }}
                />
              </div>

              {/* Match status */}
              {trimmedTag && !isDuplicate && matchedAnimal && (
                <div
                  className="rounded-full font-['Inter'] inline-flex items-center"
                  style={{
                    fontSize: 12, fontWeight: 600, color: "#55BAAA",
                    backgroundColor: "rgba(85,186,170,0.08)", border: "1.5px solid rgba(85,186,170,0.25)",
                    padding: "5px 14px",
                  }}
                >
                  ✓ {matchedAnimal.tag} — {matchedAnimal.tagColor} — Matched
                </div>
              )}

              {trimmedTag && isDuplicate && (
                <div>
                  <div
                    className="rounded-lg font-['Inter'] w-full"
                    style={{
                      fontSize: 12, fontWeight: 600, color: "#8B7A00",
                      backgroundColor: "rgba(243,209,42,0.1)", border: "1px solid rgba(243,209,42,0.4)",
                      padding: "8px 12px",
                    }}
                  >
                    ⚠ This animal already has a record in this project
                  </div>
                  <button
                    type="button"
                    className="cursor-pointer font-['Inter'] mt-1.5"
                    style={{ fontSize: 12, fontWeight: 600, color: "#55BAAA", background: "none", border: "none", padding: 0 }}
                  >
                    View existing record →
                  </button>
                </div>
              )}
            </div>

            {/* ── LOCKED WORK-TYPE FIELDS ── */}
            {hasLockedFields && (
              <>
                <div style={{ borderTop: "1px solid rgba(212,212,208,0.40)", paddingTop: 12 }}>
                  <p
                    className="font-['Inter'] uppercase mb-3"
                    style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#55BAAA" }}
                  >
                    {lockedConfig!.label}
                  </p>
                  <div className="space-y-2.5">
                    {lockedConfig!.fields.map((f) => renderLockedField(f))}
                  </div>
                </div>
              </>
            )}

            {/* ── OPTIONAL PROJECT FIELDS ── */}
            {PROJECT_CONFIG.optionalFields.length > 0 && (
              <div style={{ borderTop: "1px solid rgba(212,212,208,0.40)", paddingTop: 12 }}>
                <p
                  className="font-['Inter'] uppercase mb-3"
                  style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(14,38,70,0.35)" }}
                >
                  Project Fields
                </p>
                <div className="space-y-2.5">
                  {PROJECT_CONFIG.optionalFields.map((key) => renderOptionalField(key))}
                </div>
              </div>
            )}

            {/* ── ACTION BUTTONS ── */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <PillButton variant="outline" size="md" onClick={clearForm} style={{ flex: 1 }}>
                  Skip
                </PillButton>
                <PillButton size="md" onClick={handleSaveNext} style={{ flex: 1 }}>
                  Save &amp; Next
                </PillButton>
              </div>
              <button
                type="button"
                onClick={handleSaveDone}
                className="w-full cursor-pointer font-['Inter'] text-center"
                style={{ fontSize: 13, fontWeight: 600, color: "#55BAAA", background: "none", border: "none", padding: "4px 0" }}
              >
                Save &amp; Done →
              </button>
            </div>

            {/* ── FLOATING MIC ── */}
            <FloatingMicButton state="idle" />
          </div>
        )}

        {/* ──────────────────────────────────────
            ANIMALS TAB
           ────────────────────────────────────── */}
        {activeTab === "animals" && (
          <div className="space-y-2.5">
            {workedAnimals.map((a) => (
              <div
                key={a.tag}
                onClick={() => navigate(`/cow-work/spring-preg/animal/${a.tag}`)}
                className="rounded-xl px-4 py-3 font-['Inter'] flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
                style={{ backgroundColor: "#0E2646" }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#F0F0F0" }}>{a.tag}</span>
                    <FlagIcon color={a.flag} size="sm" />
                  </div>
                  <p className="mt-0.5 truncate" style={{ fontSize: 12, color: "rgba(240,240,240,0.45)" }}>
                    {a.weight} lbs · {a.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ──────────────────────────────────────
            STATS TAB
           ────────────────────────────────────── */}
        {activeTab === "stats" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Worked", value: "5" },
                { label: "Avg Weight", value: "1,166" },
                { label: "Green Flags", value: "3" },
                { label: "Flagged", value: "2" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white border border-[#D4D4D0]/60 p-3.5 font-['Inter']">
                  <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(26,26,26,0.35)", letterSpacing: "0.06em" }} className="uppercase">
                    {s.label}
                  </p>
                  <p className="text-[#0E2646] mt-1" style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────
            DETAILS TAB
           ────────────────────────────────────── */}
        {activeTab === "details" && (
          <div className="space-y-5">
            <div className="space-y-2.5">
              <FormFieldRow label="Project" value="Spring Preg Check" placeholder="" />
              <FormFieldRow label="Work Type" value="PREG" placeholder="" />
              <FormFieldRow label="Cattle Type" value="Cows" placeholder="" />
              <FormFieldRow label="Date" value="Feb 25, 2026" placeholder="" />
              <FormSelectRow label="Location" value="Working Facility" onChange={() => {}} options={["Working Facility", "North Pasture", "South Pasture", "Barn / Chute", "Corral", "Feedlot"]} />
              <FormSelectRow label="Group" value="Spring Calvers" onChange={() => {}} options={["Spring Calvers", "Fall Calvers", "Heifers — 1st Calf", "Bulls", "Replacement Heifers", "Feeders"]} />
              <FormFieldRow label="Status" value="In Progress" placeholder="" />
              <FormFieldRow label="Head Count" value="45" placeholder="" />
            </div>

            <CollapsibleSection title={`Products (${projectProducts.length})`} defaultOpen>
              <div className="space-y-2 pt-1">
                {projectProducts.map((p) => (
                  <div
                    key={p.name}
                    className="rounded-lg px-3.5 py-2.5"
                    style={{ backgroundColor: "#0E2646" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[#F0F0F0] min-w-0 flex-1" style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
                        {p.name}
                      </p>
                      <span
                        className="shrink-0 rounded-full"
                        style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px",
                          backgroundColor: "rgba(85,186,170,0.15)", color: "#55BAAA",
                        }}
                      >
                        {p.route}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.45)" }}>{p.dosage}</span>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.30)" }}>·</span>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.35)" }}>{p.inventory} remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            <div className="flex gap-3 pt-2">
              <PillButton variant="outline" size="md" onClick={() => navigate("/cow-work")} style={{ flex: 1 }}>
                Back to List
              </PillButton>
              <PillButton size="md" onClick={() => navigate(`/cow-work/${id || "spring-preg"}/close-out`)} style={{ flex: 1 }}>
                Complete Project
              </PillButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}