import { useState } from "react";
import { useNavigate } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";

/* ══════════════════════════════════════════
   Constants
   ══════════════════════════════════════════ */
const OPERATION_TYPES = [
  "Cow-Calf",
  "Stocker/Backgrounder",
  "Feedlot",
  "Seedstock/Purebred",
  "Dairy",
  "Mixed",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

/* ══════════════════════════════════════════
   Section Label
   ══════════════════════════════════════════ */
function SectionLabel({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <p
      className="font-['Inter'] uppercase mb-2 px-1"
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: danger ? "#E74C3C" : "#0E2646",
        opacity: danger ? 0.7 : 0.35,
      }}
    >
      {children}
    </p>
  );
}

/* ══════════════════════════════════════════
   Header Card
   ══════════════════════════════════════════ */
function HeaderCard({
  name,
  type,
  headCount,
  teamCount,
}: {
  name: string;
  type: string;
  headCount: number;
  teamCount: number;
}) {
  return (
    <div
      className="rounded-2xl font-['Inter']"
      style={{
        background: "linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)",
        padding: 20,
      }}
    >
      <p style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>
        {name || "Untitled Operation"}
      </p>

      <div className="mt-2.5 flex items-center gap-2.5">
        <span
          className="inline-flex items-center rounded-full"
          style={{
            padding: "3px 12px",
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.70)",
          }}
        >
          {type || "—"}
        </span>
      </div>

      <p className="mt-3" style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.40)" }}>
        {headCount.toLocaleString()} Head · {teamCount} Team Members · Active
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════
   Logo Upload Area
   ══════════════════════════════════════════ */
function LogoUpload() {
  const [file, setFile] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setFile(reader.result as string);
      reader.readAsDataURL(f);
    }
  }

  return (
    <label
      className="flex flex-col items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-[#F5F5F0]/60"
      style={{
        height: 100,
        border: "2px dashed #D4D4D0",
        backgroundColor: file ? "transparent" : "white",
        overflow: "hidden",
      }}
    >
      {file ? (
        <img
          src={file}
          alt="Logo"
          className="w-full h-full object-contain"
          style={{ padding: 8 }}
        />
      ) : (
        <>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mb-1.5">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="#0E2646" strokeOpacity="0.18" strokeWidth="1.4" />
            <path d="M12 8V16M8 12H16" stroke="#0E2646" strokeOpacity="0.18" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span
            className="font-['Inter']"
            style={{ fontSize: 13, fontWeight: 500, color: "rgba(26,26,26,0.30)" }}
          >
            Upload Logo
          </span>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
}

/* ══════════════════════════════════════════
   SCREEN
   ══════════════════════════════════════════ */
export function ReferenceOperationScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();

  /* Form state */
  const [name, setName] = useState("Saddle Butte Ranch");
  const [type, setType] = useState("Cow-Calf");
  const [address, setAddress] = useState("4520 County Road 12");
  const [city, setCity] = useState("Prairie City");
  const [state, setState] = useState("SD");
  const [zip, setZip] = useState("57701");
  const [phone, setPhone] = useState("(605) 555-0142");
  const [email, setEmail] = useState("info@saddlebutte.com");

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    showToast("success", "Operation profile saved");
  }

  function handleCancel() {
    navigate(-1);
  }

  function handleDeactivate() {
    showDeleteConfirm({
      title: "Deactivate Operation",
      message:
        "This will permanently deactivate Saddle Butte Ranch. All data will be archived and team members will lose access. This cannot be undone.",
      confirmLabel: "Deactivate",
      onConfirm: () => {
        showToast("success", "Operation has been deactivated");
        navigate("/reference");
      },
    });
  }

  return (
    <div className="font-['Inter']" style={{ padding: 20, paddingBottom: 40 }}>
      {/* ── Header Card ── */}
      <div className="mb-6">
        <HeaderCard name={name} type={type} headCount={847} teamCount={5} />
      </div>

      {/* ── Form Section ── */}
      <div className="mb-6">
        <SectionLabel>Operation Details</SectionLabel>
        <div
          className="rounded-xl bg-white border border-[#D4D4D0]/60"
          style={{ padding: 16 }}
        >
          <div className="space-y-3.5">
            <FormFieldRow
              label="Name"
              required
              placeholder="Operation name"
              value={name}
              onChange={setName}
              error={errors.name}
            />
            <FormSelectRow
              label="Type"
              value={type}
              onChange={setType}
              options={OPERATION_TYPES}
              placeholder="Select type…"
            />

            {/* Divider */}
            <div className="border-t border-[#D4D4D0]/40 !mt-4 !mb-4" />

            <FormFieldRow
              label="Address"
              placeholder="Street address"
              value={address}
              onChange={setAddress}
            />
            <FormFieldRow
              label="City"
              placeholder="City"
              value={city}
              onChange={setCity}
            />
            <FormSelectRow
              label="State"
              value={state}
              onChange={setState}
              options={US_STATES}
              placeholder="Select…"
            />
            <FormFieldRow
              label="Zip"
              placeholder="Zip code"
              value={zip}
              onChange={setZip}
              inputProps={{ inputMode: "numeric", maxLength: 10 }}
            />

            {/* Divider */}
            <div className="border-t border-[#D4D4D0]/40 !mt-4 !mb-4" />

            <FormFieldRow
              label="Phone"
              placeholder="(555) 555-0000"
              value={phone}
              onChange={setPhone}
              type="tel"
            />
            <FormFieldRow
              label="Email"
              placeholder="email@example.com"
              value={email}
              onChange={setEmail}
              type="email"
            />
          </div>
        </div>
      </div>

      {/* ── Branding Section ── */}
      <div className="mb-6">
        <SectionLabel>Branding</SectionLabel>
        <LogoUpload />
      </div>

      {/* ── Danger Zone ── */}
      <div className="mb-8">
        <SectionLabel danger>Danger Zone</SectionLabel>
        <div
          className="rounded-xl bg-white overflow-hidden"
          style={{
            border: "1px solid rgba(231,76,60,0.20)",
            padding: 16,
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.3 }}>
            Deactivate Operation
          </p>
          <p
            className="mt-1"
            style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.40)", lineHeight: 1.5 }}
          >
            Permanently deactivate this operation. All data will be archived and team members will lose access.
            This cannot be undone.
          </p>
          <button
            type="button"
            onClick={handleDeactivate}
            className="mt-4 rounded-lg cursor-pointer font-['Inter'] transition-all hover:brightness-95 active:scale-[0.97]"
            style={{
              height: 38,
              padding: "0 20px",
              fontSize: 13,
              fontWeight: 700,
              color: "#FFFFFF",
              backgroundColor: "#E74C3C",
              border: "none",
            }}
          >
            Deactivate
          </button>
        </div>
      </div>

      {/* ── Bottom Buttons ── */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-xl cursor-pointer font-['Inter'] transition-all hover:brightness-95 active:scale-[0.98]"
          style={{
            height: 48,
            fontSize: 15,
            fontWeight: 700,
            color: "#0E2646",
            backgroundColor: "#F3D12A",
            border: "none",
          }}
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="w-full rounded-xl cursor-pointer font-['Inter'] transition-colors"
          style={{
            height: 44,
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(26,26,26,0.40)",
            backgroundColor: "transparent",
            border: "1px solid #D4D4D0",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
