import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CALVING_QUICK_NOTES, getActiveFlagColor, type NoteFlag } from "./calving-quick-notes";
import { useCalvingData, type FlagColor } from "./calving-data-context";
import { useToast } from "./toast-context";
import { CollapsibleSection } from "./collapsible-section";
import { FormFieldRow } from "./form-field-row";
import { FlagIcon } from "./flag-icon";
import { PillButton } from "./pill-button";

// Fallback to first record if tag not found
const fallbackTag = "8841";

const flagColors: Record<FlagColor, string> = {
  teal: "#55BAAA",
  gold: "#D4A017",
  red: "#9B2335",
};

const flagLabels: Record<FlagColor, string> = {
  teal: "Management",
  gold: "Monitor",
  red: "Critical",
};

const tagColorMap: Record<string, string> = {
  Pink: "#E8A0BF",
  Yellow: "#F3D12A",
  Orange: "#E8853D",
  Green: "#55BAAA",
  Blue: "#4A90D9",
  Red: "#9B2335",
  Purple: "#8B5FBF",
};

const FLAG_LABEL_MAP: Record<string, string> = {
  cull: "Cull",
  production: "Production",
  management: "Management",
};

/* ── Quick-note pill colors ── */
const PILL_COLORS: Record<string, { bg: string; bgSel: string; border: string; borderSel: string; color: string }> = {
  cull: { bg: "rgba(155,35,53,0.12)", bgSel: "rgba(155,35,53,0.20)", border: "rgba(155,35,53,0.25)", borderSel: "#9B2335", color: "#9B2335" },
  production: { bg: "rgba(243,209,42,0.12)", bgSel: "rgba(243,209,42,0.22)", border: "rgba(243,209,42,0.30)", borderSel: "#B8860B", color: "#B8860B" },
  management: { bg: "rgba(85,186,170,0.12)", bgSel: "rgba(85,186,170,0.20)", border: "rgba(85,186,170,0.25)", borderSel: "#55BAAA", color: "#55BAAA" },
  none: { bg: "#F5F5F0", bgSel: "rgba(26,26,26,0.08)", border: "#D4D4D0", borderSel: "rgba(26,26,26,0.40)", color: "rgba(26,26,26,0.55)" },
};

const COWWORK_QUICK_NOTES = CALVING_QUICK_NOTES;

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
      <path d="M2 5.5L4 7.5L8 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Mic icon (teal, 16px) ── */
function MicIconSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="5.5" y="1.5" width="5" height="8" rx="2.5" stroke="#55BAAA" strokeWidth="1.3" />
      <path d="M3 7.5C3 10 5.2 12 8 12C10.8 12 13 10 13 7.5" stroke="#55BAAA" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8 12V14.5" stroke="#55BAAA" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/* Section label style */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-['Inter'] uppercase"
      style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(14,38,70,0.35)", marginBottom: 6 }}
    >
      {children}
    </p>
  );
}

/* ═══════════════════════════════════════════════
   CALVING DETAIL SCREEN
   ═══════════════════════════════════════════════ */
