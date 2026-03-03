import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */
export interface EmailReportAttachment {
  name: string;
  size: string;
}

interface EmailReportDialogProps {
  open: boolean;
  onClose: () => void;
  /** Pre-populated recipients */
  initialRecipients?: string[];
  /** Pre-filled subject line */
  subject?: string;
  /** Pre-filled message body */
  message?: string;
  /** Attachment preview */
  attachment?: EmailReportAttachment;
  onSend?: (data: {
    recipients: string[];
    subject: string;
    message: string;
  }) => void;
}

/* ═══════════════════════════════════════════════
   EMAIL CHIP
   ═══════════════════════════════════════════════ */
function EmailChip({
  email,
  onRemove,
}: {
  email: string;
  onRemove: () => void;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-['Inter']"
      style={{
        padding: "4px 8px 4px 10px",
        backgroundColor: "rgba(14,38,70,0.08)",
        fontSize: 12,
        fontWeight: 500,
        color: "#0E2646",
        maxWidth: "100%",
      }}
    >
      <span className="truncate">{email}</span>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 flex items-center justify-center rounded-full cursor-pointer transition-colors hover:bg-[#0E2646]/10"
        style={{ width: 16, height: 16 }}
      >
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path
            d="M2 2L7 7M7 2L2 7"
            stroke="#0E2646"
            strokeOpacity="0.5"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </span>
  );
}

/* ═══════════════════════════════════════════════
   FIELD LABEL
   ═══════════════════════════════════════════════ */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block font-['Inter']"
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: "rgba(14,38,70,0.45)",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

/* ═══════════════════════════════════════════════
   INPUT STYLES
   ═══════════════════════════════════════════════ */
const INPUT_STYLE: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 400,
  color: "#1A1A1A",
  height: 44,
};

const INPUT_CLASS =
  "w-full bg-white border border-[#D4D4D0] rounded-xl px-3.5 font-['Inter'] placeholder:text-[#1A1A1A]/25 outline-none focus:border-[#55BAAA] focus:ring-2 focus:ring-[#55BAAA]/20 transition-all";

/* ═══════════════════════════════════════════════
   MAIN DIALOG
   ═══════════════════════════════════════════════ */
