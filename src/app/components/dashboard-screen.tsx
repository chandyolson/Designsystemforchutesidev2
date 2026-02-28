import { useState } from "react";
import { useNavigate } from "react-router";
import { StatCard } from "./stat-card";
import { DataCard } from "./data-card";
import { FlagIcon } from "./flag-icon";
import { PillButton } from "./pill-button";
import { CollapsibleSection } from "./collapsible-section";

/* ── Data ──────────────────────────────────── */
const stats = [
  {
    label: "Total Head",
    value: "847",
    subtitle: "↑ 34 this quarter",
    angle: 140,
  },
  {
    label: "Active Calving",
    value: "23",
    subtitle: "6 expected this week",
    angle: 155,
  },
  {
    label: "Open Projects",
    value: "5",
    subtitle: "2 due before Friday",
    angle: 165,
  },
];

const recentAnimals = [
  {
    title: "Tag 4782",
    values: ["Black Angus", "1,247 lbs", "Pen 2A"],
    flag: "teal" as const,
  },
  {
    title: "Tag 3091",
    values: ["Hereford", "983 lbs", "Pen 4B"],
    flag: "gold" as const,
    subtitle: ["Treatment follow-up", "Thursday"],
  },
  {
    title: "Tag 5520",
    values: ["Charolais", "1,102 lbs", "Pen 1C"],
    flag: "red" as const,
    subtitle: ["Penicillin 10cc due", "Overdue 2 days"],
  },
  {
    title: "Tag 2218",
    values: ["Simmental", "1,340 lbs", "Pen 3A"],
    flag: "teal" as const,
  },
  {
    title: "Tag 7801",
    values: ["Brahman Cross", "1,410 lbs", "Pen 1A"],
    flag: "gold" as const,
    subtitle: ["Calving expected", "Mar 8"],
  },
];

const upcomingWork = [
  { task: "Pregnancy check — Pen 3A", count: "18 head", due: "Tomorrow" },
  { task: "Vaccination booster — Pen 1C", count: "12 head", due: "Wed, Mar 4" },
  { task: "Weaning — North Pasture", count: "31 head", due: "Mar 10" },
];

