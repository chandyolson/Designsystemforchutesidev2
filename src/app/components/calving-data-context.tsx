import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { FlagColor } from "./flag-icon";

/* ══════════════════════════════════════════════
   Shared calving data types
   ══════════════════════════════════════════════ */

export interface CalvingRecord {
  damTag: string;
  calfTag: string;
  date: string;
  sex: string;
  sire: string;
  assistance: string;
  notes: string;
  memo: string;
}

export interface CalvingDetail {
  calfTag: string;
  damTag: string;
  sire: string;
  sex: string;
  birthDate: string;
  birthWeight: string;
  assistance: string;
  assistanceCode: string;
  notes: string;
  memo: string;
  location: string;
  group: string;
  calfStatus: string;
  quickNotes: string[];
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

/* ══════════════════════════════════════════════
   Seed data — calving list records
   ══════════════════════════════════════════════ */

const INITIAL_RECORDS: CalvingRecord[] = [
  { damTag: "7801", calfTag: "8841", date: "Feb 26", sex: "Heifer", sire: "Basin Payweight", assistance: "1 — No Assistance", notes: "Normal birth — strong heifer calf, up and nursing within 20 min", memo: "Consistent producer, easy calver" },
  { damTag: "3091", calfTag: "8842", date: "Feb 25", sex: "Bull", sire: "Connealy Consensus", assistance: "1 — No Assistance", notes: "Normal delivery — bull calf, good vigor", memo: "Mild cough, nasal discharge noted. Monitor closely." },
  { damTag: "4782", calfTag: "8843", date: "Feb 24", sex: "Heifer", sire: "SAV Resource", assistance: "2 — Easy Pull", notes: "Slight assistance needed — calf positioned slightly back", memo: "Good disposition, easy handler" },
  { damTag: "5501", calfTag: "8844", date: "Feb 23", sex: "Bull", sire: "Basin Payweight", assistance: "1 — No Assistance", notes: "Unassisted, calf up quickly", memo: "" },
  { damTag: "2290", calfTag: "8845", date: "Feb 22", sex: "Heifer", sire: "Vermilion Dateline", assistance: "1 — No Assistance", notes: "Calved overnight, found pair bonded", memo: "First-calf heifer, did well" },
  { damTag: "8812", calfTag: "8846", date: "Feb 21", sex: "Bull", sire: "Connealy Consensus", assistance: "3 — Hard Pull", notes: "Difficult delivery — large calf, needed mechanical assistance", memo: "Monitor — hard pull on latest calf, check recovery" },
  { damTag: "2218", calfTag: "8847", date: "Feb 20", sex: "Heifer", sire: "SAV Resource", assistance: "1 — No Assistance", notes: "Clean calving, pair doing well", memo: "" },
  { damTag: "6610", calfTag: "8848", date: "Feb 19", sex: "Bull", sire: "Basin Payweight", assistance: "1 — No Assistance", notes: "Normal — vigorous bull calf", memo: "" },
  { damTag: "4455", calfTag: "8849", date: "Feb 18", sex: "Heifer", sire: "Vermilion Dateline", assistance: "2 — Easy Pull", notes: "Slight pull, calf backwards. Recovered fine.", memo: "Second calver, needed help last year too" },
  { damTag: "3320", calfTag: "8850", date: "Feb 17", sex: "Bull", sire: "Connealy Consensus", assistance: "1 — No Assistance", notes: "Unassisted, strong calf", memo: "" },
  { damTag: "5520", calfTag: "8851", date: "Feb 16", sex: "Heifer", sire: "SAV Resource", assistance: "4 — Surgical", notes: "C-section required — calf breech. Both survived.", memo: "Chronic limp, poor BCS — cull candidate" },
  { damTag: "7744", calfTag: "8852", date: "Feb 15", sex: "Bull", sire: "Basin Payweight", assistance: "1 — No Assistance", notes: "Normal birth, good-sized calf", memo: "" },
];

/* ══════════════════════════════════════════════
   Seed data — calving detail (rich data for 5 records)
   ══════════════════════════════════════════════ */

const INITIAL_DETAILS: Record<string, CalvingDetail> = {
  "8841": {
    calfTag: "8841", damTag: "7801", sire: "Basin Payweight", sex: "Heifer",
    birthDate: "Feb 26, 2026", birthWeight: "78",
    assistance: "No Assistance", assistanceCode: "1 — No Assistance",
    notes: "Normal birth — strong heifer calf, up and nursing within 20 min",
    memo: "Consistent producer, easy calver",
    location: "Calving Pasture A", group: "2026 Season", calfStatus: "Active",
    quickNotes: [],
    dam: {
      tag: "7801", tagColor: "Green", sex: "Cow", animalType: "Cow", yearBorn: "2019",
      status: "Active", flag: "teal", weight: "1,265",
      eid: "982 000364507890", eid2: "", otherId: "SBR-7801", lifetimeId: "USA7801-2019",
      memo: "Consistent producer, easy calver. Good mother.",
      notes: "Calved Feb 26 — heifer calf 8841, no issues",
      calvingHistory: [
        { date: "Feb 26, 2026", calfTag: "8841", calfSex: "Heifer", birthWeight: "78 lbs", assistance: "None", notes: "Normal birth — strong heifer calf" },
        { date: "Mar 12, 2025", calfTag: "7620", calfSex: "Bull", birthWeight: "85 lbs", assistance: "None", notes: "Normal birth — vigorous calf" },
        { date: "Mar 5, 2024", calfTag: "6401", calfSex: "Heifer", birthWeight: "72 lbs", assistance: "None", notes: "Normal birth" },
        { date: "Feb 28, 2023", calfTag: "5210", calfSex: "Bull", birthWeight: "88 lbs", assistance: "Easy pull", notes: "Slight assistance — large calf" },
      ],
      workHistory: [
        { date: "Jan 14, 2026", project: "Winter Vaccination", weight: "1,245", preg: "Confirmed", notes: "Normal — routine vaccination, due late Feb", flag: "teal", treatments: [{ name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" }, { name: "Ivermectin Pour-On", dosage: "58 mL", route: "Topical" }] },
        { date: "Oct 15, 2025", project: "Fall Processing", weight: "1,230", preg: "Confirmed", notes: "Preg confirmed, good condition heading into winter", flag: null, treatments: [{ name: "Dectomax Pour-On", dosage: "55 mL", route: "Topical" }] },
        { date: "May 22, 2025", project: "Spring Preg Check 2025", weight: "1,198", preg: "Confirmed", notes: "Normal — healthy, weaned calf #7620", flag: null, treatments: [{ name: "Multimin 90", dosage: "12 mL", route: "SQ" }] },
      ],
    },
  },
  "8842": {
    calfTag: "8842", damTag: "3091", sire: "Connealy Consensus", sex: "Bull",
    birthDate: "Feb 25, 2026", birthWeight: "84",
    assistance: "No Assistance", assistanceCode: "1 — No Assistance",
    notes: "Normal delivery — bull calf, good vigor",
    memo: "Mild cough, nasal discharge noted. Monitor closely.",
    location: "Calving Pasture A", group: "2026 Season", calfStatus: "Active",
    quickNotes: [],
    dam: {
      tag: "3091", tagColor: "Yellow", sex: "Cow", animalType: "Cow", yearBorn: "2020",
      status: "Active", flag: "gold", weight: "983",
      eid: "982 000364508104", eid2: "", otherId: "SBR-3091", lifetimeId: "USA3091-2020",
      memo: "Mild cough, nasal discharge noted. Monitor closely.",
      notes: "Calved Feb 25 — bull calf 8842, respiratory still present",
      calvingHistory: [
        { date: "Feb 25, 2026", calfTag: "8842", calfSex: "Bull", birthWeight: "84 lbs", assistance: "None", notes: "Normal delivery despite dam being monitored" },
      ],
      workHistory: [
        { date: "Jan 14, 2026", project: "Winter Vaccination", weight: "965", preg: "Confirmed", notes: "Noted slight cough — monitor", flag: "gold", treatments: [{ name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" }] },
        { date: "Oct 15, 2025", project: "Fall Processing", weight: "948", preg: "Confirmed", notes: "Below target weight, respiratory noted", flag: "gold", treatments: [{ name: "Dectomax Pour-On", dosage: "45 mL", route: "Topical" }] },
      ],
    },
  },
  "8843": {
    calfTag: "8843", damTag: "4782", sire: "SAV Resource", sex: "Heifer",
    birthDate: "Feb 24, 2026", birthWeight: "72",
    assistance: "Easy Pull", assistanceCode: "2 — Easy Pull",
    notes: "Slight assistance needed — calf positioned slightly back. Up quickly after.",
    memo: "Good disposition, easy handler",
    location: "Calving Pasture B", group: "2026 Season", calfStatus: "Active",
    quickNotes: [],
    dam: {
      tag: "4782", tagColor: "Pink", sex: "Cow", animalType: "Cow", yearBorn: "2020",
      status: "Active", flag: "teal", weight: "1,247",
      eid: "982 000364507221", eid2: "", otherId: "SBR-4782", lifetimeId: "USA4782-2020",
      memo: "Good disposition, easy handler",
      notes: "Calved Feb 24 — heifer calf 8843, easy pull",
      calvingHistory: [
        { date: "Feb 24, 2026", calfTag: "8843", calfSex: "Heifer", birthWeight: "72 lbs", assistance: "Easy pull", notes: "Slight assistance — calf positioned back" },
        { date: "May 10, 2025", calfTag: "7890", calfSex: "Bull", birthWeight: "85 lbs", assistance: "None", notes: "Normal birth" },
      ],
      workHistory: [
        { date: "Jan 14, 2026", project: "Winter Vaccination", weight: "1,210", preg: "Confirmed", notes: "Normal — routine vaccination", flag: "teal", treatments: [{ name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" }, { name: "Ivermectin Pour-On", dosage: "55 mL", route: "Topical" }] },
        { date: "Oct 15, 2025", project: "Fall Processing", weight: "1,185", preg: "Confirmed", notes: "Pour-on dewormer applied, weaned calf", flag: null, treatments: [{ name: "Dectomax Pour-On", dosage: "50 mL", route: "Topical" }] },
      ],
    },
  },
  "8846": {
    calfTag: "8846", damTag: "8812", sire: "Connealy Consensus", sex: "Bull",
    birthDate: "Feb 21, 2026", birthWeight: "92",
    assistance: "Hard Pull", assistanceCode: "3 — Hard Pull",
    notes: "Difficult delivery — large calf, needed mechanical assistance. Dam and calf both recovered.",
    memo: "Monitor — hard pull on latest calf, check recovery",
    location: "Calving Pasture A", group: "2026 Season", calfStatus: "Active",
    quickNotes: [],
    dam: {
      tag: "8812", tagColor: "Orange", sex: "Cow", animalType: "Cow", yearBorn: "2019",
      status: "Active", flag: "gold", weight: "1,156",
      eid: "982 000364511698", eid2: "", otherId: "SBR-8812", lifetimeId: "USA8812-2019",
      memo: "Monitor — hard pull on latest calf, check recovery",
      notes: "Calved Feb 21 — bull calf 8846, hard pull, recovering",
      calvingHistory: [
        { date: "Feb 21, 2026", calfTag: "8846", calfSex: "Bull", birthWeight: "92 lbs", assistance: "Hard pull", notes: "Difficult delivery — mechanical assistance needed" },
        { date: "May 2, 2025", calfTag: "8855", calfSex: "Bull", birthWeight: "82 lbs", assistance: "None", notes: "Normal birth" },
        { date: "Apr 12, 2024", calfTag: "7601", calfSex: "Heifer", birthWeight: "75 lbs", assistance: "None", notes: "Normal birth, strong calf" },
      ],
      workHistory: [
        { date: "Jan 14, 2026", project: "Winter Vaccination", weight: "1,130", preg: "Confirmed", notes: "Normal — routine", flag: null, treatments: [{ name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" }, { name: "Ivermectin Pour-On", dosage: "50 mL", route: "Topical" }] },
        { date: "Oct 15, 2025", project: "Fall Processing", weight: "1,098", preg: "Confirmed", notes: "Normal — fall processing complete", flag: null, treatments: [{ name: "Dectomax Pour-On", dosage: "50 mL", route: "Topical" }, { name: "Multimin 90", dosage: "11 mL", route: "SQ" }] },
      ],
    },
  },
  "8851": {
    calfTag: "8851", damTag: "5520", sire: "SAV Resource", sex: "Heifer",
    birthDate: "Feb 16, 2026", birthWeight: "68",
    assistance: "Surgical", assistanceCode: "4 — Surgical",
    notes: "C-section required — calf breech. Both dam and calf survived. Dam flagged critical.",
    memo: "Chronic limp, poor BCS — cull candidate. C-section Feb 2026.",
    location: "Barn / Vet Area", group: "2026 Season", calfStatus: "Active",
    quickNotes: [],
    dam: {
      tag: "5520", tagColor: "Red", sex: "Cow", animalType: "Cow", yearBorn: "2018",
      status: "Active", flag: "red", weight: "1,102",
      eid: "982 000364509337", eid2: "", otherId: "SBR-5520", lifetimeId: "USA5520-2018",
      memo: "Chronic limp, poor BCS — cull candidate. C-section Feb 2026.",
      notes: "C-section Feb 16 — heifer calf 8851 survived. Dam recovering.",
      calvingHistory: [
        { date: "Feb 16, 2026", calfTag: "8851", calfSex: "Heifer", birthWeight: "68 lbs", assistance: "Surgical", notes: "C-section — calf breech, both survived" },
        { date: "Apr 28, 2025", calfTag: "9102", calfSex: "Heifer", birthWeight: "72 lbs", assistance: "Mechanical", notes: "Difficult pull — calf positioned backward" },
        { date: "Mar 15, 2024", calfTag: "7834", calfSex: "Bull", birthWeight: "90 lbs", assistance: "None", notes: "Normal birth" },
      ],
      workHistory: [
        { date: "Jan 14, 2026", project: "Winter Vaccination", weight: "1,080", preg: "Confirmed", notes: "Limping — right rear, treated with Banamine", flag: "red", treatments: [{ name: "Banamine", dosage: "10 mL", route: "IV" }, { name: "Penicillin", dosage: "10 cc", route: "IM" }] },
        { date: "Oct 15, 2025", project: "Fall Processing", weight: "1,065", preg: "Confirmed", notes: "Chronic limp noted, flagged for cull review", flag: "red", treatments: [{ name: "Dectomax Pour-On", dosage: "50 mL", route: "Topical" }] },
      ],
    },
  },
};

/* ══════════════════════════════════════════════
   Context
   ══════════════════════════════════════════════ */

interface CalvingDataContextValue {
  records: CalvingRecord[];
  details: Record<string, CalvingDetail>;
  updateRecord: (calfTag: string, updates: Partial<CalvingRecord>) => void;
  updateDetail: (calfTag: string, updates: Partial<Omit<CalvingDetail, "dam">>) => void;
  getDetail: (calfTag: string) => CalvingDetail | undefined;
}

const CalvingDataContext = createContext<CalvingDataContextValue | null>(null);

export function CalvingDataProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<CalvingRecord[]>(INITIAL_RECORDS);
  const [details, setDetails] = useState<Record<string, CalvingDetail>>(INITIAL_DETAILS);

  const updateRecord = useCallback((calfTag: string, updates: Partial<CalvingRecord>) => {
    setRecords((prev) =>
      prev.map((r) => (r.calfTag === calfTag ? { ...r, ...updates } : r))
    );
  }, []);

  const updateDetail = useCallback((calfTag: string, updates: Partial<Omit<CalvingDetail, "dam">>) => {
    setDetails((prev) => {
      const existing = prev[calfTag];
      if (!existing) return prev;
      return { ...prev, [calfTag]: { ...existing, ...updates } };
    });
    // Also sync key fields back to the list record
    if (updates.notes !== undefined || updates.memo !== undefined || updates.calfStatus !== undefined) {
      setRecords((prev) =>
        prev.map((r) => {
          if (r.calfTag !== calfTag) return r;
          const patched = { ...r };
          if (updates.notes !== undefined) patched.notes = updates.notes;
          if (updates.memo !== undefined) patched.memo = updates.memo;
          return patched;
        })
      );
    }
  }, []);

  const getDetail = useCallback(
    (calfTag: string) => details[calfTag],
    [details]
  );

  return (
    <CalvingDataContext.Provider value={{ records, details, updateRecord, updateDetail, getDetail }}>
      {children}
    </CalvingDataContext.Provider>
  );
}

export function useCalvingData() {
  const ctx = useContext(CalvingDataContext);
  if (!ctx) throw new Error("useCalvingData must be used inside <CalvingDataProvider>");
  return ctx;
}
