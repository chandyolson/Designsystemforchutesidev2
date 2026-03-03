import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useToast } from "./toast-context";
import { FlagIcon } from "./flag-icon";
import type { FlagColor } from "./flag-icon";

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */
const CATEGORIES = ["General", "Animal", "Maintenance", "Expense", "Weather", "Other"];

const TEAM_MEMBERS = [
  { id: "me", name: "Me (John O.)", initials: "JO" },
  { id: "t2", name: "Dr. James Miller", initials: "JM" },
  { id: "t3", name: "Sarah Chen", initials: "SC" },
  { id: "t4", name: "Mike Torres", initials: "MT" },
  { id: "t5", name: "Emily Olson", initials: "EO" },
];

const LOCATIONS = [
  "North Pasture", "South Pasture", "Working Facility", "Headquarters",
  "East Meadow", "Creek Bottom", "Calving Barn", "Feed Lot",
];

const GROUPS = [
  "2026 Spring Calving", "North Pasture Pairs", "Replacement Heifers",
  "First-Calf Heifers", "Bred Cows", "Bull Battery",
];
const PROJECTS = [
  "Spring Preg Check", "Pre-Calving Processing", "Weaning 2026",
  "AI Breeding", "Bull BSE",
];

const MOCK_ANIMALS = [
  { tag: "3309", color: "Pink", breed: "Angus", type: "Cow", colorHex: "#E91E63" },
  { tag: "5520", color: "Green", breed: "Charolais", type: "Cow", colorHex: "#2E7D32" },
  { tag: "3091", color: "Yellow", breed: "Hereford", type: "Cow", colorHex: "#B8860B" },
  { tag: "4410", color: "Orange", breed: "Angus", type: "Heifer", colorHex: "#E65100" },
  { tag: "901", color: "Black", breed: "Angus", type: "Bull", colorHex: "#1A1A1A" },
  { tag: "202", color: "Blue", breed: "Hereford", type: "Calf", colorHex: "#1565C0" },
];

type FlagSelection = "none" | "info" | "action" | "urgent";
type ActionStatus = "open" | "complete" | "wontdo";

const FLAG_CONFIG: { key: FlagSelection; flagColor?: FlagColor; label: string; color: string; bg: string; border: string }[] = [
  { key: "none", label: "None", color: "#1A1A1A", bg: "transparent", border: "#D4D4D0" },
  { key: "info", flagColor: "teal", label: "Info", color: "#55BAAA", bg: "rgba(85,186,170,0.10)", border: "#55BAAA" },
  { key: "action", flagColor: "gold", label: "Action", color: "#B8860B", bg: "rgba(243,209,42,0.10)", border: "#F3D12A" },
  { key: "urgent", flagColor: "red", label: "Urgent", color: "#E74C3C", bg: "rgba(231,76,60,0.10)", border: "#E74C3C" },
];

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */
function CowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <ellipse cx="7" cy="8.5" rx="4" ry="3.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4 5.5C3 4 1.5 4.5 1.5 3.5M10 5.5C11 4 12.5 4.5 12.5 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="5.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M7 1.5C4.5 1.5 2.5 3.5 2.5 6C2.5 9.5 7 12.5 7 12.5C7 12.5 11.5 9.5 11.5 6C11.5 3.5 9.5 1.5 7 1.5Z" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="7" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M1.75 4V11C1.75 11.55 2.2 12 2.75 12H11.25C11.8 12 12.25 11.55 12.25 11V5.5C12.25 4.95 11.8 4.5 11.25 4.5H7L5.5 2.5H2.75C2.2 2.5 1.75 2.95 1.75 3.5V4Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="4.5" y="1" width="5" height="8" rx="2.5" fill="#F3D12A" />
      <path d="M3 6.5C3 8.71 4.79 10.5 7 10.5C9.21 10.5 11 8.71 11 6.5" stroke="#F3D12A" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="7" y1="10.5" x2="7" y2="13" stroke="#F3D12A" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SearchSmIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <circle cx="6" cy="6" r="4" stroke="rgba(26,26,26,0.30)" strokeWidth="1.2" />
      <path d="M9.5 9.5L12 12" stroke="rgba(26,26,26,0.30)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function XIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 transition-transform duration-200">
      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
    </svg>
  );
}