/* ── Herd Status Animals by Flag Group ── */
const herdStatusAnimals: {
  group: string;
  flag: "red" | "gold" | "teal";
  color: string;
  label: string;
  animals: { tag: string; type: string; memo: string; yearBorn: number; lastWeight: string }[];
}[] = [
  {
    group: "Cull List",
    flag: "red",
    color: "#9B2335",
    label: "Critical / Urgent",
    animals: [
      { tag: "5520", type: "Cow", memo: "Chronic limp, poor BCS", yearBorn: 2018, lastWeight: "1,102 lbs" },
      { tag: "1193", type: "Cow", memo: "Failed to breed 2 seasons", yearBorn: 2019, lastWeight: "1,068 lbs" },
      { tag: "3347", type: "Bull", memo: "Poor semen test results", yearBorn: 2017, lastWeight: "1,890 lbs" },
      { tag: "6042", type: "Cow", memo: "Aggressive temperament", yearBorn: 2020, lastWeight: "1,155 lbs" },
      { tag: "4415", type: "Cow", memo: "Prolapse history — 2x", yearBorn: 2019, lastWeight: "1,210 lbs" },
      { tag: "2789", type: "Cow", memo: "Bad feet, chronic lame", yearBorn: 2016, lastWeight: "985 lbs" },
      { tag: "8104", type: "Cow", memo: "Poor udder, calf starved", yearBorn: 2018, lastWeight: "1,048 lbs" },
      { tag: "5961", type: "Cow", memo: "Open 3rd consecutive year", yearBorn: 2017, lastWeight: "1,130 lbs" },
    ],
  },
  {
    group: "Monitor",
    flag: "gold",
    color: "#D4A017",
    label: "Watch / Follow-up",
    animals: [
      { tag: "3091", type: "Cow", memo: "Treatment follow-up Thu", yearBorn: 2020, lastWeight: "983 lbs" },
      { tag: "7801", type: "Cow", memo: "Calving expected Mar 8", yearBorn: 2019, lastWeight: "1,410 lbs" },
      { tag: "6238", type: "Heifer", memo: "First calf — watch close", yearBorn: 2023, lastWeight: "875 lbs" },
      { tag: "4107", type: "Cow", memo: "Mild respiratory — clearing", yearBorn: 2021, lastWeight: "1,190 lbs" },
      { tag: "5584", type: "Cow", memo: "Eye issue — left side", yearBorn: 2020, lastWeight: "1,075 lbs" },
      { tag: "2953", type: "Bull", memo: "Weight loss — recheck BCS", yearBorn: 2019, lastWeight: "1,720 lbs" },
      { tag: "8821", type: "Cow", memo: "Late calver — due Mar 15", yearBorn: 2018, lastWeight: "1,265 lbs" },
      { tag: "1476", type: "Heifer", memo: "Slow to breed — monitor", yearBorn: 2023, lastWeight: "810 lbs" },
      { tag: "3610", type: "Cow", memo: "Thin — supplementing", yearBorn: 2017, lastWeight: "945 lbs" },
      { tag: "7245", type: "Cow", memo: "Hoof trim scheduled", yearBorn: 2020, lastWeight: "1,145 lbs" },
      { tag: "9003", type: "Cow", memo: "Post-calving check", yearBorn: 2019, lastWeight: "1,088 lbs" },
      { tag: "5127", type: "Cow", memo: "Calf scours — watch pair", yearBorn: 2021, lastWeight: "1,200 lbs" },
      { tag: "6690", type: "Cow", memo: "Swollen hock — improving", yearBorn: 2018, lastWeight: "1,022 lbs" },
      { tag: "4478", type: "Heifer", memo: "Nervous — needs gentle", yearBorn: 2023, lastWeight: "790 lbs" },
      { tag: "3832", type: "Cow", memo: "Mastitis history — clear", yearBorn: 2017, lastWeight: "1,060 lbs" },
      { tag: "8156", type: "Cow", memo: "Checking pregnancy Tue", yearBorn: 2020, lastWeight: "1,175 lbs" },
      { tag: "2291", type: "Cow", memo: "BCS 4 — needs gain", yearBorn: 2019, lastWeight: "998 lbs" },
      { tag: "7514", type: "Bull", memo: "Foot rot — treating", yearBorn: 2020, lastWeight: "1,845 lbs" },
      { tag: "1038", type: "Cow", memo: "Retained placenta — resolved", yearBorn: 2018, lastWeight: "1,100 lbs" },
      { tag: "6401", type: "Cow", memo: "Twins expected — watch", yearBorn: 2019, lastWeight: "1,310 lbs" },
      { tag: "9287", type: "Cow", memo: "Abscess draining", yearBorn: 2020, lastWeight: "1,055 lbs" },
      { tag: "4893", type: "Heifer", memo: "Small pelvis — C-section?", yearBorn: 2023, lastWeight: "825 lbs" },
      { tag: "3175", type: "Cow", memo: "Ketosis signs — monitoring", yearBorn: 2017, lastWeight: "980 lbs" },
      { tag: "7760", type: "Cow", memo: "Calf rejected — grafting", yearBorn: 2019, lastWeight: "1,142 lbs" },
      { tag: "5309", type: "Cow", memo: "Pink eye — left clearing", yearBorn: 2021, lastWeight: "1,165 lbs" },
      { tag: "2648", type: "Cow", memo: "Low milk — supplementing calf", yearBorn: 2018, lastWeight: "1,015 lbs" },
      { tag: "8432", type: "Cow", memo: "Lump on jaw — biopsy pending", yearBorn: 2020, lastWeight: "1,092 lbs" },
    ],
  },
  {
    group: "Management",
    flag: "teal",
    color: "#55BAAA",
    label: "Routine / Active",
    animals: [
      { tag: "4782", type: "Cow", memo: "Normal", yearBorn: 2020, lastWeight: "1,247 lbs" },
      { tag: "2218", type: "Cow", memo: "Normal", yearBorn: 2021, lastWeight: "1,340 lbs" },
      { tag: "9914", type: "Bull", memo: "Herd sire — Pen 1A", yearBorn: 2019, lastWeight: "2,015 lbs" },
      { tag: "1055", type: "Heifer", memo: "Normal", yearBorn: 2023, lastWeight: "780 lbs" },
      { tag: "7330", type: "Cow", memo: "Normal", yearBorn: 2018, lastWeight: "1,185 lbs" },
    ],
  },
];

