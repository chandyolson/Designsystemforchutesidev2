import { useState, ReactNode } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  /** Content shown below the header when the section is collapsed */
  collapsedContent?: ReactNode;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  collapsedContent,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl bg-white border border-[#D4D4D0]/60 overflow-hidden font-['Inter']">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer bg-white active:bg-[#F5F5F0] transition-colors"
      >
        <span
          className="text-[#1A1A1A]"
          style={{ fontSize: 15, fontWeight: 600 }}
        >
          {title}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="transition-transform duration-200 shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path
            d="M4.5 6.75L9 11.25L13.5 6.75"
            stroke="#1A1A1A"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.4}
          />
        </svg>
      </button>

      {/* Collapsed content — visible only when closed */}
      {!open && collapsedContent && (
        <div className="px-4 pb-3 border-t border-[#D4D4D0]/40">
          {collapsedContent}
        </div>
      )}

      <div
        className="transition-all duration-250 ease-in-out overflow-hidden"
        style={{
          maxHeight: open ? 600 : 0,
          opacity: open ? 1 : 0,
        }}
      >
        <div className="px-4 pb-4 pt-1 border-t border-[#D4D4D0]/40">
          {children}
        </div>
      </div>
    </div>
  );
}