interface StatCardProps {
  label: string;
  value: string;
  subtitle: string;
  /** Gradient angle in degrees — shifts the navy→teal blend for visual variety */
  gradientAngle?: number;
}

export function StatCard({
  label,
  value,
  subtitle,
  gradientAngle = 145,
}: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col justify-between font-['Inter']"
      style={{
        background: `linear-gradient(${gradientAngle}deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)`,
        minHeight: 132,
      }}
    >
      {/* Dim label */}
      <p
        className="uppercase"
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.35)",
          lineHeight: 1.3,
        }}
      >
        {label}
      </p>

      {/* Large number */}
      <p
        className="text-white"
        style={{
          fontSize: 38,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </p>

      {/* Teal subtitle */}
      <p
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "#A8E6DA",
          lineHeight: 1.3,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}