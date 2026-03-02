import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FormSelectRow } from "./form-field-row";
import { CollapsibleSection } from "./collapsible-section";
import { PillButton } from "./pill-button";
import { useToast } from "./toast-context";

/* ── Source types ── */
type SourceType = "group" | "csv" | "past-project" | null;

/* ── Mock reconciliation data ── */
const matchedTags = [
  "4782", "3091", "5520", "2218", "8812", "4001", "3320", "1192",
  "5018", "2764", "6637", "8100", "4455", "1003", "3928", "5210",
  "7730", "2085", "6401", "9953", "1174", "3849", "5566", "7213",
  "8092", "4618", "2331", "6009", "1456", "3785", "5899", "7041",
  "8234", "4387", "2900", "6150", "1632", "9011",
];

const missingAnimals = [
  { tag: "1847", color: "Yellow", type: "Cow" },
  { tag: "6203", color: "Red", type: "Cow" },
  { tag: "4415", color: "Green", type: "Cow" },
  { tag: "7789", color: "White", type: "Cow" },
  { tag: "2950", color: "Pink", type: "Cow" },
];

const extraTags = ["9102", "8841"];

/* ═══════════════════════════════════════════════
   PROJECT CLOSE-OUT SCREEN
   ═══════════════════════════════════════════════ */
