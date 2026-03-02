import { useState, useRef, useEffect, useCallback } from "react";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";

/* ── Types ── */
type GroupType = "Season" | "Management" | "Custom";

interface GroupItem {
  id: string;
  name: string;
  type: GroupType;
  dateRange: string;
  headCount: number;
}

/* ── Mock data ── */
const initialGroups: GroupItem[] = [
  { id: "g1", name: "2026 Spring Calving", type: "Season", dateRange: "Mar to Jun 2026", headCount: 47 },
  { id: "g2", name: "2025 Fall Calving", type: "Season", dateRange: "Sep to Dec 2025", headCount: 31 },
  { id: "g3", name: "Replacement Heifers", type: "Management", dateRange: "Ongoing", headCount: 22 },
  { id: "g4", name: "Bulls", type: "Management", dateRange: "Ongoing", headCount: 8 },
  { id: "g5", name: "2025 Spring Calving", type: "Season", dateRange: "Mar to Jun 2025", headCount: 52 },
  { id: "g6", name: "Sale Pen", type: "Custom", dateRange: "Feb 2026", headCount: 18 },
];

/* ── Pill color map per type ── */
const TYPE_COLORS: Record<GroupType, { color: string; bg: string }> = {
  Season: { color: "#55BAAA", bg: "rgba(85,186,170,0.10)" },
  Management: { color: "#5B8DEF", bg: "rgba(91,141,239,0.10)" },
  Custom: { color: "#D4A054", bg: "rgba(212,160,84,0.10)" },
};

/* ── Type Pill ── */
function TypePill({ type }: { type: GroupType }) {
  const colors = TYPE_COLORS[type] || TYPE_COLORS.Custom;
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

/* ── Chevron icon ── */
function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="#0E2646" strokeOpacity="0.2" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── 3-dot icon ── */
function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3.5" r="1.25" fill="#0E2646" fillOpacity="0.45" />
      <circle cx="8" cy="8" r="1.25" fill="#0E2646" fillOpacity="0.45" />
      <circle cx="8" cy="12.5" r="1.25" fill="#0E2646" fillOpacity="0.45" />
    </svg>
  );
}

