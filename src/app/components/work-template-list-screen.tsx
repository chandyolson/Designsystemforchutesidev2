import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { PillButton } from "./pill-button";

/* ── Processing type pill colors ── */
const typePillStyles: Record<string, { bg: string; color: string }> = {
  PREG: { bg: "#55BAAA", color: "#FFFFFF" },
  BSE: { bg: "#0E2646", color: "#FFFFFF" },
  PROCESS: { bg: "#F3D12A", color: "#1A1A1A" },
  AI: { bg: "#9B2335", color: "#FFFFFF" },
  SALE: { bg: "#E74C3C", color: "#FFFFFF" },
};
const defaultPill = { bg: "rgba(26,26,26,0.15)", color: "#1A1A1A" };

/* ── Mock templates ── */
export interface WorkTemplate {
  id: string;
  name: string;
  type: string;
  cattleType: string;
  fields: string[];
}

export const MOCK_TEMPLATES: WorkTemplate[] = [
  { id: "t1", name: "Spring Preg Check", type: "PREG", cattleType: "Cow", fields: ["Weight", "Preg Stage", "Days Gest", "Calf Sex", "Quick Notes"] },
  { id: "t2", name: "Fall Processing", type: "PROCESS", cattleType: "Mixed", fields: ["Weight", "Data 1", "Data 2", "Quick Notes", "DNA / Sample"] },
  { id: "t3", name: "Annual BSE", type: "BSE", cattleType: "Bull", fields: ["Weight", "BSE Result", "Scrotal Circ", "Motility %", "Morphology %"] },
  { id: "t4", name: "Cull Sort", type: "SALE", cattleType: "Cow", fields: ["Weight", "Cull Reason", "Disposition"] },
];

/* ── Overflow menu per card ── */
function CardMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative z-10">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="rounded-md cursor-pointer flex items-center justify-center"
        style={{ width: 24, height: 24, background: "none", border: "none" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="3" r="1.2" fill="rgba(26,26,26,0.35)" />
          <circle cx="7" cy="7" r="1.2" fill="rgba(26,26,26,0.35)" />
          <circle cx="7" cy="11" r="1.2" fill="rgba(26,26,26,0.35)" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden font-['Inter']"
          style={{ minWidth: 130, boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(); }}
            className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
            style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", background: "none", border: "none" }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(); }}
            className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
            style={{ fontSize: 13, fontWeight: 500, color: "#E74C3C", background: "none", border: "none" }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   WORK TEMPLATE LIST SCREEN
   ═══════════════════════════════════════════════ */
export function WorkTemplateListScreen() {
  const navigate = useNavigate();
  const [templates] = useState<WorkTemplate[]>(MOCK_TEMPLATES);

  /* ── Empty state ── */
  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 font-['Inter']">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4">
          <rect x="8" y="6" width="32" height="36" rx="4" stroke="rgba(26,26,26,0.15)" strokeWidth="2" />
          <path d="M16 16h16M16 24h12M16 32h8" stroke="rgba(26,26,26,0.15)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(26,26,26,0.3)" }}>
          No templates yet
        </p>
        <p className="mt-1 mb-4" style={{ fontSize: 13, fontWeight: 400, color: "rgba(26,26,26,0.25)" }}>
          Create a template to speed up project setup
        </p>
        <PillButton size="md" onClick={() => navigate("/cow-work/templates/new")}>
          Create Template
        </PillButton>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-['Inter']">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => navigate("/cow-work/templates/new")}
          className="rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.95]"
          style={{
            width: 38,
            height: 38,
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1,
            color: "#1A1A1A",
            backgroundColor: "#F3D12A",
            boxShadow: "0 2px 8px rgba(243,209,42,0.30)",
          }}
        >
          +
        </button>
      </div>

      {/* ── Template Cards ── */}
      <div className="space-y-3">
        {templates.map((t) => {
          const pill = typePillStyles[t.type] || defaultPill;
          return (
            <div
              key={t.id}
              onClick={() => navigate(`/cow-work/templates/${t.id}`)}
              className="bg-white border border-[#D4D4D0] rounded-xl px-4 py-3.5 cursor-pointer transition-colors active:bg-[#F5F5F0]"
            >
              {/* Row 1 */}
              <div className="flex items-center justify-between gap-2">
                <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>
                  {t.name}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full uppercase"
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      padding: "3px 10px",
                      backgroundColor: pill.bg,
                      color: pill.color,
                    }}
                  >
                    {t.type}
                  </span>
                  <CardMenu
                    onEdit={() => navigate(`/cow-work/templates/${t.id}`)}
                    onDelete={() => {}}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <p className="mt-1" style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.45)" }}>
                Cattle Type: {t.cattleType} · {t.fields.length} visible fields
              </p>

              {/* Row 3 – field pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {t.fields.map((f) => (
                  <span
                    key={f}
                    className="rounded-full"
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#0E2646",
                      backgroundColor: "rgba(14,38,70,0.06)",
                      padding: "2px 8px",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