export function CalvingDetailScreen() {
  const navigate = useNavigate();
  const { calfTag } = useParams();
  const { getDetail, updateDetail } = useCalvingData();
  const { showToast } = useToast();

  const data = getDetail(calfTag || fallbackTag) ?? getDetail(fallbackTag);

  const [activeTab, setActiveTab] = useState<"calf" | "dam">("calf");

  /* ── Calf fields ── */
  const [calfStatus, setCalfStatus] = useState<"Alive" | "Dead" | "Grafted">("Alive");
  const [calfFields, setCalfFields] = useState({
    size: "Average",
    birthWeight: data?.birthWeight ?? "78",
    assistance: "None",
    notes: data?.notes ?? "",
    location: data?.location ?? "Calving Pasture A",
    group: data?.group ?? "2026 Season",
  });
  const updateCalf = (key: keyof typeof calfFields, val: string) =>
    setCalfFields((prev) => ({ ...prev, [key]: val }));

  /* Quick notes */
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>(["qn2", "qn11"]);
  const [activeFlag, setActiveFlag] = useState<NoteFlag>("production");

  const handleNoteToggle = (noteId: string) => {
    setSelectedNoteIds((prev) => {
      const next = prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId];
      const note = CALVING_QUICK_NOTES.find((n) => n.id === noteId);
      if (note && note.flag !== "none" && !prev.includes(noteId)) {
        const flagLabel = FLAG_LABEL_MAP[note.flag] || note.flag;
        showToast("success", `${flagLabel} flag applied to Tag ${data?.calfTag ?? "—"}`);
      }
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

  /* Cow traits — text only, no integer prefix */
  const [cowTraits, setCowTraits] = useState({
    assistance: "None",
    disposition: "Restless",
    udder: "Above Average",
    teat: "Average",
    claw: "Average",
    foot: "Above Average",
    mothering: "Good",
  });
  const updateCowTrait = (key: keyof typeof cowTraits, val: string) =>
    setCowTraits((prev) => ({ ...prev, [key]: val }));

  /* Calf traits — text only */
  const [calfTraits, setCalfTraits] = useState({
    vigor: "Vigorous",
    size: "Average",
  });
  const updateCalfTrait = (key: keyof typeof calfTraits, val: string) =>
    setCalfTraits((prev) => ({ ...prev, [key]: val }));

  /* Dam card expanded */
  const [damExpanded, setDamExpanded] = useState(false);
  const [damSubTab, setDamSubTab] = useState<"info" | "calving" | "history">("info");

  /* Save */
  const handleSave = () => {
    if (!data) return;
    updateDetail(data.calfTag, {
      notes: calfFields.notes,
      birthWeight: calfFields.birthWeight,
      location: calfFields.location,
      group: calfFields.group,
      calfStatus: calfStatus,
      assistanceCode: calfFields.assistance,
      quickNotes: selectedNoteIds,
    });
    showToast("success", `Calf ${data.calfTag} saved`);
    navigate(-1);
  };

  if (!data) {
    return (
      <div className="py-10 text-center font-['Inter']">
        <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>Record not found</p>
        <PillButton variant="outline" size="md" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
          Back
        </PillButton>
      </div>
    );
  }

  const dam = data.dam;
  const flagColor = getActiveFlagColor(selectedNoteIds);

  /* ── Select render helper ── */
  const renderSelect = (
    value: string,
    onChange: (val: string) => void,
    options: string[],
    placeholder = "Select…"
  ) => (
    <div className="relative flex-1 min-w-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[40px] px-3 pr-8 rounded-lg bg-white border border-[#D4D4D0] font-['Inter'] outline-none appearance-none cursor-pointer focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
        style={{ fontSize: 16, fontWeight: 400, color: value ? "#1A1A1A" : "rgba(26,26,26,0.30)" }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ color: "#1A1A1A" }}>{opt}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M3 4.5L6 7.5L9 4.5" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  /* ── Label-left select row ── */
  const renderLabelSelect = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    options: string[]
  ) => (
    <div className="flex items-center gap-3">
      <label className="shrink-0 text-[#1A1A1A] font-['Inter']" style={{ width: 105, fontSize: 14, fontWeight: 600 }}>
        {label}
      </label>
      {renderSelect(value, onChange, options)}
    </div>
  );

  return (
    <div className="space-y-0">
      {/* ══ GRADIENT HEADER CARD ══ */}
      <div
        className="rounded-2xl px-5 py-5 font-['Inter']"
        style={{ background: "linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)" }}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left — Calf tag & info */}
          <div className="min-w-0 flex-1">
            <p className="text-white" style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
              {data.calfTag}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span
                className="rounded-full uppercase"
                style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", padding: "2px 10px",
                  backgroundColor: data.sex === "Bull" ? "rgba(85,186,170,0.2)" : "rgba(232,160,191,0.25)",
                  color: data.sex === "Bull" ? "#55BAAA" : "#E8A0BF",
                }}
              >
                {data.sex}
              </span>
              <span style={{ fontSize: 11, fontWeight: 400, color: "rgba(240,240,240,0.4)" }}>
                Born {data.birthDate}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span style={{ fontSize: 11, fontWeight: 500, color: "#A8E6DA" }}>Dam {data.damTag}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(168,230,218,0.4)" }}>·</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(168,230,218,0.7)" }}>{data.sire}</span>
            </div>
          </div>

          {/* Right — Birth weight */}
          <div className="shrink-0 flex flex-col items-center gap-0.5 pt-1">
            <p className="text-white" style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
              {calfFields.birthWeight || data.birthWeight}
            </p>
            <span className="uppercase" style={{ fontSize: 9, fontWeight: 600, color: "rgba(240,240,240,0.4)", letterSpacing: "0.06em" }}>
              LBS
            </span>
          </div>
        </div>

        {/* Flag row */}
        {flagColor && (
          <div
            className="flex items-center gap-1.5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, marginTop: 12 }}
          >
            <FlagIcon color={flagColor} size="sm" />
            <span style={{ fontSize: 11, fontWeight: 700, color: flagColor === "red" ? "#F8A0A0" : flagColor === "gold" ? "#F3D12A" : "#A8E6DA" }}>
              {FLAG_LABEL_MAP[activeFlag]} Flag
            </span>
          </div>
        )}
      </div>

      {/* ══ TAB BAR ══ */}
      <div className="flex border-b border-[#D4D4D0]/50 mt-3">
        {(["calf", "dam"] as const).map((tab) => {
          const isActive = activeTab === tab;
          const labels = { calf: "Calf Info", dam: "Dam History" };
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="flex-1 pb-3 cursor-pointer transition-colors duration-150 font-['Inter'] relative"
              style={{ fontSize: 14, fontWeight: isActive ? 700 : 500, color: isActive ? "#0E2646" : "rgba(26,26,26,0.35)" }}
            >
              {labels[tab]}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full" style={{ width: 48, height: 3, backgroundColor: "#F3D12A" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ══ TAB CONTENT ══ */}
      <div className="pt-3">
        {/* ── CALF INFO TAB ── */}
        {activeTab === "calf" && (
          <div className="space-y-2.5">

            {/* SECTION 1 — BIRTH ENTRY */}
            <SectionLabel>Birth Entry</SectionLabel>
            <div
              className="rounded-xl bg-white border border-[#D4D4D0]/60 font-['Inter']"
              style={{ padding: "14px 16px" }}
            >
              {/* Status toggle */}
              <div
                className="flex rounded-[10px] p-[3px]"
                style={{ backgroundColor: "rgba(14,38,70,0.06)", border: "1px solid rgba(212,212,208,0.4)" }}
              >
                {(["Alive", "Dead", "Grafted"] as const).map((s) => {
                  const isActive = calfStatus === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCalfStatus(s)}
                      className="flex-1 rounded-lg cursor-pointer transition-all font-['Inter']"
                      style={{
                        height: 36,
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 500,
                        backgroundColor: isActive ? "#0E2646" : "transparent",
                        color: isActive ? "white" : "rgba(26,26,26,0.4)",
                        border: "none",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid rgba(26,26,26,0.06)", margin: "10px 0" }} />

              {/* Size + Birth Wt — side by side, stacked labels */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <p className="uppercase font-['Inter']" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(26,26,26,0.4)", marginBottom: 4 }}>
                    SIZE
                  </p>
                  {renderSelect(calfFields.size, (v) => updateCalf("size", v), ["Small", "Average", "Large"])}
                </div>
                <div>
                  <p className="uppercase font-['Inter']" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(26,26,26,0.4)", marginBottom: 4 }}>
                    BIRTH WT
                  </p>
                  <input
                    type="number"
                    value={calfFields.birthWeight}
                    onChange={(e) => updateCalf("birthWeight", e.target.value)}
                    placeholder="lbs"
                    className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
                    style={{ fontSize: 16, fontWeight: 400 }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid rgba(26,26,26,0.06)", margin: "10px 0" }} />

              {/* Assistance */}
              {renderLabelSelect("Assistance", calfFields.assistance, (v) => updateCalf("assistance", v), ["None", "Easy Pull", "Moderate", "Hard Pull", "Surgical"])}

              {/* Assistance alert */}
              {calfFields.assistance !== "None" && calfFields.assistance !== "" && (
                <div
                  className="rounded-lg font-['Inter'] flex items-start gap-2 mt-1.5"
                  style={{ backgroundColor: "rgba(155,35,53,0.06)", border: "1px solid rgba(155,35,53,0.15)", padding: "8px 12px" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
                    <path d="M7 1L13 13H1L7 1Z" fill="#9B2335" opacity="0.7" />
                    <path d="M7 5.5V8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="7" cy="10.5" r="0.75" fill="white" />
                  </svg>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#9B2335" }}>
                    Review dam and calf at next check
                  </span>
                </div>
              )}

              {/* Divider */}
              <div style={{ borderTop: "1px solid rgba(26,26,26,0.06)", margin: "10px 0" }} />

              {/* Notes */}
              <div className="flex items-start gap-3">
                <label className="shrink-0 text-[#1A1A1A] font-['Inter']" style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}>
                  Notes
                </label>
                <div className="flex-1 min-w-0 relative">
                  <textarea
                    value={calfFields.notes}
                    onChange={(e) => updateCalf("notes", e.target.value)}
                    placeholder="Calving notes…"
                    rows={2}
                    className="w-full px-3 py-2.5 pr-10 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all resize-none"
                    style={{ fontSize: 16, fontWeight: 400, minHeight: 52 }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 cursor-pointer"
                    style={{ background: "none", border: "none", padding: 0 }}
                    aria-label="Voice input"
                  >
                    <MicIconSmall />
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 2 — LOCATION */}
            <div style={{ marginTop: 10 }}>
              <SectionLabel>Location</SectionLabel>
              <div
                className="rounded-xl bg-white border border-[#D4D4D0]/60 font-['Inter']"
                style={{ padding: "14px 16px" }}
              >
                <div className="space-y-2">
                  {renderLabelSelect("Location", calfFields.location, (v) => updateCalf("location", v), ["Calving Pasture A", "Calving Pasture B", "Barn", "Corral", "North Pasture", "South Pasture"])}
                  {renderLabelSelect("Group", calfFields.group, (v) => updateCalf("group", v), ["2026 Season", "2025 Season", "Spring Calvers", "Fall Calvers", "Heifers — 1st Calf"])}
                </div>
                <p className="font-['Inter'] italic mt-2" style={{ fontSize: 10, color: "rgba(26,26,26,0.3)" }}>
                  Defaults to last used values
                </p>
              </div>
            </div>

            {/* SECTION 3 — QUICK NOTES (collapsed) */}
            <div style={{ marginTop: 10 }}>
              <CollapsibleSection
                title="Quick Notes"
                collapsedContent={
                  selectedNoteIds.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedNoteIds.map((nid) => {
                        const note = CALVING_QUICK_NOTES.find((n) => n.id === nid);
                        if (!note) return null;
                        const c = PILL_COLORS[note.flag] || PILL_COLORS.none;
                        return (
                          <span
                            key={nid}
                            className="rounded-full font-['Inter']"
                            style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", backgroundColor: c.bgSel, border: `1px solid ${c.borderSel}`, color: c.color }}
                          >
                            {note.text}
                          </span>
                        );
                      })}
                    </div>
                  ) : undefined
                }
              >
                <div className="flex flex-wrap gap-1.5 pt-1">
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
                          fontSize: 11, fontWeight: 600, padding: "4px 10px",
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
              </CollapsibleSection>
            </div>

            {/* SECTION 4 — COW TRAITS (collapsed) */}
            <div style={{ marginTop: 10 }}>
              <CollapsibleSection
                title="Cow Traits"
                collapsedContent={
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {[cowTraits.assistance !== "None" ? cowTraits.assistance : "No Assist", `${cowTraits.udder} udder`, `${cowTraits.mothering} mother`].map((t) => (
                      <span
                        key={t}
                        className="rounded-full font-['Inter']"
                        style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", backgroundColor: "rgba(14,38,70,0.06)", color: "rgba(26,26,26,0.45)" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                }
              >
                <div className="space-y-2 pt-1">
                  {renderLabelSelect("Assistance", cowTraits.assistance, (v) => updateCowTrait("assistance", v), ["None", "Easy Pull", "Moderate", "Hard Pull", "Surgical"])}
                  {renderLabelSelect("Disposition", cowTraits.disposition, (v) => updateCowTrait("disposition", v), ["Docile", "Restless", "Nervous", "Flighty", "Aggressive", "Very Aggressive"])}
                  {renderLabelSelect("Udder Score", cowTraits.udder, (v) => updateCowTrait("udder", v), ["Very Pendulous", "Pendulous", "Moderate Low", "Moderate", "Average", "Above Average", "Good", "Very Good", "Ideal"])}
                  {renderLabelSelect("Teat Score", cowTraits.teat, (v) => updateCowTrait("teat", v), ["Very Large", "Large", "Moderate Large", "Moderate", "Average", "Above Average", "Good", "Very Good", "Ideal Small"])}
                  {renderLabelSelect("Claw Score", cowTraits.claw, (v) => updateCowTrait("claw", v), ["Very Poor", "Poor", "Below Average", "Moderate", "Average", "Above Average", "Good", "Very Good", "Ideal"])}
                  {renderLabelSelect("Foot Score", cowTraits.foot, (v) => updateCowTrait("foot", v), ["Very Poor", "Poor", "Below Average", "Moderate", "Average", "Above Average", "Good", "Very Good", "Ideal"])}
                  {renderLabelSelect("Mothering", cowTraits.mothering, (v) => updateCowTrait("mothering", v), ["Abandons Calf", "Poor", "Average", "Good", "Excellent"])}
                </div>
              </CollapsibleSection>
            </div>

            {/* SECTION 5 — CALF TRAITS (collapsed) */}
            <div style={{ marginTop: 10 }}>
              <CollapsibleSection
                title="Calf Traits"
                collapsedContent={
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {[calfTraits.vigor, `${calfTraits.size} size`].map((t) => (
                      <span
                        key={t}
                        className="rounded-full font-['Inter']"
                        style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", backgroundColor: "rgba(14,38,70,0.06)", color: "rgba(26,26,26,0.45)" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                }
              >
                <div className="space-y-2 pt-1">
                  {renderLabelSelect("Calf Vigor", calfTraits.vigor, (v) => updateCalfTrait("vigor", v), ["Dead", "Weak", "Average", "Alert", "Vigorous"])}
                  {renderLabelSelect("Calf Size", calfTraits.size, (v) => updateCalfTrait("size", v), ["Very Small", "Small", "Average", "Large", "Very Large"])}
                </div>
              </CollapsibleSection>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3" style={{ marginTop: 16 }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 rounded-full cursor-pointer font-['Inter'] transition-all active:scale-[0.97]"
                style={{ height: 44, fontSize: 14, fontWeight: 700, color: "#0E2646", backgroundColor: "white", border: "1.5px solid #D4D4D0" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-full cursor-pointer font-['Inter'] transition-all active:scale-[0.97]"
                style={{ height: 44, fontSize: 14, fontWeight: 700, color: "#1A1A1A", backgroundColor: "#F3D12A", border: "none" }}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* ── DAM HISTORY TAB ── */}
        {activeTab === "dam" && (
          <div className="space-y-2.5">

            {/* DAM CARD — collapsible */}
            <div
              className="rounded-xl font-['Inter'] overflow-hidden"
              style={{ backgroundColor: "#0E2646" }}
            >
              {/* Collapsed header row */}
              <button
                type="button"
                onClick={() => setDamExpanded(!damExpanded)}
                className="w-full flex items-center justify-between cursor-pointer"
                style={{ padding: "12px 14px", background: "none", border: "none" }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="rounded-full shrink-0" style={{ width: 10, height: 10, backgroundColor: tagColorMap[dam.tagColor] || "#CCC" }} />
                  <span className="text-[#F0F0F0]" style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{dam.tag}</span>
                  <span className="truncate" style={{ fontSize: 11, color: "rgba(240,240,240,0.4)" }}>
                    {dam.tagColor} · {dam.sex} · {dam.yearBorn}
                  </span>
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  {dam.flag && (
                    <>
                      <FlagIcon color={dam.flag} size="sm" />
                      <span style={{ fontSize: 10, fontWeight: 600, color: flagColors[dam.flag] }}>{flagLabels[dam.flag]}</span>
                    </>
                  )}
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    className="shrink-0 transition-transform duration-200"
                    style={{ transform: damExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="rgba(240,240,240,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {/* Expanded content */}
              {damExpanded && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  {/* Sub-tabs */}
                  <div className="flex" style={{ padding: "0 14px" }}>
                    {(["info", "calving", "history"] as const).map((st) => {
                      const isActive = damSubTab === st;
                      const stLabels = { info: "Info", calving: "Calving", history: "History" };
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setDamSubTab(st)}
                          className="flex-1 py-2.5 cursor-pointer relative"
                          style={{
                            fontSize: 12, fontWeight: isActive ? 700 : 500,
                            color: isActive ? "white" : "rgba(255,255,255,0.4)",
                            background: "none", border: "none",
                          }}
                        >
                          {stLabels[st]}
                          {isActive && (
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full" style={{ width: 32, height: 2, backgroundColor: "#55BAAA" }} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Sub-tab content */}
                  <div style={{ padding: "12px 14px 14px" }}>
                    {damSubTab === "info" && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {[
                          { label: "Type", value: dam.animalType },
                          { label: "Year", value: dam.yearBorn },
                          { label: "Color", value: dam.tagColor },
                          { label: "Flag", value: dam.flag ? flagLabels[dam.flag] : "None" },
                          { label: "EID", value: dam.eid },
                        ].map((item) => (
                          <div key={item.label}>
                            <p className="uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.25)" }}>{item.label}</p>
                            <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(240,240,240,0.8)", marginTop: 1 }}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {damSubTab === "calving" && (
                      <div className="space-y-2">
                        {dam.calvingHistory.length === 0 ? (
                          <p style={{ fontSize: 12, color: "rgba(240,240,240,0.35)" }}>No calving records</p>
                        ) : dam.calvingHistory.map((c, i) => (
                          <div key={i} className="rounded-lg px-3 py-2" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                            <div className="flex items-center justify-between">
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#F0F0F0" }}>Calf {c.calfTag}</span>
                              <span className="rounded-full" style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", backgroundColor: c.calfSex === "Bull" ? "rgba(85,186,170,0.15)" : "rgba(232,160,191,0.2)", color: c.calfSex === "Bull" ? "#55BAAA" : "#E8A0BF" }}>
                                {c.calfSex}
                              </span>
                            </div>
                            <p style={{ fontSize: 10, color: "rgba(240,240,240,0.35)", marginTop: 2 }}>{c.date} · {c.birthWeight} · Assist: {c.assistance}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {damSubTab === "history" && (
                      <div className="space-y-2">
                        {dam.workHistory.length === 0 ? (
                          <p style={{ fontSize: 12, color: "rgba(240,240,240,0.35)" }}>No work records</p>
                        ) : dam.workHistory.map((h, i) => (
                          <div key={i} className="rounded-lg px-3 py-2" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                            <div className="flex items-center justify-between">
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#F0F0F0" }}>{h.project}</span>
                              {h.flag && <FlagIcon color={h.flag} size="sm" />}
                            </div>
                            <p style={{ fontSize: 10, color: "rgba(240,240,240,0.35)", marginTop: 2 }}>{h.date} · {h.weight} lbs · Preg: {h.preg}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* LATEST NOTES */}
            <div>
              <p
                className="font-['Inter'] uppercase"
                style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(26,26,26,0.4)", marginBottom: 4 }}
              >
                Latest Notes
              </p>
              <p className="text-[#1A1A1A]/70 font-['Inter']" style={{ fontSize: 13, lineHeight: 1.5 }}>
                {dam.notes || "No notes"}
              </p>
            </div>

            {/* CALVING RECORDS (expanded by default) */}
            <CollapsibleSection
              title={`Calving Records (${dam.calvingHistory.length})`}
              defaultOpen
              collapsedContent={
                dam.calvingHistory.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {dam.calvingHistory.map((c, i) => (
                      <span
                        key={i}
                        className="rounded-full font-['Inter']"
                        style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", backgroundColor: "rgba(243,209,42,0.12)", color: "#B8960F" }}
                      >
                        {c.calfTag} · {c.calfSex} · {c.date.split(",")[0].split(" ")[0]}
                      </span>
                    ))}
                  </div>
                ) : undefined
              }
            >
              <div className="space-y-2 pt-2">
                {dam.calvingHistory.length === 0 ? (
                  <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 13 }}>No calving records</p>
                ) : dam.calvingHistory.map((c, i) => (
                  <div key={i} className="rounded-xl px-4 py-3.5 font-['Inter']" style={{ backgroundColor: "#0E2646" }}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[#F0F0F0]" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>Calf {c.calfTag}</p>
                      <span className="rounded-full" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", backgroundColor: c.calfSex === "Bull" ? "rgba(85,186,170,0.15)" : "rgba(232,160,191,0.2)", color: c.calfSex === "Bull" ? "#55BAAA" : "#E8A0BF" }}>
                        {c.calfSex}
                      </span>
                    </div>
                    <p className="mt-0.5" style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.35)" }}>{c.date}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="rounded-full" style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", backgroundColor: "rgba(240,240,240,0.08)", color: "rgba(240,240,240,0.6)" }}>
                        {c.birthWeight}
                      </span>
                      <span className="rounded-full" style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", backgroundColor: c.assistance === "None" ? "rgba(240,240,240,0.08)" : "rgba(155,35,53,0.15)", color: c.assistance === "None" ? "rgba(240,240,240,0.6)" : "#D4606E" }}>
                        Assist: {c.assistance}
                      </span>
                    </div>
                    {c.notes && (
                      <p className="mt-2" style={{ fontSize: 12, fontWeight: 400, color: "rgba(240,240,240,0.45)", lineHeight: 1.4 }}>{c.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* WORK RECORDS (expanded by default) */}
            <CollapsibleSection
              title={`Work Records (${dam.workHistory.length})`}
              defaultOpen
              collapsedContent={
                dam.workHistory.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {dam.workHistory.map((h, i) => (
                      <span key={i} className="rounded-full font-['Inter']" style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", backgroundColor: "rgba(14,38,70,0.08)", color: "#0E2646" }}>
                        {h.project} · {h.date.split(",")[0]}
                      </span>
                    ))}
                  </div>
                ) : undefined
              }
            >
              <div className="space-y-2 pt-2">
                {dam.workHistory.length === 0 ? (
                  <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 13 }}>No previous records</p>
                ) : dam.workHistory.map((h, i) => (
                  <div key={i} className="rounded-xl px-4 py-3.5 font-['Inter']" style={{ backgroundColor: "#0E2646" }}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[#F0F0F0]" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{h.project}</p>
                      {h.flag && <FlagIcon color={h.flag} size="sm" />}
                    </div>
                    <p className="mt-0.5" style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.35)" }}>{h.date}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="rounded-full" style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", backgroundColor: "rgba(240,240,240,0.08)", color: "rgba(240,240,240,0.6)" }}>
                        {h.weight} lbs
                      </span>
                      <span className="rounded-full" style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", backgroundColor: "rgba(240,240,240,0.08)", color: "rgba(240,240,240,0.6)" }}>
                        Preg: {h.preg}
                      </span>
                    </div>
                    <p className="mt-2 truncate" style={{ fontSize: 12, fontWeight: 400, color: "rgba(240,240,240,0.45)", lineHeight: 1.4 }}>{h.notes}</p>
                    {h.treatments.length > 0 && (
                      <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(240,240,240,0.06)" }}>
                        <p className="uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(240,240,240,0.25)", marginBottom: 4 }}>Treatments</p>
                        <div className="flex flex-wrap gap-1.5">
                          {h.treatments.map((t, j) => (
                            <span key={j} className="rounded-full" style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", backgroundColor: "rgba(85,186,170,0.12)", color: "#55BAAA" }}>
                              {t.name} · {t.dosage}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* DAM ID (collapsed by default) */}
            <CollapsibleSection
              title="Dam ID"
              collapsedContent={
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="rounded-full font-['Inter']" style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", backgroundColor: "rgba(14,38,70,0.06)", color: "rgba(26,26,26,0.45)" }}>
                    {dam.tag} · {dam.tagColor} · {dam.sex}
                  </span>
                </div>
              }
            >
              <div className="space-y-2 pt-2">
                {[
                  { label: "Tag", value: dam.tag },
                  { label: "EID", value: dam.eid },
                  ...(dam.eid2 ? [{ label: "EID 2", value: dam.eid2 }] : []),
                  { label: "Other ID", value: dam.otherId },
                  { label: "Lifetime ID", value: dam.lifetimeId },
                  { label: "Sex", value: dam.sex },
                  { label: "Type", value: dam.animalType },
                  { label: "Year Born", value: dam.yearBorn },
                  { label: "Tag Color", value: dam.tagColor },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="shrink-0 font-['Inter']" style={{ width: 105, fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
                      {item.label}
                    </span>
                    <span className="font-['Inter']" style={{ fontSize: 14, fontWeight: 500, color: "rgba(26,26,26,0.65)" }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* BACK BUTTON */}
            <div style={{ marginTop: 16 }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full rounded-full cursor-pointer font-['Inter'] transition-all active:scale-[0.97]"
                style={{ height: 40, fontSize: 13, fontWeight: 600, color: "#0E2646", backgroundColor: "white", border: "1.5px solid #D4D4D0" }}
              >
                Back to Calving
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
