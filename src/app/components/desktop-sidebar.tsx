import { useGradient } from "./gradient-context";
import {
  ArrowLeftRight,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const menuItems = [
  { label: "Operation Dashboard", route: "/" },
  { label: "Animals", route: "/animals" },
  { label: "Cow Work", route: "/cow-work" },
  { label: "Calving", route: "/calving" },
  { label: "Red Book", route: "/red-book" },
  { label: "Reference", route: "/reference" },
];

interface DesktopSidebarProps {
  activeItem: string;
  onNavigate: (route: string) => void;
  onSwitchOperation: () => void;
  onSignOut: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DesktopSidebar({
  activeItem,
  onNavigate,
  onSwitchOperation,
  onSignOut,
  collapsed = false,
  onToggleCollapse,
}: DesktopSidebarProps) {
  const { drawerGradient } = useGradient();

  const sidebarWidth = collapsed ? 68 : 240;

  return (
    <div
      className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40 font-['Inter'] transition-all duration-300"
      style={{
        width: sidebarWidth,
        background: drawerGradient.css,
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* ── Brand Block ── */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        style={{ padding: collapsed ? "28px 0 20px" : "28px 24px 20px" }}
        onClick={() => onNavigate("/")}
      >
        {collapsed ? (
          <div className="flex items-center justify-center w-full">
            <span
              className="text-[#F3D12A]"
              style={{
                fontSize: 18,
                fontWeight: 800,
                textShadow:
                  "0 0 8px rgba(243,209,42,0.50), 0 0 20px rgba(243,209,42,0.30), 0 0 40px rgba(243,209,42,0.15)",
              }}
            >
              CS
            </span>
          </div>
        ) : (
          <div>
            <p
              className="text-[#F3D12A]"
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "0.18em",
                lineHeight: 1.2,
                textShadow:
                  "0 0 8px rgba(243,209,42,0.50), 0 0 20px rgba(243,209,42,0.30), 0 0 40px rgba(243,209,42,0.15)",
              }}
            >
              CHUTESIDE
            </p>
            <p
              className="mt-1.5"
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#55BAAA",
                opacity: 0.7,
              }}
            >
              Saddle Butte Ranch
            </p>
          </div>
        )}
      </div>

      {/* ── Thin divider ── */}
      <div
        className="h-px"
        style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          margin: collapsed ? "0 12px" : "0 20px",
        }}
      />

      {/* ── Menu Items ── */}
      <nav className="flex-1 py-3">
        {menuItems.map((item) => {
          const isActive = item.label === activeItem;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(item.route)}
              className="w-full text-left cursor-pointer transition-colors duration-150 relative flex items-center"
              title={collapsed ? item.label : undefined}
              style={{
                padding: collapsed ? "11px 0" : "11px 24px",
                justifyContent: collapsed ? "center" : "flex-start",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#F3D12A" : "rgba(240,240,240,0.55)",
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
                    height: 22,
                    backgroundColor: "#F3D12A",
                  }}
                />
              )}
              {collapsed ? (
                <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 600 }}>
                  {item.label.split(" ").map(w => w[0]).join("")}
                </span>
              ) : (
                <span>{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Collapse Toggle ── */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="mx-auto mb-2 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/[0.08] active:scale-95"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          width: collapsed ? 36 : 36,
          height: 32,
          color: "rgba(240,240,240,0.30)",
        }}
      >
        {collapsed ? (
          <PanelLeftOpen size={16} strokeWidth={1.8} />
        ) : (
          <PanelLeftClose size={16} strokeWidth={1.8} />
        )}
      </button>

      {/* ── Bottom Section ── */}
      <div>
        {/* Divider */}
        <div
          className="h-px"
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            margin: collapsed ? "0 12px" : "0 20px",
          }}
        />

        {/* User profile link */}
        <button
          type="button"
          onClick={() => onNavigate("/user-profile")}
          className="w-full cursor-pointer transition-colors duration-150 flex items-center gap-3"
          title={collapsed ? "User Profile" : undefined}
          style={{
            padding: collapsed ? "14px 0" : "14px 24px",
            justifyContent: collapsed ? "center" : "flex-start",
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(240,240,240,0.4)",
          }}
        >
          <User size={16} strokeWidth={1.8} style={{ flexShrink: 0, opacity: 0.6 }} />
          {!collapsed && <span>User Profile</span>}
        </button>

        {/* Switch Operation */}
        <button
          type="button"
          onClick={onSwitchOperation}
          className="w-full cursor-pointer transition-colors duration-150 flex items-center gap-3"
          title={collapsed ? "Switch Operation" : undefined}
          style={{
            padding: collapsed ? "10px 0" : "10px 24px",
            justifyContent: collapsed ? "center" : "flex-start",
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(240,240,240,0.3)",
          }}
        >
          <ArrowLeftRight size={16} strokeWidth={1.8} style={{ flexShrink: 0, opacity: 0.5 }} />
          {!collapsed && <span>Switch Operation</span>}
        </button>

        {/* Sign Out */}
        <button
          type="button"
          onClick={onSignOut}
          className="w-full cursor-pointer transition-colors duration-150 flex items-center gap-3"
          title={collapsed ? "Sign Out" : undefined}
          style={{
            padding: collapsed ? "10px 0 16px" : "10px 24px 16px",
            justifyContent: collapsed ? "center" : "flex-start",
            fontSize: 13,
            fontWeight: 500,
            color: "#E74C3C",
            opacity: 0.6,
          }}
        >
          <LogOut size={16} strokeWidth={1.8} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {/* Safe area padding */}
        <div className="h-4" />
      </div>
    </div>
  );
}