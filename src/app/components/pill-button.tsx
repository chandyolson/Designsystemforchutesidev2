import { ButtonHTMLAttributes, ReactNode } from "react";

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline";
}

export function PillButton({
  children,
  size = "md",
  variant = "primary",
  disabled,
  ...rest
}: PillButtonProps) {
  const sizeStyles = {
    sm: { fontSize: 12, fontWeight: 600, padding: "6px 16px" },
    md: { fontSize: 14, fontWeight: 700, padding: "10px 24px" },
    lg: { fontSize: 16, fontWeight: 700, padding: "13px 32px" },
  };

  const s = sizeStyles[size];

  if (variant === "outline") {
    return (
      <button
        disabled={disabled}
        className={`
          inline-flex items-center justify-center rounded-full font-['Inter']
          border-2 border-[#F3D12A] text-[#1A1A1A] bg-transparent
          transition-all duration-150 cursor-pointer
          active:scale-[0.97]
          ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3D12A]/10"}
        `}
        style={{ fontSize: s.fontSize, fontWeight: s.fontWeight, padding: s.padding }}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-full font-['Inter']
        text-[#1A1A1A] border-0
        transition-all duration-150 cursor-pointer
        active:scale-[0.97]
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
      `}
      style={{
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        padding: s.padding,
        backgroundColor: disabled ? "#F3D12A80" : "#F3D12A",
        boxShadow: disabled ? "none" : "0 2px 10px rgba(243, 209, 42, 0.35)",
      }}
      {...rest}
    >
      {children}
    </button>
  );
}