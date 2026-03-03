import { useParams } from "react-router";

/* ── Shared category pill styles ── */
const CATEGORY_PILL: Record<string, { bg: string; color: string }> = {
  Respiratory:       { bg: "#E3F2FD", color: "#1565C0" },
  Reproductive:      { bg: "#F3E5F5", color: "#6A1B9A" },
  Digestive:         { bg: "#FFF3E0", color: "#E65100" },
  Infectious:        { bg: "#FFEBEE", color: "#C62828" },
  Metabolic:         { bg: "#E8F5E9", color: "#2E7D32" },
  Parasitic:         { bg: "#FFF8E1", color: "#B8860B" },
  Antibiotic:        { bg: "#FFF3E0", color: "#E65100" },
  "Anti-inflammatory": { bg: "#E3F2FD", color: "#1565C0" },
  Antiparasitic:     { bg: "#FFF8E1", color: "#B8860B" },
  Supportive:        { bg: "#E8F5E9", color: "#2E7D32" },
  Other:             { bg: "#F5F5F0", color: "rgba(26,26,26,0.50)" },
};

const SEVERITY_PILL: Record<string, { bg: string; color: string }> = {
  High:     { bg: "#FFEBEE", color: "#C62828" },
  Moderate: { bg: "#FFF3E0", color: "#E65100" },
  Low:      { bg: "#E8F5E9", color: "#2E7D32" },
};

/* ── Full disease detail data ── */
interface TreatmentInfo {
  name: string;
  route: string;
  category: string;
  withdrawalDays?: number;
}

interface DiseaseDetail {
  id: string;
  name: string;
  shortName: string;
  category: string;
  severity: string;
  reportable: boolean;
  description: string;
  symptoms: string[];
  treatments: TreatmentInfo[];
  prevention: string[];
  affectedGroups: string[];
  herdStats: { activeCases: number; treated12mo: number; incidenceRate: string };
}

