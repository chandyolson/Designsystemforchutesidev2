import { useState, useRef, useEffect } from "react";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";

/* ══════════════════════════════════════════
   Types & Data
   ══════════════════════════════════════════ */
type PracticeStatus = "Active" | "Pending" | "Inactive";

interface VetPractice {
  id: string;
  name: string;
  primaryVet: string;
  phone: string;
  email: string;
  address: string;
  linkedSince: string;
  animalsAccessed: string;
  status: PracticeStatus;
}

const initialPractices: VetPractice[] = [
  {
    id: "vp1",
    name: "Prairie Veterinary Clinic",
    primaryVet: "Dr. James Miller",
    phone: "(605) 555-0198",
    email: "dr.miller@prairievc.com",
    address: "142 Main St, Prairie City, SD",
    linkedSince: "Jan 15, 2024",
    animalsAccessed: "847 (Full Herd)",
    status: "Active",
  },
  {
    id: "vp2",
    name: "Black Hills Large Animal",
    primaryVet: "Dr. Sarah Chen",
    phone: "(605) 555-0234",
    email: "s.chen@blackhillsla.com",
    address: "890 Elk Creek Rd, Rapid City, SD",
    linkedSince: "Mar 8, 2025",
    animalsAccessed: "847 (Full Herd)",
    status: "Active",
  },
];

/* ══════════════════════════════════════════
   Icons
   ══════════════════════════════════════════ */
function StethoscopeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M5.5 3V8.5C5.5 10.7091 7.29086 12.5 9.5 12.5H10.5C12.7091 12.5 14.5 10.7091 14.5 8.5V3"
        stroke="#A855F7"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M4 3H7" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 3H16" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M10 12.5V14.5C10 15.6046 10.8954 16.5 12 16.5H13C14.1046 16.5 15 15.6046 15 14.5V14"
        stroke="#A855F7"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="15" cy="13" r="1.25" stroke="#A855F7" strokeWidth="1.3" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3.5" r="1.25" fill="#0E2646" fillOpacity="0.45" />
      <circle cx="8" cy="8" r="1.25" fill="#0E2646" fillOpacity="0.45" />
      <circle cx="8" cy="12.5" r="1.25" fill="#0E2646" fillOpacity="0.45" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-px">
      <circle cx="8" cy="8" r="6.5" stroke="#55BAAA" strokeWidth="1.2" />
      <path d="M8 7V11" stroke="#55BAAA" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="#55BAAA" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M3.5 8.75L7 5.25L10.5 8.75" stroke="#A855F7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#0E2646" strokeOpacity="0.25" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   Status Pill
   ══════════════════════════════════════════ */
function StatusPill({ status }: { status: PracticeStatus }) {
  const styles: Record<PracticeStatus, { bg: string; color: string }> = {
    Active: { bg: "rgba(85,186,170,0.10)", color: "#55BAAA" },
    Pending: { bg: "rgba(243,209,42,0.15)", color: "#B8860B" },
    Inactive: { bg: "rgba(26,26,26,0.06)", color: "#777777" },
  };
  const s = styles[status];
  return (
    <span
      className="inline-flex items-center rounded-full font-['Inter']"
      style={{
        padding: "1px 8px",
        fontSize: 10,
        fontWeight: 700,
        backgroundColor: s.bg,
        color: s.color,
      }}
    >
      {status}
    </span>
  );
}

/* ══════════════════════════════════════════
   Section Label
   ══════════════════════════════════════════ */
