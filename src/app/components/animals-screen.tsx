import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { AnimalListCard } from "./animal-list-card";
import { SelectableCardWrapper } from "./selectable-card-wrapper";
import { SelectAllBar } from "./select-all-bar";
import { BulkActionBar } from "./bulk-action-bar";
import { useSelectMode } from "./hooks/use-select-mode";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";
import { ExportFormatPicker } from "./export-format-picker";
import { useSidebarWidth } from "./sidebar-context";

/* ── Filter Chip ───────────────────────────── */
interface FilterChipProps {
  label: string;
  color: string;
  bgColor: string;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, color, bgColor, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full cursor-pointer transition-all duration-150 active:scale-[0.96] font-['Inter']"
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "5px 14px",
        color: active ? color : `${color}80`,
        backgroundColor: active ? bgColor : `${bgColor}60`,
        border: `1.5px solid ${active ? color + "30" : "transparent"}`,
      }}
    >
      {label}
    </button>
  );
}

/* ── Actions Dropdown ──────────────────────── */
function ActionsDropdown({
  selectMode,
  onToggleSelect,
  onExport,
}: {
  selectMode: boolean;
  onToggleSelect: () => void;
  onExport?: () => void;
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

  const items = ["Import", "Export", "Filter/Sort", "Edit"];

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

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-20 font-['Inter']"
          style={{
            minWidth: 185,
            boxShadow: "0 8px 24px rgba(14,38,70,0.12)",
          }}
        >
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
            <button
              key={item}
              type="button"
              onClick={() => {
                if (item === "Export" && onExport) {
                  onExport();
                }
                setOpen(false);
              }}
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

/* ── Animal Data ───────────────────────────── */
type FlagColor = "teal" | "gold" | "red";

interface Animal {
  tag: string;
  flag?: FlagColor;
  type: string;
  values: string[];
}

const allAnimals: Animal[] = [
  { tag: "4782", flag: "teal",  type: "COW",   values: ["2020", "1,247 lbs", "Normal"] },
  { tag: "3091", flag: "gold",  type: "COW",   values: ["2021", "983 lbs", "Follow-up Thurs"] },
  { tag: "5520", flag: "red",    type: "COW",   values: ["2019", "1,102 lbs", "Treatment administered"] },
  { tag: "2218", flag: "teal",  type: "COW",   values: ["2018", "1,340 lbs", "Normal"] },
  { tag: "6610", flag: "teal",  type: "COW",   values: ["2022", "1,095 lbs", "Gained well"] },
  { tag: "7801", flag: "gold",  type: "COW",   values: ["2017", "1,410 lbs", "Watch BCS"] },
  { tag: "1134", flag: "teal",  type: "HEIFER", values: ["2024", "687 lbs", "First calf"] },
  { tag: "9027", flag: "teal",  type: "BULL",  values: ["2019", "2,180 lbs", "Breeding sound"] },
  { tag: "4455", flag: "red",    type: "COW",   values: ["2020", "1,198 lbs", "Lame — right rear"] },
  { tag: "3320", flag: "teal",  type: "STEER", values: ["2023", "845 lbs", "On feed"] },
  { tag: "8812", flag: "teal",  type: "COW",   values: ["2021", "1,156 lbs", "Normal"] },
  { tag: "5501", flag: "gold",  type: "COW",   values: ["2020", "1,078 lbs", "Thin — supplement"] },
  { tag: "7744", flag: "teal",  type: "HEIFER", values: ["2024", "712 lbs", "Growing well"] },
  { tag: "2290", flag: "teal",  type: "COW",   values: ["2019", "1,290 lbs", "Normal"] },
];

/* ── Screen Component ──────────────────────── */
interface AnimalsScreenProps {
  onSelectAnimal?: (tag: string) => void;
}

export function AnimalsScreen({ onSelectAnimal }: AnimalsScreenProps) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState(true);
  const [typeFilter, setTypeFilter] = useState(true);
  const [search, setSearch] = useState("");
  const [exportPickerOpen, setExportPickerOpen] = useState(false);
  const { selectMode, selectedIds, toggleSelectMode, toggleItem, toggleAll, clearSelection } = useSelectMode();
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();
  const { sidebarWidth } = useSidebarWidth();

  /* Very simple filtering logic for demo */
  const filtered = allAnimals.filter((a) => {
    if (typeFilter && a.type !== "COW") return false;
    if (statusFilter && (a.flag === "red")) return false; // "Active" hides critical
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const matchTag = a.tag.toLowerCase().includes(q);
      const matchType = a.type.toLowerCase().includes(q);
      const matchValues = a.values.some((v) => v.toLowerCase().includes(q));
      if (!matchTag && !matchType && !matchValues) return false;
    }
    return true;
  });

  const clearFilters = () => {
    setStatusFilter(false);
    setTypeFilter(false);
  };

  const anyFilterActive = statusFilter || typeFilter;

  const allFilteredIds = filtered.map((a) => a.tag);

  const handleBulkFlag = () => {
    showToast("success", `Flagged ${selectedIds.size} animals`);
    clearSelection();
    toggleSelectMode();
  };

  const handleBulkEdit = () => {
    showToast("info", `Editing ${selectedIds.size} animals`);
  };

  const handleBulkDelete = () => {
    showDeleteConfirm({
      title: "Delete Animals",
      message: `Are you sure you want to delete ${selectedIds.size} animal${selectedIds.size > 1 ? "s" : ""}? This cannot be undone.`,
      confirmLabel: `Delete ${selectedIds.size}`,
      onConfirm: () => {
        showToast("success", `Deleted ${selectedIds.size} animals`);
        clearSelection();
        toggleSelectMode();
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* ── Search Bar ── */}
      <div
        className="flex items-center gap-2.5 rounded-xl font-['Inter']"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(14,38,70,0.10)",
          padding: "0 14px",
          height: 42,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <circle cx="7" cy="7" r="4.5" stroke="#0E2646" strokeWidth="1.5" opacity={0.25} />
          <line x1="10.5" y1="10.5" x2="13.5" y2="13.5" stroke="#0E2646" strokeWidth="1.5" strokeLinecap="round" opacity={0.25} />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by tag, type, or memo…"
          className="flex-1 bg-transparent outline-none font-['Inter'] placeholder:text-[#1A1A1A]/25"
          style={{ fontSize: 16, fontWeight: 500, color: "#1A1A1A" }}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="shrink-0 cursor-pointer flex items-center justify-center rounded-full"
            style={{ width: 18, height: 18, backgroundColor: "rgba(14,38,70,0.08)" }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" stroke="#0E2646" strokeWidth="1.3" strokeLinecap="round" opacity={0.35} />
            </svg>
          </button>
        )}
      </div>

      {/* ── Filter Chips ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <FilterChip
          label="Status: Active"
          color="#27AE60"
          bgColor="#27AE6018"
          active={statusFilter}
          onClick={() => setStatusFilter((v) => !v)}
        />
        <FilterChip
          label="Type: Cow"
          color="#2D7DD2"
          bgColor="#2D7DD218"
          active={typeFilter}
          onClick={() => setTypeFilter((v) => !v)}
        />
        {anyFilterActive && (
          <FilterChip
            label="Clear"
            color="#6B6B6B"
            bgColor="#6B6B6B12"
            active={false}
            onClick={clearFilters}
          />
        )}
      </div>

      {/* ── Result count + Toolbar Row ── */}
      <div className="flex items-center justify-between">
        <p
          className="text-[#1A1A1A]/30 font-['Inter']"
          style={{ fontSize: 11, fontWeight: 600 }}
        >
          {filtered.length} animals
        </p>
        <div className="flex items-center gap-2.5">
          {/* Yellow (+) button */}
          <button
            type="button"
            onClick={() => navigate("/animals/new")}
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

          <ActionsDropdown
            selectMode={selectMode}
            onToggleSelect={toggleSelectMode}
            onExport={() => setExportPickerOpen(true)}
          />
        </div>
      </div>

      {/* ── Select All Bar (visible in select mode) ── */}
      {selectMode && (
        <SelectAllBar
          selectedCount={selectedIds.size}
          totalCount={filtered.length}
          onToggleAll={() => toggleAll(allFilteredIds)}
        />
      )}

      {/* ── Animal Card List ── */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-2.5 ${selectMode && selectedIds.size > 0 ? "pb-28" : ""}`}>
        {filtered.map((a) =>
          selectMode ? (
            <div
              key={a.tag}
              onClick={() => toggleItem(a.tag)}
              className="cursor-pointer"
            >
              <SelectableCardWrapper
                selected={selectedIds.has(a.tag)}
                onToggle={() => toggleItem(a.tag)}
              >
                <AnimalListCard
                  tag={a.tag}
                  flag={a.flag}
                  typePill={a.type}
                  values={a.values}
                />
              </SelectableCardWrapper>
            </div>
          ) : (
            <div
              key={a.tag}
              onClick={() => navigate(`/animals/${a.tag.replace("#", "")}`)}
              className="cursor-pointer active:scale-[0.99] transition-transform duration-100"
            >
              <AnimalListCard
                tag={a.tag}
                flag={a.flag}
                typePill={a.type}
                values={a.values}
              />
            </div>
          )
        )}
      </div>

      {/* ── Load more hint ── */}
      <div className="text-center py-3">
        <span
          className="text-[#55BAAA] font-['Inter'] cursor-pointer"
          style={{ fontSize: 13, fontWeight: 600 }}
        >
          Load More
        </span>
      </div>

      {/* ── Bulk Action Bar ── */}
      {selectMode && selectedIds.size > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40"
          style={{ left: sidebarWidth > 0 ? sidebarWidth : undefined }}
        >
          <div className="max-w-[420px] md:max-w-[768px] lg:max-w-none mx-auto lg:mx-0">
            <BulkActionBar
              selectedCount={selectedIds.size}
              itemLabel={selectedIds.size === 1 ? "animal" : "animals"}
              onFlag={handleBulkFlag}
              onEdit={handleBulkEdit}
              onDelete={handleBulkDelete}
            />
          </div>
        </div>
      )}

      {/* ── Export Format Picker ── */}
      <ExportFormatPicker
        open={exportPickerOpen}
        onClose={() => setExportPickerOpen(false)}
        subtitle={selectMode && selectedIds.size > 0
          ? `${selectedIds.size} animal${selectedIds.size > 1 ? "s" : ""} selected`
          : `${filtered.length} animals`
        }
        onExport={(format, columns) => {
          showToast("success", `Exported ${format.toUpperCase()} with ${columns.length} columns`);
        }}
      />
    </div>
  );
}