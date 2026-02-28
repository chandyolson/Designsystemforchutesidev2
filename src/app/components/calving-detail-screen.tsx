import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { CollapsibleSection } from "./collapsible-section";
import { FlagIcon } from "./flag-icon";
import type { FlagColor } from "./flag-icon";
import { PillButton } from "./pill-button";

/* ── Mock calving detail data keyed by calf tag ── */
interface CalvingDetail {
  calfTag: string;
  damTag: string;
  sire: string;
  sex: string;
  birthDate: string;
  birthWeight: string;
  assistance: string;
  assistanceCode: string;
  notes: string;
  location: string;
  group: string;
  calfStatus: string;
  /* Dam info */
  dam: {
    tag: string;
    tagColor: string;
    sex: string;
    animalType: string;
    yearBorn: string;
    status: string;
    flag: FlagColor | null;
    weight: string;
    eid: string;
    eid2: string;
    otherId: string;
    lifetimeId: string;
    memo: string;
    notes: string;
    calvingHistory: {
      date: string;
      calfTag: string;
      calfSex: string;
      birthWeight: string;
      assistance: string;
      notes: string;
    }[];
    workHistory: {
      date: string;
      project: string;
      weight: string;
      preg: string;
      notes: string;
      flag: FlagColor | null;
      treatments: { name: string; dosage: string; route: string }[];
    }[];
  };
}

