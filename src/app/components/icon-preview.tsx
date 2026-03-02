import { useState } from "react";

const icons = [
  {
    name: "Clipboard",
    desc: "Classic form/template feel",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="2.5" width="10" height="12" rx="1.5" stroke="#0E2646" strokeWidth="1.3"/>
        <path d="M6 2.5V2a1 1 0 011-1h2a1 1 0 011 1v.5" stroke="#0E2646" strokeWidth="1.3"/>
        <path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" stroke="#0E2646" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Stacked Cards",
    desc: "Multiple saved templates",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="4" y="3.5" width="9.5" height="11" rx="1.5" stroke="#0E2646" strokeWidth="1.3"/>
        <path d="M2.5 11.5V3.5A1.5 1.5 0 014 2h6" stroke="#0E2646" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M6.5 7h5M6.5 9.5h3.5" stroke="#0E2646" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Grid Layout",
    desc: "Structured template blocks",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5.25" height="5.25" rx="1.2" stroke="#0E2646" strokeWidth="1.3"/>
        <rect x="8.75" y="2" width="5.25" height="5.25" rx="1.2" stroke="#0E2646" strokeWidth="1.3"/>
        <rect x="2" y="8.75" width="5.25" height="5.25" rx="1.2" stroke="#0E2646" strokeWidth="1.3"/>
        <rect x="8.75" y="8.75" width="5.25" height="5.25" rx="1.2" stroke="#0E2646" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    name: "Puzzle Piece",
    desc: "Configurable building blocks",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 5.5h2.2a1.5 1.5 0 100-3H5V2a1 1 0 011-1h4a1 1 0 011 1v.5a1.5 1.5 0 100 3H13a1 1 0 011 1v3.5h-.5a1.5 1.5 0 100 3h.5v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-.5a1.5 1.5 0 10-3 0v.5H2a1 1 0 01-1-1V6.5a1 1 0 011-1h1z" stroke="#0E2646" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Checklist Toggle",
    desc: "Field visibility toggles",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2.5 4h5M2.5 8h5M2.5 12h4" stroke="#0E2646" strokeWidth="1.3" strokeLinecap="round"/>
        <rect x="10" y="2.75" width="4" height="2.5" rx="1.25" stroke="#0E2646" strokeWidth="1.1"/>
        <circle cx="12.75" cy="4" r="0.7" fill="#0E2646"/>
        <rect x="10" y="6.75" width="4" height="2.5" rx="1.25" stroke="#0E2646" strokeWidth="1.1"/>
        <circle cx="11.25" cy="8" r="0.7" fill="#0E2646"/>
        <rect x="10" y="10.75" width="4" height="2.5" rx="1.25" stroke="#0E2646" strokeWidth="1.1"/>
        <circle cx="12.75" cy="12" r="0.7" fill="#0E2646"/>
      </svg>
    ),
  },
  {
    name: "Bookmark",
    desc: "Saved configuration",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 2.5h8a1 1 0 011 1v11L8 11.5 3 14.5v-11a1 1 0 011-1z" stroke="#0E2646" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M6 5.5h4M6 8h2.5" stroke="#0E2646" strokeWidth="1.1" strokeLinecap="round"/>
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
