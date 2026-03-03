import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { CollapsibleSection } from "./collapsible-section";
import { FlagIcon } from "./flag-icon";
import type { FlagColor } from "./flag-icon";
import { PillButton } from "./pill-button";
import {
  CalvingQuickNotes,
  getActiveFlagColor,
  computeActiveFlag,
  type NoteFlag,
} from "./calving-quick-notes";

/* Flag label map */
const FLAG_LABEL_MAP: Record<string, string> = {
  cull: "Cull",
  production: "Production",
  management: "Management",
};

/* ── Mock data keyed by tag ── */
const animalWorkData: Record<
  string,
  {
    tag: string;
    weight: string;
    notes: string;
    flag: FlagColor | null;
    tagColor: string;
    sex: string;
    animalType: string;
    yearBorn: string;
    eid: string;
    eid2: string;
    otherId: string;
    lifetimeId: string;
    memo: string;
    preg: string;
    treatments: { name: string; dosage: string; route: string; time: string }[];
    calvingHistory: {
      date: string;
      calfTag: string;
      calfSex: string;
      birthWeight: string;
      assistance: string;
      notes: string;
    }[];
    history: {
      date: string;
      project: string;
      weight: string;
      preg: string;
      notes: string;
      flag: FlagColor | null;
      treatments: { name: string; dosage: string; route: string }[];
    }[];
  }
