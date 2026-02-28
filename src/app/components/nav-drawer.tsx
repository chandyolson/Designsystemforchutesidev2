import { useEffect, useRef } from "react";
import { useGradient } from "./gradient-context";

const menuItems = [
  "Operation Dashboard",
  "Animals",
  "Cow Work",
  "Calving",
  "Red Book",
  "Reference",
];

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
  activeItem?: string;
  onItemSelect?: (item: string) => void;
}

export function NavDrawer({
  open,
  onClose,
  activeItem = "Operation Dashboard",
  onItemSelect,
}: NavDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { drawerGradient } = useGradient();

  /* Lock body scroll when open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* ── Overlay ── */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          backgroundColor: open ? "rgba(0,0,0,0.52)" : "rgba(0,0,0,0)",
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* ── Drawer Panel ── */}
      <div
        ref={drawerRef}
        className="fixed top-0 left-0 bottom-0 z-50 flex flex-col font-['Inter']"
        style={{
          width: 260,
          background: drawerGradient.css,
          transform: open ? "translateX(0)" : "translateX(-260px)",
          transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: open ? "6px 0 32px rgba(0,0,0,0.35)" : "none",
        }}
      >
        {/* ── Brand Block ── */}
        <div className="px-6 pt-10 pb-6">
          <p
            className="text-[#F3D12A]"
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "0.18em",
              lineHeight: 1.2,
            }}
          >
            CHUTESIDE
          </p>
          <p
            className="mt-1.5"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#55BAAA",
              opacity: 0.7,
            }}
          >
            Saddle Butte Ranch
          </p>
        </div>

        {/* ── Thin divider ── */}
        <div className="mx-5 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />

        {/* ── Menu Items ── */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const isActive = item === activeItem;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onItemSelect?.(item)}
                className="w-full text-left cursor-pointer transition-colors duration-150 relative"
                style={{
                  padding: "12px 24px",
                  fontSize: 15,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#F3D12A" : "rgba(240,240,240,0.6)",
                  backgroundColor: isActive
                    ? "rgba(243,209,42,0.06)"
                    : "transparent",
                }}
              >
                {/* Yellow left border for active */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-sm"
                    style={{
                      width: 3,
                      height: 24,
                      backgroundColor: "#F3D12A",
                    }}
                  />
                )}
                {item}
              </button>
            );
          })}
        </nav>

        {/* ── Bottom Section ── */}
        <div>
          {/* Divider */}
          <div className="mx-5 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />

          <button
            type="button"
            className="w-full text-left cursor-pointer transition-colors duration-150"
            style={{
              padding: "16px 24px",
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(240,240,240,0.3)",
            }}
          >
            Switch Operation
          </button>

          {/* Safe area padding */}
          <div className="h-6" />
        </div>
      </div>
    </>
  );
}