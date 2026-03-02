import { useState, useRef, useEffect, useCallback } from "react";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";
import { ImageWithFallback } from "./figma/ImageWithFallback";

/* ══════════════════════════════════════════
   Types
   ══════════════════════════════════════════ */
type LocationType = "Pasture" | "Pen" | "Facility" | "Other";
type LocationStatus = "Active" | "Inactive";

interface LocationItem {
  id: string;
  name: string;
  description: string;
  type: LocationType;
  status: LocationStatus;
  parentId: string | null;
  gps: { lat: string; lng: string } | null;
}

/* ══════════════════════════════════════════
   Mock Data
   ══════════════════════════════════════════ */
const initialLocations: LocationItem[] = [
  { id: "l1", name: "North Pasture", description: "320 acres, native grass", type: "Pasture", status: "Active", parentId: null, gps: { lat: "43.5512", lng: "-103.4780" } },
  { id: "l2", name: "South Pasture", description: "280 acres, improved grass", type: "Pasture", status: "Active", parentId: null, gps: { lat: "43.5320", lng: "-103.4900" } },
  { id: "l3", name: "Working Facility", description: "Main corrals and chute", type: "Facility", status: "Active", parentId: null, gps: { lat: "43.5460", lng: "-103.4820" } },
  { id: "l4", name: "East Section", description: "160 acres, creek bottom", type: "Pasture", status: "Active", parentId: null, gps: { lat: "43.5480", lng: "-103.4650" } },
  { id: "l5", name: "Pen 1A", description: "Sorting pen, holds 40 head", type: "Pen", status: "Active", parentId: "l3", gps: null },
  { id: "l6", name: "Pen 1B", description: "Hospital pen, holds 15 head", type: "Pen", status: "Active", parentId: "l3", gps: null },
  { id: "l7", name: "Pen 1C", description: "Loading pen", type: "Pen", status: "Active", parentId: "l3", gps: null },
  { id: "l8", name: "Pen 2B", description: "Weaning pen, holds 60 head", type: "Pen", status: "Active", parentId: "l4", gps: null },
  { id: "l9", name: "Feed Lot", description: "Concrete bunks, 200 head capacity", type: "Facility", status: "Active", parentId: "l4", gps: { lat: "43.5440", lng: "-103.4600" } },
];

/* ══════════════════════════════════════════
   Type styling
   ══════════════════════════════════════════ */
const TYPE_STYLES: Record<LocationType, { bg: string; color: string; iconColor: string }> = {
  Pasture: { bg: "#E8F5E9", color: "#2E7D32", iconColor: "#55BAAA" },
  Pen: { bg: "#FFF3E0", color: "#E65100", iconColor: "#E65100" },
  Facility: { bg: "#E3F2FD", color: "#1565C0", iconColor: "#2196F3" },
  Other: { bg: "#F5F5F0", color: "rgba(26,26,26,0.50)", iconColor: "rgba(26,26,26,0.35)" },
};

/* ══════════════════════════════════════════
   Icons
   ══════════════════════════════════════════ */
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

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3.75V14.25M3.75 9H14.25" stroke="#0E2646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function ListIcon({ active }: { active: boolean }) {
  const c = active ? "#0E2646" : "#D4D4D0";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4H14M2 8H14M2 12H14" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MapPinToggleIcon({ active }: { active: boolean }) {
  const c = active ? "#0E2646" : "#D4D4D0";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6C3.5 9.5 8 14.5 8 14.5S12.5 9.5 12.5 6C12.5 3.51 10.49 1.5 8 1.5Z" stroke={c} strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="8" cy="6" r="1.5" stroke={c} strokeWidth="1.2" />
    </svg>
  );
}

function MapPinSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5C2.5 7 6 11 6 11S9.5 7 9.5 4.5C9.5 2.57 7.93 1 6 1Z" fill="#55BAAA" />
      <circle cx="6" cy="4.5" r="1" fill="white" />
    </svg>
  );
}

function CrosshairIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="#55BAAA" strokeWidth="1.3" />
      <path d="M8 2V4.5M8 11.5V14M2 8H4.5M11.5 8H14" stroke="#55BAAA" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="8" r="1.5" fill="#55BAAA" />
    </svg>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      className="shrink-0 transition-transform duration-200"
      style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}
    >
      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#0E2646" strokeOpacity="0.25" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Location type icon */
