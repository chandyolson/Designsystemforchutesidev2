import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Plus,
  Search,
  ArrowUpDown,
  ChevronRight,
  Users,
  Beef,
} from "lucide-react";

/* ── Types ── */
interface Group {
  id: string;
  name: string;
  cattleType: string;
  startDate: string;
  status: "Active" | "Inactive";
  memberCount: number;
}

/* ── Mock data ── */
const mockGroups: Group[] = [
  { id: "g1", name: "2026 Cows", cattleType: "Cows", startDate: "Jan 1, 2026", status: "Active", memberCount: 87 },
  { id: "g2", name: "2026 Heifers", cattleType: "Cows", startDate: "Jan 1, 2026", status: "Active", memberCount: 24 },
  { id: "g3", name: "Fall Bulls", cattleType: "Bulls", startDate: "Sep 1, 2025", status: "Active", memberCount: 12 },
  { id: "g4", name: "2025 Calves", cattleType: "Calves", startDate: "Mar 1, 2025", status: "Inactive", memberCount: 45 },
  { id: "g5", name: "North Pasture Pairs", cattleType: "Pairs", startDate: "Apr 1, 2026", status: "Active", memberCount: 34 },
  { id: "g6", name: "Replacement Heifers", cattleType: "Yearlings", startDate: "Nov 1, 2025", status: "Active", memberCount: 18 },
];

/* ── Group icon by cattle type ── */
function GroupIcon({ type }: { type: string }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-lg"
      style={{ width: 40, height: 40, backgroundColor: "#0F1D32" }}
    >
      <Beef size={18} style={{ color: "rgba(255,255,255,0.40)" }} />
    </div>
  );
}

/* ── Status badge ── */
function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
  const isActive = status === "Active";
  return (
    <span
      className="shrink-0 rounded-full font-['Inter']"
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: "2px 8px",
        color: isActive ? "#14B8A6" : "rgba(255,255,255,0.30)",
        border: isActive
          ? "1px solid rgba(20,184,166,0.4)"
          : "1px solid rgba(255,255,255,0.20)",
      }}
    >
      {status}
    </span>
  );
}

/* ── Filter pill ── */
function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full cursor-pointer font-['Inter'] transition-colors"
      style={{
        height: 28,
        padding: "0 12px",
        fontSize: 12,
        fontWeight: 500,
        color: active ? "#14B8A6" : "rgba(255,255,255,0.50)",
        border: active ? "1px solid #14B8A6" : "1px solid #1E3A5F",
        backgroundColor: active ? "rgba(20,184,166,0.08)" : "transparent",
      }}
    >
      {label}
    </button>
  );
}

