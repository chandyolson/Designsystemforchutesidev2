import { useState, useEffect } from "react";
import {
  ShimmerBlock,
  AnimalListSkeleton,
  DashboardSkeleton,
  FormSkeleton,
} from "./skeleton-screens";

/* ── Tiny helpers (same as other explorers) ── */
function SectionHeading({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1" style={{ backgroundColor: "rgba(14,38,70,0.08)" }} />
      <span
        className="font-['Inter'] uppercase shrink-0 text-[#0E2646]"
        style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", opacity: 0.35 }}
      >
        {text}
      </span>
      <div className="h-px flex-1" style={{ backgroundColor: "rgba(14,38,70,0.08)" }} />
    </div>
  );
}

function VariantLabel({ text }: { text: string }) {
  return (
    <span className="font-['Inter'] text-[#1A1A1A]/40" style={{ fontSize: 11, fontWeight: 600 }}>
      {text}
    </span>
  );
}

/* ── Interactive Demo ── */
function LoadingDemo({
  skeleton,
  content,
  label,
}: {
  skeleton: React.ReactNode;
  content: React.ReactNode;
  label: string;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      const t = setTimeout(() => setLoading(false), 2400);
      return () => clearTimeout(t);
    }
  }, [loading]);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <VariantLabel text={label} />
        <button
          type="button"
          onClick={() => setLoading(true)}
          className="font-['Inter'] cursor-pointer rounded-full transition-all active:scale-[0.96]"
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 14px",
            color: "#55BAAA",
            backgroundColor: "rgba(85,186,170,0.08)",
            border: "1px solid rgba(85,186,170,0.15)",
          }}
        >
          Reload
        </button>
      </div>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#F5F5F0", padding: 16 }}
      >
        {loading ? skeleton : content}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SKELETON EXPLORER PAGE
   ═══════════════════════════════════════════════ */