function TypeIcon({ type, size = 14 }: { type: LocationType; size?: number }) {
  const c = TYPE_STYLES[type].iconColor;
  if (type === "Pasture") {
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <path d="M7 1.5V12.5M4 4C4 4 5 3 7 3C9 3 10 4 10 4M3 7C3 7 4.5 5.5 7 5.5C9.5 5.5 11 7 11 7M2 10C2 10 4 8 7 8C10 8 12 10 12 10" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "Pen") {
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <rect x="2" y="2" width="10" height="10" rx="1.5" stroke={c} strokeWidth="1.2" />
        <path d="M2 7H12M7 2V12" stroke={c} strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "Facility") {
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <path d="M2 12V5L7 2L12 5V12H2Z" stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
        <rect x="5.5" y="8" width="3" height="4" stroke={c} strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5" stroke={c} strokeWidth="1.2" />
      <circle cx="7" cy="7" r="1.5" fill={c} />
    </svg>
  );
}

/* ══════════════════════════════════════════
   Section Label
   ══════════════════════════════════════════ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[#0E2646] font-['Inter'] uppercase mb-2 px-1"
      style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", opacity: 0.35 }}
    >
      {children}
    </p>
  );
}

/* ══════════════════════════════════════════
   Type Pill
   ══════════════════════════════════════════ */
function TypePill({ type }: { type: LocationType }) {
  const s = TYPE_STYLES[type];
  return (
    <span
      className="inline-flex items-center rounded-full font-['Inter']"
      style={{ padding: "1px 8px", fontSize: 10, fontWeight: 700, backgroundColor: s.bg, color: s.color }}
    >
      {type}
    </span>
  );
}

/* ══════════════════════════════════════════
   3-dot Row Menu
   ══════════════════════════════════════════ */
function RowMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
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
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="flex items-center justify-center cursor-pointer rounded-md transition-colors hover:bg-[#F5F5F0]"
        style={{ width: 28, height: 28, background: "none", border: "none", padding: 0 }}
        aria-label="Row actions"
      >
        <DotsIcon />
      </button>
      {open && (
        <div className="absolute right-0 top-[32px] z-30 w-36 rounded-xl bg-white border border-[#D4D4D0] shadow-lg overflow-hidden font-['Inter']">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(); }}
            className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
            style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(); }}
            className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
            style={{ fontSize: 13, fontWeight: 500, color: "#9B2335" }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Parent Location Row
   ══════════════════════════════════════════ */
function ParentRow({
  location,
  childCount,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: {
  location: LocationItem;
  childCount: number;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const s = TYPE_STYLES[location.type];
  return (
    <div
      className="flex items-center gap-3 cursor-pointer transition-colors hover:bg-[#FAFAF7]"
      style={{ padding: "14px 16px" }}
      onClick={childCount > 0 ? onToggle : undefined}
    >
      {/* Type icon circle */}
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 28, height: 28, backgroundColor: `${s.iconColor}15` }}
      >
        <TypeIcon type={location.type} size={14} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="truncate font-['Inter']"
          style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.4 }}
        >
          {location.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <TypePill type={location.type} />
          {location.gps && <MapPinSmall />}
          <span
            className="font-['Inter'] truncate"
            style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.40)" }}
          >
            {location.description}
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5 shrink-0">
        {childCount > 0 && <ChevronDown open={expanded} />}
        <RowMenu onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Sub-Location Row
   ══════════════════════════════════════════ */
function SubRow({
  location,
  onEdit,
  onDelete,
}: {
  location: LocationItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const s = TYPE_STYLES[location.type];
  return (
    <div
      className="flex items-center gap-2.5"
      style={{ padding: "10px 16px 10px 48px" }}
    >
      {/* Connecting line */}
      <div
        className="absolute shrink-0"
        style={{
          left: 30,
          width: 2,
          height: "100%",
          backgroundColor: "#D4D4D0",
        }}
      />

      {/* Type icon circle (smaller) */}
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 24, height: 24, backgroundColor: `${s.iconColor}15` }}
      >
        <TypeIcon type={location.type} size={12} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="truncate font-['Inter']"
          style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.4 }}
        >
          {location.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <TypePill type={location.type} />
          {location.gps && <MapPinSmall />}
          {location.description && (
            <span
              className="font-['Inter'] truncate"
              style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.40)" }}
            >
              {location.description}
            </span>
          )}
        </div>
      </div>

      <RowMenu onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

