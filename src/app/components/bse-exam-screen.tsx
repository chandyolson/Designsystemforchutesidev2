import { useState } from "react";
import { useNavigate } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { useToast } from "./toast-context";

/* ═══════════════════════════════════════════════
   SECTION LABEL
   ═══════════════════════════════════════════════ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-['Inter'] uppercase"
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: "rgba(14,38,70,0.35)",
        marginBottom: 10,
      }}
    >
      {children}
    </p>
  );
}

/* ═══════════════════════════════════════════════
   SCORE ROW (1–5 scale)
   ═══════════════════════════════════════════════ */
function ScoreRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3" style={{ padding: "12px 0" }}>
      <span
        className="shrink-0 font-['Inter'] text-[#1A1A1A]"
        style={{ width: 105, fontSize: 14, fontWeight: 600 }}
      >
        {label}
      </span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => {
          const isSelected = n === value;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className="flex items-center justify-center rounded-md cursor-pointer transition-all"
              style={{
                width: 32,
                height: 32,
                fontSize: 13,
                fontWeight: isSelected ? 700 : 400,
                backgroundColor: isSelected ? "#0E2646" : "#FFFFFF",
                color: isSelected ? "#FFFFFF" : "rgba(26,26,26,0.4)",
                border: isSelected ? "1px solid #0E2646" : "1px solid #D4D4D0",
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CLASSIFICATION OPTIONS
   ═══════════════════════════════════════════════ */
type Classification = "Satisfactory" | "Unsatisfactory" | "Deferred";

const CLASSIFICATION_CONFIG: Record<
  Classification,
  { selectedBg: string; selectedBorder: string; selectedColor: string; icon: boolean }
> = {
  Satisfactory: {
    selectedBg: "#E8F5E9",
    selectedBorder: "#27AE60",
    selectedColor: "#1B5E20",
    icon: true,
  },
  Unsatisfactory: {
    selectedBg: "#FDEDED",
    selectedBorder: "#E74C3C",
    selectedColor: "#922B21",
    icon: true,
  },
  Deferred: {
    selectedBg: "#FFF8E1",
    selectedBorder: "#F3D12A",
    selectedColor: "#8B7100",
    icon: true,
  },
};

/* ═══════════════════════════════════════════════
   BSE EXAM SCREEN
   ═══════════════════════════════════════════════ */
export function BseExamScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  /* Section 1 — Exam Info */
  const [date, setDate] = useState("2026-03-02");
  const [vet, setVet] = useState("Dr. Miller");
  const [age, setAge] = useState("3 yrs");
  const [breed, setBreed] = useState("Angus");

  /* Section 2 — Physical Exam scores */
  const [bodyCond, setBodyCond] = useState(3);
  const [feetLegs, setFeetLegs] = useState(4);
  const [eyes, setEyes] = useState(4);
  const [disposition, setDisposition] = useState(3);

  /* Section 3 — Scrotal & Semen */
  const [scrotalCirc, setScrotalCirc] = useState("36");
  const [motility, setMotility] = useState("Very Good");
  const [morphology, setMorphology] = useState("82");
  const [concentration, setConcentration] = useState("Dense");

  /* Section 4 — Classification */
  const [classification, setClassification] = useState<Classification>("Satisfactory");

  /* Section 5 — Notes */
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    showToast("success", "BSE exam saved successfully");
    setTimeout(() => navigate(-1), 600);
  };

  return (
    <div className="space-y-5">
      {/* ═══════════════════════════════════════════
          SECTION 1 — EXAM INFO
          ═══════════════════════════════════════════ */}
      <div>
        <SectionLabel>Exam Info</SectionLabel>
        <div className="space-y-2.5">
          {/* Date */}
          <div className="flex items-start gap-3">
            <label
              className="shrink-0 text-[#1A1A1A] font-['Inter']"
              style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
            >
              Date
            </label>
            <div className="flex-1 min-w-0">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
                style={{ fontSize: 16, colorScheme: "light" }}
              />
            </div>
          </div>

          <FormSelectRow
            label="Vet"
            value={vet}
            onChange={setVet}
            options={["Dr. Miller", "Dr. Jameson", "Dr. Patel", "Dr. Torres"]}
          />

          <FormFieldRow
            label="Age"
            value={age}
            onChange={setAge}
          />

          <FormSelectRow
            label="Breed"
            value={breed}
            onChange={setBreed}
            options={["Angus", "Hereford", "Charolais", "Simmental", "Red Angus", "Limousin", "Brahman"]}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 2 — PHYSICAL EXAM
          ═══════════════════════════════════════════ */}
      <div>
        <SectionLabel>Physical Exam</SectionLabel>
        <div
          className="bg-white rounded-xl divide-y divide-[#D4D4D0]/40"
          style={{ padding: "4px 16px", border: "1px solid rgba(212,212,208,0.5)" }}
        >
          <ScoreRow label="Body Cond." value={bodyCond} onChange={setBodyCond} />
          <ScoreRow label="Feet & Legs" value={feetLegs} onChange={setFeetLegs} />
          <ScoreRow label="Eyes" value={eyes} onChange={setEyes} />
          <ScoreRow label="Disposition" value={disposition} onChange={setDisposition} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 3 — SCROTAL & SEMEN
          ═══════════════════════════════════════════ */}
      <div>
        <SectionLabel>Scrotal &amp; Semen</SectionLabel>
        <div className="space-y-2.5">
          {/* Scrotal Circ. with cm suffix */}
          <div className="flex items-start gap-3">
            <label
              className="shrink-0 text-[#1A1A1A] font-['Inter']"
              style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
            >
              Scrotal Circ.
            </label>
            <div className="flex-1 min-w-0 relative">
              <input
                type="text"
                inputMode="decimal"
                value={scrotalCirc}
                onChange={(e) => setScrotalCirc(e.target.value)}
                className="w-full h-[40px] px-3 pr-10 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
                style={{ fontSize: 16 }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 font-['Inter'] pointer-events-none"
                style={{ fontSize: 13, fontWeight: 600, color: "rgba(26,26,26,0.35)" }}
              >
                cm
              </span>
            </div>
          </div>

          <FormSelectRow
            label="Motility"
            value={motility}
            onChange={setMotility}
            options={["Very Good", "Good", "Fair", "Poor"]}
          />

          {/* Morphology with % suffix */}
          <div className="flex items-start gap-3">
            <label
              className="shrink-0 text-[#1A1A1A] font-['Inter']"
              style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
            >
              Morphology
            </label>
            <div className="flex-1 min-w-0 relative">
              <input
                type="text"
                inputMode="decimal"
                value={morphology}
                onChange={(e) => setMorphology(e.target.value)}
                className="w-full h-[40px] px-3 pr-10 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
                style={{ fontSize: 16 }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 font-['Inter'] pointer-events-none"
                style={{ fontSize: 13, fontWeight: 600, color: "rgba(26,26,26,0.35)" }}
              >
                %
              </span>
            </div>
          </div>

          <FormSelectRow
            label="Concentration"
            value={concentration}
            onChange={setConcentration}
            options={["Very Dense", "Dense", "Moderate", "Sparse"]}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 4 — CLASSIFICATION
          ═══════════════════════════════════════════ */}
      <div>
        <SectionLabel>Classification</SectionLabel>
        <div className="flex gap-2">
          {(["Satisfactory", "Unsatisfactory", "Deferred"] as Classification[]).map((opt) => {
            const isSelected = opt === classification;
            const cfg = CLASSIFICATION_CONFIG[opt];

            return (
              <button
                key={opt}
                type="button"
                onClick={() => setClassification(opt)}
                className="flex-1 flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all"
                style={{
                  padding: 14,
                  backgroundColor: isSelected ? cfg.selectedBg : "#FFFFFF",
                  border: isSelected
                    ? `2px solid ${cfg.selectedBorder}`
                    : "1px solid #D4D4D0",
                  /* offset for border width diff so cards stay aligned */
                  margin: isSelected ? 0 : 0.5,
                }}
              >
                {/* Icon area */}
                <div
                  className="flex items-center justify-center rounded-full mb-2"
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: isSelected
                      ? `${cfg.selectedBorder}20`
                      : "rgba(26,26,26,0.05)",
                  }}
                >
                  {opt === "Satisfactory" && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M3 7L6 10L11 4"
                        stroke={isSelected ? cfg.selectedBorder : "rgba(26,26,26,0.25)"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {opt === "Unsatisfactory" && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M4 4L10 10M10 4L4 10"
                        stroke={isSelected ? cfg.selectedBorder : "rgba(26,26,26,0.25)"}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  {opt === "Deferred" && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle
                        cx="7"
                        cy="7"
                        r="5"
                        stroke={isSelected ? cfg.selectedBorder : "rgba(26,26,26,0.25)"}
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7 4.5V7.5L9 9"
                        stroke={isSelected ? cfg.selectedBorder : "rgba(26,26,26,0.25)"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                <span
                  className="font-['Inter'] text-center"
                  style={{
                    fontSize: 13,
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? cfg.selectedColor : "rgba(26,26,26,0.4)",
                    lineHeight: 1.2,
                  }}
                >
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 5 — NOTES
          ═══════════════════════════════════════════ */}
      <div>
        <SectionLabel>Notes</SectionLabel>
        <div className="relative">
          <textarea
            placeholder="Exam notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2.5 pr-12 rounded-xl bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all resize-none"
            style={{ fontSize: 16 }}
          />
          {/* Mic button */}
          <button
            type="button"
            className="absolute right-2.5 top-2.5 flex items-center justify-center rounded-full cursor-pointer transition-colors hover:bg-[#55BAAA]/15"
            style={{ width: 32, height: 32, backgroundColor: "rgba(85,186,170,0.08)" }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="5" y="1" width="5" height="8.5" rx="2.5" stroke="#55BAAA" strokeWidth="1.4" />
              <path d="M3 7.5C3 9.98528 5.01472 12 7.5 12C9.98528 12 12 9.98528 12 7.5" stroke="#55BAAA" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M7.5 12V14" stroke="#55BAAA" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          BOTTOM BUTTONS
          ═══════════════════════════════════════════ */}
      <div className="flex gap-3 pt-2 pb-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 rounded-xl font-['Inter'] cursor-pointer transition-colors hover:bg-[#0E2646]/6"
          style={{
            height: 48,
            fontSize: 15,
            fontWeight: 600,
            color: "#0E2646",
            border: "1.5px solid #D4D4D0",
            backgroundColor: "transparent",
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 rounded-xl font-['Inter'] cursor-pointer transition-colors hover:opacity-90"
          style={{
            height: 48,
            fontSize: 15,
            fontWeight: 700,
            color: "#0E2646",
            backgroundColor: "#F3D12A",
            border: "1.5px solid #F3D12A",
          }}
        >
          Save Exam
        </button>
      </div>
    </div>
  );
}
