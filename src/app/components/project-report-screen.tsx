import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { FlagIcon } from "./flag-icon";
import { PillButton } from "./pill-button";
import { FormFieldRow } from "./form-field-row";
import { useToast } from "./toast-context";
import { EmailReportDialog } from "./email-report-dialog";

/* ── Toggle Switch ── */
function ToggleSwitch({
  on,
  onChange,
  disabled = false,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!on)}
      className="relative shrink-0 rounded-full transition-colors duration-200 cursor-pointer"
      style={{
        width: 42,
        height: 24,
        backgroundColor: on ? "#55BAAA" : "#D4D4D0",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
      aria-checked={on}
      role="switch"
    >
      <span
        className="absolute top-[2px] rounded-full bg-white transition-transform duration-200 shadow-sm"
        style={{
          width: 20,
          height: 20,
          left: on ? 20 : 2,
        }}
      />
    </button>
  );
}

/* ── Mock data ── */
const mockAnimals = [
  { tag: "4782", weight: "1,247", preg: "Bred", notes: "Normal", flag: "teal" as const },
  { tag: "3091", weight: "983", preg: "Open", notes: "Follow-up Thursday", flag: "gold" as const },
  { tag: "5520", weight: "1,102", preg: "Open", notes: "Chronic limp — cull candidate", flag: "red" as const },
  { tag: "2218", weight: "1,340", preg: "Bred", notes: "Normal", flag: "teal" as const },
  { tag: "8812", weight: "1,156", preg: "Bred", notes: "Normal", flag: "teal" as const },
];

