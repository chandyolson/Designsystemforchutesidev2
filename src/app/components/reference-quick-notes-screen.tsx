import { useState, useRef, useEffect } from "react";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";
import { FlagIcon } from "./flag-icon";
import type { FlagColor } from "./flag-icon";

/* ══════════════════════════════════════════
   Types & Data
   ══════════════════════════════════════════ */
type NoteFlag = "cull" | "production" | "management" | "none";
type Availability = "All" | "Calving Only";

interface QuickNote {
  id: string;
  text: string;
  flag: NoteFlag;
  availability: Availability;
  calvingLabel?: string; // e.g. "(Calving)" shown inside pill
}

const FLAG_PILL_STYLES: Record<NoteFlag, { bg: string; border: string; color: string; xColor: string }> = {
  cull: {
    bg: "rgba(155,35,53,0.12)",
    border: "rgba(155,35,53,0.25)",
    color: "#9B2335",
    xColor: "rgba(155,35,53,0.50)",
  },
  production: {
    bg: "rgba(243,209,42,0.12)",
    border: "rgba(243,209,42,0.30)",
    color: "#B8860B",
    xColor: "rgba(184,134,11,0.50)",
  },
  management: {
    bg: "rgba(85,186,170,0.12)",
    border: "rgba(85,186,170,0.25)",
    color: "#55BAAA",
    xColor: "rgba(85,186,170,0.50)",
  },
  none: {
    bg: "#F5F5F0",
    border: "#D4D4D0",
    color: "rgba(26,26,26,0.55)",
    xColor: "rgba(26,26,26,0.30)",
  },
};

const FLAG_TO_FLAG_COLOR: Record<Exclude<NoteFlag, "none">, FlagColor> = {
  cull: "red",
  production: "gold",
  management: "teal",
};

/* ── 17 spec notes in exact order ── */
const initialNotes: QuickNote[] = [
  // Cull-flagged (red)
  { id: "n1", text: "Cull", flag: "cull", availability: "All" },
  // Production-flagged (yellow)
  { id: "n2", text: "Bad Bag", flag: "production", availability: "All" },
  { id: "n3", text: "Bad Feet", flag: "production", availability: "All" },
  { id: "n4", text: "Lame", flag: "production", availability: "All" },
  { id: "n5", text: "Lump Jaw", flag: "production", availability: "All" },
  { id: "n6", text: "Bad Disposition", flag: "production", availability: "All" },
  { id: "n7", text: "Bad Mother", flag: "production", availability: "All" },
  { id: "n8", text: "Old", flag: "production", availability: "All" },
  { id: "n9", text: "Poor Calf", flag: "production", availability: "All" },
  { id: "n10", text: "Poor Condition", flag: "production", availability: "All" },
  // Management-flagged (teal)
  { id: "n11", text: "Needs Tag", flag: "management", availability: "All" },
  { id: "n12", text: "DNA", flag: "management", availability: "All" },
  { id: "n13", text: "Needs Treated", flag: "management", availability: "All" },
  // No flag (neutral)
  { id: "n14", text: "Sorted", flag: "none", availability: "All" },
  { id: "n15", text: "Treated", flag: "none", availability: "All" },
  { id: "n16", text: "Twin", flag: "none", availability: "Calving Only", calvingLabel: "(Calving)" },
  { id: "n17", text: "Freemartin", flag: "none", availability: "All" },
];

/* ══════════════════════════════════════════
   Note Pill
   ══════════════════════════════════════════ */