function ActionFlagIcon({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
      <path
        d="M3.75 2.25V15.75M3.75 2.25H13.5L10.5 6L13.5 9.75H3.75"
        stroke={active ? "#E74C3C" : "rgba(26,26,26,0.30)"}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Toggle Switch
   ═══════════════════════════════════════════ */
function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative shrink-0 rounded-full cursor-pointer transition-colors duration-200"
      style={{
        width: 44,
        height: 24,
        backgroundColor: on ? "#E74C3C" : "#D4D4D0",
        border: "none",
        padding: 2,
      }}
      aria-pressed={on}
    >
      <span
        className="block rounded-full bg-white shadow transition-transform duration-200"
        style={{
          width: 20,
          height: 20,
          transform: on ? "translateX(20px)" : "translateX(0px)",
        }}
      />
    </button>
  );
}

/* ═══════════════════════════════════════════
   Avatar Circle
   ═══════════════════════════════════════════ */
function Avatar({ initials, size = 20 }: { initials: string; size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full shrink-0 font-['Inter']"
      style={{
        width: size,
        height: size,
        backgroundColor: "#0E2646",
        fontSize: size * 0.4,
        fontWeight: 700,
        color: "#FFFFFF",
      }}
    >
      {initials}
    </span>
  );
}

/* ═══════════════════════════════════════════
   SCREEN
   ═══════════════════════════════════════════ */
