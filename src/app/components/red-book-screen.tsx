import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { SelectableCardWrapper } from "./selectable-card-wrapper";
import { SelectAllBar } from "./select-all-bar";
import { BulkActionBar } from "./bulk-action-bar";
import { useSelectMode } from "./hooks/use-select-mode";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";

/* ═══════════════════════════════════════════
   Types & Data
   ═══════════════════════════════════════════ */
type Priority = "Low" | "Medium" | "High" | "Urgent";
type NoteCategory = "General" | "Animal" | "Maintenance" | "Expense" | "Weather" | "Other";
type ActionStatus = "Open" | "Complete" | "Won't Do";

interface RedBookEntry {
  id: string;
  title: string;
  category: NoteCategory;
  body: string;
  date: string;
  /* action item fields */
  actionRequired: boolean;
  priority?: Priority;
  assignTo?: string;
  assignToSelf?: boolean;
  status?: ActionStatus;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  Low: "#1565C0",
  Medium: "#B8860B",
  High: "#E65100",
  Urgent: "#C62828",
};

const PRIORITY_PILL_STYLES: Record<Priority, { bg: string; border: string; color: string }> = {
  Low: { bg: "#E3F2FD", border: "#1565C0", color: "#1565C0" },
  Medium: { bg: "#FFF8E1", border: "#B8860B", color: "#B8860B" },
  High: { bg: "#FFF3E0", border: "#E65100", color: "#E65100" },
  Urgent: { bg: "#FFEBEE", border: "#C62828", color: "#C62828" },
};

const CATEGORY_PILL_STYLES: Record<NoteCategory, { bg: string; color: string }> = {
  General: { bg: "rgba(14,38,70,0.08)", color: "#0E2646" },
  Animal: { bg: "#E8F5E9", color: "#2E7D32" },
  Maintenance: { bg: "#FFF3E0", color: "#E65100" },
  Expense: { bg: "#FFF8E1", color: "#B8860B" },
  Weather: { bg: "#E3F2FD", color: "#1565C0" },
  Other: { bg: "#F3E5F5", color: "#6A1B9A" },
};

const FILTER_CHIPS: string[] = ["All", "Actions", "General", "Animal", "Maintenance", "Expense"];