function NotePill({
  note,
  onDelete,
}: {
  note: QuickNote;
  onDelete: () => void;
}) {
  const s = FLAG_PILL_STYLES[note.flag];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-['Inter'] transition-colors group"
      style={{
        padding: "6px 14px",
        fontSize: 13,
        fontWeight: 600,
        color: s.color,
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {note.text}
      {note.calvingLabel && (
        <>
          <span
            className="shrink-0"
            style={{
              width: 1,
              height: 12,
              backgroundColor: s.xColor,
              margin: "0 2px",
            }}
          />
          <span style={{ fontSize: 9, fontWeight: 600, opacity: 0.7 }}>
            {note.calvingLabel}
          </span>
        </>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="flex items-center justify-center cursor-pointer rounded-full shrink-0 transition-opacity opacity-60 hover:opacity-100"
        style={{ width: 14, height: 14, marginLeft: 2 }}
        aria-label={`Delete "${note.text}"`}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5"
            stroke={s.xColor}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </span>
  );
}

/* ══════════════════════════════════════════
   Flag Selector (for Add form)
   ══════════════════════════════════════════ */
const FLAG_OPTIONS: { value: NoteFlag; label: string; hex?: string }[] = [
  { value: "none", label: "None" },
  { value: "management", label: "Management", hex: "#55BAAA" },
  { value: "production", label: "Production", hex: "#D4A017" },
  { value: "cull", label: "Cull", hex: "#9B2335" },
];

function FlagSelector({
  value,
  onChange,
}: {
  value: NoteFlag;
  onChange: (v: NoteFlag) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {FLAG_OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        const selectedBorder = opt.hex || "#D4D4D0";
        const selectedBg = opt.hex ? `${opt.hex}1A` : "transparent";

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div
              className="flex items-center justify-center rounded-full transition-all"
              style={{
                width: 32,
                height: 32,
                border: isSelected
                  ? `2px solid ${selectedBorder}`
                  : "1.5px solid #D4D4D0",
                backgroundColor: isSelected ? selectedBg : "transparent",
              }}
            >
              {opt.value !== "none" && (
                <FlagIcon
                  color={FLAG_TO_FLAG_COLOR[opt.value as Exclude<NoteFlag, "none">]}
                  size="sm"
                />
              )}
            </div>
            <span
              className="font-['Inter']"
              style={{
                fontSize: 9,
                fontWeight: isSelected ? 700 : 500,
                color: isSelected
                  ? opt.hex || "#1A1A1A"
                  : "rgba(26,26,26,0.40)",
              }}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════
   Add Note Form
   ══════════════════════════════════════════ */
function AddNoteForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (data: { text: string; availability: Availability; flag: NoteFlag }) => void;
}) {
  const [text, setText] = useState("");
  const [availability, setAvailability] = useState<string>("All");
  const [flag, setFlag] = useState<NoteFlag>("none");
  const [textError, setTextError] = useState("");

  function handleSave() {
    if (!text.trim()) {
      setTextError("Note text is required");
      return;
    }
    setTextError("");
    onSave({
      text: text.trim(),
      availability: availability as Availability,
      flag,
    });
  }

  return (
    <div>
      <p
        className="font-['Inter'] uppercase mb-2 px-1"
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "rgba(14,38,70,0.35)",
        }}
      >
        Add Quick Note
      </p>

      <div
        className="bg-white rounded-xl border border-[#D4D4D0]/60 font-['Inter']"
        style={{ padding: 16 }}
      >
        <div className="space-y-3">
          <FormFieldRow
            label="Note Text"
            placeholder="e.g. Bad Eyes"
            value={text}
            onChange={(v) => {
              setText(v);
              if (textError) setTextError("");
            }}
            required
            error={textError}
          />
          <FormSelectRow
            label="Available In"
            placeholder="Select..."
            value={availability}
            onChange={setAvailability}
            options={["All", "Calving Only"]}
          />

          {/* Flag row */}
          <div
            className="flex items-center"
            style={{ minHeight: 44 }}
          >
            <label
              className="shrink-0 font-['Inter']"
              style={{
                width: 105,
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(26,26,26,0.45)",
              }}
            >
              Flag
            </label>
            <FlagSelector value={flag} onChange={setFlag} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg cursor-pointer font-['Inter'] transition-colors hover:bg-[#F5F5F0]"
            style={{
              height: 38,
              padding: "0 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(26,26,26,0.50)",
              border: "1px solid #D4D4D0",
              backgroundColor: "white",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg cursor-pointer font-['Inter'] transition-colors hover:brightness-95"
            style={{
              height: 38,
              padding: "0 20px",
              fontSize: 13,
              fontWeight: 600,
              color: "#0E2646",
              backgroundColor: "#F3D12A",
              border: "none",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN
   ══════════════════════════════════════════ */
export function ReferenceQuickNotesScreen() {
  const [notes, setNotes] = useState<QuickNote[]>(initialNotes);
  const [showAddForm, setShowAddForm] = useState(false);
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();
  const formRef = useRef<HTMLDivElement>(null);

  function handleAdd(data: { text: string; availability: Availability; flag: NoteFlag }) {
    const exists = notes.some(
      (n) => n.text.toLowerCase() === data.text.toLowerCase()
    );
    if (exists) {
      showToast("error", `"${data.text}" already exists`);
      return;
    }
    const newNote: QuickNote = {
      id: `n${Date.now()}`,
      text: data.text,
      flag: data.flag,
      availability: data.availability,
      calvingLabel: data.availability === "Calving Only" ? "(Calving)" : undefined,
    };
    setNotes((prev) => [...prev, newNote]);
    setShowAddForm(false);
    showToast("success", `"${data.text}" added`);
  }

  function handleDeleteNote(note: QuickNote) {
    showDeleteConfirm({
      title: "Delete Note",
      message: `Remove "${note.text}"?`,
      confirmLabel: "Delete",
      onConfirm: () => {
        setNotes((prev) => prev.filter((n) => n.id !== note.id));
        showToast("success", `"${note.text}" deleted`);
      },
    });
  }

  function handleOpenForm() {
    setShowAddForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <div className="font-['Inter']" style={{ padding: 20 }}>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-end gap-2.5 mb-3">
        <button
          type="button"
          onClick={handleOpenForm}
          className="rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.95] font-['Inter']"
          style={{
            width: 34,
            height: 34,
            fontSize: 20,
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

      {/* ── Info Card ── */}
      <div
        className="flex items-start gap-2.5 rounded-lg mb-4"
        style={{
          padding: "12px 16px",
          backgroundColor: "#E3F2FD",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0 mt-0.5"
        >
          <circle cx="8" cy="8" r="7" stroke="#2196F3" strokeWidth="1.4" />
          <path
            d="M8 7V11.5"
            stroke="#2196F3"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="8" cy="4.75" r="0.85" fill="#2196F3" />
        </svg>
        <p
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#0D47A1",
            lineHeight: 1.5,
          }}
        >
          Colored notes automatically flag animals when selected during data
          entry.
        </p>
      </div>

      {/* ── Notes Card ── */}
      <div className="space-y-4">
        {(() => {
          const flagOrder: { flag: NoteFlag; label: string; flagColor?: FlagColor }[] = [
            { flag: "cull", label: "Cull", flagColor: "red" },
            { flag: "production", label: "Production", flagColor: "gold" },
            { flag: "management", label: "Management", flagColor: "teal" },
            { flag: "none", label: "No Flag" },
          ];

          const groups = notes.reduce<Record<NoteFlag, QuickNote[]>>(
            (acc, n) => {
              acc[n.flag].push(n);
              return acc;
            },
            { cull: [], production: [], management: [], none: [] }
          );

          const nonEmptyGroups = flagOrder.filter((g) => groups[g.flag].length > 0);

          if (nonEmptyGroups.length === 0) {
            return (
              <div
                className="rounded-xl bg-white border border-[#D4D4D0] flex flex-col items-center justify-center"
                style={{ padding: "32px 20px" }}
              >
                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}>
                  No quick notes
                </p>
                <p className="mt-1" style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.20)" }}>
                  Tap + to create your first note
                </p>
              </div>
            );
          }

          return nonEmptyGroups.map((g) => {
            const s = FLAG_PILL_STYLES[g.flag];
            return (
              <div key={g.flag}>
                {/* Group header */}
                <div className="flex items-center gap-2.5 mb-2 px-1">
                  <div className="flex items-center gap-1.5">
                    {g.flagColor ? (
                      <FlagIcon color={g.flagColor} size="sm" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <line x1="3" y1="7" x2="11" y2="7" stroke="#D4D4D0" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                    <span
                      className="font-['Inter']"
                      style={{ fontSize: 11, fontWeight: 700, color: s.color }}
                    >
                      {g.label}
                    </span>
                  </div>
                  <div className="flex-1 h-px" style={{ backgroundColor: s.border }} />
                  <span
                    className="font-['Inter']"
                    style={{ fontSize: 10, fontWeight: 600, color: "rgba(26,26,26,0.25)" }}
                  >
                    {groups[g.flag].length}
                  </span>
                </div>

                {/* Pills */}
                <div
                  className="rounded-xl bg-white border border-[#D4D4D0]/60"
                  style={{ padding: 14 }}
                >
                  <div className="flex flex-wrap gap-2">
                    {groups[g.flag].map((note) => (
                      <NotePill
                        key={note.id}
                        note={note}
                        onDelete={() => handleDeleteNote(note)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* ── Legend ── */}
      <div className="mt-4">
        <p
          className="font-['Inter'] uppercase mb-2.5 px-1"
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "rgba(14,38,70,0.35)",
          }}
        >
          Flag Mapping
        </p>
        <div className="flex items-center gap-4 px-1">
          {/* Red = Cull */}
          <div className="flex items-center gap-1.5">
            <FlagIcon color="red" size="sm" />
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "rgba(26,26,26,0.50)",
              }}
            >
              Cull
            </span>
          </div>
          {/* Gold = Production */}
          <div className="flex items-center gap-1.5">
            <FlagIcon color="gold" size="sm" />
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "rgba(26,26,26,0.50)",
              }}
            >
              Production
            </span>
          </div>
          {/* Teal = Management */}
          <div className="flex items-center gap-1.5">
            <FlagIcon color="teal" size="sm" />
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "rgba(26,26,26,0.50)",
              }}
            >
              Management
            </span>
          </div>
          {/* No flag */}
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <line
                x1="3"
                y1="7"
                x2="11"
                y2="7"
                stroke="#D4D4D0"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "rgba(26,26,26,0.50)",
              }}
            >
              No flag
            </span>
          </div>
        </div>
      </div>

      {/* ── Add Note Form ── */}
      {showAddForm && (
        <div ref={formRef} className="mt-5">
          <AddNoteForm
            onCancel={() => setShowAddForm(false)}
            onSave={handleAdd}
          />
        </div>
      )}
    </div>
  );
}