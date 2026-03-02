import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

/* ═══════════════════════════════════════════
   Pill style maps
   ═══════════════════════════════════════════ */
const CATEGORY_PILL: Record<string, { bg: string; color: string }> = {
  Vaccine:          { bg: "#E3F2FD", color: "#1565C0" },
  Antibiotic:       { bg: "#FFF3E0", color: "#E65100" },
  Supplement:       { bg: "#E8F5E9", color: "#2E7D32" },
  Parasiticide:     { bg: "#F3E5F5", color: "#6A1B9A" },
  "Anti-inflammatory": { bg: "#E3F2FD", color: "#1565C0" },
  Other:            { bg: "#F5F5F0", color: "rgba(26,26,26,0.50)" },
};

const ROUTE_PILL: Record<string, { bg: string; color: string }> = {
  SQ:         { bg: "#E3F2FD", color: "#1565C0" },
  IM:         { bg: "#E3F2FD", color: "#1565C0" },
  IV:         { bg: "#E3F2FD", color: "#1565C0" },
  Oral:       { bg: "#E3F2FD", color: "#1565C0" },
  Topical:    { bg: "#E3F2FD", color: "#1565C0" },
  Intranasal: { bg: "#E3F2FD", color: "#1565C0" },
};

/* ═══════════════════════════════════════════
   Data types
   ═══════════════════════════════════════════ */
interface DosageRow {
  lbs: string;
  kg: string;
  mL: string;
}

interface WithdrawalAnimal {
  tag: string;
  tagColor: string;
  breed: string;
  clearsDate: string;
}

interface ProductDetail {
  id: string;
  name: string;
  genericName: string;
  category: string;
  route: string;
  rxRequired: boolean;
  /* Withdrawal */
  meatWithdrawalDays?: number;
  milkNote?: string;
  withdrawalNote?: string;
  /* Dosage & admin */
  dosageRate: string;
  routeDetail: string;
  injectionSite: string;
  volumeLimit: string;
  frequency: string;
  needleGauge: string;
  /* Dosage table */
  dosageTable: DosageRow[];
  dosageTip?: string;
  /* Indications */
  indications: string[];
  /* Storage */
  storage: { icon: "temp" | "sun" | "droplet" | "trash"; text: string }[];
  /* Usage */
  usageStats: { dosesGiven: number; animalsTreated: number; activeWithdrawal: number };
  withdrawalAnimals: WithdrawalAnimal[];
  /* Lot */
  lotNumber: string;
  expiration: string;
  serialNdc: string;
}

/* ═══════════════════════════════════════════
   Product data (6 fully detailed products)
   ═══════════════════════════════════════════ */
