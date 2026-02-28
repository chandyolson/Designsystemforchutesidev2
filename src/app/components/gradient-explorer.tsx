import {
  useGradient,
  topBarGradients,
  drawerGradients,
  type GradientOption,
} from "./gradient-context";

/* ─── Mini Top Bar Preview ─── */
function TopBarPreview({ gradient }: { gradient: GradientOption }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: gradient.css,
        padding: "14px 16px 16px",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[4px]">
          <span className="block rounded-full" style={{ width: 16, height: 1.5, backgroundColor: "#F0F0F0" }} />
          <span className="block rounded-full" style={{ width: 16, height: 1.5, backgroundColor: "#F0F0F0" }} />
          <span className="block rounded-full" style={{ width: 16, height: 1.5, backgroundColor: "#F0F0F0" }} />
        </div>
        <span
          className="text-[#F3D12A] font-['Open_Sans']"
          style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em" }}
        >
          CHUTESIDE
        </span>
      </div>
      <p
        className="text-white mt-2 uppercase font-['Open_Sans']"
        style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.10em", lineHeight: 1.2 }}
      >
        Animals
      </p>
      <p
        className="mt-0.5 font-['Open_Sans']"
        style={{ fontSize: 10, fontWeight: 500, color: "rgba(240,240,240,0.40)" }}
      >
        847 Total · 798 Active
      </p>
    </div>
  );
}

/* ─── Mini Drawer Preview ─── */
function DrawerPreview({ gradient }: { gradient: GradientOption }) {
  const items = ["Dashboard", "Animals", "Cow Work", "Calving", "Red Book", "Reference"];
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: gradient.css,
        height: 280,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="px-4 pt-5 pb-3">
        <p
          className="text-[#F3D12A] font-['Open_Sans']"
          style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.16em" }}
        >
          CHUTESIDE
        </p>
        <p
          className="mt-1 font-['Open_Sans']"
          style={{ fontSize: 10, fontWeight: 500, color: "#55BAAA", opacity: 0.7 }}
        >
          Saddle Butte Ranch
        </p>
      </div>
      <div className="mx-3 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
      <nav className="flex-1 py-2">
        {items.map((item, i) => {
          const isActive = i === 1;
          return (
            <div
              key={item}
              className="relative font-['Open_Sans']"
              style={{
                padding: "7px 16px",
                fontSize: 11,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#F3D12A" : "rgba(240,240,240,0.6)",
                backgroundColor: isActive ? "rgba(243,209,42,0.06)" : "transparent",
              }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-sm"
                  style={{ width: 2, height: 16, backgroundColor: "#F3D12A" }}
                />
              )}
              {item}
            </div>
          );
        })}
      </nav>
      <div>
        <div className="mx-3 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
        <div
          className="font-['Open_Sans']"
          style={{ padding: "10px 16px", fontSize: 10, fontWeight: 500, color: "rgba(240,240,240,0.3)" }}
        >
          Switch Operation
        </div>
      </div>
    </div>
  );
}

/* ─── Option Card ─── */
function OptionCard({
  gradient,
  selected,
  onSelect,
  preview,
}: {
  gradient: GradientOption;
  selected: boolean;
  onSelect: () => void;
  preview: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left cursor-pointer rounded-2xl transition-all duration-200"
      style={{
        border: selected ? "2px solid #55BAAA" : "2px solid transparent",
        backgroundColor: selected ? "rgba(85,186,170,0.06)" : "#FFFFFF",
        boxShadow: selected
          ? "0 2px 12px rgba(85,186,170,0.18)"
          : "0 1px 4px rgba(0,0,0,0.05)",
        padding: 10,
      }}
    >
      {preview}
      <div className="mt-2.5 px-1 pb-1">
        <div className="flex items-center gap-2">
          <span
            className="shrink-0 rounded-full border-2 flex items-center justify-center"
            style={{
              width: 18,
              height: 18,
              borderColor: selected ? "#55BAAA" : "#D4D4D0",
              backgroundColor: selected ? "#55BAAA" : "transparent",
            }}
          >
            {selected && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2.5 5L4.5 7L7.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <p
            className="font-['Open_Sans']"
            style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}
          >
            {gradient.label}
          </p>
        </div>
        <p
          className="font-['Open_Sans'] mt-1 ml-[26px]"
          style={{ fontSize: 11, fontWeight: 400, color: "#1A1A1A", opacity: 0.45 }}
        >
          {gradient.description}
        </p>
      </div>
    </button>
  );
}

/* ─── Section Heading ─── */
function SectionHeading({ text }: { text: string }) {
  return (
    <p
      className="uppercase font-['Open_Sans']"
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.12em",
        color: "#1A1A1A",
        opacity: 0.25,
      }}
    >
      {text}
    </p>
  );
}

/* ══════════════════════════════════════════
   MAIN EXPLORER
   ══════════════════════════════════════════ */
export function GradientExplorer() {
  const { topBarGradient, drawerGradient, setTopBarId, setDrawerId } = useGradient();

  return (
    <div className="space-y-8">
      {/* ── Active Selection Badge ── */}
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: "rgba(85,186,170,0.08)", border: "1px solid rgba(85,186,170,0.2)" }}
      >
        <div
          className="shrink-0 rounded-full flex items-center justify-center"
          style={{ width: 28, height: 28, backgroundColor: "#55BAAA" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="font-['Open_Sans']" style={{ fontSize: 11, fontWeight: 700, color: "#1A1A1A" }}>
            Live Preview Active
          </p>
          <p className="font-['Open_Sans']" style={{ fontSize: 10, fontWeight: 400, color: "#1A1A1A", opacity: 0.45 }}>
            Selections apply instantly to the top bar & side menu
          </p>
        </div>
      </div>

      {/* ── Current Selections ── */}
      <div className="flex items-center gap-3 px-1">
        <span
          className="font-['Open_Sans']"
          style={{ fontSize: 10, fontWeight: 600, color: "#55BAAA" }}
        >
          Top: {topBarGradient.label}
        </span>
        <span style={{ color: "#D4D4D0" }}>·</span>
        <span
          className="font-['Open_Sans']"
          style={{ fontSize: 10, fontWeight: 600, color: "#55BAAA" }}
        >
          Menu: {drawerGradient.label}
        </span>
      </div>

      {/* ── Top Bar Options ── */}
      <div className="space-y-3">
        <SectionHeading text="Top Bar Gradients" />
        <div className="grid grid-cols-2 gap-2.5">
          {topBarGradients.map((g) => (
            <OptionCard
              key={g.id}
              gradient={g}
              selected={topBarGradient.id === g.id}
              onSelect={() => setTopBarId(g.id)}
              preview={<TopBarPreview gradient={g} />}
            />
          ))}
        </div>
      </div>

      {/* ── Drawer Options ── */}
      <div className="space-y-3">
        <SectionHeading text="Side Menu Gradients" />
        <div className="grid grid-cols-2 gap-2.5">
          {drawerGradients.map((g) => (
            <OptionCard
              key={g.id}
              gradient={g}
              selected={drawerGradient.id === g.id}
              onSelect={() => setDrawerId(g.id)}
              preview={<DrawerPreview gradient={g} />}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
