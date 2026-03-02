import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PillButton } from "./pill-button";
import { useToast } from "./toast-context";

/* ── Tag color map ── */
const TAG_COLORS: Record<string, string> = {
  pink: "#E91E8C",
  yellow: "#E5C100",
  green: "#34A853",
  orange: "#E67E22",
  white: "#C8C8C8",
  blue: "#1565C0",
  red: "#E74C3C",
};

/* ── Mock data ── */
const ACCOUNTED_ANIMALS = [
  { tag: "3309", color: "pink", breed: "Angus", type: "Cow" },
  { tag: "4782", color: "yellow", breed: "Angus", type: "Cow" },
  { tag: "5520", color: "green", breed: "Charolais", type: "Cow" },
  { tag: "2218", color: "orange", breed: "Simmental", type: "Cow" },
];
const ACCOUNTED_TOTAL = 83;

interface MissingAnimal {
  tag: string;
  color: string;
  breed: string;
  type: string;
  year: string;
}

const MISSING_ANIMALS: MissingAnimal[] = [
  { tag: "7201", color: "white", breed: "Red Angus", type: "Cow", year: "2019" },
  { tag: "3340", color: "yellow", breed: "Angus", type: "Cow", year: "2017" },
  { tag: "6615", color: "green", breed: "Hereford", type: "Heifer", year: "2023" },
  { tag: "4410", color: "pink", breed: "Angus x Hereford", type: "Cow", year: "2018" },
];

const MISSING_DEFAULTS: Record<string, string> = {
  "7201": "Sold",
  "3340": "Died",
  "6615": "Flag for Follow-Up",
  "4410": "",
};

interface UnexpectedAnimal {
  tag: string;
  color: string;
  breed: string;
  type: string;
  year: string;
  currentGroup: string;
}

const UNEXPECTED_ANIMALS: UnexpectedAnimal[] = [
  { tag: "8812", color: "blue", breed: "Brahman Cross", type: "Cow", year: "2020", currentGroup: "North Pasture Pairs" },
  { tag: "9044", color: "red", breed: "Limousin", type: "Heifer", year: "2023", currentGroup: "Replacement Heifers" },
];

const UNEXPECTED_DEFAULTS: Record<string, string> = {
  "8812": "Add to Group",
  "9044": "Wrong Group (Ignore)",
};

const MISSING_OPTIONS = [
  "Still Here (Missed Scan)",
  "Sold",
  "Died",
  "Moved to Another Group",
  "Flag for Follow-Up",
];

const UNEXPECTED_OPTIONS = [
  "Add to Group",
  "Wrong Group (Ignore)",
  "Flag for Follow-Up",
];

const GROUP_OPTIONS = [
  "Fall Calvers",
  "Heifers — 1st Calf",
  "Bulls",
  "Replacement Heifers",
  "2026 Cows",
  "Old Cows",
  "North Pasture Pairs",
];

/* ── Resolution border colors ── */
function getResolutionBorderColor(value: string): string {
  if (value.startsWith("Still Here")) return "#55BAAA";
  if (value === "Sold") return "#1565C0";
  if (value === "Died") return "#C62828";
  if (value === "Moved to Another Group") return "#E65100";
  if (value === "Flag for Follow-Up") return "#F3D12A";
  if (value === "Add to Group") return "#55BAAA";
  if (value === "Wrong Group (Ignore)") return "#D4D4D0";
  return "#D4D4D0";
}

/* ── Icons ── */
function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="#55BAAA" strokeWidth="1.5" />
      <path d="M7 10L9 12L13 8" stroke="#55BAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 8L7 11L12 5" stroke="#55BAAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 4L12 12M12 4L4 12" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#F3D12A" strokeWidth="1.5" />
      <path d="M6.5 6.5C6.5 5.67 7.17 5 8 5C8.83 5 9.5 5.67 9.5 6.5C9.5 7.17 9 7.5 8 7.5V9" stroke="#F3D12A" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="#F3D12A" />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="transition-transform duration-200"
      style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M4 6L8 10L12 6" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1L13 12H1L7 1Z" stroke="#E67E22" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7 5.5V8" stroke="#E67E22" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="10" r="0.6" fill="#E67E22" />
    </svg>
  );
}

