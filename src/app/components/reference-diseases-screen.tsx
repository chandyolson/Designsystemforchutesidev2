import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { useToast } from "./toast-context";

/* ── Category types & colors ── */
type Category = "Respiratory" | "Reproductive" | "Digestive" | "Infectious" | "Metabolic" | "Parasitic" | "Other";

const CATEGORY_STYLES: Record<Category, { bg: string; color: string }> = {
  Respiratory:  { bg: "#E3F2FD", color: "#1565C0" },
  Reproductive: { bg: "#F3E5F5", color: "#6A1B9A" },
  Digestive:    { bg: "#FFF3E0", color: "#E65100" },
  Infectious:   { bg: "#FFEBEE", color: "#C62828" },
  Metabolic:    { bg: "#E8F5E9", color: "#2E7D32" },
  Parasitic:    { bg: "#FFF8E1", color: "#B8860B" },
  Other:        { bg: "#F5F5F0", color: "rgba(26,26,26,0.50)" },
};

const FILTER_CATEGORIES = ["All", "Common", "Respiratory", "Reproductive", "Digestive", "Other"] as const;
type FilterChip = (typeof FILTER_CATEGORIES)[number];

/* ── Disease data ── */
interface Disease {
  id: string;
  name: string;
  category: Category;
  description: string;
  starred: boolean;
}

const INITIAL_DISEASES: Disease[] = [
  // 6 starred
  { id: "d1",  name: "BRD (Bovine Respiratory Disease)", category: "Respiratory",  description: "Pneumonia complex, most common feedlot illness", starred: true },
  { id: "d2",  name: "Scours",                          category: "Digestive",     description: "Calf diarrhea, multiple causes",                starred: true },
  { id: "d3",  name: "Pinkeye",                         category: "Infectious",    description: "Infectious bovine keratoconjunctivitis",        starred: true },
  { id: "d4",  name: "Foot Rot",                        category: "Infectious",    description: "Interdigital necrobacillosis",                  starred: true },
  { id: "d5",  name: "BVD (Bovine Viral Diarrhea)",     category: "Reproductive",  description: "Persistent infection, reproductive loss",       starred: true },
  { id: "d6",  name: "Anaplasmosis",                    category: "Parasitic",     description: "Tick-borne blood parasite",                     starred: true },
  // 18 unstarred
  { id: "d7",  name: "Blackleg",                                category: "Infectious",    description: "Clostridial myositis",                  starred: false },
  { id: "d8",  name: "Hardware Disease",                        category: "Digestive",     description: "Traumatic reticulopericarditis",         starred: false },
  { id: "d9",  name: "Lump Jaw",                                category: "Infectious",    description: "Actinomycosis",                         starred: false },
  { id: "d10", name: "Mastitis",                                category: "Reproductive",  description: "Udder infection",                       starred: false },
  { id: "d11", name: "Pneumonia",                               category: "Respiratory",   description: "Bacterial or viral lung infection",      starred: false },
  { id: "d12", name: "Trichomoniasis",                          category: "Reproductive",  description: "Venereal disease in bulls",              starred: false },
  { id: "d13", name: "White Muscle Disease",                    category: "Metabolic",     description: "Selenium/Vitamin E deficiency",          starred: false },
  { id: "d14", name: "Wooden Tongue",                           category: "Infectious",    description: "Actinobacillosis",                      starred: false },
  { id: "d15", name: "Johne's Disease",                         category: "Digestive",     description: "Paratuberculosis, chronic wasting",      starred: false },
  { id: "d16", name: "Leptospirosis",                           category: "Reproductive",  description: "Lepto, reproductive loss",               starred: false },
  { id: "d17", name: "Infectious Bovine Rhinotracheitis",       category: "Respiratory",   description: "IBR, red nose",                          starred: false },
  { id: "d18", name: "Coccidiosis",                             category: "Parasitic",     description: "Parasitic intestinal infection",          starred: false },
  { id: "d19", name: "Tetanus",                                 category: "Infectious",    description: "Clostridial neurological disease",        starred: false },
  { id: "d20", name: "Bloat",                                   category: "Digestive",     description: "Ruminal tympany",                        starred: false },
  { id: "d21", name: "Grass Tetany",                            category: "Metabolic",     description: "Hypomagnesemia",                         starred: false },
  { id: "d22", name: "Milk Fever",                              category: "Metabolic",     description: "Hypocalcemia, periparturient",            starred: false },
  { id: "d23", name: "Ketosis",                                 category: "Metabolic",     description: "Acetonemia, energy imbalance",            starred: false },
  { id: "d24", name: "Ringworm",                                category: "Other",         description: "Dermatophytosis, fungal skin infection",  starred: false },
];

const INITIAL_PAGE = 8;

/* ── Icons ── */
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

function StarIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="shrink-0">
      <path
        d="M11 2L13.6 7.8L20 8.6L15.5 13L16.8 19.4L11 16.2L5.2 19.4L6.5 13L2 8.6L8.4 7.8L11 2Z"
        fill="#F3D12A" stroke="#F3D12A" strokeWidth="1" strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="shrink-0">
      <path
        d="M11 2L13.6 7.8L20 8.6L15.5 13L16.8 19.4L11 16.2L5.2 19.4L6.5 13L2 8.6L8.4 7.8L11 2Z"
        stroke="#D4D4D0" strokeWidth="1.3" strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M4.5 2.5L8 6L4.5 9.5" stroke="#1A1A1A" strokeOpacity="0.20" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-px">
      <circle cx="8" cy="8" r="6.5" stroke="#2196F3" strokeWidth="1.2" />
      <path d="M8 7V11" stroke="#2196F3" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="#2196F3" />
    </svg>
  );
}

/* ── Category Pill ── */
function CategoryPill({ category }: { category: Category }) {
  const style = CATEGORY_STYLES[category];
  return (
    <span
      className="inline-flex items-center rounded-full font-['Inter']"
      style={{
        padding: "1px 8px",
        fontSize: 10,
        fontWeight: 700,
        backgroundColor: style.bg,
        color: style.color,
      }}
    >
      {category}
    </span>
  );
}

/* ── Disease Row ── */
function DiseaseRow({
  disease,
  onToggleStar,
  onTap,
}: {
  disease: Disease;
  onToggleStar: (id: string) => void;
  onTap: (id: string) => void;
}) {
  return (
    <div
      onClick={() => onTap(disease.id)}
      className="flex items-center justify-between gap-3 cursor-pointer active:bg-[#F5F5F0] transition-colors"
      style={{ padding: "12px 16px" }}
    >
      {/* Left */}
      <div className="min-w-0 flex-1">
        <p
          className="font-['Inter'] truncate"
          style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.4 }}
        >
          {disease.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <CategoryPill category={disease.category} />
          <p
            className="font-['Inter'] truncate"
            style={{ fontSize: 12, color: "rgba(26,26,26,0.35)", lineHeight: 1.4 }}
          >
            {disease.description}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(disease.id);
          }}
          className="flex items-center justify-center cursor-pointer p-0.5"
          aria-label={disease.starred ? "Remove from common" : "Mark as common"}
        >
          <StarIcon filled={disease.starred} />
        </button>
        <ChevronRight />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   DISEASES REFERENCE SCREEN
   ══════════════════════════════════════════════════ */