/* ── Plus icon ── */
function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3.75V14.25M3.75 9H14.25" stroke="#0E2646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Trash icon ── */
function TrashIcon({ size = 16, color = "#9B2335" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
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
          {["Select Mode", "Export List", "Sort by Name"].map((item) => (
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

/* ═══════════════ Swipeable Row ═══════════════ */
const SWIPE_THRESHOLD = 72;
const DELETE_ZONE = 64;

function SwipeableGroupRow({
  group,
  onTap,
  onDelete,
}: {
  group: GroupItem;
  onTap: () => void;
  onDelete: () => void;
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const rowRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = 0;
    setSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swiping) return;
    const diff = startXRef.current - e.touches[0].clientX;
    currentXRef.current = diff;
    // Only allow swiping left, clamp at DELETE_ZONE + some overshoot
    const clamped = Math.max(0, Math.min(diff, DELETE_ZONE + 20));
    setOffsetX(clamped);
  }, [swiping]);

  const handleTouchEnd = useCallback(() => {
    setSwiping(false);
    if (currentXRef.current >= SWIPE_THRESHOLD) {
      // Snap to reveal delete
      setOffsetX(DELETE_ZONE);
    } else {
      setOffsetX(0);
    }
  }, []);

  // Close swipe on outside tap
  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (offsetX > 0 && rowRef.current && !rowRef.current.contains(e.target as Node)) {
        setOffsetX(0);
      }
    }
    if (offsetX > 0) {
      document.addEventListener("touchstart", handleOutside, true);
      document.addEventListener("mousedown", handleOutside, true);
    }
    return () => {
      document.removeEventListener("touchstart", handleOutside, true);
      document.removeEventListener("mousedown", handleOutside, true);
    };
  }, [offsetX]);

  const isRevealed = offsetX >= DELETE_ZONE;

  return (
    <div ref={rowRef} className="relative overflow-hidden">
      {/* Delete zone behind */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center"
        style={{ width: DELETE_ZONE, backgroundColor: "#9B2335" }}
      >
        <button
          type="button"
          onClick={() => {
            setOffsetX(0);
            onDelete();
          }}
          className="flex flex-col items-center justify-center gap-0.5 cursor-pointer w-full h-full"
          aria-label="Delete group"
        >
          <TrashIcon size={18} color="#FFFFFF" />
          <span className="font-['Inter']" style={{ fontSize: 10, fontWeight: 600, color: "#FFFFFF" }}>
            Delete
          </span>
        </button>
      </div>

      {/* Row content slides */}
      <div
        className="relative bg-white transition-transform"
        style={{
          transform: `translateX(-${offsetX}px)`,
          transitionDuration: swiping ? "0ms" : "200ms",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={() => {
            if (isRevealed) {
              setOffsetX(0);
            } else if (currentXRef.current < 5) {
              onTap();
            }
          }}
          className="w-full flex items-center justify-between gap-3 cursor-pointer transition-colors hover:bg-[#F5F5F0] text-left"
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
            <div className="flex items-center gap-2 mt-1">
              <TypePill type={group.type} />
              <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.40)" }}>
                {group.dateRange}
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(14,38,70,0.25)" }}>
              {group.headCount}
            </span>
            <ChevronRight />
          </div>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════ Group Form (shared Add/Edit) ═══════════════ */
function GroupForm({
  title,
  initial,
  onCancel,
  onSave,
  saveLabel = "Save",
}: {
  title: string;
  initial?: Partial<GroupItem>;
  onCancel: () => void;
  onSave: (data: { name: string; type: GroupType; dateRange: string }) => void;
  saveLabel?: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<string>(initial?.type ?? "");
  const [startDate, setStartDate] = useState(() => {
    if (!initial?.dateRange) return "";
    const dr = initial.dateRange;
    if (dr === "Ongoing") return "";
    const parts = dr.split(" to ");
    return parts[0] ?? "";
  });
  const [endDate, setEndDate] = useState(() => {
    if (!initial?.dateRange) return "";
    const dr = initial.dateRange;
    if (dr === "Ongoing") return "";
    const parts = dr.split(" to ");
    return parts[1] ?? "";
  });
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");

  function handleSave() {
    if (!name.trim()) {
      setNameError("Group name is required");
      return;
    }
    setNameError("");
    onSave({
      name: name.trim(),
      type: (type || "Custom") as GroupType,
      dateRange: endDate ? `${startDate} to ${endDate}` : startDate || "Ongoing",
    });
  }

  return (
    <div>
      <p
        className="font-['Inter'] uppercase mb-2 px-1"
        style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#0E2646" }}
      >
        {title}
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
            placeholder="e.g. Mar 2026"
            value={startDate}
            onChange={setStartDate}
          />
          <FormFieldRow
            label="End Date"
            placeholder="Optional"
            value={endDate}
            onChange={setEndDate}
          />
          <div className="flex items-start gap-3">
            <label
              className="shrink-0 text-[#1A1A1A] font-['Inter']"
              style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
            >
              Description
            </label>
            <textarea
              placeholder="Optional notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 resize-none"
              style={{ fontSize: 16, fontWeight: 400, minHeight: 72 }}
            />
          </div>
        </div>

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
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ SCREEN ══════════════════ */
export function ReferenceGroupsScreen() {
  const [groups, setGroups] = useState<GroupItem[]>(initialGroups);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();

  function handleAddGroup(data: { name: string; type: GroupType; dateRange: string }) {
    const newGroup: GroupItem = {
      ...data,
      id: `g${Date.now()}`,
      headCount: 0,
    };
    setGroups((prev) => [...prev, newGroup]);
    setShowAddForm(false);
    showToast("success", `"${data.name}" added`);
  }

  function handleEditGroup(id: string, data: { name: string; type: GroupType; dateRange: string }) {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...data } : g))
    );
    setEditingId(null);
    showToast("success", `"${data.name}" updated`);
  }

  function handleDeleteGroup(group: GroupItem) {
    showDeleteConfirm({
      title: "Delete Group",
      message: `Are you sure you want to delete "${group.name}"? This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        setGroups((prev) => prev.filter((g) => g.id !== group.id));
        showToast("success", `"${group.name}" deleted`);
      },
    });
  }

  return (
    <div className="font-['Inter']" style={{ padding: 20 }}>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-end gap-2.5 mb-4">
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setShowAddForm(true);
          }}
          className="flex items-center justify-center cursor-pointer rounded-lg transition-colors hover:brightness-95"
          style={{
            width: 38,
            height: 38,
            backgroundColor: "#F3D12A",
            border: "none",
          }}
          aria-label="Add group"
        >
          <PlusIcon />
        </button>
        <ActionsDropdown />
      </div>

      {/* ── List Card ── */}
      <div className="rounded-xl bg-white border border-[#D4D4D0] overflow-hidden divide-y divide-[#D4D4D0]/40">
        {groups.map((group) => (
          <div key={group.id}>
            {editingId === group.id ? (
              /* ── Inline edit form ── */
              <div style={{ padding: 16 }} className="bg-[#FAFAF7]">
                <div className="space-y-3">
                  <InlineEditRow
                    group={group}
                    onSave={(data) => handleEditGroup(group.id, data)}
                    onCancel={() => setEditingId(null)}
                    onDelete={() => handleDeleteGroup(group)}
                  />
                </div>
              </div>
            ) : (
              <SwipeableGroupRow
                group={group}
                onTap={() => {
                  setShowAddForm(false);
                  setEditingId(group.id);
                }}
                onDelete={() => handleDeleteGroup(group)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Swipe hint */}
      {!showAddForm && !editingId && (
        <p
          className="text-center mt-3 font-['Inter']"
          style={{ fontSize: 11, fontWeight: 400, color: "rgba(26,26,26,0.25)" }}
        >
          Tap to edit · Swipe left to delete
        </p>
      )}

      {/* ── Inline Add Form ── */}
      {showAddForm && (
        <div className="mt-6">
          <GroupForm
            title="Add Group"
            onCancel={() => setShowAddForm(false)}
            onSave={handleAddGroup}
          />
        </div>
      )}
    </div>
  );
}

/* ═══════════════ Inline Edit Row (compact) ═══════════════ */
function InlineEditRow({
  group,
  onSave,
  onCancel,
  onDelete,
}: {
  group: GroupItem;
  onSave: (data: { name: string; type: GroupType; dateRange: string }) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(group.name);
  const [type, setType] = useState<string>(group.type);
  const [startDate, setStartDate] = useState(() => {
    const dr = group.dateRange;
    if (dr === "Ongoing") return "";
    return dr.split(" to ")[0] ?? "";
  });
  const [endDate, setEndDate] = useState(() => {
    const dr = group.dateRange;
    if (dr === "Ongoing") return "";
    return dr.split(" to ")[1] ?? "";
  });
  const [nameError, setNameError] = useState("");

  function handleSave() {
    if (!name.trim()) {
      setNameError("Group name is required");
      return;
    }
    setNameError("");
    onSave({
      name: name.trim(),
      type: (type || "Custom") as GroupType,
      dateRange: endDate ? `${startDate} to ${endDate}` : startDate || "Ongoing",
    });
  }

  return (
    <>
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
        placeholder="e.g. Mar 2026"
        value={startDate}
        onChange={setStartDate}
      />
      <FormFieldRow
        label="End Date"
        placeholder="Optional"
        value={endDate}
        onChange={setEndDate}
      />

      {/* Action row */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1.5 cursor-pointer rounded-lg transition-colors hover:bg-red-50"
          style={{
            height: 34,
            padding: "0 10px",
            fontSize: 12,
            fontWeight: 600,
            color: "#9B2335",
            border: "none",
            backgroundColor: "transparent",
          }}
        >
          <TrashIcon size={14} color="#9B2335" />
          Delete
        </button>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg cursor-pointer font-['Inter'] transition-colors hover:bg-[#F5F5F0]"
            style={{
              height: 34,
              padding: "0 14px",
              fontSize: 12,
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
              height: 34,
              padding: "0 16px",
              fontSize: 12,
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
    </>
  );
}