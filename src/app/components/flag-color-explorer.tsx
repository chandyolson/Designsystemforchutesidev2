import { useState } from "react";

/* ── All candidate flag colors ── */
const flagOptions = [
  // Current
  { key: "teal", label: "Teal", hex: "#55BAAA", meaning: "Management / Routine", current: true },
  { key: "gold", label: "Gold", hex: "#D4A017", meaning: "Monitor / Watch", current: true },
  { key: "red", label: "Red (current)", hex: "#9B2335", meaning: "Critical / Urgent", current: true },
  // Red alternatives
  { key: "crimson", label: "Crimson", hex: "#A4243B", meaning: "Critical — deep, wine-toned", current: false },
  { key: "rust", label: "Rust", hex: "#B7472A", meaning: "Critical — earthy, warm red", current: false },
  { key: "barn", label: "Barn Red", hex: "#8B2500", meaning: "Critical — classic barn red", current: false },
  { key: "terra", label: "Terracotta", hex: "#C0583F", meaning: "Critical — warm clay-red", current: false },
  { key: "brick", label: "Brick", hex: "#A93226", meaning: "Critical — solid, muted red", current: false },
  { key: "vermillion", label: "Vermillion", hex: "#CF3721", meaning: "Critical — vivid, high-contrast", current: false },
  { key: "mahogany", label: "Mahogany", hex: "#6E2C2C", meaning: "Critical — dark, subdued red", current: false },
  { key: "cayenne", label: "Cayenne", hex: "#C14B3F", meaning: "Critical — spicy, warm red", current: false },
];

/* ── Flag pennant SVG ── */
function FlagSample({ hex, w = 28, h = 24 }: { hex: string; w?: number; h?: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 32 28" fill="none">
      <line x1="3" y1="2" x2="3" y2="26" stroke={hex} strokeWidth={2} strokeLinecap="round" />
      <path d="M3 3H27L23 9.5L27 16H3V3Z" fill={hex} />
    </svg>
  );
}

/* ── Animal card mock using a flag ── */
function MockAnimalCard({ hex, label }: { hex: string; label: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3 font-['Open_Sans'] flex items-center gap-3"
      style={{ backgroundColor: "#0E2646" }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span style={{ fontSize: 18, fontWeight: 800, color: "#F0F0F0" }}>3309</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.4)" }}>
            Cow · 2020 · 1,187 lbs
          </span>
        </div>
        <p style={{ fontSize: 11, color: "rgba(240,240,240,0.3)", marginTop: 2 }}>
          Spring calving group
        </p>
      </div>
      <div className="shrink-0 flex flex-col items-center gap-0.5">
        <FlagSample hex={hex} w={22} h={18} />
        <span style={{ fontSize: 8, fontWeight: 700, color: hex, letterSpacing: "0.02em" }}>
          {label}
        </span>
      </div>
    </div>
  );
}

