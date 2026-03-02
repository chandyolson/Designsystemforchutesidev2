import { useState, useMemo } from "react";
import { useToast } from "./toast-context";

/* ══════════════════════════════════════════
   Types & Data
   ══════════════════════════════════════════ */
interface Breed {
  id: string;
  name: string;
  code: string;
  type: "Beef" | "Dairy" | "Dual" | "Cross";
}

const ALL_BREEDS: Breed[] = [
  { id: "b1", name: "Angus", code: "AN", type: "Beef" },
  { id: "b2", name: "Hereford", code: "HH", type: "Beef" },
  { id: "b3", name: "Angus x Hereford", code: "ANHH", type: "Cross" },
  { id: "b4", name: "Red Angus", code: "AR", type: "Beef" },
  { id: "b5", name: "Simmental", code: "SM", type: "Beef" },
  { id: "b6", name: "Brahman", code: "BR", type: "Beef" },
  { id: "b7", name: "Charolais", code: "CH", type: "Beef" },
  { id: "b8", name: "Gelbvieh", code: "GV", type: "Beef" },
  { id: "b9", name: "Limousin", code: "LM", type: "Beef" },
  { id: "b10", name: "Maine-Anjou", code: "MA", type: "Beef" },
  { id: "b11", name: "Shorthorn", code: "SH", type: "Beef" },
  { id: "b12", name: "Wagyu", code: "WG", type: "Beef" },
  { id: "b13", name: "Beefmaster", code: "BM", type: "Beef" },
  { id: "b14", name: "Brangus", code: "BN", type: "Beef" },
  { id: "b15", name: "Santa Gertrudis", code: "SG", type: "Beef" },
  { id: "b16", name: "Piedmontese", code: "PI", type: "Beef" },
  { id: "b17", name: "Salers", code: "SA", type: "Beef" },
  { id: "b18", name: "Tarentaise", code: "TA", type: "Beef" },
  { id: "b19", name: "Murray Grey", code: "MG", type: "Beef" },
  { id: "b20", name: "Dexter", code: "DX", type: "Beef" },
  { id: "b21", name: "Highland", code: "HI", type: "Beef" },
  { id: "b22", name: "Galloway", code: "GA", type: "Beef" },
  { id: "b23", name: "South Devon", code: "SD", type: "Beef" },
  { id: "b24", name: "Chianina", code: "CI", type: "Beef" },
  { id: "b25", name: "Devon", code: "DV", type: "Beef" },
  { id: "b26", name: "Corriente", code: "CO", type: "Beef" },
  { id: "b27", name: "Longhorn", code: "LH", type: "Beef" },
  { id: "b28", name: "Pinzgauer", code: "PZ", type: "Beef" },
  { id: "b29", name: "Braunvieh", code: "BV", type: "Dual" },
  { id: "b30", name: "Simmental x Angus", code: "SMAN", type: "Cross" },
  { id: "b31", name: "Hereford x Angus", code: "HHAN", type: "Cross" },
  { id: "b32", name: "Charolais x Angus", code: "CHAN", type: "Cross" },
  { id: "b33", name: "Limousin x Angus", code: "LMAN", type: "Cross" },
  { id: "b34", name: "Holstein", code: "HO", type: "Dairy" },
  { id: "b35", name: "Jersey", code: "JE", type: "Dairy" },
  { id: "b36", name: "Brown Swiss", code: "BS", type: "Dairy" },
  { id: "b37", name: "Guernsey", code: "GU", type: "Dairy" },
  { id: "b38", name: "Ayrshire", code: "AY", type: "Dairy" },
  { id: "b39", name: "Milking Shorthorn", code: "MS", type: "Dairy" },
  { id: "b40", name: "Normande", code: "NO", type: "Dual" },
  { id: "b41", name: "Senepol", code: "SE", type: "Beef" },
  { id: "b42", name: "Nelore", code: "NE", type: "Beef" },
  { id: "b43", name: "Bonsmara", code: "BO", type: "Beef" },
  { id: "b44", name: "Mashona", code: "MH", type: "Beef" },
  { id: "b45", name: "Tuli", code: "TU", type: "Beef" },
  { id: "b46", name: "Romagnola", code: "RO", type: "Beef" },
  { id: "b47", name: "Marchigiana", code: "MC", type: "Beef" },
  { id: "b48", name: "Parthenais", code: "PA", type: "Beef" },
];

