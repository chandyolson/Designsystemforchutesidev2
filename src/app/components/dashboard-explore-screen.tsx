import { useState } from "react";
import { useNavigate } from "react-router";

/* ── Shared Data ──────────────────────────────── */
const stats = [
  { label: "Total Head", value: "847", subtitle: "↑ 34 this quarter" },
  { label: "Active Calving", value: "23", subtitle: "6 expected this week" },
  { label: "Open Projects", value: "5", subtitle: "2 due before Friday" },
];

const recentAnimals = [
  { tag: "4782", breed: "Black Angus", weight: "1,247 lbs", pen: "Pen 2A", flag: "teal" as const, note: "", tagColor: "Green", memo: "Top gaining heifer this cycle" },
  { tag: "3091", breed: "Hereford", weight: "983 lbs", pen: "Pen 4B", flag: "gold" as const, note: "Treatment follow-up · Thursday", tagColor: "Amber", memo: "Slow to eat — monitor closely" },
  { tag: "5520", breed: "Charolais", weight: "1,102 lbs", pen: "Pen 1C", flag: "red" as const, note: "Penicillin 10cc due · Overdue 2 days", tagColor: "Red", memo: "Respiratory — isolate if no improvement" },
  { tag: "2218", breed: "Simmental", weight: "1,340 lbs", pen: "Pen 3A", flag: "teal" as const, note: "", tagColor: "Green", memo: "" },
  { tag: "7801", breed: "Brahman Cross", weight: "1,410 lbs", pen: "Pen 1A", flag: "gold" as const, note: "Calving expected · Mar 8", tagColor: "Amber", memo: "First calf heifer — watch at delivery" },
];

const upcomingWork = [
  { task: "Pregnancy check — Pen 3A", count: "18 head", due: "Tomorrow" },
  { task: "Vaccination booster — Pen 1C", count: "12 head", due: "Wed, Mar 4" },
  { task: "Weaning — North Pasture", count: "31 head", due: "Mar 10" },
];

const activityFeed = [
  { time: "2:14 PM", text: "Tag 4782 weighed at 1,247 lbs", flag: "teal" as const, type: "Weights & Scores" },
  { time: "9:05 AM", text: "Tag 2218 BCS scored at 6", flag: "teal" as const, type: "Weights & Scores" },
  { time: "1:45 PM", text: "Tag 5520 treatment — Penicillin 10cc IM", flag: "red" as const, type: "Treatments" },
  { time: "10:30 AM", text: "Tag 3091 dewormer — Ivermectin 8cc SC", flag: "gold" as const, type: "Treatments" },
  { time: "11:20 AM", text: "Tag 3091 moved to Pen 4B", flag: "gold" as const, type: "Movements" },
  { time: "8:50 AM", text: "Tag 7801 moved to Pen 1A from Pasture N", flag: "teal" as const, type: "Movements" },
  { time: "8:30 AM", text: "Pen 2A processing started — 14 head", flag: "teal" as const, type: "Processing" },
];

/* Group activities by type */
function groupActivities() {
  const grouped: Record<string, typeof activityFeed> = {};
  const order: string[] = [];
  for (const entry of activityFeed) {
    if (!grouped[entry.type]) {
      grouped[entry.type] = [];
      order.push(entry.type);
    }
    grouped[entry.type].push(entry);
  }
  return { grouped, order };
}

/* ══════════════════════════════════════════════
   COLOR THEMES
   ══════════════════════════════════════════════ */
interface Theme {
  name: string;
  description: string;
  bg: string;
  cardBg: string;
  gradientFrom: string;
  gradientMid: string;
  gradientTo: string;
  accent: string;
  accentLight: string;
  cta: string;
  ctaText: string;
  ctaShadow: string;
  cardText: string;
  cardTextDim: string;
  cardDivider: string;
  headingText: string;
  headingDot: string;
  bodyText: string;
  bodyTextDim: string;
  subtitleColor: string;
  viewAllColor: string;
  penColor: string;
  secondaryBtnText: string;
  timelineBar: string;
  sectionLabelColor: string;
  badgeBg: string;
  badgeText: string;
  totalColor: string;
  flagGreen: string;
  flagAmber: string;
  flagRed: string;
}

