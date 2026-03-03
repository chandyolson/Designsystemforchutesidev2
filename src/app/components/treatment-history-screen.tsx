import { useState, useMemo } from "react";
import { useNavigate } from "react-router";

/* ═══════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════ */
interface Treatment {
  id: string;
  productName: string;
  tag: string;
  route: string;
  dosage: string;
  date: string;        // ISO
  withdrawalEnd: string | null; // ISO or null
  administeredBy: string;
}

const TREATMENTS: Treatment[] = [
  {
    id: "t1",
    productName: "Multimin 90",
    tag: "3309",
    route: "SQ",
    dosage: "12 mL",
    date: "2026-02-28",
    withdrawalEnd: "2026-03-21",
    administeredBy: "John Olson",
  },
  {
    id: "t2",
    productName: "Bovi-Shield Gold 5",
    tag: "4412",
    route: "IM",
    dosage: "2 mL",
    date: "2026-02-27",
    withdrawalEnd: null,
    administeredBy: "Sarah Mitchell",
  },
  {
    id: "t3",
    productName: "Ivermectin",
    tag: "2087",
    route: "SQ",
    dosage: "10 mL",
    date: "2026-02-26",
    withdrawalEnd: "2026-04-02",
    administeredBy: "John Olson",
  },
  {
    id: "t4",
    productName: "Draxxin",
    tag: "5501",
    route: "SQ",
    dosage: "2.5 mL",
    date: "2026-02-25",
    withdrawalEnd: "2026-03-15",
    administeredBy: "Dave Krueger",
  },
  {
    id: "t5",
    productName: "Vision 7",
    tag: "1190",
    route: "SQ",
    dosage: "2 mL",
    date: "2026-02-24",
    withdrawalEnd: null,
    administeredBy: "Amy Torres",
  },
  {
    id: "t6",
    productName: "Banamine",
    tag: "3309",
    route: "IV",
    dosage: "10 mL",
    date: "2026-02-22",
    withdrawalEnd: null,
    administeredBy: "John Olson",
  },
  /* ── Extra rows for "Load More" ── */
  {
    id: "t7",
    productName: "LA-200",
    tag: "6630",
    route: "SQ",
    dosage: "9 mL",
    date: "2026-02-20",
    withdrawalEnd: "2026-03-20",
    administeredBy: "Sarah Mitchell",
  },
  {
    id: "t8",
    productName: "Excede",
    tag: "2087",
    route: "SQ",
    dosage: "6 mL",
    date: "2026-02-18",
    withdrawalEnd: "2026-03-03",
    administeredBy: "Dave Krueger",
  },
  {
    id: "t9",
    productName: "Lutalyse",
    tag: "4412",
    route: "IM",
    dosage: "5 mL",
    date: "2026-02-16",
    withdrawalEnd: null,
    administeredBy: "Amy Torres",
  },
  {
    id: "t10",
    productName: "Dectomax",
    tag: "1190",
    route: "SQ",
    dosage: "10 mL",
    date: "2026-02-14",
    withdrawalEnd: "2026-03-21",
    administeredBy: "John Olson",
  },
];

const FILTER_CHIPS = ["All", "This Week", "This Month", "Has Withdrawal"] as const;
type FilterChip = (typeof FILTER_CHIPS)[number];

/* ═══════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════ */
function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isThisWeek(iso: string): boolean {
  const today = new Date("2026-03-02T00:00:00");
  const d = new Date(iso + "T00:00:00");
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  return d >= startOfWeek && d < endOfWeek;
}

function isThisMonth(iso: string): boolean {
  const d = new Date(iso + "T00:00:00");
  return d.getMonth() === 1 && d.getFullYear() === 2026; // Feb 2026
}

/* ═══════════════════════════════════════════════
   TREATMENT HISTORY SCREEN
   ═══════════════════════════════════════════════ */
