import { useState } from "react";

/* ═══════════════════════════════════════════
   COLOR OPTION DATA
   ═══════════════════════════════════════════ */

interface ColorOption {
  id: string;
  label: string;
  hex: string;
  description: string;
}

const yellowOptions: ColorOption[] = [
  { id: "y-current", label: "Current Yellow", hex: "#F3D12A", description: "Bright sunflower — existing" },
  { id: "y-goldenrod", label: "Goldenrod", hex: "#DAA520", description: "Warm, earthy gold" },
  { id: "y-amber", label: "Amber", hex: "#F5B731", description: "Rich amber with orange warmth" },
  { id: "y-honey", label: "Honey", hex: "#E8B828", description: "Muted honey — slightly toned down" },
  { id: "y-cream-gold", label: "Cream Gold", hex: "#E6C94A", description: "Softer, lighter gold" },
  { id: "y-maize", label: "Maize", hex: "#F0C940", description: "Classic warm maize" },
];

const greenOptions: ColorOption[] = [
  { id: "g-current", label: "Current Teal", hex: "#55BAAA", description: "Balanced teal — existing" },
  { id: "g-sage", label: "Sage", hex: "#6BAF8D", description: "Earthy green-sage" },
  { id: "g-seafoam", label: "Seafoam", hex: "#4DC9B0", description: "Lighter, brighter seafoam" },
  { id: "g-deep-teal", label: "Deep Teal", hex: "#3A9E8F", description: "Richer, more saturated teal" },
  { id: "g-jade", label: "Jade", hex: "#4CA882", description: "True jade — green-forward" },
  { id: "g-slate-teal", label: "Slate Teal", hex: "#5A9EA0", description: "Cooler, blue-leaning teal" },
];

const redOptions: ColorOption[] = [
  { id: "r-current", label: "Current Berry", hex: "#9B2335", description: "Deep berry — existing" },
  { id: "r-crimson", label: "Crimson", hex: "#B82040", description: "Brighter, more vivid red" },
  { id: "r-brick", label: "Brick", hex: "#A63A2D", description: "Warm brick-terracotta" },
  { id: "r-wine", label: "Wine", hex: "#7A2040", description: "Darker, more purple-wine" },
  { id: "r-rust", label: "Rust", hex: "#B5452A", description: "Earthy rust-orange red" },
  { id: "r-cherry", label: "Cherry", hex: "#C02040", description: "Bright cherry pop" },
];

/* ═══════════════════════════════════════════
   PREVIEW COMPONENTS
   ═══════════════════════════════════════════ */

/* Flag pennant SVG */
function FlagPennant({ fill, size = 20 }: { fill: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 32 28" fill="none">
      <line x1="3" y1="2" x2="3" y2="26" stroke={fill} strokeWidth="2" strokeLinecap="round" />
      <path d="M3 3H27L23 9.5L27 16H3V3Z" fill={fill} />
    </svg>
  );
}