const themes: Record<string, Theme> = {
  navy: {
    name: "NAVY & TEAL",
    description: "Original · dark navy · teal accents · yellow CTA",
    bg: "#F5F5F0",
    cardBg: "#0E2646",
    gradientFrom: "#0E2646",
    gradientMid: "#0E2646",
    gradientTo: "#55BAAA",
    accent: "#55BAAA",
    accentLight: "#A8E6DA",
    cta: "#F3D12A",
    ctaText: "#0E2646",
    ctaShadow: "rgba(243,209,42,0.3)",
    cardText: "#F0F0F0",
    cardTextDim: "rgba(240,240,240,0.35)",
    cardDivider: "rgba(255,255,255,0.05)",
    headingText: "#0E2646",
    headingDot: "#F3D12A",
    bodyText: "rgba(26,26,26,0.60)",
    bodyTextDim: "rgba(26,26,26,0.20)",
    subtitleColor: "#A8E6DA",
    viewAllColor: "#F3D12A",
    penColor: "rgba(85,186,170,0.50)",
    secondaryBtnText: "#55BAAA",
    timelineBar: "rgba(14,38,70,0.08)",
    sectionLabelColor: "rgba(14,38,70,0.30)",
    badgeBg: "#F3D12A",
    badgeText: "#0E2646",
    totalColor: "#0E2646",
    flagGreen: "#27AE60",
    flagAmber: "#E17C00",
    flagRed: "#9B2335",
  },
  earth: {
    name: "EARTH & COPPER",
    description: "Warm brown · copper accents · wheat gold CTA",
    bg: "#F5F0E8",
    cardBg: "#3B2314",
    gradientFrom: "#3B2314",
    gradientMid: "#4A2E1A",
    gradientTo: "#C77B4A",
    accent: "#C77B4A",
    accentLight: "#E4B896",
    cta: "#D4A84B",
    ctaText: "#3B2314",
    ctaShadow: "rgba(212,168,75,0.3)",
    cardText: "#F5EDE4",
    cardTextDim: "rgba(245,237,228,0.35)",
    cardDivider: "rgba(255,255,255,0.06)",
    headingText: "#3B2314",
    headingDot: "#D4A84B",
    bodyText: "rgba(59,35,20,0.55)",
    bodyTextDim: "rgba(59,35,20,0.20)",
    subtitleColor: "#E4B896",
    viewAllColor: "#D4A84B",
    penColor: "rgba(199,123,74,0.50)",
    secondaryBtnText: "#C77B4A",
    timelineBar: "rgba(59,35,20,0.08)",
    sectionLabelColor: "rgba(59,35,20,0.30)",
    badgeBg: "#D4A84B",
    badgeText: "#3B2314",
    totalColor: "#3B2314",
    flagGreen: "#5B8C5A",
    flagAmber: "#C4762B",
    flagRed: "#A63D2B",
  },
  slate: {
    name: "SLATE & SAGE",
    description: "Cool charcoal · sage green accents · gold CTA",
    bg: "#F0F2F1",
    cardBg: "#2D3436",
    gradientFrom: "#2D3436",
    gradientMid: "#374042",
    gradientTo: "#6C9A8B",
    accent: "#6C9A8B",
    accentLight: "#A3C9BD",
    cta: "#D4A84B",
    ctaText: "#2D3436",
    ctaShadow: "rgba(212,168,75,0.3)",
    cardText: "#EDF0EF",
    cardTextDim: "rgba(237,240,239,0.35)",
    cardDivider: "rgba(255,255,255,0.06)",
    headingText: "#2D3436",
    headingDot: "#D4A84B",
    bodyText: "rgba(45,52,54,0.55)",
    bodyTextDim: "rgba(45,52,54,0.20)",
    subtitleColor: "#A3C9BD",
    viewAllColor: "#D4A84B",
    penColor: "rgba(108,154,139,0.50)",
    secondaryBtnText: "#6C9A8B",
    timelineBar: "rgba(45,52,54,0.08)",
    sectionLabelColor: "rgba(45,52,54,0.30)",
    badgeBg: "#D4A84B",
    badgeText: "#2D3436",
    totalColor: "#2D3436",
    flagGreen: "#5A9A7A",
    flagAmber: "#CB8E4E",
    flagRed: "#C4504A",
  },
};

const themeKeys = ["navy", "earth", "slate"] as const;

/* Helper to resolve flag color from theme */
function themeFlagColor(theme: Theme, flag: "teal" | "gold" | "red"): string {
  if (flag === "teal") return theme.flagGreen;
  if (flag === "gold") return theme.flagAmber;
  return theme.flagRed;
}

/* Themed Flag Pennant */
function ThemedFlagIcon({
  color,
  theme,
  size = "sm",
}: {
  color: "teal" | "gold" | "red";
  theme: Theme;
  size?: "sm" | "md" | "lg";
}) {
  const fill = themeFlagColor(theme, color);
  const sizeMap = {
    sm: { w: 18, h: 16, stroke: 1.6 },
    md: { w: 24, h: 20, stroke: 2 },
    lg: { w: 32, h: 26, stroke: 2.4 },
  };
  const s = sizeMap[size];

  return (
    <svg width={s.w} height={s.h} viewBox="0 0 32 28" fill="none" aria-label={`${color} flag`}>
      <line x1="3" y1="2" x2="3" y2="26" stroke={fill} strokeWidth={s.stroke} strokeLinecap="round" />
      <path d="M3 3H27L23 9.5L27 16H3V3Z" fill={fill} />
    </svg>
  );
}

