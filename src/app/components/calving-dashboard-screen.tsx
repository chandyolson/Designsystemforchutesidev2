import { useState } from "react";
import { useNavigate } from "react-router";
import { useSidebarWidth } from "./sidebar-context";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from "recharts";

/* ══════════════════════════════════════════════
   APP PALETTE
   ══════════════════════════════════════════════ */
const C = {
  navy:     "#0E2646",
  navyMid:  "#163A5E",
  teal:     "#55BAAA",
  tealLight:"#A8E6DA",
  cream:    "#F5F5F0",
  yellow:   "#F3D12A",
  white:    "#FFFFFF",
  border:   "#D4D4D0",
  red:      "#9B2335",
  redLight: "#D4183D",
  gold:     "#D4A017",
  text:     "#1A1A1A",
};

/* ══════════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════════ */

/* Daily calving curve */
const dailyCurve = [
  { d: "Jan 8", this: 2, last: 0 },  { d: "Jan 12", this: 5, last: 3 },
  { d: "Jan 16", this: 8, last: 5 },  { d: "Jan 20", this: 12, last: 7 },
  { d: "Jan 24", this: 10, last: 11 }, { d: "Jan 28", this: 15, last: 9 },
  { d: "Feb 1", this: 18, last: 14 }, { d: "Feb 5", this: 22, last: 16 },
  { d: "Feb 9", this: 25, last: 19 }, { d: "Feb 13", this: 20, last: 22 },
  { d: "Feb 17", this: 16, last: 24 },{ d: "Feb 21", this: 28, last: 20 },
  { d: "Feb 25", this: 32, last: 18 },{ d: "Mar 1", this: 24, last: 15 },
  { d: "Mar 5", this: 18, last: 12 }, { d: "Mar 9", this: 12, last: 8 },
  { d: "Mar 14", this: 6, last: 5 },
];

/* Weekly births stacked by sex */
const weeklyBySex = [
  { w: "Wk 1", bulls: 4, heifers: 3 },  { w: "Wk 2", bulls: 9, heifers: 7 },
  { w: "Wk 3", bulls: 15, heifers: 11 }, { w: "Wk 4", bulls: 20, heifers: 14 },
  { w: "Wk 5", bulls: 24, heifers: 18 }, { w: "Wk 6", bulls: 30, heifers: 22 },
  { w: "Wk 7", bulls: 35, heifers: 28 }, { w: "Wk 8", bulls: 26, heifers: 20 },
  { w: "Wk 9", bulls: 18, heifers: 14 }, { w: "Wk 10", bulls: 10, heifers: 6 },
];

/* Sex split pie */
const sexPie = [
  { name: "Bulls", value: 247, color: C.navy },
  { name: "Heifers", value: 194, color: C.teal },
  { name: "Unknown", value: 12, color: C.border },
];

/* Birth weight distribution */
const birthWeightBars = [
  { range: "<60", count: 8 },   { range: "60–69", count: 34 },
  { range: "70–79", count: 112 },{ range: "80–89", count: 178 },
  { range: "90–99", count: 89 }, { range: "100+", count: 32 },
];

/* Death causes — raw counts, total = 35 */
const totalDeaths = 35;
const deathCausesRaw = [
  { name: "Scours", value: 11, color: C.navy },
  { name: "Stillborn", value: 8, color: C.teal },
  { name: "Dystocia", value: 6, color: C.gold },
  { name: "Exposure", value: 4, color: C.red },
  { name: "Pneumonia", value: 3, color: "#8B5FBF" },
  { name: "Unknown", value: 3, color: C.border },
];
const deathCauses = deathCausesRaw.map((d) => ({
  ...d,
  pct: Math.round((d.value / totalDeaths) * 100),
}));