const entries: RedBookEntry[] = [
  {
    id: "rb1",
    title: "Fence down section 3",
    category: "Maintenance",
    body: "Found 3 posts down on the north fence line near the creek crossing. Cattle could push through. Need to repair before moving pairs.",
    date: "Feb 28, 2026",
    actionRequired: true,
    priority: "High",
    assignTo: "Mike Torres",
    assignToSelf: false,
    status: "Open",
  },
  {
    id: "rb2",
    title: "Tag 3309 feet need trimming",
    category: "Animal",
    body: "Noticed limping in south pasture, left rear hoof overgrown. Needs trimming at next working.",
    date: "Feb 27, 2026",
    actionRequired: true,
    priority: "Urgent",
    assignTo: "Me",
    assignToSelf: true,
    status: "Open",
  },
  {
    id: "rb3",
    title: "Hay delivery confirmed",
    category: "Expense",
    body: "40 round bales arriving Thursday from Johnson's. $85/bale delivered. Total: $3,400.",
    date: "Feb 26, 2026",
    actionRequired: false,
  },
  {
    id: "rb4",
    title: "Order Draxxin restock",
    category: "General",
    body: "Down to 2 bottles, need at least 6 for spring processing. Check with Valley Vet for bulk pricing.",
    date: "Feb 25, 2026",
    actionRequired: true,
    priority: "Medium",
    assignTo: "Me",
    assignToSelf: true,
    status: "Open",
  },
  {
    id: "rb5",
    title: "Water tank float broken — East Section",
    category: "Maintenance",
    body: "Tank overflowing, float valve stuck open. Replaced valve and cleaned tank. Working properly now.",
    date: "Feb 24, 2026",
    actionRequired: true,
    priority: "Medium",
    assignTo: "Mike Torres",
    assignToSelf: false,
    status: "Complete",
  },
  {
    id: "rb6",
    title: "Coyote activity near calving pasture",
    category: "General",
    body: "Spotted 3 coyotes along the tree line at dusk. Calving season starting soon — may need to set up night watch.",
    date: "Feb 23, 2026",
    actionRequired: false,
  },
  {
    id: "rb7",
    title: "Move salt blocks to south pasture",
    category: "Maintenance",
    body: "Current blocks nearly gone, need to relocate before cattle move south next week.",
    date: "Feb 22, 2026",
    actionRequired: true,
    priority: "Low",
    assignTo: "Emily Olson",
    assignToSelf: false,
    status: "Open",
  },
  {
    id: "rb8",
    title: "Check on Tag 7801 — calving soon",
    category: "Animal",
    body: "Bagged up heavy, probably within 48 hours. Keep in close pen for observation.",
    date: "Feb 21, 2026",
    actionRequired: true,
    priority: "Medium",
    assignTo: "Me",
    assignToSelf: true,
    status: "Won't Do",
  },
];

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */
function FlagIcon({ size = 16, color = "#E74C3C" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path
        d="M3 1.5V14.5M3 1.5H12L9.5 5.25L12 9H3"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <circle cx="7" cy="7" r="5" stroke="#1A1A1A" strokeOpacity="0.30" strokeWidth="1.4" />
      <path d="M11 11L14 14" stroke="#1A1A1A" strokeOpacity="0.30" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" fill="#1A1A1A" fillOpacity="0.10" />
      <path d="M5 5L9 9M9 5L5 9" stroke="#1A1A1A" strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M6 4L10 8L6 12" stroke="#1A1A1A" strokeOpacity="0.20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Status indicator icons */
function OpenCircle({ color }: { color: string }) {
  return (
    <span
      className="shrink-0 rounded-full"
      style={{ width: 12, height: 12, border: `2px solid ${color}`, display: "block" }}
    />
  );
}

function CompleteCircle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <circle cx="7" cy="7" r="6" fill="#55BAAA" />
      <path d="M4.5 7L6.25 8.75L9.5 5.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WontDoCircle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <circle cx="7" cy="7" r="6" fill="#9E9E9E" />
      <path d="M4.5 7H9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Actions Dropdown
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   Note Row
   ═══════════════════════════════════════════ */
function NoteRow({ entry, onClick }: { entry: RedBookEntry; onClick: () => void }) {
  const catStyle = CATEGORY_PILL_STYLES[entry.category] || CATEGORY_PILL_STYLES.General;

  if (entry.actionRequired && entry.priority) {
    const prioColor = PRIORITY_COLORS[entry.priority];
    const prioPill = PRIORITY_PILL_STYLES[entry.priority];

    return (
      <div
        onClick={onClick}
        className="flex items-center gap-3 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
        style={{ padding: "14px 16px", borderLeft: `3px solid ${prioColor}` }}
      >
        {/* Left content */}
        <div className="flex-1 min-w-0">
          {/* Title + priority pill */}
          <div className="flex items-center gap-2 min-w-0">
            <p
              className="truncate"
              style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.3 }}
            >
              {entry.title}
            </p>
            <span
              className="shrink-0 inline-flex items-center rounded-full font-['Inter']"
              style={{
                padding: "1px 8px",
                fontSize: 10,
                fontWeight: 700,
                backgroundColor: prioPill.bg,
                border: `1px solid ${prioPill.border}`,
                color: prioPill.color,
              }}
            >
              {entry.priority}
            </span>
          </div>

          {/* Body preview */}
          <p
            className="mt-1 truncate"
            style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.40)", lineHeight: 1.4 }}
          >
            {entry.body}
          </p>

          {/* Assignee (if not self) */}
          {!entry.assignToSelf && entry.assignTo && (
            <p className="mt-1" style={{ fontSize: 11, fontWeight: 600, color: "#55BAAA" }}>
              → {entry.assignTo}
            </p>
          )}

          {/* Category + date */}
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="inline-flex items-center rounded-full font-['Inter']"
              style={{ padding: "1px 8px", fontSize: 10, fontWeight: 700, backgroundColor: catStyle.bg, color: catStyle.color }}
            >
              {entry.category}
            </span>
            <span style={{ fontSize: 11, fontWeight: 400, color: "rgba(26,26,26,0.30)" }}>
              {entry.date}
            </span>
          </div>
        </div>

        {/* Right — status indicator */}
        <div className="shrink-0">
          {entry.status === "Complete" ? (
            <CompleteCircle />
          ) : entry.status === "Won't Do" ? (
            <WontDoCircle />
          ) : (
            <OpenCircle color={prioColor} />
          )}
        </div>
      </div>
    );
  }

  /* Regular note row */
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
      style={{ padding: "14px 16px" }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="truncate"
          style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.3 }}
        >
          {entry.title}
        </p>
        <p
          className="mt-1 truncate"
          style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.40)", lineHeight: 1.4 }}
        >
          {entry.body}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className="inline-flex items-center rounded-full font-['Inter']"
            style={{ padding: "1px 8px", fontSize: 10, fontWeight: 700, backgroundColor: catStyle.bg, color: catStyle.color }}
          >
            {entry.category}
          </span>
          <span style={{ fontSize: 11, fontWeight: 400, color: "rgba(26,26,26,0.30)" }}>
            {entry.date}
          </span>
        </div>
      </div>
      <ChevronRight />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Entry Card (select mode wrapper)
   ═══════════════════════════════════════════ */