const INITIAL_PREFERRED = new Set(["b1", "b2", "b3", "b4", "b5"]);
const INITIAL_PAGE_SIZE = 7;
const LOAD_MORE_SIZE = 12;

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

function StarFilled() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 2.5L13.5 7.6L19.2 8.4L15.1 12.4L16 18.1L11 15.4L6 18.1L6.9 12.4L2.8 8.4L8.5 7.6L11 2.5Z"
        fill="#F3D12A"
        stroke="#F3D12A"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarOutline() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 2.5L13.5 7.6L19.2 8.4L15.1 12.4L16 18.1L11 15.4L6 18.1L6.9 12.4L2.8 8.4L8.5 7.6L11 2.5Z"
        stroke="#D4D4D0"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
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

/* ══════════════════════════════════════════
   Section Label
   ══════════════════════════════════════════ */
function SectionLabel({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <div className="flex items-center justify-between mb-2 px-1">
      <p
        className="text-[#0E2646] font-['Inter'] uppercase"
        style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", opacity: 0.35 }}
      >
        {children}
      </p>
      {count !== undefined && (
        <span
          className="font-['Inter'] text-[#0E2646]/25"
          style={{ fontSize: 10, fontWeight: 600 }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Breed Row
   ══════════════════════════════════════════ */
function BreedRow({
  breed,
  starred,
  onToggle,
}: {
  breed: Breed;
  starred: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between font-['Inter']"
      style={{ padding: "12px 16px" }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="truncate"
          style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.3 }}
        >
          {breed.name}
        </p>
        <p
          className="truncate mt-0.5"
          style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.35)" }}
        >
          {breed.code} · {breed.type}
        </p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="shrink-0 flex items-center justify-center cursor-pointer transition-transform active:scale-110"
        style={{ width: 36, height: 36, background: "none", border: "none", padding: 0 }}
        aria-label={starred ? `Remove ${breed.name} from preferred` : `Add ${breed.name} to preferred`}
      >
        {starred ? <StarFilled /> : <StarOutline />}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN
   ══════════════════════════════════════════ */
export function ReferenceBreedsScreen() {
  const { showToast } = useToast();

  /* ── State ── */
  const [preferred, setPreferred] = useState<Set<string>>(new Set(INITIAL_PREFERRED));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "preferred">("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);

  /* ── Toggle star ── */
  function togglePreferred(id: string) {
    const breed = ALL_BREEDS.find((b) => b.id === id);
    const wasPreferred = preferred.has(id);

    setPreferred((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    if (breed) {
      if (wasPreferred) {
        showToast("info", `${breed.name} removed from preferred`);
      } else {
        showToast("success", `${breed.name} added to preferred`);
      }
    }
  }

  /* ── Filtered / searched lists ── */
  const searchLower = search.toLowerCase().trim();

  const preferredBreeds = useMemo(
    () =>
      ALL_BREEDS.filter(
        (b) =>
          preferred.has(b.id) &&
          (searchLower === "" ||
            b.name.toLowerCase().includes(searchLower) ||
            b.code.toLowerCase().includes(searchLower))
      ),
    [preferred, searchLower]
  );

  const nonPreferredBreeds = useMemo(
    () =>
      ALL_BREEDS.filter(
        (b) =>
          !preferred.has(b.id) &&
          (searchLower === "" ||
            b.name.toLowerCase().includes(searchLower) ||
            b.code.toLowerCase().includes(searchLower))
      ),
    [preferred, searchLower]
  );

  const totalFiltered = filter === "preferred" ? preferredBreeds.length : preferredBreeds.length + nonPreferredBreeds.length;
  const visibleNonPreferred = nonPreferredBreeds.slice(0, visibleCount);
  const hasMore = visibleCount < nonPreferredBreeds.length;

  return (
    <div className="font-['Inter']" style={{ padding: 20 }}>
      {/* ── Search Bar ── */}
      <div className="relative mb-3">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search breeds..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(INITIAL_PAGE_SIZE);
          }}
          className="w-full h-[40px] pl-9 pr-9 rounded-lg bg-white border border-[#D4D4D0] font-['Inter'] text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#55BAAA] focus:ring-2 focus:ring-[#55BAAA]/15"
          style={{ fontSize: 16 }}
        />
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); setVisibleCount(INITIAL_PAGE_SIZE); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ background: "none", border: "none", padding: 0 }}
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {/* ── Filter Chips ── */}
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className="rounded-full cursor-pointer font-['Inter'] transition-all"
          style={{
            height: 32,
            padding: "0 14px",
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: filter === "all" ? "#0E2646" : "#FFFFFF",
            color: filter === "all" ? "#FFFFFF" : "#1A1A1A",
            border: filter === "all" ? "none" : "1px solid #D4D4D0",
          }}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter("preferred")}
          className="rounded-full cursor-pointer font-['Inter'] transition-all"
          style={{
            height: 32,
            padding: "0 14px",
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: filter === "preferred" ? "#0E2646" : "#FFFFFF",
            color: filter === "preferred" ? "#FFFFFF" : "#1A1A1A",
            border: filter === "preferred" ? "none" : "1px solid #D4D4D0",
          }}
        >
          Preferred
        </button>
      </div>

      {/* ── Result Count ── */}
      <p
        className="mb-3 px-1"
        style={{ fontSize: 11, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}
      >
        {ALL_BREEDS.length} breeds · {preferred.size} preferred
        {searchLower && ` · ${totalFiltered} match${totalFiltered !== 1 ? "es" : ""}`}
      </p>

      {/* ═══════════════════════════════
         PREFERRED SECTION
         ═══════════════════════════════ */}
      {preferredBreeds.length > 0 && (
        <div className="mb-3">
          <SectionLabel count={preferredBreeds.length}>Preferred</SectionLabel>
          <div className="rounded-xl bg-white border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
            {preferredBreeds.map((breed) => (
              <BreedRow
                key={breed.id}
                breed={breed}
                starred={true}
                onToggle={() => togglePreferred(breed.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════
         ALL BREEDS SECTION
         ═══════════════════════════════ */}
      {filter !== "preferred" && nonPreferredBreeds.length > 0 && (
        <div className="mb-4">
          <SectionLabel count={nonPreferredBreeds.length}>All Breeds</SectionLabel>
          <div className="rounded-xl bg-white border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
            {visibleNonPreferred.map((breed) => (
              <BreedRow
                key={breed.id}
                breed={breed}
                starred={false}
                onToggle={() => togglePreferred(breed.id)}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-3">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + LOAD_MORE_SIZE)}
                className="cursor-pointer font-['Inter'] transition-colors hover:opacity-75"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#55BAAA",
                  background: "none",
                  border: "none",
                  padding: "4px 8px",
                }}
              >
                Load More ({nonPreferredBreeds.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Empty state when filter=preferred and none starred ── */}
      {filter === "preferred" && preferredBreeds.length === 0 && (
        <div
          className="rounded-xl bg-white border border-[#D4D4D0]/60 flex flex-col items-center justify-center"
          style={{ padding: "32px 20px" }}
        >
          <div className="mb-2 opacity-30">
            <StarOutline />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}>
            No preferred breeds
          </p>
          <p className="mt-1 text-center" style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.20)" }}>
            Tap the star on any breed to add it to your preferred list
          </p>
        </div>
      )}

      {/* ── No search results ── */}
      {searchLower && totalFiltered === 0 && (
        <div
          className="rounded-xl bg-white border border-[#D4D4D0]/60 flex flex-col items-center justify-center"
          style={{ padding: "32px 20px" }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}>
            No breeds found
          </p>
          <p className="mt-1 text-center" style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.20)" }}>
            Try a different search term
          </p>
        </div>
      )}

      {/* ═══════════════════════════════
         INFO CARD
         ═══════════════════════════════ */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ padding: "12px 16px", backgroundColor: "#E3F2FD", marginTop: 8 }}
      >
        <div className="flex items-start gap-2.5">
          <InfoIcon />
          <p
            className="flex-1"
            style={{ fontSize: 12, fontWeight: 400, color: "#0D47A1", lineHeight: 1.55 }}
          >
            This is a global breed list. Tap the star to add breeds to your preferred list.
          </p>
        </div>
      </div>
    </div>
  );
}