/* ── Dashboard stat row mock ── */
function MockStatRow({ flags }: { flags: { hex: string; count: number }[] }) {
  return (
    <div className="flex items-center justify-center gap-5">
      {flags.map((f, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <FlagSample hex={f.hex} w={18} h={16} />
          <span
            className="font-['Open_Sans']"
            style={{ fontSize: 14, fontWeight: 700, color: "#F0F0F0" }}
          >
            {f.count}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Main explorer ── */
export function FlagColorExplorer() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["teal", "gold", "red"])
  );

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const activeFlags = flagOptions.filter((f) => selected.has(f.key));

  return (
    <div className="space-y-6 font-['Open_Sans']">
      {/* Title */}
      <div>
        <p style={{ fontSize: 18, fontWeight: 800, color: "#0E2646" }}>Flag Color Explorer</p>
        <p style={{ fontSize: 13, color: "rgba(26,26,26,0.45)", marginTop: 4 }}>
          Tap to toggle colors on/off · see how they look in context
        </p>
      </div>

      {/* ── Color Grid ── */}
      <div>
        <p
          className="mb-3"
          style={{ fontSize: 11, fontWeight: 700, color: "rgba(26,26,26,0.3)", letterSpacing: "0.08em" }}
        >
          ALL CANDIDATES
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {flagOptions.map((f) => {
            const isOn = selected.has(f.key);
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => toggle(f.key)}
                className="rounded-xl px-3 py-3 text-left transition-all cursor-pointer"
                style={{
                  backgroundColor: isOn ? f.hex + "14" : "#FFFFFF",
                  border: isOn ? `2px solid ${f.hex}` : "2px solid #E0E0DC",
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <FlagSample hex={f.hex} w={22} h={18} />
                  {f.current && (
                    <span
                      className="rounded-full px-1.5 py-0.5"
                      style={{
                        fontSize: 8,
                        fontWeight: 700,
                        color: "rgba(26,26,26,0.4)",
                        backgroundColor: "rgba(26,26,26,0.06)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      CURRENT
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A" }}>{f.label}</p>
                <p style={{ fontSize: 9, color: "rgba(26,26,26,0.4)", marginTop: 1, lineHeight: 1.3 }}>
                  {f.meaning}
                </p>
                <p
                  className="mt-1"
                  style={{ fontSize: 9, fontWeight: 600, color: "rgba(26,26,26,0.2)" }}
                >
                  {f.hex}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Preview: Stat Row ── */}
      {activeFlags.length > 0 && (
        <div>
          <p
            className="mb-3"
            style={{ fontSize: 11, fontWeight: 700, color: "rgba(26,26,26,0.3)", letterSpacing: "0.08em" }}
          >
            DASHBOARD STAT ROW PREVIEW
          </p>
          <div
            className="rounded-xl px-4 py-4"
            style={{
              background: "linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)",
            }}
          >
            <MockStatRow
              flags={activeFlags.map((f, i) => ({
                hex: f.hex,
                count: [412, 28, 7, 15, 9, 34, 3, 11, 6, 22, 19, 5][i] ?? 10,
              }))}
            />
          </div>
        </div>
      )}

      {/* ── Preview: Animal Cards ── */}
      {activeFlags.length > 0 && (
        <div>
          <p
            className="mb-3"
            style={{ fontSize: 11, fontWeight: 700, color: "rgba(26,26,26,0.3)", letterSpacing: "0.08em" }}
          >
            ANIMAL CARD PREVIEW
          </p>
          <div className="space-y-2">
            {activeFlags.slice(0, 5).map((f) => (
              <MockAnimalCard key={f.key} hex={f.hex} label={f.label} />
            ))}
          </div>
          {activeFlags.length > 5 && (
            <p
              className="text-center mt-2"
              style={{ fontSize: 11, color: "rgba(26,26,26,0.3)" }}
            >
              +{activeFlags.length - 5} more selected
            </p>
          )}
        </div>
      )}

      {/* ── Preview: Detail Header ── */}
      {activeFlags.length > 0 && (
        <div>
          <p
            className="mb-3"
            style={{ fontSize: 11, fontWeight: 700, color: "rgba(26,26,26,0.3)", letterSpacing: "0.08em" }}
          >
            DETAIL HEADER PREVIEW
          </p>
          <div className="space-y-2.5">
            {activeFlags.map((f) => (
              <div
                key={f.key}
                className="rounded-xl px-5 py-4"
                style={{
                  background: "linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", lineHeight: 1 }}>
                      3309
                    </p>
                    <p
                      className="mt-1"
                      style={{ fontSize: 12, color: "rgba(240,240,240,0.45)" }}
                    >
                      Cow · Cow · Active · 2020
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <FlagSample hex={f.hex} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: f.hex }}>
                      {f.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Summary ── */}
      <div
        className="rounded-xl px-4 py-4"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E0E0DC" }}
      >
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0E2646" }}>
          Selected: {activeFlags.length} flag{activeFlags.length !== 1 ? "s" : ""}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {activeFlags.map((f) => (
            <div
              key={f.key}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ backgroundColor: f.hex + "18" }}
            >
              <FlagSample hex={f.hex} w={14} h={12} />
              <span style={{ fontSize: 11, fontWeight: 600, color: f.hex }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}