function EntryCardWrapper({ entry, onClick }: { entry: RedBookEntry; onClick: () => void }) {
  return (
    <div className="rounded-xl bg-white overflow-hidden" style={{ border: "1px solid rgba(212,212,208,0.60)" }}>
      <NoteRow entry={entry} onClick={onClick} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCREEN
   ═══════════════════════════════════════════ */
export function RedBookScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get("filter") || "All";
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [search, setSearch] = useState("");
  const { selectMode, selectedIds, toggleSelectMode, toggleItem, toggleAll, clearSelection } = useSelectMode();
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();

  /* ── Action counts ── */
  const actionEntries = entries.filter((e) => e.actionRequired && e.status === "Open");
  const urgentCount = actionEntries.filter((e) => e.priority === "Urgent").length;
  const highCount = actionEntries.filter((e) => e.priority === "High").length;
  const mediumCount = actionEntries.filter((e) => e.priority === "Medium").length;

  /* ── Filtering ── */
  const filtered = entries.filter((entry) => {
    // Category / action filter
    if (activeFilter === "Actions") {
      if (!entry.actionRequired) return false;
    } else if (activeFilter !== "All") {
      if (entry.category !== activeFilter) return false;
    }
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !entry.title.toLowerCase().includes(q) &&
        !entry.body.toLowerCase().includes(q) &&
        !entry.category.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

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
    <div className="font-['Inter'] space-y-3">
      {/* ═══════════════════════════════
         TOOLBAR
         ═══════════════════════════════ */}
      <div className="flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => navigate("/red-book/new")}
          className="rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.95] font-['Inter']"
          style={{ width: 38, height: 38, fontSize: 22, fontWeight: 400, lineHeight: 1, color: "#1A1A1A", backgroundColor: "#F3D12A", boxShadow: "0 2px 8px rgba(243,209,42,0.30)" }}
        >
          +
        </button>
        <ActionsDropdown selectMode={selectMode} onToggleSelect={toggleSelectMode} />
      </div>

      {/* ═══════════════════════════════
         ACTION ITEMS SUMMARY BAR
         ═══════════════════════════════ */}
      {actionEntries.length > 0 && (
        <button
          type="button"
          onClick={() => setActiveFilter("Actions")}
          className="w-full rounded-xl flex items-center justify-between cursor-pointer transition-all hover:brightness-110 active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #0E2646 0%, #153566 100%)",
            padding: "14px 16px",
            border: "none",
          }}
        >
          <div className="flex items-center gap-2">
            <FlagIcon size={16} color="#E74C3C" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>
              Open Actions
            </span>
          </div>
          <div className="flex items-center gap-2">
            {urgentCount > 0 && (
              <span
                className="inline-flex items-center justify-center rounded-full font-['Inter']"
                style={{ minWidth: 22, height: 22, padding: "0 6px", fontSize: 11, fontWeight: 700, color: "#FFFFFF", backgroundColor: "#E74C3C" }}
              >
                {urgentCount}
              </span>
            )}
            {highCount > 0 && (
              <span
                className="inline-flex items-center justify-center rounded-full font-['Inter']"
                style={{ minWidth: 22, height: 22, padding: "0 6px", fontSize: 11, fontWeight: 700, color: "#FFFFFF", backgroundColor: "#E65100" }}
              >
                {highCount}
              </span>
            )}
            {mediumCount > 0 && (
              <span
                className="inline-flex items-center justify-center rounded-full font-['Inter']"
                style={{ minWidth: 22, height: 22, padding: "0 6px", fontSize: 11, fontWeight: 700, color: "#FFFFFF", backgroundColor: "#B8860B" }}
              >
                {mediumCount}
              </span>
            )}
          </div>
        </button>
      )}

      {/* ═══════════════════════════════
         FILTER CHIPS
         ═══════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTER_CHIPS.map((chip) => {
          const isActive = activeFilter === chip;
          const isActions = chip === "Actions";
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveFilter(chip)}
              className="shrink-0 rounded-full cursor-pointer transition-all duration-150 active:scale-[0.96] font-['Inter']"
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "5px 14px",
                color: isActive
                  ? isActions ? "#FFFFFF" : "#FFFFFF"
                  : "rgba(26,26,26,0.4)",
                backgroundColor: isActive
                  ? isActions ? "#E74C3C" : "#0E2646"
                  : "rgba(26,26,26,0.05)",
                border: `1.5px solid ${
                  isActive
                    ? isActions ? "#E74C3C" : "#0E2646"
                    : "transparent"
                }`,
              }}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════
         SEARCH BAR
         ═══════════════════════════════ */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#D4D4D0] rounded-xl pl-9 pr-9 font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#55BAAA] focus:ring-2 focus:ring-[#55BAAA]/20"
          style={{ height: 40, fontSize: 16, fontWeight: 400, color: "#1A1A1A" }}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ background: "none", border: "none" }}
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {/* ── Result Count ── */}
      <p className="text-[#1A1A1A]/30 font-['Inter'] px-1" style={{ fontSize: 11, fontWeight: 600 }}>
        {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
      </p>

      {/* ── Select All Bar ── */}
      {selectMode && (
        <SelectAllBar
          selectedCount={selectedIds.size}
          totalCount={filtered.length}
          onToggleAll={() => toggleAll(allFilteredIds)}
        />
      )}

      {/* ═══════════════════════════════
         NOTE LIST
         ═══════════════════════════════ */}
      {filtered.length > 0 ? (
        <div className={selectMode && selectedIds.size > 0 ? "pb-28" : ""}>
          {selectMode ? (
            <div className="space-y-2.5">
              {filtered.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => toggleItem(entry.id)}
                  className="cursor-pointer"
                >
                  <SelectableCardWrapper
                    selected={selectedIds.has(entry.id)}
                    onToggle={() => toggleItem(entry.id)}
                  >
                    <EntryCardWrapper entry={entry} onClick={() => {}} />
                  </SelectableCardWrapper>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-white overflow-hidden divide-y divide-[#D4D4D0]/40" style={{ border: "1px solid rgba(212,212,208,0.60)" }}>
              {filtered.map((entry) => (
                <NoteRow
                  key={entry.id}
                  entry={entry}
                  onClick={() => navigate(`/red-book/${entry.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          className="rounded-xl bg-white border border-[#D4D4D0]/60 flex flex-col items-center justify-center"
          style={{ padding: "40px 20px" }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-3">
            <circle cx="16" cy="16" r="14" stroke="#D4D4D0" strokeWidth="1.5" />
            <path d="M12 16H20" stroke="#D4D4D0" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}>
            No entries found
          </p>
          <p className="mt-1" style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.20)" }}>
            {search ? "Try a different search term" : "Tap + to add a note"}
          </p>
        </div>
      )}

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