import { useState, useRef, useEffect } from "react";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";

/* ══════════════════════════════════════════
   Types & Data
   ══════════════════════════════════════════ */
type Role = "Owner" | "Admin" | "Member" | "Vet" | "View Only";

interface TeamMember {
  id: string;
  initials: string;
  name: string;
  role: Role;
}

interface PendingInvite {
  id: string;
  email: string;
  role: Role;
  sentDate: string;
}

const ROLE_STYLES: Record<Role, { bg: string; color: string }> = {
  Owner: { bg: "rgba(243,209,42,0.15)", color: "#B8860B" },
  Admin: { bg: "rgba(85,186,170,0.12)", color: "#55BAAA" },
  Member: { bg: "rgba(14,38,70,0.08)", color: "#0E2646" },
  Vet: { bg: "rgba(168,85,247,0.12)", color: "#A855F7" },
  "View Only": { bg: "rgba(212,212,208,0.30)", color: "#777777" },
};

const ASSIGNABLE_ROLES: Role[] = ["Admin", "Member", "Vet", "View Only"];

const initialMembers: TeamMember[] = [
  { id: "m1", initials: "JO", name: "John Olson", role: "Owner" },
  { id: "m2", initials: "SM", name: "Sarah Mitchell", role: "Admin" },
  { id: "m3", initials: "TR", name: "Tyler Roberts", role: "Member" },
  { id: "m4", initials: "DM", name: "Dr. Miller", role: "Vet" },
  { id: "m5", initials: "KO", name: "Kate Olson", role: "View Only" },
];

const initialInvites: PendingInvite[] = [
  { id: "i1", email: "ranch.hand@email.com", role: "Member", sentDate: "Feb 26, 2026" },
];

/* ══════════════════════════════════════════
   Icons
   ══════════════════════════════════════════ */
function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3.5" r="1.25" fill="#0E2646" fillOpacity="0.45" />
      <circle cx="8" cy="8" r="1.25" fill="#0E2646" fillOpacity="0.45" />
      <circle cx="8" cy="12.5" r="1.25" fill="#0E2646" fillOpacity="0.45" />
    </svg>
  );
}