export function RedBookEntryScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const isNew = !id;

  /* ── Form state ── */
  const [title, setTitle] = useState(isNew ? "" : "Fence down section 3");
  const [category, setCategory] = useState(isNew ? "" : "Maintenance");
  const [note, setNote] = useState(
    isNew
      ? ""
      : "Found 3 posts down on the north fence line near the creek crossing. Cattle could push through. Need to repair before moving pairs."
  );
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  /* ── Flag state ── */
  const [selectedFlag, setSelectedFlag] = useState<FlagSelection>(isNew ? "none" : "action");

  /* ── Action items state ── */
  const [actionRequired, setActionRequired] = useState(!isNew);
  const [actionStatus, setActionStatus] = useState<ActionStatus>("open");
  const [assignTo, setAssignTo] = useState(isNew ? "me" : "t4");
  const [assignOpen, setAssignOpen] = useState(false);
  const assignRef = useRef<HTMLDivElement>(null);

  /* ── Link To state ── */
  type LinkType = "animal" | "location" | "group";
  const [activeLinks, setActiveLinks] = useState<Set<LinkType>>(
    new Set(isNew ? [] : ["location"])
  );
  const [animalSearch, setAnimalSearch] = useState("");
  const [linkedAnimal, setLinkedAnimal] = useState<typeof MOCK_ANIMALS[0] | null>(null);
  const [linkedLocation, setLinkedLocation] = useState(isNew ? "" : "North Pasture");
  const [locOpen, setLocOpen] = useState(false);
  const locRef = useRef<HTMLDivElement>(null);
  const [linkedGroupProject, setLinkedGroupProject] = useState("");
  const [gpOpen, setGpOpen] = useState(false);
  const gpRef = useRef<HTMLDivElement>(null);

  /* ── Close dropdowns on outside click ── */
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
      if (assignRef.current && !assignRef.current.contains(e.target as Node)) setAssignOpen(false);
      if (locRef.current && !locRef.current.contains(e.target as Node)) setLocOpen(false);
      if (gpRef.current && !gpRef.current.contains(e.target as Node)) setGpOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  /* ── Animal search results ── */
  const animalResults = animalSearch.trim()
    ? MOCK_ANIMALS.filter(
        (a) =>
          a.tag.includes(animalSearch) ||
          a.breed.toLowerCase().includes(animalSearch.toLowerCase()) ||
          a.color.toLowerCase().includes(animalSearch.toLowerCase())
      )
    : [];

  function toggleLink(type: LinkType) {
    setActiveLinks((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
        if (type === "animal") { setLinkedAnimal(null); setAnimalSearch(""); }
        if (type === "location") setLinkedLocation("");
        if (type === "group") setLinkedGroupProject("");
      } else {
        next.add(type);
      }
      return next;
    });
  }

  function handleSave() {
    showToast("success", isNew ? "Entry saved to Red Book" : "Entry updated");
    navigate("/red-book");
  }

  const selectedMember = TEAM_MEMBERS.find((m) => m.id === assignTo) || TEAM_MEMBERS[0];

  /* ── Today's date ── */
  const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

  /* ── Shared label style ── */
  const labelStyle: React.CSSProperties = {
    width: 105,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "40px",
    color: "#1A1A1A",
    flexShrink: 0,
  };

  /* ── Resolve flag for preview ── */
  const flagCfg = FLAG_CONFIG.find((f) => f.key === selectedFlag)!;

  return (
    <div className="font-['Inter'] space-y-0">

      {/* ══════════════════════════════
         LIVE PREVIEW CARD
         ══════════════════════════════ */}
      <div
        className="rounded-xl"
        style={{
          background: "linear-gradient(135deg, #0E2646 0%, #153566 100%)",
          padding: "14px 16px",
          position: "relative",
        }}
      >
        {/* Flag on top-right */}
        {selectedFlag !== "none" && flagCfg.flagColor && (
          <div className="absolute" style={{ top: 12, right: 14 }}>
            <FlagIcon color={flagCfg.flagColor} size="sm" />
          </div>
        )}

        {/* Title preview */}
        <p
          className="font-['Inter'] pr-8"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: title ? "#FFFFFF" : "rgba(255,255,255,0.20)",
            lineHeight: 1.4,
          }}
        >
          {title || "Untitled"}
        </p>

        {/* Note preview — 2 lines max */}
        <p
          className="font-['Inter'] mt-1"
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: note ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.15)",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {note || "Start writing..."}
        </p>

        {/* Category + date */}
        <p
          className="font-['Inter'] mt-2"
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(255,255,255,0.25)",
          }}
        >
          {category || "No category"} &middot; {todayStr}
        </p>
      </div>

      {/* ══════════════════════════════
         FLAG SELECTOR
         ══════════════════════════════ */}
      <div style={{ marginTop: 16 }}>
        <p
          className="font-['Inter']"
          style={{ fontSize: 11, fontWeight: 600, color: "rgba(26,26,26,0.40)", marginBottom: 8 }}
        >
          Flag
        </p>
        <div className="flex gap-2.5">
          {FLAG_CONFIG.map((f) => {
            const isSel = selectedFlag === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setSelectedFlag(f.key)}
                className="flex flex-col items-center gap-1 cursor-pointer"
                style={{ background: "none", border: "none", padding: 0 }}
              >
                {/* Circle */}
                <span
                  className="flex items-center justify-center rounded-full transition-all duration-150"
                  style={{
                    width: 32,
                    height: 32,
                    border: `1.5px solid ${isSel ? f.border : "#D4D4D0"}`,
                    backgroundColor: isSel && f.key !== "none" ? f.bg : "transparent",
                  }}
                >
                  {f.key === "none" ? (
                    /* Empty / dot for "None" */
                    isSel ? (
                      <span
                        className="rounded-full"
                        style={{ width: 6, height: 6, backgroundColor: "#0E2646" }}
                      />
                    ) : null
                  ) : (
                    <FlagIcon color={f.flagColor!} size="sm" />
                  )}
                </span>
                {/* Label */}
                <span
                  className="font-['Inter']"
                  style={{
                    fontSize: 10,
                    fontWeight: isSel ? 600 : 500,
                    color: isSel && f.key !== "none" ? f.color : "rgba(26,26,26,0.40)",
                  }}
                >
                  {f.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════
         FORM FIELDS
         ══════════════════════════════ */}

      {/* ── Title ── */}
      <div className="flex items-center gap-3" style={{ marginTop: 16 }}>
        <label className="font-['Inter']" style={labelStyle}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief title"
          className="flex-1 min-w-0 h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
          style={{ fontSize: 16, fontWeight: 400 }}
        />
      </div>

      {/* ── Category ── */}
      <div className="flex items-center gap-3 mt-4" ref={catRef}>
        <label className="font-['Inter']" style={labelStyle}>Category</label>
        <div className="flex-1 min-w-0 relative">
          <button
            type="button"
            onClick={() => setCatOpen((v) => !v)}
            className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-left font-['Inter'] flex items-center justify-between cursor-pointer"
            style={{ fontSize: 16, fontWeight: 400, color: category ? "#1A1A1A" : "rgba(26,26,26,0.3)" }}
          >
            <span className="truncate">{category || "Select category\u2026"}</span>
            <ChevronDown />
          </button>
          {catOpen && (
            <div
              className="absolute left-0 right-0 top-full mt-1 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-20 font-['Inter']"
              style={{ boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setCategory(cat); setCatOpen(false); }}
                  className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
                  style={{ fontSize: 16, fontWeight: cat === category ? 700 : 500, color: cat === category ? "#0E2646" : "#1A1A1A", background: "none", border: "none" }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Note ── */}
      <div className="mt-4">
        <div className="flex items-start gap-3">
          <label className="font-['Inter']" style={{ ...labelStyle, lineHeight: "20px", paddingTop: 10 }}>
            Note
          </label>
          <div className="flex-1 min-w-0 relative">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What happened..."
              rows={4}
              className="w-full px-3 py-2.5 pr-10 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all resize-none"
              style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, minHeight: 100 }}
            />
            {/* Inline mic button */}
            <button
              type="button"
              className="absolute right-2 bottom-2.5 rounded-full cursor-pointer transition-all duration-150 active:scale-[0.95] flex items-center justify-center"
              style={{ width: 32, height: 32, backgroundColor: "#0E2646" }}
              aria-label="Voice input"
            >
              <MicIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
         ACTION REQUIRED TOGGLE
         ══════════════════════════════ */}
      <div style={{ marginTop: 16 }}>
        <div
          className="flex items-center justify-between"
          style={{ padding: "14px 0" }}
        >
          <div className="flex items-center gap-2.5">
            <ActionFlagIcon active={actionRequired} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>Action Required</span>
          </div>
          <ToggleSwitch
            on={actionRequired}
            onToggle={() => setActionRequired((v) => !v)}
          />
        </div>
        <p
          className="font-['Inter']"
          style={{ fontSize: 11, fontWeight: 400, color: "rgba(26,26,26,0.25)", marginTop: -6 }}
        >
          Adds this to your action items on the Dashboard
        </p>
      </div>

      {/* ══════════════════════════════
         ACTION FIELDS (animated reveal)
         ══════════════════════════════ */}
      <div
        className="overflow-hidden transition-all duration-200 ease-out"
        style={{
          maxHeight: actionRequired ? 900 : 0,
          opacity: actionRequired ? 1 : 0,
          marginTop: actionRequired ? 12 : 0,
        }}
      >
        <div
          className="rounded-xl bg-white relative"
          style={{
            border: "1.5px solid rgba(231,76,60,0.20)",
            padding: 16,
            borderLeft: "3px solid #E74C3C",
          }}
        >
          {/* ── Assign To ── */}
          <div className="flex items-center gap-3" ref={assignRef}>
            <label className="font-['Inter'] shrink-0" style={{ width: 85, fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
              Assign To
            </label>
            <div className="flex-1 min-w-0 relative">
              <button
                type="button"
                onClick={() => setAssignOpen((v) => !v)}
                className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-left font-['Inter'] flex items-center gap-2 cursor-pointer"
                style={{ fontSize: 16, fontWeight: 400, color: "#1A1A1A" }}
              >
                <Avatar initials={selectedMember.initials} />
                <span className="truncate flex-1">{selectedMember.name}</span>
                <ChevronDown />
              </button>
              {assignOpen && (
                <div
                  className="absolute left-0 right-0 top-full mt-1 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-20 font-['Inter']"
                  style={{ boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
                >
                  {TEAM_MEMBERS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => { setAssignTo(m.id); setAssignOpen(false); }}
                      className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0] flex items-center gap-2.5"
                      style={{
                        fontSize: 16,
                        fontWeight: m.id === assignTo ? 700 : 500,
                        color: m.id === assignTo ? "#0E2646" : "#1A1A1A",
                        background: "none",
                        border: "none",
                      }}
                    >
                      <Avatar initials={m.initials} />
                      <span>{m.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Status (only on existing entries) ── */}
          {!isNew && (
            <div className="flex items-center gap-3 mt-3">
              <label className="font-['Inter'] shrink-0" style={{ width: 85, fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
                Status
              </label>
              <div className="flex gap-2 flex-1 flex-wrap">
                {([
                  { key: "open" as ActionStatus, label: "Open", selBg: "#FFF3E0", selBorder: "#E65100", selColor: "#E65100" },
                  { key: "complete" as ActionStatus, label: "Complete", selBg: "#FFFFFF", selBorder: "#D4D4D0", selColor: "rgba(26,26,26,0.50)" },
                  { key: "wontdo" as ActionStatus, label: "Won't Do", selBg: "#FFFFFF", selBorder: "#D4D4D0", selColor: "rgba(26,26,26,0.50)" },
                ]).map((s) => {
                  const isSel = actionStatus === s.key;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setActionStatus(s.key)}
                      className="rounded-full cursor-pointer transition-all duration-150 font-['Inter']"
                      style={{
                        padding: "5px 14px",
                        fontSize: 12,
                        fontWeight: isSel ? 700 : 500,
                        backgroundColor: isSel ? s.selBg : "#FFFFFF",
                        border: `1px solid ${isSel ? s.selBorder : "#D4D4D0"}`,
                        color: isSel ? s.selColor : "rgba(26,26,26,0.50)",
                      }}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Link To ── */}
          <div className="mt-4">
            <p
              className="font-['Inter'] uppercase"
              style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(14,38,70,0.30)", marginBottom: 8 }}
            >
              Link To
            </p>

            {/* Link chips */}
            <div className="flex gap-2 flex-wrap">
              {([
                { type: "animal" as LinkType, icon: <CowIcon />, label: "Animal" },
                { type: "location" as LinkType, icon: <MapPinIcon />, label: "Location" },
                { type: "group" as LinkType, icon: <FolderIcon />, label: "Group / Project" },
              ]).map(({ type, icon, label }) => {
                const isActive = activeLinks.has(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleLink(type)}
                    className="rounded-full cursor-pointer font-['Inter'] flex items-center gap-1.5 transition-all duration-150"
                    style={{
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: isActive ? 600 : 500,
                      backgroundColor: isActive ? "#F5F5F0" : "#FFFFFF",
                      border: `1px solid ${isActive ? "#0E2646" : "#D4D4D0"}`,
                      color: isActive ? "#0E2646" : "rgba(26,26,26,0.50)",
                    }}
                  >
                    {icon}
                    {label}
                  </button>
                );
              })}
            </div>

            {/* ── Animal link field ── */}
            {activeLinks.has("animal") && (
              <div className="mt-3">
                {linkedAnimal ? (
                  <div
                    className="inline-flex items-center gap-2 rounded-full font-['Inter']"
                    style={{
                      padding: "5px 10px 5px 12px",
                      fontSize: 12,
                      fontWeight: 500,
                      backgroundColor: "#F5F5F0",
                      border: "1px solid #D4D4D0",
                      color: "#1A1A1A",
                    }}
                  >
                    <span
                      className="rounded-full shrink-0"
                      style={{ width: 8, height: 8, backgroundColor: linkedAnimal.colorHex }}
                    />
                    Tag {linkedAnimal.tag} - {linkedAnimal.color} - {linkedAnimal.breed} {linkedAnimal.type}
                    <button
                      type="button"
                      onClick={() => { setLinkedAnimal(null); setAnimalSearch(""); }}
                      className="cursor-pointer ml-1"
                      style={{ background: "none", border: "none", color: "rgba(26,26,26,0.40)" }}
                    >
                      <XIcon />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <SearchSmIcon />
                    </div>
                    <input
                      type="text"
                      value={animalSearch}
                      onChange={(e) => setAnimalSearch(e.target.value)}
                      placeholder="Search by tag or EID..."
                      className="w-full h-[38px] pl-9 pr-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#55BAAA] focus:ring-2 focus:ring-[#55BAAA]/20 transition-all"
                      style={{ fontSize: 16, fontWeight: 400 }}
                    />
                    {animalResults.length > 0 && (
                      <div
                        className="absolute left-0 right-0 top-full mt-1 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-20 font-['Inter']"
                        style={{ boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
                      >
                        {animalResults.map((a) => (
                          <button
                            key={a.tag}
                            type="button"
                            onClick={() => { setLinkedAnimal(a); setAnimalSearch(""); }}
                            className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0] flex items-center gap-2.5"
                            style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", background: "none", border: "none" }}
                          >
                            <span className="rounded-full shrink-0" style={{ width: 8, height: 8, backgroundColor: a.colorHex }} />
                            Tag {a.tag} - {a.color} - {a.breed} {a.type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Location link field ── */}
            {activeLinks.has("location") && (
              <div className="mt-3" ref={locRef}>
                {linkedLocation ? (
                  <div
                    className="inline-flex items-center gap-2 rounded-full font-['Inter']"
                    style={{
                      padding: "4px 12px",
                      fontSize: 11,
                      fontWeight: 600,
                      backgroundColor: "#0E2646",
                      color: "#FFFFFF",
                    }}
                  >
                    <MapPinIcon />
                    {linkedLocation}
                    <button
                      type="button"
                      onClick={() => setLinkedLocation("")}
                      className="cursor-pointer ml-1"
                      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.60)" }}
                    >
                      <XIcon />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setLocOpen((v) => !v)}
                      className="w-full h-[38px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-left font-['Inter'] flex items-center justify-between cursor-pointer"
                      style={{ fontSize: 16, fontWeight: 400, color: "rgba(26,26,26,0.30)" }}
                    >
                      Select location&hellip;
                      <ChevronDown />
                    </button>
                    {locOpen && (
                      <div
                        className="absolute left-0 right-0 top-full mt-1 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-20 font-['Inter'] max-h-[200px] overflow-y-auto"
                        style={{ boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
                      >
                        {LOCATIONS.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => { setLinkedLocation(loc); setLocOpen(false); }}
                            className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
                            style={{ fontSize: 16, fontWeight: 500, color: "#1A1A1A", background: "none", border: "none" }}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Group / Project link field ── */}
            {activeLinks.has("group") && (
              <div className="mt-3" ref={gpRef}>
                {linkedGroupProject ? (
                  <div
                    className="inline-flex items-center gap-2 rounded-full font-['Inter']"
                    style={{
                      padding: "4px 12px",
                      fontSize: 11,
                      fontWeight: 600,
                      backgroundColor: "#0E2646",
                      color: "#FFFFFF",
                    }}
                  >
                    <FolderIcon />
                    {linkedGroupProject}
                    <button
                      type="button"
                      onClick={() => setLinkedGroupProject("")}
                      className="cursor-pointer ml-1"
                      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.60)" }}
                    >
                      <XIcon />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setGpOpen((v) => !v)}
                      className="w-full h-[38px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-left font-['Inter'] flex items-center justify-between cursor-pointer"
                      style={{ fontSize: 16, fontWeight: 400, color: "rgba(26,26,26,0.30)" }}
                    >
                      Select group or project&hellip;
                      <ChevronDown />
                    </button>
                    {gpOpen && (
                      <div
                        className="absolute left-0 right-0 top-full mt-1 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-20 font-['Inter'] max-h-[250px] overflow-y-auto"
                        style={{ boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
                      >
                        {/* Groups header */}
                        <p
                          className="px-4 pt-3 pb-1 uppercase font-['Inter']"
                          style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(14,38,70,0.30)" }}
                        >
                          Groups
                        </p>
                        {GROUPS.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => { setLinkedGroupProject(g); setGpOpen(false); }}
                            className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
                            style={{ fontSize: 16, fontWeight: 500, color: "#1A1A1A", background: "none", border: "none" }}
                          >
                            {g}
                          </button>
                        ))}
                        {/* Projects header */}
                        <p
                          className="px-4 pt-3 pb-1 uppercase font-['Inter']"
                          style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(14,38,70,0.30)", borderTop: "1px solid rgba(212,212,208,0.40)" }}
                        >
                          Projects
                        </p>
                        {PROJECTS.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => { setLinkedGroupProject(p); setGpOpen(false); }}
                            className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
                            style={{ fontSize: 16, fontWeight: 500, color: "#1A1A1A", background: "none", border: "none" }}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
         BOTTOM BUTTONS
         ══════════════════════════════ */}
      <div style={{ marginTop: 24 }}>
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-full cursor-pointer font-['Inter'] transition-all hover:brightness-95 active:scale-[0.98]"
          style={{
            height: 48,
            fontSize: 15,
            fontWeight: 700,
            color: "#1A1A1A",
            backgroundColor: "#F3D12A",
            border: "none",
          }}
        >
          Save
        </button>

        {!isNew && (
          <button
            type="button"
            onClick={() => {
              showToast("success", "Entry deleted");
              navigate("/red-book");
            }}
            className="w-full mt-3 cursor-pointer font-['Inter'] transition-opacity hover:opacity-80"
            style={{
              background: "none",
              border: "none",
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(231,76,60,0.60)",
              padding: "8px 0",
            }}
          >
            Delete Entry
          </button>
        )}
      </div>
    </div>
  );
}
