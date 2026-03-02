import { useState, useRef, useEffect, useCallback } from "react";
import { FormFieldRow } from "./form-field-row";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";

/* ── Types ── */
interface LocationItem {
  id: string;
  name: string;
  description: string;
}

/* ── Mock data ── */
const initialLocations: LocationItem[] = [
  { id: "l1", name: "North Pasture", description: "320 acres, creek access" },
  { id: "l2", name: "South Pasture", description: "240 acres, shelter belt" },
  { id: "l3", name: "Working Facility", description: "Main corrals and chute" },
  { id: "l4", name: "Pen 1A", description: "Sick pen, near barn" },
  { id: "l5", name: "Pen 1B", description: "Calving pen" },
  { id: "l6", name: "Pen 1C", description: "Isolation pen" },
  { id: "l7", name: "Pen 2B", description: "First-calf heifers" },
  { id: "l8", name: "Feed Lot", description: "Winter feeding area" },
];

/* ── Shared icons ── */
function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="#0E2646" strokeOpacity="0.2" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

function SwipeableLocationRow({
  location,
  onTap,
  onDelete,
}: {
  location: LocationItem;
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
    const clamped = Math.max(0, Math.min(diff, DELETE_ZONE + 20));
    setOffsetX(clamped);
  }, [swiping]);

  const handleTouchEnd = useCallback(() => {
    setSwiping(false);
    if (currentXRef.current >= SWIPE_THRESHOLD) {
      setOffsetX(DELETE_ZONE);
    } else {
      setOffsetX(0);
    }
  }, []);

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
          aria-label="Delete location"
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
              className="truncate font-['Inter']"
              style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.4 }}
            >
              {location.name}
            </p>
            {location.description && (
              <p
                className="truncate font-['Inter'] mt-0.5"
                style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.40)", lineHeight: 1.4 }}
              >
                {location.description}
              </p>
            )}
          </div>

          {/* Right side */}
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════ Inline Edit Row ═══════════════ */
function InlineEditRow({
  location,
  onSave,
  onCancel,
  onDelete,
}: {
  location: LocationItem;
  onSave: (data: { name: string; description: string }) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(location.name);
  const [description, setDescription] = useState(location.description);
  const [nameError, setNameError] = useState("");

  function handleSave() {
    if (!name.trim()) {
      setNameError("Location name is required");
      return;
    }
    setNameError("");
    onSave({ name: name.trim(), description: description.trim() });
  }

  return (
    <>
      <FormFieldRow
        label="Name"
        placeholder="Location name"
        value={name}
        onChange={setName}
        required
        error={nameError}
      />

      {/* Textarea row */}
      <div className="flex items-start gap-3">
        <label
          className="shrink-0 text-[#1A1A1A] font-['Inter']"
          style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
        >
          Description
        </label>
        <textarea
          placeholder="Optional description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 resize-none"
          style={{ fontSize: 16, fontWeight: 400, minHeight: 64 }}
        />
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1.5 cursor-pointer rounded-lg transition-colors hover:bg-red-50 font-['Inter']"
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

/* ═══════════════ Add Form ═══════════════ */
function AddLocationForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (data: { name: string; description: string }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");

  function handleSave() {
    if (!name.trim()) {
      setNameError("Location name is required");
      return;
    }
    setNameError("");
    onSave({ name: name.trim(), description: description.trim() });
  }

  return (
    <div>
      <p
        className="font-['Inter'] uppercase mb-2 px-1"
        style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#0E2646" }}
      >
        Add Location
      </p>

      <div
        className="bg-white rounded-xl border border-[#D4D4D0]/60 font-['Inter']"
        style={{ padding: 16 }}
      >
        <div className="space-y-3">
          <FormFieldRow
            label="Name"
            placeholder="Location name"
            value={name}
            onChange={setName}
            required
            error={nameError}
          />

          {/* Textarea row */}
          <div className="flex items-start gap-3">
            <label
              className="shrink-0 text-[#1A1A1A] font-['Inter']"
              style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
            >
              Description
            </label>
            <textarea
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 resize-none"
              style={{ fontSize: 16, fontWeight: 400, minHeight: 72 }}
            />
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

/* ══════════════════ SCREEN ══════════════════ */
export function ReferenceLocationsScreen() {
  const [locations, setLocations] = useState<LocationItem[]>(initialLocations);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();

  function handleAdd(data: { name: string; description: string }) {
    const newLoc: LocationItem = {
      ...data,
      id: `l${Date.now()}`,
    };
    setLocations((prev) => [...prev, newLoc]);
    setShowAddForm(false);
    showToast("success", `"${data.name}" added`);
  }

  function handleEdit(id: string, data: { name: string; description: string }) {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, ...data } : loc))
    );
    setEditingId(null);
    showToast("success", `"${data.name}" updated`);
  }

  function handleDelete(location: LocationItem) {
    showDeleteConfirm({
      title: "Delete Location",
      message: `Are you sure you want to delete "${location.name}"? This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        setLocations((prev) => prev.filter((loc) => loc.id !== location.id));
        if (editingId === location.id) setEditingId(null);
        showToast("success", `"${location.name}" deleted`);
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
          aria-label="Add location"
        >
          <PlusIcon />
        </button>
        <ActionsDropdown />
      </div>

      {/* ── List Card ── */}
      <div className="rounded-xl bg-white border border-[#D4D4D0] overflow-hidden divide-y divide-[#D4D4D0]/40">
        {locations.map((location) => (
          <div key={location.id}>
            {editingId === location.id ? (
              <div style={{ padding: 16 }} className="bg-[#FAFAF7]">
                <div className="space-y-3">
                  <InlineEditRow
                    location={location}
                    onSave={(data) => handleEdit(location.id, data)}
                    onCancel={() => setEditingId(null)}
                    onDelete={() => handleDelete(location)}
                  />
                </div>
              </div>
            ) : (
              <SwipeableLocationRow
                location={location}
                onTap={() => {
                  setShowAddForm(false);
                  setEditingId(location.id);
                }}
                onDelete={() => handleDelete(location)}
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
          <AddLocationForm
            onCancel={() => setShowAddForm(false)}
            onSave={handleAdd}
          />
        </div>
      )}
    </div>
  );
}