export function ReferenceDiseasesScreen() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [diseases, setDiseases] = useState<Disease[]>(INITIAL_DISEASES);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterChip>("All");
  const [allPageCount, setAllPageCount] = useState(INITIAL_PAGE);
  const chipScrollRef = useRef<HTMLDivElement>(null);

  /* ── Toggle star ── */
  const toggleStar = (id: string) => {
    setDiseases((prev) =>
      prev.map((d) => (d.id === id ? { ...d, starred: !d.starred } : d))
    );
    const target = diseases.find((d) => d.id === id);
    if (target) {
      showToast(
        "success",
        target.starred
          ? `${target.name} removed from common`
          : `${target.name} marked as common`
      );
    }
  };

  /* ── Derived lists ── */
  const filtered = useMemo(() => {
    let list = diseases;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeFilter === "Common") {
      list = list.filter((d) => d.starred);
    } else if (activeFilter !== "All") {
      // Map "Other" to include Other + anything not in the named chips
      if (activeFilter === "Other") {
        const named = ["Respiratory", "Reproductive", "Digestive"];
        list = list.filter((d) => !named.includes(d.category));
      } else {
        list = list.filter((d) => d.category === activeFilter);
      }
    }

    return list;
  }, [diseases, search, activeFilter]);

  const starredDiseases = useMemo(() => filtered.filter((d) => d.starred), [filtered]);
  const unstarredDiseases = useMemo(() => filtered.filter((d) => !d.starred), [filtered]);
  const totalCommon = diseases.filter((d) => d.starred).length;

  const visibleUnstarred = unstarredDiseases.slice(0, allPageCount);
  const hasMore = allPageCount < unstarredDiseases.length;

  const handleSearch = (val: string) => {
    setSearch(val);
    setAllPageCount(INITIAL_PAGE);
  };

  const handleFilter = (chip: FilterChip) => {
    setActiveFilter(chip);
    setAllPageCount(INITIAL_PAGE);
  };

  return (
    <div className="font-['Inter']" style={{ padding: 20 }}>
      {/* ── Search bar ── */}
      <div
        className="flex items-center gap-2.5 rounded-lg bg-white border border-[#D4D4D0] transition-all focus-within:border-[#F3D12A] focus-within:ring-2 focus-within:ring-[#F3D12A]/25"
        style={{ height: 40, padding: "0 12px" }}
      >
        <SearchIcon />
        <input
          type="text"
          placeholder="Search diseases..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none"
          style={{ fontSize: 16, fontWeight: 400 }}
        />
        {search && (
          <button
            type="button"
            onClick={() => handleSearch("")}
            className="flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {/* ── Filter chips ── */}
      <div
        ref={chipScrollRef}
        className="flex gap-2 mt-3 overflow-x-auto no-scrollbar"
        style={{ paddingBottom: 2 }}
      >
        {FILTER_CATEGORIES.map((chip) => {
          const isActive = activeFilter === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => handleFilter(chip)}
              className="shrink-0 rounded-full cursor-pointer font-['Inter'] transition-all"
              style={{
                padding: "5px 14px",
                fontSize: 12,
                fontWeight: 600,
                border: isActive ? "1px solid #0E2646" : "1px solid #D4D4D0",
                backgroundColor: isActive ? "#0E2646" : "#FFFFFF",
                color: isActive ? "#FFFFFF" : "#1A1A1A",
              }}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* ── Result count ── */}
      <p
        className="font-['Inter'] mt-3 mb-3 px-1"
        style={{ fontSize: 11, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}
      >
        {filtered.length} disease{filtered.length !== 1 ? "s" : ""} · {totalCommon} common
      </p>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="rounded-xl bg-white border border-[#D4D4D0] overflow-hidden">
          <div
            className="flex flex-col items-center justify-center font-['Inter']"
            style={{ padding: "40px 20px" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-3">
              <circle cx="14" cy="14" r="9" stroke="#1A1A1A" strokeOpacity="0.12" strokeWidth="2" />
              <path d="M21 21L28 28" stroke="#1A1A1A" strokeOpacity="0.12" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>
              No diseases found
            </p>
            <p style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.35)" }}>
              Try a different search or filter
            </p>
          </div>
        </div>
      )}

      {/* ── SECTION 1: Common For Your Operation ── */}
      {starredDiseases.length > 0 && (
        <div>
          {/* Section header */}
          <div className="flex items-center justify-between px-1 mb-2">
            <p
              className="font-['Inter'] uppercase"
              style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(14,38,70,0.35)" }}
            >
              Common for Your Operation
            </p>
            <p
              className="font-['Inter']"
              style={{ fontSize: 11, fontWeight: 700, color: "rgba(14,38,70,0.35)" }}
            >
              {starredDiseases.length}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-xl bg-white border border-[#D4D4D0] overflow-hidden divide-y divide-[#D4D4D0]/40">
            {starredDiseases.map((d) => (
              <DiseaseRow key={d.id} disease={d} onToggleStar={toggleStar} onTap={(id) => navigate(`/reference/diseases/${id}`)} />
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 2: All Diseases ── */}
      {unstarredDiseases.length > 0 && (
        <div style={{ marginTop: starredDiseases.length > 0 ? 12 : 0 }}>
          {/* Section header */}
          <div className="flex items-center justify-between px-1 mb-2">
            <p
              className="font-['Inter'] uppercase"
              style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(14,38,70,0.35)" }}
            >
              All Diseases
            </p>
            <p
              className="font-['Inter']"
              style={{ fontSize: 11, fontWeight: 700, color: "rgba(14,38,70,0.35)" }}
            >
              {unstarredDiseases.length}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-xl bg-white border border-[#D4D4D0] overflow-hidden divide-y divide-[#D4D4D0]/40">
            {visibleUnstarred.map((d) => (
              <DiseaseRow key={d.id} disease={d} onToggleStar={toggleStar} onTap={(id) => navigate(`/reference/diseases/${id}`)} />
            ))}

            {/* Load More */}
            {hasMore && (
              <button
                type="button"
                onClick={() => setAllPageCount((c) => c + INITIAL_PAGE)}
                className="w-full cursor-pointer transition-colors hover:bg-[#F5F5F0] font-['Inter']"
                style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#55BAAA" }}
              >
                Load More
                <span
                  className="font-['Inter'] ml-1.5"
                  style={{ fontSize: 11, fontWeight: 500, color: "rgba(26,26,26,0.25)" }}
                >
                  ({unstarredDiseases.length - allPageCount} remaining)
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Info card ── */}
      <div
        className="flex items-start gap-2.5 rounded-lg mt-5 font-['Inter']"
        style={{ padding: "12px 16px", backgroundColor: "#E3F2FD" }}
      >
        <InfoIcon />
        <p style={{ fontSize: 12, fontWeight: 500, color: "#0D47A1", lineHeight: 1.5 }}>
          This is a global disease list. Tap the star to mark diseases common to your operation. Tap any disease for details and treatment info.
        </p>
      </div>
    </div>
  );
}