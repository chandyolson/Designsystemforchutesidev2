import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { NavDrawer } from "./nav-drawer";
import { OperationPicker } from "./operation-picker";
import { ToastContainer } from "./toast-notification";
import { useAuth } from "./auth-context";

/* ── Hamburger Button ── */
function HamburgerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col justify-center items-center gap-[5px] cursor-pointer p-1"
      aria-label="Open menu"
      style={{ width: 36, height: 36 }}
    >
      <span className="block rounded-full" style={{ width: 20, height: 2, backgroundColor: "#F0F0F0" }} />
      <span className="block rounded-full" style={{ width: 20, height: 2, backgroundColor: "#F0F0F0" }} />
      <span className="block rounded-full" style={{ width: 20, height: 2, backgroundColor: "#F0F0F0" }} />
    </button>
  );
}

/* ── Back Arrow Button ── */
export function BackArrowButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center cursor-pointer p-1"
      aria-label="Go back"
      style={{ width: 36, height: 36 }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M12.5 15L7.5 10L12.5 5" stroke="#F0F0F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ── Header config per route ── */
interface HeaderConfig {
  title: string;
  subtitle: string;
  showBack?: boolean;
  showSave?: boolean;
  compact?: boolean;
}

function getHeaderConfig(pathname: string): HeaderConfig {
  if (pathname === "/") return { title: "Saddle Butte Ranch", subtitle: "Ranch · 847 Head · Active" };
  if (pathname === "/animals" ) return { title: "Animals", subtitle: "847 Total · 798 Active" };
  if (pathname === "/animals/new") return { title: "Add Animal", subtitle: "New animal record", showBack: true };
  if (pathname.startsWith("/animals/")) {
    const id = pathname.split("/").pop();
    return { title: "Animal Record", subtitle: `${id} · Pink · Cow · 2020`, showBack: true };
  }
  if (pathname === "/calving") return { title: "Calving", subtitle: "2026 Season · 23 Calves" };
  if (pathname === "/calving/new") return { title: "Add Calf", subtitle: "New calving record", showBack: true, showSave: true };
  if (pathname.startsWith("/calving/")) {
    const tag = pathname.split("/").pop();
    return { title: "Calving Record", subtitle: `Calf ${tag}`, showBack: true };
  }
  if (pathname === "/cow-work") return { title: "Cow Work", subtitle: "5 Active Projects" };
  if (pathname === "/cow-work/new") return { title: "New Project", subtitle: "Create a new work project", showBack: true };
  if (pathname === "/cow-work/templates") return { title: "Work Templates", subtitle: "Saved project configurations", showBack: true };
  if (pathname === "/cow-work/templates/new") return { title: "New Template", subtitle: "Configure project defaults", showBack: true };
  if (pathname.match(/^\/cow-work\/templates\/[^/]+$/) && pathname !== "/cow-work/templates/new") {
    return { title: "Edit Template", subtitle: "Configure project defaults", showBack: true };
  }
  if (pathname.match(/^\/cow-work\/[^/]+\/close-out$/)) {
    return { title: "Close Out Project", subtitle: "Spring Preg Check", showBack: true };
  }
  if (pathname.match(/^\/cow-work\/[^/]+\/report$/)) {
    return { title: "Project Report", subtitle: "Spring Preg Check · Completed", showBack: true };
  }
  if (pathname.match(/^\/cow-work\/[^/]+\/animal\/[^/]+$/)) {
    const animalId = pathname.split("/").pop();
    return { title: "Animal Record", subtitle: `Tag ${animalId} · Project Work`, showBack: true };
  }
  if (pathname.startsWith("/cow-work/")) return { title: "Project", subtitle: "", showBack: true };
  if (pathname === "/red-book") return { title: "Red Book", subtitle: "Ranch Notes & Records" };
  if (pathname === "/red-book/new") return { title: "New Entry", subtitle: "Red Book", showBack: true, showSave: true };
  if (pathname.startsWith("/red-book/")) return { title: "Entry", subtitle: "Red Book", showBack: true, showSave: true };
  if (pathname === "/reference") return { title: "Reference", subtitle: "Settings & Lookups" };
  if (pathname === "/reference/groups") return { title: "Groups", subtitle: "Reference · 6 Groups", showBack: true };
  if (pathname === "/reference/locations") return { title: "Locations", subtitle: "Reference · 8 Locations", showBack: true };
  if (pathname === "/reference/quick-notes") return { title: "Quick Notes", subtitle: "Reference · 3 Categories", showBack: true };
  if (pathname === "/reference/diseases") return { title: "Diseases", subtitle: "Reference · Global List", showBack: true };
  if (pathname === "/reference/preferences") return { title: "Preferences", subtitle: "Reference · Saddle Butte Ranch", showBack: true };
  if (pathname === "/reference/team") return { title: "Team", subtitle: "Reference · 5 Members", showBack: true };
  if (pathname === "/reference/operation") return { title: "Operation Profile", subtitle: "Reference", showBack: true };
  if (pathname === "/treatment/new") return { title: "Record Treatment", subtitle: "Tag 3309 · Pink Cow", showBack: true };
  if (pathname === "/treatments") return { title: "Treatments", subtitle: "All Records", showBack: true };
  if (pathname === "/bse/new") return { title: "BSE Exam", subtitle: "Tag 901 · Black Bull", showBack: true };
  if (pathname === "/dev/dashboard-explore") return { title: "Dashboard", subtitle: "Design Exploration" };
  if (pathname === "/dev/flag-explore") return { title: "Flag Colors", subtitle: "Design Exploration", showBack: true };
  if (pathname === "/dev/gradient-explore") return { title: "Gradients", subtitle: "Design Exploration", showBack: true };
  if (pathname === "/dev/color-explore") return { title: "Colors", subtitle: "Font & Pill Accents", showBack: true };
  if (pathname === "/dev/font-explore") return { title: "Fonts", subtitle: "Sans-Serif Options", showBack: true };
  if (pathname === "/dev/skeletons") return { title: "Skeletons", subtitle: "Loading Placeholders", showBack: true };
  return { title: "ChuteSide", subtitle: "", compact: true };
}

const routeToMenuItem: Record<string, string> = {
  "/": "Operation Dashboard",
  "/animals": "Animals",
  "/calving": "Calving",
  "/cow-work": "Cow Work",
  "/red-book": "Red Book",
  "/reference": "Reference",
};

const menuItemToRoute: Record<string, string> = {
  "Operation Dashboard": "/",
  "Animals": "/animals",
  "Calving": "/calving",
  "Cow Work": "/cow-work",
  "Red Book": "/red-book",
  "Reference": "/reference",
};

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [operationPickerOpen, setOperationPickerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const config = getHeaderConfig(location.pathname);

  /* Figure out which nav item is active */
  const segments = location.pathname.split("/").filter(Boolean);
  const basePath = segments.length > 0 ? "/" + segments[0] : "/";
  const activeItem = routeToMenuItem[basePath] ?? routeToMenuItem["/"];

  return (
    <div className="min-h-screen font-['Inter'] relative" style={{ backgroundColor: "#F5F5F0" }}>
      {/* ── Navigation Drawer ── */}
      <NavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeItem={activeItem}
        onItemSelect={(item) => {
          navigate(menuItemToRoute[item] ?? "/");
          setDrawerOpen(false);
        }}
        onSignOut={() => {
          logout();
          setDrawerOpen(false);
          navigate("/sign-in");
        }}
        onSwitchOperation={() => {
          setDrawerOpen(false);
          setTimeout(() => setOperationPickerOpen(true), 200);
        }}
      />

      {/* ── Operation Picker Overlay ── */}
      <OperationPicker
        open={operationPickerOpen}
        onClose={() => setOperationPickerOpen(false)}
      />

      {/* ── Mobile Frame ── */}
      <div className="max-w-[420px] mx-auto relative">
        {/* ══ TOP BAR ══ */}
        <div className="sticky top-0 z-30" style={{ background: "linear-gradient(180deg, #153566 0%, #081020 100%)" }}>
          <div className="px-4 pt-3 pb-4">
            {/* Row 1: hamburger/back + brand */}
            <div className="flex items-center justify-between">
              {config.showBack ? (
                <BackArrowButton onClick={() => navigate(-1)} />
              ) : (
                <HamburgerButton onClick={() => setDrawerOpen(true)} />
              )}
              <div className="flex items-center gap-3">
                {config.showSave && (
                  <button
                    type="button"
                    className="rounded-full cursor-pointer font-['Inter']"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      padding: "5px 16px",
                      backgroundColor: "#F3D12A",
                      color: "#1A1A1A",
                    }}
                  >
                    Save
                  </button>
                )}
                <span
                  className="text-[#F3D12A] font-['Inter']"
                  style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em" }}
                >
                  CHUTESIDE
                </span>
              </div>
            </div>

            {/* Row 2: title */}
            <p
              className="text-white mt-3 uppercase font-['Inter']"
              style={{ fontSize: 17, fontWeight: 800, letterSpacing: "0.10em", lineHeight: 1.2 }}
            >
              {config.title}
            </p>

            {/* Row 3: subtitle */}
            {config.subtitle && (
              <p
                className="mt-1 font-['Inter']"
                style={{ fontSize: 12, fontWeight: 500, color: "rgba(240,240,240,0.40)", letterSpacing: "0.02em" }}
              >
                {config.subtitle}
              </p>
            )}
          </div>

          {/* ── Toast overlay anchored below header ── */}
          <ToastContainer />
        </div>

        {/* ══ PAGE CONTENT ══ */}
        <div className="px-5 py-5 space-y-8">
          <Outlet />

          {/* Footer */}
          <footer className="text-center pt-4 pb-6">
            <p className="text-[#1A1A1A]/15 font-['Inter']" style={{ fontSize: 10, fontWeight: 600 }}>
              ChuteSide v1.0
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}