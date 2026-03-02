import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { SelectableCardWrapper } from "./selectable-card-wrapper";
import { SelectAllBar } from "./select-all-bar";
import { BulkActionBar } from "./bulk-action-bar";
import { useSelectMode } from "./hooks/use-select-mode";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";

/* ── Filter Chip ── */
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full cursor-pointer transition-all duration-150 active:scale-[0.96] font-['Inter']"
      style={{
        fontSize: 12, fontWeight: 600, padding: "5px 14px",
        color: active ? "#0E2646" : "rgba(26,26,26,0.4)",
        backgroundColor: active ? "#F3D12A" : "rgba(26,26,26,0.05)",
        border: `1.5px solid ${active ? "#F3D12A" : "transparent"}`,
      }}
    >
      {label}
    </button>
  );
}

/* ── Actions Dropdown ── */
function ActionsDropdown({
  selectMode,
  onToggleSelect,
}: {
  selectMode: boolean;
  onToggleSelect: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const items = ["Export Entries", "Search All", "Print"];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.97] flex items-center justify-center"
        style={{
          width: 32,
          height: 32,
          backgroundColor: "white",
          border: "1px solid rgba(14,38,70,0.12)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="3.5" r="1.3" fill="#0E2646" />
          <circle cx="8" cy="8" r="1.3" fill="#0E2646" />
          <circle cx="8" cy="12.5" r="1.3" fill="#0E2646" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-20 font-['Inter']" style={{ minWidth: 185, boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}>
          {/* Select Mode toggle item */}
          <button
            type="button"
            onClick={() => { onToggleSelect(); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0] flex items-center gap-2.5"
            style={{ fontSize: 13, fontWeight: selectMode ? 700 : 500, color: selectMode ? "#55BAAA" : "#1A1A1A" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              {selectMode ? (
                <>
                  <rect x="1.5" y="1.5" width="11" height="11" rx="2.5" fill="#55BAAA" />
                  <path d="M4.5 7L6.25 8.75L9.5 5.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
              ) : (
                <rect x="1.75" y="1.75" width="10.5" height="10.5" rx="2.25" stroke="#0E2646" strokeOpacity="0.35" strokeWidth="1.5" />
              )}
            </svg>
            {selectMode ? "Exit Select Mode" : "Select Mode"}
          </button>

          <div className="mx-3 my-1 border-t border-[#D4D4D0]/40" />

          {/* Standard actions */}
          {items.map((item) => (
            <button key={item} type="button" onClick={() => setOpen(false)} className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]" style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Entry Data ── */
interface RedBookEntry {
  id: string;
  title: string;
  category: "Invoice/Receipt" | "Cattle Note" | "Computer Document" | "Repairs";
  body: string;
  date: string;
  pinned: boolean;
}

const categoryColors: Record<string, string> = {
  "Invoice/Receipt": "#F3D12A",
  "Cattle Note": "#55BAAA",
  "Computer Document": "#0E2646",
  "Repairs": "#E17C00",
};

const entries: RedBookEntry[] = [
  { id: "rb1", title: "Vet Invoice — February", category: "Invoice/Receipt", body: "Dr. Miller visit for preg checking 45 head. Total: $675.00. Includes mileage and supplies.", date: "Feb 26, 2026", pinned: true },
  { id: "rb2", title: "Tag 5520 Treatment Notes", category: "Cattle Note", body: "Respiratory infection suspected. Started penicillin 10cc IM daily for 5 days. Moved to sick pen.", date: "Feb 25, 2026", pinned: false },
  { id: "rb3", title: "Fence Repair — North Pasture", category: "Repairs", body: "Replaced 3 posts and 200ft of barbed wire along the north fence line near the creek crossing.", date: "Feb 24, 2026", pinned: false },
  { id: "rb4", title: "Hay Purchase Receipt", category: "Invoice/Receipt", body: "120 round bales grass hay from Johnson Ranch. $85/bale delivered. Total: $10,200.", date: "Feb 22, 2026", pinned: true },
  { id: "rb5", title: "Spring Calving Plan", category: "Cattle Note", body: "Expected 23 calves this season. First-calf heifers in Pen 2B, mature cows in North Pasture. Night checks start Mar 1.", date: "Feb 20, 2026", pinned: false },
  { id: "rb6", title: "Insurance Policy Renewal", category: "Computer Document", body: "Renewed livestock coverage with Farm Bureau. Policy #LV-482991. Premium: $3,200/year.", date: "Feb 18, 2026", pinned: false },
  { id: "rb7", title: "Water System Repair", category: "Repairs", body: "Fixed float valve on south pasture tank. Replaced pressure switch on well pump. Parts: $127.50.", date: "Feb 15, 2026", pinned: false },
];

const categories = ["All", "Invoice/Receipt", "Cattle Note", "Computer Document", "Repairs"];

/* ── Entry Card (extracted for reuse) ── */
function EntryCard({ entry }: { entry: RedBookEntry }) {
  return (
    <div
      className="rounded-xl px-4 py-4 font-['Inter'] relative"
      style={{
        background: "linear-gradient(155deg, #0E2646 0%, #163A5E 60%, #55BAAA 100%)",
      }}
    >
      {/* Pinned indicator */}
      {entry.pinned && (
        <span
          className="absolute top-3 right-3 rounded-full"
          style={{ width: 8, height: 8, backgroundColor: "#F3D12A" }}
        />
      )}

      {/* Title */}
      <p className="text-white truncate pr-4" style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>
        {entry.title}
      </p>

      {/* Category pill */}
      <span
        className="inline-block mt-2 rounded-full"
        style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
          padding: "2px 10px", lineHeight: 1.5,
          backgroundColor: categoryColors[entry.category] + "30",
          color: categoryColors[entry.category],
        }}
      >
        {entry.category.toUpperCase()}
      </span>

      {/* Body preview */}
      <p
        className="mt-2"
        style={{
          fontSize: 12, fontWeight: 400, color: "rgba(240,240,240,0.50)",
          lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}
      >
        {entry.body}
      </p>

      {/* Date */}
      <p className="mt-2" style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.30)" }}>
        {entry.date}
      </p>
    </div>
  );
}

/* ── Screen ── */
export function RedBookScreen() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const { selectMode, selectedIds, toggleSelectMode, toggleItem, toggleAll, clearSelection } = useSelectMode();
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();

  const filtered = activeCategory === "All" ? entries : entries.filter((e) => e.category === activeCategory);

  const allFilteredIds = filtered.map((e) => e.id);

  const handleBulkFlag = () => {
    showToast("success", `Flagged ${selectedIds.size} entries`);
    clearSelection();
    toggleSelectMode();
  };

  const handleBulkEdit = () => {
    showToast("info", `Editing ${selectedIds.size} entries`);
  };

  const handleBulkDelete = () => {
    showDeleteConfirm({
      title: "Delete Entries",
      message: `Are you sure you want to delete ${selectedIds.size} Red Book entr${selectedIds.size > 1 ? "ies" : "y"}? This cannot be undone.`,
      confirmLabel: `Delete ${selectedIds.size}`,
      onConfirm: () => {
        showToast("success", `Deleted ${selectedIds.size} entries`);
        clearSelection();
        toggleSelectMode();
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => navigate("/red-book/new")}
          className="rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.95] font-['Inter']"
          style={{ width: 38, height: 38, fontSize: 22, fontWeight: 400, lineHeight: 1, color: "#1A1A1A", backgroundColor: "#F3D12A", boxShadow: "0 2px 8px rgba(243,209,42,0.30)" }}
        >
          +
        </button>
        <ActionsDropdown
          selectMode={selectMode}
          onToggleSelect={toggleSelectMode}
        />
      </div>

      {/* ── Category Filters ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {categories.map((cat) => (
          <FilterChip key={cat} label={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
        ))}
      </div>

      {/* ── Result Count ── */}
      <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 11, fontWeight: 600 }}>
        {filtered.length} entries
      </p>

      {/* ── Select All Bar ── */}
      {selectMode && (
        <SelectAllBar
          selectedCount={selectedIds.size}
          totalCount={filtered.length}
          onToggleAll={() => toggleAll(allFilteredIds)}
        />
      )}

      {/* ── Entry Cards ── */}
      <div className={`space-y-2.5 ${selectMode && selectedIds.size > 0 ? "pb-28" : ""}`}>
        {filtered.map((entry) =>
          selectMode ? (
            <div
              key={entry.id}
              onClick={() => toggleItem(entry.id)}
              className="cursor-pointer"
            >
              <SelectableCardWrapper
                selected={selectedIds.has(entry.id)}
                onToggle={() => toggleItem(entry.id)}
              >
                <EntryCard entry={entry} />
              </SelectableCardWrapper>
            </div>
          ) : (
            <div
              key={entry.id}
              onClick={() => navigate(`/red-book/${entry.id}`)}
              className="cursor-pointer active:scale-[0.99] transition-transform duration-100"
            >
              <EntryCard entry={entry} />
            </div>
          )
        )}
      </div>

      {/* ── Bulk Action Bar ── */}
      {selectMode && selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <div className="max-w-[420px] mx-auto">
            <BulkActionBar
              selectedCount={selectedIds.size}
              itemLabel={selectedIds.size === 1 ? "entry" : "entries"}
              onFlag={handleBulkFlag}
              onEdit={handleBulkEdit}
              onDelete={handleBulkDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
}