import { useState } from "react";
import { FormFieldRow } from "./form-field-row";
import { useToast } from "./toast-context";

/* ══════════════════════════════════════════
   Toggle Switch
   ══════════════════════════════════════════ */
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="shrink-0 relative rounded-full cursor-pointer transition-colors duration-200"
      style={{
        width: 44,
        height: 24,
        backgroundColor: on ? "#55BAAA" : "#D4D4D0",
        border: "none",
        padding: 0,
      }}
    >
      <span
        className="absolute top-[2px] rounded-full bg-white transition-transform duration-200 shadow-sm"
        style={{
          width: 20,
          height: 20,
          transform: on ? "translateX(22px)" : "translateX(2px)",
        }}
      />
    </button>
  );
}

/* ══════════════════════════════════════════
   Section Label
   ══════════════════════════════════════════ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[#0E2646] font-['Inter'] uppercase mb-2 px-1"
      style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", opacity: 0.35 }}
    >
      {children}
    </p>
  );
}

/* ══════════════════════════════════════════
   Chevron
   ══════════════════════════════════════════ */
function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M6 4L10 8L6 12" stroke="#1A1A1A" strokeOpacity="0.20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   Lock Icon (for disabled email)
   ══════════════════════════════════════════ */
function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <rect x="3" y="6" width="8" height="6" rx="1.5" stroke="#1A1A1A" strokeOpacity="0.25" strokeWidth="1.2" />
      <path d="M5 6V4.5C5 3.11929 6.11929 2 7.5 2V2C8.88071 2 10 3.11929 10 4.5V6" stroke="#1A1A1A" strokeOpacity="0.25" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   Notification Toggle Row
   ══════════════════════════════════════════ */
function ToggleRow({
  label,
  description,
  on,
  onChange,
}: {
  label: string;
  description: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 font-['Inter']"
      style={{ padding: "14px 16px" }}
    >
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.3 }}>
          {label}
        </p>
        <p className="mt-0.5" style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.35)" }}>
          {description}
        </p>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

/* ══════════════════════════════════════════
   Action Row (Security / Data)
   ══════════════════════════════════════════ */