/* ── Themed Section Heading ── */
function ThemedSectionHeading({ text, theme: t }: { text: string; theme: Theme }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <div className="rounded-full" style={{ width: 4, height: 4, backgroundColor: t.headingDot }} />
      <span className="font-['Inter'] uppercase" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: t.headingText }}>
        {text}
      </span>
    </div>
  );
}

/* Layout descriptor for subtitle */
const layoutDescriptions: Record<string, string> = {
  bold: "Compact strips · wide stat banner · vertical timeline",
  field: "Big touch targets · fewer items · high contrast for outdoor use",
  dense: "More data per screen · table rows · mini indicators for office review",
  cards: "Standalone animal cards · full detail · inline actions for focused review",
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
export function DashboardExploreScreen() {
  const [activeTheme, setActiveTheme] = useState<string>("navy");
  const [activeLayout, setActiveLayout] = useState<"bold" | "field" | "dense" | "cards">("bold");
  const t = themes[activeTheme];

  const layoutOptions = [
    { key: "bold" as const, label: "BOLD" },
    { key: "field" as const, label: "FIELD" },
    { key: "dense" as const, label: "DENSE" },
    { key: "cards" as const, label: "CARDS" },
  ];

  return (
    <div className="space-y-5">
      {/* ── Layout Toggle ── */}
      <div
        className="flex items-center gap-1 rounded-full p-1"
        style={{ backgroundColor: t.cardBg }}
      >
        {layoutOptions.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setActiveLayout(opt.key)}
            className="flex-1 rounded-full text-center cursor-pointer font-['Open_Sans'] transition-all duration-200"
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "7px 0",
              letterSpacing: "0.08em",
              backgroundColor: activeLayout === opt.key ? t.cta : "transparent",
              color: activeLayout === opt.key ? t.ctaText : `${t.cardText}50`,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Layout Description ── */}
      <p className="text-center font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 500, color: t.bodyTextDim }}>
        {layoutDescriptions[activeLayout]}
      </p>

      {/* ── Theme Selector ── */}
      <div className="space-y-2">
        <div className="flex gap-2">
          {themeKeys.map((key) => {
            const th = themes[key];
            const isActive = activeTheme === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTheme(key)}
                className="flex-1 rounded-xl py-2.5 cursor-pointer font-['Open_Sans'] transition-all duration-200"
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  backgroundColor: isActive ? th.cardBg : "white",
                  color: isActive ? th.cta : "rgba(26,26,26,0.35)",
                  border: isActive ? "none" : "1px solid rgba(26,26,26,0.08)",
                }}
              >
                {th.name}
              </button>
            );
          })}
        </div>
        <p className="text-center font-['Open_Sans']" style={{ fontSize: 11, fontWeight: 500, color: "rgba(26,26,26,0.30)" }}>
          {t.description}
        </p>
      </div>

      {/* ── Color Swatches Preview ── */}
      <div className="flex items-center gap-2 justify-center">
        {[t.cardBg, t.gradientTo, t.flagGreen, t.flagAmber, t.flagRed, t.cta].map((color, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="rounded-full"
              style={{ width: 24, height: 24, backgroundColor: color, boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}
            />
            <span className="font-['Open_Sans']" style={{ fontSize: 7, fontWeight: 600, color: "rgba(26,26,26,0.25)" }}>
              {color}
            </span>
          </div>
        ))}
      </div>

      {/* ══ THEMED DASHBOARD ══ */}
      {activeLayout === "bold" && <BoldLayout theme={t} />}
      {activeLayout === "field" && <FieldLayout theme={t} />}
      {activeLayout === "dense" && <DenseLayout theme={t} />}
      {activeLayout === "cards" && <CardsLayout theme={t} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   BOLD — Compact strips, wide banner, vertical timeline
   ══════════════════════════════════════════════════════════════ */
function BoldLayout({ theme: t }: { theme: Theme }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      {/* Inline Stat Banner */}
      <div
        className="rounded-2xl px-3 py-4 font-['Open_Sans']"
        style={{ background: `linear-gradient(135deg, ${t.gradientFrom} 0%, ${t.gradientMid} 60%, ${t.gradientTo} 100%)` }}
      >
        <div className="flex items-stretch">
          {stats.map((s, i) => (
            <div key={s.label} className="flex-1 text-center" style={{ borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
              <p className="text-white" style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</p>
              <p className="uppercase mt-1.5" style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.30)" }}>{s.label}</p>
              <p className="mt-0.5" style={{ fontSize: 10, fontWeight: 500, color: t.subtitleColor }}>{s.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Herd Health Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-['Open_Sans'] uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: t.sectionLabelColor }}>Herd Health</span>
          <span className="font-['Open_Sans']" style={{ fontSize: 12, fontWeight: 700, color: t.totalColor }}>847</span>
        </div>
        <div className="flex rounded-full overflow-hidden" style={{ height: 8 }}>
          <div style={{ flex: 812, backgroundColor: t.flagGreen }} />
          <div style={{ flex: 27, backgroundColor: t.flagAmber }} />
          <div style={{ flex: 8, backgroundColor: t.flagRed }} />
        </div>
        <div className="flex items-center gap-4 px-1">
          {([
            { flag: "teal" as const, count: "812" },
            { flag: "gold" as const, count: "27" },
            { flag: "red" as const, count: "8" },
          ]).map((h) => (
            <div key={h.flag} className="flex items-center gap-1.5">
              <ThemedFlagIcon color={h.flag} theme={t} size="sm" />
              <span className="font-['Open_Sans']" style={{ fontSize: 12, fontWeight: 700, color: t.headingText }}>{h.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Animals — Compact Dark Strips */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <ThemedSectionHeading text="Recent Animals" theme={t} />
          <span className="font-['Open_Sans'] cursor-pointer" style={{ fontSize: 11, fontWeight: 700, color: t.viewAllColor }} onClick={() => navigate("/animals")}>VIEW ALL</span>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: t.cardBg }}>
          {recentAnimals.map((a, i) => (
            <div key={a.tag} className="px-4 py-3 flex items-center gap-3 font-['Open_Sans']" style={{ borderBottom: i < recentAnimals.length - 1 ? `1px solid ${t.cardDivider}` : "none" }}>
              <div className="shrink-0 rounded-full" style={{ width: 8, height: 8, backgroundColor: themeFlagColor(t, a.flag) }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span style={{ fontSize: 14, fontWeight: 700, color: t.cardText }}>{a.tag}</span>
                  <span className="truncate" style={{ fontSize: 11, fontWeight: 400, color: t.cardTextDim }}>{a.breed}</span>
                </div>
                {a.note && <p className="truncate mt-0.5" style={{ fontSize: 10, color: t.cardTextDim }}>{a.note}</p>}
              </div>
              <div className="shrink-0 text-right">
                <p style={{ fontSize: 12, fontWeight: 600, color: `${t.cardText}99` }}>{a.weight}</p>
                <p style={{ fontSize: 10, fontWeight: 500, color: t.penColor }}>{a.pen}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Work */}
      <section className="space-y-2.5">
        <ThemedSectionHeading text="Upcoming Work" theme={t} />
        <div className="space-y-2">
          {upcomingWork.map((w) => (
            <div key={w.task} className="rounded-xl px-4 py-3 flex items-center justify-between font-['Open_Sans']" style={{ backgroundColor: t.cardBg }}>
              <div className="min-w-0 flex-1">
                <p className="truncate" style={{ fontSize: 13, fontWeight: 600, color: t.cardText }}>{w.task}</p>
                <p style={{ fontSize: 11, color: t.cardTextDim }}>{w.count}</p>
              </div>
              <span className="shrink-0 rounded-full px-2.5 py-1" style={{ fontSize: 10, fontWeight: 700, color: t.badgeText, backgroundColor: t.badgeBg }}>{w.due}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Activity — Grouped Timeline */}
      <section className="space-y-2.5">
        <ThemedSectionHeading text="Today's Activity" theme={t} />
        <div className="space-y-3">
          {(() => {
            const { grouped, order } = groupActivities();
            return order.map((type) => {
              const entries = grouped[type];
              return (
                <div key={type}>
                  {/* Group header */}
                  <div className="flex items-center gap-2 mb-1.5 px-1">
                    <div className="rounded" style={{ width: 3, height: 12, backgroundColor: t.accent }} />
                    <span className="font-['Open_Sans'] uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: t.sectionLabelColor }}>
                      {type}
                    </span>
                    <span className="font-['Open_Sans']" style={{ fontSize: 9, fontWeight: 700, color: t.bodyTextDim }}>
                      ({entries.length})
                    </span>
                  </div>
                  {/* Entries */}
                  <div className="pl-2">
                    {entries.map((entry, i) => (
                      <div key={entry.time + entry.text} className="flex gap-3" style={{ minHeight: 38 }}>
                        <div className="flex flex-col items-center" style={{ width: 12 }}>
                          <div className="shrink-0 rounded-full" style={{ width: 8, height: 8, backgroundColor: themeFlagColor(t, entry.flag), marginTop: 5 }} />
                          {i < entries.length - 1 && <div className="flex-1" style={{ width: 1.5, backgroundColor: t.timelineBar }} />}
                        </div>
                        <div className="flex-1 min-w-0 pb-2">
                          <p className="font-['Open_Sans']" style={{ fontSize: 12, lineHeight: 1.5, color: t.bodyText }}>{entry.text}</p>
                          <p className="font-['Open_Sans'] mt-0.5" style={{ fontSize: 10, fontWeight: 600, color: t.bodyTextDim }}>{entry.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </section>

      {/* Quick Actions */}
      <div className="space-y-2 pt-1">
        <button type="button" className="w-full rounded-xl cursor-pointer font-['Open_Sans'] transition-all active:scale-[0.98]" style={{ fontSize: 14, fontWeight: 700, padding: "13px 0", backgroundColor: t.cta, color: t.ctaText, boxShadow: `0 2px 12px ${t.ctaShadow}` }} onClick={() => navigate("/red-book/new")}>
          + NEW RED BOOK NOTE
        </button>
        <button type="button" className="w-full rounded-xl cursor-pointer font-['Open_Sans'] transition-all active:scale-[0.98]" style={{ fontSize: 13, fontWeight: 700, padding: "12px 0", backgroundColor: t.cardBg, color: t.secondaryBtnText }} onClick={() => navigate("/cow-work")}>
          START WORK SESSION
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FIELD READY — Big touch targets, fewer items, glove-friendly
   ══════════════════════════════════════════════════════════════ */
function FieldLayout({ theme: t }: { theme: Theme }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      {/* Hero stat — single large number */}
      <div
        className="rounded-2xl px-5 py-5 text-center font-['Open_Sans']"
        style={{ background: `linear-gradient(135deg, ${t.gradientFrom} 0%, ${t.gradientMid} 60%, ${t.gradientTo} 100%)` }}
      >
        <p style={{ fontSize: 64, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", color: "white" }}>847</p>
        <p className="uppercase mt-1" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)" }}>Total Head</p>
        <div className="flex justify-center gap-6 mt-4">
          {[
            { label: "Calving", value: "23" },
            { label: "Projects", value: "5" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p style={{ fontSize: 26, fontWeight: 800, color: "white", lineHeight: 1 }}>{s.value}</p>
              <p className="uppercase mt-0.5" style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", color: t.subtitleColor }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Herd Health — Large flag buttons */}
      <div className="space-y-2">
        <ThemedSectionHeading text="Herd Health" theme={t} />
        <div className="flex gap-2.5">
          {([
            { flag: "teal" as const, count: "812", label: "Healthy" },
            { flag: "gold" as const, count: "27", label: "Watch" },
            { flag: "red" as const, count: "8", label: "Critical" },
          ]).map((h) => (
            <button
              key={h.flag}
              type="button"
              className="flex-1 rounded-2xl py-4 flex flex-col items-center gap-2 cursor-pointer font-['Open_Sans'] transition-all active:scale-[0.97]"
              style={{ backgroundColor: t.cardBg, border: "none" }}
            >
              <ThemedFlagIcon color={h.flag} theme={t} size="lg" />
              <p style={{ fontSize: 24, fontWeight: 800, color: t.cardText, lineHeight: 1 }}>{h.count}</p>
              <p className="uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: t.cardTextDim }}>{h.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Needs Attention — Only amber + red, large tap targets */}
      <section className="space-y-2.5">
        <ThemedSectionHeading text="Needs Attention" theme={t} />
        <div className="space-y-2.5">
          {recentAnimals.filter((a) => a.flag !== "teal").map((a) => (
            <button
              key={a.tag}
              type="button"
              className="w-full rounded-2xl px-5 py-4 flex items-center gap-4 cursor-pointer font-['Open_Sans'] transition-all active:scale-[0.98] text-left"
              style={{ backgroundColor: t.cardBg, border: "none" }}
              onClick={() => navigate(`/animals/${a.tag.slice(1)}`)}
            >
              {/* Flag stripe on left */}
              <div className="shrink-0 rounded-full" style={{ width: 12, height: 44, backgroundColor: themeFlagColor(t, a.flag), borderRadius: 6 }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span style={{ fontSize: 20, fontWeight: 800, color: t.cardText }}>{a.tag}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: t.cardTextDim }}>{a.breed}</span>
                </div>
                {a.note && <p className="mt-1" style={{ fontSize: 12, color: t.cardTextDim }}>{a.note}</p>}
              </div>
              <div className="shrink-0 text-right">
                <p style={{ fontSize: 14, fontWeight: 700, color: `${t.cardText}99` }}>{a.weight}</p>
                <p style={{ fontSize: 11, fontWeight: 500, color: t.penColor }}>{a.pen}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Next Up — Single prominent card */}
      <section className="space-y-2.5">
        <ThemedSectionHeading text="Next Up" theme={t} />
        <div
          className="rounded-2xl px-5 py-4 font-['Open_Sans']"
          style={{ background: `linear-gradient(135deg, ${t.gradientFrom} 0%, ${t.gradientTo} 100%)` }}
        >
          <p style={{ fontSize: 16, fontWeight: 700, color: t.cardText }}>{upcomingWork[0].task}</p>
          <p className="mt-1" style={{ fontSize: 13, color: t.subtitleColor }}>{upcomingWork[0].count}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="rounded-full px-3 py-1.5" style={{ fontSize: 11, fontWeight: 700, backgroundColor: t.cta, color: t.ctaText }}>{upcomingWork[0].due}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: t.cardTextDim }}>+{upcomingWork.length - 1} more scheduled</span>
          </div>
        </div>
      </section>

      {/* Big action buttons — extra tall for gloves */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          className="w-full rounded-2xl cursor-pointer font-['Open_Sans'] transition-all active:scale-[0.98]"
          style={{ fontSize: 16, fontWeight: 700, padding: "18px 0", backgroundColor: t.cta, color: t.ctaText, boxShadow: `0 4px 16px ${t.ctaShadow}` }}
          onClick={() => navigate("/red-book/new")}
        >
          + NEW RED BOOK NOTE
        </button>
        <button
          type="button"
          className="w-full rounded-2xl cursor-pointer font-['Open_Sans'] transition-all active:scale-[0.98]"
          style={{ fontSize: 15, fontWeight: 700, padding: "16px 0", backgroundColor: t.cardBg, color: t.secondaryBtnText }}
          onClick={() => navigate("/cow-work")}
        >
          START WORK SESSION
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DENSE — Table-like rows, more data visible, office/desk mode
   ══════════════════════════════════════════════════════════════ */
function DenseLayout({ theme: t }: { theme: Theme }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      {/* Compact stat strip */}
      <div className="flex gap-1.5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex-1 rounded-xl px-2.5 py-2.5 font-['Open_Sans']"
            style={{ background: `linear-gradient(135deg, ${t.gradientFrom}, ${t.gradientTo})` }}
          >
            <p style={{ fontSize: 20, fontWeight: 800, color: "white", lineHeight: 1 }}>{s.value}</p>
            <p className="uppercase mt-0.5" style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.30)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Herd Health — Inline micro bar + numbers */}
      <div className="flex items-center gap-3 px-1 font-['Open_Sans']">
        <span className="uppercase" style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: t.sectionLabelColor }}>Health</span>
        <div className="flex rounded-full overflow-hidden flex-1" style={{ height: 5 }}>
          <div style={{ flex: 812, backgroundColor: t.flagGreen }} />
          <div style={{ flex: 27, backgroundColor: t.flagAmber }} />
          <div style={{ flex: 8, backgroundColor: t.flagRed }} />
        </div>
        <div className="flex items-center gap-2">
          {([
            { flag: "teal" as const, c: "812" },
            { flag: "gold" as const, c: "27" },
            { flag: "red" as const, c: "8" },
          ]).map((h) => (
            <span key={h.flag} style={{ fontSize: 10, fontWeight: 700, color: themeFlagColor(t, h.flag) }}>{h.c}</span>
          ))}
        </div>
      </div>

      {/* Table Header */}
      <section className="space-y-1">
        <div className="flex items-center justify-between px-1 mb-1">
          <ThemedSectionHeading text="Recent Animals" theme={t} />
          <span className="font-['Open_Sans'] cursor-pointer" style={{ fontSize: 10, fontWeight: 700, color: t.viewAllColor }} onClick={() => navigate("/animals")}>VIEW ALL</span>
        </div>
        {/* Column headers */}
        <div className="flex items-center px-3 py-1.5 font-['Open_Sans']" style={{ backgroundColor: `${t.cardBg}08` }}>
          <span style={{ width: 20 }} />
          <span className="uppercase" style={{ flex: 1, fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: t.sectionLabelColor }}>Tag</span>
          <span className="uppercase" style={{ width: 80, fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: t.sectionLabelColor }}>Breed</span>
          <span className="uppercase text-right" style={{ width: 65, fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: t.sectionLabelColor }}>Weight</span>
          <span className="uppercase text-right" style={{ width: 45, fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: t.sectionLabelColor }}>Pen</span>
        </div>
        {/* Table rows */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.cardBg }}>
          {recentAnimals.map((a, i) => (
            <div key={a.tag}>
              <div className="flex items-center px-3 py-2 font-['Open_Sans']">
                <div className="shrink-0" style={{ width: 20 }}>
                  <div className="rounded-full" style={{ width: 6, height: 6, backgroundColor: themeFlagColor(t, a.flag) }} />
                </div>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: t.cardText }}>{a.tag}</span>
                <span className="truncate" style={{ width: 80, fontSize: 11, color: t.cardTextDim }}>{a.breed}</span>
                <span className="text-right" style={{ width: 65, fontSize: 11, fontWeight: 600, color: `${t.cardText}99` }}>{a.weight}</span>
                <span className="text-right" style={{ width: 45, fontSize: 10, color: t.penColor }}>{a.pen}</span>
              </div>
              {a.note && (
                <p className="px-3 pb-1.5 truncate font-['Open_Sans']" style={{ fontSize: 9, color: t.cardTextDim, marginTop: -2, paddingLeft: 32 }}>{a.note}</p>
              )}
              {i < recentAnimals.length - 1 && <div style={{ height: 1, backgroundColor: t.cardDivider, marginLeft: 20, marginRight: 12 }} />}
            </div>
          ))}
        </div>
      </section>

      {/* Work + Activity side by side in compact form */}
      <div className="grid grid-cols-2 gap-2">
        {/* Work column */}
        <section className="space-y-1.5">
          <ThemedSectionHeading text="Work Queue" theme={t} />
          {upcomingWork.map((w) => (
            <div key={w.task} className="rounded-lg px-2.5 py-2 font-['Open_Sans']" style={{ backgroundColor: t.cardBg }}>
              <p className="truncate" style={{ fontSize: 10, fontWeight: 600, color: t.cardText }}>{w.task}</p>
              <div className="flex items-center justify-between mt-1">
                <span style={{ fontSize: 9, color: t.cardTextDim }}>{w.count}</span>
                <span className="rounded-full px-2 py-0.5" style={{ fontSize: 8, fontWeight: 700, backgroundColor: t.badgeBg, color: t.badgeText }}>{w.due}</span>
              </div>
            </div>
          ))}
        </section>
        {/* Activity column */}
        <section className="space-y-1.5">
          <ThemedSectionHeading text="Activity" theme={t} />
          {activityFeed.map((entry) => (
            <div key={entry.time + entry.text} className="flex items-start gap-1.5 font-['Open_Sans'] py-1">
              <div className="shrink-0 rounded-full mt-1" style={{ width: 5, height: 5, backgroundColor: themeFlagColor(t, entry.flag) }} />
              <div className="min-w-0 flex-1">
                <p className="truncate" style={{ fontSize: 10, color: t.bodyText, lineHeight: 1.3 }}>{entry.text}</p>
                <p style={{ fontSize: 8, fontWeight: 600, color: t.bodyTextDim }}>{entry.time}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Compact actions */}
      <div className="flex gap-2 pt-1">
        <button type="button" className="flex-1 rounded-lg cursor-pointer font-['Open_Sans'] transition-all active:scale-[0.98]" style={{ fontSize: 11, fontWeight: 700, padding: "10px 0", backgroundColor: t.cta, color: t.ctaText }} onClick={() => navigate("/red-book/new")}>
          + RED BOOK
        </button>
        <button type="button" className="flex-1 rounded-lg cursor-pointer font-['Open_Sans'] transition-all active:scale-[0.98]" style={{ fontSize: 11, fontWeight: 700, padding: "10px 0", backgroundColor: t.cardBg, color: t.secondaryBtnText }} onClick={() => navigate("/cow-work")}>
          SESSION
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CARDS — Standalone animal cards, full detail, inline actions
   ══════════════════════════════════════════════════════════════ */
function CardsLayout({ theme: t }: { theme: Theme }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      {/* Stat banner — same as Bold */}
      <div
        className="rounded-2xl px-3 py-4 font-['Open_Sans']"
        style={{ background: `linear-gradient(135deg, ${t.gradientFrom} 0%, ${t.gradientMid} 60%, ${t.gradientTo} 100%)` }}
      >
        <div className="flex items-stretch">
          {stats.map((s, i) => (
            <div key={s.label} className="flex-1 text-center" style={{ borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
              <p className="text-white" style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{s.value}</p>
              <p className="uppercase mt-1" style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.30)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Herd Health — Three flag badges inline */}
      <div className="flex items-center justify-between px-1">
        {([
          { flag: "teal" as const, count: "812", label: "Healthy" },
          { flag: "gold" as const, count: "27", label: "Watch" },
          { flag: "red" as const, count: "8", label: "Critical" },
        ]).map((h) => (
          <div key={h.flag} className="flex items-center gap-1.5 font-['Open_Sans']">
            <ThemedFlagIcon color={h.flag} theme={t} size="sm" />
            <span style={{ fontSize: 13, fontWeight: 800, color: t.headingText }}>{h.count}</span>
            <span style={{ fontSize: 10, fontWeight: 500, color: t.sectionLabelColor }}>{h.label}</span>
          </div>
        ))}
      </div>

      {/* Animal Cards — Each gets its own standalone card */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <ThemedSectionHeading text="Recent Animals" theme={t} />
          <span className="font-['Open_Sans'] cursor-pointer" style={{ fontSize: 11, fontWeight: 700, color: t.viewAllColor }} onClick={() => navigate("/animals")}>VIEW ALL</span>
        </div>
        <div className="space-y-2.5">
          {recentAnimals.map((a) => (
            <div key={a.tag} className="rounded-2xl overflow-hidden font-['Open_Sans']" style={{ backgroundColor: t.cardBg }}>
              {/* Flag color top edge */}
              <div style={{ height: 3, backgroundColor: themeFlagColor(t, a.flag) }} />
              <div className="px-4 py-3.5">
                {/* Top row: tag + flag + breed */}
                <div className="flex items-center gap-2">
                  <ThemedFlagIcon color={a.flag} theme={t} size="md" />
                  <span style={{ fontSize: 18, fontWeight: 800, color: t.cardText }}>{a.tag}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: t.cardTextDim, marginLeft: "auto" }}>{a.breed}</span>
                </div>
                {/* Detail row */}
                <div className="flex items-center gap-4 mt-2" style={{ paddingLeft: 32 }}>
                  <div>
                    <p className="uppercase" style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: t.cardTextDim }}>Weight</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: `${t.cardText}CC` }}>{a.weight}</p>
                  </div>
                  <div>
                    <p className="uppercase" style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: t.cardTextDim }}>Location</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: t.penColor }}>{a.pen}</p>
                  </div>
                  <div>
                    <p className="uppercase" style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: t.cardTextDim }}>Tag Color</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="rounded-full" style={{ width: 8, height: 8, backgroundColor: themeFlagColor(t, a.flag) }} />
                      <p style={{ fontSize: 12, fontWeight: 600, color: themeFlagColor(t, a.flag) }}>{a.tagColor}</p>
                    </div>
                  </div>
                </div>
                {/* Memo */}
                {a.memo && (
                  <div className="mt-2 flex items-start gap-2" style={{ paddingLeft: 32 }}>
                    <span className="uppercase shrink-0" style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: t.cardTextDim, marginTop: 2 }}>Memo</span>
                    <p style={{ fontSize: 11, fontWeight: 500, color: `${t.cardText}99`, fontStyle: "italic" }}>{a.memo}</p>
                  </div>
                )}
                {/* Note if present */}
                {a.note && (
                  <div className="mt-2 rounded-lg px-3 py-2" style={{ backgroundColor: `${themeFlagColor(t, a.flag)}12`, marginLeft: 32 }}>
                    <p style={{ fontSize: 10, color: t.cardTextDim }}>{a.note}</p>
                  </div>
                )}
                {/* Inline actions */}
                <div className="flex items-center gap-3 mt-3" style={{ paddingLeft: 32 }}>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-1.5 cursor-pointer transition-all active:scale-[0.97]"
                    style={{ fontSize: 9, fontWeight: 700, backgroundColor: t.cta, color: t.ctaText, border: "none" }}
                    onClick={() => navigate(`/animals/${a.tag.slice(1)}`)}
                  >
                    VIEW DETAIL
                  </button>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-1.5 cursor-pointer transition-all active:scale-[0.97]"
                    style={{ fontSize: 9, fontWeight: 700, backgroundColor: "transparent", color: t.secondaryBtnText, border: `1px solid ${t.secondaryBtnText}40` }}
                  >
                    ADD NOTE
                  </button>
                  {a.flag !== "teal" && (
                    <button
                      type="button"
                      className="rounded-lg px-3 py-1.5 cursor-pointer transition-all active:scale-[0.97]"
                      style={{ fontSize: 9, fontWeight: 700, backgroundColor: "transparent", color: themeFlagColor(t, a.flag), border: `1px solid ${themeFlagColor(t, a.flag)}40` }}
                    >
                      TREAT
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming + Activity condensed */}
      <section className="space-y-2.5">
        <ThemedSectionHeading text="Upcoming Work" theme={t} />
        <div className="space-y-2">
          {upcomingWork.map((w) => (
            <div key={w.task} className="rounded-xl px-4 py-3 flex items-center justify-between font-['Open_Sans']" style={{ backgroundColor: t.cardBg }}>
              <div className="min-w-0 flex-1">
                <p className="truncate" style={{ fontSize: 13, fontWeight: 600, color: t.cardText }}>{w.task}</p>
                <p style={{ fontSize: 11, color: t.cardTextDim }}>{w.count}</p>
              </div>
              <span className="shrink-0 rounded-full px-2.5 py-1" style={{ fontSize: 10, fontWeight: 700, color: t.badgeText, backgroundColor: t.badgeBg }}>{w.due}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <div className="space-y-2 pt-1">
        <button type="button" className="w-full rounded-xl cursor-pointer font-['Open_Sans'] transition-all active:scale-[0.98]" style={{ fontSize: 14, fontWeight: 700, padding: "13px 0", backgroundColor: t.cta, color: t.ctaText, boxShadow: `0 2px 12px ${t.ctaShadow}` }} onClick={() => navigate("/red-book/new")}>
          + NEW RED BOOK NOTE
        </button>
        <button type="button" className="w-full rounded-xl cursor-pointer font-['Open_Sans'] transition-all active:scale-[0.98]" style={{ fontSize: 13, fontWeight: 700, padding: "12px 0", backgroundColor: t.cardBg, color: t.secondaryBtnText }} onClick={() => navigate("/cow-work")}>
          START WORK SESSION
        </button>
      </div>
    </div>
  );
}