/* Deaths by week */
const deathsByWeek = [
  { w: "Wk 1", d: 1 }, { w: "Wk 2", d: 3 }, { w: "Wk 3", d: 5 },
  { w: "Wk 4", d: 7 }, { w: "Wk 5", d: 4 }, { w: "Wk 6", d: 5 },
  { w: "Wk 7", d: 3 }, { w: "Wk 8", d: 3 }, { w: "Wk 9", d: 2 },
  { w: "Wk 10", d: 2 },
];

/* Calving distribution by week — stacked alive/dead */
const calvingDistribution = [
  { w: "Wk 1", alive: 6, dead: 1 },   { w: "Wk 2", alive: 13, dead: 3 },
  { w: "Wk 3", alive: 21, dead: 5 },  { w: "Wk 4", alive: 27, dead: 7 },
  { w: "Wk 5", alive: 38, dead: 4 },  { w: "Wk 6", alive: 47, dead: 5 },
  { w: "Wk 7", alive: 60, dead: 3 },  { w: "Wk 8", alive: 43, dead: 3 },
  { w: "Wk 9", alive: 30, dead: 2 },  { w: "Wk 10", alive: 14, dead: 2 },
];

/* Assist distribution pie */
const assistPie = [
  { name: "No Assist", value: 428, color: C.navy },
  { name: "Easy Pull", value: 18, color: C.teal },
  { name: "Hard Pull", value: 7, color: C.gold },
];

/* Calf age distribution (days old) */
const calfAgeData = [
  { range: "0–7d", count: 22 },  { range: "8–14d", count: 38 },
  { range: "15–21d", count: 54 }, { range: "22–28d", count: 68 },
  { range: "29–42d", count: 112 },{ range: "43–56d", count: 98 },
  { range: "57–67d", count: 61 },
];

/* Estimated current calf weight by week cohort */
const estWeightByWeek = [
  { cohort: "Wk 1", est: 145 }, { cohort: "Wk 2", est: 164 },
  { cohort: "Wk 3", est: 185 }, { cohort: "Wk 4", est: 208 },
  { cohort: "Wk 5", est: 235 }, { cohort: "Wk 6", est: 268 },
  { cohort: "Wk 7", est: 295 }, { cohort: "Wk 8", est: 340 },
  { cohort: "Wk 9", est: 378 }, { cohort: "Wk 10", est: 410 },
];

/* Calving distribution by time-of-day */
const timeOfDay = [
  { time: "12a–4a", count: 38 }, { time: "4a–8a", count: 72 },
  { time: "8a–12p", count: 95 }, { time: "12p–4p", count: 108 },
  { time: "4p–8p", count: 86 },  { time: "8p–12a", count: 54 },
];

/* ── Sire Data ── */
interface SireRecord {
  name: string;
  regNum: string;
  calves: number;
  alive: number;
  dead: number;
  avgBW: number;
  bulls: number;
  heifers: number;
  color: string;
}
const sires: SireRecord[] = [
  { name: "Connealy Capitalist", regNum: "AAA 18967767", calves: 92, alive: 87, dead: 5, avgBW: 83.4, bulls: 51, heifers: 41, color: C.navy },
  { name: "SAV Renown",         regNum: "AAA 19131270", calves: 78, alive: 72, dead: 6, avgBW: 86.1, bulls: 40, heifers: 38, color: C.teal },
  { name: "Baldridge Bronc",    regNum: "AAA 18476203", calves: 68, alive: 65, dead: 3, avgBW: 79.2, bulls: 33, heifers: 35, color: C.gold },
  { name: "Musgrave Big Sky",   regNum: "AAA 19022481", calves: 54, alive: 50, dead: 4, avgBW: 84.7, bulls: 30, heifers: 24, color: "#8B5FBF" },
  { name: "Basin Payweight",    regNum: "AAA 17058822", calves: 46, alive: 44, dead: 2, avgBW: 80.6, bulls: 26, heifers: 20, color: C.red },
  { name: "HA Cowboy Up",       regNum: "AAA 18801445", calves: 38, alive: 36, dead: 2, avgBW: 77.8, bulls: 19, heifers: 19, color: "#4A90D9" },
  { name: "Cleanup / Pasture",  regNum: "—",            calves: 77, alive: 64, dead: 13, avgBW: 81.3, bulls: 48, heifers: 29, color: "rgba(26,26,26,0.25)" },
];