function ChevronDown({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="#0E2646" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity={0.3} />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="4" width="14" height="10" rx="2" stroke="white" strokeWidth="1.3" />
      <path d="M2 6L9 10.5L16 6" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
   Role Pill
   ══════════════════════════════════════════ */
function RolePill({ role }: { role: Role }) {
  const s = ROLE_STYLES[role];
  return (
    <span
      className="inline-flex items-center rounded-full font-['Inter']"
      style={{
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 600,
        backgroundColor: s.bg,
        color: s.color,
      }}
    >
      {role}
    </span>
  );
}

/* ══════════════════════════════════════════
   Role Dropdown (inline)
   ══════════════════════════════════════════ */
function RoleDropdown({
  currentRole,
  onChange,
}: {
  currentRole: Role;
  onChange: (role: Role) => void;
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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 cursor-pointer"
        style={{ background: "none", border: "none", padding: 0 }}
      >
        <RolePill role={currentRole} />
        <ChevronDown />
      </button>
      {open && (
        <div className="absolute right-0 top-[28px] z-30 w-36 rounded-xl bg-white border border-[#D4D4D0] shadow-lg overflow-hidden font-['Inter']">
          {ASSIGNABLE_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                onChange(role);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 text-left px-3.5 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
              style={{ background: role === currentRole ? "#F5F5F0" : "none", border: "none" }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: ROLE_STYLES[role].color }}
              />
              <span style={{ fontSize: 13, fontWeight: role === currentRole ? 600 : 400, color: "#1A1A1A" }}>
                {role}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   3-Dot Actions Dropdown
   ══════════════════════════════════════════ */
function ActionsDropdown() {
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
        className="flex items-center justify-center cursor-pointer rounded-lg border border-[#D4D4D0] bg-white transition-colors hover:bg-[#F5F5F0]"
        style={{ width: 32, height: 36 }}
        aria-label="Actions"
      >
        <DotsIcon />
      </button>
      {open && (
        <div className="absolute right-0 top-[40px] z-20 w-44 rounded-xl bg-white border border-[#D4D4D0] shadow-lg overflow-hidden font-['Inter']">
          {["Export Members", "Activity Log"].map((item) => (
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

/* ══════════════════════════════════════════
   Invite Dialog
   ══════════════════════════════════════════ */
function InviteDialog({
  onClose,
  onSend,
}: {
  onClose: () => void;
  onSend: (email: string, role: Role) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Member");
  const [emailError, setEmailError] = useState("");
  const [roleOpen, setRoleOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false);
    }
    if (roleOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [roleOpen]);

  function handleSend() {
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
    onSend(email.trim(), role);
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
        {/* Title */}
        <p style={{ fontSize: 18, fontWeight: 700, color: "#0E2646", marginBottom: 20 }}>
          Invite Team Member
        </p>

        {/* Email */}
        <div className="mb-4">
          <label
            className="block font-['Inter'] mb-1.5"
            style={{ fontSize: 12, fontWeight: 600, color: "rgba(26,26,26,0.50)" }}
          >
            Email Address <span style={{ color: "#E74C3C" }}>*</span>
          </label>
          <input
            autoFocus
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
            className={`w-full h-[44px] px-3 rounded-lg bg-white border text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all ${
              emailError
                ? "border-[#E74C3C] focus:border-[#E74C3C] focus:ring-2 focus:ring-[#E74C3C]/25"
                : "border-[#D4D4D0] focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
            }`}
            style={{ fontSize: 16, fontWeight: 400 }}
          />
          {emailError && (
            <p className="font-['Inter'] mt-1" style={{ fontSize: 12, fontWeight: 500, color: "#E74C3C" }}>
              {emailError}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="mb-6">
          <label
            className="block font-['Inter'] mb-1.5"
            style={{ fontSize: 12, fontWeight: 600, color: "rgba(26,26,26,0.50)" }}
          >
            Role
          </label>
          <div ref={roleRef} className="relative">
            <button
              type="button"
              onClick={() => setRoleOpen(!roleOpen)}
              className="w-full h-[44px] px-3 rounded-lg bg-white border border-[#D4D4D0] flex items-center justify-between cursor-pointer transition-all hover:border-[#D4D4D0]/80"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: ROLE_STYLES[role].color }}
                />
                <span className="font-['Inter']" style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>
                  {role}
                </span>
              </div>
              <ChevronDown size={14} />
            </button>
            {roleOpen && (
              <div className="absolute left-0 right-0 top-[48px] z-10 rounded-xl bg-white border border-[#D4D4D0] shadow-lg overflow-hidden font-['Inter']">
                {ASSIGNABLE_ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setRole(r); setRoleOpen(false); }}
                    className="w-full flex items-center gap-2.5 text-left px-3.5 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
                    style={{ background: r === role ? "#F5F5F0" : "none", border: "none" }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: ROLE_STYLES[r].color }}
                    />
                    <span style={{ fontSize: 13, fontWeight: r === role ? 600 : 400, color: "#1A1A1A" }}>
                      {r}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
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
          Send Invitation
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
export function ReferenceTeamScreen() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [invites, setInvites] = useState<PendingInvite[]>(initialInvites);
  const [showInvite, setShowInvite] = useState(false);
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();

  function handleRoleChange(id: string, newRole: Role) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
    const member = members.find((m) => m.id === id);
    showToast("success", `${member?.name} updated to ${newRole}`);
  }

  function handleSendInvite(email: string, role: Role) {
    // Duplicate check
    if (invites.some((i) => i.email.toLowerCase() === email.toLowerCase())) {
      showToast("error", "An invitation has already been sent to this email");
      return;
    }
    const newInvite: PendingInvite = {
      id: `i${Date.now()}`,
      email,
      role,
      sentDate: "Mar 2, 2026",
    };
    setInvites((prev) => [...prev, newInvite]);
    setShowInvite(false);
    showToast("success", `Invitation sent to ${email}`);
  }

  function handleResend(invite: PendingInvite) {
    showToast("info", `Invitation resent to ${invite.email}`);
  }

  function handleRevoke(invite: PendingInvite) {
    showDeleteConfirm({
      title: "Revoke Invitation",
      message: `Revoke the invitation for ${invite.email}?`,
      confirmLabel: "Revoke",
      onConfirm: () => {
        setInvites((prev) => prev.filter((i) => i.id !== invite.id));
        showToast("success", `Invitation to ${invite.email} revoked`);
      },
    });
  }

  return (
    <div className="font-['Inter']" style={{ padding: 20 }}>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-end gap-2.5 mb-5">
        <button
          type="button"
          onClick={() => setShowInvite(true)}
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
          Invite
        </button>
        <ActionsDropdown />
      </div>

      {/* ── Active Members ── */}
      <div className="mb-6">
        <SectionLabel count={members.length}>Active Members</SectionLabel>
        <div className="rounded-xl bg-white border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3"
              style={{ padding: "12px 16px" }}
            >
              {/* Avatar */}
              <div
                className="shrink-0 flex items-center justify-center rounded-full"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: "#0E2646",
                }}
              >
                <span
                  className="font-['Inter'] text-white"
                  style={{ fontSize: 13, fontWeight: 700 }}
                >
                  {member.initials}
                </span>
              </div>

              {/* Name + Role */}
              <div className="flex-1 min-w-0">
                <p
                  className="truncate"
                  style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.3 }}
                >
                  {member.name}
                </p>
                <div className="mt-1">
                  {member.role === "Owner" ? (
                    <RolePill role="Owner" />
                  ) : (
                    <RoleDropdown
                      currentRole={member.role}
                      onChange={(r) => handleRoleChange(member.id, r)}
                    />
                  )}
                </div>
              </div>

              {/* Chevron for non-owner */}
              {member.role !== "Owner" && (
                <div className="shrink-0 opacity-0">
                  <ChevronDown />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Pending Invitations ── */}
      <div className="mb-6">
        <SectionLabel count={invites.length}>Pending Invitations</SectionLabel>
        {invites.length > 0 ? (
          <div className="rounded-xl bg-white border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-start gap-3"
                style={{ padding: "12px 16px" }}
              >
                {/* Envelope icon */}
                <div
                  className="shrink-0 flex items-center justify-center rounded-full"
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: "rgba(14,38,70,0.12)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="4" width="14" height="10" rx="2" stroke="#0E2646" strokeOpacity="0.40" strokeWidth="1.3" />
                    <path d="M2 6L9 10.5L16 6" stroke="#0E2646" strokeOpacity="0.40" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p
                    className="truncate"
                    style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.3 }}
                  >
                    {invite.email}
                  </p>
                  <p
                    className="mt-0.5"
                    style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.35)", lineHeight: 1.4 }}
                  >
                    Sent {invite.sentDate} · {invite.role}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => handleResend(invite)}
                      className="cursor-pointer font-['Inter']"
                      style={{ fontSize: 12, fontWeight: 600, color: "#55BAAA", background: "none", border: "none", padding: 0 }}
                    >
                      Resend
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRevoke(invite)}
                      className="cursor-pointer font-['Inter']"
                      style={{ fontSize: 12, fontWeight: 600, color: "#E74C3C", background: "none", border: "none", padding: 0 }}
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-xl bg-white border border-[#D4D4D0]/60 flex items-center justify-center"
            style={{ padding: "28px 16px" }}
          >
            <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(26,26,26,0.25)" }}>
              No pending invitations
            </p>
          </div>
        )}
      </div>

      {/* ── Invite Dialog ── */}
      {showInvite && (
        <InviteDialog
          onClose={() => setShowInvite(false)}
          onSend={handleSendInvite}
        />
      )}
    </div>
  );
}