/* ══════════════════════════════════════════
   Map View
   ══════════════════════════════════════════ */
const MAP_PINS: { id: string; name: string; type: LocationType; x: number; y: number }[] = [
  { id: "l1", name: "North Pasture", type: "Pasture", x: 18, y: 15 },
  { id: "l2", name: "South Pasture", type: "Pasture", x: 22, y: 72 },
  { id: "l3", name: "Working Facility", type: "Facility", x: 48, y: 42 },
  { id: "l4", name: "East Section", type: "Pasture", x: 75, y: 30 },
  { id: "l9", name: "Feed Lot", type: "Facility", x: 70, y: 70 },
];

const PIN_COLORS: Record<string, string> = {
  Pasture: "#55BAAA",
  Pen: "#E65100",
  Facility: "#2196F3",
  Other: "#999",
};

function MapView({ selectedPin, onSelectPin }: { selectedPin: string | null; onSelectPin: (id: string) => void }) {
  return (
    <div>
      {/* Map container */}
      <div className="relative rounded-xl border border-[#D4D4D0] overflow-hidden" style={{ height: 400 }}>
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1751475836912-075b233ef520?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBzYXRlbGxpdGUlMjByYW5jaCUyMHBhc3R1cmUlMjB0ZXJyYWlufGVufDF8fHx8MTc3MjQ4MjM4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Satellite terrain map"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "saturate(0.7) brightness(1.05)" }}
        />

        {/* Overlay for slight darkening */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(14,38,70,0.08)" }} />

        {/* Pins */}
        {MAP_PINS.map((pin) => {
          const isSelected = selectedPin === pin.id;
          const fill = PIN_COLORS[pin.type] || "#999";
          return (
            <button
              key={pin.id}
              type="button"
              onClick={() => onSelectPin(pin.id)}
              className="absolute cursor-pointer transition-transform"
              style={{
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                transform: `translate(-50%, -100%) ${isSelected ? "scale(1.25)" : "scale(1)"}`,
                background: "none",
                border: "none",
                padding: 0,
                zIndex: isSelected ? 10 : 1,
              }}
              aria-label={pin.name}
            >
              {/* Pin shape */}
              <svg width="28" height="38" viewBox="0 0 28 38" fill="none">
                <ellipse cx="14" cy="35" rx="5" ry="2" fill="rgba(0,0,0,0.15)" />
                <path d="M14 0C6.27 0 0 6.27 0 14C0 24.5 14 36 14 36S28 24.5 28 14C28 6.27 21.73 0 14 0Z" fill={fill} />
                <circle cx="14" cy="14" r="10" fill="white" fillOpacity="0.25" />
                <circle cx="14" cy="14" r="5" fill="white" />
                <path d="M14 0C6.27 0 0 6.27 0 14C0 24.5 14 36 14 36S28 24.5 28 14C28 6.27 21.73 0 14 0Z" stroke="white" strokeWidth="2" />
              </svg>
              {/* Label */}
              {isSelected && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 rounded-md font-['Inter'] whitespace-nowrap shadow-md"
                  style={{
                    top: -28,
                    padding: "3px 8px",
                    fontSize: 10,
                    fontWeight: 700,
                    backgroundColor: "white",
                    color: "#0E2646",
                    border: "1px solid #D4D4D0",
                  }}
                >
                  {pin.name}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Location chips */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
        {MAP_PINS.map((pin) => {
          const isSelected = selectedPin === pin.id;
          return (
            <button
              key={pin.id}
              type="button"
              onClick={() => onSelectPin(pin.id)}
              className="shrink-0 rounded-full font-['Inter'] cursor-pointer transition-all"
              style={{
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: isSelected ? 600 : 500,
                backgroundColor: "white",
                color: "#1A1A1A",
                border: isSelected ? "1.5px solid #0E2646" : "1px solid #D4D4D0",
              }}
            >
              {pin.name}
            </button>
          );
        })}
      </div>

      {/* Hint */}
      <p
        className="text-center mt-2 font-['Inter']"
        style={{ fontSize: 11, fontWeight: 400, color: "rgba(26,26,26,0.25)" }}
      >
        Pinch to zoom · Tap pin for details
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════
   Add / Edit Form
   ══════════════════════════════════════════ */
function LocationForm({
  mode,
  initial,
  parentOptions,
  onCancel,
  onSave,
}: {
  mode: "add" | "edit";
  initial?: Partial<LocationItem>;
  parentOptions: { id: string; name: string }[];
  onCancel: () => void;
  onSave: (data: Omit<LocationItem, "id">) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<string>(initial?.type ?? "");
  const [parentId, setParentId] = useState(initial?.parentId ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<string>(initial?.status ?? "Active");
  const [lat, setLat] = useState(initial?.gps?.lat ?? "");
  const [lng, setLng] = useState(initial?.gps?.lng ?? "");
  const [nameError, setNameError] = useState("");

  function handleSave() {
    if (!name.trim()) {
      setNameError("Location name is required");
      return;
    }
    setNameError("");
    onSave({
      name: name.trim(),
      description: description.trim(),
      type: (type || "Other") as LocationType,
      status: (status || "Active") as LocationStatus,
      parentId: parentId || null,
      gps: lat && lng ? { lat, lng } : null,
    });
  }

  function handleUseCurrentLocation() {
    setLat("43.5460");
    setLng("-103.4820");
  }

  const hasCoords = lat.trim() !== "" && lng.trim() !== "";

  return (
    <div>
      <SectionLabel>{mode === "add" ? "Add Location" : "Edit Location"}</SectionLabel>

      <div
        className="bg-white rounded-xl border border-[#D4D4D0]/60 font-['Inter']"
        style={{ padding: 16 }}
      >
        <div className="space-y-3">
          <FormFieldRow
            label="Name"
            placeholder="e.g. North Pasture"
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
            options={["Pasture", "Pen", "Facility", "Other"]}
          />

          <FormSelectRow
            label="Parent"
            placeholder="None (Top Level)"
            value={parentId}
            onChange={setParentId}
            options={["None (Top Level)", ...parentOptions.map((p) => p.name)]}
          />

          <FormFieldRow
            label="Description"
            placeholder="Brief description"
            value={description}
            onChange={setDescription}
          />

          <FormSelectRow
            label="Status"
            placeholder="Select status"
            value={status}
            onChange={setStatus}
            options={["Active", "Inactive"]}
          />
        </div>

        {/* GPS Section */}
        <div className="mt-4">
          <p
            className="font-['Inter'] uppercase mb-2"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(14,38,70,0.30)" }}
          >
            GPS Coordinates
          </p>

          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="43.5460"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
                style={{ fontSize: 16 }}
              />
              <p className="mt-1 font-['Inter']" style={{ fontSize: 10, color: "rgba(26,26,26,0.25)" }}>Latitude</p>
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="-103.4820"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
                style={{ fontSize: 16 }}
              />
              <p className="mt-1 font-['Inter']" style={{ fontSize: 10, color: "rgba(26,26,26,0.25)" }}>Longitude</p>
            </div>
          </div>

          {/* Use Current Location */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="flex items-center gap-1.5 mt-3 cursor-pointer transition-colors hover:opacity-75 font-['Inter']"
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <CrosshairIcon />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#55BAAA" }}>Use Current Location</span>
          </button>

          {/* Mini map preview or empty state */}
          <div className="mt-3">
            {hasCoords ? (
              <div className="relative rounded-lg border border-[#D4D4D0] overflow-hidden" style={{ height: 120 }}>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1751475836912-075b233ef520?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBzYXRlbGxpdGUlMjByYW5jaCUyMHBhc3R1cmUlMjB0ZXJyYWlufGVufDF8fHx8MTc3MjQ4MjM4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Map preview"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "saturate(0.6) brightness(1.1)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="24" height="32" viewBox="0 0 28 38" fill="none">
                    <path d="M14 0C6.27 0 0 6.27 0 14C0 24.5 14 36 14 36S28 24.5 28 14C28 6.27 21.73 0 14 0Z" fill="#55BAAA" stroke="white" strokeWidth="2" />
                    <circle cx="14" cy="14" r="5" fill="white" />
                  </svg>
                </div>
              </div>
            ) : (
              <div
                className="rounded-lg flex items-center justify-center"
                style={{
                  height: 120,
                  border: "2px dashed #D4D4D0",
                  backgroundColor: "rgba(26,26,26,0.02)",
                }}
              >
                <p className="font-['Inter']" style={{ fontSize: 12, color: "rgba(26,26,26,0.25)" }}>
                  No coordinates set
                </p>
              </div>
            )}
          </div>
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
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN
   ══════════════════════════════════════════ */
export function ReferenceLocationsScreen() {
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();

  const [locations, setLocations] = useState<LocationItem[]>(initialLocations);
  const [view, setView] = useState<"list" | "map">("list");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["l3"]));
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMapPin, setSelectedMapPin] = useState<string | null>(null);

  /* ── Helpers ── */
  const topLevel = locations.filter((l) => l.parentId === null);
  const getChildren = useCallback(
    (parentId: string) => locations.filter((l) => l.parentId === parentId),
    [locations]
  );

  const searchLower = search.toLowerCase().trim();
  const filteredTopLevel = topLevel.filter(
    (l) =>
      searchLower === "" ||
      l.name.toLowerCase().includes(searchLower) ||
      l.description.toLowerCase().includes(searchLower) ||
      l.type.toLowerCase().includes(searchLower)
  );

  const parentOptions = topLevel.map((l) => ({ id: l.id, name: l.name }));

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAdd(data: Omit<LocationItem, "id">) {
    // Resolve parent from name
    let parentId = data.parentId;
    if (parentId && parentId !== "None (Top Level)") {
      const match = topLevel.find((l) => l.name === parentId);
      parentId = match?.id ?? null;
    } else {
      parentId = null;
    }
    const newLoc: LocationItem = { ...data, parentId, id: `l${Date.now()}` };
    setLocations((prev) => [...prev, newLoc]);
    setShowAddForm(false);
    showToast("success", `"${data.name}" added`);
  }

  function handleEdit(id: string, data: Omit<LocationItem, "id">) {
    let parentId = data.parentId;
    if (parentId && parentId !== "None (Top Level)") {
      const match = topLevel.find((l) => l.name === parentId);
      parentId = match?.id ?? null;
    } else {
      parentId = null;
    }
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, ...data, parentId } : loc))
    );
    setEditingId(null);
    showToast("success", `"${data.name}" updated`);
  }

  function handleDelete(location: LocationItem) {
    const children = getChildren(location.id);
    const childNote = children.length > 0 ? ` This will also remove ${children.length} sub-location${children.length > 1 ? "s" : ""}.` : "";
    showDeleteConfirm({
      title: "Delete Location",
      message: `Are you sure you want to delete "${location.name}"?${childNote} This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        setLocations((prev) => prev.filter((l) => l.id !== location.id && l.parentId !== location.id));
        if (editingId === location.id) setEditingId(null);
        showToast("success", `"${location.name}" deleted`);
      },
    });
  }

  const editingLocation = editingId ? locations.find((l) => l.id === editingId) : null;

  return (
    <div className="font-['Inter']" style={{ padding: 20 }}>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between mb-4">
        <div />
        <div className="flex items-center gap-2.5">
          {/* View toggle */}
          <div className="flex items-center bg-white rounded-lg border border-[#D4D4D0] overflow-hidden">
            <button
              type="button"
              onClick={() => setView("list")}
              className="flex items-center justify-center cursor-pointer transition-colors"
              style={{
                width: 34,
                height: 34,
                backgroundColor: view === "list" ? "#F5F5F0" : "transparent",
                border: "none",
              }}
              aria-label="List view"
            >
              <ListIcon active={view === "list"} />
            </button>
            <button
              type="button"
              onClick={() => setView("map")}
              className="flex items-center justify-center cursor-pointer transition-colors"
              style={{
                width: 34,
                height: 34,
                backgroundColor: view === "map" ? "#F5F5F0" : "transparent",
                border: "none",
              }}
              aria-label="Map view"
            >
              <MapPinToggleIcon active={view === "map"} />
            </button>
          </div>

          {/* Add button */}
          <button
            type="button"
            onClick={() => { setEditingId(null); setShowAddForm(true); }}
            className="flex items-center justify-center cursor-pointer rounded-lg transition-colors hover:brightness-95"
            style={{ width: 38, height: 38, backgroundColor: "#F3D12A", border: "none" }}
            aria-label="Add location"
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════
         LIST VIEW
         ═══════════════════════════════ */}
      {view === "list" && (
        <>
          {/* Search */}
          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[40px] pl-9 pr-9 rounded-lg bg-white border border-[#D4D4D0] font-['Inter'] text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#55BAAA] focus:ring-2 focus:ring-[#55BAAA]/15"
              style={{ fontSize: 16 }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ background: "none", border: "none", padding: 0 }}
                aria-label="Clear search"
              >
                <ClearIcon />
              </button>
            )}
          </div>

          {/* Hierarchical list */}
          <div className="rounded-xl bg-white border border-[#D4D4D0] overflow-hidden divide-y divide-[#D4D4D0]/40">
            {filteredTopLevel.map((loc) => {
              const children = getChildren(loc.id);
              const isExpanded = expanded.has(loc.id);

              // If editing this location inline
              if (editingId === loc.id) {
                return (
                  <div key={loc.id} className="bg-[#FAFAF7]" style={{ padding: 16 }}>
                    <LocationForm
                      mode="edit"
                      initial={loc}
                      parentOptions={parentOptions.filter((p) => p.id !== loc.id)}
                      onCancel={() => setEditingId(null)}
                      onSave={(data) => handleEdit(loc.id, data)}
                    />
                  </div>
                );
              }

              return (
                <div key={loc.id}>
                  <ParentRow
                    location={loc}
                    childCount={children.length}
                    expanded={isExpanded}
                    onToggle={() => toggleExpand(loc.id)}
                    onEdit={() => { setShowAddForm(false); setEditingId(loc.id); }}
                    onDelete={() => handleDelete(loc)}
                  />

                  {/* Sub-locations */}
                  {isExpanded && children.length > 0 && (
                    <div className="relative">
                      {/* Left border connecting line */}
                      <div
                        className="absolute"
                        style={{
                          left: 30,
                          top: 0,
                          bottom: 0,
                          width: 2,
                          backgroundColor: "#D4D4D0",
                          opacity: 0.4,
                        }}
                      />
                      {children.map((child) => {
                        if (editingId === child.id) {
                          return (
                            <div key={child.id} className="bg-[#FAFAF7]" style={{ padding: 16, marginLeft: 32 }}>
                              <LocationForm
                                mode="edit"
                                initial={child}
                                parentOptions={parentOptions}
                                onCancel={() => setEditingId(null)}
                                onSave={(data) => handleEdit(child.id, data)}
                              />
                            </div>
                          );
                        }
                        return (
                          <SubRow
                            key={child.id}
                            location={child}
                            onEdit={() => { setShowAddForm(false); setEditingId(child.id); }}
                            onDelete={() => handleDelete(child)}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredTopLevel.length === 0 && (
              <div className="flex flex-col items-center justify-center" style={{ padding: "32px 20px" }}>
                <p className="font-['Inter']" style={{ fontSize: 14, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}>
                  No locations found
                </p>
                <p className="mt-1 font-['Inter']" style={{ fontSize: 12, color: "rgba(26,26,26,0.20)" }}>
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══════════════════════════════
         MAP VIEW
         ═══════════════════════════════ */}
      {view === "map" && (
        <MapView
          selectedPin={selectedMapPin}
          onSelectPin={(id) => setSelectedMapPin(id === selectedMapPin ? null : id)}
        />
      )}

      {/* ═══════════════════════════════
         ADD FORM
         ═══════════════════════════════ */}
      {showAddForm && (
        <div className="mt-6">
          <LocationForm
            mode="add"
            parentOptions={parentOptions}
            onCancel={() => setShowAddForm(false)}
            onSave={handleAdd}
          />
        </div>
      )}

      {/* Edit form (for locations not in the list inline) */}
      {editingLocation && !filteredTopLevel.some((l) => l.id === editingId) && !locations.some((l) => l.parentId && expanded.has(l.parentId) && l.id === editingId) && (
        <div className="mt-6">
          <LocationForm
            mode="edit"
            initial={editingLocation}
            parentOptions={parentOptions.filter((p) => p.id !== editingId)}
            onCancel={() => setEditingId(null)}
            onSave={(data) => handleEdit(editingId!, data)}
          />
        </div>
      )}
    </div>
  );
}