const PRODUCTS: Record<string, ProductDetail> = {
  p4: {
    id: "p4",
    name: "Draxxin",
    genericName: "Tulathromycin Injectable Solution",
    category: "Antibiotic",
    route: "SQ",
    rxRequired: true,
    meatWithdrawalDays: 64,
    milkNote: "Not approved for lactating dairy",
    withdrawalNote:
      "Do not treat cattle within 64 days of slaughter. Not for use in female dairy cattle 20 months of age or older.",
    dosageRate: "1.1 mL per 100 lbs body weight (2.5 mg/kg)",
    routeDetail: "Subcutaneous (SQ) — in the neck only",
    injectionSite: "Subcutaneous in the neck. Do not inject in other locations.",
    volumeLimit: "Do not exceed 10 mL per injection site",
    frequency: "Single dose. Do not repeat.",
    needleGauge: "16 or 18 gauge, ¾ to 1 inch needle",
    dosageTable: [
      { lbs: "200", kg: "91", mL: "2.2" },
      { lbs: "400", kg: "182", mL: "4.4" },
      { lbs: "600", kg: "272", mL: "6.6" },
      { lbs: "800", kg: "363", mL: "8.8" },
      { lbs: "1,000", kg: "454", mL: "11.0" },
      { lbs: "1,200", kg: "544", mL: "13.2" },
      { lbs: "1,400", kg: "635", mL: "15.4" },
      { lbs: "1,600", kg: "726", mL: "17.6" },
    ],
    dosageTip: "Tip: For 1,000+ lb animals, split into two injection sites of equal volume.",
    indications: [
      "Treatment of bovine respiratory disease (BRD) associated with Mannheimia haemolytica, Pasteurella multocida, Histophilus somni, and Mycoplasma bovis",
      "Control of respiratory disease in cattle at high risk of developing BRD",
      "Treatment of infectious bovine keratoconjunctivitis (IBK / Pinkeye) caused by Moraxella bovis",
      "Treatment of foot rot (interdigital necrobacillosis) caused by Fusobacterium necrophorum and Porphyromonas levii",
    ],
    storage: [
      { icon: "temp", text: "Store at controlled room temperature 68°F–77°F (20°C–25°C)" },
      { icon: "sun", text: "Protect from light. Do not freeze." },
      { icon: "droplet", text: "Use entire contents within 60 days of first puncture" },
      { icon: "trash", text: "Dispose of empty containers per local regulations" },
    ],
    usageStats: { dosesGiven: 47, animalsTreated: 18, activeWithdrawal: 2 },
    withdrawalAnimals: [
      { tag: "5520", tagColor: "#2E7D32", breed: "Charolais - Cow", clearsDate: "Mar 21" },
      { tag: "3091", tagColor: "#B8860B", breed: "Hereford - Cow", clearsDate: "Apr 2" },
    ],
    lotNumber: "DX-2025-4471",
    expiration: "Sep 2026",
    serialNdc: "0069-0189-10",
  },
  p6: {
    id: "p6",
    name: "Excede",
    genericName: "Ceftiofur Crystalline Free Acid",
    category: "Antibiotic",
    route: "SQ",
    rxRequired: true,
    meatWithdrawalDays: 13,
    milkNote: "Not for use in lactating dairy cattle",
    withdrawalNote: "Do not treat cattle within 13 days of slaughter.",
    dosageRate: "1.5 mL per 100 lbs body weight (6.6 mg/kg)",
    routeDetail: "Subcutaneous (SQ) — base or posterior of the ear only",
    injectionSite: "Base of the ear. Do not inject in the neck or other locations.",
    volumeLimit: "Do not exceed 10 mL per injection site",
    frequency: "Single dose at the base of the ear.",
    needleGauge: "16 gauge, ⅝ to 1 inch needle",
    dosageTable: [
      { lbs: "200", kg: "91", mL: "3.0" },
      { lbs: "400", kg: "182", mL: "6.0" },
      { lbs: "600", kg: "272", mL: "9.0" },
      { lbs: "800", kg: "363", mL: "12.0" },
      { lbs: "1,000", kg: "454", mL: "15.0" },
      { lbs: "1,200", kg: "544", mL: "18.0" },
    ],
    dosageTip: "Tip: For cattle over 800 lbs, split into two injection sites at the base of each ear.",
    indications: [
      "Treatment of BRD associated with Mannheimia haemolytica, Pasteurella multocida, and Histophilus somni",
      "Control of BRD in cattle at high risk",
      "Treatment of foot rot caused by Fusobacterium necrophorum and Bacteroides melaninogenicus",
    ],
    storage: [
      { icon: "temp", text: "Store at controlled room temperature 68°F–77°F (20°C–25°C)" },
      { icon: "sun", text: "Protect from light and moisture." },
      { icon: "droplet", text: "Shake well before use. Use within 12 weeks of first puncture." },
      { icon: "trash", text: "Dispose of empty containers per local regulations" },
    ],
    usageStats: { dosesGiven: 22, animalsTreated: 14, activeWithdrawal: 0 },
    withdrawalAnimals: [],
    lotNumber: "EX-2025-1192",
    expiration: "Dec 2026",
    serialNdc: "0009-0556-02",
  },
  p1: {
    id: "p1",
    name: "Multimin 90",
    genericName: "Injectable Trace Mineral Solution (Zn, Mn, Se, Cu)",
    category: "Supplement",
    route: "SQ",
    rxRequired: false,
    meatWithdrawalDays: 21,
    milkNote: "0 days",
    withdrawalNote: "Do not treat cattle within 21 days of slaughter. Zero-day milk withdrawal.",
    dosageRate: "1 mL per 100 lbs body weight",
    routeDetail: "Subcutaneous (SQ) — in the neck",
    injectionSite: "Subcutaneous in the neck region.",
    volumeLimit: "Do not exceed 10 mL per injection site",
    frequency: "Administer at key production stages: pre-breeding, pre-calving, weaning, and processing.",
    needleGauge: "16 or 18 gauge, ¾ inch needle",
    dosageTable: [
      { lbs: "200", kg: "91", mL: "2.0" },
      { lbs: "400", kg: "182", mL: "4.0" },
      { lbs: "600", kg: "272", mL: "6.0" },
      { lbs: "800", kg: "363", mL: "8.0" },
      { lbs: "1,000", kg: "454", mL: "10.0" },
      { lbs: "1,200", kg: "544", mL: "12.0" },
      { lbs: "1,400", kg: "635", mL: "14.0" },
    ],
    dosageTip: "Tip: Split into two injection sites if volume exceeds 10 mL.",
    indications: [
      "Supplementation of zinc, manganese, selenium, and copper in cattle",
      "Support of immune function during high-stress periods",
      "Pre-breeding mineral support for improved reproductive performance",
    ],
    storage: [
      { icon: "temp", text: "Store at controlled room temperature 59°F–86°F (15°C–30°C)" },
      { icon: "sun", text: "Protect from light." },
      { icon: "droplet", text: "Use within 90 days of first puncture" },
      { icon: "trash", text: "Dispose of empty containers per local regulations" },
    ],
    usageStats: { dosesGiven: 340, animalsTreated: 340, activeWithdrawal: 0 },
    withdrawalAnimals: [],
    lotNumber: "MM-2025-7830",
    expiration: "Jan 2027",
    serialNdc: "N/A",
  },
  p2: {
    id: "p2",
    name: "Bovi-Shield Gold 5",
    genericName: "IBR-BVD-PI3-BRSV Modified-Live Vaccine",
    category: "Vaccine",
    route: "SQ",
    rxRequired: false,
    dosageRate: "2 mL per animal",
    routeDetail: "Subcutaneous (SQ) — in the neck",
    injectionSite: "Subcutaneous in the neck region.",
    volumeLimit: "2 mL single dose",
    frequency: "Annual booster. Administer 2 doses 2–4 weeks apart for initial vaccination.",
    needleGauge: "18 gauge, ¾ inch needle",
    dosageTable: [
      { lbs: "All weights", kg: "—", mL: "2.0" },
    ],
    indications: [
      "Vaccination against IBR (Infectious Bovine Rhinotracheitis)",
      "Vaccination against BVD Types 1 and 2 (Bovine Viral Diarrhea)",
      "Vaccination against PI3 (Parainfluenza-3)",
      "Vaccination against BRSV (Bovine Respiratory Syncytial Virus)",
    ],
    storage: [
      { icon: "temp", text: "Store refrigerated at 35°F–45°F (2°C–7°C)" },
      { icon: "sun", text: "Protect from light. Do not freeze." },
      { icon: "droplet", text: "Use entire contents within 1 hour of rehydrating" },
      { icon: "trash", text: "Dispose of unused vaccine per label directions" },
    ],
    usageStats: { dosesGiven: 412, animalsTreated: 412, activeWithdrawal: 0 },
    withdrawalAnimals: [],
    lotNumber: "BV-2025-3320",
    expiration: "Mar 2027",
    serialNdc: "0856-2021-06",
  },
  p3: {
    id: "p3",
    name: "Ivermectin",
    genericName: "Ivermectin Injectable Solution (1%)",
    category: "Parasiticide",
    route: "SQ",
    rxRequired: false,
    meatWithdrawalDays: 35,
    milkNote: "Not for use in lactating dairy cattle",
    withdrawalNote: "Do not treat cattle within 35 days of slaughter.",
    dosageRate: "1 mL per 110 lbs body weight (200 mcg/kg)",
    routeDetail: "Subcutaneous (SQ) — in front of the shoulder",
    injectionSite: "Subcutaneous in front of or behind the shoulder.",
    volumeLimit: "Do not exceed 10 mL per injection site",
    frequency: "Single dose. Repeat as needed based on parasite load.",
    needleGauge: "16 or 18 gauge, ¾ to 1 inch needle",
    dosageTable: [
      { lbs: "200", kg: "91", mL: "1.8" },
      { lbs: "400", kg: "182", mL: "3.6" },
      { lbs: "600", kg: "272", mL: "5.5" },
      { lbs: "800", kg: "363", mL: "7.3" },
      { lbs: "1,000", kg: "454", mL: "9.1" },
      { lbs: "1,200", kg: "544", mL: "10.9" },
    ],
    indications: [
      "Treatment and control of gastrointestinal roundworms",
      "Treatment and control of lungworms",
      "Treatment and control of cattle grubs (larvae of Hypoderma spp.)",
      "Treatment and control of sucking lice and mange mites",
    ],
    storage: [
      { icon: "temp", text: "Store at controlled room temperature 59°F–86°F (15°C–30°C)" },
      { icon: "sun", text: "Protect from light." },
      { icon: "droplet", text: "Use entire contents within 6 months of first puncture" },
      { icon: "trash", text: "Dispose of empty containers per local regulations" },
    ],
    usageStats: { dosesGiven: 280, animalsTreated: 280, activeWithdrawal: 0 },
    withdrawalAnimals: [],
    lotNumber: "IV-2025-0915",
    expiration: "Aug 2027",
    serialNdc: "0061-0613-01",
  },
  p5: {
    id: "p5",
    name: "Vista Once SQ",
    genericName: "IBR-BVD-PI3-BRSV-Leptospira Modified-Live Vaccine",
    category: "Vaccine",
    route: "SQ",
    rxRequired: false,
    dosageRate: "2 mL per animal",
    routeDetail: "Subcutaneous (SQ) — in the neck",
    injectionSite: "Subcutaneous in the neck region.",
    volumeLimit: "2 mL single dose",
    frequency: "Single dose. Annual revaccination recommended.",
    needleGauge: "18 gauge, ¾ inch needle",
    dosageTable: [
      { lbs: "All weights", kg: "—", mL: "2.0" },
    ],
    indications: [
      "Vaccination against IBR, BVD Types 1 and 2, PI3, and BRSV",
      "Vaccination against Leptospira canicola, grippotyphosa, hardjo, icterohaemorrhagiae, and pomona",
      "Single-dose convenience for processing-day protocols",
    ],
    storage: [
      { icon: "temp", text: "Store refrigerated at 35°F–45°F (2°C–7°C)" },
      { icon: "sun", text: "Protect from light. Do not freeze." },
      { icon: "droplet", text: "Use entire contents within 1 hour of rehydrating" },
      { icon: "trash", text: "Dispose of unused vaccine per label directions" },
    ],
    usageStats: { dosesGiven: 87, animalsTreated: 87, activeWithdrawal: 0 },
    withdrawalAnimals: [],
    lotNumber: "VS-2025-6602",
    expiration: "Nov 2026",
    serialNdc: "0061-0979-03",
  },
  p7: {
    id: "p7",
    name: "Lutalyse",
    genericName: "Dinoprost Tromethamine (PGF2α)",
    category: "Supplement",
    route: "IM",
    rxRequired: true,
    dosageRate: "5 mL per animal (25 mg dinoprost)",
    routeDetail: "Intramuscular (IM) — in the neck or hip",
    injectionSite: "Intramuscular injection in the neck or gluteal muscles.",
    volumeLimit: "5 mL single dose",
    frequency: "Per synchronization protocol. May repeat in 11–14 days.",
    needleGauge: "18 gauge, 1 to 1½ inch needle",
    dosageTable: [
      { lbs: "All weights", kg: "—", mL: "5.0" },
    ],
    indications: [
      "Synchronization of estrus in cycling beef and dairy cattle",
      "Treatment of pyometra (chronic endometritis)",
      "Induction of abortion in feedlot heifers",
      "Induction of parturition in cattle",
    ],
    storage: [
      { icon: "temp", text: "Store at controlled room temperature 59°F–86°F (15°C–30°C)" },
      { icon: "sun", text: "Protect from light." },
      { icon: "droplet", text: "Multi-dose vial — use within 28 days of first puncture" },
      { icon: "trash", text: "Women of childbearing age should exercise extreme caution handling this product" },
    ],
    usageStats: { dosesGiven: 164, animalsTreated: 164, activeWithdrawal: 0 },
    withdrawalAnimals: [],
    lotNumber: "LU-2025-2100",
    expiration: "Jul 2026",
    serialNdc: "0009-0281-03",
  },
  p8: {
    id: "p8",
    name: "Safeguard",
    genericName: "Fenbendazole Suspension (10%)",
    category: "Parasiticide",
    route: "Oral",
    rxRequired: false,
    meatWithdrawalDays: 8,
    milkNote: "0 days",
    withdrawalNote: "Do not treat cattle within 8 days of slaughter. Zero-day milk withdrawal.",
    dosageRate: "2.3 mL per 100 lbs body weight (5 mg/kg)",
    routeDetail: "Oral — via drench gun or in feed",
    injectionSite: "N/A — oral administration",
    volumeLimit: "N/A",
    frequency: "Single dose. May repeat based on fecal egg counts.",
    needleGauge: "N/A — use drench gun",
    dosageTable: [
      { lbs: "200", kg: "91", mL: "4.6" },
      { lbs: "400", kg: "182", mL: "9.2" },
      { lbs: "600", kg: "272", mL: "13.8" },
      { lbs: "800", kg: "363", mL: "18.4" },
      { lbs: "1,000", kg: "454", mL: "23.0" },
      { lbs: "1,200", kg: "544", mL: "27.6" },
    ],
    indications: [
      "Removal and control of lungworms, stomach worms, and intestinal worms",
      "Safe for use in pregnant cattle",
      "Effective against inhibited early 4th stage Ostertagia ostertagi larvae",
    ],
    storage: [
      { icon: "temp", text: "Store at controlled room temperature 59°F–86°F (15°C–30°C)" },
      { icon: "sun", text: "Shake well before use." },
      { icon: "droplet", text: "Stable for the labeled shelf life when stored properly" },
      { icon: "trash", text: "Dispose of empty containers per local regulations" },
    ],
    usageStats: { dosesGiven: 215, animalsTreated: 215, activeWithdrawal: 0 },
    withdrawalAnimals: [],
    lotNumber: "SG-2025-5540",
    expiration: "Apr 2027",
    serialNdc: "0061-0625-01",
  },
};

