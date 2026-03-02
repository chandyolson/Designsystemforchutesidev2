import { useState, useRef, useEffect } from "react";

/* ══════════════════════════════════════════
   Types & Data
   ══════════════════════════════════════════ */
type TabId = "timeline" | "animals" | "projects";

/* ── Timeline ── */
type TimelineEventType = "created" | "added" | "removed" | "project" | "status";

const EVENT_COLORS: Record<TimelineEventType, string> = {
  created: "#55BAAA",
  added: "#2196F3",
  removed: "#E74C3C",
  project: "#F3D12A",
  status: "#9E9E9E",
};

interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  detail: string;
  date: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "t1", type: "added", title: "12 heifers added", detail: "Moved from Replacement Heifers group", date: "Feb 28, 2026" },
  { id: "t2", type: "project", title: "Spring Preg Check linked", detail: "Project #SPR-2026-02 · 87 head", date: "Feb 20, 2026" },
  { id: "t3", type: "removed", title: "3 animals removed", detail: "Tag 2201 (Sold), Tag 3340 (Died), Tag 4410 (Culled)", date: "Feb 15, 2026" },
  { id: "t4", type: "added", title: "24 cows added", detail: "Bulk import from 2025 Fall group", date: "Feb 1, 2026" },
  { id: "t5", type: "project", title: "Pre-Calving Processing linked", detail: "Project #PRE-2026-01 · 75 head", date: "Jan 28, 2026" },
  { id: "t6", type: "added", title: "51 cows added", detail: "Initial group population", date: "Jan 18, 2026" },
  { id: "t7", type: "status", title: "Status set to Active", detail: "", date: "Jan 15, 2026" },
  { id: "t8", type: "created", title: "Group created", detail: "Created by John Olson", date: "Jan 15, 2026" },
];

/* ── Animals ── */
type MembershipStatus = "Active" | "Removed" | "Sold" | "Died";

interface AnimalRow {
  id: string;
  tag: string;
  tagColor: string;
  breed: string;
  animalType: string;
  yearBorn: string;
  status: MembershipStatus;
}

const TAG_COLORS: Record<string, string> = {
  pink: "#E91E90",
  yellow: "#F3D12A",
  green: "#4CAF50",
  orange: "#FF9800",
  blue: "#2196F3",
  white: "#D4D4D0",
};

const ANIMALS: AnimalRow[] = [
  { id: "a1", tag: "3309", tagColor: "pink", breed: "Angus", animalType: "Cow", yearBorn: "2020", status: "Active" },
  { id: "a2", tag: "4782", tagColor: "yellow", breed: "Angus", animalType: "Cow", yearBorn: "2019", status: "Active" },
  { id: "a3", tag: "5520", tagColor: "green", breed: "Charolais", animalType: "Cow", yearBorn: "2021", status: "Active" },
  { id: "a4", tag: "2218", tagColor: "orange", breed: "Simmental", animalType: "Cow", yearBorn: "2018", status: "Active" },
  { id: "a5", tag: "1147", tagColor: "blue", breed: "Hereford", animalType: "Heifer", yearBorn: "2023", status: "Active" },
  { id: "a6", tag: "2201", tagColor: "white", breed: "Red Angus", animalType: "Cow", yearBorn: "2019", status: "Sold" },
  { id: "a7", tag: "3340", tagColor: "yellow", breed: "Angus", animalType: "Cow", yearBorn: "2017", status: "Died" },
  { id: "a8", tag: "4410", tagColor: "pink", breed: "Angus x Hereford", animalType: "Cow", yearBorn: "2018", status: "Removed" },
];

const STATUS_PILL_STYLES: Record<string, { bg: string; color: string }> = {
  Removed: { bg: "#FFF3E0", color: "#E65100" },
  Sold: { bg: "#E3F2FD", color: "#1565C0" },
  Died: { bg: "#FFEBEE", color: "#C62828" },
};

/* ── Projects ── */
type ProjectStatus = "Open" | "Closed";

interface ProjectRow {
  id: string;
  name: string;
  workType: string;
  date: string;
  headCount: number;
  status: ProjectStatus;
}