/* ── Screen ── */
export function GroupsScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cattleTypeFilter, setCattleTypeFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState(false);
  const [groups, setGroups] = useState<Group[]>(mockGroups);

  const isEmpty = groups.length === 0;

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="flex flex-col font-['Inter']"
      style={{
        width: "100%",
        maxWidth: 375,
        minHeight: "100vh",
        backgroundColor: "#0A1628",
        margin: "0 auto",
      }}
    >
      {/* ══ TOP BAR ══ */}
      <div
        className="flex items-center justify-between shrink-0"
        style={{
          height: 56,
          padding: "0 16px",
          borderBottom: "1px solid #1E3A5F",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center cursor-pointer"
          style={{ width: 32, height: 32 }}
          aria-label="Go back"
        >
          <ArrowLeft size={20} style={{ color: "rgba(255,255,255,0.60)" }} />
        </button>
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "rgba(255,255,255,0.90)",
          }}
        >
          Groups
        </span>
        <button
          type="button"
          className="flex items-center justify-center cursor-pointer"
          style={{ width: 32, height: 32 }}
          aria-label="Add group"
        >
          <Plus size={20} style={{ color: "rgba(255,255,255,0.60)" }} />
        </button>
      </div>

      {isEmpty ? (
        /* ══ EMPTY STATE ══ */
        <div className="flex-1 flex flex-col items-center justify-center" style={{ padding: "0 32px" }}>
          <Users size={48} style={{ color: "rgba(255,255,255,0.10)" }} />
          <p
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "rgba(255,255,255,0.40)",
              marginTop: 8,
            }}
          >
            No groups yet
          </p>
          <p
            className="text-center"
            style={{
              fontSize: 13,
              fontWeight: 400,
              color: "rgba(255,255,255,0.20)",
              maxWidth: 260,
              marginTop: 24,
              lineHeight: 1.5,
            }}
          >
            Groups help you organize animals into herds and manage them as units.
          </p>
          <button
            type="button"
            className="flex items-center justify-center gap-2 cursor-pointer"
            style={{
              height: 40,
              padding: "0 24px",
              marginTop: 24,
              backgroundColor: "#0D9488",
              borderRadius: 8,
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            <Plus size={16} />
            Add Group
          </button>
        </div>
      ) : (
        <>
          {/* ══ SEARCH BAR ══ */}
          <div style={{ padding: 12 }}>
            <div
              className="flex items-center gap-2.5"
              style={{
                height: 40,
                padding: "0 12px",
                backgroundColor: "#0F1D32",
                border: "1px solid #1E3A5F",
                borderRadius: 8,
              }}
            >
              <Search size={16} style={{ color: "rgba(255,255,255,0.30)", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search groups..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none border-none placeholder:text-white/20"
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.90)",
                }}
              />
            </div>
          </div>

          {/* ══ FILTER / SORT ROW ══ */}
          <div
            className="flex items-center justify-between"
            style={{ padding: "0 12px 8px 12px" }}
          >
            <div className="flex items-center gap-2">
              <FilterPill
                label="Cattle Type"
                active={cattleTypeFilter}
                onClick={() => setCattleTypeFilter(!cattleTypeFilter)}
              />
              <FilterPill
                label="Status"
                active={statusFilter}
                onClick={() => setStatusFilter(!statusFilter)}
              />
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="cursor-pointer"
                style={{ fontSize: 12, fontWeight: 500, color: "#14B8A6", background: "none", border: "none" }}
              >
                Select
              </button>
              <button
                type="button"
                className="flex items-center justify-center cursor-pointer rounded-full"
                style={{
                  width: 28,
                  height: 28,
                  border: "1px solid #1E3A5F",
                  backgroundColor: "transparent",
                }}
                aria-label="Sort"
              >
                <ArrowUpDown size={14} style={{ color: "rgba(255,255,255,0.50)" }} />
              </button>
            </div>
          </div>

          {/* ══ LIST ══ */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => navigate(`/groups/${group.id}`)}
                className="w-full flex items-center gap-3 cursor-pointer transition-colors hover:bg-white/[0.03] text-left"
                style={{
                  minHeight: 64,
                  padding: "12px 16px",
                  borderBottom: "1px solid #1E3A5F",
                }}
              >
                {/* Icon */}
                <GroupIcon type={group.cattleType} />

                {/* Text block */}
                <div className="flex-1 min-w-0">
                  <p
                    className="truncate"
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.90)",
                      lineHeight: 1.3,
                    }}
                  >
                    {group.name}
                  </p>
                  <p
                    className="truncate mt-0.5"
                    style={{
                      fontSize: 12,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.40)",
                      lineHeight: 1.3,
                    }}
                  >
                    {group.cattleType} · Started {group.startDate}
                  </p>
                </div>

                {/* Badge */}
                <StatusBadge status={group.status} />

                {/* Members icon */}
                <Users
                  size={16}
                  style={{ color: "rgba(255,255,255,0.40)", flexShrink: 0 }}
                />

                {/* Chevron */}
                <ChevronRight
                  size={14}
                  style={{ color: "rgba(255,255,255,0.20)", flexShrink: 0 }}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}