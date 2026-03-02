import { useState, useRef, useEffect } from "react";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";

/* ── Types ── */
type NoteCategory = "Calving Notes" | "Cow Work Notes" | "General Notes";

interface NoteItem {
  id: string;
  text: string;
  category: NoteCategory;
}

/* ── Category display order ── */
const CATEGORIES: NoteCategory[] = ["Calving Notes", "Cow Work Notes", "General Notes"];
const CATEGORY_OPTIONS = CATEGORIES as unknown as string[];

/* ── Mock data ── */
const initialNotes: NoteItem[] = [
  { id: "n1", text: "Normal birth", category: "Calving Notes" },
  { id: "n2", text: "Assisted", category: "Calving Notes" },
  { id: "n3", text: "C-section", category: "Calving Notes" },
  { id: "n4", text: "Stillborn", category: "Calving Notes" },
  { id: "n5", text: "Weak calf", category: "Calving Notes" },
  { id: "n6", text: "Scours", category: "Calving Notes" },
  { id: "n7", text: "Retained placenta", category: "Calving Notes" },
  { id: "n8", text: "Twins", category: "Calving Notes" },
  { id: "n9", text: "Healthy", category: "Cow Work Notes" },
  { id: "n10", text: "Lame", category: "Cow Work Notes" },
  { id: "n11", text: "Thin", category: "Cow Work Notes" },
  { id: "n12", text: "Open", category: "Cow Work Notes" },
  { id: "n13", text: "Aggressive", category: "Cow Work Notes" },
  { id: "n14", text: "Poor teeth", category: "Cow Work Notes" },
  { id: "n15", text: "Docile", category: "General Notes" },
  { id: "n16", text: "Good mother", category: "General Notes" },
  { id: "n17", text: "Poor mother", category: "General Notes" },
  { id: "n18", text: "Hard keeper", category: "General Notes" },
];

/* ── Icons ── */
function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3.5" r="1.25" fill="#0E2646" fillOpacity="0.45" />
      <circle cx="8" cy="8" r="1.25" fill="#0E2646" fillOpacity="0.45" />
      <circle cx="8" cy="12.5" r="1.25" fill="#0E2646" fillOpacity="0.45" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3.75V14.25M3.75 9H14.25" stroke="#0E2646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown({ rotated }: { rotated?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0 transition-transform duration-200"
      style={{ transform: rotated ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#0E2646" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity={0.25} />
    </svg>
  );
}

