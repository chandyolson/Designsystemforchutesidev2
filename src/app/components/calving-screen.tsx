import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { CalvingRecordCard } from "./calving-record-card";
import { useCalvingData } from "./calving-data-context";
import { SelectableCardWrapper } from "./selectable-card-wrapper";
import { SelectAllBar } from "./select-all-bar";
import { BulkActionBar } from "./bulk-action-bar";
import { useSelectMode } from "./hooks/use-select-mode";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";

/* ── Group Dropdown ────────────────────────── */
const groups = ["2026 Season", "2025 Season", "2024 Season", "Fall 2025 Embryo"];

const groupCounts: Record<string, number> = {
  "2026 Season": 23,
  "2025 Season": 64,
  "2024 Season": 71,
  "Fall 2025 Embryo": 8,
};

function GroupSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
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

  return (
    <div
      className="rounded-xl bg-white border border-[#D4D4D0]/60 px-4 font-['Inter']"
      style={{ paddingTop: 8, paddingBottom: 8 }}
    >
      {/* Label */}
      <span
        style={{ fontSize: 11, fontWeight: 600, color: "rgba(26,26,26,0.4)" }}
      >
        Group
      </span>

      {/* Dropdown trigger */}
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-2 cursor-pointer mt-0.5"
        >
          <span
            className="truncate"
            style={{ fontSize: 14, fontWeight: 600, color: "#0E2646" }}
          >
            {value}
          </span>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#55BAAA",
              }}
            >
              {groupCounts[value]} calves
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="shrink-0 transition-transform duration-200"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path
                d="M3.5 5.25L7 8.75L10.5 5.25"
                stroke="#1A1A1A"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.35}
              />
            </svg>
          </div>
        </button>

        {/* Dropdown panel */}
        {open && (
          <div
            className="absolute left-0 right-0 top-full mt-3 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-20"
            style={{ boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
          >
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  onChange(g);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0] flex items-center justify-between"
                style={{
                  fontSize: 13,
                  fontWeight: g === value ? 700 : 500,
                  color: g === value ? "#0E2646" : "#1A1A1A",
                }}
              >
                <span>{g}</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 400,
                    color: "rgba(26,26,26,0.30)",
                  }}
                >
                  {groupCounts[g]} calves
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Actions Dropdown ──────────────────────── */
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

  const items = ["Export Records", "Season Summary", "Print Report", "Import CSV"];

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
          style={{ minWidth: 185, boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
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

/* ── Screen Component ──────────────────────── */
export function CalvingScreen() {
  const [group, setGroup] = useState("2026 Season");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { records } = useCalvingData();
  const { selectMode, selectedIds, toggleSelectMode, toggleItem, toggleAll, clearSelection } = useSelectMode();
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();

  const filteredRecords = records.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.damTag.toLowerCase().includes(q) ||
      r.calfTag.toLowerCase().includes(q) ||
      r.sire.toLowerCase().includes(q) ||
      r.sex.toLowerCase().includes(q) ||
      r.notes.toLowerCase().includes(q) ||
      r.memo.toLowerCase().includes(q)
    );
  });

  const allFilteredIds = filteredRecords.map((r) => r.calfTag);

  const handleBulkFlag = () => {
    showToast("success", `Flagged ${selectedIds.size} records`);
    clearSelection();
    toggleSelectMode();
  };

  const handleBulkEdit = () => {
    showToast("info", `Editing ${selectedIds.size} records`);
  };

  const handleBulkDelete = () => {
    showDeleteConfirm({
      title: "Delete Records",
      message: `Are you sure you want to delete ${selectedIds.size} calving record${selectedIds.size > 1 ? "s" : ""}? This cannot be undone.`,
      confirmLabel: `Delete ${selectedIds.size}`,
      onConfirm: () => {
        showToast("success", `Deleted ${selectedIds.size} records`);
        clearSelection();
        toggleSelectMode();
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* ── Group Selector ── */}
      <GroupSelector value={group} onChange={setGroup} />

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
          placeholder="Search by tag, sire, notes…"
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

      {/* ── Toolbar: record count + select toggle + add/actions ── */}
      <div className="flex items-center justify-between">
        <p
          className="text-[#1A1A1A]/30 font-['Inter']"
          style={{ fontSize: 11, fontWeight: 600 }}
        >
          {filteredRecords.length} records
        </p>
        <div className="flex items-center gap-2">
          {/* Yellow (+) button */}
          <button
            type="button"
            onClick={() => navigate("/calving/new")}
            className="shrink-0 rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.95] font-['Inter'] flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
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
          />
        </div>
      </div>

      {/* ── Select All Bar (visible in select mode) ── */}
      {selectMode && (
        <SelectAllBar
          selectedCount={selectedIds.size}
          totalCount={filteredRecords.length}
          onToggleAll={() => toggleAll(allFilteredIds)}
        />
      )}

      {/* ── Calving Record Card List ── */}
      <div className={`space-y-2.5 ${selectMode && selectedIds.size > 0 ? "pb-28" : ""}`}>
        {filteredRecords.map((r) =>
          selectMode ? (
            <div
              key={`${r.damTag}-${r.calfTag}`}
              onClick={() => toggleItem(r.calfTag)}
              className="cursor-pointer"
            >
              <SelectableCardWrapper
                selected={selectedIds.has(r.calfTag)}
                onToggle={() => toggleItem(r.calfTag)}
              >
                <CalvingRecordCard
                  damTag={r.damTag}
                  calfTag={r.calfTag}
                  date={r.date}
                  sex={r.sex}
                  notes={r.notes}
                  memo={r.memo}
                />
              </SelectableCardWrapper>
            </div>
          ) : (
            <CalvingRecordCard
              key={`${r.damTag}-${r.calfTag}`}
              damTag={r.damTag}
              calfTag={r.calfTag}
              date={r.date}
              sex={r.sex}
              notes={r.notes}
              memo={r.memo}
              onClick={() => navigate(`/calving/${r.calfTag}`)}
            />
          )
        )}
      </div>

      {/* ── Load more ── */}
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
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <div className="max-w-[420px] mx-auto">
            <BulkActionBar
              selectedCount={selectedIds.size}
              itemLabel={selectedIds.size === 1 ? "record" : "records"}
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