export function SkeletonExplorer() {
  return (
    <div className="space-y-6">
      {/* ── Page intro ── */}
      <div className="bg-[#0E2646]/[0.04] rounded-xl px-4 py-3 space-y-1.5">
        <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 13, fontWeight: 700 }}>
          Skeleton Loading Screens
        </p>
        <p className="font-['Inter'] text-[#1A1A1A]/50" style={{ fontSize: 11, lineHeight: 1.55 }}>
          Animated shimmer placeholders that match the shape of real content. Three
          variants cover list screens, dashboard cards, and form layouts. Background
          is #0E2646 at 5% opacity with a subtle left-to-right gradient sweep.
        </p>
      </div>

      {/* ══════════════════════════════════════════
          BASE PRIMITIVE — ShimmerBlock
         ══════════════════════════════════════════ */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ backgroundColor: "rgba(85,186,170,0.08)" }}>
        <span className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 13, fontWeight: 700 }}>
          Primitive
        </span>
        <span className="font-['Inter'] text-[#1A1A1A]/45" style={{ fontSize: 12, fontWeight: 500 }}>
          ShimmerBlock
        </span>
      </div>

      <SectionHeading text="Size & Radius Variations" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 p-4 space-y-3">
        <VariantLabel text="Full width, rounded-xl (card)" />
        <ShimmerBlock width="100%" height={72} radius="rounded-xl" />

        <VariantLabel text="Fixed width, rounded-full (pill)" />
        <ShimmerBlock width={80} height={28} radius="rounded-full" delay={100} />

        <VariantLabel text="Fixed width, rounded-lg (input)" />
        <ShimmerBlock width="100%" height={40} radius="rounded-lg" delay={200} />

        <VariantLabel text="Circle (avatar)" />
        <ShimmerBlock width={32} height={32} radius="rounded-full" delay={300} />

        <VariantLabel text="Darker opacity (8% — stat card)" />
        <ShimmerBlock width="100%" height={48} radius="rounded-2xl" opacity={0.08} delay={400} />
      </div>

      {/* ══════════════════════════════════════════
          VARIANT 1 — Animal List Skeleton
         ══════════════════════════════════════════ */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ backgroundColor: "rgba(85,186,170,0.08)" }}>
        <span className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 13, fontWeight: 700 }}>
          Variant 1
        </span>
        <span className="font-['Inter'] text-[#1A1A1A]/45" style={{ fontSize: 12, fontWeight: 500 }}>
          Animal List Skeleton
        </span>
      </div>

      <SectionHeading text="Static Preview" />

      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#F5F5F0", padding: 16 }}
      >
        <AnimalListSkeleton />
      </div>

      <SectionHeading text="Interactive — Tap Reload" />

      <LoadingDemo
        label="Animal List → Real Content"
        skeleton={<AnimalListSkeleton />}
        content={
          <div className="space-y-4">
            <div
              className="flex items-center gap-2.5 rounded-xl font-['Inter']"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(14,38,70,0.10)", padding: "0 14px", height: 42 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <circle cx="7" cy="7" r="4.5" stroke="#0E2646" strokeWidth="1.5" opacity={0.25} />
                <line x1="10.5" y1="10.5" x2="13.5" y2="13.5" stroke="#0E2646" strokeWidth="1.5" strokeLinecap="round" opacity={0.25} />
              </svg>
              <span className="text-[#1A1A1A]/25 font-['Inter']" style={{ fontSize: 14, fontWeight: 500 }}>
                Search by tag, type, or memo…
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full font-['Inter']" style={{ fontSize: 12, fontWeight: 600, padding: "5px 14px", color: "#27AE60", backgroundColor: "#27AE6018" }}>
                Status: Active
              </span>
              <span className="rounded-full font-['Inter']" style={{ fontSize: 12, fontWeight: 600, padding: "5px 14px", color: "#2D7DD2", backgroundColor: "#2D7DD218" }}>
                Type: Cow
              </span>
            </div>
            <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 11, fontWeight: 600 }}>
              4 animals loaded
            </p>
            {[
              { tag: "4782", type: "COW", vals: "2020 · 1,247 lbs · Normal" },
              { tag: "3091", type: "COW", vals: "2021 · 983 lbs · Follow-up" },
              { tag: "6610", type: "COW", vals: "2022 · 1,095 lbs · Gained well" },
              { tag: "7801", type: "COW", vals: "2017 · 1,410 lbs · Watch BCS" },
            ].map((a) => (
              <div key={a.tag} className="rounded-xl px-4 py-3.5 font-['Inter']" style={{ backgroundColor: "#0E2646" }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#F0F0F0" }}>{a.tag}</span>
                  <span className="rounded-full" style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", backgroundColor: "rgba(240,240,240,0.08)", color: "rgba(240,240,240,0.5)" }}>
                    {a.type}
                  </span>
                </div>
                <p className="mt-1.5" style={{ fontSize: 13, color: "rgba(240,240,240,0.45)" }}>{a.vals}</p>
              </div>
            ))}
          </div>
        }
      />

      {/* ══════════════════════════════════════════
          VARIANT 2 — Dashboard Skeleton
         ══════════════════════════════════════════ */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ backgroundColor: "rgba(85,186,170,0.08)" }}>
        <span className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 13, fontWeight: 700 }}>
          Variant 2
        </span>
        <span className="font-['Inter'] text-[#1A1A1A]/45" style={{ fontSize: 12, fontWeight: 500 }}>
          Dashboard Skeleton
        </span>
      </div>

      <SectionHeading text="Static Preview" />

      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#F5F5F0", padding: 16 }}
      >
        <DashboardSkeleton />
      </div>

      <SectionHeading text="Interactive — Tap Reload" />

      <LoadingDemo
        label="Dashboard → Real Content"
        skeleton={<DashboardSkeleton />}
        content={
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Head", value: "847", sub: "↑ 34 this quarter" },
                { label: "Active Calving", value: "23", sub: "6 expected this week" },
                { label: "Open Projects", value: "5", sub: "2 due before Friday" },
                { label: "Red Book", value: "12", sub: "3 pinned" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl px-3.5 pt-3.5 pb-3 font-['Inter'] flex flex-col justify-between"
                  style={{ height: 132, background: "linear-gradient(155deg, #0E2646 0%, #163A5E 60%, #55BAAA 100%)" }}
                >
                  <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(240,240,240,0.45)" }}>{s.label}</span>
                  <span style={{ fontSize: 32, fontWeight: 800, color: "#F0F0F0", lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.35)" }}>{s.sub}</span>
                </div>
              ))}
            </div>
            <span className="font-['Inter'] text-[#1A1A1A]/30" style={{ fontSize: 11, fontWeight: 600 }}>Recent Activity</span>
            {[
              { initials: "JD", line1: "Tag 4782 weighed at 1,247 lbs", line2: "2 hours ago" },
              { initials: "MR", line1: "Calving record added — C2847", line2: "Yesterday" },
              { initials: "JD", line1: "Spring Preg Check started", line2: "Feb 25" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="rounded-full flex items-center justify-center shrink-0 font-['Inter']"
                  style={{ width: 32, height: 32, backgroundColor: "rgba(85,186,170,0.12)", fontSize: 11, fontWeight: 700, color: "#55BAAA" }}
                >
                  {a.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Inter'] truncate" style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>{a.line1}</p>
                  <p className="font-['Inter']" style={{ fontSize: 10, fontWeight: 500, color: "rgba(26,26,26,0.35)" }}>{a.line2}</p>
                </div>
              </div>
            ))}
          </div>
        }
      />

      {/* ══════════════════════════════════════════
          VARIANT 3 — Form Skeleton
         ══════════════════════════════════════════ */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ backgroundColor: "rgba(85,186,170,0.08)" }}>
        <span className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 13, fontWeight: 700 }}>
          Variant 3
        </span>
        <span className="font-['Inter'] text-[#1A1A1A]/45" style={{ fontSize: 12, fontWeight: 500 }}>
          Form Skeleton
        </span>
      </div>

      <SectionHeading text="Static Preview" />

      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#F5F5F0", padding: 16 }}
      >
        <FormSkeleton />
      </div>

      <SectionHeading text="Interactive — Tap Reload" />

      <LoadingDemo
        label="Form → Real Content"
        skeleton={<FormSkeleton />}
        content={
          <div className="space-y-3">
            {[
              { label: "Tag Number", value: "4782" },
              { label: "Breed", value: "Black Angus" },
              { label: "Birth Date", value: "03/14/2020" },
              { label: "Weight (lbs)", value: "1,247" },
              { label: "Pasture", value: "Pen 2A" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <label
                  className="shrink-0 text-[#1A1A1A] font-['Inter']"
                  style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
                >
                  {f.label}
                </label>
                <div
                  className="flex-1 rounded-lg font-['Inter'] flex items-center px-3"
                  style={{
                    height: 40,
                    backgroundColor: "white",
                    border: "1px solid #D4D4D0",
                    fontSize: 16,
                    fontWeight: 400,
                    color: "#1A1A1A",
                  }}
                >
                  {f.value}
                </div>
              </div>
            ))}
          </div>
        }
      />

      {/* ── Specs ── */}
      <SectionHeading text="Specs" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
        {[
          ["Block BG", "rgba(14,38,70,0.05) — #0E2646 at 5%"],
          ["Stat card BG", "rgba(14,38,70,0.08) — slightly darker"],
          ["Shimmer", "Left-to-right gradient sweep, 1.8s ease-in-out"],
          ["Shimmer gradient", "0%→40% transparent, 50% rgba(14,38,70,0.07), 60%→100% transparent"],
          ["Stagger delay", "80–120ms per element for cascade feel"],
          ["Card radius", "rounded-xl (12px)"],
          ["Input radius", "rounded-lg (8px)"],
          ["Pill radius", "rounded-full (9999px)"],
          ["Stat card radius", "rounded-2xl (16px)"],
          ["Animal card H", "72px"],
          ["Stat card H", "132px"],
          ["Form input H", "40px"],
          ["Activity circle", "32px diameter"],
        ].map(([label, val]) => (
          <div key={label} className="flex items-start px-4 py-2.5">
            <span
              className="font-['Inter'] shrink-0 text-[#1A1A1A]/40"
              style={{ fontSize: 11, fontWeight: 600, width: 105 }}
            >
              {label}
            </span>
            <span
              className="font-['Inter'] text-[#1A1A1A]"
              style={{ fontSize: 11, fontWeight: 500 }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