/* Navy card showing text + pill + flag in context */
function ContextPreview({
  yellow,
  green,
  red,
}: {
  yellow: ColorOption;
  green: ColorOption;
  red: ColorOption;
}) {
  return (
    <div className="space-y-3">
      {/* ── Top Bar mockup ── */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#0E2646", padding: "14px 16px 16px" }}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[4px]">
            <span className="block rounded-full" style={{ width: 16, height: 1.5, backgroundColor: "#F0F0F0" }} />
            <span className="block rounded-full" style={{ width: 16, height: 1.5, backgroundColor: "#F0F0F0" }} />
            <span className="block rounded-full" style={{ width: 16, height: 1.5, backgroundColor: "#F0F0F0" }} />
          </div>
          <span className="font-['Open_Sans']" style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: yellow.hex }}>
            CHUTESIDE
          </span>
        </div>
        <p className="text-white mt-2 uppercase font-['Open_Sans']" style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.10em", lineHeight: 1.2 }}>
          Animals
        </p>
        <p className="mt-0.5 font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 500, color: green.hex, opacity: 0.65 }}>
          847 Total · 798 Active
        </p>
      </div>

      {/* ── Animal Card mockup ── */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#0E2646", padding: "14px 16px" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-['Open_Sans'] text-white" style={{ fontSize: 14, fontWeight: 700 }}>2847</span>
            <span className="rounded-full" style={{ width: 8, height: 8, backgroundColor: "#FF69B4" }} />
            <span className="font-['Open_Sans']" style={{ fontSize: 10, color: "rgba(240,240,240,0.5)" }}>Pink</span>
          </div>
          <div className="flex items-center gap-2">
            <FlagPennant fill={green.hex} size={16} />
            <FlagPennant fill={yellow.hex} size={16} />
            <FlagPennant fill={red.hex} size={16} />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="font-['Open_Sans']" style={{ fontSize: 10, color: "rgba(240,240,240,0.45)" }}>
            2022 · 1,247 lbs · Good body condition
          </span>
        </div>
      </div>

      {/* ── Buttons & Pills ── */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#0E2646", padding: "14px 16px" }}>
        <p className="font-['Open_Sans'] mb-3" style={{ fontSize: 9, fontWeight: 700, color: "rgba(240,240,240,0.3)", letterSpacing: "0.1em" }}>BUTTONS & PILLS</p>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Yellow CTA */}
          <span
            className="rounded-full font-['Open_Sans']"
            style={{ fontSize: 10, fontWeight: 700, padding: "5px 14px", backgroundColor: yellow.hex, color: "#1A1A1A" }}
          >
            + New Entry
          </span>
          {/* Outline pill */}
          <span
            className="rounded-full font-['Open_Sans']"
            style={{ fontSize: 10, fontWeight: 600, padding: "4px 12px", border: `1.5px solid ${yellow.hex}`, color: yellow.hex }}
          >
            Save
          </span>
          {/* Teal pill */}
          <span
            className="rounded-full font-['Open_Sans']"
            style={{ fontSize: 10, fontWeight: 600, padding: "5px 14px", backgroundColor: green.hex, color: "#FFFFFF" }}
          >
            Active
          </span>
          {/* Berry pill */}
          <span
            className="rounded-full font-['Open_Sans']"
            style={{ fontSize: 10, fontWeight: 600, padding: "5px 14px", backgroundColor: red.hex, color: "#FFFFFF" }}
          >
            Critical
          </span>
        </div>
      </div>

      {/* ── Quick Notes selected pill ── */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#0E2646", padding: "14px 16px" }}>
        <p className="font-['Open_Sans'] mb-3" style={{ fontSize: 9, fontWeight: 700, color: "rgba(240,240,240,0.3)", letterSpacing: "0.1em" }}>QUICK NOTE PILLS</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="rounded-full font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 600, padding: "5px 12px", backgroundColor: "#0E2646", border: "1px solid rgba(240,240,240,0.15)", color: "rgba(240,240,240,0.5)" }}>
            Limping
          </span>
          <span className="rounded-full font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 600, padding: "5px 12px", backgroundColor: "#0E2646", color: "#FFFFFF", border: `1px solid ${green.hex}`, boxShadow: `inset 0 0 0 1px ${green.hex}` }}>
            Treated
          </span>
          <span className="rounded-full font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 600, padding: "5px 12px", backgroundColor: "#0E2646", color: "#FFFFFF", border: `1px solid ${yellow.hex}`, boxShadow: `inset 0 0 0 1px ${yellow.hex}` }}>
            Watch
          </span>
        </div>
      </div>

      {/* ── Nav Active Item ── */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#0E2646", padding: "14px 16px" }}>
        <p className="font-['Open_Sans'] mb-3" style={{ fontSize: 9, fontWeight: 700, color: "rgba(240,240,240,0.3)", letterSpacing: "0.1em" }}>NAV ACTIVE STATE</p>
        <div className="space-y-1">
          <div className="relative font-['Open_Sans']" style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, color: yellow.hex, backgroundColor: `${yellow.hex}0F` }}>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-sm" style={{ width: 2.5, height: 18, backgroundColor: yellow.hex }} />
            Animals
          </div>
          <div className="font-['Open_Sans']" style={{ padding: "6px 12px", fontSize: 12, fontWeight: 400, color: "rgba(240,240,240,0.5)" }}>
            Calving
          </div>
          <div className="font-['Open_Sans']" style={{ padding: "6px 12px", fontSize: 12, fontWeight: 400, color: "rgba(240,240,240,0.5)" }}>
            Red Book
          </div>
        </div>
      </div>

      {/* ── On cream background ── */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#F5F5F0", padding: "14px 16px", border: "1px solid #E8E8E3" }}>
        <p className="font-['Open_Sans'] mb-3" style={{ fontSize: 9, fontWeight: 700, color: "rgba(26,26,26,0.25)", letterSpacing: "0.1em" }}>ON CREAM BACKGROUND</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-['Open_Sans']" style={{ fontSize: 13, fontWeight: 700, color: green.hex }}>Teal text</span>
          <span className="font-['Open_Sans']" style={{ fontSize: 13, fontWeight: 700, color: yellow.hex }}>Yellow text</span>
          <span className="font-['Open_Sans']" style={{ fontSize: 13, fontWeight: 700, color: red.hex }}>Red text</span>
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <FlagPennant fill={green.hex} size={22} />
          <FlagPennant fill={yellow.hex} size={22} />
          <FlagPennant fill={red.hex} size={22} />
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="rounded-full font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 700, padding: "5px 14px", backgroundColor: yellow.hex, color: "#1A1A1A" }}>
            + Add Animal
          </span>
          <span className="rounded-full font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 600, padding: "5px 14px", backgroundColor: green.hex, color: "#FFFFFF" }}>
            Management
          </span>
          <span className="rounded-full font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 600, padding: "5px 14px", backgroundColor: red.hex, color: "#FFFFFF" }}>
            Urgent
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SWATCH ROW
   ═══════════════════════════════════════════ */
function SwatchCard({
  option,
  selected,
  onSelect,
}: {
  option: ColorOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-center gap-3 w-full text-left cursor-pointer rounded-xl transition-all duration-150"
      style={{
        padding: "10px 12px",
        border: selected ? `2px solid ${option.hex}` : "2px solid transparent",
        backgroundColor: selected ? `${option.hex}08` : "#FFFFFF",
        boxShadow: selected ? `0 2px 10px ${option.hex}25` : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Color swatch */}
      <span
        className="shrink-0 rounded-lg"
        style={{ width: 36, height: 36, backgroundColor: option.hex }}
      />
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-['Open_Sans']" style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>
            {option.label}
          </p>
          {selected && (
            <span
              className="rounded-full flex items-center justify-center"
              style={{ width: 16, height: 16, backgroundColor: option.hex }}
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="M2.5 5L4.5 7L7.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </div>
        <p className="font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 400, color: "#1A1A1A", opacity: 0.4 }}>
          {option.hex} · {option.description}
        </p>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════
   SECTION HEADING
   ═══════════════════════════════════════════ */
function SectionHeading({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full" style={{ width: 8, height: 8, backgroundColor: color }} />
      <p
        className="uppercase font-['Open_Sans']"
        style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: "#1A1A1A", opacity: 0.25 }}
      >
        {text}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN EXPLORER
   ═══════════════════════════════════════════ */
export function ColorExplorer() {
  const [selectedYellow, setSelectedYellow] = useState("y-current");
  const [selectedGreen, setSelectedGreen] = useState("g-current");
  const [selectedRed, setSelectedRed] = useState("r-current");

  const chosenYellow = yellowOptions.find((o) => o.id === selectedYellow) ?? yellowOptions[0];
  const chosenGreen = greenOptions.find((o) => o.id === selectedGreen) ?? greenOptions[0];
  const chosenRed = redOptions.find((o) => o.id === selectedRed) ?? redOptions[0];

  return (
    <div className="space-y-8">
      {/* ── Active Selections ── */}
      <div
        className="rounded-xl px-4 py-3"
        style={{ backgroundColor: "rgba(85,186,170,0.08)", border: "1px solid rgba(85,186,170,0.2)" }}
      >
        <p className="font-['Open_Sans']" style={{ fontSize: 11, fontWeight: 700, color: "#1A1A1A" }}>
          Current Selections
        </p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="rounded-full" style={{ width: 12, height: 12, backgroundColor: chosenYellow.hex }} />
            <span className="font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 600, color: "#1A1A1A", opacity: 0.6 }}>
              {chosenYellow.label}
            </span>
          </div>
          <span style={{ color: "#D4D4D0" }}>·</span>
          <div className="flex items-center gap-1.5">
            <span className="rounded-full" style={{ width: 12, height: 12, backgroundColor: chosenGreen.hex }} />
            <span className="font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 600, color: "#1A1A1A", opacity: 0.6 }}>
              {chosenGreen.label}
            </span>
          </div>
          <span style={{ color: "#D4D4D0" }}>·</span>
          <div className="flex items-center gap-1.5">
            <span className="rounded-full" style={{ width: 12, height: 12, backgroundColor: chosenRed.hex }} />
            <span className="font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 600, color: "#1A1A1A", opacity: 0.6 }}>
              {chosenRed.label}
            </span>
          </div>
        </div>
      </div>

      {/* ── Live Context Preview ── */}
      <div className="space-y-3">
        <p
          className="uppercase font-['Open_Sans']"
          style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: "#1A1A1A", opacity: 0.25 }}
        >
          Live Preview
        </p>
        <ContextPreview yellow={chosenYellow} green={chosenGreen} red={chosenRed} />
      </div>

      {/* ── Yellow Options ── */}
      <div className="space-y-3">
        <SectionHeading text="Yellow / Gold Accent" color={chosenYellow.hex} />
        <div className="space-y-2">
          {yellowOptions.map((o) => (
            <SwatchCard
              key={o.id}
              option={o}
              selected={selectedYellow === o.id}
              onSelect={() => setSelectedYellow(o.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Green / Teal Options ── */}
      <div className="space-y-3">
        <SectionHeading text="Green / Teal Accent" color={chosenGreen.hex} />
        <div className="space-y-2">
          {greenOptions.map((o) => (
            <SwatchCard
              key={o.id}
              option={o}
              selected={selectedGreen === o.id}
              onSelect={() => setSelectedGreen(o.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Red / Berry Options ── */}
      <div className="space-y-3">
        <SectionHeading text="Red / Berry Accent" color={chosenRed.hex} />
        <div className="space-y-2">
          {redOptions.map((o) => (
            <SwatchCard
              key={o.id}
              option={o}
              selected={selectedRed === o.id}
              onSelect={() => setSelectedRed(o.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
