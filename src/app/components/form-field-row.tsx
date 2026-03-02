import { InputHTMLAttributes } from "react";

interface FormFieldRowProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  error?: string;
  required?: boolean;
}

export function FormFieldRow({
  label,
  placeholder = "",
  value,
  onChange,
  type = "text",
  inputProps,
  error,
  required,
}: FormFieldRowProps) {
  const hasError = !!error;

  return (
    <div className="flex items-start gap-3">
      <label
        className="shrink-0 text-[#1A1A1A] font-['Inter']"
        style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
      >
        {label}
        {required && (
          <span
            className="font-['Inter']"
            style={{ fontSize: 14, fontWeight: 600, color: "#E74C3C", marginLeft: 2 }}
          >
            *
          </span>
        )}
      </label>
      <div className="flex-1 min-w-0">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full h-[40px] px-3 rounded-lg bg-white border text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all ${
            hasError
              ? "border-[#E74C3C] focus:border-[#E74C3C] focus:ring-2 focus:ring-[#E74C3C]/25"
              : "border-[#D4D4D0] focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
          }`}
          style={{ fontSize: 16, fontWeight: 400 }}
          {...inputProps}
        />
        {hasError && (
          <p
            className="font-['Inter']"
            style={{ fontSize: 12, fontWeight: 500, color: "#E74C3C", marginTop: 4 }}
          >
            {error}
          </p>
        )}
      </div>
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
  error?: string;
  required?: boolean;
}

export function FormSelectRow({
  label,
  placeholder = "Select…",
  value,
  onChange,
  options,
  error,
  required,
}: FormSelectRowProps) {
  const hasError = !!error;

  return (
    <div className="flex items-start gap-3">
      <label
        className="shrink-0 text-[#1A1A1A] font-['Inter']"
        style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
      >
        {label}
        {required && (
          <span
            className="font-['Inter']"
            style={{ fontSize: 14, fontWeight: 600, color: "#E74C3C", marginLeft: 2 }}
          >
            *
          </span>
        )}
      </label>
      <div className="flex-1 min-w-0">
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full h-[40px] px-3 pr-8 rounded-lg bg-white border text-[#1A1A1A] font-['Inter'] outline-none transition-all appearance-none cursor-pointer ${
              hasError
                ? "border-[#E74C3C] focus:border-[#E74C3C] focus:ring-2 focus:ring-[#E74C3C]/25"
                : "border-[#D4D4D0] focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
            }`}
            style={{ fontSize: 16, fontWeight: 400, color: value ? "#1A1A1A" : "rgba(26,26,26,0.30)" }}
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
        {hasError && (
          <p
            className="font-['Inter']"
            style={{ fontSize: 12, fontWeight: 500, color: "#E74C3C", marginTop: 4 }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
