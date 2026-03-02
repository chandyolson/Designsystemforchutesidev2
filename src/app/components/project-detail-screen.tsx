import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { CollapsibleSection } from "./collapsible-section";
import { PillButton } from "./pill-button";
import { FlagIcon } from "./flag-icon";
import { FloatingMicButton } from "./floating-mic-button";
import { CowHistoryPanel, mockAnimals, alreadyProcessedTags } from "./cow-history-panel";
import { useToast } from "./toast-context";

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

/* ── Processing type for this project (mock: Pregnancy Check) ── */
const PROJECT_PROCESSING_TYPE = "Pregnancy Check";

/* ── Quick notes options ── */
const quickNoteOptions = ["Normal", "Free Martin", "Twin", "Cull - no milk", "White face", "Follow-up"];

export function ProjectDetailScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"input" | "animals" | "stats" | "details">("input");
  const tagInputRef = useRef<HTMLInputElement>(null);

  /* ── Input tab state ── */
  const [tag, setTag] = useState("4782");
  const [weight, setWeight] = useState("1,247");
  const [quickNotes, setQuickNotes] = useState("");
  const [dnaSample, setDnaSample] = useState("");
  const [memo, setMemo] = useState("");

  /* ── Pregnancy Check conditional fields (default view) ── */
  const [pregStage, setPregStage] = useState("Bred");
  const [daysGest, setDaysGest] = useState("142");
  const [calfSex, setCalfSex] = useState("Bull");

  /* ── Breeding conditional fields ── */
  const [sireBull, setSireBull] = useState("");
  const [breedingDate, setBreedingDate] = useState("");
  const [breedingMethod, setBreedingMethod] = useState("");

  /* ── Cull / Sale conditional fields ── */
  const [cullReason, setCullReason] = useState("");
  const [disposition, setDisposition] = useState("");
  const [saleWeight, setSaleWeight] = useState("");

  /* ── BSE conditional fields ── */
  const [bseResult, setBseResult] = useState("");
  const [scrotalCirc, setScrotalCirc] = useState("");
  const [motility, setMotility] = useState("");
  const [morphology, setMorphology] = useState("");

  /* ── Generic conditional fields ── */
  const [data1, setData1] = useState("");
  const [data2, setData2] = useState("");

  /* ── Derive matched animal ── */
  const trimmedTag = tag.trim();
  const matchedAnimal = trimmedTag ? mockAnimals[trimmedTag] ?? null : null;
  const isDuplicate = trimmedTag ? alreadyProcessedTags.includes(trimmedTag) : false;

  /* Focus tag input on mount and tab switch */
  useEffect(() => {
    if (activeTab === "input") {
      // Don't auto-focus on initial load with pre-filled data
    }
  }, [activeTab]);

  /* ── Clear form ── */
  const clearForm = () => {
    setTag("");
    setWeight("");
    setQuickNotes("");
    setDnaSample("");
    setMemo("");
    setPregStage("");
    setDaysGest("");
    setCalfSex("");
    setSireBull("");
    setBreedingDate("");
    setBreedingMethod("");
    setCullReason("");
    setDisposition("");
    setSaleWeight("");
    setBseResult("");
    setScrotalCirc("");
    setMotility("");
    setMorphology("");
    setData1("");
    setData2("");
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
    if (trimmedTag) {
      showToast("success", `${trimmedTag} saved`);
    }
    navigate("/cow-work");
  };

  const tabs = ["input", "animals", "stats", "details"] as const;
  const tabLabels = { input: "Input", animals: "Animals", stats: "Stats", details: "Details" };

  /* ── BSE result color helper ── */
  const bseColor = (val: string) => {
    if (val === "Pass") return "#55BAAA";
    if (val === "Fail") return "#E74C3C";
    if (val === "Defer") return "#F3D12A";
    return undefined;
  };

  return (
    <div className="space-y-0">
      {/* ══ GRADIENT TOTAL CARD ══ */}
      <div
        className="rounded-2xl px-5 py-5 font-['Inter'] mb-5"
        style={{ background: "linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)" }}
      >
        <p
          className="uppercase"
          style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)" }}
        >
          Total Animals Worked
        </p>
        <p className="text-white mt-1" style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {workedAnimals.length}
        </p>
        <p className="mt-1.5" style={{ fontSize: 12, fontWeight: 500, color: "#A8E6DA" }}>
          Spring Preg Check · In Progress
        </p>
        <button
          type="button"
          onClick={() => navigate(`/cow-work/${id || "spring-preg"}/close-out`)}
          className="mt-4 w-full rounded-xl py-2.5 cursor-pointer font-['Inter'] transition-all active:scale-[0.98]"
          style={{
            fontSize: 13,
            fontWeight: 700,
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          Complete Project
        </button>
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
              style={{
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#0E2646" : "rgba(26,26,26,0.35)",
              }}
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
            INPUT TAB — Full chuteside entry
           ────────────────────────────────────── */}
        {activeTab === "input" && (
          <div className="space-y-4">
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

              {/* ── Match status ── */}
              {trimmedTag && !isDuplicate && matchedAnimal && (
                <div
                  className="rounded-full font-['Inter'] inline-flex items-center"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#55BAAA",
                    backgroundColor: "rgba(85,186,170,0.08)",
                    border: "1.5px solid rgba(85,186,170,0.25)",
                    padding: "5px 14px",
                  }}
                >
                  ✓ {matchedAnimal.tag} — {matchedAnimal.tagColor} — {matchedAnimal.type} — {matchedAnimal.yearBorn}
                </div>
              )}

              {trimmedTag && isDuplicate && (
                <div>
                  <div
                    className="rounded-lg font-['Inter'] w-full"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#8B7A00",
                      backgroundColor: "rgba(243,209,42,0.1)",
                      border: "1px solid rgba(243,209,42,0.4)",
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

            {/* ── COW HISTORY PANEL ── */}
            {matchedAnimal && !isDuplicate && (
              <CowHistoryPanel animal={matchedAnimal} defaultExpanded />
            )}

            {/* ── COMMON FIELDS ── */}
            <div className="space-y-2.5">
              <FormFieldRow
                label="Weight"
                type="number"
                value={weight}
                onChange={setWeight}
                placeholder="lbs"
              />
              <FormSelectRow
                label="Quick Notes"
                value={quickNotes}
                onChange={setQuickNotes}
                placeholder="Select…"
                options={quickNoteOptions}
              />
              <FormFieldRow
                label="DNA / Sample"
                value={dnaSample}
                onChange={setDnaSample}
                placeholder="Sample ID"
              />
              {/* Memo textarea */}
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
                    placeholder="Notes…"
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 resize-none"
                    style={{ fontSize: 16, fontWeight: 400, minHeight: 64 }}
                  />
                </div>
              </div>
            </div>

            {/* ── CONDITIONAL FIELDS ── */}
            {renderConditionalFields()}

            {/* ── ACTION BUTTONS ── */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <PillButton variant="outline" size="md" onClick={clearForm} style={{ flex: 1 }}>
                  Skip
                </PillButton>
                <PillButton size="md" onClick={handleSaveNext} style={{ flex: 1 }}>
                  Save & Next
                </PillButton>
              </div>
              <button
                type="button"
                onClick={handleSaveDone}
                className="w-full cursor-pointer font-['Inter'] text-center"
                style={{ fontSize: 13, fontWeight: 600, color: "#55BAAA", background: "none", border: "none", padding: "4px 0" }}
              >
                Save & Done →
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
                      <p
                        className="text-[#F0F0F0] min-w-0 flex-1"
                        style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}
                      >
                        {p.name}
                      </p>
                      <span
                        className="shrink-0 rounded-full"
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
                    <div className="flex items-center gap-3 mt-1">
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.45)" }}>
                        {p.dosage}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.30)" }}>
                        ·
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.35)" }}>
                        {p.inventory} remaining
                      </span>
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

  /* ═══════════════════════════════════════════════
     CONDITIONAL FIELDS RENDERER
     ═══════════════════════════════════════════════ */
  function renderConditionalFields() {
    const type = PROJECT_PROCESSING_TYPE;

    /* Section header */
    const SectionHeader = ({ label }: { label: string }) => (
      <div className="pt-1">
        <div className="border-t border-[#D4D4D0]/40 pt-3 mb-2">
          <p
            className="font-['Inter'] uppercase"
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "rgba(26,26,26,0.35)",
            }}
          >
            {label}
          </p>
        </div>
      </div>
    );

    if (type === "Pregnancy Check") {
      return (
        <>
          <SectionHeader label="Pregnancy Check" />
          <div className="space-y-2.5">
            <FormSelectRow
              label="Preg Stage"
              value={pregStage}
              onChange={setPregStage}
              placeholder="Select…"
              options={["Open", "AI", "Bred", "Late", "Short", "Medium", "Long"]}
              required
            />
            <FormFieldRow
              label="Days Gest"
              type="number"
              value={daysGest}
              onChange={setDaysGest}
              placeholder="days"
            />
            <FormSelectRow
              label="Calf Sex"
              value={calfSex}
              onChange={setCalfSex}
              placeholder="Select…"
              options={["Bull", "Heifer", "Twin - BB", "Twin - HH", "Twin - BH", "Unknown"]}
            />
          </div>
        </>
      );
    }

    if (type === "Breeding / Bull Turnout") {
      return (
        <>
          <SectionHeader label="Breeding / Bull Turnout" />
          <div className="space-y-2.5">
            <FormFieldRow
              label="Sire / Bull"
              value={sireBull}
              onChange={setSireBull}
              placeholder="Bull tag or name"
            />
            <FormFieldRow
              label="Breeding Date"
              type="date"
              value={breedingDate}
              onChange={setBreedingDate}
              placeholder=""
            />
            <FormSelectRow
              label="Method"
              value={breedingMethod}
              onChange={setBreedingMethod}
              placeholder="Select…"
              options={["Natural", "AI", "ET"]}
            />
          </div>
        </>
      );
    }

    if (type === "Cull / Sale") {
      return (
        <>
          <SectionHeader label="Cull / Sale" />
          <div className="space-y-2.5">
            <FormFieldRow
              label="Cull Reason"
              value={cullReason}
              onChange={setCullReason}
              placeholder="e.g. Open, Lame, Age"
            />
            <FormSelectRow
              label="Disposition"
              value={disposition}
              onChange={setDisposition}
              placeholder="Select…"
              options={["Sold", "Kept", "Dead", "Shipped"]}
            />
            <FormFieldRow
              label="Sale Weight"
              type="number"
              value={saleWeight}
              onChange={setSaleWeight}
              placeholder="lbs"
            />
          </div>
        </>
      );
    }

    if (type === "Bull Testing (BSE)") {
      return (
        <>
          <SectionHeader label="Bull Testing (BSE)" />
          <div className="space-y-2.5">
            <div className="flex items-start gap-3">
              <label
                className="shrink-0 text-[#1A1A1A] font-['Inter']"
                style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
              >
                BSE Result<span style={{ fontSize: 14, fontWeight: 600, color: "#E74C3C", marginLeft: 2 }}>*</span>
              </label>
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <select
                    value={bseResult}
                    onChange={(e) => setBseResult(e.target.value)}
                    className="w-full h-[40px] px-3 pr-8 rounded-lg bg-white border border-[#D4D4D0] font-['Inter'] outline-none transition-all appearance-none cursor-pointer focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
                    style={{
                      fontSize: 16,
                      fontWeight: bseResult ? 700 : 400,
                      color: bseResult ? (bseColor(bseResult) || "#1A1A1A") : "rgba(26,26,26,0.30)",
                    }}
                  >
                    <option value="" disabled>Select…</option>
                    {["Pass", "Fail", "Defer"].map((opt) => (
                      <option key={opt} value={opt} style={{ color: "#1A1A1A" }}>{opt}</option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <FormFieldRow
              label="Scrotal Circ"
              type="number"
              value={scrotalCirc}
              onChange={setScrotalCirc}
              placeholder="cm"
            />
            <FormFieldRow
              label="Motility %"
              type="number"
              value={motility}
              onChange={setMotility}
              placeholder="%"
            />
            <FormFieldRow
              label="Morphology %"
              type="number"
              value={morphology}
              onChange={setMorphology}
              placeholder="%"
            />
          </div>
        </>
      );
    }

    /* Default: Movement / Brucellosis / Processing / Working / Other */
    return (
      <>
        <SectionHeader label={type} />
        <div className="space-y-2.5">
          <FormFieldRow label="Data 1" value={data1} onChange={setData1} placeholder="Custom field" />
          <FormFieldRow label="Data 2" value={data2} onChange={setData2} placeholder="Custom field" />
        </div>
      </>
    );
  }
}