> = {
  "4782": {
    tag: "4782",
    weight: "1,247",
    notes: "Normal — no issues",
    flag: "teal",
    tagColor: "Pink",
    sex: "Cow",
    animalType: "Cow",
    yearBorn: "2020",
    eid: "982 000364507221",
    eid2: "",
    otherId: "SBR-4782",
    lifetimeId: "USA4782-2020",
    memo: "Good disposition, easy handler",
    preg: "Confirmed",
    treatments: [
      { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM", time: "10:14 AM" },
      { name: "Ivermectin Pour-On", dosage: "57 mL", route: "Topical", time: "10:15 AM" },
    ],
    calvingHistory: [
      {
        date: "May 10, 2025",
        calfTag: "8841",
        calfSex: "Bull",
        birthWeight: "85 lbs",
        assistance: "None",
        notes: "Normal birth",
      },
    ],
    history: [
      {
        date: "Jan 14, 2026",
        project: "Winter Vaccination",
        weight: "1,210",
        preg: "Confirmed",
        notes: "Normal — routine vaccination",
        flag: "teal",
        treatments: [
          { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" },
          { name: "Ivermectin Pour-On", dosage: "55 mL", route: "Topical" },
        ],
      },
      {
        date: "Oct 15, 2025",
        project: "Fall Processing",
        weight: "1,185",
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
        weight: "1,152",
        preg: "Confirmed",
        notes: "Normal — healthy, good condition",
        flag: null,
        treatments: [
          { name: "Multimin 90", dosage: "12 mL", route: "SQ" },
        ],
      },
    ],
  },
  "3091": {
    tag: "3091",
    weight: "983",
    notes: "Follow-up Thursday — mild respiratory",
    flag: "gold",
    tagColor: "Yellow",
    sex: "Cow",
    animalType: "Cow",
    yearBorn: "2020",
    eid: "982 000364508104",
    eid2: "",
    otherId: "SBR-3091",
    lifetimeId: "USA3091-2020",
    memo: "Mild cough, nasal discharge noted",
    preg: "Open",
    treatments: [
      { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM", time: "10:32 AM" },
      { name: "Draxxin", dosage: "6 mL", route: "SQ", time: "10:33 AM" },
      { name: "Banamine", dosage: "10 mL", route: "IV", time: "10:34 AM" },
    ],
    calvingHistory: [],
    history: [
      {
        date: "Jan 14, 2026",
        project: "Winter Vaccination",
        weight: "965",
        preg: "Open",
        notes: "Noted slight cough — monitor",
        flag: "gold",
        treatments: [
          { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" },
        ],
      },
      {
        date: "Oct 15, 2025",
        project: "Fall Processing",
        weight: "948",
        preg: "Open",
        notes: "Below target weight, no calves weaned",
        flag: "gold",
        treatments: [
          { name: "Dectomax Pour-On", dosage: "45 mL", route: "Topical" },
        ],
      },
    ],
  },
  "5520": {
    tag: "5520",
    weight: "1,102",
    notes: "Treatment administered — chronic limp",
    flag: "red",
    tagColor: "Red",
    sex: "Cow",
    animalType: "Cow",
    yearBorn: "2018",
    eid: "982 000364509337",
    eid2: "",
    otherId: "SBR-5520",
    lifetimeId: "USA5520-2018",
    memo: "Chronic limp, poor BCS — cull candidate",
    preg: "Open",
    treatments: [
      { name: "Penicillin", dosage: "10 cc", route: "IM", time: "11:05 AM" },
      { name: "Banamine", dosage: "10 mL", route: "IV", time: "11:06 AM" },
    ],
    calvingHistory: [
      {
        date: "Apr 28, 2025",
        calfTag: "9102",
        calfSex: "Heifer",
        birthWeight: "72 lbs",
        assistance: "Mechanical",
        notes: "Difficult pull — calf positioned backward",
      },
      {
        date: "Mar 15, 2024",
        calfTag: "7834",
        calfSex: "Bull",
        birthWeight: "90 lbs",
        assistance: "None",
        notes: "Normal birth",
      },
    ],
    history: [
      {
        date: "Jan 14, 2026",
        project: "Winter Vaccination",
        weight: "1,080",
        preg: "Open",
        notes: "Limping — right rear, treated with Banamine",
        flag: "red",
        treatments: [
          { name: "Banamine", dosage: "10 mL", route: "IV" },
          { name: "Penicillin", dosage: "10 cc", route: "IM" },
        ],
      },
      {
        date: "Oct 15, 2025",
        project: "Fall Processing",
        weight: "1,065",
        preg: "Open",
        notes: "Chronic limp noted, flagged for cull review",
        flag: "red",
        treatments: [
          { name: "Dectomax Pour-On", dosage: "50 mL", route: "Topical" },
        ],
      },
    ],
  },
  "2218": {
    tag: "2218",
    weight: "1,340",
    notes: "Normal — healthy",
    flag: "teal",
    tagColor: "Green",
    sex: "Cow",
    animalType: "Cow",
    yearBorn: "2021",
    eid: "982 000364510482",
    eid2: "",
    otherId: "SBR-2218",
    lifetimeId: "USA2218-2021",
    memo: "Normal",
    preg: "Confirmed",
    treatments: [
      { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM", time: "11:20 AM" },
      { name: "Multimin 90", dosage: "13 mL", route: "SQ", time: "11:21 AM" },
    ],
    calvingHistory: [
      {
        date: "Apr 5, 2025",
        calfTag: "8910",
        calfSex: "Heifer",
        birthWeight: "78 lbs",
        assistance: "None",
        notes: "First calf — normal delivery",
      },
    ],
    history: [
      {
        date: "Jan 14, 2026",
        project: "Winter Vaccination",
        weight: "1,312",
        preg: "Confirmed",
        notes: "Normal — routine",
        flag: null,
        treatments: [
          { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" },
        ],
      },
    ],
  },
  "8812": {
    tag: "8812",
    weight: "1,156",
    notes: "Normal — processed",
    flag: "teal",
    tagColor: "Orange",
    sex: "Cow",
    animalType: "Cow",
    yearBorn: "2019",
    eid: "982 000364511698",
    eid2: "",
    otherId: "SBR-8812",
    lifetimeId: "USA8812-2019",
    memo: "Normal",
    preg: "Confirmed",
    treatments: [
      { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM", time: "11:38 AM" },
      { name: "Ivermectin Pour-On", dosage: "53 mL", route: "Topical", time: "11:39 AM" },
      { name: "Multimin 90", dosage: "12 mL", route: "SQ", time: "11:40 AM" },
    ],
    calvingHistory: [
      {
        date: "May 2, 2025",
        calfTag: "8855",
        calfSex: "Bull",
        birthWeight: "82 lbs",
        assistance: "None",
        notes: "Normal birth",
      },
      {
        date: "Apr 12, 2024",
        calfTag: "7601",
        calfSex: "Heifer",
        birthWeight: "75 lbs",
        assistance: "None",
        notes: "Normal birth, strong calf",
      },
      {
        date: "Mar 28, 2023",
        calfTag: "6230",
        calfSex: "Bull",
        birthWeight: "88 lbs",
        assistance: "Easy pull",
        notes: "Slight assistance needed",
      },
    ],
    history: [
      {
        date: "Jan 14, 2026",
        project: "Winter Vaccination",
        weight: "1,130",
        preg: "Confirmed",
        notes: "Normal — routine",
        flag: null,
        treatments: [
          { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" },
          { name: "Ivermectin Pour-On", dosage: "50 mL", route: "Topical" },
        ],
      },
      {
        date: "Oct 15, 2025",
        project: "Fall Processing",
        weight: "1,098",
        preg: "Confirmed",
        notes: "Normal — fall processing complete",
        flag: null,
        treatments: [
          { name: "Dectomax Pour-On", dosage: "50 mL", route: "Topical" },
          { name: "Multimin 90", dosage: "11 mL", route: "SQ" },
        ],
      },
    ],
  },
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

export function ProjectAnimalDetailScreen() {
  const navigate = useNavigate();
  const { animalId } = useParams();
  const data = animalWorkData[animalId || "4782"] ?? animalWorkData["4782"];

  const [activeTab, setActiveTab] = useState<"work" | "history">("work");

  /* Editable work fields */
  const [workFields, setWorkFields] = useState({
    weight: data.weight,
    preg: data.preg,
    notes: data.notes,
  });

  const updateWork = (key: keyof typeof workFields) => (val: string) =>
    setWorkFields((prev) => ({ ...prev, [key]: val }));

  /* Quick notes — color-coded with flag behavior (cow work mode) */
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>(["qn4"]); // "Lame" pre-selected mock
  const [activeFlag, setActiveFlag] = useState<NoteFlag>("production");
  const existingAnimalFlag: NoteFlag = "none"; // mock: this animal had no prior flag

  const noteFlagColor = getActiveFlagColor(selectedNoteIds);

  return (
    <div className="space-y-0">
      {/* ══ GRADIENT HEADER CARD ══ */}
      <div
        className="rounded-2xl px-5 py-5 font-['Inter'] mb-5"
        style={{ background: "linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)" }}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left — Tag & quick info */}
          <div className="min-w-0 flex-1">
            <p
              className="text-white"
              style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}
            >
              {data.tag}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor:
                    data.tagColor === "Pink" ? "#E8A0BF" :
                    data.tagColor === "Yellow" ? "#F3D12A" :
                    data.tagColor === "Orange" ? "#E8853D" :
                    data.tagColor === "Green" ? "#55BAAA" :
                    data.tagColor === "Blue" ? "#4A90D9" :
                    data.tagColor === "Red" ? "#9B2335" :
                    data.tagColor === "Purple" ? "#8B5FBF" :
                    "#CCCCCC",
                  display: "inline-block",
                }}
              />
              <p
                className="truncate"
                style={{ fontSize: 13, fontWeight: 400, color: "rgba(240,240,240,0.45)", lineHeight: 1.4 }}
              >
                {data.tagColor} · {data.sex} · {data.animalType} · {data.yearBorn}
              </p>
            </div>
            <p
              className="mt-1"
              style={{ fontSize: 11, fontWeight: 500, color: "#A8E6DA" }}
            >
              Spring Preg Check · {data.weight} lbs
            </p>
          </div>

          {/* Right — Flag (driven by quick notes) */}
          {noteFlagColor && (
            <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
              <FlagIcon color={noteFlagColor} size="md" />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: noteFlagColor === "red" ? "#9B2335" : noteFlagColor === "gold" ? "#B8860B" : "#55BAAA",
                  letterSpacing: "0.02em",
                }}
              >
                {FLAG_LABEL_MAP[activeFlag]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ══ TABS ══ */}
      <div className="flex border-b border-[#D4D4D0]/50">
        {(["work", "history"] as const).map((tab) => {
          const isActive = activeTab === tab;
          const labels = { work: "Work Data", history: "History" };
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
              {labels[tab]}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ width: 48, height: 3, backgroundColor: "#F3D12A" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ══ TAB CONTENT ══ */}
      <div className="py-5">
        {/* ── WORK DATA TAB ── */}
        {activeTab === "work" && (
          <div className="space-y-5">
            {/* Work fields */}
            <div className="space-y-2.5">
              <FormFieldRow label="Weight" value={workFields.weight} onChange={updateWork("weight")} placeholder="lbs" />
              <FormSelectRow
                label="Preg Status"
                value={workFields.preg}
                onChange={updateWork("preg")}
                options={["Confirmed", "Open", "Short Bred", "Unsure"]}
              />
              <FormFieldRow label="Notes" value={workFields.notes} onChange={updateWork("notes")} placeholder="Notes from this work session…" />
            </div>

            {/* Treatments — current session */}
            <CollapsibleSection title="Treatments" defaultOpen>
              <div className="space-y-2 pt-2">
                {/* Treatment count + add */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-['Inter'] uppercase"
                      style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#0E2646" }}
                    >
                      Applied
                    </span>
                    <span
                      className="rounded-full font-['Inter']"
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "1px 9px",
                        backgroundColor: "#F3D12A",
                        color: "#1A1A1A",
                      }}
                    >
                      {data.treatments.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1 cursor-pointer font-['Inter'] transition-all active:scale-95"
                    style={{ fontSize: 12, fontWeight: 600, color: "#55BAAA" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 3V11M3 7H11" stroke="#55BAAA" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Add
                  </button>
                </div>

                {/* Treatment cards */}
                {data.treatments.map((t, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-4 py-3 font-['Inter']"
                    style={{ backgroundColor: "#0E2646" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className="text-[#F0F0F0] min-w-0 flex-1"
                        style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}
                      >
                        {t.name}
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
                        {t.route}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(240,240,240,0.5)" }}>
                        {t.dosage}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(240,240,240,0.25)" }}>·</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(240,240,240,0.35)" }}>
                        {t.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Quick Notes — color-coded pills (cow work mode, no Twin) */}
            <div className="flex items-start gap-3">
              <label
                className="shrink-0 text-[#1A1A1A] font-['Inter']"
                style={{ width: 105, fontSize: 14, fontWeight: 600, paddingTop: 7 }}
              >
                Quick Notes
              </label>
              <div className="flex-1 min-w-0">
                <CalvingQuickNotes
                  selectedIds={selectedNoteIds}
                  onSelectedChange={setSelectedNoteIds}
                  tag={data.tag}
                  onFlagChange={setActiveFlag}
                  mode="cowwork"
                  existingFlag={existingAnimalFlag}
                />
              </div>
            </div>

            {/* Save / Cancel */}
            <div className="flex gap-3 pt-2">
              <PillButton variant="outline" size="md" onClick={() => navigate(-1)} style={{ flex: 1 }}>
                Cancel
              </PillButton>
              <PillButton size="md" onClick={() => navigate(-1)} style={{ flex: 1 }}>
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
                  Current Session Notes
                </p>
                <p className="text-[#1A1A1A]/70 font-['Inter']" style={{ fontSize: 13, lineHeight: 1.5 }}>
                  {workFields.notes || "No notes entered"}
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
                  {data.memo || "No memo"}
                </p>
              </div>
            </div>

            {/* ── Calving Records (collapsible) ── */}
            <CollapsibleSection
              title={`Calving Records (${data.calvingHistory.length})`}
              collapsedContent={
                data.calvingHistory.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {data.calvingHistory.map((c, i) => (
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
                        {c.calfTag} · {c.calfSex} · {c.date.split(",")[0]}
                      </span>
                    ))}
                  </div>
                ) : undefined
              }
            >
              <div className="space-y-2 pt-2">
                {data.calvingHistory.length === 0 ? (
                  <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 13 }}>
                    No calving records
                  </p>
                ) : (
                  data.calvingHistory.map((c, i) => (
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
              title={`Work Records (${data.history.length})`}
              collapsedContent={
                data.history.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {data.history.map((h, i) => (
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
                {data.history.length === 0 ? (
                  <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 13 }}>
                    No previous records
                  </p>
                ) : (
                  data.history.map((h, i) => (
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
                <FormFieldRow label="Tag" value={data.tag} placeholder="" />
                <FormFieldRow label="EID" value={data.eid} placeholder="" />
                {data.eid2 && <FormFieldRow label="EID 2" value={data.eid2} placeholder="" />}
                <FormFieldRow label="Other ID" value={data.otherId} placeholder="" />
                <FormFieldRow label="Lifetime ID" value={data.lifetimeId} placeholder="" />
                <FormFieldRow label="Sex" value={data.sex} placeholder="" />
                <FormFieldRow label="Type" value={data.animalType} placeholder="" />
                <FormFieldRow label="Year Born" value={data.yearBorn} placeholder="" />
                <FormFieldRow label="Tag Color" value={data.tagColor} placeholder="" />
              </div>
            </CollapsibleSection>

            {/* Back */}
            <div className="pt-2">
              <PillButton variant="outline" size="md" onClick={() => navigate(-1)} style={{ width: "100%" }}>
                Back to Project
              </PillButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}