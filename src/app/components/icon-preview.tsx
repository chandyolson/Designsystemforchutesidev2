import { useState } from "react";

const icons = [
  {
    name: "Document Stack",
    desc: "Layered pages feel",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="4.5" y="1.5" width="8.5" height="11" rx="1.5" stroke="#0E2646" strokeWidth="1.3"/>
        <path d="M3 4v8a1.5 1.5 0 001.5 1.5H11" stroke="#0E2646" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M7 5h3.5M7 7.5h3.5M7 10h2" stroke="#0E2646" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Cog List",
    desc: "Settings + field config",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="5.5" cy="8" r="3" stroke="#0E2646" strokeWidth="1.3"/>
        <path d="M5.5 5V4M5.5 12v-1M2.5 8H2M9 8h-.5M3.4 5.9l-.5-.5M7.6 10.1l.5.5M3.4 10.1l-.5.5M7.6 5.9l.5-.5" stroke="#0E2646" strokeWidth="1.1" strokeLinecap="round"/>
        <path d="M10.5 4h3M10.5 8h3M10.5 12h3" stroke="#0E2646" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Wrench Form",
    desc: "Tool + editable fields",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 3.5a2.5 2.5 0 014.3-1.7l3.4 3.4a2.5 2.5 0 01-1.7 4.3" stroke="#0E2646" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 7l-4 4a1.2 1.2 0 001.7 1.7l4-4" stroke="#0E2646" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M10 11h4M10 13.5h2.5" stroke="#0E2646" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Sliders",
    desc: "Adjustable parameters",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2.5 4h11M2.5 8h11M2.5 12h11" stroke="#0E2646" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="5.5" cy="4" r="1.5" fill="#F5F5F0" stroke="#0E2646" strokeWidth="1.3"/>
        <circle cx="10" cy="8" r="1.5" fill="#F5F5F0" stroke="#0E2646" strokeWidth="1.3"/>
        <circle cx="7" cy="12" r="1.5" fill="#F5F5F0" stroke="#0E2646" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    name: "Stamp",
    desc: "Apply preset quickly",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6.5 8V6.5a1.5 1.5 0 013 0V8" stroke="#0E2646" strokeWidth="1.3"/>
        <path d="M4 8h8a1 1 0 011 1v1.5H3V9a1 1 0 011-1z" stroke="#0E2646" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M2.5 12.5h11" stroke="#0E2646" strokeWidth="1.4" strokeLinecap="round"/>
        <rect x="3" y="10.5" width="10" height="2" rx="0.5" fill="none" stroke="#0E2646" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    name: "Tag",
    desc: "Labeled preset / tag",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2.5 2.5h5.3a1 1 0 01.7.3l5 5a1 1 0 010 1.4l-3.8 3.8a1 1 0 01-1.4 0l-5-5a1 1 0 01-.3-.7V2.5z" stroke="#0E2646" strokeWidth="1.3" strokeLinejoin="round"/>
        <circle cx="5.5" cy="5.5" r="1" fill="#0E2646"/>
      </svg>
    ),
  },
  {
    name: "Lightning Bolt",
    desc: "Quick-apply action",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M9 1.5L4 9h3.5l-1 5.5L12 7H8.5L9 1.5z" stroke="#0E2646" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Layers",
    desc: "Stacked template layers",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L2 5.5 8 9l6-3.5L8 2z" stroke="#0E2646" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M2 8l6 3.5L14 8" stroke="#0E2646" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 11l6 3.5 6-3.5" stroke="#0E2646" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Clipboard Check",
    desc: "Completed template",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="2.5" width="10" height="12" rx="1.5" stroke="#0E2646" strokeWidth="1.3"/>
        <path d="M6 2.5V2a1 1 0 011-1h2a1 1 0 011 1v.5" stroke="#0E2646" strokeWidth="1.3"/>
        <path d="M5.5 8.5l2 2 3.5-4" stroke="#0E2646" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Folder Cog",
    desc: "Organized config sets",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4.5V3.5A1.5 1.5 0 013.5 2H6l1.5 2H12.5A1.5 1.5 0 0114 5.5V7" stroke="#0E2646" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 5.5v6A1.5 1.5 0 003.5 13H8" stroke="#0E2646" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="12" cy="11" r="2" stroke="#0E2646" strokeWidth="1.2"/>
        <path d="M12 9V8.5M12 13.5V13M10 11h-.5M14.5 11H14M10.6 9.6l-.4-.4M13.4 12.4l.4.4M10.6 12.4l-.4.4M13.4 9.6l.4-.4" stroke="#0E2646" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export function IconPreview() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-5 font-['Inter']">
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0E2646" }}>Template Icon Options</h2>
        <p className="mt-1" style={{ fontSize: 13, color: "#1A1A1A", opacity: 0.5 }}>
          Tap one to select — see it in the preview button below
        </p>
      </div>

      {/* Icon grid */}
      <div className="grid grid-cols-2 gap-3">
        {icons.map((icon) => (
          <button
            key={icon.name}
            type="button"
            onClick={() => setSelected(icon.name)}
            className="rounded-xl p-4 cursor-pointer transition-all duration-150 active:scale-[0.97] text-left"
            style={{
              backgroundColor: selected === icon.name ? "rgba(85,186,170,0.08)" : "white",
              border: selected === icon.name
                ? "2px solid #55BAAA"
                : "1.5px solid rgba(14,38,70,0.1)",
            }}
          >
            {/* Large icon preview */}
            <div
              className="rounded-lg flex items-center justify-center mb-3"
              style={{
                width: 56,
                height: 56,
                backgroundColor: "#F5F5F0",
                border: "1px solid rgba(14,38,70,0.06)",
              }}
            >
              <div style={{ transform: "scale(2.5)" }}>
                {icon.svg}
              </div>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#0E2646" }}>{icon.name}</p>
            <p className="mt-0.5" style={{ fontSize: 11, fontWeight: 500, color: "#1A1A1A", opacity: 0.4 }}>
              {icon.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Live preview — shows selected icon in actual button context */}
      <div className="rounded-xl p-4" style={{ backgroundColor: "white", border: "1.5px solid rgba(14,38,70,0.1)" }}>
        <p className="mb-3 uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#1A1A1A", opacity: 0.35 }}>
          Live Preview — as it looks in the toolbar
        </p>
        <div className="flex items-center gap-3">
          {/* Simulated toolbar context */}
          <div
            className="rounded-lg flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              backgroundColor: "white",
              border: "1px solid rgba(14,38,70,0.12)",
            }}
          >
            {/* Filter icon for context */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 3.5h12M4 6.5h8M6 9.5h4M7 12.5h2" stroke="#0E2646" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>

          {/* The template button with selected icon */}
          <div
            className="rounded-lg flex items-center justify-center relative"
            style={{
              width: 32,
              height: 32,
              backgroundColor: "white",
              border: selected ? "1.5px solid #55BAAA" : "1px solid rgba(14,38,70,0.12)",
              boxShadow: selected ? "0 0 0 3px rgba(85,186,170,0.15)" : "none",
            }}
          >
            {selected
              ? icons.find((i) => i.name === selected)?.svg
              : icons[0].svg
            }
          </div>

          {/* + button for context */}
          <div
            className="rounded-lg flex items-center justify-center font-['Inter']"
            style={{
              width: 38,
              height: 38,
              fontSize: 22,
              fontWeight: 400,
              color: "#1A1A1A",
              backgroundColor: "#F3D12A",
            }}
          >
            +
          </div>

          {/* 3-dot for context */}
          <div
            className="rounded-lg flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              backgroundColor: "white",
              border: "1px solid rgba(14,38,70,0.12)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="3.5" r="1.3" fill="#0E2646"/>
              <circle cx="8" cy="8" r="1.3" fill="#0E2646"/>
              <circle cx="8" cy="12.5" r="1.3" fill="#0E2646"/>
            </svg>
          </div>
        </div>
        {selected && (
          <p className="mt-3" style={{ fontSize: 12, fontWeight: 600, color: "#55BAAA" }}>
            Selected: {selected}
          </p>
        )}
      </div>
    </div>
  );
}