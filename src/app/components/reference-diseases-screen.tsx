import { useState, useMemo } from "react";

/* ── Types ── */
interface DiseaseItem {
  id: string;
  name: string;
  detail: string;
}

/* ── Full disease list (24 total, 12 shown initially) ── */
const ALL_DISEASES: DiseaseItem[] = [
  { id: "d1", name: "Bovine Respiratory Disease", detail: "BRD · Respiratory" },
  { id: "d2", name: "Bovine Viral Diarrhea", detail: "BVD · Viral" },
  { id: "d3", name: "Pinkeye", detail: "IBK · Eye" },
  { id: "d4", name: "Foot Rot", detail: "Interdigital · Hoof" },
  { id: "d5", name: "Scours", detail: "Neonatal diarrhea · Digestive" },
  { id: "d6", name: "Pneumonia", detail: "Respiratory" },
  { id: "d7", name: "Mastitis", detail: "Udder · Infection" },
  { id: "d8", name: "Blackleg", detail: "Clostridial · Vaccine-preventable" },
  { id: "d9", name: "Anaplasmosis", detail: "Blood parasite · Tick-borne" },
  { id: "d10", name: "Trichomoniasis", detail: "Trich · Reproductive" },
  { id: "d11", name: "Lump Jaw", detail: "Actinomycosis · Oral" },
  { id: "d12", name: "Hardware Disease", detail: "Traumatic reticulopericarditis · Digestive" },
  { id: "d13", name: "Johne's Disease", detail: "Paratuberculosis · Digestive" },
  { id: "d14", name: "Leptospirosis", detail: "Lepto · Reproductive" },
  { id: "d15", name: "Infectious Bovine Rhinotracheitis", detail: "IBR · Respiratory" },
  { id: "d16", name: "Coccidiosis", detail: "Parasitic · Digestive" },
  { id: "d17", name: "Tetanus", detail: "Clostridial · Neurological" },
  { id: "d18", name: "Wooden Tongue", detail: "Actinobacillosis · Oral" },
  { id: "d19", name: "Bloat", detail: "Ruminal tympany · Digestive" },
  { id: "d20", name: "Grass Tetany", detail: "Hypomagnesemia · Metabolic" },
  { id: "d21", name: "Milk Fever", detail: "Hypocalcemia · Metabolic" },
  { id: "d22", name: "Ketosis", detail: "Acetonemia · Metabolic" },
  { id: "d23", name: "White Muscle Disease", detail: "Selenium deficiency · Nutritional" },
  { id: "d24", name: "Ringworm", detail: "Dermatophytosis · Skin" },
];

const PAGE_SIZE = 12;

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

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-px">
      <circle cx="8" cy="8" r="6.5" stroke="#5B8DEF" strokeWidth="1.2" />
      <path d="M8 7V11" stroke="#5B8DEF" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="#5B8DEF" />
    </svg>
  );
}

/* ══════════════════ SCREEN ══════════════════ */
export function ReferenceDiseasesScreen() {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_DISEASES;
    const q = search.toLowerCase();
    return ALL_DISEASES.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.detail.toLowerCase().includes(q)
    );
  }, [search]);

  // Paginate
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset pagination when search changes
  const handleSearch = (val: string) => {
    setSearch(val);
    setVisibleCount(PAGE_SIZE);
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
          style={{ fontSize: 14, fontWeight: 400 }}
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

      {/* ── Result count ── */}
      <p
        className="font-['Inter'] mt-3 mb-3 px-1"
        style={{ fontSize: 12, fontWeight: 500, color: "rgba(26,26,26,0.35)" }}
      >
        {filtered.length} disease{filtered.length !== 1 ? "s" : ""}
        {search.trim() && (
          <span> matching "{search.trim()}"</span>
        )}
      </p>

      {/* ── List card ── */}
      {filtered.length > 0 ? (
        <div className="rounded-xl bg-white border border-[#D4D4D0] overflow-hidden divide-y divide-[#D4D4D0]/40">
          {visible.map((disease) => (
            <div
              key={disease.id}
              className="flex items-center justify-between gap-3"
              style={{ padding: "13px 16px" }}
            >
              <div className="min-w-0 flex-1">
                <p
                  className="truncate font-['Inter']"
                  style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.4 }}
                >
                  {disease.name}
                </p>
                <p
                  className="truncate font-['Inter'] mt-0.5"
                  style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.35)", lineHeight: 1.4 }}
                >
                  {disease.detail}
                </p>
              </div>
            </div>
          ))}

          {/* Load More */}
          {hasMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="w-full cursor-pointer transition-colors hover:bg-[#F5F5F0] font-['Inter']"
              style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#55BAAA" }}
            >
              Load More
              <span
                className="font-['Inter'] ml-1.5"
                style={{ fontSize: 11, fontWeight: 500, color: "rgba(26,26,26,0.25)" }}
              >
                ({filtered.length - visibleCount} remaining)
              </span>
            </button>
          )}
        </div>
      ) : (
        /* Empty search state */
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
              Try a different search term
            </p>
          </div>
        </div>
      )}

      {/* ── Info card ── */}
      <div
        className="flex items-start gap-2.5 rounded-lg mt-5 font-['Inter']"
        style={{ padding: "12px 14px", backgroundColor: "#E3F2FD" }}
      >
        <InfoIcon />
        <p style={{ fontSize: 12, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.5, opacity: 0.6 }}>
          This is a global reference list. Contact support to suggest additions.
        </p>
      </div>
    </div>
  );
}