export function ProjectCloseOutScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();

  /* ── Reconciliation state ── */
  const [sourceType, setSourceType] = useState<SourceType>(null);
  const [sourceGroup, setSourceGroup] = useState("");
  const [sourcePastProject, setSourcePastProject] = useState("");
  const [reconciling, setReconciling] = useState(false);
  const [reconciled, setReconciled] = useState(false);

  /* ── Result bucket expand state ── */
  const [matchedExpanded, setMatchedExpanded] = useState(false);
  const [missingExpanded, setMissingExpanded] = useState(true);
  const [extraExpanded, setExtraExpanded] = useState(false);

  /* ── Skipped / added missing ── */
  const [dismissedMissing, setDismissedMissing] = useState<Set<string>>(new Set());

  /* ── Run reconciliation ── */
  const runReconciliation = () => {
    setReconciling(true);
    setTimeout(() => {
      setReconciling(false);
      setReconciled(true);
    }, 1200);
  };

  /* ── Close project ── */
  const handleCloseProject = () => {
    showToast("success", "Project closed successfully");
    navigate(`/cow-work/${id || "spring-preg"}/report`);
  };

  const visibleMissing = missingAnimals.filter((a) => !dismissedMissing.has(a.tag));

  return (
    <div className="space-y-5">
      {/* ══ SECTION 1: PROJECT SUMMARY CARD ══ */}
      <div
        className="rounded-2xl px-5 py-5 font-['Inter']"
        style={{ background: "linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)" }}
      >
        <p
          className="uppercase"
          style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)" }}
        >
          Project Summary
        </p>
        <p
          className="text-white mt-1"
          style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 }}
        >
          Spring Preg Check
        </p>
        <span
          className="inline-block rounded-full mt-2"
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.06em",
            padding: "3px 10px",
            backgroundColor: "#9B2335",
            color: "#FFFFFF",
          }}
        >
          IN PROGRESS
        </span>

        {/* Key-value grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { label: "Date", value: "Feb 25, 2026" },
            { label: "Head Count", value: "45" },
            { label: "Processing Type", value: "PREG" },
            { label: "Cattle Type", value: "Cows" },
            { label: "Location", value: "Working Facility" },
            { label: "Group", value: "Spring Calvers" },
          ].map((kv) => (
            <div key={kv.label}>
              <p
                className="uppercase"
                style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.06em", color: "rgba(255,255,255,0.25)" }}
              >
                {kv.label}
              </p>
              <p className="text-white mt-0.5" style={{ fontSize: 16, fontWeight: 700 }}>
                {kv.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SECTION 2: QUICK METRICS ══ */}
      <div>
        <p
          className="font-['Inter'] mb-3"
          style={{ fontSize: 14, fontWeight: 700, color: "#0E2646" }}
        >
          Metrics
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Worked", value: "45", color: "#0E2646" },
            { label: "Avg Weight", value: "1,166", color: "#0E2646" },
            { label: "Open", value: "8", color: "#E74C3C" },
            { label: "Bred", value: "32", color: "#55BAAA" },
            { label: "Short", value: "3", color: "#0E2646" },
            { label: "Late", value: "2", color: "#0E2646" },
            { label: "Avg Days Gest", value: "127", color: "#0E2646" },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl bg-white border border-[#D4D4D0]/60 p-3.5 font-['Inter']"
            >
              <p
                className="uppercase"
                style={{ fontSize: 10, fontWeight: 600, color: "rgba(26,26,26,0.35)", letterSpacing: "0.06em" }}
              >
                {m.label}
              </p>
              <p className="mt-1" style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: m.color }}>
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SECTION 3: RECONCILIATION ══ */}
      <CollapsibleSection
        title="Reconcile Animals"
        collapsedContent={
          <p
            className="font-['Inter']"
            style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.35)", marginTop: 2 }}
          >
            Compare processed animals against a group or list
          </p>
        }
      >
        <div className="space-y-4 pt-2">
          {/* ── Step 1: Source Picker ── */}
          {!reconciled && (
            <>
              <p
                className="font-['Inter']"
                style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}
              >
                Compare against:
              </p>

              <div className="flex gap-2.5">
                {([
                  {
                    key: "group" as SourceType,
                    label: "Group",
                    bgIcon: "rgba(85,186,170,0.1)",
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="5" cy="4" r="2.5" stroke="#55BAAA" strokeWidth="1.3" />
                        <circle cx="9.5" cy="4" r="2" stroke="#55BAAA" strokeWidth="1.3" />
                        <path d="M1 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#55BAAA" strokeWidth="1.3" strokeLinecap="round" />
                        <path d="M9 8.5c1.4.3 2.5 1.6 2.5 3.5" stroke="#55BAAA" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                  {
                    key: "csv" as SourceType,
                    label: "CSV Upload",
                    bgIcon: "rgba(243,209,42,0.1)",
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="2.5" y="1.5" width="9" height="11" rx="1.5" stroke="#B8960F" strokeWidth="1.3" />
                        <path d="M5 5h4M5 7.5h4M5 10h2.5" stroke="#B8960F" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                  {
                    key: "past-project" as SourceType,
                    label: "Past Project",
                    bgIcon: "rgba(14,38,70,0.1)",
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="5" stroke="#0E2646" strokeWidth="1.3" />
                        <path d="M7 4v3.5l2 1.5" stroke="#0E2646" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                  },
                ]).map((opt) => {
                  const isSelected = sourceType === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setSourceType(opt.key)}
                      className="flex-1 flex flex-col items-center gap-2 rounded-xl px-3 py-3 cursor-pointer font-['Inter'] transition-all"
                      style={{
                        backgroundColor: isSelected ? "rgba(85,186,170,0.04)" : "#FFFFFF",
                        border: isSelected ? "2px solid #55BAAA" : "1px solid #D4D4D0",
                      }}
                    >
                      <div
                        className="flex items-center justify-center rounded-full"
                        style={{ width: 28, height: 28, backgroundColor: opt.bgIcon }}
                      >
                        {opt.icon}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ── Step 1b: Source detail ── */}
              {sourceType === "group" && (
                <FormSelectRow
                  label="Group"
                  value={sourceGroup}
                  onChange={setSourceGroup}
                  placeholder="Select group…"
                  options={[
                    "Spring Calvers",
                    "Fall Calvers",
                    "Heifers — 1st Calf",
                    "Bulls",
                    "Replacement Heifers",
                    "2026 Cows",
                    "Old Cows",
                  ]}
                />
              )}

              {sourceType === "csv" && (
                <div
                  className="rounded-xl py-6 flex flex-col items-center gap-2 cursor-pointer transition-colors"
                  style={{
                    border: "2px dashed #D4D4D0",
                    backgroundColor: "rgba(85,186,170,0.02)",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15V3m0 0l-4 4m4-4l4 4" stroke="#55BAAA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17l.62 2.48A2 2 0 004.56 21h14.88a2 2 0 001.94-1.52L22 17" stroke="#55BAAA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="font-['Inter']" style={{ fontSize: 13, fontWeight: 600, color: "#55BAAA" }}>
                    Drop CSV or tap to upload
                  </p>
                </div>
              )}

              {sourceType === "past-project" && (
                <FormSelectRow
                  label="Project"
                  value={sourcePastProject}
                  onChange={setSourcePastProject}
                  placeholder="Select project…"
                  options={[
                    "Fall Processing 2025",
                    "Spring Preg Check 2025",
                    "Fall Processing 2024",
                    "Bull BSE 2025",
                  ]}
                />
              )}

              {/* Run button */}
              {sourceType && (
                <button
                  type="button"
                  onClick={runReconciliation}
                  disabled={reconciling}
                  className="w-full rounded-full py-2.5 cursor-pointer font-['Inter'] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0E2646",
                    backgroundColor: "transparent",
                    border: "1.5px solid #D4D4D0",
                    opacity: reconciling ? 0.6 : 1,
                  }}
                >
                  {reconciling && (
                    <svg
                      className="animate-spin"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <circle cx="7" cy="7" r="5.5" stroke="#D4D4D0" strokeWidth="1.5" />
                      <path d="M12.5 7a5.5 5.5 0 00-5.5-5.5" stroke="#0E2646" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                  {reconciling ? "Running…" : "Run Reconciliation"}
                </button>
              )}
            </>
          )}

          {/* ── Step 2: Results ── */}
          {reconciled && (
            <div className="space-y-3">
              {/* MATCHED */}
              <div className="rounded-xl border border-[#D4D4D0]/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMatchedExpanded(!matchedExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 cursor-pointer bg-white font-['Inter']"
                  style={{ border: "none" }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full shrink-0"
                      style={{ width: 8, height: 8, backgroundColor: "#55BAAA" }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#55BAAA" }}>
                      Matched ({matchedTags.length})
                    </span>
                  </div>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    className="transition-transform duration-200"
                    style={{ transform: matchedExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {matchedExpanded && (
                  <div className="px-4 pb-3 flex flex-wrap gap-1.5 border-t border-[#D4D4D0]/40 pt-3">
                    {matchedTags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full font-['Inter']"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#55BAAA",
                          backgroundColor: "rgba(85,186,170,0.08)",
                          padding: "3px 10px",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* MISSING */}
              <div className="rounded-xl border border-[#D4D4D0]/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMissingExpanded(!missingExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 cursor-pointer bg-white font-['Inter']"
                  style={{ border: "none" }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full shrink-0"
                      style={{ width: 8, height: 8, backgroundColor: "#D4A800" }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#D4A800" }}>
                      Missing ({visibleMissing.length})
                    </span>
                  </div>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    className="transition-transform duration-200"
                    style={{ transform: missingExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {missingExpanded && (
                  <div className="px-4 pb-3 space-y-2 border-t border-[#D4D4D0]/40 pt-3">
                    {visibleMissing.map((a) => (
                      <div
                        key={a.tag}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 font-['Inter']"
                        style={{
                          backgroundColor: "rgba(243,209,42,0.04)",
                          border: "1px solid rgba(243,209,42,0.20)",
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                          {a.tag}{" "}
                          <span style={{ fontWeight: 400, color: "rgba(26,26,26,0.45)" }}>
                            · {a.color} · {a.type}
                          </span>
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => showToast("success", `${a.tag} added to project`)}
                            className="cursor-pointer font-['Inter']"
                            style={{ fontSize: 12, fontWeight: 600, color: "#55BAAA", background: "none", border: "none", padding: 0 }}
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setDismissedMissing((prev) => new Set(prev).add(a.tag))}
                            className="cursor-pointer font-['Inter']"
                            style={{ fontSize: 12, fontWeight: 600, color: "rgba(26,26,26,0.35)", background: "none", border: "none", padding: 0 }}
                          >
                            Skip
                          </button>
                        </div>
                      </div>
                    ))}
                    {visibleMissing.length === 0 && (
                      <p className="font-['Inter'] text-center py-2" style={{ fontSize: 12, fontWeight: 500, color: "rgba(26,26,26,0.35)" }}>
                        All missing animals resolved
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* EXTRA */}
              <div className="rounded-xl border border-[#D4D4D0]/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExtraExpanded(!extraExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 cursor-pointer bg-white font-['Inter']"
                  style={{ border: "none" }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full shrink-0"
                      style={{ width: 8, height: 8, backgroundColor: "#E74C3C" }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#E74C3C" }}>
                      Extra ({extraTags.length})
                    </span>
                  </div>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    className="transition-transform duration-200"
                    style={{ transform: extraExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {extraExpanded && (
                  <div className="px-4 pb-3 flex flex-wrap gap-1.5 border-t border-[#D4D4D0]/40 pt-3">
                    {extraTags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full font-['Inter']"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#E74C3C",
                          backgroundColor: "rgba(231,76,60,0.08)",
                          padding: "3px 10px",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* ══ SECTION 4: CONFIRM CLOSE-OUT ══ */}
      <div>
        {/* Warning banner */}
        <div
          className="rounded-xl px-4 py-3 flex items-start gap-2.5 font-['Inter']"
          style={{
            backgroundColor: "rgba(243,209,42,0.06)",
            border: "1px solid rgba(243,209,42,0.30)",
          }}
        >
          <svg
            className="shrink-0 mt-0.5"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8 1.5L1 14h14L8 1.5z"
              stroke="#8B7A00"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <path d="M8 6v3.5" stroke="#8B7A00" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="8" cy="12" r="0.75" fill="#8B7A00" />
          </svg>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#8B7A00", lineHeight: 1.4 }}>
            Closing this project will prevent adding new animals. Existing records can still be edited.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <PillButton
            variant="outline"
            size="md"
            onClick={() => navigate(-1)}
            style={{ flex: 1 }}
          >
            Back to Project
          </PillButton>
          <button
            type="button"
            onClick={handleCloseProject}
            className="rounded-full cursor-pointer font-['Inter'] transition-all active:scale-[0.98]"
            style={{
              flex: 1,
              fontSize: 13,
              fontWeight: 700,
              backgroundColor: "#9B2335",
              color: "#FFFFFF",
              border: "none",
              padding: "10px 0",
            }}
          >
            Close Project
          </button>
        </div>
      </div>
    </div>
  );
}