const DISEASES: Record<string, DiseaseDetail> = {
  d1: {
    id: "d1",
    name: "Bovine Respiratory Disease (BRD)",
    shortName: "BRD",
    category: "Respiratory",
    severity: "High",
    reportable: false,
    description:
      "The most common and costly disease in beef cattle. A complex respiratory infection caused by a combination of viral and bacterial pathogens, often triggered by stress, weather changes, or commingling.",
    symptoms: [
      "Fever above 104°F (40°C)",
      "Nasal discharge — clear progressing to thick yellow/green",
      "Cough — dry initially, becoming moist and productive",
      "Rapid or labored breathing",
      "Depression and lethargy — off feed, head down, ears drooped",
      "Watery or crusty eyes",
      "Isolation from herd — standing alone, reluctant to move",
    ],
    treatments: [
      { name: "Draxxin", route: "SQ - 1.1 mL/100 lbs", category: "Antibiotic", withdrawalDays: 64 },
      { name: "Excede", route: "SQ - 1.5 mL/100 lbs", category: "Antibiotic", withdrawalDays: 13 },
      { name: "Nuflor", route: "SQ or IM - 3 mL/100 lbs", category: "Antibiotic", withdrawalDays: 28 },
      { name: "Banamine", route: "IV - 1 mL/100 lbs", category: "Anti-inflammatory", withdrawalDays: 4 },
    ],
    prevention: [
      "Vaccination — Bovi-Shield Gold, Vista Once, or equivalent modified-live respiratory vaccine",
      "Pre-conditioning — vaccinate and wean calves 30-45 days before shipping or commingling",
      "Low-stress handling — minimize transport time, reduce commingling of unfamiliar cattle",
      "Nutritional support — adequate energy and trace minerals during high-stress periods",
      "Monitoring — pull and treat early, check new arrivals twice daily for 14 days",
    ],
    affectedGroups: ["Calves (weaning)", "Yearlings", "Feedlot cattle", "Shipped cattle", "Stressed/commingled"],
    herdStats: { activeCases: 3, treated12mo: 12, incidenceRate: "2.1%" },
  },
  d2: {
    id: "d2",
    name: "Scours",
    shortName: "Scours",
    category: "Digestive",
    severity: "Moderate",
    reportable: false,
    description:
      "Calf diarrhea caused by multiple infectious agents including E. coli, rotavirus, coronavirus, and cryptosporidium. Most common in calves under 30 days old.",
    symptoms: [
      "Watery or bloody diarrhea",
      "Dehydration — sunken eyes, skin tenting",
      "Weakness and lethargy",
      "Reduced or absent nursing",
      "Stained hindquarters and tail",
    ],
    treatments: [
      { name: "Oral Electrolytes", route: "PO - per label", category: "Supportive" },
      { name: "Spectinomycin", route: "PO - per label", category: "Antibiotic", withdrawalDays: 11 },
      { name: "Banamine", route: "IV - 1 mL/100 lbs", category: "Anti-inflammatory", withdrawalDays: 4 },
    ],
    prevention: [
      "Vaccination — ScourGuard or equivalent given to cows pre-calving",
      "Calving area sanitation — clean, dry bedding, Sandhills calving system",
      "Adequate colostrum intake within 6 hours of birth",
      "Segregate sick calves promptly",
    ],
    affectedGroups: ["Neonatal calves", "Calves <30 days", "First-calf heifers' calves"],
    herdStats: { activeCases: 1, treated12mo: 8, incidenceRate: "1.4%" },
  },
  d3: {
    id: "d3",
    name: "Pinkeye",
    shortName: "Pinkeye",
    category: "Infectious",
    severity: "Moderate",
    reportable: false,
    description:
      "Infectious bovine keratoconjunctivitis (IBK). A painful eye infection caused primarily by Moraxella bovis bacteria. Spread by face flies and direct contact.",
    symptoms: [
      "Excessive tearing and watery discharge",
      "Squinting or holding eye closed",
      "Cloudy or white spot on cornea",
      "Swollen eyelids",
      "Sensitivity to sunlight — seeking shade",
    ],
    treatments: [
      { name: "LA-200", route: "SQ - 4.5 mL/100 lbs", category: "Antibiotic", withdrawalDays: 28 },
      { name: "Draxxin", route: "SQ - 1.1 mL/100 lbs", category: "Antibiotic", withdrawalDays: 64 },
      { name: "Eye Patch", route: "Topical adhesive patch", category: "Supportive" },
    ],
    prevention: [
      "Fly control — ear tags, pour-on, oilers, fly traps",
      "Vaccination — Moraxella bovis bacterin if available",
      "Clip tall grass and weeds in pastures",
      "Isolate and treat affected animals promptly",
    ],
    affectedGroups: ["Calves", "Yearlings", "All ages in fly season"],
    herdStats: { activeCases: 0, treated12mo: 5, incidenceRate: "0.9%" },
  },
  d4: {
    id: "d4",
    name: "Foot Rot",
    shortName: "Foot Rot",
    category: "Infectious",
    severity: "Moderate",
    reportable: false,
    description:
      "Interdigital necrobacillosis. A bacterial infection of the soft tissue between the toes caused by Fusobacterium necrophorum. Common in wet, muddy conditions.",
    symptoms: [
      "Sudden lameness — usually one foot",
      "Swelling between and above the toes",
      "Foul-smelling discharge",
      "Fever",
      "Reduced appetite and weight loss",
    ],
    treatments: [
      { name: "LA-200", route: "SQ - 4.5 mL/100 lbs", category: "Antibiotic", withdrawalDays: 28 },
      { name: "Nuflor", route: "SQ - 3 mL/100 lbs", category: "Antibiotic", withdrawalDays: 28 },
      { name: "Banamine", route: "IV - 1 mL/100 lbs", category: "Anti-inflammatory", withdrawalDays: 4 },
    ],
    prevention: [
      "Minimize muddy conditions — proper drainage, mound areas",
      "Footbath — copper sulfate or zinc sulfate solution",
      "Trace mineral supplementation — zinc and copper",
      "Remove sharp objects from pens and alleys",
    ],
    affectedGroups: ["All ages", "Feedlot cattle", "Cattle in wet conditions"],
    herdStats: { activeCases: 1, treated12mo: 6, incidenceRate: "1.0%" },
  },
  d5: {
    id: "d5",
    name: "BVD (Bovine Viral Diarrhea)",
    shortName: "BVD",
    category: "Reproductive",
    severity: "High",
    reportable: false,
    description:
      "A viral disease causing reproductive failure, immunosuppression, and persistent infection. PI (persistently infected) animals shed virus continuously and are the primary source of herd infection.",
    symptoms: [
      "Reproductive failure — early embryonic death, abortions",
      "Diarrhea and mucosal disease",
      "Immunosuppression — increased susceptibility to BRD and other infections",
      "Poor growth and chronic ill-thrift in PI animals",
      "Fever and nasal discharge",
    ],
    treatments: [
      { name: "Supportive Care", route: "Fluids, electrolytes", category: "Supportive" },
      { name: "Draxxin", route: "SQ - 1.1 mL/100 lbs", category: "Antibiotic", withdrawalDays: 64 },
    ],
    prevention: [
      "Vaccination — modified-live BVD vaccine (Bovi-Shield Gold, Vista Once)",
      "PI testing — ear notch all calves at birth or processing",
      "Biosecurity — test and remove PI animals immediately",
      "Isolate new arrivals and test before commingling",
    ],
    affectedGroups: ["Breeding cows", "Calves", "PI animals (all ages)"],
    herdStats: { activeCases: 0, treated12mo: 2, incidenceRate: "0.3%" },
  },
  d6: {
    id: "d6",
    name: "Anaplasmosis",
    shortName: "Anaplasmosis",
    category: "Parasitic",
    severity: "High",
    reportable: false,
    description:
      "A tick-borne blood parasite (Anaplasma marginale) that destroys red blood cells. Most severe in cattle over 2 years old. Can be spread by ticks, biting flies, and contaminated needles.",
    symptoms: [
      "Anemia — pale mucous membranes, weakness",
      "Jaundice — yellow discoloration of eyes and gums",
      "Fever — 104-107°F",
      "Rapid breathing and elevated heart rate",
      "Sudden death in acute cases (mature cattle)",
    ],
    treatments: [
      { name: "LA-200", route: "SQ - 4.5 mL/100 lbs, repeat x5 days", category: "Antibiotic", withdrawalDays: 28 },
      { name: "Imizol", route: "SQ - per label", category: "Antiparasitic" },
      { name: "Blood Transfusion", route: "IV - severe cases", category: "Supportive" },
    ],
    prevention: [
      "Tick control — pour-ons, ear tags, pasture management",
      "Use single-use needles or change needles between animals",
      "CTC (chlortetracycline) feed additive during vector season",
      "Test and manage carrier animals",
    ],
    affectedGroups: ["Mature cattle >2yr", "Cattle in tick-endemic areas", "Imported cattle"],
    herdStats: { activeCases: 2, treated12mo: 4, incidenceRate: "0.7%" },
  },
};

