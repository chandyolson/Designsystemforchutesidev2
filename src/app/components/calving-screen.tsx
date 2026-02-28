import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { CalvingRecordCard } from "./calving-record-card";

/* ── Group Dropdown ────────────────────────── */
const groups = ["2026 Season", "2025 Season", "2024 Season", "Fall 2025 Embryo"];

const groupCounts: Record<string, number> = {
  "2026 Season": 23,
  "2025 Season": 64,
  "2024 Season": 71,
  "Fall 2025 Embryo": 8,
};

function GroupSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div
      className="rounded-xl bg-white border border-[#D4D4D0]/60 px-4 font-['Inter']"
      style={{ paddingTop: 8, paddingBottom: 8 }}
    >
      {/* Label */}
      <span
        style={{ fontSize: 11, fontWeight: 600, color: "rgba(26,26,26,0.4)" }}
      >
        Group
      </span>

      {/* Dropdown trigger */}
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-2 cursor-pointer mt-0.5"
        >
          <span
            className="truncate"
            style={{ fontSize: 14, fontWeight: 600, color: "#0E2646" }}
          >
            {value}
          </span>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#55BAAA",
              }}
            >
              {groupCounts[value]} calves
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="shrink-0 transition-transform duration-200"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path
                d="M3.5 5.25L7 8.75L10.5 5.25"
                stroke="#1A1A1A"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.35}
              />
            </svg>
          </div>
        </button>

        {/* Dropdown panel */}
        {open && (
          <div
            className="absolute left-0 right-0 top-full mt-3 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-20"
            style={{ boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
          >
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  onChange(g);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0] flex items-center justify-between"
                style={{
                  fontSize: 13,
                  fontWeight: g === value ? 700 : 500,
                  color: g === value ? "#0E2646" : "#1A1A1A",
                }}
              >
                <span>{g}</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 400,
                    color: "rgba(26,26,26,0.30)",
                  }}
                >
                  {groupCounts[g]} calves
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Actions Dropdown ──────────────────────── */
function ActionsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const items = ["Export Records", "Season Summary", "Print Report", "Import CSV"];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.97] flex items-center justify-center"
        style={{
          width: 32,
          height: 32,
          backgroundColor: "white",
          border: "1px solid rgba(14,38,70,0.12)",
        }}
      >
        {/* 3-dot vertical menu icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="3.5" r="1.3" fill="#0E2646" />
          <circle cx="8" cy="8" r="1.3" fill="#0E2646" />
          <circle cx="8" cy="12.5" r="1.3" fill="#0E2646" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-20 font-['Inter']"
          style={{ minWidth: 170, boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
        >
          {items.map((item) => (
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

/* ── Calving Data ──────────────────────────── */
interface CalvingRecord {
  damTag: string;
  calfTag: string;
  date: string;
  sex: string;
  sire: string;
  assistance: string;
}

const calvingRecords: CalvingRecord[] = [
  { damTag: "7801", calfTag: "8841", date: "Feb 26", sex: "Heifer", sire: "Basin Payweight", assistance: "1 — No Assistance" },
  { damTag: "3091", calfTag: "8842", date: "Feb 25", sex: "Bull", sire: "Connealy Consensus", assistance: "1 — No Assistance" },
  { damTag: "4782", calfTag: "8843", date: "Feb 24", sex: "Heifer", sire: "SAV Resource", assistance: "2 — Easy Pull" },
  { damTag: "5501", calfTag: "8844", date: "Feb 23", sex: "Bull", sire: "Basin Payweight", assistance: "1 — No Assistance" },
  { damTag: "2290", calfTag: "8845", date: "Feb 22", sex: "Heifer", sire: "Vermilion Dateline", assistance: "1 — No Assistance" },
  { damTag: "8812", calfTag: "8846", date: "Feb 21", sex: "Bull", sire: "Connealy Consensus", assistance: "3 — Hard Pull" },
  { damTag: "2218", calfTag: "8847", date: "Feb 20", sex: "Heifer", sire: "SAV Resource", assistance: "1 — No Assistance" },
  { damTag: "6610", calfTag: "8848", date: "Feb 19", sex: "Bull", sire: "Basin Payweight", assistance: "1 — No Assistance" },
  { damTag: "4455", calfTag: "8849", date: "Feb 18", sex: "Heifer", sire: "Vermilion Dateline", assistance: "2 — Easy Pull" },
  { damTag: "3320", calfTag: "8850", date: "Feb 17", sex: "Bull", sire: "Connealy Consensus", assistance: "1 — No Assistance" },
  { damTag: "5520", calfTag: "8851", date: "Feb 16", sex: "Heifer", sire: "SAV Resource", assistance: "4 — Surgical" },
  { damTag: "7744", calfTag: "8852", date: "Feb 15", sex: "Bull", sire: "Basin Payweight", assistance: "1 — No Assistance" },
];

/* ── Screen Component ──────────────────────── */
export function CalvingScreen() {
  const [group, setGroup] = useState("2026 Season");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredRecords = calvingRecords.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.damTag.toLowerCase().includes(q) ||
      r.calfTag.toLowerCase().includes(q) ||
      r.sire.toLowerCase().includes(q) ||
      r.sex.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* ── Group Selector ── */}
      <GroupSelector value={group} onChange={setGroup} />

      {/* ── Search Bar ── */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <circle cx="7" cy="7" r="4.5" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.5" />
          <path d="M10.5 10.5L13.5 13.5" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by tag, sire, or sex…"
          className="w-full h-[40px] pl-9 pr-3 rounded-xl bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
          style={{ fontSize: 14, fontWeight: 400 }}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Toolbar: record count + add/actions ── */}
      <div className="flex items-center justify-between">
        <p
          className="text-[#1A1A1A]/30 font-['Inter']"
          style={{ fontSize: 11, fontWeight: 600 }}
        >
          {filteredRecords.length} records
        </p>
        <div className="flex items-center gap-2">
          {/* Yellow (+) button */}
          <button
            type="button"
            onClick={() => navigate("/calving/new")}
            className="shrink-0 rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.95] font-['Inter'] flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              fontSize: 20,
              fontWeight: 400,
              lineHeight: 1,
              color: "#1A1A1A",
              backgroundColor: "#F3D12A",
              boxShadow: "0 2px 8px rgba(243,209,42,0.30)",
            }}
          >
            +
          </button>

          <ActionsDropdown />
        </div>
      </div>

      {/* ── Calving Record Card List ── */}
      <div className="space-y-2.5">
        {filteredRecords.map((r) => (
          <CalvingRecordCard
            key={`${r.damTag}-${r.calfTag}`}
            damTag={r.damTag}
            calfTag={r.calfTag}
            date={r.date}
            values={[r.sex, r.sire, r.assistance]}
            onClick={() => navigate(`/calving/${r.calfTag}`)}
          />
        ))}
      </div>

      {/* ── Load more ── */}
      <div className="text-center py-3">
        <span
          className="text-[#55BAAA] font-['Inter'] cursor-pointer"
          style={{ fontSize: 13, fontWeight: 600 }}
        >
          Load More
        </span>
      </div>
    </div>
  );
}