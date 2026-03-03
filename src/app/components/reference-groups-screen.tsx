import { useState } from "react";
import { useNavigate } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { useToast } from "./toast-context";

/* ══════════════════════════════════════════
   Types & Data
   ══════════════════════════════════════════ */
type GroupType = "Season" | "Management" | "Custom";
type GroupStatus = "Active" | "Inactive";

interface GroupItem {
  id: string;
  name: string;
  type: GroupType;
  dateRange: string;
  headCount: number;
  status: GroupStatus;
}

const initialGroups: GroupItem[] = [
  { id: "g1", name: "2026 Spring Calving", type: "Season", dateRange: "Jan 2026 – May 2026", headCount: 87, status: "Active" },
  { id: "g2", name: "2026 Fall Heifers", type: "Season", dateRange: "Aug 2026 – Dec 2026", headCount: 24, status: "Active" },
  { id: "g3", name: "North Pasture Pairs", type: "Management", dateRange: "Active since Apr 2025", headCount: 34, status: "Active" },
  { id: "g4", name: "Replacement Heifers", type: "Management", dateRange: "Active since Nov 2025", headCount: 18, status: "Active" },
  { id: "g5", name: "Fall Bulls", type: "Management", dateRange: "Sep 2025 – Present", headCount: 12, status: "Active" },
  { id: "g6", name: "2025 Calves", type: "Season", dateRange: "Mar 2025 – Oct 2025", headCount: 45, status: "Inactive" },
];

/* ══════════════════════════════════════════
   Type Pill Colors
   ══════════════════════════════════════════ */
const TYPE_COLORS: Record<GroupType, { color: string; bg: string }> = {
  Season: { color: "#1565C0", bg: "#E3F2FD" },
  Management: { color: "#55BAAA", bg: "rgba(85,186,170,0.10)" },
  Custom: { color: "#6A1B9A", bg: "#F3E5F5" },
};

/* ══════════════════════════════════════════
   Icons
   ══════════════════════════════════════════ */
function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3.75V14.25M3.75 9H14.25" stroke="#0E2646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="#0E2646" strokeOpacity="0.2" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   Type Pill
   ══════════════════════════════════════════ */
function TypePill({ type }: { type: GroupType }) {
  const colors = TYPE_COLORS[type];
  return (
    <span
      className="inline-flex items-center rounded-full font-['Inter']"
      style={{
        padding: "1px 8px",
        fontSize: 10,
        fontWeight: 700,
        color: colors.color,
        backgroundColor: colors.bg,
      }}
    >
      {type}
    </span>
  );
}

/* ══════════════════════════════════════════
   Inactive Pill
   ══════════════════════════════════════════ */
function InactivePill() {
  return (
    <span
      className="inline-flex items-center rounded-full font-['Inter']"
      style={{
        padding: "1px 8px",
        fontSize: 10,
        fontWeight: 700,
        color: "#E65100",
        backgroundColor: "#FFF3E0",
      }}
    >
      Inactive
    </span>
  );
}

/* ══════════════════════════════════════════
   Head Count Badge
   ══════════════════════════════════════════ */
function HeadCountBadge({ count }: { count: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-['Inter']"
      style={{
        minWidth: 32,
        height: 22,
        padding: "0 8px",
        fontSize: 11,
        fontWeight: 700,
        color: "#FFFFFF",
        backgroundColor: "#0E2646",
      }}
    >
      {count}
    </span>
  );
}

/* ══════════════════════════════════════════
   Group Row
   ══════════════════════════════════════════ */
function GroupRow({
  group,
  onTap,
}: {
  group: GroupItem;
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      className="w-full flex items-center justify-between gap-3 cursor-pointer transition-colors active:bg-[#F5F5F0] text-left font-['Inter']"
      style={{ padding: "14px 16px" }}
    >
      {/* Left side */}
      <div className="min-w-0 flex-1">
        <p
          className="truncate"
          style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.4 }}
        >
          {group.name}
        </p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <TypePill type={group.type} />
          {group.status === "Inactive" && <InactivePill />}
          <span
            className="truncate"
            style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.40)" }}
          >
            {group.dateRange}
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 shrink-0">
        <HeadCountBadge count={group.headCount} />
        <ChevronRight />
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════
   Filter Chips
   ══════════════════════════════════════════ */
type FilterValue = "All" | "Season" | "Management" | "Custom";