/* ── Component ─────────────────────────────── */
export function DashboardScreen() {
  const [search, setSearch] = useState("");
  const [herdExpanded, setHerdExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* ── Search Bar ── */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tags, animals, pens…"
          className="w-full h-[46px] pl-4 pr-4 rounded-xl bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/20 transition-all"
          style={{ fontSize: 14, fontWeight: 400 }}
        />
      </div>

      {/* ── Stat Cards — 2-column grid ── */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            subtitle={s.subtitle}
            gradientAngle={s.angle}
          />
        ))}

        {/* Fourth slot: quick-add CTA */}
        <button
          type="button"
          onClick={() => navigate("/animals/new")}
          className="rounded-2xl border-2 border-dashed border-[#0E2646]/12 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors duration-150 hover:border-[#F3D12A]/40 hover:bg-[#F3D12A]/5 active:scale-[0.98]"
          style={{ minHeight: 132 }}
        >
          <span
            className="text-[#0E2646]/20 font-['Inter']"
            style={{ fontSize: 28, fontWeight: 300, lineHeight: 1 }}
          >
            +
          </span>
          <span
            className="text-[#0E2646]/30 font-['Inter'] uppercase"
            style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}
          >
            New Record
          </span>
        </button>
      </div>

      {/* ── Herd Summary Row ── */}
      <button
        type="button"
        onClick={() => setHerdExpanded(!herdExpanded)}
        className="w-full rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
        style={{ backgroundColor: "#0E2646" }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <FlagIcon color="teal" size="sm" />
            <span className="text-[#F0F0F0] font-['Inter']" style={{ fontSize: 14, fontWeight: 700 }}>
              812
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FlagIcon color="gold" size="sm" />
            <span className="text-[#F0F0F0] font-['Inter']" style={{ fontSize: 14, fontWeight: 700 }}>
              27
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FlagIcon color="red" size="sm" />
            <span className="text-[#F0F0F0] font-['Inter']" style={{ fontSize: 14, fontWeight: 700 }}>
              8
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[#F0F0F0]/35 font-['Inter']"
            style={{ fontSize: 11, fontWeight: 500 }}
          >
            Herd Status
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="transition-transform duration-200"
            style={{ transform: herdExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="rgba(240,240,240,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* ── Herd Status Expanded Panel ── */}
      {herdExpanded && (
        <div className="space-y-4 -mt-2">
          {herdStatusAnimals.map((group) => (
            <div key={group.group} className="space-y-2">
              {/* Group header */}
              <div className="flex items-center gap-2.5 px-1">
                <FlagIcon color={group.flag} size="sm" />
                <span
                  className="font-['Inter'] uppercase"
                  style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: group.color }}
                >
                  {group.group}
                </span>
                <span
                  className="font-['Inter']"
                  style={{ fontSize: 11, fontWeight: 600, color: group.color, opacity: 0.5 }}
                >
                  ({group.animals.length})
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: `${group.color}20` }} />
                <span
                  className="font-['Inter']"
                  style={{ fontSize: 9, fontWeight: 500, color: "#1A1A1A", opacity: 0.3 }}
                >
                  {group.label}
                </span>
              </div>

              {/* Animal cards */}
              <div className="space-y-1.5">
                {group.animals.map((animal) => (
                  <button
                    key={animal.tag}
                    type="button"
                    onClick={() => navigate(`/animals/${animal.tag}`)}
                    className="w-full rounded-xl px-3.5 py-2.5 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.98] text-left"
                    style={{ backgroundColor: "#0E2646" }}
                  >
                    {/* Flag + Tag */}
                    <div className="flex items-center gap-2 shrink-0">
                      <FlagIcon color={group.flag} size="sm" />
                      <span
                        className="text-white font-['Inter']"
                        style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.03em" }}
                      >
                        {animal.tag}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="rounded-full font-['Inter']"
                          style={{
                            fontSize: 8,
                            fontWeight: 700,
                            color: "rgba(240,240,240,0.5)",
                            backgroundColor: "rgba(240,240,240,0.08)",
                            padding: "1.5px 7px",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {animal.type.toUpperCase()}
                        </span>
                        <span
                          className="font-['Inter']"
                          style={{ fontSize: 10, fontWeight: 400, color: "rgba(240,240,240,0.35)" }}
                        >
                          {animal.yearBorn}
                        </span>
                        <span
                          className="font-['Inter']"
                          style={{ fontSize: 10, fontWeight: 400, color: "rgba(240,240,240,0.35)" }}
                        >
                          {animal.lastWeight}
                        </span>
                      </div>
                      <p
                        className="font-['Inter'] truncate mt-0.5"
                        style={{ fontSize: 10, fontWeight: 500, color: "rgba(240,240,240,0.25)" }}
                      >
                        {animal.memo}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Activity Feed ── */}
      <section className="space-y-3">
        <SectionHeading text="Today's Activity" />
        <CollapsibleSection title="Activity Log" defaultOpen>
          <div className="pt-1 space-y-3">
            {[
              { time: "2:14 PM", text: "Tag 4782 weighed at 1,247 lbs", flag: "teal" as const },
              { time: "1:45 PM", text: "Tag 5520 treatment administered — Penicillin 10cc IM", flag: "red" as const },
              { time: "11:20 AM", text: "Tag 3091 moved to Pen 4B for observation", flag: "gold" as const },
              { time: "9:05 AM", text: "Tag 2218 BCS scored at 6", flag: "teal" as const },
              { time: "8:30 AM", text: "Work session started — Pen 2A processing", flag: "teal" as const },
            ].map((entry) => (
              <div key={entry.time + entry.text} className="flex items-start gap-3">
                <span
                  className="shrink-0 text-[#1A1A1A]/25 font-['Inter'] pt-px"
                  style={{ fontSize: 11, fontWeight: 500, width: 58 }}
                >
                  {entry.time}
                </span>
                <FlagIcon color={entry.flag} size="sm" />
                <p
                  className="text-[#1A1A1A]/60 font-['Inter'] flex-1 min-w-0"
                  style={{ fontSize: 12, lineHeight: 1.5 }}
                >
                  {entry.text}
                </p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </section>

      {/* ── Recent Animals ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionHeading text="Recent Animals" />
          <span
            className="text-[#55BAAA] font-['Inter'] cursor-pointer"
            style={{ fontSize: 12, fontWeight: 600 }}
            onClick={() => navigate("/animals")}
          >
            View All
          </span>
        </div>
        <div className="space-y-2.5">
          {recentAnimals.map((a) => (
            <DataCard
              key={a.title}
              title={a.title}
              values={a.values}
              subtitle={a.subtitle}
              trailing={<FlagIcon color={a.flag} size="sm" />}
            />
          ))}
        </div>
      </section>

      {/* ── Upcoming Work ── */}
      <section className="space-y-3">
        <SectionHeading text="Upcoming Work" />
        <div className="bg-white rounded-xl border border-[#D4D4D0]/60 divide-y divide-[#D4D4D0]/40 overflow-hidden">
          {upcomingWork.map((w) => (
            <div key={w.task} className="px-4 py-3 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p
                  className="text-[#1A1A1A] truncate font-['Inter']"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  {w.task}
                </p>
                <p
                  className="text-[#1A1A1A]/40 font-['Inter']"
                  style={{ fontSize: 11 }}
                >
                  {w.count}
                </p>
              </div>
              <span
                className="shrink-0 text-[#55BAAA] font-['Inter']"
                style={{ fontSize: 11, fontWeight: 600 }}
              >
                {w.due}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Actions ── */}
      <div className="flex gap-3 pt-1">
        <PillButton size="md" style={{ flex: 1 }} onClick={() => navigate("/animals/new")}>
          New Record
        </PillButton>
        <PillButton variant="outline" size="md" style={{ flex: 1 }} onClick={() => navigate("/cow-work")}>
          Start Session
        </PillButton>
      </div>

      {/* ── Design Exploration Link ── */}
      <button
        type="button"
        onClick={() => navigate("/dashboard-explore")}
        className="w-full rounded-xl py-3 cursor-pointer font-['Inter'] transition-all active:scale-[0.98]"
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.06em",
          backgroundColor: "#55BAAA",
          color: "white",
        }}
      >
        EXPLORE DASHBOARD DESIGNS →
      </button>
    </div>
  );
}

/* ── Tiny heading helper ── */
function SectionHeading({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="shrink-0 text-[#0E2646] font-['Inter'] uppercase"
        style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}
      >
        {text}
      </span>
      <div className="flex-1 h-px bg-[#0E2646]/10" />
    </div>
  );
}