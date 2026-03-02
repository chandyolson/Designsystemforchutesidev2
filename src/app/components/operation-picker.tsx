import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ═══════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════ */
export interface Operation {
  id: string;
  initials: string;
  name: string;
  type: string;
  gradientAngle: number;
}

const OPERATIONS: Operation[] = [
  { id: "sb", initials: "SB", name: "Saddle Butte Ranch", type: "Cow-Calf · 847 head", gradientAngle: 140 },
  { id: "bv", initials: "BV", name: "Broken Valley Ranch", type: "Cow-Calf · 320 head", gradientAngle: 155 },
  { id: "dr", initials: "DR", name: "Diamond R Feedlot", type: "Feedlot · 1,200 head", gradientAngle: 170 },
  { id: "hh", initials: "HH", name: "Hiller Hereford", type: "Cow-Calf · 560 head", gradientAngle: 130 },
  { id: "mc", initials: "MC", name: "Morrison Cattle Co", type: "Stocker · 400 head", gradientAngle: 160 },
];

/* ═══════════════════════════════════════════════
   INITIAL AVATAR
   ═══════════════════════════════════════════════ */
function InitialCircle({ initials, angle, size = 40 }: { initials: string; angle: number; size?: number }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-full font-['Inter']"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(${angle}deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)`,
        fontSize: size * 0.33,
        fontWeight: 800,
        color: "rgba(255,255,255,0.85)",
        letterSpacing: "0.04em",
      }}
    >
      {initials}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TEAL CHECKMARK
   ═══════════════════════════════════════════════ */
function TealCheck() {
  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-full"
      style={{ width: 28, height: 28, backgroundColor: "#55BAAA" }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M3 7L6 10L11 4"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   OPERATION PICKER OVERLAY
   ═══════════════════════════════════════════════ */
interface OperationPickerProps {
  open: boolean;
  onClose: () => void;
  currentOperationId?: string;
  onSelect?: (op: Operation) => void;
  onCreateNew?: () => void;
}

export function OperationPicker({
  open,
  onClose,
  currentOperationId = "sb",
  onSelect,
  onCreateNew,
}: OperationPickerProps) {
  const [search, setSearch] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);

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

  /* Reset search on close */
  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  /* Filtered operations */
  const q = search.toLowerCase();
  const current = OPERATIONS.find((op) => op.id === currentOperationId) ?? OPERATIONS[0];
  const others = OPERATIONS.filter((op) => op.id !== currentOperationId);
  const filteredOthers = q
    ? others.filter(
        (op) =>
          op.name.toLowerCase().includes(q) ||
          op.type.toLowerCase().includes(q) ||
          op.initials.toLowerCase().includes(q)
      )
    : others;
  const showCurrent = q
    ? current.name.toLowerCase().includes(q) ||
      current.type.toLowerCase().includes(q) ||
      current.initials.toLowerCase().includes(q)
    : true;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          {/* ── DIM OVERLAY ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.52)" }}
          />

          {/* ── BOTTOM SHEET ── */}
          <motion.div
            ref={sheetRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="absolute bottom-0 left-0 right-0 bg-white font-['Inter'] flex flex-col"
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "80vh",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
            }}
          >
            {/* ── HEADER ── */}
            <div className="shrink-0 relative" style={{ padding: 20, paddingBottom: 16 }}>
              {/* Close X */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 flex items-center justify-center rounded-full cursor-pointer transition-colors hover:bg-[#0E2646]/6"
                style={{ width: 32, height: 32 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4L12 12M12 4L4 12" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              <p style={{ fontSize: 17, fontWeight: 700, color: "#0E2646" }}>
                Switch Operation
              </p>
              <p className="mt-0.5" style={{ fontSize: 13, color: "rgba(26,26,26,0.4)" }}>
                Select an operation to manage
              </p>
            </div>

            {/* ── SEARCH ── */}
            <div className="shrink-0 px-5" style={{ paddingBottom: 14 }}>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  width="15" height="15" viewBox="0 0 16 16" fill="none"
                >
                  <circle cx="7" cy="7" r="5.25" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.5" />
                  <path d="M11 11L14 14" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search operations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#F5F5F0] border border-[#D4D4D0] rounded-xl pl-10 pr-4 text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#55BAAA] focus:ring-2 focus:ring-[#55BAAA]/20 transition-all"
                  style={{ height: 40, fontSize: 16 }}
                />
              </div>
            </div>

            {/* ── SCROLLABLE LIST ── */}
            <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: 8 }}>
              {/* Current Operation */}
              {showCurrent && (
                <div style={{ marginBottom: 10 }}>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "rgba(14,38,70,0.35)",
                      marginBottom: 6,
                    }}
                  >
                    Current
                  </p>
                  <div
                    className="flex items-center gap-3 rounded-xl"
                    style={{
                      padding: "14px 16px",
                      border: "2px solid #55BAAA",
                      backgroundColor: "rgba(85,186,170,0.04)",
                    }}
                  >
                    <InitialCircle initials={current.initials} angle={current.gradientAngle} />
                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate text-[#1A1A1A]"
                        style={{ fontSize: 14, fontWeight: 700 }}
                      >
                        {current.name}
                      </p>
                      <p
                        className="mt-0.5"
                        style={{ fontSize: 12, color: "rgba(26,26,26,0.4)" }}
                      >
                        {current.type}
                      </p>
                    </div>
                    <TealCheck />
                  </div>
                </div>
              )}

              {/* Other Operations */}
              {filteredOthers.length > 0 && (
                <div>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "rgba(14,38,70,0.35)",
                      marginBottom: 6,
                    }}
                  >
                    Other Operations
                  </p>
                  <div
                    className="bg-white rounded-xl overflow-hidden divide-y divide-[#D4D4D0]/40"
                    style={{ border: "1px solid rgba(212,212,208,0.5)" }}
                  >
                    {filteredOthers.map((op) => (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => {
                          onSelect?.(op);
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 text-left cursor-pointer hover:bg-[#0E2646]/[0.02] transition-colors"
                        style={{ padding: "14px 16px" }}
                      >
                        <InitialCircle initials={op.initials} angle={op.gradientAngle} />
                        <div className="flex-1 min-w-0">
                          <p
                            className="truncate text-[#1A1A1A]"
                            style={{ fontSize: 14, fontWeight: 700 }}
                          >
                            {op.name}
                          </p>
                          <p
                            className="mt-0.5"
                            style={{ fontSize: 12, color: "rgba(26,26,26,0.4)" }}
                          >
                            {op.type}
                          </p>
                        </div>
                        {/* Chevron right */}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-20">
                          <path d="M6 4L10 8L6 12" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty search state */}
              {!showCurrent && filteredOthers.length === 0 && (
                <div className="flex flex-col items-center py-10" style={{ color: "rgba(26,26,26,0.3)" }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-3 opacity-40">
                    <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M22 22L28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>No operations found</p>
                </div>
              )}
            </div>

            {/* ── CREATE NEW ── */}
            <div className="shrink-0" style={{ padding: "12px 20px 24px" }}>
              <button
                type="button"
                onClick={() => {
                  onCreateNew?.();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 cursor-pointer transition-colors hover:opacity-70"
                style={{
                  padding: 16,
                  background: "none",
                  border: "none",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2V12M2 7H12" stroke="#55BAAA" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#55BAAA" }}>
                  Create New Operation
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