function FilterChips({
  active,
  onChange,
}: {
  active: FilterValue;
  onChange: (v: FilterValue) => void;
}) {
  const chips: FilterValue[] = ["All", "Season", "Management", "Custom"];
  return (
    <div className="flex items-center gap-2 mb-4">
      {chips.map((chip) => {
        const isActive = active === chip;
        return (
          <button
            key={chip}
            type="button"
            onClick={() => onChange(chip)}
            className="rounded-full cursor-pointer font-['Inter'] transition-all"
            style={{
              height: 32,
              padding: "0 14px",
              fontSize: 12,
              fontWeight: 600,
              backgroundColor: isActive ? "#0E2646" : "#FFFFFF",
              color: isActive ? "#FFFFFF" : "#1A1A1A",
              border: isActive ? "none" : "1px solid #D4D4D0",
            }}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════
   Add Group Form
   ══════════════════════════════════════════ */
function AddGroupForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (data: Omit<GroupItem, "id" | "headCount">) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<string>("Active");
  const [nameError, setNameError] = useState("");

  function handleSave() {
    if (!name.trim()) {
      setNameError("Group name is required");
      return;
    }
    setNameError("");

    const resolvedType = (type || "Custom") as GroupType;
    let dateRange = "";
    if (startDate && endDate) {
      dateRange = `${startDate} – ${endDate}`;
    } else if (startDate) {
      dateRange = `Active since ${startDate}`;
    } else {
      dateRange = "No dates set";
    }

    onSave({
      name: name.trim(),
      type: resolvedType,
      dateRange,
      status: (status || "Active") as GroupStatus,
    });
  }

  return (
    <div>
      <p
        className="font-['Inter'] uppercase mb-2 px-1"
        style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(14,38,70,0.35)" }}
      >
        Add Group
      </p>

      <div
        className="bg-white rounded-xl border border-[#D4D4D0]/60 font-['Inter']"
        style={{ padding: 16 }}
      >
        <div className="space-y-3">
          <FormFieldRow
            label="Name"
            placeholder="Group name"
            value={name}
            onChange={setName}
            required
            error={nameError}
          />
          <FormSelectRow
            label="Type"
            placeholder="Select type"
            value={type}
            onChange={setType}
            options={["Season", "Management", "Custom"]}
          />
          <FormFieldRow
            label="Start Date"
            placeholder="e.g. Jan 2026"
            value={startDate}
            onChange={setStartDate}
          />
          <FormFieldRow
            label="End Date"
            placeholder="Optional"
            value={endDate}
            onChange={setEndDate}
          />
          <FormSelectRow
            label="Status"
            placeholder="Select status"
            value={status}
            onChange={setStatus}
            options={["Active", "Inactive"]}
          />
        </div>

        {/* Action buttons */}
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
export function ReferenceGroupsScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [groups, setGroups] = useState<GroupItem[]>(initialGroups);
  const [filter, setFilter] = useState<FilterValue>("All");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  /* ── Filtering ── */
  const filteredGroups = (() => {
    let list = filter === "All" ? groups : groups.filter((g) => g.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.type.toLowerCase().includes(q) ||
          g.dateRange.toLowerCase().includes(q)
      );
    }
    return list;
  })();

  /* ── Handlers ── */
  function handleAdd(data: Omit<GroupItem, "id" | "headCount">) {
    const newGroup: GroupItem = {
      ...data,
      id: `g${Date.now()}`,
      headCount: 0,
    };
    setGroups((prev) => [...prev, newGroup]);
    setShowAddForm(false);
    showToast("success", `"${data.name}" added`);
  }

  function handleRowTap(group: GroupItem) {
    // Navigate to group detail (placeholder for now)
    navigate(`/reference/groups/${group.id}`);
  }

  return (
    <div className="font-['Inter']" style={{ padding: 20 }}>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-end mb-4">
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center cursor-pointer rounded-lg transition-colors hover:brightness-95"
          style={{
            width: 34,
            height: 34,
            backgroundColor: "#F3D12A",
            border: "none",
          }}
          aria-label="Add group"
        >
          <PlusIcon />
        </button>
      </div>

      {/* ── Filter Chips ── */}
      <FilterChips active={filter} onChange={setFilter} />

      {/* ── Search Bar ── */}
      <div className="relative mb-4">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <circle cx="7" cy="7" r="5" stroke="#1A1A1A" strokeOpacity="0.30" strokeWidth="1.4" />
            <path d="M11 11L14 14" stroke="#1A1A1A" strokeOpacity="0.30" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search groups..."
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
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" fill="#1A1A1A" fillOpacity="0.10" />
              <path d="M5 5L9 9M9 5L5 9" stroke="#1A1A1A" strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Result Count ── */}
      <p className="text-[#1A1A1A]/30 font-['Inter'] px-1 mb-3" style={{ fontSize: 11, fontWeight: 600 }}>
        {filteredGroups.length} {filteredGroups.length === 1 ? "group" : "groups"}
      </p>

      {/* ── List Card ── */}
      <div className="rounded-xl bg-white border border-[#D4D4D0] overflow-hidden divide-y divide-[#D4D4D0]/40">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <GroupRow
              key={group.id}
              group={group}
              onTap={() => handleRowTap(group)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center" style={{ padding: "32px 20px" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}>
              No groups found
            </p>
            <p className="mt-1 text-center" style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.20)" }}>
              {search.trim()
                ? "Try a different search term"
                : filter !== "All"
                  ? `No ${filter.toLowerCase()} groups yet`
                  : "Tap + to create your first group"}
            </p>
          </div>
        )}
      </div>

      {/* ── Inline Add Form ── */}
      {showAddForm && (
        <div className="mt-6">
          <AddGroupForm
            onCancel={() => setShowAddForm(false)}
            onSave={handleAdd}
          />
        </div>
      )}
    </div>
  );
}