const PROJECTS: ProjectRow[] = [
  { id: "p1", name: "Spring Preg Check", workType: "Preg Check", date: "Feb 20, 2026", headCount: 87, status: "Open" },
  { id: "p2", name: "Pre-Calving Processing", workType: "Processing", date: "Jan 28, 2026", headCount: 75, status: "Open" },
  { id: "p3", name: "Fall Vaccination Booster", workType: "Processing", date: "Nov 12, 2025", headCount: 68, status: "Closed" },
  { id: "p4", name: "AI Breeding - Spring", workType: "AI", date: "Oct 5, 2025", headCount: 62, status: "Closed" },
  { id: "p5", name: "Weaning 2025", workType: "Weaning", date: "Sep 15, 2025", headCount: 45, status: "Closed" },
];

/* ══════════════════════════════════════════
   Icons
   ══════════════════════════════════════════ */
function DotsIconWhite() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3.5" r="1.25" fill="white" fillOpacity="0.40" />
      <circle cx="8" cy="8" r="1.25" fill="white" fillOpacity="0.40" />
      <circle cx="8" cy="12.5" r="1.25" fill="white" fillOpacity="0.40" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="white" strokeOpacity="0.30" strokeWidth="1.2" />
      <path d="M1.5 5.5H12.5" stroke="white" strokeOpacity="0.30" strokeWidth="1.2" />
      <path d="M4.5 1V3.5M9.5 1V3.5" stroke="white" strokeOpacity="0.30" strokeWidth="1.2" strokeLinecap="round" />
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
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="#0E2646" strokeOpacity="0.2" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   Summary Card
   ══════════════════════════════════════════ */
