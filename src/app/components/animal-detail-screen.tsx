import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { CollapsibleSection } from "./collapsible-section";
import { FlagIcon } from "./flag-icon";
import type { FlagColor } from "./flag-icon";
import { PillButton } from "./pill-button";
import { AnimalPickerRow } from "./animal-picker-row";
import { useToast } from "./toast-context";

/* ── Mock animal record data ── */
const animalRecord = {
  tag: "3309",
  tagColor: "Pink",
  sex: "Cow",
  animalType: "Cow",
  yearBorn: "2020",
  status: "Active",
  flag: "teal" as FlagColor | null,
  flagReason: "Spring calving group — monitor BCS",
  eid: "982 000364507221",
  eid2: "",
  otherId: "SBR-3309",
  lifetimeId: "USA3309-2020",
  memo: "Good disposition, easy handler. Spring calving group.",
  notes: "Weight recorded — 1,187 lbs",
  weight: "1,187",
  quickNotes: ["Hard keeper", "Good mother"],
  calvingHistory: [
    {
      date: "Mar 22, 2025",
      calfTag: "8841",
      calfSex: "Bull",
      birthWeight: "85 lbs",
      assistance: "None",
      notes: "Normal birth — strong calf",
    },
    {
      date: "Apr 8, 2024",
      calfTag: "7503",
      calfSex: "Heifer",
      birthWeight: "72 lbs",
      assistance: "None",
      notes: "Normal birth",
    },
    {
      date: "Mar 30, 2023",
      calfTag: "6218",
      calfSex: "Bull",
      birthWeight: "90 lbs",
      assistance: "Easy pull",
      notes: "Slight assistance needed, large calf",
    },
  ],
  workHistory: [
    {
      date: "Feb 24, 2026",
      project: "Spring Preg Check",
      weight: "1,187",
      preg: "Confirmed",
      notes: "Weight recorded — healthy, good condition",
      flag: "teal" as FlagColor | null,
      treatments: [
        { name: "Multimin 90", dosage: "12 mL", route: "SQ" },
      ],
    },
    {
      date: "Jan 14, 2026",
      project: "Winter Vaccination",
      weight: "1,165",
      preg: "Confirmed",
      notes: "Normal — routine vaccination",
      flag: null,
      treatments: [
        { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" },
        { name: "Ivermectin Pour-On", dosage: "55 mL", route: "Topical" },
      ],
    },
    {
      date: "Oct 15, 2025",
      project: "Fall Processing",
      weight: "1,152",
      preg: "Confirmed",
      notes: "Pour-on dewormer applied, weaned calf #8841",
      flag: null,
      treatments: [
        { name: "Dectomax Pour-On", dosage: "50 mL", route: "Topical" },
      ],
    },
    {
      date: "May 22, 2025",
      project: "Spring Preg Check 2025",
      weight: "1,120",
      preg: "Confirmed",
      notes: "Normal — healthy, good condition",
      flag: null,
      treatments: [
        { name: "Multimin 90", dosage: "12 mL", route: "SQ" },
      ],
    },
  ],
  weightHistory: [
    { weight: "1,187 lbs", date: "Feb 24, 2026", project: "Spring Preg Check", note: "Good condition" },
    { weight: "1,165 lbs", date: "Jan 14, 2026", project: "Winter Vaccination", note: "" },
    { weight: "1,152 lbs", date: "Oct 15, 2025", project: "Fall Processing", note: "" },
    { weight: "1,120 lbs", date: "May 22, 2025", project: "Spring Preg Check 2025", note: "" },
    { weight: "1,098 lbs", date: "Nov 3, 2024", project: "Fall Processing 2024", note: "" },
  ],
  idHistory: [
    { field: "Tag changed", oldNew: "3108 → 3309", date: "Feb 24, 2026", changedBy: "J. Olson" },
    { field: "Tag Color changed", oldNew: "Yellow → Pink", date: "Oct 12, 2023", changedBy: "J. Olson" },
    { field: "EID changed", oldNew: "Set to 982 000364507221", date: "Mar 15, 2022", changedBy: "Admin" },
  ],
};

const flagLabels: Record<FlagColor, string> = {
  teal: "Management",
  gold: "Monitor",
  red: "Critical",
};

const TAG_COLOR_DOT: Record<string, string> = {
  Pink: "#E8A0BF",
  Yellow: "#F3D12A",
  Orange: "#E8A046",
  Green: "#55BAAA",
  Blue: "#5B9BD5",
  White: "#E0E0E0",
  Red: "#D4606E",
  Purple: "#9B72CF",
  "No Tag": "#999999",
};

/* ── Component ─────────────────────────────── */
export function AnimalDetailScreen() {
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");
  const navigate = useNavigate();
  const { tag } = useParams<{ tag: string }>();
  const { showToast } = useToast();

  /* Memo state */
  const [memo, setMemo] = useState(animalRecord.memo);

  /* Form state with pre-filled values */
  const [fields, setFields] = useState({
    tag: animalRecord.tag,
    tagColor: animalRecord.tagColor,
    eid: animalRecord.eid,
    sex: animalRecord.sex,
    animalType: animalRecord.animalType,
    yearBorn: animalRecord.yearBorn,
    status: animalRecord.status,
    flag: "Management",
    flagReason: animalRecord.flagReason,
  });

  const [selectedQuickNotes, setSelectedQuickNotes] = useState<string[]>(animalRecord.quickNotes);

  /* Pedigree state */
  const [sire, setSire] = useState("");
  const [dam, setDam] = useState("");

  const quickNoteOptions = [
    "Docile", "Aggressive", "Flighty", "Hard keeper", "Easy keeper",
    "Good mother", "Poor mother", "Calving ease", "Calving difficulty",
    "Prolapse history", "Foot rot", "Pinkeye", "Lump jaw",
    "Slow breeder", "Heavy milker", "Light milker",
  ];

  const toggleQuickNote = (note: string) => {
    setSelectedQuickNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const update = (key: keyof typeof fields) => (val: string) =>
    setFields((prev) => ({ ...prev, [key]: val }));

  /* Quick notes pills for header card (max 3 visible) */
  const visibleNotes = selectedQuickNotes.slice(0, 3);
  const extraNotesCount = selectedQuickNotes.length - 3;

  return (
    <div className="space-y-0">
      {/* ══ GRADIENT HEADER CARD ══ */}
      <div
        className="rounded-2xl px-5 py-5 font-['Inter']"
        style={{
          background: "linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left — Tag & info */}
          <div className="min-w-0 flex-1">
            <p
              className="text-white"
              style={{
                fontSize: 36,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {animalRecord.tag}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className="rounded-full shrink-0"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: TAG_COLOR_DOT[animalRecord.tagColor] || "#E8A0BF",
                  display: "inline-block",
                }}
              />
              <p
                className="truncate"
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: "rgba(240,240,240,0.45)",
                  lineHeight: 1.4,
                }}
              >
                {animalRecord.tagColor} · {animalRecord.sex} · {animalRecord.yearBorn}
              </p>
            </div>
            <p
              className="mt-0.5"
              style={{ fontSize: 11, fontWeight: 500, color: "#A8E6DA" }}
            >
              {animalRecord.status} · {animalRecord.weight} lbs
            </p>

            {/* Quick notes pills */}
            {selectedQuickNotes.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 mt-2.5">
                {visibleNotes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full font-['Inter']"
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "rgba(240,240,240,0.8)",
                    }}
                  >
                    {note}
                  </span>
                ))}
                {extraNotesCount > 0 && (
                  <span
                    className="rounded-full font-['Inter']"
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "rgba(240,240,240,0.8)",
                    }}
                  >
                    +{extraNotesCount} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right — Flag + label */}
          {animalRecord.flag && (
            <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
              <FlagIcon color={animalRecord.flag} size="md" />
              <span
                className="font-['Inter'] text-center"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: animalRecord.flag === "teal" ? "#55BAAA" : animalRecord.flag === "gold" ? "#F0C05A" : "#9B2335",
                }}
              >
                {flagLabels[animalRecord.flag]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ══ MEMO FIELD ══ */}
      <div
        className="mt-3 rounded-xl bg-white font-['Inter']"
        style={{ border: "1px solid rgba(212,212,208,0.6)", padding: "14px 16px" }}
      >
        <p
          className="uppercase"
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "rgba(26,26,26,0.4)",
          }}
        >
          Memo
        </p>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full mt-1.5 outline-none resize-none font-['Inter'] transition-all"
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: "#1A1A1A",
            lineHeight: 1.5,
            minHeight: 64,
            backgroundColor: "#F5F5F0",
            border: "1px solid #D4D4D0",
            borderRadius: 8,
            padding: "10px 12px",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#F3D12A";
            e.currentTarget.style.boxShadow = "0 0 0 2px rgba(243,209,42,0.25)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#D4D4D0";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {/* ══ TABS ══ */}
      <div className="mt-4 flex border-b border-[#D4D4D0]/50">
        {(["details", "history"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="flex-1 pb-3 cursor-pointer transition-colors duration-150 font-['Inter'] relative"
              style={{
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#0E2646" : "rgba(26,26,26,0.35)",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}

              {/* Yellow underline for active tab */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    width: 48,
                    height: 3,
                    backgroundColor: "#F3D12A",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ══ TAB CONTENT ══ */}
      <div className="py-4">
        {/* ── DETAILS TAB ── */}
        {activeTab === "details" && (
          <div className="space-y-3">
            {/* ── Edit Details (collapsed by default) ── */}
            <CollapsibleSection
              title="Edit Details"
              defaultOpen={false}
              collapsedContent={
                <p
                  className="font-['Inter'] mt-1.5 truncate"
                  style={{ fontSize: 12, fontWeight: 500, color: "rgba(26,26,26,0.4)" }}
                >
                  {fields.tag} · {fields.tagColor} · {fields.status} · {fields.flag}
                </p>
              }
            >
              <div className="pt-2 space-y-0">
                {/* Sub-group 1 — Identity */}
                <p
                  className="font-['Inter'] uppercase"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "rgba(26,26,26,0.35)",
                    marginBottom: 8,
                  }}
                >
                  Identity
                </p>
                <div className="space-y-2.5">
                  <FormFieldRow label="Tag" value={fields.tag} onChange={update("tag")} placeholder="Tag number" />
                  <FormSelectRow label="Tag Color" value={fields.tagColor} onChange={update("tagColor")} placeholder="Select color" options={["Pink", "Yellow", "Orange", "Green", "Blue", "White", "Red", "Purple", "No Tag"]} />
                  <FormFieldRow label="EID" value={fields.eid} onChange={update("eid")} placeholder="Electronic ID" />
                  <FormSelectRow label="Sex" value={fields.sex} onChange={update("sex")} placeholder="Select sex" options={["Bull", "Cow", "Steer", "Spayed Heifer", "Heifer"]} />
                  <FormSelectRow label="Type" value={fields.animalType} onChange={update("animalType")} placeholder="Select type" options={["Calf", "Yearling", "Feeder", "Cow", "Bull", "Replacement Heifer"]} />
                  <FormSelectRow label="Year Born" value={fields.yearBorn} onChange={update("yearBorn")} placeholder="Select year" options={["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"]} />
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid rgba(26,26,26,0.06)", margin: "12px 0" }} />

                {/* Sub-group 2 — Status & Flag */}
                <p
                  className="font-['Inter'] uppercase"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "rgba(26,26,26,0.35)",
                    marginBottom: 8,
                  }}
                >
                  Status & Flag
                </p>
                <div className="space-y-2.5">
                  <FormSelectRow label="Status" value={fields.status} onChange={update("status")} placeholder="Select status" options={["Active", "Sold", "Dead", "Culled", "Missing"]} />
                  <FormSelectRow label="Flag" value={fields.flag} onChange={update("flag")} placeholder="Select flag" options={["None", "Management", "Production", "Cull"]} />
                  <FormFieldRow label="Flag Reason" value={fields.flagReason} onChange={update("flagReason")} placeholder="Reason for flag" />
                </div>

                {/* Save button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => showToast("success", "Changes saved")}
                    className="w-full rounded-full cursor-pointer font-['Inter'] transition-all active:scale-[0.97]"
                    style={{
                      height: 44,
                      backgroundColor: "#0E2646",
                      color: "white",
                      fontSize: 14,
                      fontWeight: 600,
                      border: "none",
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </CollapsibleSection>

            {/* ── Quick Notes (keep existing) ── */}
            <CollapsibleSection
              title="Quick Notes"
              collapsedContent={
                selectedQuickNotes.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {selectedQuickNotes.map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-1 rounded-full font-['Inter']"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          backgroundColor: "#0E2646",
                          color: "white",
                        }}
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                ) : undefined
              }
            >
              <div className="flex flex-wrap gap-2 pt-2">
                {quickNoteOptions.map((note) => {
                  const isSelected = selectedQuickNotes.includes(note);
                  return (
                    <button
                      key={note}
                      type="button"
                      onClick={() => toggleQuickNote(note)}
                      className="px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-150 font-['Inter']"
                      style={{
                        fontSize: 13,
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected ? "#0E2646" : "white",
                        borderColor: isSelected ? "#0E2646" : "#D4D4D0",
                        color: isSelected ? "white" : "#1A1A1A",
                      }}
                    >
                      {note}
                    </button>
                  );
                })}
              </div>
            </CollapsibleSection>

            {/* ── Pedigree ── */}
            <CollapsibleSection title="Pedigree">
              <div className="space-y-2.5 pt-2">
                <AnimalPickerRow label="Sire" value={sire} onChange={setSire} placeholder="Search sire by tag…" filterSex={["Bull"]} />
                <AnimalPickerRow label="Dam" value={dam} onChange={setDam} placeholder="Search dam by tag…" filterSex={["Cow", "Heifer"]} />
                <FormFieldRow label="Reg. Name" placeholder="Registration name" />
                <FormFieldRow label="Reg. No." placeholder="Registration number" />
              </div>
            </CollapsibleSection>
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {/* ── Calving Records ── */}
            <CollapsibleSection
              title={`Calving Records (${animalRecord.calvingHistory.length})`}
              collapsedContent={
                animalRecord.calvingHistory.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {animalRecord.calvingHistory.map((c, i) => (
                      <span
                        key={i}
                        className="rounded-full font-['Inter']"
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 8px",
                          backgroundColor: "rgba(243,209,42,0.12)",
                          color: "#B8960F",
                        }}
                      >
                        {c.calfTag} · {c.calfSex} · {c.date.split(",")[0].split(" ")[0]}
                      </span>
                    ))}
                  </div>
                ) : undefined
              }
            >
              <div className="space-y-2 pt-2">
                {animalRecord.calvingHistory.length === 0 ? (
                  <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 13 }}>
                    No calving records
                  </p>
                ) : (
                  animalRecord.calvingHistory.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-xl px-4 py-3.5 font-['Inter']"
                      style={{ backgroundColor: "#0E2646" }}
                    >
                      {/* Calf tag + sex */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[#F0F0F0]" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
                          Calf {c.calfTag}
                        </p>
                        <span
                          className="rounded-full"
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            padding: "2px 8px",
                            backgroundColor: c.calfSex === "Bull" ? "rgba(85,186,170,0.15)" : "rgba(232,160,191,0.2)",
                            color: c.calfSex === "Bull" ? "#55BAAA" : "#E8A0BF",
                          }}
                        >
                          {c.calfSex}
                        </span>
                      </div>
                      <p
                        className="mt-0.5"
                        style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.35)" }}
                      >
                        {c.date}
                      </p>

                      {/* Stats row */}
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className="rounded-full"
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            backgroundColor: "rgba(240,240,240,0.08)",
                            color: "rgba(240,240,240,0.6)",
                          }}
                        >
                          {c.birthWeight}
                        </span>
                        <span
                          className="rounded-full"
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            backgroundColor: c.assistance === "None" ? "rgba(240,240,240,0.08)" : "rgba(155,35,53,0.15)",
                            color: c.assistance === "None" ? "rgba(240,240,240,0.6)" : "#D4606E",
                          }}
                        >
                          Assist: {c.assistance}
                        </span>
                      </div>

                      {/* Notes */}
                      {c.notes && (
                        <p
                          className="mt-2"
                          style={{ fontSize: 12, fontWeight: 400, color: "rgba(240,240,240,0.45)", lineHeight: 1.4 }}
                        >
                          {c.notes}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CollapsibleSection>

            {/* ── Work Records ── */}
            <CollapsibleSection
              title={`Work Records (${animalRecord.workHistory.length})`}
              collapsedContent={
                animalRecord.workHistory.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {animalRecord.workHistory.map((h, i) => (
                      <span
                        key={i}
                        className="rounded-full font-['Inter']"
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 8px",
                          backgroundColor: "rgba(14,38,70,0.08)",
                          color: "#0E2646",
                        }}
                      >
                        {h.project} · {h.date.split(",")[0]}
                      </span>
                    ))}
                  </div>
                ) : undefined
              }
            >
              <div className="space-y-2 pt-2">
                {animalRecord.workHistory.length === 0 ? (
                  <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 13 }}>
                    No previous records
                  </p>
                ) : (
                  animalRecord.workHistory.map((h, i) => (
                    <div
                      key={i}
                      className="rounded-xl px-4 py-3.5 font-['Inter']"
                      style={{ backgroundColor: "#0E2646" }}
                    >
                      {/* Header row: project + flag */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[#F0F0F0]" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
                          {h.project}
                        </p>
                        {h.flag && <FlagIcon color={h.flag} size="sm" />}
                      </div>
                      <p
                        className="mt-0.5"
                        style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.35)" }}
                      >
                        {h.date}
                      </p>

                      {/* Quick stats row */}
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className="rounded-full"
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            backgroundColor: "rgba(240,240,240,0.08)",
                            color: "rgba(240,240,240,0.6)",
                          }}
                        >
                          {h.weight} lbs
                        </span>
                        <span
                          className="rounded-full"
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            backgroundColor: "rgba(240,240,240,0.08)",
                            color: "rgba(240,240,240,0.6)",
                          }}
                        >
                          Preg: {h.preg}
                        </span>
                      </div>

                      {/* Notes */}
                      <p
                        className="mt-2 truncate"
                        style={{ fontSize: 12, fontWeight: 400, color: "rgba(240,240,240,0.45)", lineHeight: 1.4 }}
                      >
                        {h.notes}
                      </p>

                      {/* Treatments */}
                      {h.treatments.length > 0 && (
                        <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(240,240,240,0.06)" }}>
                          <p
                            className="uppercase"
                            style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(240,240,240,0.25)", marginBottom: 4 }}
                          >
                            Treatments
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {h.treatments.map((t, j) => (
                              <span
                                key={j}
                                className="rounded-full"
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  padding: "2px 8px",
                                  backgroundColor: "rgba(85,186,170,0.12)",
                                  color: "#55BAAA",
                                }}
                              >
                                {t.name} · {t.dosage}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CollapsibleSection>

            {/* ── Weight History ── */}
            <CollapsibleSection
              title="Weight History"
              defaultOpen={false}
              collapsedContent={
                animalRecord.weightHistory.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span
                      className="rounded-full font-['Inter']"
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 8px",
                        backgroundColor: "rgba(14,38,70,0.08)",
                        color: "#0E2646",
                      }}
                    >
                      {animalRecord.weightHistory[0].weight} · {animalRecord.weightHistory[0].date}
                    </span>
                  </div>
                ) : undefined
              }
            >
              <div className="pt-1">
                {animalRecord.weightHistory.map((w, i) => (
                  <div
                    key={i}
                    className="font-['Inter']"
                    style={{
                      padding: "10px 0",
                      borderBottom: i < animalRecord.weightHistory.length - 1 ? "1px solid rgba(26,26,26,0.06)" : "none",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>
                        {w.weight}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(26,26,26,0.4)" }}>
                        {w.date}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(26,26,26,0.5)", marginTop: 1 }}>
                      {w.project}
                    </p>
                    {w.note && (
                      <p style={{ fontSize: 12, color: "rgba(26,26,26,0.4)", fontStyle: "italic", marginTop: 1 }}>
                        {w.note}
                      </p>
                    )}
                  </div>
                ))}
                {/* Trend line */}
                <p
                  className="font-['Inter']"
                  style={{ fontSize: 11, fontWeight: 600, color: "#55BAAA", marginTop: 8 }}
                >
                  +89 lbs over last 12 months
                </p>
              </div>
            </CollapsibleSection>

            {/* ── ID History ── */}
            <CollapsibleSection
              title="ID History"
              defaultOpen={false}
              collapsedContent={
                <p
                  className="font-['Inter'] mt-1.5"
                  style={{ fontSize: 12, fontWeight: 500, color: "rgba(26,26,26,0.4)" }}
                >
                  {animalRecord.idHistory.length} changes recorded
                </p>
              }
            >
              <div className="pt-1">
                {animalRecord.idHistory.map((entry, i) => (
                  <div
                    key={i}
                    className="font-['Inter'] flex items-start justify-between gap-2"
                    style={{
                      padding: "10px 0",
                      borderBottom: i < animalRecord.idHistory.length - 1 ? "1px solid rgba(26,26,26,0.06)" : "none",
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                        {entry.field}
                      </p>
                      <p style={{ fontSize: 12, color: "rgba(26,26,26,0.5)", marginTop: 2 }}>
                        {entry.oldNew}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p style={{ fontSize: 11, color: "rgba(26,26,26,0.4)" }}>
                        {entry.date}
                      </p>
                      <p style={{ fontSize: 11, color: "rgba(26,26,26,0.4)" }}>
                        {entry.changedBy}
                      </p>
                    </div>
                  </div>
                ))}
                {/* Disclaimer */}
                <p
                  className="font-['Inter']"
                  style={{ fontSize: 11, color: "rgba(26,26,26,0.3)", fontStyle: "italic", marginTop: 8 }}
                >
                  ID history is read-only and cannot be deleted.
                </p>
              </div>
            </CollapsibleSection>

            {/* Back button */}
            <div className="pt-4">
              <PillButton
                variant="outline"
                size="md"
                onClick={() => navigate(-1)}
                style={{
                  width: "100%",
                  height: 40,
                  borderWidth: 1.5,
                  borderColor: "#D4D4D0",
                }}
              >
                Back to Animals
              </PillButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}