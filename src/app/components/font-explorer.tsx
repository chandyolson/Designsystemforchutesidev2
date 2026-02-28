import { useState } from "react";

/* ── Font Options ── */
interface FontOption {
  id: string;
  family: string;
  label: string;
  description: string;
  css: string; /* font-family CSS value */
}

const fontOptions: FontOption[] = [
  {
    id: "open-sans",
    family: "Open Sans",
    label: "Open Sans",
    description: "Friendly humanist sans — great readability at small sizes, slightly rounded",
    css: "'Open Sans', sans-serif",
  },
  {
    id: "inter",
    family: "Inter",
    label: "Inter (Current)",
    description: "Modern UI workhorse — crisp, neutral, excellent for data-heavy screens",
    css: "'Inter', sans-serif",
  },
  {
    id: "dm-sans",
    family: "DM Sans",
    label: "DM Sans",
    description: "Geometric with personality — clean but warm, slightly quirky letterforms",
    css: "'DM Sans', sans-serif",
  },
  {
    id: "jakarta",
    family: "Plus Jakarta Sans",
    label: "Plus Jakarta Sans",
    description: "Premium feel — smooth curves, modern geometric, great for mobile apps",
    css: "'Plus Jakarta Sans', sans-serif",
  },
  {
    id: "nunito",
    family: "Nunito Sans",
    label: "Nunito Sans",
    description: "Soft and approachable — rounded terminals, friendly without being childish",
    css: "'Nunito Sans', sans-serif",
  },
  {
    id: "source-sans",
    family: "Source Sans 3",
    label: "Source Sans 3",
    description: "Adobe's workhorse — professional, versatile, excellent legibility",
    css: "'Source Sans 3', sans-serif",
  },
  {
    id: "outfit",
    family: "Outfit",
    label: "Outfit",
    description: "Contemporary geometric — clean lines, slightly condensed, modern edge",
    css: "'Outfit', sans-serif",
  },
];

/* ── Flag pennant for previews ── */
function FlagPennant({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 1.5V12.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M3 2.5L11 4L3 6.5V2.5Z" fill={color} />
    </svg>
  );
}

/* ── Mini Top Bar Preview ── */
function TopBarPreview({ font }: { font: FontOption }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #5E81F4 0%, #0E1528 50%, #54B6A7 100%)",
        padding: "12px 14px 14px",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[3px]">
          <span className="block rounded-full" style={{ width: 14, height: 1.5, backgroundColor: "#F0F0F0" }} />
          <span className="block rounded-full" style={{ width: 14, height: 1.5, backgroundColor: "#F0F0F0" }} />
          <span className="block rounded-full" style={{ width: 14, height: 1.5, backgroundColor: "#F0F0F0" }} />
        </div>
        <span style={{ fontFamily: font.css, fontSize: 7, fontWeight: 700, letterSpacing: "0.14em", color: "#F3D12A" }}>
          CHUTESIDE
        </span>
      </div>
      <p
        className="text-white mt-2 uppercase"
        style={{ fontFamily: font.css, fontSize: 12, fontWeight: 800, letterSpacing: "0.10em", lineHeight: 1.2 }}
      >
        Animals
      </p>
      <p className="mt-0.5" style={{ fontFamily: font.css, fontSize: 9, fontWeight: 500, color: "rgba(240,240,240,0.40)" }}>
        847 Total · 798 Active
      </p>
    </div>
  );
}