/* Fallback for diseases not fully mapped */
const FALLBACK: DiseaseDetail = {
  id: "unknown",
  name: "Disease",
  shortName: "Disease",
  category: "Other",
  severity: "Moderate",
  reportable: false,
  description: "Detailed information for this disease is being prepared.",
  symptoms: ["Consult your veterinarian for symptom information"],
  treatments: [],
  prevention: ["Consult your veterinarian for prevention protocols"],
  affectedGroups: ["Varies"],
  herdStats: { activeCases: 0, treated12mo: 0, incidenceRate: "0%" },
};

/* ── Icons ── */
function ShieldCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
      <path d="M7 1L12 3V6.5C12 9.5 9.8 12 7 13C4.2 12 2 9.5 2 6.5V3L7 1Z" stroke="#55BAAA" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M5 7L6.5 8.5L9 5.5" stroke="#55BAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

/* ── Pill helpers ── */
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

function WithdrawalPill({ days }: { days: number }) {
  return (
    <span
      className="inline-flex items-center rounded-full font-['Inter']"
      style={{
        padding: "2px 8px",
        fontSize: 10,
        fontWeight: 700,
        backgroundColor: "#FFF8E1",
        border: "1px solid rgba(243,209,26,0.30)",
        color: "#B8860B",
      }}
    >
      WD: {days}d
    </span>
  );
}

/* ── Section Label ── */
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

/* ═══════════════════════════════════════════════
   DISEASE DETAIL SCREEN
   ═══════════════════════════════════════════════ */