export function TreatmentHistoryScreen() {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<FilterChip>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [showActions, setShowActions] = useState(false);

  /* Filtered + searched treatments */
  const filtered = useMemo(() => {
    let result = [...TREATMENTS];

    // Apply filter chip
    if (activeFilter === "This Week") result = result.filter((t) => isThisWeek(t.date));
    else if (activeFilter === "This Month") result = result.filter((t) => isThisMonth(t.date));
    else if (activeFilter === "Has Withdrawal") result = result.filter((t) => t.withdrawalEnd !== null);

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.tag.toLowerCase().includes(q) ||
          t.productName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeFilter, searchQuery]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div>
      {/* ═══════════════════════════════════════════
          TOOLBAR
          ═══════════════════════════════════════════ */}
      <div className="flex items-center justify-end gap-2.5" style={{ marginBottom: 14 }}>
        {/* + New Treatment FAB */}
        <button
          type="button"
          onClick={() => navigate("/treatment/new")}
          className="flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:opacity-90"
          style={{
            width: 34,
            height: 34,
            backgroundColor: "#F3D12A",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="#0E2646" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* 3-dot actions */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowActions(!showActions)}
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

          {showActions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
              <div
                className="absolute right-0 top-full mt-1.5 z-50 bg-white rounded-xl overflow-hidden font-['Inter']"
                style={{
                  minWidth: 185,
                  border: "1px solid rgba(212,212,208,0.80)",
                  boxShadow: "0 8px 24px rgba(14,38,70,0.12)",
                }}
              >
                {["Filter/Sort", "Select Mode", "Export CSV", "Print Report"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setShowActions(false)}
                    className="w-full text-left px-4 py-2.5 cursor-pointer hover:bg-[#F5F5F0] transition-colors"
                    style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          FILTER CHIPS
          ═══════════════════════════════════════════ */}
      <div
        className="flex gap-2 overflow-x-auto no-scrollbar"
        style={{ marginBottom: 12, paddingBottom: 2 }}
      >
        {FILTER_CHIPS.map((chip) => {
          const isActive = chip === activeFilter;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setActiveFilter(chip);
                setVisibleCount(6);
              }}
              className="shrink-0 rounded-full font-['Inter'] cursor-pointer transition-all"
              style={{
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: isActive ? "#0E2646" : "#FFFFFF",
                color: isActive ? "#FFFFFF" : "#1A1A1A",
                border: isActive ? "1px solid #0E2646" : "1px solid #D4D4D0",
              }}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════
          SEARCH BAR
          ═══════════════════════════════════════════ */}
      <div className="relative" style={{ marginBottom: 10 }}>
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          width="15" height="15" viewBox="0 0 16 16" fill="none"
        >
          <circle cx="7" cy="7" r="5.25" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.5" />
          <path d="M11 11L14 14" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search by tag or product..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setVisibleCount(6);
          }}
          className="w-full bg-white border border-[#D4D4D0] rounded-xl pl-10 pr-4 font-['Inter'] text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
          style={{ height: 40, fontSize: 16 }}
        />
      </div>

      {/* ═══════════════════════════════════════════
          RESULT COUNT
          ═══════════════════════════════════════════ */}
      <p
        className="font-['Inter']"
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "rgba(26,26,26,0.30)",
          marginBottom: 8,
        }}
      >
        {filtered.length} treatment{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* ═══════════════════════════════════════════
          TREATMENT LIST
          ═══════════════════════════════════════════ */}
      {visible.length > 0 ? (
        <div
          className="bg-white rounded-xl overflow-hidden divide-y divide-[#D4D4D0]/40"
          style={{ border: "1px solid rgba(212,212,208,0.5)" }}
        >
          {visible.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate("/treatment/new")}
              className="w-full text-left cursor-pointer hover:bg-[#0E2646]/[0.02] transition-colors"
              style={{ padding: "14px 16px" }}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left side */}
                <div className="min-w-0 flex-1">
                  <p
                    className="font-['Inter'] text-[#1A1A1A] truncate"
                    style={{ fontSize: 14, fontWeight: 600 }}
                  >
                    {t.productName}
                  </p>
                  <p
                    className="font-['Inter'] mt-0.5"
                    style={{ fontSize: 12, color: "rgba(26,26,26,0.4)" }}
                  >
                    Tag {t.tag} · {t.route} · {t.dosage}
                  </p>
                </div>

                {/* Right side */}
                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <p
                    className="font-['Inter']"
                    style={{ fontSize: 12, fontWeight: 500, color: "rgba(14,38,70,0.30)" }}
                  >
                    {formatDate(t.date)}
                  </p>
                  {t.withdrawalEnd && (
                    <span
                      className="rounded-full font-['Inter'] inline-flex items-center"
                      style={{
                        padding: "1px 8px",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#B8860B",
                        backgroundColor: "#FFF8E1",
                        border: "1px solid rgba(243,209,42,0.30)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      WD: {formatShortDate(t.withdrawalEnd)}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-12"
          style={{ color: "rgba(26,26,26,0.3)" }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-3 opacity-40">
            <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M22 22L28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="font-['Inter']" style={{ fontSize: 14, fontWeight: 500 }}>
            No treatments found
          </p>
          <p className="font-['Inter'] mt-1" style={{ fontSize: 12 }}>
            Try adjusting your search or filter
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          LOAD MORE
          ═══════════════════════════════════════════ */}
      {hasMore && (
        <div className="flex justify-center" style={{ marginTop: 14 }}>
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + 6)}
            className="font-['Inter'] cursor-pointer transition-colors hover:opacity-70"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#55BAAA",
              background: "none",
              border: "none",
              padding: "6px 12px",
            }}
          >
            Load More ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}