function SummaryCard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div
      className="rounded-2xl relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0E2646 0%, #153566 100%)",
        padding: 20,
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <p
          className="font-['Inter']"
          style={{ fontSize: 17, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.2 }}
        >
          2026 Spring Calving
        </p>
        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center cursor-pointer"
            style={{ width: 28, height: 28, background: "none", border: "none", padding: 0 }}
            aria-label="Group actions"
          >
            <DotsIconWhite />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-[32px] z-30 w-40 rounded-xl bg-white border border-[#D4D4D0] shadow-lg overflow-hidden font-['Inter']">
              {["Edit Group", "Add Animals", "Archive", "Delete"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: item === "Delete" ? "#9B2335" : "#1A1A1A",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pills */}
      <div className="flex items-center gap-2 mt-2">
        <span
          className="inline-flex items-center rounded-full font-['Inter']"
          style={{
            padding: "1px 8px",
            fontSize: 10,
            fontWeight: 700,
            color: "rgba(255,255,255,0.70)",
            backgroundColor: "rgba(255,255,255,0.10)",
          }}
        >
          Season
        </span>
        <span
          className="inline-flex items-center rounded-full font-['Inter']"
          style={{
            padding: "1px 8px",
            fontSize: 10,
            fontWeight: 700,
            color: "#55BAAA",
            backgroundColor: "rgba(85,186,170,0.20)",
          }}
        >
          Active
        </span>
      </div>

      {/* Stats 2×2 grid */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {[
          { value: "87", label: "CURRENT HEAD" },
          { value: "94", label: "ALL TIME" },
          { value: "5", label: "PROJECTS" },
          { value: "7", label: "REMOVED" },
        ].map((stat) => (
          <div key={stat.label}>
            <p
              className="font-['Inter']"
              style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.2 }}
            >
              {stat.value}
            </p>
            <p
              className="font-['Inter'] uppercase"
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "rgba(255,255,255,0.40)",
                letterSpacing: "0.06em",
                marginTop: 2,
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Date range */}
      <div className="flex items-center gap-1.5 mt-3">
        <CalendarIcon />
        <p
          className="font-['Inter']"
          style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.45)" }}
        >
          Jan 15, 2026 – May 30, 2026
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Tab Bar
   ══════════════════════════════════════════ */
function TabBar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  const tabs: { id: TabId; label: string }[] = [
    { id: "timeline", label: "Timeline" },
    { id: "animals", label: "Animals" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <div className="flex w-full border-b border-[#D4D4D0]/40">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="flex-1 text-center cursor-pointer font-['Inter'] pb-2.5 transition-colors"
            style={{
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "#0E2646" : "rgba(26,26,26,0.35)",
              borderBottom: isActive ? "2px solid #F3D12A" : "2px solid transparent",
              background: "none",
              border: "none",
              borderBottomWidth: 2,
              borderBottomStyle: "solid",
              borderBottomColor: isActive ? "#F3D12A" : "transparent",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════
   Timeline Tab
   ══════════════════════════════════════════ */
function TimelineTab() {
  return (
    <div className="mt-4">
      <div className="relative" style={{ paddingLeft: 16 }}>
        {/* Vertical line */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: 16,
            width: 2,
            backgroundColor: "#D4D4D0",
          }}
        />

        {TIMELINE_EVENTS.map((event, idx) => {
          const color = EVENT_COLORS[event.type];
          const isLast = idx === TIMELINE_EVENTS.length - 1;
          return (
            <div key={event.id} className="relative flex items-start" style={{ paddingBottom: isLast ? 0 : 20 }}>
              {/* Node */}
              <div
                className="absolute rounded-full shrink-0"
                style={{
                  left: 0,
                  top: 4,
                  width: 10,
                  height: 10,
                  backgroundColor: color,
                  border: "2px solid #F5F5F0",
                  zIndex: 2,
                  marginLeft: -4,
                }}
              />

              {/* Content */}
              <div style={{ marginLeft: 16 }}>
                <p
                  className="font-['Inter']"
                  style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.4 }}
                >
                  {event.title}
                </p>
                {event.detail && (
                  <p
                    className="font-['Inter'] mt-0.5"
                    style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.45)", lineHeight: 1.4 }}
                  >
                    {event.detail}
                  </p>
                )}
                <p
                  className="font-['Inter'] mt-0.5"
                  style={{ fontSize: 11, fontWeight: 400, color: "rgba(26,26,26,0.25)" }}
                >
                  {event.date}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-5">
        <button
          type="button"
          className="font-['Inter'] cursor-pointer transition-colors hover:opacity-75"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#55BAAA",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          Load More
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Animals Tab
   ══════════════════════════════════════════ */
type AnimalFilter = "All" | "Active" | "Removed" | "Sold" | "Died";

const FILTER_OPTIONS: { value: AnimalFilter; label: string; count: number }[] = [
  { value: "All", label: "All", count: 87 },
  { value: "Active", label: "Active", count: 80 },
  { value: "Removed", label: "Removed", count: 4 },
  { value: "Sold", label: "Sold", count: 2 },
  { value: "Died", label: "Died", count: 1 },
];

function AnimalsTab() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AnimalFilter>("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const searchLower = search.toLowerCase().trim();
  const filtered = ANIMALS.filter((a) => {
    if (filter !== "All" && a.status !== filter) return false;
    if (searchLower && !a.tag.includes(searchLower) && !a.breed.toLowerCase().includes(searchLower)) return false;
    return true;
  });

  const activeCount = ANIMALS.filter((a) => a.status === "Active").length;
  const removedCount = ANIMALS.filter((a) => a.status !== "Active").length;
  const currentFilterOption = FILTER_OPTIONS.find((f) => f.value === filter)!;

  return (
    <div className="mt-4">
      {/* Toolbar: search + filter */}
      <div className="flex items-center gap-2 mb-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search animals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[38px] pl-9 pr-8 rounded-lg bg-white border border-[#D4D4D0] font-['Inter'] text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#55BAAA] focus:ring-2 focus:ring-[#55BAAA]/15"
            style={{ fontSize: 16 }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ background: "none", border: "none", padding: 0 }}
              aria-label="Clear"
            >
              <ClearIcon />
            </button>
          )}
        </div>

        {/* Filter dropdown */}
        <div ref={dropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 rounded-lg bg-white border border-[#D4D4D0] cursor-pointer font-['Inter'] transition-colors hover:bg-[#F5F5F0]"
            style={{ height: 38, padding: "0 10px", fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}
          >
            {currentFilterOption.label} ({currentFilterOption.count})
            <ChevronDownSmall />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-[42px] z-20 w-40 rounded-xl bg-white border border-[#D4D4D0] shadow-lg overflow-hidden font-['Inter']">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setFilter(opt.value); setDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
                  style={{
                    fontSize: 13,
                    fontWeight: filter === opt.value ? 700 : 500,
                    color: filter === opt.value ? "#0E2646" : "#1A1A1A",
                  }}
                >
                  {opt.label} ({opt.count})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Result count */}
      <p
        className="font-['Inter'] mb-2"
        style={{ fontSize: 11, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}
      >
        {activeCount} active · {removedCount} removed
      </p>

      {/* Animal list */}
      <div className="rounded-xl bg-white border border-[#D4D4D0] overflow-hidden divide-y divide-[#D4D4D0]/40">
        {filtered.length > 0 ? (
          filtered.map((animal) => {
            const dotColor = TAG_COLORS[animal.tagColor] || "#D4D4D0";
            const statusStyle = STATUS_PILL_STYLES[animal.status];
            return (
              <button
                key={animal.id}
                type="button"
                className="w-full flex items-center justify-between gap-3 cursor-pointer transition-colors active:bg-[#F5F5F0] text-left font-['Inter']"
                style={{ padding: "12px 16px" }}
              >
                {/* Left */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full shrink-0"
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: dotColor,
                        border: animal.tagColor === "white" ? "1px solid #B0B0B0" : "none",
                      }}
                    />
                    <p
                      className="truncate"
                      style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.3 }}
                    >
                      {animal.tag}
                    </p>
                  </div>
                  <p
                    className="truncate mt-0.5"
                    style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.40)", marginLeft: 16 }}
                  >
                    {animal.breed} · {animal.animalType} · {animal.yearBorn}
                  </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 shrink-0">
                  {statusStyle && (
                    <span
                      className="inline-flex items-center rounded-full font-['Inter']"
                      style={{
                        padding: "1px 8px",
                        fontSize: 10,
                        fontWeight: 700,
                        color: statusStyle.color,
                        backgroundColor: statusStyle.bg,
                      }}
                    >
                      {animal.status}
                    </span>
                  )}
                  <ChevronRight />
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center font-['Inter']" style={{ padding: "32px 20px" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}>
              No animals found
            </p>
            <p className="mt-1" style={{ fontSize: 12, color: "rgba(26,26,26,0.20)" }}>
              Try a different search or filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Projects Tab
   ══════════════════════════════════════════ */
function ProjectsTab() {
  return (
    <div className="mt-4">
      <div className="rounded-xl bg-white border border-[#D4D4D0] overflow-hidden divide-y divide-[#D4D4D0]/40">
        {PROJECTS.map((project) => {
          const isOpen = project.status === "Open";
          return (
            <button
              key={project.id}
              type="button"
              className="w-full flex items-center justify-between gap-3 cursor-pointer transition-colors active:bg-[#F5F5F0] text-left font-['Inter']"
              style={{ padding: "14px 16px" }}
            >
              {/* Left */}
              <div className="min-w-0 flex-1">
                <p
                  className="truncate"
                  style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.3 }}
                >
                  {project.name}
                </p>
                <p
                  className="truncate mt-0.5"
                  style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.40)" }}
                >
                  {project.workType} · {project.date} · {project.headCount} head
                </p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="inline-flex items-center rounded-full font-['Inter']"
                  style={{
                    padding: "1px 8px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: isOpen ? "#55BAAA" : "rgba(26,26,26,0.35)",
                    backgroundColor: isOpen ? "rgba(85,186,170,0.10)" : "#F5F5F0",
                  }}
                >
                  {project.status}
                </span>
                <ChevronRight />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN
   ══════════════════════════════════════════ */
export function GroupDetailScreen() {
  const [activeTab, setActiveTab] = useState<TabId>("timeline");

  return (
    <div className="font-['Inter']" style={{ padding: 0 }}>
      {/* Summary Card */}
      <SummaryCard />

      {/* Tab Bar */}
      <div className="mt-4">
        <TabBar active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      {activeTab === "timeline" && <TimelineTab />}
      {activeTab === "animals" && <AnimalsTab />}
      {activeTab === "projects" && <ProjectsTab />}
    </div>
  );
}