const mockProducts = [
  { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM", headCount: 45, total: "90 mL" },
  { name: "Ivermectin Pour-On", dosage: "1 mL / 22 lbs", route: "Topical", headCount: 45, total: "1.1 L" },
  { name: "Multimin 90", dosage: "1 mL / 100 lbs", route: "SQ", headCount: 38, total: "456 mL" },
];

const matchedTags = [
  "4782", "3091", "5520", "2218", "8812", "4001", "3320", "1192",
  "5018", "2764", "6637", "8100", "4455", "1003", "3928", "5210",
  "7730", "2085", "6401", "9953", "1174", "3849", "5566", "7213",
  "8092", "4618", "2331", "6009", "1456", "3785", "5899", "7041",
  "8234", "4387", "2900", "6150", "1632", "9011",
];

const missingRecon = [
  { tag: "1847", color: "Yellow", type: "Cow" },
  { tag: "6203", color: "Red", type: "Cow" },
  { tag: "4415", color: "Green", type: "Cow" },
  { tag: "7789", color: "White", type: "Cow" },
  { tag: "2950", color: "Pink", type: "Cow" },
];

const extraReconTags = ["9102", "8841"];

/* Preg stage bar data */
const pregStages = [
  { label: "Bred", count: 32, pct: 71, color: "#55BAAA" },
  { label: "Short", count: 3, pct: 7, color: "rgba(85,186,170,0.5)" },
  { label: "Late", count: 2, pct: 4, color: "#F3D12A" },
  { label: "Open", count: 8, pct: 18, color: "#E74C3C" },
];

/* Preg pill helper */
function pregPillStyle(preg: string) {
  if (preg === "Bred") return { bg: "rgba(85,186,170,0.1)", color: "#55BAAA" };
  if (preg === "Open") return { bg: "rgba(231,76,60,0.1)", color: "#E74C3C" };
  if (preg === "Short") return { bg: "rgba(85,186,170,0.08)", color: "rgba(85,186,170,0.7)" };
  if (preg === "Late") return { bg: "rgba(243,209,42,0.12)", color: "#D4A800" };
  return { bg: "rgba(26,26,26,0.06)", color: "rgba(26,26,26,0.5)" };
}

/* ═══════════════════════════════════════════════
   PROJECT REPORT SCREEN
   ═══════════════════════════════════════════════ */
export function ProjectReportScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  /* ── Report builder toggles ── */
  const [showMetrics, setShowMetrics] = useState(true);
  const [showAnimalList, setShowAnimalList] = useState(true);
  const [showRecon, setShowRecon] = useState(false);
  const [showProducts, setShowProducts] = useState(true);

  /* ── Animal list state ── */
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<"tag" | "weight" | "preg" | "notes">("tag");
  const [sortAsc, setSortAsc] = useState(true);
  const [loadedAll, setLoadedAll] = useState(false);

  /* ── Recon bucket expand ── */
  const [matchedExp, setMatchedExp] = useState(false);
  const [missingExp, setMissingExp] = useState(false);
  const [extraExp, setExtraExp] = useState(false);

  /* ── Export dropdown ── */
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  /* ── Email dialog ── */
  const [emailOpen, setEmailOpen] = useState(false);

  /* Close export dropdown on outside click */
  useEffect(() => {
    if (!exportOpen) return;
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportOpen]);

  /* ── Sort handler ── */
  const handleSort = (col: typeof sortCol) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  const filteredAnimals = mockAnimals.filter(
    (a) => !search || a.tag.includes(search) || a.notes.toLowerCase().includes(search.toLowerCase()),
  );

  /* Section header */
  const SectionHead = ({ label }: { label: string }) => (
    <div className="border-t border-[#D4D4D0]/40 pt-3">
      <p className="font-['Inter']" style={{ fontSize: 12, fontWeight: 700, color: "#0E2646" }}>
        {label}
      </p>
    </div>
  );

  return (
    <div className="space-y-5 font-['Inter']">
      {/* ══ SECTION 1: REPORT HEADER CARD ══ */}
      <div className="rounded-2xl px-5 py-5" style={{ backgroundColor: "#0E2646" }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: "#F0F0F0", letterSpacing: "-0.01em" }}>
          Spring Preg Check
        </p>
        <span
          className="inline-block rounded-full mt-1.5"
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.06em",
            padding: "3px 10px",
            backgroundColor: "rgba(240,240,240,0.08)",
            color: "rgba(240,240,240,0.5)",
          }}
        >
          COMPLETED
        </span>
        <p className="mt-3" style={{ fontSize: 12, fontWeight: 500, color: "rgba(240,240,240,0.45)" }}>
          Feb 25, 2026 &nbsp;· &nbsp;PREG &nbsp;· &nbsp;45 head &nbsp;· &nbsp;Spring Calvers
        </p>
        <p className="mt-1" style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.30)" }}>
          Working Facility
        </p>
      </div>

      {/* ══ SECTION 2: REPORT BUILDER ══ */}
      <div>
        <p className="mb-3" style={{ fontSize: 14, fontWeight: 700, color: "#0E2646" }}>
          Report Sections
        </p>
        <div className="space-y-0">
          {[
            { label: "Summary", on: true, onChange: () => {}, disabled: true },
            { label: "Metrics Breakdown", on: showMetrics, onChange: setShowMetrics, disabled: false },
            { label: "Animal Detail List", on: showAnimalList, onChange: setShowAnimalList, disabled: false },
            { label: "Reconciliation Results", on: showRecon, onChange: setShowRecon, disabled: false },
            { label: "Products Used", on: showProducts, onChange: setShowProducts, disabled: false },
          ].map((t) => (
            <div key={t.label} className="flex items-center justify-between py-2.5">
              <span style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>{t.label}</span>
              <ToggleSwitch on={t.on} onChange={t.onChange} disabled={t.disabled} />
            </div>
          ))}
        </div>
        <div className="border-t border-[#D4D4D0]/40 mt-1" />
      </div>

      {/* ══ SECTION 3: SUMMARY (always visible) ══ */}
      <div>
        <SectionHead label="Summary" />
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-3">
          {[
            { label: "Date", value: "Feb 25, 2026" },
            { label: "Processing Type", value: "Pregnancy Check" },
            { label: "Group", value: "Spring Calvers" },
            { label: "Cattle Type", value: "Cows" },
            { label: "Location", value: "Working Facility" },
            { label: "Total Head", value: "45" },
            { label: "Operator", value: "bryntvedt1" },
            { label: "Project ID", value: "25Feb2026-SpringCalvers-PREG", mono: true },
          ].map((kv) => (
            <div key={kv.label}>
              <p
                className="uppercase"
                style={{ fontSize: 11, fontWeight: 600, color: "rgba(26,26,26,0.35)", letterSpacing: "0.06em" }}
              >
                {kv.label}
              </p>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1A1A1A",
                  marginTop: 1,
                  fontFamily: (kv as any).mono ? "'Geist Mono', monospace" : "'Inter', sans-serif",
                  wordBreak: "break-all",
                }}
              >
                {kv.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SECTION 4: METRICS BREAKDOWN ══ */}
      {showMetrics && (
        <div>
          <SectionHead label="Metrics — Pregnancy Check" />

          {/* Big numbers */}
          <div className="grid grid-cols-3 gap-2.5 mt-3">
            {[
              { label: "Total", value: "45" },
              { label: "Avg Weight", value: "1,166" },
              { label: "Avg Days", value: "127" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl bg-white border border-[#D4D4D0]/60 p-3 text-center"
              >
                <p
                  className="uppercase"
                  style={{ fontSize: 9, fontWeight: 600, color: "rgba(26,26,26,0.35)", letterSpacing: "0.06em" }}
                >
                  {m.label}
                </p>
                <p className="mt-1" style={{ fontSize: 24, fontWeight: 800, color: "#0E2646", lineHeight: 1 }}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          {/* Stacked bar */}
          <div className="mt-4">
            <div className="h-[20px] rounded-full overflow-hidden flex w-full">
              {pregStages.map((s) => (
                <div
                  key={s.label}
                  style={{ width: `${s.pct}%`, backgroundColor: s.color, minWidth: s.pct > 0 ? 4 : 0 }}
                />
              ))}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {pregStages.map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span
                    className="rounded-full shrink-0"
                    style={{ width: 8, height: 8, backgroundColor: s.color }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#1A1A1A" }}>
                    {s.label}: {s.count} ({s.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Calf sex */}
          <p className="mt-3" style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>
            Bull: 18 &nbsp;· &nbsp;Heifer: 14 &nbsp;· &nbsp;Unknown: 13
          </p>
        </div>
      )}

      {/* ══ SECTION 5: PRODUCTS USED ══ */}
      {showProducts && (
        <div>
          <SectionHead label="Products Used" />
          <div className="space-y-2 mt-3">
            {mockProducts.map((p) => (
              <div
                key={p.name}
                className="rounded-xl px-4 py-3"
                style={{ backgroundColor: "#0E2646" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#F0F0F0", lineHeight: 1.3 }}>
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
                <p className="mt-1" style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.45)" }}>
                  Dosage: {p.dosage} &nbsp;· &nbsp;Administered: {p.headCount} head &nbsp;· &nbsp;Total: {p.total}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ SECTION 6: ANIMAL DETAIL LIST ══ */}
      {showAnimalList && (
        <div>
          <SectionHead label="Animal Records (45)" />

          {/* Search */}
          <div className="relative mt-3">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="16" height="16" viewBox="0 0 16 16" fill="none"
            >
              <circle cx="7" cy="7" r="5" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tag…"
              className="w-full h-[40px] pl-9 pr-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
              style={{ fontSize: 16, fontWeight: 400 }}
            />
          </div>

          {/* Column headers */}
          <div
            className="flex items-center rounded-lg px-3 py-2 mt-3"
            style={{ backgroundColor: "rgba(14,38,70,0.04)" }}
          >
            {([
              { key: "tag" as const, label: "TAG", flex: "flex-1" },
              { key: "weight" as const, label: "WEIGHT", flex: "" },
              { key: "preg" as const, label: "PREG", flex: "" },
              { key: "notes" as const, label: "NOTES", flex: "flex-1" },
            ]).map((col) => {
              const active = sortCol === col.key;
              return (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => handleSort(col.key)}
                  className={`cursor-pointer ${col.flex} ${col.key === "weight" || col.key === "preg" ? "w-[60px] text-center" : ""}`}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: active ? "#0E2646" : "rgba(26,26,26,0.35)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    textAlign: col.key === "notes" ? "left" : undefined,
                  }}
                >
                  {col.label}
                  {active && (
                    <span style={{ fontSize: 8, marginLeft: 2 }}>{sortAsc ? "▲" : "▼"}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Rows */}
          <div className="space-y-1.5 mt-2">
            {filteredAnimals.map((a) => {
              const ps = pregPillStyle(a.preg);
              return (
                <div
                  key={a.tag}
                  className="flex items-center px-3 py-2.5 rounded-lg bg-white"
                  style={{ borderBottom: "1px solid rgba(212,212,208,0.20)" }}
                >
                  {/* Tag */}
                  <div className="flex-1 flex items-center gap-1.5 min-w-0">
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0E2646" }}>{a.tag}</span>
                    <FlagIcon color={a.flag} size="sm" />
                  </div>
                  {/* Weight */}
                  <span
                    className="w-[60px] text-center"
                    style={{ fontSize: 13, fontWeight: 400, color: "#1A1A1A", fontFamily: "'Geist Mono', monospace" }}
                  >
                    {a.weight}
                  </span>
                  {/* Preg pill */}
                  <div className="w-[60px] flex justify-center">
                    <span
                      className="rounded-full"
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        backgroundColor: ps.bg,
                        color: ps.color,
                      }}
                    >
                      {a.preg}
                    </span>
                  </div>
                  {/* Notes */}
                  <span
                    className="flex-1 truncate text-right"
                    style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.45)" }}
                  >
                    {a.notes}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Load more */}
          {!loadedAll && (
            <button
              type="button"
              onClick={() => setLoadedAll(true)}
              className="w-full text-center mt-3 cursor-pointer"
              style={{ fontSize: 13, fontWeight: 600, color: "#55BAAA", background: "none", border: "none", padding: "4px 0" }}
            >
              Load More (40 remaining)
            </button>
          )}
        </div>
      )}

      {/* ══ SECTION 7: RECONCILIATION RESULTS ══ */}
      {showRecon && (
        <div>
          <SectionHead label="Reconciliation Results" />
          <div className="space-y-2 mt-3">
            {/* Matched */}
            <div className="rounded-xl border border-[#D4D4D0]/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setMatchedExp(!matchedExp)}
                className="w-full flex items-center justify-between px-4 py-2.5 cursor-pointer bg-white"
                style={{ border: "none" }}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full shrink-0" style={{ width: 8, height: 8, backgroundColor: "#55BAAA" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#55BAAA" }}>Matched ({matchedTags.length})</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-200" style={{ transform: matchedExp ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {matchedExp && (
                <div className="px-4 pb-3 flex flex-wrap gap-1.5 border-t border-[#D4D4D0]/40 pt-3">
                  {matchedTags.map((t) => (
                    <span key={t} className="rounded-full" style={{ fontSize: 11, fontWeight: 600, color: "#55BAAA", backgroundColor: "rgba(85,186,170,0.08)", padding: "3px 10px" }}>{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing */}
            <div className="rounded-xl border border-[#D4D4D0]/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setMissingExp(!missingExp)}
                className="w-full flex items-center justify-between px-4 py-2.5 cursor-pointer bg-white"
                style={{ border: "none" }}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full shrink-0" style={{ width: 8, height: 8, backgroundColor: "#D4A800" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#D4A800" }}>Missing ({missingRecon.length})</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-200" style={{ transform: missingExp ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {missingExp && (
                <div className="px-4 pb-3 space-y-1 border-t border-[#D4D4D0]/40 pt-3">
                  {missingRecon.map((a) => (
                    <p key={a.tag} style={{ fontSize: 12, fontWeight: 500, color: "#1A1A1A" }}>
                      {a.tag} <span style={{ color: "rgba(26,26,26,0.45)" }}>· {a.color} · {a.type}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Extra */}
            <div className="rounded-xl border border-[#D4D4D0]/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setExtraExp(!extraExp)}
                className="w-full flex items-center justify-between px-4 py-2.5 cursor-pointer bg-white"
                style={{ border: "none" }}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full shrink-0" style={{ width: 8, height: 8, backgroundColor: "#E74C3C" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#E74C3C" }}>Extra ({extraReconTags.length})</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-200" style={{ transform: extraExp ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {extraExp && (
                <div className="px-4 pb-3 flex flex-wrap gap-1.5 border-t border-[#D4D4D0]/40 pt-3">
                  {extraReconTags.map((t) => (
                    <span key={t} className="rounded-full" style={{ fontSize: 11, fontWeight: 600, color: "#E74C3C", backgroundColor: "rgba(231,76,60,0.08)", padding: "3px 10px" }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ ACTION BUTTONS ══ */}
      <div className="flex gap-3 pt-3 relative">
        {/* Export with dropdown */}
        <div ref={exportRef} className="flex-1 relative">
          <PillButton
            variant="outline"
            size="md"
            onClick={() => setExportOpen(!exportOpen)}
            style={{ width: "100%" }}
          >
            Export
          </PillButton>
          {exportOpen && (
            <div
              className="absolute bottom-full mb-2 left-0 rounded-xl bg-white overflow-hidden z-10"
              style={{
                minWidth: 170,
                boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid rgba(212,212,208,0.5)",
              }}
            >
              {["Excel (.xlsx)", "CSV (.csv)", "PDF"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setExportOpen(false);
                    showToast("success", `${opt} export started`);
                  }}
                  className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
                  style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", background: "none", border: "none" }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1">
          <PillButton size="md" onClick={() => setEmailOpen(true)} style={{ width: "100%" }}>
            Email Report
          </PillButton>
        </div>
      </div>

      {/* ══ EMAIL DIALOG OVERLAY ══ */}
      <EmailReportDialog
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        onSend={() => {
          showToast("success", "Report sent");
        }}
      />
    </div>
  );
}