function SectionLabel({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <div className="flex items-center justify-between mb-2 px-1">
      <p
        className="text-[#0E2646] font-['Inter'] uppercase"
        style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", opacity: 0.35 }}
      >
        {children}
      </p>
      {count !== undefined && (
        <span
          className="font-['Inter'] text-[#0E2646]/25"
          style={{ fontSize: 10, fontWeight: 600 }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   3-Dot Row Menu
   ══════════════════════════════════════════ */
function RowMenu({
  onViewDetails,
  onUnlink,
}: {
  onViewDetails: () => void;
  onUnlink: () => void;
}) {
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
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="flex items-center justify-center cursor-pointer rounded-lg transition-colors hover:bg-[#0E2646]/5"
        style={{ width: 32, height: 32 }}
        aria-label="Practice actions"
      >
        <DotsIcon />
      </button>
      {open && (
        <div className="absolute right-0 top-[36px] z-20 w-44 rounded-xl bg-white border border-[#D4D4D0] shadow-lg overflow-hidden font-['Inter']">
          <button
            type="button"
            onClick={() => { setOpen(false); onViewDetails(); }}
            className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
            style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", background: "none", border: "none" }}
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onUnlink(); }}
            className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
            style={{ fontSize: 13, fontWeight: 500, color: "#E74C3C", background: "none", border: "none" }}
          >
            Unlink Practice
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Detail Row
   ══════════════════════════════════════════ */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="font-['Inter']"
        style={{ fontSize: 12, fontWeight: 500, color: "rgba(26,26,26,0.35)" }}
      >
        {label}
      </p>
      <p
        className="font-['Inter'] mt-0.5"
        style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}
      >
        {value}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════
   Link Practice Dialog
   ══════════════════════════════════════════ */
function LinkPracticeDialog({
  onClose,
  onLink,
}: {
  onClose: () => void;
  onLink: (code: string) => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleLink() {
    if (!code.trim()) {
      setError("Practice code is required");
      return;
    }
    if (code.trim().length < 6) {
      setError("Enter a valid practice code");
      return;
    }
    setError("");
    onLink(code.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(14,38,70,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white font-['Inter'] w-full mx-5"
        style={{ borderRadius: 16, padding: 24, maxWidth: 343 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon header */}
        <div className="flex justify-center mb-4">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 52, height: 52, backgroundColor: "rgba(168,85,247,0.10)" }}
          >
            <StethoscopeIcon size={26} />
          </div>
        </div>

        <p
          className="text-center"
          style={{ fontSize: 18, fontWeight: 700, color: "#0E2646", marginBottom: 6 }}
        >
          Link a Practice
        </p>
        <p
          className="text-center"
          style={{ fontSize: 13, fontWeight: 400, color: "rgba(26,26,26,0.45)", marginBottom: 20 }}
        >
          Enter the practice code provided by your veterinarian to link their practice to your operation.
        </p>

        {/* Code input */}
        <div className="mb-5">
          <label
            className="block font-['Inter'] mb-1.5"
            style={{ fontSize: 12, fontWeight: 600, color: "rgba(26,26,26,0.50)" }}
          >
            Practice Code <span style={{ color: "#E74C3C" }}>*</span>
          </label>
          <input
            autoFocus
            type="text"
            placeholder="e.g. PVC-2026-ABCD"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
            className={`w-full h-[44px] px-3 rounded-lg bg-white border text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all tracking-wider ${
              error
                ? "border-[#E74C3C] focus:border-[#E74C3C] focus:ring-2 focus:ring-[#E74C3C]/25"
                : "border-[#D4D4D0] focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
            }`}
            style={{ fontSize: 16, fontWeight: 600 }}
          />
          {error && (
            <p className="font-['Inter'] mt-1" style={{ fontSize: 12, fontWeight: 500, color: "#E74C3C" }}>
              {error}
            </p>
          )}
        </div>

        {/* Link button */}
        <button
          type="button"
          onClick={handleLink}
          className="w-full rounded-xl cursor-pointer font-['Inter'] transition-all hover:brightness-95 active:scale-[0.98]"
          style={{
            height: 46,
            fontSize: 14,
            fontWeight: 700,
            color: "#0E2646",
            backgroundColor: "#F3D12A",
            border: "none",
          }}
        >
          Link Practice
        </button>

        {/* Cancel */}
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-3 cursor-pointer font-['Inter'] transition-colors"
          style={{
            height: 36,
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(26,26,26,0.40)",
            background: "none",
            border: "none",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN
   ══════════════════════════════════════════ */
export function ReferenceVetPracticesScreen() {
  const [practices, setPractices] = useState<VetPractice[]>(initialPractices);
  const [expandedId, setExpandedId] = useState<string | null>("vp1");
  const [showLink, setShowLink] = useState(false);
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();

  function handleUnlink(practice: VetPractice) {
    showDeleteConfirm({
      title: "Unlink Practice",
      message: `Remove ${practice.name} from your operation? They will lose access to your animal records immediately.`,
      confirmLabel: "Unlink",
      onConfirm: () => {
        setPractices((prev) => prev.filter((p) => p.id !== practice.id));
        if (expandedId === practice.id) setExpandedId(null);
        showToast("success", `${practice.name} unlinked`);
      },
    });
  }

  function handleLinkPractice(code: string) {
    const newPractice: VetPractice = {
      id: `vp${Date.now()}`,
      name: `Practice ${code}`,
      primaryVet: "Pending Confirmation",
      phone: "—",
      email: "—",
      address: "—",
      linkedSince: "Mar 2, 2026",
      animalsAccessed: "Pending",
      status: "Pending",
    };
    setPractices((prev) => [...prev, newPractice]);
    setShowLink(false);
    showToast("success", `Link request sent for code ${code}`);
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const expandedPractice = practices.find((p) => p.id === expandedId);

  return (
    <div className="font-['Inter']" style={{ padding: 20 }}>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-end mb-5">
        <button
          type="button"
          onClick={() => setShowLink(true)}
          className="rounded-full cursor-pointer font-['Inter'] transition-all hover:brightness-95 active:scale-[0.97]"
          style={{
            height: 36,
            padding: "0 16px",
            fontSize: 13,
            fontWeight: 700,
            color: "#0E2646",
            backgroundColor: "#F3D12A",
            border: "none",
          }}
        >
          Link Practice
        </button>
      </div>

      {/* ═══════════════════════════════
         SECTION 1: LINKED PRACTICES
         ═══════════════════════════════ */}
      <div className="mb-6">
        <SectionLabel count={practices.length}>Linked Practices</SectionLabel>

        {practices.length > 0 ? (
          <div className="rounded-xl bg-white border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
            {practices.map((practice) => (
              <div key={practice.id}>
                <div
                  className="flex items-start gap-3 cursor-pointer transition-colors hover:bg-[#F5F5F0] active:bg-[#F5F5F0]"
                  style={{ padding: 16 }}
                  onClick={() => toggleExpand(practice.id)}
                >
                  {/* Practice icon */}
                  <div
                    className="shrink-0 flex items-center justify-center rounded-full"
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "rgba(168,85,247,0.10)",
                    }}
                  >
                    <StethoscopeIcon />
                  </div>

                  {/* Practice info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="truncate"
                      style={{ fontSize: 14, fontWeight: 700, color: "#0E2646", lineHeight: 1.3 }}
                    >
                      {practice.name}
                    </p>
                    <p
                      className="truncate mt-0.5"
                      style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.40)" }}
                    >
                      {practice.primaryVet} · {practice.phone}
                    </p>
                    <div className="mt-1.5">
                      <StatusPill status={practice.status} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 mt-1">
                    <RowMenu
                      onViewDetails={() => setExpandedId(practice.id)}
                      onUnlink={() => handleUnlink(practice)}
                    />
                    <div className="opacity-40">
                      {expandedId === practice.id ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-xl bg-white border border-[#D4D4D0]/60 flex flex-col items-center justify-center"
            style={{ padding: "32px 20px" }}
          >
            <div
              className="flex items-center justify-center rounded-full mb-3"
              style={{ width: 48, height: 48, backgroundColor: "rgba(168,85,247,0.08)" }}
            >
              <StethoscopeIcon size={24} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}>
              No linked practices
            </p>
            <p className="mt-1 text-center" style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.20)" }}>
              Link a vet practice to give them access to your herd records
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════
         SECTION 2: PRACTICE DETAILS
         ═══════════════════════════════ */}
      {expandedPractice && (
        <div className="mb-6">
          <div
            className="rounded-xl bg-white overflow-hidden"
            style={{
              border: "1.5px solid rgba(168,85,247,0.20)",
              padding: 16,
            }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontSize: 15, fontWeight: 700, color: "#0E2646" }}>
                {expandedPractice.name}
              </p>
              <StatusPill status={expandedPractice.status} />
            </div>

            {/* Detail rows */}
            <div className="space-y-2.5">
              <DetailRow label="Primary Vet" value={expandedPractice.primaryVet} />
              <DetailRow label="Phone" value={expandedPractice.phone} />
              <DetailRow label="Email" value={expandedPractice.email} />
              <DetailRow label="Address" value={expandedPractice.address} />
              <DetailRow label="Linked Since" value={expandedPractice.linkedSince} />
              <DetailRow label="Animals Accessed" value={expandedPractice.animalsAccessed} />
            </div>

            {/* Action buttons */}
            <div
              className="flex items-center justify-between mt-5 pt-4"
              style={{ borderTop: "1px solid rgba(212,212,208,0.40)" }}
            >
              <button
                type="button"
                onClick={() => handleUnlink(expandedPractice)}
                className="cursor-pointer font-['Inter'] transition-colors hover:opacity-80"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#E74C3C",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                Unlink Practice
              </button>
              <button
                type="button"
                onClick={() => showToast("info", `Contacting ${expandedPractice.name}…`)}
                className="cursor-pointer font-['Inter'] transition-colors hover:opacity-80"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#55BAAA",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                Contact Practice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════
         SECTION 3: HOW IT WORKS
         ═══════════════════════════════ */}
      <div className="mb-6">
        <div
          className="rounded-xl bg-[#F5F5F0] border border-[#D4D4D0] overflow-hidden"
          style={{ padding: 16 }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <InfoIcon />
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0E2646" }}>
              How Vet Access Works
            </p>
          </div>

          {/* Bullet list */}
          <div className="space-y-1.5 ml-6">
            {[
              "Linked vets can view and edit animal records",
              "Vets see your operation in their practice dashboard",
              "You control access — unlink anytime",
              "Vet changes sync in real time",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span
                  className="shrink-0 mt-[7px] rounded-full"
                  style={{ width: 4, height: 4, backgroundColor: "rgba(26,26,26,0.25)" }}
                />
                <p style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.45)", lineHeight: 1.5 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Link Practice Dialog ── */}
      {showLink && (
        <LinkPracticeDialog
          onClose={() => setShowLink(false)}
          onLink={handleLinkPractice}
        />
      )}
    </div>
  );
}