export function EmailReportDialog({
  open,
  onClose,
  initialRecipients = ["doc.miller@email.com"],
  subject: initialSubject = "Spring Preg Check Report - Feb 28, 2026",
  message: initialMessage = "Please find the attached project report for Spring Preg Check completed on Feb 28, 2026.",
  attachment = {
    name: "Spring_Preg_Check_Report.pdf",
    size: "245 KB",
  },
  onSend,
}: EmailReportDialogProps) {
  const [recipients, setRecipients] = useState<string[]>(initialRecipients);
  const [emailInput, setEmailInput] = useState("");
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState(initialMessage);
  const inputRef = useRef<HTMLInputElement>(null);

  const stableRecipients = useMemo(() => initialRecipients, [initialRecipients.join(",")]);
  const stableSubject = initialSubject;
  const stableMessage = initialMessage;

  /* Lock body scroll */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Escape to close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Reset on open */
  useEffect(() => {
    if (open) {
      setRecipients(stableRecipients);
      setEmailInput("");
      setSubject(stableSubject);
      setMessage(stableMessage);
    }
  }, [open, stableRecipients, stableSubject, stableMessage]);

  /* Parse and add emails from input */
  const addEmails = useCallback(
    (raw: string) => {
      const newEmails = raw
        .split(/[,;\s]+/)
        .map((e) => e.trim().toLowerCase())
        .filter(
          (e) =>
            e.length > 0 &&
            e.includes("@") &&
            !recipients.includes(e)
        );
      if (newEmails.length > 0) {
        setRecipients((prev) => [...prev, ...newEmails]);
      }
      setEmailInput("");
    },
    [recipients]
  );

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmails(emailInput);
    }
    if (e.key === "Backspace" && emailInput === "" && recipients.length > 0) {
      setRecipients((prev) => prev.slice(0, -1));
    }
  };

  const handleInputBlur = () => {
    if (emailInput.trim()) {
      addEmails(emailInput);
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients((prev) => prev.filter((r) => r !== email));
  };

  const handleSend = () => {
    if (emailInput.trim()) {
      addEmails(emailInput);
    }
    onSend?.({ recipients, subject, message });
    onClose();
  };

  const canSend = recipients.length > 0 && subject.trim().length > 0;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* ── DIM OVERLAY ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.52)" }}
          />

          {/* ── MODAL CARD ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", damping: 28, stiffness: 380 }}
            className="relative bg-white font-['Inter'] flex flex-col"
            style={{
              width: "calc(100% - 48px)",
              maxWidth: 360,
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 20px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.08)",
              maxHeight: "calc(100vh - 80px)",
            }}
          >
            {/* ═══════════════════════════════
               HEADER
               ═══════════════════════════════ */}
            <div className="flex flex-col items-center" style={{ marginBottom: 20 }}>
              {/* Mail icon circle */}
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "#E3F2FD",
                  marginBottom: 12,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2.5"
                    stroke="#2196F3"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M3 7L10.8906 12.2604C11.5624 12.7083 12.4376 12.7083 13.1094 12.2604L21 7"
                    stroke="#2196F3"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: "#0E2646" }}>
                Email Report
              </p>
            </div>

            {/* ═══════════════════════════════
               SCROLLABLE FORM
               ═══════════════════════════════ */}
            <div className="flex-1 overflow-y-auto space-y-4" style={{ marginBottom: 20 }}>
              {/* ── TO FIELD ── */}
              <div>
                <FieldLabel>To</FieldLabel>
                <div
                  className="bg-white border border-[#D4D4D0] rounded-xl px-3 py-2 transition-all focus-within:border-[#55BAAA] focus-within:ring-2 focus-within:ring-[#55BAAA]/20 cursor-text"
                  onClick={() => inputRef.current?.focus()}
                >
                  {/* Chips */}
                  {recipients.length > 0 && (
                    <div className="flex flex-wrap gap-1.5" style={{ marginBottom: recipients.length > 0 ? 6 : 0 }}>
                      {recipients.map((email) => (
                        <EmailChip
                          key={email}
                          email={email}
                          onRemove={() => removeRecipient(email)}
                        />
                      ))}
                    </div>
                  )}
                  {/* Input */}
                  <input
                    ref={inputRef}
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleInputBlur}
                    placeholder="Add email..."
                    className="w-full bg-transparent border-none outline-none font-['Inter'] placeholder:text-[#1A1A1A]/25"
                    style={{ fontSize: 16, fontWeight: 400, color: "#1A1A1A", height: 28, padding: 0 }}
                  />
                </div>
                <p
                  className="mt-1.5 font-['Inter']"
                  style={{ fontSize: 11, color: "rgba(26,26,26,0.25)" }}
                >
                  Separate multiple with commas
                </p>
              </div>

              {/* ── SUBJECT ── */}
              <div>
                <FieldLabel>Subject</FieldLabel>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Report subject..."
                  className={INPUT_CLASS}
                  style={INPUT_STYLE}
                />
              </div>

              {/* ── MESSAGE ── */}
              <div>
                <FieldLabel>Message</FieldLabel>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message..."
                  rows={3}
                  className="w-full bg-white border border-[#D4D4D0] rounded-xl px-3.5 py-3 font-['Inter'] placeholder:text-[#1A1A1A]/25 outline-none focus:border-[#55BAAA] focus:ring-2 focus:ring-[#55BAAA]/20 transition-all resize-none"
                  style={{ fontSize: 16, fontWeight: 400, color: "#1A1A1A", lineHeight: 1.5 }}
                />
              </div>

              {/* ── ATTACHMENT PREVIEW ── */}
              {attachment && (
                <div
                  className="flex items-center gap-3 rounded-lg"
                  style={{
                    padding: "10px 14px",
                    backgroundColor: "#F5F5F0",
                  }}
                >
                  {/* File icon */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                    <path
                      d="M9.33 1.33H4C3.64 1.33 3.33 1.64 3.33 2V14C3.33 14.36 3.64 14.67 4 14.67H12C12.36 14.67 12.67 14.36 12.67 14V4.67L9.33 1.33Z"
                      stroke="#0E2646"
                      strokeOpacity="0.3"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.33 1.33V4.67H12.67"
                      stroke="#0E2646"
                      strokeOpacity="0.3"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="truncate font-['Inter']"
                      style={{ fontSize: 12, fontWeight: 500, color: "#1A1A1A" }}
                    >
                      {attachment.name}
                    </p>
                  </div>
                  <span
                    className="shrink-0 font-['Inter']"
                    style={{ fontSize: 11, color: "rgba(26,26,26,0.3)" }}
                  >
                    {attachment.size}
                  </span>
                </div>
              )}
            </div>

            {/* ═══════════════════════════════
               BUTTONS
               ═══════════════════════════════ */}
            <div className="shrink-0 space-y-2">
              {/* Send */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                className="w-full rounded-xl font-['Inter'] cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  height: 44,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0E2646",
                  backgroundColor: "#F3D12A",
                  border: "none",
                }}
              >
                Send
              </button>

              {/* Cancel */}
              <button
                type="button"
                onClick={onClose}
                className="w-full flex items-center justify-center cursor-pointer transition-colors hover:opacity-70"
                style={{
                  height: 36,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(26,26,26,0.4)",
                  background: "none",
                  border: "none",
                }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}