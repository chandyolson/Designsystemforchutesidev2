interface StatCardProps {
  label: string;
  value: string;
  subtitle: string;
  /** Gradient angle in degrees — shifts the navy→teal blend for visual variety */
  gradientAngle?: number;
  /** Optional click handler — makes the card interactive */
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  subtitle,
  gradientAngle = 145,
  onClick,
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl px-3 py-2.5 flex flex-col justify-between font-['Inter']${onClick ? " cursor-pointer active:scale-[0.97] transition-transform duration-100" : ""}`}
      style={{
        background: `linear-gradient(${gradientAngle}deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)`,
        minHeight: 72,
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
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
          fontSize: 24,
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