function ActionRow({
  label,
  description,
  pill,
  onClick,
}: {
  label: string;
  description?: string;
  pill?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 cursor-pointer transition-colors hover:bg-[#F5F5F0] active:bg-[#F5F5F0] font-['Inter']"
      style={{ padding: "14px 16px" }}
    >
      <div className="flex-1 min-w-0 text-left">
        <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.3 }}>
          {label}
        </p>
        {description && (
          <p className="mt-0.5" style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.35)" }}>
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {pill}
        <ChevronRight />
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════
   SCREEN
   ══════════════════════════════════════════ */
export function UserProfileScreen() {
  const { showToast } = useToast();

  /* ── Form state ── */
  const [fullName, setFullName] = useState("John Olson");
  const [phone, setPhone] = useState("(605) 555-0142");
  const [displayName, setDisplayName] = useState("John O.");

  /* ── Notification toggles ── */
  const [calvingAlerts, setCalvingAlerts] = useState(true);
  const [treatmentReminders, setTreatmentReminders] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(true);

  /* ── Dirty check ── */
  const isDirty =
    fullName !== "John Olson" ||
    phone !== "(605) 555-0142" ||
    displayName !== "John O." ||
    calvingAlerts !== true ||
    treatmentReminders !== true ||
    projectUpdates !== false ||
    weeklySummary !== true;

  function handleSave() {
    showToast("success", "Profile updated");
  }

  return (
    <div className="font-['Inter']" style={{ padding: 20 }}>
      {/* ═══════════════════════════════
         AVATAR SECTION
         ═══════════════════════════════ */}
      <div className="flex flex-col items-center mb-5">
        {/* Avatar circle */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 80,
            height: 80,
            backgroundColor: "#0E2646",
          }}
        >
          <span
            className="font-['Inter'] text-white select-none"
            style={{ fontSize: 28, fontWeight: 700 }}
          >
            JO
          </span>
        </div>

        {/* Change Photo button */}
        <button
          type="button"
          onClick={() => showToast("info", "Photo picker not yet available")}
          className="cursor-pointer font-['Inter'] transition-colors hover:opacity-80 mt-2"
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#55BAAA",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          Change Photo
        </button>
      </div>

      {/* ═══════════════════════════════
         FORM
         ═══════════════════════════════ */}
      <div className="space-y-3 mb-6">
        <FormFieldRow
          label="Full Name"
          placeholder="Your full name"
          value={fullName}
          onChange={setFullName}
        />

        {/* Email — disabled with lock icon */}
        <div className="flex items-start gap-3">
          <label
            className="shrink-0 text-[#1A1A1A] font-['Inter']"
            style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
          >
            Email
          </label>
          <div className="flex-1 min-w-0 relative">
            <input
              type="email"
              value="john@saddlebutte.com"
              disabled
              className="w-full h-[40px] px-3 pr-9 rounded-lg border border-[#D4D4D0] font-['Inter'] text-[#1A1A1A] outline-none cursor-not-allowed"
              style={{
                fontSize: 16,
                fontWeight: 400,
                backgroundColor: "rgba(26,26,26,0.04)",
                color: "rgba(26,26,26,0.40)",
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <LockIcon />
            </div>
          </div>
        </div>

        <FormFieldRow
          label="Phone"
          placeholder="(xxx) xxx-xxxx"
          value={phone}
          onChange={setPhone}
          type="tel"
        />

        <div>
          <FormFieldRow
            label="Display Name"
            placeholder="e.g. John O."
            value={displayName}
            onChange={setDisplayName}
          />
          <p
            className="font-['Inter'] mt-1"
            style={{ fontSize: 11, fontWeight: 400, color: "rgba(26,26,26,0.25)", marginLeft: 118 }}
          >
            Shown to team members
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════
         SECTION 2: NOTIFICATIONS
         ═══════════════════════════════ */}
      <div className="mb-6">
        <SectionLabel>Notifications</SectionLabel>
        <div className="rounded-xl bg-white border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40" style={{ padding: "4px 0" }}>
          <ToggleRow
            label="Calving Alerts"
            description="Notify when calving is expected"
            on={calvingAlerts}
            onChange={setCalvingAlerts}
          />
          <ToggleRow
            label="Treatment Reminders"
            description="Withdrawal period expirations"
            on={treatmentReminders}
            onChange={setTreatmentReminders}
          />
          <ToggleRow
            label="Project Updates"
            description="When team members complete work"
            on={projectUpdates}
            onChange={setProjectUpdates}
          />
          <ToggleRow
            label="Weekly Summary"
            description="Email digest every Monday"
            on={weeklySummary}
            onChange={setWeeklySummary}
          />
        </div>
      </div>

      {/* ═══════════════════════════════
         SECTION 3: SECURITY
         ═══════════════════════════════ */}
      <div className="mb-6">
        <SectionLabel>Security</SectionLabel>
        <div className="rounded-xl bg-white border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
          <ActionRow
            label="Change Password"
            onClick={() => showToast("info", "Password change flow coming soon")}
          />
          <ActionRow
            label="Two-Factor Auth"
            pill={
              <span
                className="inline-flex items-center rounded-full font-['Inter']"
                style={{
                  padding: "1px 8px",
                  fontSize: 10,
                  fontWeight: 700,
                  backgroundColor: "#FFF3E0",
                  color: "#E65100",
                }}
              >
                Not Enabled
              </span>
            }
            onClick={() => showToast("info", "2FA setup coming soon")}
          />
        </div>
      </div>

      {/* ═══════════════════════════════
         SECTION 4: DATA
         ═══════════════════════════════ */}
      <div className="mb-6">
        <SectionLabel>Data</SectionLabel>
        <div className="rounded-xl bg-white border border-[#D4D4D0]/60 overflow-hidden">
          <ActionRow
            label="Export My Data"
            description="Download all your records"
            onClick={() => showToast("info", "Preparing data export…")}
          />
        </div>
      </div>

      {/* ═══════════════════════════════
         SAVE BUTTON
         ═══════════════════════════════ */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full rounded-xl cursor-pointer font-['Inter'] transition-all hover:brightness-95 active:scale-[0.98]"
        style={{
          height: 48,
          fontSize: 15,
          fontWeight: 700,
          color: "#0E2646",
          backgroundColor: isDirty ? "#F3D12A" : "rgba(243,209,42,0.50)",
          border: "none",
          marginBottom: 20,
        }}
      >
        Save Changes
      </button>
    </div>
  );
}
