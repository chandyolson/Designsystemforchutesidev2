import { type CSSProperties, type ReactNode } from "react";

/* ═══════════════════════════════════════════════
   SHIMMER BLOCK — base primitive
   ═══════════════════════════════════════════════ */

interface ShimmerBlockProps {
  /** Width in px or CSS string (e.g. "100%") */
  width?: number | string;
  /** Height in px */
  height: number;
  /** Tailwind-style border-radius class name */
  radius?: "rounded-full" | "rounded-xl" | "rounded-2xl" | "rounded-lg" | "rounded-md" | "rounded";
  /** Override background opacity (default 0.05 = 5%) */
  opacity?: number;
  /** Extra class names */
  className?: string;
  /** Extra inline styles */
  style?: CSSProperties;
  /** Stagger delay in ms for the shimmer animation */
  delay?: number;
  children?: ReactNode;
}

function ShimmerBlock({
  width,
  height,
  radius = "rounded-lg",
  opacity = 0.05,
  className = "",
  style,
  delay = 0,
  children,
}: ShimmerBlockProps) {
  return (
    <div
      className={`relative overflow-hidden ${radius} ${className}`}
      style={{
        width: typeof width === "number" ? width : width,
        height,
        backgroundColor: `rgba(14,38,70,${opacity})`,
        ...style,
      }}
    >
      {/* Shimmer gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          animation: `shimmerSweep 1.8s ease-in-out ${delay}ms infinite`,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(14,38,70,0.04) 40%, rgba(14,38,70,0.07) 50%, rgba(14,38,70,0.04) 60%, transparent 100%)",
        }}
      />
      {children}
    </div>
  );
}

export { ShimmerBlock };

/* ═══════════════════════════════════════════════
   1. ANIMAL LIST SKELETON
   ═══════════════════════════════════════════════ */

export function AnimalListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search bar placeholder */}
      <ShimmerBlock width="100%" height={42} radius="rounded-xl" />

      {/* Filter chip placeholders */}
      <div className="flex items-center gap-2">
        <ShimmerBlock width={72} height={28} radius="rounded-full" delay={80} />
        <ShimmerBlock width={60} height={28} radius="rounded-full" delay={160} />
      </div>

      {/* Toolbar row: count + buttons */}
      <div className="flex items-center justify-between">
        <ShimmerBlock width={58} height={12} radius="rounded" delay={200} />
        <div className="flex items-center gap-2.5">
          <ShimmerBlock width={32} height={32} radius="rounded-lg" delay={240} />
          <ShimmerBlock width={32} height={32} radius="rounded-lg" delay={280} />
        </div>
      </div>

      {/* 4 animal card placeholders */}
      <div className="space-y-2.5">
        {[0, 1, 2, 3].map((i) => (
          <ShimmerBlock
            key={i}
            width="100%"
            height={72}
            radius="rounded-xl"
            delay={100 + i * 120}
          >
            <div className="px-4 flex flex-col justify-center h-full gap-2.5">
              {/* Tag area */}
              <div className="flex items-center gap-2.5">
                <ShimmerBlock width={60} height={18} radius="rounded-md" opacity={0.06} delay={200 + i * 120} />
                <ShimmerBlock width={38} height={16} radius="rounded-full" opacity={0.04} delay={260 + i * 120} />
              </div>
              {/* Subtitle area */}
              <ShimmerBlock width={140} height={12} radius="rounded" opacity={0.04} delay={320 + i * 120} />
            </div>
          </ShimmerBlock>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   2. DASHBOARD SKELETON
   ═══════════════════════════════════════════════ */

export function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      {/* 2×2 stat card grid */}
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <ShimmerBlock
            key={i}
            width="100%"
            height={132}
            radius="rounded-2xl"
            opacity={0.08}
            delay={i * 100}
          >
            <div className="px-3.5 pt-3.5 pb-3 flex flex-col justify-between h-full">
              {/* Label */}
              <ShimmerBlock width={60} height={10} radius="rounded" opacity={0.08} delay={80 + i * 100} />
              {/* Large number */}
              <ShimmerBlock width={80} height={32} radius="rounded-lg" opacity={0.07} delay={160 + i * 100} />
              {/* Subtitle */}
              <ShimmerBlock width={90} height={11} radius="rounded" opacity={0.06} delay={240 + i * 100} />
            </div>
          </ShimmerBlock>
        ))}
      </div>

      {/* Section label placeholder */}
      <ShimmerBlock width={100} height={12} radius="rounded" delay={450} />

      {/* 3 activity feed rows */}
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Circle avatar */}
            <ShimmerBlock width={32} height={32} radius="rounded-full" delay={500 + i * 120} />
            {/* Text lines */}
            <div className="flex-1 space-y-2">
              <ShimmerBlock width="70%" height={12} radius="rounded" delay={560 + i * 120} />
              <ShimmerBlock width="45%" height={10} radius="rounded" delay={620 + i * 120} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   3. FORM SKELETON
   ═══════════════════════════════════════════════ */

export function FormSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3">
          {/* Label block */}
          <ShimmerBlock
            width={105}
            height={14}
            radius="rounded"
            delay={i * 100}
            className="shrink-0"
          />
          {/* Input block */}
          <ShimmerBlock
            width="100%"
            height={40}
            radius="rounded-lg"
            delay={50 + i * 100}
            className="flex-1"
            style={{ width: undefined }}
          />
        </div>
      ))}
    </div>
  );
}