export function DiseaseDetailScreen() {
  const { diseaseId } = useParams();
  const disease = DISEASES[diseaseId || ""] || FALLBACK;

  const catPill = CATEGORY_PILL[disease.category] || CATEGORY_PILL.Other!;
  const sevPill = SEVERITY_PILL[disease.severity] || SEVERITY_PILL.Moderate!;

  return (
    <div className="font-['Inter']" style={{ padding: 20 }}>
      {/* ══ DISEASE HEADER CARD ══ */}
      <div
        className="rounded-xl bg-white"
        style={{ border: "1px solid #D4D4D0", padding: 20 }}
      >
        {/* Name */}
        <p style={{ fontSize: 17, fontWeight: 700, color: "#0E2646", lineHeight: 1.3 }}>
          {disease.name}
        </p>

        {/* Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Pill label={disease.severity} bg={sevPill.bg} color={sevPill.color} />
          <Pill label={disease.category} bg={catPill.bg} color={catPill.color} />
          {disease.reportable && (
            <Pill label="Reportable" bg="#FFF3E0" color="#E65100" />
          )}
        </div>

        {/* Description */}
        <p
          className="mt-3"
          style={{ fontSize: 13, fontWeight: 400, color: "rgba(26,26,26,0.65)", lineHeight: 1.5 }}
        >
          {disease.description}
        </p>
      </div>

      {/* ══ SECTION: IN YOUR HERD (top) ══ */}
      <div style={{ marginTop: 16 }}>
        <SectionLabel text="In Your Herd" />
        <div
          className="rounded-xl bg-white"
          style={{ border: "1.5px solid rgba(85,186,170,0.20)", padding: 16 }}
        >
          {/* Stats row */}
          <div className="flex">
            {[
              {
                value: String(disease.herdStats.activeCases),
                label: "Active Cases",
                valueColor: disease.herdStats.activeCases > 0 ? "#E74C3C" : "#0E2646",
              },
              {
                value: String(disease.herdStats.treated12mo),
                label: "Treated (12 mo)",
                valueColor: "#0E2646",
              },
              {
                value: disease.herdStats.incidenceRate,
                label: "Incidence Rate",
                valueColor: "#0E2646",
              },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 text-center">
                <p style={{ fontSize: 18, fontWeight: 800, color: stat.valueColor }}>
                  {stat.value}
                </p>
                <p
                  className="mt-0.5"
                  style={{ fontSize: 10, fontWeight: 600, color: "rgba(26,26,26,0.35)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Link */}
          <button
            type="button"
            onClick={() => {/* future: navigate to filtered animals list */}}
            className="flex items-center gap-1.5 mt-3 cursor-pointer"
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#55BAAA" }}>
              View affected animals
            </span>
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      {/* ══ SECTION 1: SYMPTOMS ══ */}
      <div style={{ marginTop: 16 }}>
        <SectionLabel text="Symptoms" />
        <div
          className="rounded-xl bg-white"
          style={{ border: "1px solid #D4D4D0", padding: 16 }}
        >
          <div className="flex flex-col" style={{ gap: 10 }}>
            {disease.symptoms.map((s, i) => (
              <div key={i} className="flex items-start" style={{ gap: 10 }}>
                <span
                  className="shrink-0 rounded-full mt-1.5"
                  style={{ width: 6, height: 6, backgroundColor: "#E74C3C" }}
                />
                <p style={{ fontSize: 13, fontWeight: 400, color: "rgba(26,26,26,0.70)", lineHeight: 1.45 }}>
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SECTION 2: COMMON TREATMENTS ══ */}
      {disease.treatments.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <SectionLabel text="Common Treatments" />
          <div
            className="rounded-xl bg-white overflow-hidden divide-y divide-[#D4D4D0]/40"
            style={{ border: "1px solid #D4D4D0" }}
          >
            {disease.treatments.map((t, i) => {
              const tCatPill = CATEGORY_PILL[t.category] || CATEGORY_PILL.Other!;
              return (
                <div
                  key={i}
                  className="flex items-start justify-between"
                  style={{ padding: "12px 16px" }}
                >
                  {/* Left */}
                  <div className="min-w-0 flex-1">
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                      {t.name}
                    </p>
                    <p
                      className="mt-0.5"
                      style={{ fontSize: 12, color: "rgba(26,26,26,0.40)" }}
                    >
                      {t.route}
                    </p>
                  </div>
                  {/* Right */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0 ml-3">
                    <Pill label={t.category} bg={tCatPill.bg} color={tCatPill.color} />
                    {t.withdrawalDays != null && (
                      <WithdrawalPill days={t.withdrawalDays} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Note */}
          <p
            className="italic mt-2 px-1"
            style={{ fontSize: 11, fontWeight: 500, color: "rgba(26,26,26,0.30)" }}
          >
            Always consult your veterinarian for diagnosis and treatment protocols.
          </p>
        </div>
      )}

      {/* ══ SECTION 3: PREVENTION ══ */}
      <div style={{ marginTop: 16 }}>
        <SectionLabel text="Prevention" />
        <div
          className="rounded-xl bg-white"
          style={{ border: "1px solid #D4D4D0", padding: 16 }}
        >
          <div className="flex flex-col" style={{ gap: 10 }}>
            {disease.prevention.map((p, i) => (
              <div key={i} className="flex items-start" style={{ gap: 10 }}>
                <ShieldCheckIcon />
                <p style={{ fontSize: 13, fontWeight: 400, color: "rgba(26,26,26,0.70)", lineHeight: 1.45 }}>
                  {p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SECTION 4: COMMONLY AFFECTED ══ */}
      <div style={{ marginTop: 16 }}>
        <SectionLabel text="Commonly Affected" />
        <div
          className="rounded-xl bg-white"
          style={{ border: "1px solid #D4D4D0", padding: 16 }}
        >
          <div className="flex flex-wrap gap-2">
            {disease.affectedGroups.map((g) => (
              <span
                key={g}
                className="inline-flex items-center rounded-full font-['Inter']"
                style={{
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  backgroundColor: "#F5F5F0",
                  border: "1px solid #D4D4D0",
                  color: "rgba(26,26,26,0.55)",
                }}
              >
                {g}
              </span>
            ))}
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
          This is a global reference. Disease information is maintained by ChuteSide and updated periodically.
        </p>
      </div>
    </div>
  );
}