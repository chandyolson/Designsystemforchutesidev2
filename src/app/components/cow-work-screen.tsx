import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { SelectModeToggle } from "./select-mode-toggle";
import { SelectableCardWrapper } from "./selectable-card-wrapper";
import { SelectAllBar } from "./select-all-bar";
import { BulkActionBar } from "./bulk-action-bar";
import { useSelectMode } from "./hooks/use-select-mode";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";

/* ── Actions Dropdown ── */
function ActionsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const items = ["Export Projects", "Archive Completed", "Print Summary"];

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
        <div
          className="absolute right-0 top-full mt-1.5 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-20 font-['Inter']"
          style={{ minWidth: 170, boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
        >
          {items.map((item) => (
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

/* ── Filter/Sort Dropdown ── */
type SortOption = "status" | "date" | "name" | "headCount";
type StatusFilter = "all" | "In Progress" | "Pending" | "Completed";

function FilterSortDropdown({
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}: {
  statusFilter: StatusFilter;
  setStatusFilter: (v: StatusFilter) => void;
  sortBy: SortOption;
  setSortBy: (v: SortOption) => void;
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

  const hasActiveFilter = statusFilter !== "all" || sortBy !== "status";

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
        <div
          className="absolute right-0 top-full mt-1.5 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-30 font-['Inter']"
          style={{ minWidth: 210, boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
        >
          {/* Filter section */}
          <div className="px-4 pt-3 pb-1.5">
            <p className="uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#1A1A1A", opacity: 0.35 }}>
              Filter by Status
            </p>
          </div>
          {(["all", "In Progress", "Pending", "Completed"] as StatusFilter[]).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { setStatusFilter(opt); }}
              className="w-full text-left px-4 py-2 cursor-pointer transition-colors hover:bg-[#F5F5F0] flex items-center gap-2.5"
              style={{ fontSize: 13, fontWeight: statusFilter === opt ? 700 : 500, color: statusFilter === opt ? "#55BAAA" : "#1A1A1A" }}
            >
              <span
                className="rounded-full border shrink-0 flex items-center justify-center"
                style={{
                  width: 14,
                  height: 14,
                  borderColor: statusFilter === opt ? "#55BAAA" : "#D4D4D0",
                  backgroundColor: statusFilter === opt ? "#55BAAA" : "transparent",
                }}
              >
                {statusFilter === opt && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {opt === "all" ? "All Statuses" : opt}
            </button>
          ))}

          {/* Divider */}
          <div className="mx-3 my-1.5 border-t border-[#D4D4D0]/40" />

          {/* Sort section */}
          <div className="px-4 pt-1.5 pb-1.5">
            <p className="uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#1A1A1A", opacity: 0.35 }}>
              Sort by
            </p>
          </div>
          {([
            { key: "status" as SortOption, label: "Status (default)" },
            { key: "date" as SortOption, label: "Date" },
            { key: "name" as SortOption, label: "Name A–Z" },
            { key: "headCount" as SortOption, label: "Head Count" },
          ]).map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => { setSortBy(opt.key); }}
              className="w-full text-left px-4 py-2 cursor-pointer transition-colors hover:bg-[#F5F5F0] flex items-center gap-2.5"
              style={{ fontSize: 13, fontWeight: sortBy === opt.key ? 700 : 500, color: sortBy === opt.key ? "#55BAAA" : "#1A1A1A" }}
            >
              <span
                className="rounded-full border shrink-0 flex items-center justify-center"
                style={{
                  width: 14,
                  height: 14,
                  borderColor: sortBy === opt.key ? "#55BAAA" : "#D4D4D0",
                  backgroundColor: sortBy === opt.key ? "#55BAAA" : "transparent",
                }}
              >
                {sortBy === opt.key && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {opt.label}
            </button>
          ))}

          {/* Reset */}
          {hasActiveFilter && (
            <>
              <div className="mx-3 my-1.5 border-t border-[#D4D4D0]/40" />
              <button
                type="button"
                onClick={() => { setStatusFilter("all"); setSortBy("status"); setOpen(false); }}
                className="w-full text-center px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
                style={{ fontSize: 12, fontWeight: 700, color: "#E74C3C" }}
              >
                Reset All
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Project Data ── */
interface Project {
  id: string;
  name: string;
  status: "Pending" | "In Progress" | "Completed";
  workType: string;
  date: string;
  headCount: number;
}

const projects: Project[] = [
  { id: "p1", name: "Spring Preg Check", status: "In Progress", workType: "PREG", date: "Feb 25, 2026", headCount: 45 },
  { id: "p2", name: "Bull BSE Testing", status: "Pending", workType: "BSE", date: "Mar 3, 2026", headCount: 8 },
  { id: "p3", name: "Weaning Processing", status: "Completed", workType: "WN", date: "Feb 20, 2026", headCount: 31 },
  { id: "p4", name: "Heifer AI Breeding", status: "Pending", workType: "AI", date: "Mar 10, 2026", headCount: 22 },
  { id: "p5", name: "Pre-Sale Processing", status: "In Progress", workType: "SALE", date: "Feb 27, 2026", headCount: 18 },
  { id: "p6", name: "Fall Vaccination", status: "Completed", workType: "PROCESS", date: "Feb 15, 2026", headCount: 64 },
  { id: "p7", name: "Treatment — Pen 1C", status: "In Progress", workType: "TX", date: "Feb 26, 2026", headCount: 3 },
];

/* Status pill colors */
const statusPillStyles: Record<string, { color: string; bg: string }> = {
  "In Progress": { color: "#FFFFFF", bg: "#9B2335" },
  "Pending":     { color: "#FFFFFF", bg: "#4DC9B0" },
  "Completed":   { color: "rgba(240,240,240,0.5)", bg: "rgba(240,240,240,0.08)" },
};

const workTypeColors: Record<string, string> = {
  "In Progress": "#9B2335",
  "Pending":     "#4DC9B0",
  "Completed":   "rgba(240,240,240,0.35)",
};

const statusOrder: Record<string, number> = {
  "In Progress": 0,
  "Pending": 1,
  "Completed": 2,
};

/* ── Project Card (extracted for reuse) ── */
function ProjectCard({ p }: { p: Project }) {
  const pill = statusPillStyles[p.status];
  const dotColor = workTypeColors[p.status];
  return (
    <div className="rounded-xl px-4 py-3.5 font-['Inter']" style={{ backgroundColor: "#0E2646" }}>
      {/* Row 1 — Name + Status pill */}
      <div className="flex items-center justify-between gap-3">
        <span
          className="truncate"
          style={{ fontSize: 16, fontWeight: 600, color: "#F0F0F0", lineHeight: 1.3 }}
        >
          {p.name}
        </span>
        <span
          className="shrink-0 rounded-full"
          style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
            padding: "3px 10px", lineHeight: 1.3,
            color: pill.color,
            backgroundColor: pill.bg,
          }}
        >
          {p.status.toUpperCase()}
        </span>
      </div>

      {/* Row 2 — Dot-separated values */}
      <p className="mt-1.5 truncate" style={{ fontSize: 13, fontWeight: 400, color: "rgba(240,240,240,0.45)", lineHeight: 1.4 }}>
        <span style={{ color: dotColor }}>{p.workType}</span>
        {"  ·  "}
        {p.date}
        {"  ·  "}
        {p.headCount} head
      </p>
    </div>
  );
}

/* ── Screen ── */
export function CowWorkScreen() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("status");
  const [search, setSearch] = useState("");
  const { selectMode, selectedIds, toggleSelectMode, toggleItem, toggleAll, clearSelection } = useSelectMode();
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();

  const filteredSorted = useMemo(() => {
    let list = [...projects];

    /* Search */
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.workType.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q)
      );
    }

    /* Filter */
    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }

    /* Sort */
    switch (sortBy) {
      case "status":
        list.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        break;
      case "date":
        list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "headCount":
        list.sort((a, b) => b.headCount - a.headCount);
        break;
    }

    return list;
  }, [statusFilter, sortBy, search]);

  const allFilteredIds = filteredSorted.map((p) => p.id);

  const handleBulkFlag = () => {
    showToast("success", `Flagged ${selectedIds.size} projects`);
    clearSelection();
    toggleSelectMode();
  };

  const handleBulkEdit = () => {
    showToast("info", `Editing ${selectedIds.size} projects`);
  };

  const handleBulkDelete = () => {
    showDeleteConfirm({
      title: "Delete Projects",
      message: `Are you sure you want to delete ${selectedIds.size} project${selectedIds.size > 1 ? "s" : ""}? This cannot be undone.`,
      confirmLabel: `Delete ${selectedIds.size}`,
      onConfirm: () => {
        showToast("success", `Deleted ${selectedIds.size} projects`);
        clearSelection();
        toggleSelectMode();
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* ── Toolbar Row ── */}
      <div className="flex items-center justify-end gap-2.5">
        <SelectModeToggle active={selectMode} onToggle={toggleSelectMode} />
        <button
          type="button"
          onClick={() => navigate("/cow-work/new")}
          className="rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.95] font-['Inter']"
          style={{
            width: 38, height: 38, fontSize: 22, fontWeight: 400, lineHeight: 1,
            color: "#1A1A1A", backgroundColor: "#F3D12A",
            boxShadow: "0 2px 8px rgba(243,209,42,0.30)",
          }}
        >
          +
        </button>
        <FilterSortDropdown
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <ActionsDropdown />
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <circle cx="7" cy="7" r="4.5" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.5" />
          <path d="M10.5 10.5L13.5 13.5" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, type, or status…"
          className="w-full h-[40px] pl-9 pr-3 rounded-xl bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
          style={{ fontSize: 16, fontWeight: 400 }}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Active filter chips ── */}
      {(statusFilter !== "all") && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className="shrink-0 rounded-full cursor-pointer transition-all duration-150 active:scale-[0.96] font-['Inter'] flex items-center gap-1.5"
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: "5px 14px",
              color: "#55BAAA",
              backgroundColor: "rgba(85,186,170,0.08)",
              border: "1.5px solid rgba(85,186,170,0.25)",
            }}
          >
            Status: {statusFilter}
            <span style={{ fontSize: 14, lineHeight: 1, opacity: 0.5 }}>×</span>
          </button>
        </div>
      )}

      {/* ── Result Count ── */}
      <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 11, fontWeight: 600 }}>
        {filteredSorted.length} project{filteredSorted.length !== 1 ? "s" : ""}
      </p>

      {/* ── Select All Bar ── */}
      {selectMode && (
        <SelectAllBar
          selectedCount={selectedIds.size}
          totalCount={filteredSorted.length}
          onToggleAll={() => toggleAll(allFilteredIds)}
        />
      )}

      {/* ── Project Cards ── */}
      <div className={`space-y-3.5 ${selectMode && selectedIds.size > 0 ? "pb-28" : ""}`}>
        {filteredSorted.map((p) =>
          selectMode ? (
            <div
              key={p.id}
              onClick={() => toggleItem(p.id)}
              className="cursor-pointer"
            >
              <SelectableCardWrapper
                selected={selectedIds.has(p.id)}
                onToggle={() => toggleItem(p.id)}
              >
                <ProjectCard p={p} />
              </SelectableCardWrapper>
            </div>
          ) : (
            <div
              key={p.id}
              onClick={() => navigate(`/cow-work/${p.id}`)}
              className="cursor-pointer active:scale-[0.99] transition-transform duration-100"
            >
              <ProjectCard p={p} />
            </div>
          )
        )}
      </div>

      {/* ── Empty state ── */}
      {filteredSorted.length === 0 && (
        <div className="text-center py-8">
          <p className="font-['Inter']" style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", opacity: 0.3 }}>
            No projects match your filters
          </p>
          <button
            type="button"
            onClick={() => { setStatusFilter("all"); setSortBy("status"); }}
            className="mt-2 font-['Inter'] cursor-pointer"
            style={{ fontSize: 13, fontWeight: 600, color: "#55BAAA" }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ── Load More ── */}
      {filteredSorted.length > 0 && (
        <div className="text-center py-3">
          <span className="text-[#55BAAA] font-['Inter'] cursor-pointer" style={{ fontSize: 13, fontWeight: 600 }}>
            Load More
          </span>
        </div>
      )}

      {/* ── Bulk Action Bar ── */}
      {selectMode && selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <div className="max-w-[420px] mx-auto">
            <BulkActionBar
              selectedCount={selectedIds.size}
              itemLabel={selectedIds.size === 1 ? "project" : "projects"}
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