const FALLBACK: ProductDetail = {
  id: "unknown",
  name: "Product",
  genericName: "Product details are being prepared",
  category: "Other",
  route: "SQ",
  rxRequired: false,
  dosageRate: "See product label",
  routeDetail: "See product label",
  injectionSite: "See product label",
  volumeLimit: "See product label",
  frequency: "See product label",
  needleGauge: "See product label",
  dosageTable: [],
  indications: ["Consult your veterinarian or the product label"],
  storage: [{ icon: "temp", text: "Store per label instructions" }],
  usageStats: { dosesGiven: 0, animalsTreated: 0, activeWithdrawal: 0 },
  withdrawalAnimals: [],
  lotNumber: "—",
  expiration: "—",
  serialNdc: "—",
};

/* ═══════════════════════════════════════════
   Inline SVG Icons
   ═══════════════════════════════════════════ */
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
      <circle cx="9" cy="9" r="7" stroke="#B8860B" strokeWidth="1.3" />
      <path d="M9 5V9L11.5 10.5" stroke="#B8860B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThermometerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
      <rect x="5.5" y="1" width="3" height="8" rx="1.5" stroke="#2196F3" strokeWidth="1.1" />
      <circle cx="7" cy="11" r="2" stroke="#2196F3" strokeWidth="1.1" />
      <line x1="7" y1="7" x2="7" y2="9.5" stroke="#2196F3" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
      <circle cx="7" cy="7" r="3" stroke="#E67E22" strokeWidth="1.1" />
      <path d="M7 1.5V3M7 11V12.5M1.5 7H3M11 7H12.5M3.1 3.1L4.2 4.2M9.8 9.8L10.9 10.9M3.1 10.9L4.2 9.8M9.8 4.2L10.9 3.1" stroke="#E67E22" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
      <path d="M7 1.5C7 1.5 3 6 3 8.5C3 10.7 4.8 12.5 7 12.5C9.2 12.5 11 10.7 11 8.5C11 6 7 1.5 7 1.5Z" stroke="#2196F3" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
      <path d="M2.5 4H11.5M5 4V2.5H9V4M5.5 6.5V10M8.5 6.5V10M3.5 4L4 11.5H10L10.5 4" stroke="#E74C3C" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STORAGE_ICONS: Record<string, () => JSX.Element> = {
  temp: ThermometerIcon,
  sun: SunIcon,
  droplet: DropletIcon,
  trash: TrashIcon,
};

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M5 3L9 7L5 11" stroke="#55BAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-px">
      <circle cx="8" cy="8" r="6.5" stroke="#2196F3" strokeWidth="1.2" />
      <path d="M8 7V11" stroke="#2196F3" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="#2196F3" />
    </svg>
  );
}

function DotsMenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3.5" r="1.25" fill="#1A1A1A" fillOpacity="0.25" />
      <circle cx="8" cy="8" r="1.25" fill="#1A1A1A" fillOpacity="0.25" />
      <circle cx="8" cy="12.5" r="1.25" fill="#1A1A1A" fillOpacity="0.25" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Shared UI pieces
   ═══════════════════════════════════════════ */
function Pill({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full font-['Inter']"
      style={{ padding: "2px 10px", fontSize: 10, fontWeight: 700, backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p
      className="font-['Inter'] uppercase px-1 mb-2"
      style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(14,38,70,0.35)" }}
    >
      {text}
    </p>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="uppercase font-['Inter']"
        style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "rgba(26,26,26,0.35)" }}
      >
        {label}
      </p>
      <p className="mt-0.5 font-['Inter']" style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>
        {value}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3-Dot Dropdown on header card
   ═══════════════════════════════════════════ */
function HeaderDotsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center cursor-pointer"
        style={{ width: 28, height: 28, background: "none", border: "none" }}
        aria-label="Product actions"
      >
        <DotsMenuIcon />
      </button>
      {open && (
        <div className="absolute right-0 top-[32px] z-20 w-44 rounded-xl bg-white border border-[#D4D4D0] shadow-lg overflow-hidden font-['Inter']">
          {["Edit Product", "Record Treatment", "View Label PDF"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setOpen(false)}
              className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
              style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", background: "none", border: "none" }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRODUCT DETAIL SCREEN
   ═══════════════════════════════════════════ */
export function ProductDetailScreen() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const product = PRODUCTS[productId || ""] || FALLBACK;

  const catPill = CATEGORY_PILL[product.category] || CATEGORY_PILL.Other!;
  const routePill = ROUTE_PILL[product.route] || ROUTE_PILL.SQ!;

  return (
    <div className="font-['Inter']" style={{ padding: 20 }}>
      {/* ══ PRODUCT HEADER CARD ══ */}
      <div className="rounded-xl bg-white" style={{ border: "1px solid #D4D4D0", padding: 20 }}>
        <div className="flex items-start justify-between">
          <p style={{ fontSize: 17, fontWeight: 700, color: "#0E2646", lineHeight: 1.3 }}>
            {product.name}
          </p>
          <HeaderDotsMenu />
        </div>
        <p className="mt-1" style={{ fontSize: 13, fontWeight: 400, color: "rgba(26,26,26,0.45)" }}>
          {product.genericName}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-2.5">
          <Pill label={product.category} bg={catPill.bg} color={catPill.color} />
          <Pill label={product.route} bg={routePill.bg} color={routePill.color} />
          {product.rxRequired && <Pill label="Rx Required" bg="#F3E5F5" color="#6A1B9A" />}
        </div>
      </div>

      {/* ══ WITHDRAWAL ALERT CARD ══ */}
      {product.meatWithdrawalDays != null && (
        <div
          className="rounded-xl mt-3"
          style={{ backgroundColor: "#FFF8E1", border: "1.5px solid rgba(243,209,42,0.40)", padding: 16 }}
        >
          <div className="flex items-center gap-2">
            <ClockIcon />
            <p style={{ fontSize: 14, fontWeight: 700, color: "#B8860B" }}>Withdrawal Periods</p>
          </div>
          <div className="flex flex-col gap-2.5 mt-3">
            <div className="flex items-center justify-between">
              <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(26,26,26,0.65)" }}>Meat / Slaughter</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#C62828" }}>{product.meatWithdrawalDays} days</p>
            </div>
            {product.milkNote && (
              <div className="flex items-center justify-between">
                <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(26,26,26,0.65)" }}>Milk</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: product.milkNote === "0 days" ? "#2E7D32" : "#E65100" }}>
                  {product.milkNote}
                </p>
              </div>
            )}
          </div>
          {product.withdrawalNote && (
            <p className="mt-2" style={{ fontSize: 11, fontWeight: 400, color: "rgba(184,134,11,0.70)", lineHeight: 1.5 }}>
              {product.withdrawalNote}
            </p>
          )}
        </div>
      )}

      {/* ══ SECTION 1: DOSAGE & ADMINISTRATION ══ */}
      <div style={{ marginTop: 16 }}>
        <SectionLabel text="Dosage & Administration" />
        <div className="rounded-xl bg-white" style={{ border: "1px solid #D4D4D0", padding: 16 }}>
          <div className="flex flex-col" style={{ gap: 14 }}>
            <DetailRow label="Dosage Rate" value={product.dosageRate} />
            <DetailRow label="Route" value={product.routeDetail} />
            <DetailRow label="Injection Site" value={product.injectionSite} />
            <DetailRow label="Volume Limit" value={product.volumeLimit} />
            <DetailRow label="Frequency" value={product.frequency} />
            <DetailRow label="Needle Gauge" value={product.needleGauge} />
          </div>
        </div>
      </div>

      {/* ══ SECTION 2: DOSAGE BY WEIGHT ══ */}
      {product.dosageTable.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <SectionLabel text="Dosage by Weight" />
          <div className="rounded-xl bg-white overflow-hidden" style={{ border: "1px solid #D4D4D0" }}>
            {/* Table header */}
            <div className="flex" style={{ padding: "10px 16px", backgroundColor: "#F5F5F0" }}>
              <p className="flex-1 text-left" style={{ fontSize: 11, fontWeight: 700, color: "rgba(14,38,70,0.50)" }}>
                Weight (lbs)
              </p>
              <p className="flex-1 text-center" style={{ fontSize: 11, fontWeight: 700, color: "rgba(14,38,70,0.50)" }}>
                Weight (kg)
              </p>
              <p className="flex-1 text-right" style={{ fontSize: 11, fontWeight: 700, color: "rgba(14,38,70,0.50)" }}>
                Dose (mL)
              </p>
            </div>
            {/* Table rows */}
            <div className="divide-y divide-[#D4D4D0]/30">
              {product.dosageTable.map((row, i) => (
                <div key={i} className="flex" style={{ padding: "10px 16px" }}>
                  <p className="flex-1 text-left" style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>
                    {row.lbs}
                  </p>
                  <p className="flex-1 text-center" style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>
                    {row.kg}
                  </p>
                  <p className="flex-1 text-right" style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>
                    {row.mL}
                  </p>
                </div>
              ))}
            </div>
            {/* Dosage tip */}
            {product.dosageTip && (
              <div
                style={{
                  padding: "10px 16px",
                  backgroundColor: "rgba(85,186,170,0.05)",
                  borderTop: "1px solid rgba(212,212,208,0.30)",
                }}
              >
                <p style={{ fontSize: 11, fontWeight: 500, color: "#55BAAA" }}>{product.dosageTip}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ SECTION 3: LABELED INDICATIONS ══ */}
      <div style={{ marginTop: 16 }}>
        <SectionLabel text="Labeled Indications" />
        <div className="rounded-xl bg-white" style={{ border: "1px solid #D4D4D0", padding: 16 }}>
          <div className="flex flex-col" style={{ gap: 8 }}>
            {product.indications.map((ind, i) => (
              <div key={i} className="flex items-start" style={{ gap: 10 }}>
                <span
                  className="shrink-0 rounded-full mt-1.5"
                  style={{ width: 6, height: 6, backgroundColor: "#55BAAA" }}
                />
                <p style={{ fontSize: 13, fontWeight: 400, color: "rgba(26,26,26,0.70)", lineHeight: 1.45 }}>
                  {ind}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SECTION 4: STORAGE & HANDLING ══ */}
      <div style={{ marginTop: 16 }}>
        <SectionLabel text="Storage & Handling" />
        <div className="rounded-xl bg-white" style={{ border: "1px solid #D4D4D0", padding: 16 }}>
          <div className="flex flex-col" style={{ gap: 10 }}>
            {product.storage.map((s, i) => {
              const Icon = STORAGE_ICONS[s.icon] || ThermometerIcon;
              return (
                <div key={i} className="flex items-start" style={{ gap: 10 }}>
                  <Icon />
                  <p style={{ fontSize: 13, fontWeight: 400, color: "rgba(26,26,26,0.65)", lineHeight: 1.45 }}>
                    {s.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ SECTION 5: YOUR USAGE ══ */}
      <div style={{ marginTop: 16 }}>
        <SectionLabel text="Your Usage" />
        <div className="rounded-xl bg-white" style={{ border: "1.5px solid rgba(85,186,170,0.20)", padding: 16 }}>
          {/* Stats row */}
          <div className="flex">
            {[
              {
                value: String(product.usageStats.dosesGiven),
                label: "DOSES GIVEN",
                valueColor: "#0E2646",
              },
              {
                value: String(product.usageStats.animalsTreated),
                label: "ANIMALS TREATED",
                valueColor: "#0E2646",
              },
              {
                value: String(product.usageStats.activeWithdrawal),
                label: "ACTIVE WITHDRAWAL",
                valueColor: product.usageStats.activeWithdrawal > 0 ? "#E74C3C" : "#0E2646",
              },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 text-center">
                <p style={{ fontSize: 18, fontWeight: 800, color: stat.valueColor }}>{stat.value}</p>
                <p className="mt-0.5" style={{ fontSize: 10, fontWeight: 600, color: "rgba(26,26,26,0.35)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Active withdrawal animals */}
          {product.withdrawalAnimals.length > 0 && (
            <div
              className="rounded-lg overflow-hidden divide-y divide-[#FFEBEE] mt-3"
              style={{ border: "1px solid #FFEBEE" }}
            >
              {product.withdrawalAnimals.map((a) => (
                <div key={a.tag} className="flex items-center justify-between" style={{ padding: "8px 12px" }}>
                  <div className="flex items-center gap-2">
                    <span
                      className="shrink-0 rounded-full"
                      style={{ width: 8, height: 8, backgroundColor: a.tagColor }}
                    />
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>
                      {a.tag}
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.40)" }}>
                      {a.breed}
                    </p>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#C62828" }}>Clears {a.clearsDate}</p>
                </div>
              ))}
            </div>
          )}

          {/* Treatment history link */}
          <button
            type="button"
            onClick={() => navigate("/treatments")}
            className="flex items-center gap-1.5 mt-3 cursor-pointer"
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#55BAAA" }}>View all treatment history</span>
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      {/* ══ SECTION 6: CURRENT LOT ══ */}
      <div style={{ marginTop: 16 }}>
        <SectionLabel text="Current Lot" />
        <div className="rounded-xl bg-white" style={{ border: "1px solid #D4D4D0", padding: 16 }}>
          <div className="flex flex-col" style={{ gap: 10 }}>
            <div>
              <p className="uppercase" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "rgba(26,26,26,0.35)" }}>
                Lot Number
              </p>
              <p className="mt-0.5" style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
                {product.lotNumber}
              </p>
            </div>
            <div>
              <p className="uppercase" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "rgba(26,26,26,0.35)" }}>
                Expiration
              </p>
              <p className="mt-0.5" style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
                {product.expiration}
              </p>
            </div>
            <div>
              <p className="uppercase" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "rgba(26,26,26,0.35)" }}>
                Serial / NDC
              </p>
              <p className="mt-0.5" style={{ fontSize: 13, fontWeight: 400, color: "rgba(26,26,26,0.55)" }}>
                {product.serialNdc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ INFO CARD ══ */}
      <div
        className="flex items-start gap-2.5 rounded-lg mt-4"
        style={{ padding: "12px 16px", backgroundColor: "#E3F2FD" }}
      >
        <InfoIcon />
        <p style={{ fontSize: 12, fontWeight: 500, color: "#0D47A1", lineHeight: 1.5 }}>
          Product information is from the manufacturer label. Always read the full label before administering.
        </p>
      </div>
    </div>
  );
}