/* ── Actions dropdown ── */
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
        style={{ width: 32, height: 38 }}
        aria-label="Actions"
      >
        <DotsIcon />
      </button>
      {open && (
        <div className="absolute right-0 top-[42px] z-20 w-44 rounded-xl bg-white border border-[#D4D4D0] shadow-lg overflow-hidden font-['Inter']">
          {["Select Mode", "Export List", "Sort A–Z"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setOpen(false)}
              className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
              style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════ Note Pill ═══════════════ */
function NotePill({
  note,
  onDelete,
}: {
  note: NoteItem;
  onDelete: () => void;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#D4D4D0] font-['Inter'] transition-colors hover:bg-[#F5F5F0] group"
      style={{ padding: "6px 14px", fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}
    >
      {note.text}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="flex items-center justify-center cursor-pointer rounded-full transition-colors hover:bg-[#E74C3C]/10 shrink-0"
        style={{ width: 14, height: 14 }}
        aria-label={`Delete "${note.text}"`}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="#1A1A1A" strokeOpacity="0.30" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}

/* ═══════════════ Category Section ═══════════════ */
function CategorySection({
  category,
  notes,
  defaultOpen,
  onDeleteNote,
}: {
  category: NoteCategory;
  notes: NoteItem[];
  defaultOpen: boolean;
  onDeleteNote: (note: NoteItem) => void;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="mb-5">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-2.5 px-1 cursor-pointer"
      >
        <p
          className="text-[#0E2646] font-['Inter'] uppercase"
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", opacity: 0.35 }}
        >
          {category}
        </p>
        <div className="flex items-center gap-1.5">
          <span
            className="font-['Inter'] text-[#0E2646]/25"
            style={{ fontSize: 10, fontWeight: 600 }}
          >
            {notes.length}
          </span>
          <ChevronDown rotated={isOpen} />
        </div>
      </button>

      {/* Pill grid */}
      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: isOpen ? 500 : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="flex flex-wrap gap-2">
          {notes.map((note) => (
            <NotePill
              key={note.id}
              note={note}
              onDelete={() => onDeleteNote(note)}
            />
          ))}
          {notes.length === 0 && (
            <p
              className="font-['Inter'] px-1"
              style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.30)" }}
            >
              No notes in this category
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ Add Note Form ═══════════════ */
function AddNoteForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (data: { text: string; category: NoteCategory }) => void;
}) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [textError, setTextError] = useState("");

  function handleSave() {
    if (!text.trim()) {
      setTextError("Note text is required");
      return;
    }
    setTextError("");
    onSave({
      text: text.trim(),
      category: (category || "General Notes") as NoteCategory,
    });
  }

  return (
    <div>
      <p
        className="font-['Inter'] uppercase mb-2 px-1"
        style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#0E2646" }}
      >
        Add Note
      </p>

      <div
        className="bg-white rounded-xl border border-[#D4D4D0]/60 font-['Inter']"
        style={{ padding: 16 }}
      >
        <div className="space-y-3">
          <FormFieldRow
            label="Note Text"
            placeholder="e.g. Prolapse"
            value={text}
            onChange={setText}
            required
            error={textError}
          />
          <FormSelectRow
            label="Category"
            placeholder="Select category"
            value={category}
            onChange={setCategory}
            options={CATEGORY_OPTIONS}
          />
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

/* ══════════════════ SCREEN ══════════════════ */
export function ReferenceQuickNotesScreen() {
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [showAddForm, setShowAddForm] = useState(false);
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();

  function handleAdd(data: { text: string; category: NoteCategory }) {
    // Duplicate check
    const exists = notes.some(
      (n) => n.text.toLowerCase() === data.text.toLowerCase() && n.category === data.category
    );
    if (exists) {
      showToast("error", `"${data.text}" already exists in ${data.category}`);
      return;
    }
    const newNote: NoteItem = {
      ...data,
      id: `n${Date.now()}`,
    };
    setNotes((prev) => [...prev, newNote]);
    setShowAddForm(false);
    showToast("success", `"${data.text}" added to ${data.category}`);
  }

  function handleDeleteNote(note: NoteItem) {
    showDeleteConfirm({
      title: "Delete Note",
      message: `Remove "${note.text}" from ${note.category}?`,
      confirmLabel: "Delete",
      onConfirm: () => {
        setNotes((prev) => prev.filter((n) => n.id !== note.id));
        showToast("success", `"${note.text}" deleted`);
      },
    });
  }

  // Group notes by category
  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    notes: notes.filter((n) => n.category === cat),
  }));

  return (
    <div className="font-['Inter']" style={{ padding: 20 }}>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-end gap-2.5 mb-4">
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center cursor-pointer rounded-lg transition-colors hover:brightness-95"
          style={{
            width: 38,
            height: 38,
            backgroundColor: "#F3D12A",
            border: "none",
          }}
          aria-label="Add note"
        >
          <PlusIcon />
        </button>
        <ActionsDropdown />
      </div>

      {/* ── Category Sections ── */}
      {grouped.map((group, idx) => (
        <CategorySection
          key={group.category}
          category={group.category}
          notes={group.notes}
          defaultOpen={idx === 0}
          onDeleteNote={handleDeleteNote}
        />
      ))}

      {/* ── Inline Add Form ── */}
      {showAddForm && (
        <div className="mt-2">
          <AddNoteForm
            onCancel={() => setShowAddForm(false)}
            onSave={handleAdd}
          />
        </div>
      )}
    </div>
  );
}