/* ── Mini Animal Card Preview ── */
function AnimalCardPreview({ font }: { font: FontOption }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: "#0E2646", padding: "10px 12px" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlagPennant color="#4DC9B0" />
          <span style={{ fontFamily: font.css, fontSize: 14, fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.04em" }}>
            4782
          </span>
          <span
            className="rounded-full"
            style={{
              fontFamily: font.css,
              fontSize: 8,
              fontWeight: 700,
              color: "rgba(240,240,240,0.5)",
              backgroundColor: "rgba(240,240,240,0.08)",
              padding: "2px 8px",
              letterSpacing: "0.08em",
            }}
          >
            COW
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-1.5">
        <span style={{ fontFamily: font.css, fontSize: 10, fontWeight: 400, color: "rgba(240,240,240,0.45)" }}>
          2020
        </span>
        <span style={{ fontFamily: font.css, fontSize: 10, fontWeight: 400, color: "rgba(240,240,240,0.45)" }}>
          1,247 lbs
        </span>
      </div>
      <p className="mt-1" style={{ fontFamily: font.css, fontSize: 10, fontWeight: 500, color: "rgba(240,240,240,0.30)" }}>
        Normal
      </p>
    </div>
  );
}

/* ── Weight Scale Preview ── */
function WeightScalePreview({ font }: { font: FontOption }) {
  const weights = [
    { w: 300, label: "Light" },
    { w: 400, label: "Regular" },
    { w: 500, label: "Medium" },
    { w: 600, label: "SemiBold" },
    { w: 700, label: "Bold" },
    { w: 800, label: "ExtraBold" },
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 px-1">
      {weights.map(({ w, label }) => (
        <div key={w} className="flex items-baseline gap-1.5">
          <span style={{ fontFamily: font.css, fontSize: 13, fontWeight: w, color: "#1A1A1A" }}>
            Ag
          </span>
          <span style={{ fontFamily: font.css, fontSize: 8, fontWeight: 400, color: "#1A1A1A", opacity: 0.3 }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Form Row Preview ── */
function FormRowPreview({ font }: { font: FontOption }) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(14,38,70,0.08)", padding: "8px 12px" }}
    >
      <div className="flex items-center justify-between">
        <span style={{ fontFamily: font.css, fontSize: 11, fontWeight: 600, color: "#1A1A1A" }}>
          Tag Number
        </span>
        <span style={{ fontFamily: font.css, fontSize: 11, fontWeight: 400, color: "#1A1A1A", opacity: 0.4 }}>
          4782
        </span>
      </div>
      <div className="h-px my-1.5" style={{ backgroundColor: "rgba(14,38,70,0.06)" }} />
      <div className="flex items-center justify-between">
        <span style={{ fontFamily: font.css, fontSize: 11, fontWeight: 600, color: "#1A1A1A" }}>
          Status
        </span>
        <span
          className="rounded-full"
          style={{
            fontFamily: font.css,
            fontSize: 9,
            fontWeight: 700,
            color: "#4DC9B0",
            backgroundColor: "rgba(77,201,176,0.10)",
            padding: "2px 10px",
          }}
        >
          Active
        </span>
      </div>
    </div>
  );
}

/* ── Pill / Button Preview ── */
function PillPreview({ font }: { font: FontOption }) {
  const pills = [
    { label: "Management", color: "#4DC9B0" },
    { label: "Monitor", color: "#D4A017" },
    { label: "Critical", color: "#9B2335" },
  ];
  return (
    <div className="flex items-center gap-2 mt-2 px-1 flex-wrap">
      {pills.map((p) => (
        <span
          key={p.label}
          className="rounded-full flex items-center gap-1.5"
          style={{
            fontFamily: font.css,
            fontSize: 10,
            fontWeight: 600,
            color: p.color,
            backgroundColor: `${p.color}14`,
            padding: "3px 10px",
          }}
        >
          <FlagPennant color={p.color} />
          {p.label}
        </span>
      ))}
    </div>
  );
}

/* ── Section Heading ── */
function SectionHeading({ text }: { text: string }) {
  return (
    <p
      className="uppercase font-['Open_Sans']"
      style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: "#1A1A1A", opacity: 0.25 }}
    >
      {text}
    </p>
  );
}

/* ══════════════════════════════════════════
   FONT EXPLORER SCREEN
   ══════════════════════════════════════════ */
export function FontExplorer() {
  const [selectedId, setSelectedId] = useState("inter");

  return (
    <div className="space-y-8">
      {/* ── Info Badge ── */}
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: "rgba(94,129,244,0.08)", border: "1px solid rgba(94,129,244,0.2)" }}
      >
        <div
          className="shrink-0 rounded-full flex items-center justify-center"
          style={{ width: 28, height: 28, backgroundColor: "#5E81F4" }}
        >
          <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF" }}>A</span>
        </div>
        <div>
          <p className="font-['Open_Sans']" style={{ fontSize: 11, fontWeight: 700, color: "#1A1A1A" }}>
            Font Explorer
          </p>
          <p className="font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 400, color: "#1A1A1A", opacity: 0.45 }}>
            Compare sans-serif fonts across UI contexts
          </p>
        </div>
      </div>

      {/* ── Font Option Cards ── */}
      <div className="space-y-3">
        <SectionHeading text="Sans-Serif Options" />

        {fontOptions.map((font) => {
          const isSelected = selectedId === font.id;
          return (
            <button
              key={font.id}
              type="button"
              onClick={() => setSelectedId(font.id)}
              className="w-full text-left cursor-pointer rounded-2xl transition-all duration-200"
              style={{
                border: isSelected ? "2px solid #5E81F4" : "2px solid transparent",
                backgroundColor: isSelected ? "rgba(94,129,244,0.04)" : "#FFFFFF",
                boxShadow: isSelected
                  ? "0 2px 12px rgba(94,129,244,0.15)"
                  : "0 1px 4px rgba(0,0,0,0.05)",
                padding: 12,
              }}
            >
              {/* Header row */}
              <div className="flex items-center gap-2.5">
                <span
                  className="shrink-0 rounded-full border-2 flex items-center justify-center"
                  style={{
                    width: 18,
                    height: 18,
                    borderColor: isSelected ? "#5E81F4" : "#D4D4D0",
                    backgroundColor: isSelected ? "#5E81F4" : "transparent",
                  }}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2.5 5L4.5 7L7.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: font.css, fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>
                    {font.label}
                  </p>
                  <p className="font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 400, color: "#1A1A1A", opacity: 0.4, marginTop: 1 }}>
                    {font.description}
                  </p>
                </div>
              </div>

              {/* Sample sentence */}
              <div className="mt-3 px-1">
                <p style={{ fontFamily: font.css, fontSize: 12, fontWeight: 400, color: "#1A1A1A", lineHeight: 1.6 }}>
                  The quick brown fox jumps over 847 head of cattle at Saddle Butte Ranch.
                </p>
              </div>

              {/* Weight scale */}
              <WeightScalePreview font={font} />

              {/* Previews */}
              <div className="mt-3 space-y-2.5">
                <TopBarPreview font={font} />
                <AnimalCardPreview font={font} />
                <FormRowPreview font={font} />
              </div>

              {/* Pills */}
              <PillPreview font={font} />
            </button>
          );
        })}
      </div>

      {/* ── Side-by-Side Comparison of selected vs current ── */}
      {selectedId !== "open-sans" && (
        <div className="space-y-3">
          <SectionHeading text="Selected vs. Current" />
          <div className="grid grid-cols-2 gap-2.5">
            {/* Selected */}
            <div>
              <p className="font-['Open_Sans'] mb-1.5 text-center" style={{ fontSize: 9, fontWeight: 700, color: "#5E81F4", letterSpacing: "0.08em" }}>
                {fontOptions.find((f) => f.id === selectedId)?.family.toUpperCase()}
              </p>
              <TopBarPreview font={fontOptions.find((f) => f.id === selectedId)!} />
              <div className="mt-2">
                <AnimalCardPreview font={fontOptions.find((f) => f.id === selectedId)!} />
              </div>
            </div>
            {/* Current */}
            <div>
              <p className="font-['Open_Sans'] mb-1.5 text-center" style={{ fontSize: 9, fontWeight: 700, color: "#1A1A1A", opacity: 0.3, letterSpacing: "0.08em" }}>
                OPEN SANS
              </p>
              <TopBarPreview font={fontOptions[0]} />
              <div className="mt-2">
                <AnimalCardPreview font={fontOptions[0]} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}