function DropdownChevron() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
      width="12" height="12" viewBox="0 0 12 12" fill="none"
    >
      <path d="M3 4.5L6 7.5L9 4.5" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Tag color dot ── */
function TagDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{
        width: 6,
        height: 6,
        backgroundColor: TAG_COLORS[color] || "#C8C8C8",
        border: color === "white" ? "1px solid #D4D4D0" : "none",
      }}
    />
  );
}

/* ════════════════════════════════════════════════════
   INVENTORY CLOSE-OUT SCREEN
   ════════════════════════════════════════════════════ */
export function InventoryCloseOutScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();

  /* ── Section expand state ── */
  const [accountedExpanded, setAccountedExpanded] = useState(false);
  const [missingExpanded, setMissingExpanded] = useState(true);
  const [unexpectedExpanded, setUnexpectedExpanded] = useState(true);

  /* ── Resolution state for missing ── */
  const [missingResolutions, setMissingResolutions] = useState<Record<string, string>>(
    () => ({ ...MISSING_DEFAULTS })
  );
  const [missingMoveGroups, setMissingMoveGroups] = useState<Record<string, string>>({});

  /* ── Resolution state for unexpected ── */
  const [unexpectedResolutions, setUnexpectedResolutions] = useState<Record<string, string>>(
    () => ({ ...UNEXPECTED_DEFAULTS })
  );

  /* ── Computed values ── */
  const expected = 87;
  const accounted = ACCOUNTED_TOTAL;
  const missing = MISSING_ANIMALS.length;
  const unexpected = UNEXPECTED_ANIMALS.length;
  const pct = ((accounted / expected) * 100).toFixed(1);

  const unresolvedCount = MISSING_ANIMALS.filter(
    (a) => !missingResolutions[a.tag]
  ).length;

  const canFinalize = unresolvedCount === 0;

  /* ── Handlers ── */
  const handleFinalize = () => {
    if (!canFinalize) return;
    showToast("success", "Inventory finalized — records updated");
    navigate(`/cow-work/${id || ""}`);
  };

  const handleSaveDraft = () => {
    showToast("info", "Draft saved — you can resume later");
    navigate(`/cow-work/${id || ""}`);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* ══ SUMMARY CARD ══ */}
      <div
        className="font-['Inter']"
        style={{
          background: "linear-gradient(135deg, #0E2646 0%, #153566 100%)",
          borderRadius: 16,
          padding: 20,
        }}
      >
        {/* Title row */}
        <div className="flex items-center justify-between">
          <p style={{ fontSize: 17, fontWeight: 800, color: "#FFFFFF" }}>
            Inventory Results
          </p>
          <CheckCircleIcon />
        </div>
        {/* Subtitle */}
        <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.50)" }}>
          2026 Spring Calving
        </p>

        {/* Stats row */}
        <div className="flex mt-4" style={{ gap: 0 }}>
          {[
            { value: String(expected), label: "EXPECTED", color: "rgba(255,255,255,0.50)" },
            { value: String(accounted), label: "ACCOUNTED", color: "#55BAAA" },
            { value: String(missing), label: "MISSING", color: "#E74C3C" },
            { value: String(unexpected), label: "UNEXPECTED", color: "#F3D12A" },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 text-center">
              <p style={{ fontSize: 24, fontWeight: 800, color: stat.color, lineHeight: 1.2 }}>
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: stat.color,
                  letterSpacing: "0.06em",
                  marginTop: 2,
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 12 }}>
          <div
            className="rounded-full overflow-hidden"
            style={{ height: 6, backgroundColor: "rgba(255,255,255,0.10)" }}
          >
            <div
              className="rounded-full h-full"
              style={{
                width: `${pct}%`,
                background: "#55BAAA",
              }}
            />
          </div>
          <p
            className="text-right"
            style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.40)", marginTop: 4 }}
          >
            {pct}% accounted
          </p>
        </div>
      </div>

      {/* ══ EXPANDABLE SECTIONS ══ */}
      <div className="space-y-4" style={{ marginTop: 16 }}>
        {/* ── SECTION 1: ACCOUNTED ── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #D4D4D0" }}
        >
          <button
            type="button"
            onClick={() => setAccountedExpanded(!accountedExpanded)}
            className="w-full flex items-center justify-between cursor-pointer font-['Inter']"
            style={{ padding: "14px 16px", background: "none", border: "none" }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="rounded-full"
                style={{ width: 8, height: 8, backgroundColor: "#55BAAA" }}
              />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>
                Accounted
              </span>
              <span
                className="flex items-center justify-center rounded-full"
                style={{
                  minWidth: 28,
                  height: 20,
                  padding: "0 6px",
                  fontSize: 11,
                  fontWeight: 700,
                  backgroundColor: "rgba(85,186,170,0.10)",
                  color: "#55BAAA",
                }}
              >
                {accounted}
              </span>
            </div>
            <ChevronIcon expanded={accountedExpanded} />
          </button>

          {accountedExpanded && (
            <div style={{ borderTop: "1px solid rgba(212,212,208,0.30)" }}>
              {ACCOUNTED_ANIMALS.map((a, i) => (
                <div
                  key={a.tag}
                  className="flex items-center justify-between font-['Inter']"
                  style={{
                    padding: "10px 16px",
                    borderBottom:
                      i < ACCOUNTED_ANIMALS.length - 1
                        ? "1px solid rgba(212,212,208,0.30)"
                        : "none",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                      {a.tag}
                    </span>
                    <TagDot color={a.color} />
                    <span style={{ fontSize: 12, color: "rgba(26,26,26,0.35)" }}>
                      {a.breed} - {a.type}
                    </span>
                  </div>
                  <CheckIcon />
                </div>
              ))}
              {/* "+ X more" link */}
              <div style={{ padding: "10px 16px" }}>
                <span
                  className="font-['Inter']"
                  style={{ fontSize: 12, fontWeight: 600, color: "#55BAAA" }}
                >
                  + {ACCOUNTED_TOTAL - ACCOUNTED_ANIMALS.length} more
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 2: MISSING ── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #D4D4D0" }}
        >
          <button
            type="button"
            onClick={() => setMissingExpanded(!missingExpanded)}
            className="w-full flex items-center justify-between cursor-pointer font-['Inter']"
            style={{ padding: "14px 16px", background: "none", border: "none" }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="rounded-full"
                style={{ width: 8, height: 8, backgroundColor: "#E74C3C" }}
              />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>
                Missing
              </span>
              <span
                className="flex items-center justify-center rounded-full"
                style={{
                  minWidth: 28,
                  height: 20,
                  padding: "0 6px",
                  fontSize: 11,
                  fontWeight: 700,
                  backgroundColor: "#FFEBEE",
                  color: "#C62828",
                }}
              >
                {missing}
              </span>
            </div>
            <ChevronIcon expanded={missingExpanded} />
          </button>

          {missingExpanded && (
            <div style={{ borderTop: "1px solid rgba(212,212,208,0.30)" }}>
              {MISSING_ANIMALS.map((a, i) => {
                const resolution = missingResolutions[a.tag] || "";
                const borderColor = resolution
                  ? getResolutionBorderColor(resolution)
                  : "#D4D4D0";
                const showMoveGroup = resolution === "Moved to Another Group";

                return (
                  <div
                    key={a.tag}
                    className="font-['Inter']"
                    style={{
                      padding: "14px 16px",
                      borderBottom:
                        i < MISSING_ANIMALS.length - 1
                          ? "1px solid rgba(212,212,208,0.30)"
                          : "none",
                    }}
                  >
                    {/* Animal info row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                          {a.tag}
                        </span>
                        <TagDot color={a.color} />
                        <span style={{ fontSize: 12, color: "rgba(26,26,26,0.35)" }}>
                          {a.breed} - {a.type} - {a.year}
                        </span>
                      </div>
                      <XIcon />
                    </div>

                    {/* Resolution dropdown */}
                    <div style={{ marginTop: 8 }}>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "rgba(26,26,26,0.40)",
                          marginBottom: 4,
                        }}
                      >
                        Resolution
                      </p>
                      <div className="relative">
                        <select
                          value={resolution}
                          onChange={(e) => {
                            setMissingResolutions((prev) => ({
                              ...prev,
                              [a.tag]: e.target.value,
                            }));
                            // Clear move group if not "Moved"
                            if (e.target.value !== "Moved to Another Group") {
                              setMissingMoveGroups((prev) => {
                                const copy = { ...prev };
                                delete copy[a.tag];
                                return copy;
                              });
                            }
                          }}
                          className="w-full appearance-none cursor-pointer outline-none transition-all"
                          style={{
                            height: 36,
                            paddingLeft: 12,
                            paddingRight: 32,
                            borderRadius: 8,
                            border: `1px solid ${borderColor}`,
                            backgroundColor: "#FFFFFF",
                            fontSize: 13,
                            fontFamily: "'Inter', sans-serif",
                            color: resolution ? "#1A1A1A" : "rgba(26,26,26,0.30)",
                          }}
                        >
                          <option value="" disabled>
                            Select action...
                          </option>
                          {MISSING_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} style={{ color: "#1A1A1A" }}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <DropdownChevron />
                      </div>

                      {/* Secondary: Move to Group */}
                      {showMoveGroup && (
                        <div style={{ marginTop: 6 }}>
                          <p
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "rgba(26,26,26,0.40)",
                              marginBottom: 4,
                            }}
                          >
                            Move to Group
                          </p>
                          <div className="relative">
                            <select
                              value={missingMoveGroups[a.tag] || ""}
                              onChange={(e) =>
                                setMissingMoveGroups((prev) => ({
                                  ...prev,
                                  [a.tag]: e.target.value,
                                }))
                              }
                              className="w-full appearance-none cursor-pointer outline-none transition-all"
                              style={{
                                height: 36,
                                paddingLeft: 12,
                                paddingRight: 32,
                                borderRadius: 8,
                                border: "1px solid #E65100",
                                backgroundColor: "#FFFFFF",
                                fontSize: 13,
                                fontFamily: "'Inter', sans-serif",
                                color: missingMoveGroups[a.tag] ? "#1A1A1A" : "rgba(26,26,26,0.30)",
                              }}
                            >
                              <option value="" disabled>
                                Select group...
                              </option>
                              {GROUP_OPTIONS.map((g) => (
                                <option key={g} value={g} style={{ color: "#1A1A1A" }}>
                                  {g}
                                </option>
                              ))}
                            </select>
                            <DropdownChevron />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Unresolved warning */}
          {unresolvedCount > 0 && (
            <div
              className="flex items-center gap-2 font-['Inter']"
              style={{
                margin: "0 16px 12px",
                padding: "8px 12px",
                borderRadius: 8,
                backgroundColor: "#FFF8E1",
              }}
            >
              <AlertTriangleIcon />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#E67E22" }}>
                {unresolvedCount} animal{unresolvedCount > 1 ? "s" : ""} still unresolved
              </span>
            </div>
          )}
        </div>

        {/* ── SECTION 3: UNEXPECTED ── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #D4D4D0" }}
        >
          <button
            type="button"
            onClick={() => setUnexpectedExpanded(!unexpectedExpanded)}
            className="w-full flex items-center justify-between cursor-pointer font-['Inter']"
            style={{ padding: "14px 16px", background: "none", border: "none" }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="rounded-full"
                style={{ width: 8, height: 8, backgroundColor: "#F3D12A" }}
              />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>
                Unexpected
              </span>
              <span
                className="flex items-center justify-center rounded-full"
                style={{
                  minWidth: 28,
                  height: 20,
                  padding: "0 6px",
                  fontSize: 11,
                  fontWeight: 700,
                  backgroundColor: "#FFF8E1",
                  color: "#B8860B",
                }}
              >
                {unexpected}
              </span>
            </div>
            <ChevronIcon expanded={unexpectedExpanded} />
          </button>

          {unexpectedExpanded && (
            <div style={{ borderTop: "1px solid rgba(212,212,208,0.30)" }}>
              {UNEXPECTED_ANIMALS.map((a, i) => {
                const resolution = unexpectedResolutions[a.tag] || "";
                const borderColor = resolution
                  ? getResolutionBorderColor(resolution)
                  : "#D4D4D0";

                return (
                  <div
                    key={a.tag}
                    className="font-['Inter']"
                    style={{
                      padding: "14px 16px",
                      borderBottom:
                        i < UNEXPECTED_ANIMALS.length - 1
                          ? "1px solid rgba(212,212,208,0.30)"
                          : "none",
                    }}
                  >
                    {/* Animal info row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                          {a.tag}
                        </span>
                        <TagDot color={a.color} />
                        <span style={{ fontSize: 12, color: "rgba(26,26,26,0.35)" }}>
                          {a.breed} - {a.type} - {a.year}
                        </span>
                      </div>
                      <QuestionIcon />
                    </div>

                    {/* Current group line */}
                    <p style={{ fontSize: 11, color: "rgba(26,26,26,0.30)", marginTop: 2 }}>
                      Currently in: {a.currentGroup}
                    </p>

                    {/* Resolution dropdown */}
                    <div style={{ marginTop: 8 }}>
                      <div className="relative">
                        <select
                          value={resolution}
                          onChange={(e) =>
                            setUnexpectedResolutions((prev) => ({
                              ...prev,
                              [a.tag]: e.target.value,
                            }))
                          }
                          className="w-full appearance-none cursor-pointer outline-none transition-all"
                          style={{
                            height: 36,
                            paddingLeft: 12,
                            paddingRight: 32,
                            borderRadius: 8,
                            border: `1px solid ${borderColor}`,
                            backgroundColor: "#FFFFFF",
                            fontSize: 13,
                            fontFamily: "'Inter', sans-serif",
                            color: resolution ? "#1A1A1A" : "rgba(26,26,26,0.30)",
                          }}
                        >
                          <option value="" disabled>
                            Select action...
                          </option>
                          {UNEXPECTED_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} style={{ color: "#1A1A1A" }}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <DropdownChevron />
                      </div>

                      {/* "Add to Group" confirmation */}
                      {resolution === "Add to Group" && (
                        <p style={{ fontSize: 11, color: "#55BAAA", marginTop: 4 }}>
                          Will be added to 2026 Spring Calving
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ══ ACTION BUTTONS ══ */}
      <div style={{ marginTop: 24 }} className="space-y-3">
        {/* Finalize */}
        <button
          type="button"
          disabled={!canFinalize}
          onClick={handleFinalize}
          className="w-full cursor-pointer font-['Inter'] transition-all"
          style={{
            height: 48,
            borderRadius: 9999,
            border: "none",
            backgroundColor: "#F3D12A",
            fontSize: 15,
            fontWeight: 700,
            color: "#1A1A1A",
            opacity: canFinalize ? 1 : 0.5,
            cursor: canFinalize ? "pointer" : "not-allowed",
          }}
        >
          Finalize Inventory
        </button>

        {/* Save Draft */}
        <button
          type="button"
          onClick={handleSaveDraft}
          className="w-full cursor-pointer font-['Inter'] transition-all"
          style={{
            height: 40,
            borderRadius: 9999,
            border: "1.5px solid #D4D4D0",
            backgroundColor: "#FFFFFF",
            fontSize: 13,
            fontWeight: 600,
            color: "#0E2646",
          }}
        >
          Save Draft
        </button>

        {/* Disclaimer */}
        <p
          className="text-center font-['Inter']"
          style={{ fontSize: 11, color: "rgba(26,26,26,0.25)", paddingTop: 2 }}
        >
          Finalizing will update animal records and group membership.
        </p>
      </div>
    </div>
  );
}
