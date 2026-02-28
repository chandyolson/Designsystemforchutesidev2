import { InputHTMLAttributes } from "react";

interface FormFieldRowProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

export function FormFieldRow({
  label,
  placeholder = "",
  value,
  onChange,
  type = "text",
  inputProps,
}: FormFieldRowProps) {
  return (
    <div className="flex items-center gap-3">
      <label
        className="shrink-0 text-[#1A1A1A] font-['Inter']"
        style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="flex-1 min-w-0 h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
        style={{ fontSize: 14, fontWeight: 400 }}
        {...inputProps}
      />
    </div>
  );
}

/* ── Select / Dropdown variant ── */
interface FormSelectRowProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: string[];
}

export function FormSelectRow({
  label,
  placeholder = "Select…",
  value,
  onChange,
  options,
}: FormSelectRowProps) {
  return (
    <div className="flex items-center gap-3">
      <label
        className="shrink-0 text-[#1A1A1A] font-['Inter']"
        style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
      >
        {label}
      </label>
      <div className="relative flex-1 min-w-0">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-[40px] px-3 pr-8 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all appearance-none cursor-pointer"
          style={{ fontSize: 14, fontWeight: 400, color: value ? "#1A1A1A" : "rgba(26,26,26,0.30)" }}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} style={{ color: "#1A1A1A" }}>{opt}</option>
          ))}
        </select>
        {/* Chevron */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          width="12" height="12" viewBox="0 0 12 12" fill="none"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}