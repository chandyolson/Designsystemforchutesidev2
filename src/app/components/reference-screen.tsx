import { useState } from "react";
import { useNavigate } from "react-router";

/* ── Chevron SVG ── */
function Chevron({ rotated }: { rotated?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 transition-transform duration-200"
      style={{ transform: rotated ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      <path d="M6 4L10 8L6 12" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={0.2} />
    </svg>
  );
}

/* ── Settings Item ── */
function SettingsItem({ name, description, onClick }: { name: string; description: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-[#F5F5F0] active:bg-[#F5F5F0] font-['Inter']"
    >
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[#1A1A1A] truncate" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>
          {name}
        </p>
        <p className="text-[#1A1A1A]/40 truncate" style={{ fontSize: 12, fontWeight: 400, lineHeight: 1.4 }}>
          {description}
        </p>
      </div>
      <Chevron />
    </button>
  );
}

/* ── Section Group (collapsible) ── */
function SettingsGroup({
  title,
  items,
  defaultOpen = false,
}: {
  title: string;
  items: { name: string; description: string; onClick?: () => void }[];
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-2 px-1 cursor-pointer"
      >
        <p
          className="text-[#0E2646] font-['Inter'] uppercase"
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}
        >
          {title}
        </p>
        <div className="flex items-center gap-1.5">
          <span
            className="font-['Inter'] text-[#0E2646]/25"
            style={{ fontSize: 10, fontWeight: 600 }}
          >
            {items.length}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#0E2646" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity={0.25} />
          </svg>
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: isOpen ? `${items.length * 70}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="rounded-xl bg-white border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
          {items.map((item) => (
            <SettingsItem key={item.name} name={item.name} description={item.description} onClick={item.onClick} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Screen ── */
export function ReferenceScreen() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <SettingsGroup
        title="Operation"
        items={[
          { name: "Operation Profile", description: "Name, address, contact info", onClick: () => navigate("/reference/operation") },
          { name: "Team Members", description: "Manage users, roles, and invitations", onClick: () => navigate("/reference/team") },
          { name: "Vet Practices", description: "Linked veterinary practices" },
          { name: "Preferences", description: "Tag system, breeds, preg stages", onClick: () => navigate("/reference/preferences") },
        ]}
      />

      <SettingsGroup
        title="Lists & Lookups"
        items={[
          { name: "Breeds", description: "Breed codes and full names" },
          { name: "Locations", description: "Pastures, pens, facilities", onClick: () => navigate("/reference/locations") },
          { name: "Groups", description: "Calving seasons, management groups", onClick: () => navigate("/reference/groups") },
          { name: "Products", description: "Vaccines, antibiotics, supplements" },
          { name: "Diseases", description: "Disease lookup table", onClick: () => navigate("/reference/diseases") },
          { name: "Quick Notes", description: "Calving, cow, and project notes", onClick: () => navigate("/reference/quick-notes") },
          { name: "Project Templates", description: "Default work session configurations" },
        ]}
      />

      <SettingsGroup
        title="Account"
        items={[
          { name: "User Profile", description: "Display name, phone, avatar" },
          { name: "Switch Operation", description: "Change active operation" },
          { name: "Sign Out", description: "Log out of ChuteSide" },
        ]}
      />
    </div>
  );
}