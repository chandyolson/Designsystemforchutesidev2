import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { CollapsibleSection } from "./collapsible-section";
import { FlagIcon } from "./flag-icon";
import type { FlagColor } from "./flag-icon";
import { PillButton } from "./pill-button";
import { AnimalPickerRow } from "./animal-picker-row";

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
};

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

/* ── Component ─────────────────────────────── */
export function AnimalDetailScreen() {
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");
  const navigate = useNavigate();
  const { tag } = useParams<{ tag: string }>();

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
    quickNotes: "",
  });

  const [selectedQuickNotes, setSelectedQuickNotes] = useState<string[]>([]);

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
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: "#E8A0BF",
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
                {animalRecord.tagColor} · {animalRecord.sex} · {animalRecord.animalType} · {animalRecord.yearBorn}
              </p>
            </div>
            <p
              className="mt-1"
              style={{ fontSize: 11, fontWeight: 500, color: "#A8E6DA" }}
            >
              {animalRecord.status} · {animalRecord.weight} lbs
            </p>
          </div>

          {/* Right — Flag + label (only if flag is set) */}
          {animalRecord.flag && (
            <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
              <FlagIcon color={animalRecord.flag} size="md" />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: flagColors[animalRecord.flag],
                  letterSpacing: "0.02em",
                }}
              >
                {flagLabels[animalRecord.flag]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ══ TABS ══ */}
      <div className="mt-5 flex border-b border-[#D4D4D0]/50">
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
      <div className="py-5">
        {activeTab === "details" && (
          <div className="space-y-5">
            {/* ── Form Fields ── */}
            <div className="space-y-2.5">
              <FormSelectRow label="Status" value={fields.status} onChange={update("status")} placeholder="Select status" options={["Active", "Sold", "Dead", "Culled", "Missing"]} />
              <FormFieldRow label="Flag" value={fields.flag} onChange={update("flag")} placeholder="Management / Monitor / Critical" />
              <FormFieldRow label="Flag Reason" value={fields.flagReason} onChange={update("flagReason")} placeholder="Reason for flag" />
              <CollapsibleSection
                title="Details"
                collapsedContent={
                  <p
                    className="font-['Inter'] mt-1.5 truncate"
                    style={{ fontSize: 12, fontWeight: 500, color: "rgba(26,26,26,0.4)" }}
                  >
                    {fields.tag} · {fields.tagColor} · {fields.eid} · {fields.sex} · {fields.animalType} · {fields.yearBorn}
                  </p>
                }
              >
                <div className="space-y-2.5 pt-2">
                  <FormFieldRow label="Tag" value={fields.tag} onChange={update("tag")} placeholder="Tag number" />
                  <FormSelectRow label="Tag Color" value={fields.tagColor} onChange={update("tagColor")} placeholder="Select color" options={["Pink", "Yellow", "Orange", "Green", "Blue", "White", "Red", "Purple", "No Tag"]} />
                  <FormFieldRow label="EID" value={fields.eid} onChange={update("eid")} placeholder="Electronic ID" />
                  <FormSelectRow label="Sex" value={fields.sex} onChange={update("sex")} placeholder="Select sex" options={["Bull", "Cow", "Steer", "Spayed Heifer", "Heifer"]} />
                  <FormSelectRow label="Animal Type" value={fields.animalType} onChange={update("animalType")} placeholder="Select type" options={["Calf", "Yearling", "Feeder", "Cow", "Bull", "Replacement Heifer"]} />
                  <FormSelectRow label="Year Born" value={fields.yearBorn} onChange={update("yearBorn")} placeholder="Select year" options={["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"]} />
                </div>
              </CollapsibleSection>
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
            </div>

            {/* ── Pedigree (collapsed) ── */}
            <CollapsibleSection title="Pedigree">
              <div className="space-y-2.5 pt-2">
                <AnimalPickerRow label="Sire" value={sire} onChange={setSire} placeholder="Search sire by tag…" filterSex={["Bull"]} />
                <AnimalPickerRow label="Dam" value={dam} onChange={setDam} placeholder="Search dam by tag…" filterSex={["Cow", "Heifer"]} />
                <FormFieldRow label="Reg. Name" placeholder="Registration name" />
                <FormFieldRow label="Reg. No." placeholder="Registration number" />
              </div>
            </CollapsibleSection>

            {/* ── Save / Cancel ── */}
            <div className="flex gap-3 pt-2">
              <PillButton variant="outline" size="md" onClick={() => navigate(-1)} style={{ flex: 1 }}>
                Cancel
              </PillButton>
              <PillButton size="md" style={{ flex: 1 }}>
                Save Changes
              </PillButton>
            </div>
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === "history" && (
          <div className="space-y-5">
            {/* ── Notes & Memo (always visible at top) ── */}
            <div className="space-y-3">
              <div>
                <p
                  className="font-['Inter'] uppercase mb-1.5"
                  style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#1A1A1A40" }}
                >
                  Latest Notes
                </p>
                <p className="text-[#1A1A1A]/70 font-['Inter']" style={{ fontSize: 13, lineHeight: 1.5 }}>
                  {animalRecord.notes || "No notes"}
                </p>
              </div>
              <div style={{ borderTop: "1px solid rgba(26,26,26,0.06)", paddingTop: 12 }}>
                <p
                  className="font-['Inter'] uppercase mb-1.5"
                  style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#1A1A1A40" }}
                >
                  Animal Memo
                </p>
                <p className="text-[#1A1A1A]/50 font-['Inter']" style={{ fontSize: 13, lineHeight: 1.5 }}>
                  {animalRecord.memo || "No memo"}
                </p>
              </div>
            </div>

            {/* ── Calving Records (collapsible) ── */}
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

            {/* ── Work Records (collapsible) ── */}
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

            {/* ── Animal ID Information (collapsible) ── */}
            <CollapsibleSection title="Animal ID">
              <div className="space-y-2.5 pt-2">
                <FormFieldRow label="Tag" value={animalRecord.tag} placeholder="" />
                <FormFieldRow label="EID" value={animalRecord.eid} placeholder="" />
                {animalRecord.eid2 && <FormFieldRow label="EID 2" value={animalRecord.eid2} placeholder="" />}
                <FormFieldRow label="Other ID" value={animalRecord.otherId} placeholder="" />
                <FormFieldRow label="Lifetime ID" value={animalRecord.lifetimeId} placeholder="" />
                <FormFieldRow label="Sex" value={animalRecord.sex} placeholder="" />
                <FormFieldRow label="Type" value={animalRecord.animalType} placeholder="" />
                <FormFieldRow label="Year Born" value={animalRecord.yearBorn} placeholder="" />
                <FormFieldRow label="Tag Color" value={animalRecord.tagColor} placeholder="" />
              </div>
            </CollapsibleSection>

            {/* Back */}
            <div className="pt-2">
              <PillButton variant="outline" size="md" onClick={() => navigate(-1)} style={{ width: "100%" }}>
                Back to Animals
              </PillButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}