/* Sire birth weight comparison bars */
const sireBWBars = sires.map((s) => ({ sire: s.name.split(" ").pop()!, avgBW: s.avgBW, color: s.color }));

/* Sire calves pie */
const sireCalvesPie = sires.map((s) => ({ name: s.name.split(" ").pop()!, value: s.calves, color: s.color }));

/* Flagged cows */
const flaggedCows = [
  { tag: "2142", reason: "BAD BAG · BAD MOTHER", flag: "red" as const },
  { tag: "1876", reason: "BAD BAG · BAD FEET", flag: "red" as const },
  { tag: "903",  reason: "BAD DISPOSITION", flag: "gold" as const },
  { tag: "1504", reason: "REPEAT DEATH LOSS", flag: "red" as const },
];

/* ══════════════════════════════════════════════
   PRIMITIVES
   ══════════════════════════════════════════════ */

function WCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-xl bg-white border border-[#D4D4D0]/60 font-['Inter'] ${className}`}
      style={{ padding: 14, ...style }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="uppercase" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(26,26,26,0.4)", lineHeight: 1.3 }}>
      {children}
    </p>
  );
}

function BigNum({ value, color = C.navy, size = 28 }: { value: string; color?: string; size?: number }) {
  return <p style={{ fontSize: size, fontWeight: 800, color, lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</p>;
}

function Sub({ children, color = "rgba(26,26,26,0.45)" }: { children: React.ReactNode; color?: string }) {
  return <p style={{ fontSize: 11, fontWeight: 500, color, lineHeight: 1.3 }}>{children}</p>;
}

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 shadow-lg" style={{ backgroundColor: C.navy }}>
      <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: 12, fontWeight: 700, color: p.color || "#fff" }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

function PieLegend({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2">
      {data.map((d) => (
        <div key={d.name} className="flex items-center gap-1.5">
          <div className="rounded-sm" style={{ width: 8, height: 8, backgroundColor: d.color }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(26,26,26,0.55)" }}>{d.name}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.text }}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, whiteSpace: "nowrap" }}>{title}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: "rgba(212,212,208,0.5)" }} />
    </div>
  );
}

const flagColorMap: Record<string, string> = { red: C.red, gold: C.gold, teal: C.teal };

/* ══════════════════════════════════════════════
   CHART COMPONENTS
   ══════════════════════════════════════════════ */

/* ── Season Progress Banner ── */
function SeasonBanner() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: `linear-gradient(145deg, ${C.navy} 0%, ${C.navyMid} 55%, ${C.teal} 100%)` }}>
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="uppercase" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)" }}>2026 Calving Season</p>
            <p style={{ fontSize: 42, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.03em", marginTop: 4 }}>453</p>
            <p style={{ fontSize: 12, fontWeight: 500, color: C.tealLight, marginTop: 4 }}>calves born of 843 expected</p>
          </div>
          <div className="text-right">
            <p style={{ fontSize: 36, fontWeight: 800, color: C.yellow, lineHeight: 1 }}>53.7<span style={{ fontSize: 18 }}>%</span></p>
            <p style={{ fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>complete</p>
          </div>
        </div>

        {/* Progress track */}
        <div className="w-full rounded-full overflow-hidden mt-4" style={{ height: 8, backgroundColor: "rgba(255,255,255,0.1)" }}>
          <div className="h-full rounded-full" style={{ width: "53.7%", background: `linear-gradient(90deg, ${C.yellow} 0%, ${C.tealLight} 100%)` }} />
        </div>
        <div className="flex justify-between mt-1.5" style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>
          <span>Jan 8 · Day 67</span>
          <span style={{ color: C.tealLight }}>8 days remain</span>
          <span>Mar 24</span>
        </div>
      </div>

      {/* Bottom stat row */}
      <div className="grid grid-cols-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {[
          { l: "Alive", v: "418", c: C.tealLight },
          { l: "Dead", v: "35", c: "#FF8A80" },
          { l: "Bulls", v: "247", c: "#fff" },
          { l: "Heifers", v: "194", c: "#fff" },
        ].map((s, i) => (
          <div key={s.l} className="text-center py-2.5" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: s.c, lineHeight: 1.1 }}>{s.v}</p>
            <p className="uppercase" style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.06em", color: "rgba(255,255,255,0.25)" }}>{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Live Calf % Card ── */
function LiveCalfCard() {
  return (
    <WCard>
      <div className="flex items-start justify-between mb-3">
        <div>
          <Label>Live Calf %</Label>
          <div className="flex items-baseline gap-2 mt-1">
            <BigNum value="92.3%" color={C.teal} />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.teal }}>418 alive</span>
          </div>
          <Sub>of 453 born · 35 dead (7.7%)</Sub>
        </div>
        {/* Year-over-year */}
        <div className="text-right">
          <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(26,26,26,0.3)" }}>LAST YEAR</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: "rgba(26,26,26,0.25)" }}>93.2%</p>
          <p style={{ fontSize: 10, fontWeight: 500, color: C.red, marginTop: 1 }}>↓ 0.9%</p>
        </div>
      </div>

      {/* Horizontal gauge — shows live % filled */}
      <div className="relative w-full mt-1" style={{ height: 10 }}>
        <div className="absolute inset-0 rounded-full" style={{ backgroundColor: "rgba(14,38,70,0.06)" }} />
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: "92.3%", background: `linear-gradient(90deg, ${C.navy} 0%, ${C.teal} 100%)` }} />
        {/* Year markers */}
        {[{ yr: "'24", pct: 96.9 }, { yr: "'25", pct: 93.2 }].map((m) => (
          <div key={m.yr} className="absolute" style={{ left: `${m.pct}%`, top: -2 }}>
            <div style={{ width: 1, height: 14, backgroundColor: "rgba(14,38,70,0.25)" }} />
            <span style={{ fontSize: 7, fontWeight: 600, color: "rgba(14,38,70,0.35)", position: "absolute", top: -10, left: -8, whiteSpace: "nowrap" }}>{m.yr}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <span style={{ fontSize: 9, fontWeight: 500, color: "rgba(26,26,26,0.3)" }}>80%</span>
        <span style={{ fontSize: 9, fontWeight: 500, color: "rgba(26,26,26,0.3)" }}>100%</span>
      </div>
    </WCard>
  );
}

/* ── Death Explanation Pie (percentages) ── */
function DeathCausesPie() {
  return (
    <WCard>
      <Label>Cause of Death</Label>
      <div className="flex items-center gap-2 mt-2">
        <div style={{ width: 130, height: 130, flexShrink: 0 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={deathCauses} cx="50%" cy="50%" innerRadius={28} outerRadius={52} dataKey="value" paddingAngle={2} strokeWidth={0}>
                {deathCauses.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<ChartTip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          {deathCauses.map((d) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="rounded-sm" style={{ width: 7, height: 7, backgroundColor: d.color }} />
                <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(26,26,26,0.6)" }}>{d.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{d.pct}%</span>
                <span style={{ fontSize: 9, fontWeight: 500, color: "rgba(26,26,26,0.3)" }}>({d.value})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WCard>
  );
}

/* ── Calving Distribution — Stacked Alive/Dead ── */
function CalvingDistributionBars() {
  return (
    <WCard>
      <Label>Calving Distribution</Label>
      <div style={{ width: "100%", height: 160 }} className="mt-2">
        <ResponsiveContainer>
          <BarChart data={calvingDistribution} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,38,70,0.06)" />
            <XAxis dataKey="w" tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="alive" stackId="s" fill={C.teal} radius={[0, 0, 0, 0]} name="Alive" />
            <Bar dataKey="dead" stackId="s" fill={C.red} radius={[3, 3, 0, 0]} name="Dead" fillOpacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-2">
        {[{ l: "Alive (418)", c: C.teal }, { l: "Dead (35)", c: C.red }].map((x) => (
          <div key={x.l} className="flex items-center gap-1.5">
            <div className="rounded-sm" style={{ width: 8, height: 8, backgroundColor: x.c }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(26,26,26,0.5)" }}>{x.l}</span>
          </div>
        ))}
      </div>
    </WCard>
  );
}

/* ── Calving Curve Area ── */
function CalvingCurve() {
  const [overlay, setOverlay] = useState(true);
  return (
    <WCard>
      <div className="flex items-center justify-between mb-2">
        <Label>Daily Calving Curve</Label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={overlay} onChange={(e) => setOverlay(e.target.checked)} className="rounded" style={{ accentColor: C.teal, width: 14, height: 14 }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(26,26,26,0.4)" }}>vs 2025</span>
        </label>
      </div>
      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>
          <AreaChart data={dailyCurve} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.navy} stopOpacity={0.15} />
                <stop offset="95%" stopColor={C.navy} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,38,70,0.06)" />
            <XAxis dataKey="d" tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <Area type="monotone" dataKey="this" stroke={C.navy} strokeWidth={2.5} fill="url(#curveFill)" name="2026" />
            {overlay && <Area type="monotone" dataKey="last" stroke={C.teal} strokeWidth={1.5} strokeDasharray="5 3" fill="none" name="2025" />}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </WCard>
  );
}

/* ── Weekly Births Stacked Bars ── */
function WeeklyBirthsBars() {
  return (
    <WCard>
      <Label>Weekly Births by Sex</Label>
      <div style={{ width: "100%", height: 180 }} className="mt-2">
        <ResponsiveContainer>
          <BarChart data={weeklyBySex} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,38,70,0.06)" />
            <XAxis dataKey="w" tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="bulls" stackId="s" fill={C.navy} radius={[0, 0, 0, 0]} name="Bulls" />
            <Bar dataKey="heifers" stackId="s" fill={C.teal} radius={[3, 3, 0, 0]} name="Heifers" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-2">
        {[{ l: "Bulls (247)", c: C.navy }, { l: "Heifers (194)", c: C.teal }].map((x) => (
          <div key={x.l} className="flex items-center gap-1.5">
            <div className="rounded-sm" style={{ width: 8, height: 8, backgroundColor: x.c }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(26,26,26,0.5)" }}>{x.l}</span>
          </div>
        ))}
      </div>
    </WCard>
  );
}

/* ── Sex Split Pie ── */
function SexSplitPie() {
  return (
    <WCard>
      <Label>Sex Split</Label>
      <div style={{ width: "100%", height: 140 }} className="mt-1">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={sexPie} cx="50%" cy="50%" innerRadius={34} outerRadius={56} dataKey="value" paddingAngle={2} strokeWidth={0}>
              {sexPie.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip content={<ChartTip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <PieLegend data={sexPie} />
    </WCard>
  );
}

/* ── Birth Weight Vertical Bars ── */
function BirthWeightVertBars() {
  const barColors = [C.teal, C.teal, C.navy, C.navy, C.gold, C.red];
  return (
    <WCard>
      <Label>Birth Weight Distribution (lb)</Label>
      <div style={{ width: "100%", height: 150 }} className="mt-2">
        <ResponsiveContainer>
          <BarChart data={birthWeightBars} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,38,70,0.06)" />
            <XAxis dataKey="range" tick={{ fontSize: 9, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Calves">
              {birthWeightBars.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </WCard>
  );
}

/* ── Weight Metrics Row ── */
function WeightRow() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[{ l: "Avg Weight", v: "82.1 lb" }, { l: "Bulls Avg", v: "84.3 lb" }, { l: "Heifers Avg", v: "79.4 lb" }].map((x) => (
        <div key={x.l} className="text-center rounded-lg py-2 px-1 bg-white border border-[#D4D4D0]/60">
          <p className="uppercase" style={{ fontSize: 9, fontWeight: 600, color: "rgba(26,26,26,0.35)", letterSpacing: "0.06em" }}>{x.l}</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.navy, lineHeight: 1.4 }}>{x.v}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Assist Pie ── */
function AssistPie() {
  return (
    <WCard>
      <Label>Calving Assist</Label>
      <div style={{ width: "100%", height: 130 }} className="mt-1">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={assistPie} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" paddingAngle={2} strokeWidth={0}>
              {assistPie.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip content={<ChartTip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <PieLegend data={assistPie} />
    </WCard>
  );
}

/* ── Time of Day Distribution ── */
function TimeOfDayBars() {
  return (
    <WCard>
      <Label>Calving by Time of Day</Label>
      <div style={{ width: "100%", height: 140 }} className="mt-2">
        <ResponsiveContainer>
          <BarChart data={timeOfDay} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,38,70,0.06)" />
            <XAxis dataKey="time" tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Calvings" fill={C.navy} fillOpacity={0.75} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Sub>Peak: 12p–4p (108 calvings)</Sub>
    </WCard>
  );
}

/* ── Calf Age & Estimated Weight Card ── */
function CalfAgeWeightCard() {
  return (
    <WCard>
      <div className="flex items-start justify-between mb-3">
        <div>
          <Label>Avg Calf Age</Label>
          <div className="flex items-baseline gap-1.5 mt-1">
            <BigNum value="29" />
            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(26,26,26,0.35)" }}>days</span>
          </div>
          <Sub>oldest 67d · youngest 2d</Sub>
        </div>
        <div className="text-right">
          <Label>Est. Avg Weight</Label>
          <div className="flex items-baseline gap-1.5 mt-1 justify-end">
            <BigNum value="248" />
            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(26,26,26,0.35)" }}>lb</span>
          </div>
          <Sub>based on 2.2 lb/day ADG</Sub>
        </div>
      </div>

      {/* Age distribution bar chart */}
      <div className="pt-2 mt-2" style={{ borderTop: "1px solid rgba(212,212,208,0.4)" }}>
        <Label>Calf Age Distribution</Label>
        <div style={{ width: "100%", height: 130 }} className="mt-2">
          <ResponsiveContainer>
            <BarChart data={calfAgeData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,38,70,0.06)" />
              <XAxis dataKey="range" tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Calves" fill={C.navy} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WCard>
  );
}

/* ── Estimated Weight by Birth Week ── */
function EstWeightByWeekCard() {
  return (
    <WCard>
      <Label>Est. Current Weight by Birth Week</Label>
      <Sub>Assumes 82 lb avg birth weight + 2.2 lb/day ADG</Sub>
      <div style={{ width: "100%", height: 160 }} className="mt-2">
        <ResponsiveContainer>
          <BarChart data={estWeightByWeek} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="estWtGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.teal} stopOpacity={1} />
                <stop offset="100%" stopColor={C.navy} stopOpacity={0.85} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,38,70,0.06)" />
            <XAxis dataKey="cohort" tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} unit=" lb" />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="est" radius={[4, 4, 0, 0]} name="Est. Weight" fill="url(#estWtGrad)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {[{ l: "Lightest Cohort", v: "145 lb", s: "Wk 1 calves" }, { l: "Avg Est.", v: "248 lb", s: "all calves" }, { l: "Heaviest Cohort", v: "410 lb", s: "Wk 10 calves" }].map((x) => (
          <div key={x.l} className="text-center rounded-lg py-1.5 px-1" style={{ backgroundColor: "rgba(14,38,70,0.03)" }}>
            <p className="uppercase" style={{ fontSize: 8, fontWeight: 600, color: "rgba(26,26,26,0.3)", letterSpacing: "0.06em" }}>{x.l}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, lineHeight: 1.3 }}>{x.v}</p>
            <p style={{ fontSize: 8, fontWeight: 500, color: "rgba(26,26,26,0.3)" }}>{x.s}</p>
          </div>
        ))}
      </div>
    </WCard>
  );
}

/* ── Sire Breakdown Section ── */
function SireBreakdown() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      {/* Sire calves distribution pie */}
      <WCard>
        <Label>Calves by Sire</Label>
        <div className="flex items-center gap-2 mt-2">
          <div style={{ width: 130, height: 130, flexShrink: 0 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={sireCalvesPie} cx="50%" cy="50%" innerRadius={28} outerRadius={52} dataKey="value" paddingAngle={2} strokeWidth={0}>
                  {sireCalvesPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<ChartTip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            {sires.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="rounded-sm shrink-0" style={{ width: 7, height: 7, backgroundColor: s.color }} />
                  <span className="truncate" style={{ fontSize: 11, fontWeight: 500, color: "rgba(26,26,26,0.6)" }}>{s.name.split(" ").pop()}</span>
                </div>
                <span className="shrink-0 ml-2" style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{s.calves}</span>
              </div>
            ))}
          </div>
        </div>
      </WCard>

      {/* Avg birth weight by sire — bar chart */}
      <WCard>
        <Label>Avg Birth Weight by Sire (lb)</Label>
        <div style={{ width: "100%", height: 160 }} className="mt-2">
          <ResponsiveContainer>
            <BarChart data={sireBWBars} margin={{ top: 4, right: 4, left: -22, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,38,70,0.06)" />
              <XAxis type="number" tick={{ fontSize: 8, fill: "rgba(26,26,26,0.35)" }} axisLine={false} tickLine={false} domain={[70, 90]} />
              <YAxis type="category" dataKey="sire" tick={{ fontSize: 9, fill: "rgba(26,26,26,0.5)" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="avgBW" radius={[0, 4, 4, 0]} name="Avg BW">
                {sireBWBars.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </WCard>

      {/* Sire detail cards */}
      <WCard style={{ padding: 0 }}>
        <div className="px-3.5 pt-3 pb-1">
          <Label>Sire Detail</Label>
        </div>
        {sires.map((s, idx) => {
          const isOpen = expanded === s.name;
          const livePct = Math.round((s.alive / s.calves) * 100);
          return (
            <div key={s.name}>
              {idx > 0 && <div className="h-px mx-3.5" style={{ backgroundColor: "rgba(212,212,208,0.3)" }} />}
              <button
                onClick={() => setExpanded(isOpen ? null : s.name)}
                className="w-full flex items-center justify-between px-3.5 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="rounded-full shrink-0" style={{ width: 8, height: 8, backgroundColor: s.color }} />
                  <div className="min-w-0">
                    <p className="truncate" style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.name}</p>
                    <p className="truncate" style={{ fontSize: 10, fontWeight: 500, color: "rgba(26,26,26,0.35)" }}>{s.regNum}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{s.calves}</p>
                    <p style={{ fontSize: 9, fontWeight: 500, color: "rgba(26,26,26,0.3)" }}>calves</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className="transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M4 6L8 10L12 6" stroke={C.border} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {/* Expanded detail */}
              <div className="overflow-hidden transition-all duration-200"
                style={{ maxHeight: isOpen ? 200 : 0, opacity: isOpen ? 1 : 0 }}>
                <div className="px-3.5 pb-3 pt-0.5">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { l: "Avg BW", v: `${s.avgBW} lb` },
                      { l: "Live %", v: `${livePct}%` },
                      { l: "Bulls", v: `${s.bulls}` },
                      { l: "Heifers", v: `${s.heifers}` },
                    ].map((m) => (
                      <div key={m.l} className="text-center rounded-lg py-1.5" style={{ backgroundColor: "rgba(14,38,70,0.03)" }}>
                        <p className="uppercase" style={{ fontSize: 8, fontWeight: 600, color: "rgba(26,26,26,0.3)", letterSpacing: "0.05em" }}>{m.l}</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, lineHeight: 1.3 }}>{m.v}</p>
                      </div>
                    ))}
                  </div>
                  {s.dead > 0 && (
                    <p className="mt-2" style={{ fontSize: 10, fontWeight: 500, color: C.red }}>
                      {s.dead} dead ({Math.round((s.dead / s.calves) * 100)}% mortality)
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </WCard>
    </>
  );
}

/* ── Flagged Cows ── */
function FlaggedList() {
  const nav = useNavigate();
  return (
    <WCard>
      {flaggedCows.map((cow, i) => (
        <div key={cow.tag}>
          <button onClick={() => nav(`/animals/${cow.tag}`)} className="w-full flex items-center justify-between py-2.5 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="rounded-full" style={{ width: 6, height: 6, backgroundColor: flagColorMap[cow.flag] }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{cow.tag}</span>
              <span className="uppercase rounded-full px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.02em", backgroundColor: `${flagColorMap[cow.flag]}18`, color: flagColorMap[cow.flag] }}>{cow.reason}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke={C.border} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {i < flaggedCows.length - 1 && <div className="h-px" style={{ backgroundColor: "rgba(212,212,208,0.3)" }} />}
        </div>
      ))}
      <p className="text-center mt-2" style={{ fontSize: 11, fontWeight: 500, color: "rgba(26,26,26,0.3)" }}>+ 4 more flagged cows</p>
    </WCard>
  );
}

/* ── View Records Link ── */
function RecordsLink() {
  const nav = useNavigate();
  return (
    <WCard>
      <button onClick={() => nav("/calving")} className="w-full flex items-center justify-between cursor-pointer">
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>View all calving records</p>
          <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(26,26,26,0.35)" }}>453 records · 2026 Season</p>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 5L12.5 10L7.5 15" stroke={C.border} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </WCard>
  );
}


/* ══════════════════════════════════════════════
   MAIN SCREEN — Scorecard Layout
   ══════════════════════════════════════════════ */
export function CalvingDashboardScreen() {
  const sw = useSidebarWidth();

  return (
    <div className="min-h-screen font-['Inter'] pb-20" style={{ backgroundColor: C.cream, paddingLeft: sw }}>
      <div className="w-full max-w-[576px] mx-auto px-4 pt-3">

        <div className="flex flex-col gap-3">
          <SeasonBanner />
          <LiveCalfCard />

          <SectionDivider title="Calving Distribution" />
          <CalvingDistributionBars />

          <SectionDivider title="Death Breakdown" />
          <DeathCausesPie />

          <SectionDivider title="Calving Curve" />
          <CalvingCurve />

          <SectionDivider title="Sex & Weight" />
          <WeeklyBirthsBars />
          <div className="grid grid-cols-2 gap-3">
            <SexSplitPie />
            <BirthWeightVertBars />
          </div>
          <WeightRow />

          <SectionDivider title="Calf Age & Est. Weight" />
          <CalfAgeWeightCard />
          <EstWeightByWeekCard />

          <SectionDivider title="Sire Breakdown" />
          <SireBreakdown />

          <SectionDivider title="Distributions" />
          <div className="grid grid-cols-2 gap-3">
            <TimeOfDayBars />
            <AssistPie />
          </div>

          <SectionDivider title="Flagged Cows" />
          <FlaggedList />
          <RecordsLink />
        </div>

      </div>
    </div>
  );
}