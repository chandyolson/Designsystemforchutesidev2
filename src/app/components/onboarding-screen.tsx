import { useState } from "react";
import { useNavigate } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";

/* ═══════════════════════════════════════════════
   US STATES LIST
   ═══════════════════════════════════════════════ */
const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

const OPERATION_TYPES = [
  "Cow-Calf",
  "Feedlot",
  "Stocker",
  "Dairy",
  "Veterinary Practice",
  "Other",
];

const CALVING_SEASONS = [
  "Spring",
  "Fall",
  "Year-Round",
  "Not Applicable",
];

/* ═══════════════════════════════════════════════
   PROGRESS DOTS — circle style per spec
   First dot 10px filled #F3D12A, others 8px #D4D4D0
   ═══════════════════════════════════════════════ */
const TOTAL_STEPS = 3;
const CURRENT_STEP = 1;

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center" style={{ gap: 8 }}>
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isComplete = step < current;
        return (
          <div
            key={step}
            className="rounded-full transition-all duration-300"
            style={{
              width: isActive ? 10 : 8,
              height: isActive ? 10 : 8,
              backgroundColor: isActive
                ? "#F3D12A"
                : isComplete
                  ? "#55BAAA"
                  : "#D4D4D0",
            }}
          />
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ONBOARDING SCREEN — Set Up Your Operation
   ═══════════════════════════════════════════════ */
export function OnboardingScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [fields, setFields] = useState({
    operationName: "",
    operationType: "",
    address: "",
    state: "",
    headCount: "",
    calvingSeason: "",
  });

  const update = (key: keyof typeof fields) => (val: string) => {
    setFields((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fields.operationName.trim()) e.operationName = "Operation name is required";
    if (!fields.operationType) e.operationType = "Select an operation type";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen font-['Inter'] flex flex-col"
      style={{ backgroundColor: "#F5F5F0" }}
    >
      <div className="w-full max-w-[375px] mx-auto flex-1 flex flex-col">

        {/* ── Top bar: brand left + progress center ── */}
        <div
          className="relative flex items-center justify-center"
          style={{ padding: 20 }}
        >
          {/* CHUTESIDE brand — top left */}
          <span
            className="absolute left-5"
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "#F3D12A",
            }}
          >
            CHUTESIDE
          </span>

          {/* Progress dots — centered */}
          <ProgressDots current={CURRENT_STEP} total={TOTAL_STEPS} />
        </div>

        {/* ── Heading ── */}
        <div style={{ padding: "12px 20px 0 20px" }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#0E2646",
              lineHeight: 1.2,
            }}
          >
            Set Up Your Operation
          </h1>
          <p
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(26,26,26,0.40)",
              marginTop: 4,
            }}
          >
            Tell us about your ranch or practice
          </p>
        </div>

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col"
          style={{ padding: "28px 20px 0 20px" }}
        >
          <div className="space-y-2.5">
            <FormFieldRow
              label="Name"
              placeholder="Saddle Butte Ranch"
              value={fields.operationName}
              onChange={update("operationName")}
              error={errors.operationName}
              required
            />

            <FormSelectRow
              label="Type"
              placeholder="Select type"
              value={fields.operationType}
              onChange={update("operationType")}
              options={OPERATION_TYPES}
              error={errors.operationType}
              required
            />

            <FormFieldRow
              label="Address"
              placeholder="Rural address or nearest town"
              value={fields.address}
              onChange={update("address")}
            />

            <FormSelectRow
              label="State"
              placeholder="Select state"
              value={fields.state}
              onChange={update("state")}
              options={US_STATES}
            />

            <FormFieldRow
              label="Head Count"
              placeholder="0"
              value={fields.headCount}
              onChange={update("headCount")}
              type="number"
              inputProps={{ min: 0, inputMode: "numeric" }}
            />

            <FormSelectRow
              label="Season"
              placeholder="Select season"
              value={fields.calvingSeason}
              onChange={update("calvingSeason")}
              options={CALVING_SEASONS}
            />
          </div>

          {/* ── Spacer ── */}
          <div className="flex-1" style={{ minHeight: 32 }} />

          {/* ── Actions ── */}
          <div>
            {/* Continue button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                height: 48,
                borderRadius: 9999,
                backgroundColor: "#F3D12A",
                color: "#1A1A1A",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {loading ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ animation: "spinnerRotate 0.8s linear infinite" }}
                  >
                    <circle cx="8" cy="8" r="6" stroke="#1A1A1A" strokeOpacity="0.15" strokeWidth="2" />
                    <path d="M14 8a6 6 0 0 0-6-6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Saving…
                </>
              ) : (
                "Continue"
              )}
            </button>

            {/* Skip */}
            <button
              type="button"
              onClick={handleSkip}
              className="w-full cursor-pointer transition-colors duration-150"
              style={{
                height: 40,
                marginTop: 12,
                backgroundColor: "transparent",
                fontSize: 13,
                fontWeight: 600,
                color: "#55BAAA",
              }}
            >
              Skip for now
            </button>
          </div>

          {/* ── Bottom helper text ── */}
          <p
            className="text-center"
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: "rgba(26,26,26,0.25)",
              paddingBottom: 20,
              marginTop: 12,
            }}
          >
            You can always update these in Reference &gt; Operation Profile
          </p>
        </form>
      </div>
    </div>
  );
}
