import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */
export type ExportFormat = "csv" | "pdf" | "xlsx";

export interface ExportColumn {
  id: string;
  label: string;
  checked: boolean;
}

const DEFAULT_COLUMNS: ExportColumn[] = [
  { id: "tag", label: "Tag", checked: true },
  { id: "tag_color", label: "Tag Color", checked: true },
  { id: "sex", label: "Sex", checked: true },
  { id: "type", label: "Type", checked: true },
  { id: "year_born", label: "Year Born", checked: true },
  { id: "status", label: "Status", checked: false },
  { id: "flag", label: "Flag", checked: true },
  { id: "eid", label: "EID", checked: false },
  { id: "breed", label: "Breed", checked: false },
];

/* ═══════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════ */
function CsvIcon({ color = "#0E2646" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 13H16" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 17H13" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PdfIcon({ color = "#0E2646" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15V13H10.5C11.0523 13 11.5 13.4477 11.5 14V14C11.5 14.5523 11.0523 15 10.5 15H9Z" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15V18" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ExcelIcon({ color = "#0E2646" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M4 9H20" stroke={color} strokeWidth="1.4" />
      <path d="M4 14H20" stroke={color} strokeWidth="1.4" />
      <path d="M9 4V20" stroke={color} strokeWidth="1.4" />
      <path d="M15 4V20" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   CHECKBOX
   ═══════════════════════════════════════════════ */
function TealCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="shrink-0 flex items-center justify-center rounded cursor-pointer transition-all"
      style={{
        width: 22,
        height: 22,
        backgroundColor: checked ? "#55BAAA" : "transparent",
        border: checked ? "1.5px solid #55BAAA" : "1.5px solid #D4D4D0",
      }}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6L5 8.5L9.5 3.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   FORMAT CARDS DATA
   ═══════════════════════════════════════════════ */
const FORMAT_OPTIONS: {
  id: ExportFormat;
  label: string;
  description: string;
  icon: (color: string) => React.ReactNode;
}[] = [
  {
    id: "csv",
    label: "CSV Spreadsheet",
    description: "Compatible with Excel, Google Sheets",
    icon: (c) => <CsvIcon color={c} />,
  },
  {
    id: "pdf",
    label: "PDF Report",
    description: "Formatted for printing",
    icon: (c) => <PdfIcon color={c} />,
  },
  {
    id: "xlsx",
    label: "Excel Workbook",
    description: "Native .xlsx format",
    icon: (c) => <ExcelIcon color={c} />,
  },
];

/* ═══════════════════════════════════════════════
   EXPORT FORMAT PICKER
   ═══════════════════════════════════════════════ */
interface ExportFormatPickerProps {
  open: boolean;
  onClose: () => void;
  /** e.g. "47 animals selected" */
  subtitle?: string;
  onExport?: (format: ExportFormat, columns: ExportColumn[]) => void;
}

export function ExportFormatPicker({
  open,
  onClose,
  subtitle = "47 animals selected",
  onExport,
}: ExportFormatPickerProps) {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [columns, setColumns] = useState<ExportColumn[]>(() =>
    DEFAULT_COLUMNS.map((c) => ({ ...c }))
  );

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
      setFormat("csv");
      setColumns(DEFAULT_COLUMNS.map((c) => ({ ...c })));
    }
  }, [open]);

  const toggleColumn = useCallback((id: string) => {
    setColumns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  }, []);

  const allChecked = columns.every((c) => c.checked);
  const noneChecked = columns.every((c) => !c.checked);
  const checkedCount = columns.filter((c) => c.checked).length;

  const handleSelectAll = () => {
    setColumns((prev) => prev.map((c) => ({ ...c, checked: true })));
  };

  const handleDeselectAll = () => {
    setColumns((prev) => prev.map((c) => ({ ...c, checked: false })));
  };

  const handleExport = () => {
    onExport?.(format, columns.filter((c) => c.checked));
    onClose();
  };

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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="absolute bottom-0 left-0 right-0 bg-white font-['Inter'] flex flex-col"
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "85vh",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
            }}
          >
            {/* ══════════════════════════════════
               HEADER
               ══════════════════════════════════ */}
            <div className="shrink-0 relative" style={{ padding: "24px 24px 0 24px" }}>
              {/* Close X */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-5 right-5 flex items-center justify-center rounded-full cursor-pointer transition-colors hover:bg-[#0E2646]/6"
                style={{ width: 32, height: 32 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="#1A1A1A"
                    strokeOpacity="0.35"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <p style={{ fontSize: 17, fontWeight: 700, color: "#0E2646" }}>
                Export Data
              </p>
              <p className="mt-0.5" style={{ fontSize: 13, color: "rgba(26,26,26,0.4)" }}>
                {subtitle}
              </p>
            </div>

            {/* ── SCROLLABLE BODY ── */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ padding: "20px 24px 0 24px" }}
            >
              {/* ══════════════════════════════════
                 FORMAT OPTIONS
                 ══════════════════════════════════ */}
              <div className="space-y-2.5">
                {FORMAT_OPTIONS.map((opt) => {
                  const isSelected = opt.id === format;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFormat(opt.id)}
                      className="w-full flex items-center gap-4 text-left rounded-xl cursor-pointer transition-all"
                      style={{
                        padding: 16,
                        border: isSelected
                          ? "1.5px solid #55BAAA"
                          : "1.5px solid #D4D4D0",
                        backgroundColor: isSelected
                          ? "rgba(85,186,170,0.04)"
                          : "#FFFFFF",
                      }}
                    >
                      {/* Icon */}
                      <div className="shrink-0">
                        {opt.icon(isSelected ? "#0E2646" : "#0E2646")}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[#0E2646]"
                          style={{ fontSize: 14, fontWeight: 600 }}
                        >
                          {opt.label}
                        </p>
                        <p
                          className="mt-0.5"
                          style={{
                            fontSize: 12,
                            color: "rgba(26,26,26,0.35)",
                          }}
                        >
                          {opt.description}
                        </p>
                      </div>

                      {/* Radio indicator */}
                      <div
                        className="shrink-0 flex items-center justify-center rounded-full transition-all"
                        style={{
                          width: 22,
                          height: 22,
                          border: isSelected
                            ? "2px solid #55BAAA"
                            : "1.5px solid #D4D4D0",
                        }}
                      >
                        {isSelected && (
                          <div
                            className="rounded-full"
                            style={{
                              width: 10,
                              height: 10,
                              backgroundColor: "#55BAAA",
                            }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ══════════════════════════════════
                 COLUMNS SECTION
                 ══════════════════════════════════ */}
              <div style={{ marginTop: 24 }}>
                {/* Section header with select/deselect */}
                <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "rgba(14,38,70,0.5)",
                    }}
                  >
                    Include Columns
                    <span
                      className="ml-1.5"
                      style={{ fontSize: 11, fontWeight: 500, color: "rgba(26,26,26,0.25)" }}
                    >
                      ({checkedCount}/{columns.length})
                    </span>
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      disabled={allChecked}
                      className="cursor-pointer transition-opacity disabled:opacity-30"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#55BAAA",
                        background: "none",
                        border: "none",
                        padding: 0,
                      }}
                    >
                      Select All
                    </button>
                    <span style={{ color: "rgba(26,26,26,0.12)", fontSize: 11 }}>|</span>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      disabled={noneChecked}
                      className="cursor-pointer transition-opacity disabled:opacity-30"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#55BAAA",
                        background: "none",
                        border: "none",
                        padding: 0,
                      }}
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {/* Column checkboxes */}
                <div
                  className="rounded-xl overflow-hidden divide-y divide-[#D4D4D0]/30"
                  style={{ border: "1px solid rgba(212,212,208,0.5)" }}
                >
                  {columns.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => toggleColumn(col.id)}
                      className="w-full flex items-center gap-3 text-left cursor-pointer hover:bg-[#0E2646]/[0.015] transition-colors"
                      style={{ padding: "11px 16px" }}
                    >
                      <TealCheckbox
                        checked={col.checked}
                        onChange={() => toggleColumn(col.id)}
                      />
                      <span
                        className="text-[#1A1A1A]"
                        style={{
                          fontSize: 14,
                          fontWeight: col.checked ? 500 : 400,
                          opacity: col.checked ? 1 : 0.55,
                        }}
                      >
                        {col.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════
               EXPORT BUTTON
               ══════════════════════════════════ */}
            <div className="shrink-0" style={{ padding: "20px 24px 28px 24px" }}>
              <button
                type="button"
                onClick={handleExport}
                disabled={noneChecked}
                className="w-full rounded-xl font-['Inter'] cursor-pointer transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  height: 48,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0E2646",
                  backgroundColor: "#F3D12A",
                  border: "none",
                }}
              >
                Export{" "}
                {format === "csv"
                  ? "CSV"
                  : format === "pdf"
                  ? "PDF"
                  : "Excel"}
                {checkedCount > 0 && (
                  <span
                    className="ml-1"
                    style={{ fontWeight: 500, opacity: 0.5, fontSize: 13 }}
                  >
                    · {checkedCount} columns
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