const calvingDetails: Record<string, CalvingDetail> = {
  "8841": {
    calfTag: "8841",
    damTag: "7801",
    sire: "Basin Payweight",
    sex: "Heifer",
    birthDate: "Feb 26, 2026",
    birthWeight: "78",
    assistance: "No Assistance",
    assistanceCode: "1 — No Assistance",
    notes: "Normal birth — strong heifer calf, up and nursing within 20 min",
    location: "Calving Pasture A",
    group: "2026 Season",
    calfStatus: "Active",
    dam: {
      tag: "7801",
      tagColor: "Green",
      sex: "Cow",
      animalType: "Cow",
      yearBorn: "2019",
      status: "Active",
      flag: "teal",
      weight: "1,265",
      eid: "982 000364507890",
      eid2: "",
      otherId: "SBR-7801",
      lifetimeId: "USA7801-2019",
      memo: "Consistent producer, easy calver. Good mother.",
      notes: "Calved Feb 26 — heifer calf 8841, no issues",
      calvingHistory: [
        {
          date: "Feb 26, 2026",
          calfTag: "8841",
          calfSex: "Heifer",
          birthWeight: "78 lbs",
          assistance: "None",
          notes: "Normal birth — strong heifer calf",
        },
        {
          date: "Mar 12, 2025",
          calfTag: "7620",
          calfSex: "Bull",
          birthWeight: "85 lbs",
          assistance: "None",
          notes: "Normal birth — vigorous calf",
        },
        {
          date: "Mar 5, 2024",
          calfTag: "6401",
          calfSex: "Heifer",
          birthWeight: "72 lbs",
          assistance: "None",
          notes: "Normal birth",
        },
        {
          date: "Feb 28, 2023",
          calfTag: "5210",
          calfSex: "Bull",
          birthWeight: "88 lbs",
          assistance: "Easy pull",
          notes: "Slight assistance — large calf",
        },
      ],
      workHistory: [
        {
          date: "Jan 14, 2026",
          project: "Winter Vaccination",
          weight: "1,245",
          preg: "Confirmed",
          notes: "Normal — routine vaccination, due late Feb",
          flag: "teal",
          treatments: [
            { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" },
            { name: "Ivermectin Pour-On", dosage: "58 mL", route: "Topical" },
          ],
        },
        {
          date: "Oct 15, 2025",
          project: "Fall Processing",
          weight: "1,230",
          preg: "Confirmed",
          notes: "Preg confirmed, good condition heading into winter",
          flag: null,
          treatments: [
            { name: "Dectomax Pour-On", dosage: "55 mL", route: "Topical" },
          ],
        },
        {
          date: "May 22, 2025",
          project: "Spring Preg Check 2025",
          weight: "1,198",
          preg: "Confirmed",
          notes: "Normal — healthy, weaned calf #7620",
          flag: null,
          treatments: [
            { name: "Multimin 90", dosage: "12 mL", route: "SQ" },
          ],
        },
      ],
    },
  },
  "8842": {
    calfTag: "8842",
    damTag: "3091",
    sire: "Connealy Consensus",
    sex: "Bull",
    birthDate: "Feb 25, 2026",
    birthWeight: "84",
    assistance: "No Assistance",
    assistanceCode: "1 — No Assistance",
    notes: "Normal delivery — bull calf, good vigor",
    location: "Calving Pasture A",
    group: "2026 Season",
    calfStatus: "Active",
    dam: {
      tag: "3091",
      tagColor: "Yellow",
      sex: "Cow",
      animalType: "Cow",
      yearBorn: "2020",
      status: "Active",
      flag: "gold",
      weight: "983",
      eid: "982 000364508104",
      eid2: "",
      otherId: "SBR-3091",
      lifetimeId: "USA3091-2020",
      memo: "Mild cough, nasal discharge noted. Monitor closely.",
      notes: "Calved Feb 25 — bull calf 8842, respiratory still present",
      calvingHistory: [
        {
          date: "Feb 25, 2026",
          calfTag: "8842",
          calfSex: "Bull",
          birthWeight: "84 lbs",
          assistance: "None",
          notes: "Normal delivery despite dam being monitored",
        },
      ],
      workHistory: [
        {
          date: "Jan 14, 2026",
          project: "Winter Vaccination",
          weight: "965",
          preg: "Confirmed",
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
          preg: "Confirmed",
          notes: "Below target weight, respiratory noted",
          flag: "gold",
          treatments: [
            { name: "Dectomax Pour-On", dosage: "45 mL", route: "Topical" },
          ],
        },
      ],
    },
  },
  "8843": {
    calfTag: "8843",
    damTag: "4782",
    sire: "SAV Resource",
    sex: "Heifer",
    birthDate: "Feb 24, 2026",
    birthWeight: "72",
    assistance: "Easy Pull",
    assistanceCode: "2 — Easy Pull",
    notes: "Slight assistance needed — calf positioned slightly back. Up quickly after.",
    location: "Calving Pasture B",
    group: "2026 Season",
    calfStatus: "Active",
    dam: {
      tag: "4782",
      tagColor: "Pink",
      sex: "Cow",
      animalType: "Cow",
      yearBorn: "2020",
      status: "Active",
      flag: "teal",
      weight: "1,247",
      eid: "982 000364507221",
      eid2: "",
      otherId: "SBR-4782",
      lifetimeId: "USA4782-2020",
      memo: "Good disposition, easy handler",
      notes: "Calved Feb 24 — heifer calf 8843, easy pull",
      calvingHistory: [
        {
          date: "Feb 24, 2026",
          calfTag: "8843",
          calfSex: "Heifer",
          birthWeight: "72 lbs",
          assistance: "Easy pull",
          notes: "Slight assistance — calf positioned back",
        },
        {
          date: "May 10, 2025",
          calfTag: "7890",
          calfSex: "Bull",
          birthWeight: "85 lbs",
          assistance: "None",
          notes: "Normal birth",
        },
      ],
      workHistory: [
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
          notes: "Pour-on dewormer applied, weaned calf",
          flag: null,
          treatments: [
            { name: "Dectomax Pour-On", dosage: "50 mL", route: "Topical" },
          ],
        },
      ],
    },
  },
  "8846": {
    calfTag: "8846",
    damTag: "8812",
    sire: "Connealy Consensus",
    sex: "Bull",
    birthDate: "Feb 21, 2026",
    birthWeight: "92",
    assistance: "Hard Pull",
    assistanceCode: "3 — Hard Pull",
    notes: "Difficult delivery — large calf, needed mechanical assistance. Dam and calf both recovered.",
    location: "Calving Pasture A",
    group: "2026 Season",
    calfStatus: "Active",
    dam: {
      tag: "8812",
      tagColor: "Orange",
      sex: "Cow",
      animalType: "Cow",
      yearBorn: "2019",
      status: "Active",
      flag: "gold",
      weight: "1,156",
      eid: "982 000364511698",
      eid2: "",
      otherId: "SBR-8812",
      lifetimeId: "USA8812-2019",
      memo: "Monitor — hard pull on latest calf, check recovery",
      notes: "Calved Feb 21 — bull calf 8846, hard pull, recovering",
      calvingHistory: [
        {
          date: "Feb 21, 2026",
          calfTag: "8846",
          calfSex: "Bull",
          birthWeight: "92 lbs",
          assistance: "Hard pull",
          notes: "Difficult delivery — mechanical assistance needed",
        },
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
      ],
      workHistory: [
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
  },
  "8851": {
    calfTag: "8851",
    damTag: "5520",
    sire: "SAV Resource",
    sex: "Heifer",
    birthDate: "Feb 16, 2026",
    birthWeight: "68",
    assistance: "Surgical",
    assistanceCode: "4 — Surgical",
    notes: "C-section required — calf breech. Both dam and calf survived. Dam flagged critical.",
    location: "Barn / Vet Area",
    group: "2026 Season",
    calfStatus: "Active",
    dam: {
      tag: "5520",
      tagColor: "Red",
      sex: "Cow",
      animalType: "Cow",
      yearBorn: "2018",
      status: "Active",
      flag: "red",
      weight: "1,102",
      eid: "982 000364509337",
      eid2: "",
      otherId: "SBR-5520",
      lifetimeId: "USA5520-2018",
      memo: "Chronic limp, poor BCS — cull candidate. C-section Feb 2026.",
      notes: "C-section Feb 16 — heifer calf 8851 survived. Dam recovering.",
      calvingHistory: [
        {
          date: "Feb 16, 2026",
          calfTag: "8851",
          calfSex: "Heifer",
          birthWeight: "68 lbs",
          assistance: "Surgical",
          notes: "C-section — calf breech, both survived",
        },
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
      workHistory: [
        {
          date: "Jan 14, 2026",
          project: "Winter Vaccination",
          weight: "1,080",
          preg: "Confirmed",
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
          preg: "Confirmed",
          notes: "Chronic limp noted, flagged for cull review",
          flag: "red",
          treatments: [
            { name: "Dectomax Pour-On", dosage: "50 mL", route: "Topical" },
          ],
        },
      ],
    },
  },
};

/* Fallback to first record if tag not found */
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

/* ── Component ── */
export function CalvingDetailScreen() {
  const navigate = useNavigate();
  const { calfTag } = useParams();
  const data = calvingDetails[calfTag || fallbackTag] ?? calvingDetails[fallbackTag];

  const [activeTab, setActiveTab] = useState<"calf" | "dam">("calf");

  /* Editable calf fields */
  const [calfFields, setCalfFields] = useState({
    birthWeight: data.birthWeight,
    size: data.assistance === "Surgical" ? "Small" : "Average",
    notes: data.notes,
    assistance: data.assistanceCode,
    location: data.location,
    group: data.group,
    calfStatus: data.calfStatus,
  });

  const updateCalf = (key: keyof typeof calfFields) => (val: string) =>
    setCalfFields((prev) => ({ ...prev, [key]: val }));

  /* Quick notes */
  const quickNoteOptions = [
    "Breach", "Backwards", "Twins", "Pulled", "C-Section",
    "Weak calf", "Scours", "Bottle baby", "Graft", "Prolapse",
    "Retained placenta", "Slow to nurse", "Aggressive cow",
  ];
  const [quickNotes, setQuickNotes] = useState<string[]>([]);
  const toggleQuickNote = (note: string) =>
    setQuickNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );

  /* Cow traits state */
  const [cowTraits, setCowTraits] = useState({
    assistance: data.assistanceCode,
    disposition: data.assistance === "No Assistance" ? "1 — Docile" : "2 — Restless",
    udder: "6",
    teat: "5",
    claw: "5",
    foot: "6",
    mothering: "4",
  });
  const updateCowTrait = (key: keyof typeof cowTraits) => (val: string) =>
    setCowTraits((prev) => ({ ...prev, [key]: val }));

  /* Calf traits state */
  const [calfTraits, setCalfTraits] = useState({
    vigor: data.assistance === "No Assistance" ? "5" : "3",
    size: data.assistance === "Surgical" ? "2" : "3",
  });
  const updateCalfTrait = (key: keyof typeof calfTraits) => (val: string) =>
    setCalfTraits((prev) => ({ ...prev, [key]: val }));

  const dam = data.dam;

  return (
    <div className="space-y-0">
      {/* ══ GRADIENT HEADER CARD ══ */}
      <div
        className="rounded-2xl px-5 py-5 font-['Inter'] mb-5"
        style={{ background: "linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)" }}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left — Calf tag & quick info */}
          <div className="min-w-0 flex-1">
            <p
              className="text-white"
              style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}
            >
              {data.calfTag}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {/* Sex badge */}
              <span
                className="rounded-full"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  padding: "2px 10px",
                  backgroundColor: data.sex === "Bull" ? "rgba(85,186,170,0.2)" : "rgba(232,160,191,0.25)",
                  color: data.sex === "Bull" ? "#55BAAA" : "#E8A0BF",
                }}
              >
                {data.sex}
              </span>
              <span
                style={{ fontSize: 12, fontWeight: 500, color: "rgba(240,240,240,0.4)" }}
              >
                Born {data.birthDate}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span style={{ fontSize: 11, fontWeight: 500, color: "#A8E6DA" }}>
                Dam {data.damTag}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(168,230,218,0.4)" }}>·</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(168,230,218,0.7)" }}>
                {data.sire}
              </span>
            </div>
          </div>

          {/* Right — Birth weight */}
          <div className="shrink-0 flex flex-col items-center gap-0.5 pt-1">
            <p
              className="text-white"
              style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}
            >
              {data.birthWeight}
            </p>
            <span
              style={{ fontSize: 9, fontWeight: 600, color: "rgba(240,240,240,0.4)", letterSpacing: "0.06em" }}
            >
              LBS
            </span>
          </div>
        </div>
      </div>

      {/* ══ TABS ══ */}
      <div className="flex border-b border-[#D4D4D0]/50">
        {(["calf", "dam"] as const).map((tab) => {
          const isActive = activeTab === tab;
          const labels = { calf: "Calf Info", dam: "Dam History" };
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
        {/* ── CALF INFO TAB ── */}
        {activeTab === "calf" && (
          <div className="space-y-5">
            {/* Core calf fields */}
            <div className="space-y-2.5">
              <FormFieldRow label="Calf Tag" value={data.calfTag} placeholder="" />
              <FormFieldRow label="Dam" value={data.damTag} placeholder="" />
              <FormFieldRow label="Sire" value={data.sire} placeholder="" />
              <FormFieldRow label="Sex" value={data.sex} placeholder="" />
              <FormFieldRow label="Birth Date" value={data.birthDate} placeholder="" />
              {/* Size + Birth Weight on same line */}
              <div className="flex items-center gap-3">
                <label
                  className="shrink-0 text-[#1A1A1A] font-['Inter']"
                  style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
                >
                  Size / Wt
                </label>
                <div className="flex flex-1 min-w-0 gap-2">
                  <div className="relative flex-1 min-w-0">
                    <select
                      value={calfFields.size}
                      onChange={(e) => updateCalf("size")(e.target.value)}
                      className="w-full h-[40px] px-3 pr-8 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all appearance-none cursor-pointer"
                      style={{ fontSize: 14, fontWeight: 400, color: calfFields.size ? "#1A1A1A" : "rgba(26,26,26,0.30)" }}
                    >
                      <option value="" disabled>Size</option>
                      {["Small", "Average", "Large"].map((opt) => (
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
                  <input
                    type="number"
                    placeholder="lbs"
                    value={calfFields.birthWeight}
                    onChange={(e) => updateCalf("birthWeight")(e.target.value)}
                    className="w-[80px] h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
                    style={{ fontSize: 14, fontWeight: 400 }}
                  />
                </div>
              </div>
              <FormFieldRow label="Location" value={calfFields.location} onChange={updateCalf("location")} placeholder="Location" />
              <FormFieldRow label="Group" value={calfFields.group} onChange={updateCalf("group")} placeholder="Group" />
              <FormSelectRow
                label="Status"
                value={calfFields.calfStatus}
                onChange={updateCalf("calfStatus")}
                options={["Active", "Dead", "Sold", "Grafted"]}
              />
              <FormFieldRow label="Notes" value={calfFields.notes} onChange={updateCalf("notes")} placeholder="Calving notes…" />
            </div>

            {/* ── Quick Notes (pills) ── */}
            <CollapsibleSection
              title="Quick Notes"
              collapsedContent={
                quickNotes.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {quickNotes.map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-1 rounded-full font-['Inter']"
                        style={{
                          fontSize: 12,
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
                  const isSelected = quickNotes.includes(note);
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

            {/* ── Cow Traits (collapsed) ── */}
            <CollapsibleSection title="Cow Traits (7)">
              <div className="space-y-2.5 pt-2">
                <FormSelectRow label="Assistance" value={cowTraits.assistance} onChange={updateCowTrait("assistance")} placeholder="Select level" options={["1 — None", "2 — Easy pull", "3 — Moderate", "4 — Hard pull", "5 — Surgery"]} />
                <FormSelectRow label="Disposition" value={cowTraits.disposition} onChange={updateCowTrait("disposition")} placeholder="Select score" options={["1 — Docile", "2 — Restless", "3 — Nervous", "4 — Flighty", "5 — Aggressive", "6 — Very aggressive"]} />
                <FormFieldRow label="Udder Score" value={cowTraits.udder} onChange={updateCowTrait("udder")} placeholder="1-9" />
                <FormFieldRow label="Teat Score" value={cowTraits.teat} onChange={updateCowTrait("teat")} placeholder="1-9" />
                <FormFieldRow label="Claw Score" value={cowTraits.claw} onChange={updateCowTrait("claw")} placeholder="1-9" />
                <FormFieldRow label="Foot Score" value={cowTraits.foot} onChange={updateCowTrait("foot")} placeholder="1-9" />
                <FormFieldRow label="Mothering" value={cowTraits.mothering} onChange={updateCowTrait("mothering")} placeholder="1-5" />
              </div>
            </CollapsibleSection>

            {/* ── Calf Traits (collapsed) ── */}
            <CollapsibleSection title="Calf Traits (2)">
              <div className="space-y-2.5 pt-2">
                <FormFieldRow label="Calf Vigor" value={calfTraits.vigor} onChange={updateCalfTrait("vigor")} placeholder="1-5" />
                <FormFieldRow label="Calf Size" value={calfTraits.size} onChange={updateCalfTrait("size")} placeholder="1-5" />
              </div>
            </CollapsibleSection>

            {/* Assistance detail card — only if not "No Assistance" */}
            {data.assistance !== "No Assistance" && (
              <div
                className="rounded-xl px-4 py-3.5 font-['Inter']"
                style={{
                  backgroundColor: "rgba(155,35,53,0.06)",
                  border: "1px solid rgba(155,35,53,0.15)",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L13 13H1L7 1Z" fill="#9B2335" opacity="0.7" />
                    <path d="M7 5.5V8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="7" cy="10.5" r="0.75" fill="white" />
                  </svg>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#9B2335" }}>
                    Assistance Required
                  </span>
                </div>
                <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(155,35,53,0.7)", lineHeight: 1.5 }}>
                  {data.assistanceCode} — review dam and calf condition at next check.
                </p>
              </div>
            )}

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

        {/* ── DAM HISTORY TAB ── */}
        {activeTab === "dam" && (
          <div className="space-y-5">
            {/* Dam header mini card */}
            <div
              className="rounded-xl px-4 py-3.5 font-['Inter'] flex items-center justify-between"
              style={{ backgroundColor: "#0E2646" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full"
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: tagColorMap[dam.tagColor] || "#CCCCCC",
                    }}
                  />
                  <p className="text-[#F0F0F0]" style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>
                    {dam.tag}
                  </p>
                </div>
                <p
                  className="truncate"
                  style={{ fontSize: 11, fontWeight: 400, color: "rgba(240,240,240,0.4)" }}
                >
                  {dam.tagColor} · {dam.sex} · {dam.yearBorn}
                </p>
              </div>
              {dam.flag && (
                <div className="shrink-0 flex items-center gap-1.5">
                  <FlagIcon color={dam.flag} size="sm" />
                  <span style={{ fontSize: 10, fontWeight: 600, color: flagColors[dam.flag] }}>
                    {flagLabels[dam.flag]}
                  </span>
                </div>
              )}
            </div>

            {/* ── Notes & Memo (always visible) ── */}
            <div className="space-y-3">
              <div>
                <p
                  className="font-['Inter'] uppercase mb-1.5"
                  style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#1A1A1A40" }}
                >
                  Latest Notes
                </p>
                <p className="text-[#1A1A1A]/70 font-['Inter']" style={{ fontSize: 13, lineHeight: 1.5 }}>
                  {dam.notes || "No notes"}
                </p>
              </div>
              <div style={{ borderTop: "1px solid rgba(26,26,26,0.06)", paddingTop: 12 }}>
                <p
                  className="font-['Inter'] uppercase mb-1.5"
                  style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#1A1A1A40" }}
                >
                  Dam Memo
                </p>
                <p className="text-[#1A1A1A]/50 font-['Inter']" style={{ fontSize: 13, lineHeight: 1.5 }}>
                  {dam.memo || "No memo"}
                </p>
              </div>
            </div>

            {/* ── Calving Records (collapsible) ── */}
            <CollapsibleSection
              title={`Calving Records (${dam.calvingHistory.length})`}
              collapsedContent={
                dam.calvingHistory.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {dam.calvingHistory.map((c, i) => (
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
                {dam.calvingHistory.length === 0 ? (
                  <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 13 }}>
                    No calving records
                  </p>
                ) : (
                  dam.calvingHistory.map((c, i) => (
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
              title={`Work Records (${dam.workHistory.length})`}
              collapsedContent={
                dam.workHistory.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {dam.workHistory.map((h, i) => (
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
                {dam.workHistory.length === 0 ? (
                  <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 13 }}>
                    No previous records
                  </p>
                ) : (
                  dam.workHistory.map((h, i) => (
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
            <CollapsibleSection title="Dam ID">
              <div className="space-y-2.5 pt-2">
                <FormFieldRow label="Tag" value={dam.tag} placeholder="" />
                <FormFieldRow label="EID" value={dam.eid} placeholder="" />
                {dam.eid2 && <FormFieldRow label="EID 2" value={dam.eid2} placeholder="" />}
                <FormFieldRow label="Other ID" value={dam.otherId} placeholder="" />
                <FormFieldRow label="Lifetime ID" value={dam.lifetimeId} placeholder="" />
                <FormFieldRow label="Sex" value={dam.sex} placeholder="" />
                <FormFieldRow label="Type" value={dam.animalType} placeholder="" />
                <FormFieldRow label="Year Born" value={dam.yearBorn} placeholder="" />
                <FormFieldRow label="Tag Color" value={dam.tagColor} placeholder="" />
              </div>
            </CollapsibleSection>

            {/* Back */}
            <div className="pt-2">
              <PillButton variant="outline" size="md" onClick={() => navigate(-1)} style={{ width: "100%" }}>
                Back to Calving
              </PillButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}