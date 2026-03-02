import { useState } from "react";
import { SelectModeToggle } from "./select-mode-toggle";
import { SelectableCardWrapper } from "./selectable-card-wrapper";
import { AnimalListCard } from "./animal-list-card";
import { SelectAllBar } from "./select-all-bar";
import { BulkActionBar } from "./bulk-action-bar";

/* ── Tiny helpers ── */
function SectionHeading({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="shrink-0 text-[#0E2646] font-['Inter'] uppercase"
        style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}
      >
        {text}
      </span>
      <div className="flex-1 h-px bg-[#0E2646]/10" />
    </div>
  );
}

function StateLabel({ text }: { text: string }) {
  return (
    <span className="font-['Inter'] text-[#1A1A1A]/40" style={{ fontSize: 11, fontWeight: 600 }}>
      {text}
    </span>
  );
}

/* ── Explorer ── */
export function MassSelectExplorer() {
  const [interactive, setInteractive] = useState(false);
  const [demoSelections, setDemoSelections] = useState<Record<string, boolean>>({
    "a1": true,
    "a2": false,
    "a3": true,
  });

  const toggleDemo = (id: string) =>
    setDemoSelections((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6">
      {/* ═════════════════════════════════════════
          INTRO
         ══════════════════════════════════════════ */}
      <div
        className="rounded-xl px-4 py-3"
        style={{ background: "linear-gradient(135deg, #0E2646 0%, #162F52 100%)" }}
      >
        <p className="font-['Inter'] text-white" style={{ fontSize: 13, fontWeight: 700 }}>
          Mass Selection Components
        </p>
        <p className="font-['Inter'] text-white/50 mt-0.5" style={{ fontSize: 11, lineHeight: 1.5 }}>
          Used on Animals, Calving, Projects, and Red Book list screens.
        </p>
      </div>

      {/* ══════════════════════════════════════════
          COMPONENT A — Select Mode Toggle
         ══════════════════════════════════════════ */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ backgroundColor: "rgba(85,186,170,0.08)" }}>
        <span className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 13, fontWeight: 700 }}>
          Component A
        </span>
        <span className="font-['Inter'] text-[#1A1A1A]/45" style={{ fontSize: 12, fontWeight: 500 }}>
          Select Mode Toggle
        </span>
      </div>

      {/* ── Both states side-by-side ── */}
      <SectionHeading text="All States" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 p-5">
        <div className="flex items-start justify-around">
          <div className="flex flex-col items-center gap-3">
            <SelectModeToggle active={false} onToggle={() => {}} />
            <StateLabel text="Idle" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <SelectModeToggle active={true} onToggle={() => {}} />
            <StateLabel text="Active" />
          </div>
        </div>
      </div>

      <div className="bg-[#0E2646]/[0.04] rounded-xl px-4 py-3 space-y-1.5">
        <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 12, fontWeight: 700 }}>
          Component A — Select Mode Toggle
        </p>
        <p className="font-['Inter'] text-[#1A1A1A]/50" style={{ fontSize: 11, lineHeight: 1.55 }}>
          32px height button in the toolbar row that toggles mass selection mode. White background when
          idle with a subtle border and muted checkbox icon. Flips to solid navy with a yellow filled
          checkbox and white "Cancel" label when active. Designed to sit alongside the (+) add button
          and actions dropdown on all four list screens.
        </p>
      </div>

      {/* ── Interactive ── */}
      <SectionHeading text="Interactive Demo" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 p-5 flex flex-col items-center gap-4">
        <p className="font-['Inter'] text-[#1A1A1A]/45 text-center" style={{ fontSize: 12 }}>
          Tap to toggle between idle and active states
        </p>
        <SelectModeToggle active={interactive} onToggle={() => setInteractive((v) => !v)} />
        <span
          className="font-['Inter'] rounded-full px-3 py-1"
          style={{
            fontSize: 11,
            fontWeight: 700,
            backgroundColor: interactive ? "#0E2646" : "#F5F5F0",
            color: interactive ? "#F3D12A" : "#1A1A1A",
          }}
        >
          {interactive ? "SELECT MODE ON" : "NORMAL MODE"}
        </span>
      </div>

      {/* ── In-context: toolbar row mockups ── */}
      <SectionHeading text="In Toolbar Context" />

      {/* Animals toolbar mock */}
      <div className="space-y-1.5">
        <span className="font-['Inter'] text-[#1A1A1A]/35 uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em" }}>
          Animals Screen
        </span>
        <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 11, fontWeight: 600 }}>
              142 animals
            </p>
            <div className="flex items-center gap-2">
              <SelectModeToggle active={false} onToggle={() => {}} />
              {/* Yellow add button */}
              <button
                type="button"
                className="rounded-lg font-['Inter'] flex items-center justify-center"
                style={{
                  width: 32, height: 32, fontSize: 20, fontWeight: 400, lineHeight: 1,
                  color: "#1A1A1A", backgroundColor: "#F3D12A",
                  boxShadow: "0 2px 8px rgba(243,209,42,0.30)",
                }}
              >
                +
              </button>
              {/* 3-dot mock */}
              <div
                className="rounded-lg flex items-center justify-center"
                style={{ width: 32, height: 32, backgroundColor: "white", border: "1px solid rgba(14,38,70,0.12)" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="3.5" r="1.3" fill="#0E2646" />
                  <circle cx="8" cy="8" r="1.3" fill="#0E2646" />
                  <circle cx="8" cy="12.5" r="1.3" fill="#0E2646" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calving toolbar mock — active state */}
      <div className="space-y-1.5">
        <span className="font-['Inter'] text-[#1A1A1A]/35 uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em" }}>
          Calving Screen — Select Active
        </span>
        <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 11, fontWeight: 600 }}>
              23 records
            </p>
            <div className="flex items-center gap-2">
              <SelectModeToggle active={true} onToggle={() => {}} />
              {/* Yellow add button */}
              <button
                type="button"
                className="rounded-lg font-['Inter'] flex items-center justify-center"
                style={{
                  width: 32, height: 32, fontSize: 20, fontWeight: 400, lineHeight: 1,
                  color: "#1A1A1A", backgroundColor: "#F3D12A",
                  boxShadow: "0 2px 8px rgba(243,209,42,0.30)",
                }}
              >
                +
              </button>
              {/* 3-dot mock */}
              <div
                className="rounded-lg flex items-center justify-center"
                style={{ width: 32, height: 32, backgroundColor: "white", border: "1px solid rgba(14,38,70,0.12)" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="3.5" r="1.3" fill="#0E2646" />
                  <circle cx="8" cy="8" r="1.3" fill="#0E2646" />
                  <circle cx="8" cy="12.5" r="1.3" fill="#0E2646" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Red Book toolbar mock */}
      <div className="space-y-1.5">
        <span className="font-['Inter'] text-[#1A1A1A]/35 uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em" }}>
          Red Book Screen
        </span>
        <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 px-4 py-3">
          <div className="flex items-center justify-end gap-2">
            <SelectModeToggle active={false} onToggle={() => {}} />
            {/* Yellow add button */}
            <button
              type="button"
              className="rounded-lg font-['Inter'] flex items-center justify-center"
              style={{
                width: 38, height: 38, fontSize: 22, fontWeight: 400, lineHeight: 1,
                color: "#1A1A1A", backgroundColor: "#F3D12A",
                boxShadow: "0 2px 8px rgba(243,209,42,0.30)",
              }}
            >
              +
            </button>
            {/* 3-dot mock */}
            <div
              className="rounded-lg flex items-center justify-center"
              style={{ width: 38, height: 38, backgroundColor: "white", border: "1px solid rgba(14,38,70,0.12)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="3.5" r="1.3" fill="#0E2646" />
                <circle cx="8" cy="8" r="1.3" fill="#0E2646" />
                <circle cx="8" cy="12.5" r="1.3" fill="#0E2646" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Cow Work toolbar mock */}
      <div className="space-y-1.5">
        <span className="font-['Inter'] text-[#1A1A1A]/35 uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em" }}>
          Projects Screen
        </span>
        <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 px-4 py-3">
          <div className="flex items-center justify-end gap-2">
            <SelectModeToggle active={false} onToggle={() => {}} />
            {/* Yellow add button */}
            <button
              type="button"
              className="rounded-lg font-['Inter'] flex items-center justify-center"
              style={{
                width: 38, height: 38, fontSize: 22, fontWeight: 400, lineHeight: 1,
                color: "#1A1A1A", backgroundColor: "#F3D12A",
                boxShadow: "0 2px 8px rgba(243,209,42,0.30)",
              }}
            >
              +
            </button>
            {/* Filter mock */}
            <div
              className="rounded-lg flex items-center justify-center"
              style={{ width: 38, height: 38, backgroundColor: "white", border: "1px solid rgba(14,38,70,0.12)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4H14M4 8H12M6 12H10" stroke="#0E2646" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            {/* 3-dot mock */}
            <div
              className="rounded-lg flex items-center justify-center"
              style={{ width: 38, height: 38, backgroundColor: "white", border: "1px solid rgba(14,38,70,0.12)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="3.5" r="1.3" fill="#0E2646" />
                <circle cx="8" cy="8" r="1.3" fill="#0E2646" />
                <circle cx="8" cy="12.5" r="1.3" fill="#0E2646" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Specs ── */}
      <SectionHeading text="Specs" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
        {[
          ["Height", "32px"],
          ["Width", "auto (padding 0 12px)"],
          ["Border radius", "8px (rounded-lg)"],
          ["Idle bg", "white, border 1px rgba(14,38,70,0.12)"],
          ["Idle icon", "Checkbox-square outline, 14px, #0E2646 @ 40%"],
          ["Idle label", "\"Select\", Inter 12px/600, #0E2646 @ 50%"],
          ["Active bg", "#0E2646, border 1px #0E2646"],
          ["Active icon", "Filled checkbox + check, fill #F3D12A, stroke #0E2646"],
          ["Active label", "\"Cancel\", Inter 12px/600, white"],
          ["Transition", "150ms all, active:scale-[0.97]"],
          ["Gap", "6px (gap-1.5) between icon & label"],
          ["Screens", "Animals, Calving, Projects, Red Book"],
        ].map(([label, val]) => (
          <div key={label} className="flex items-start px-4 py-2.5">
            <span
              className="font-['Inter'] shrink-0 text-[#1A1A1A]/40"
              style={{ fontSize: 11, fontWeight: 600, width: 100 }}
            >
              {label}
            </span>
            <span
              className="font-['Inter'] text-[#1A1A1A]"
              style={{ fontSize: 11, fontWeight: 500 }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          COMPONENT B — List Row with Checkbox
         ══════════════════════════════════════════ */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ backgroundColor: "rgba(85,186,170,0.08)" }}>
        <span className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 13, fontWeight: 700 }}>
          Component B
        </span>
        <span className="font-['Inter'] text-[#1A1A1A]/45" style={{ fontSize: 12, fontWeight: 500 }}>
          List Row with Checkbox
        </span>
      </div>

      {/* ── Static demo: 3 cards ── */}
      <SectionHeading text="Checked / Unchecked States" />

      <div
        className="rounded-2xl py-4 space-y-2.5"
        style={{ backgroundColor: "#F5F5F0" }}
      >
        {/* Card 1 — Checked */}
        <SelectableCardWrapper selected={true} onToggle={() => {}}>
          <AnimalListCard
            tag="#2847"
            flag="teal"
            typePill="Cow"
            values={["Angus", "5 yrs", "Bred", "Pasture 3"]}
          />
        </SelectableCardWrapper>

        {/* Card 2 — Unchecked */}
        <SelectableCardWrapper selected={false} onToggle={() => {}}>
          <AnimalListCard
            tag="#1923"
            typePill="Heifer"
            values={["Hereford", "2 yrs", "Open", "Pasture 1"]}
          />
        </SelectableCardWrapper>

        {/* Card 3 — Checked */}
        <SelectableCardWrapper selected={true} onToggle={() => {}}>
          <AnimalListCard
            tag="#3056"
            flag="gold"
            typePill="Bull"
            values={["Charolais", "4 yrs", "Active", "Pasture 7"]}
          />
        </SelectableCardWrapper>
      </div>

      <div className="bg-[#0E2646]/[0.04] rounded-xl px-4 py-3 space-y-1.5">
        <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 12, fontWeight: 700 }}>
          Component B — Selectable Card Wrapper
        </p>
        <p className="font-['Inter'] text-[#1A1A1A]/50" style={{ fontSize: 11, lineHeight: 1.55 }}>
          Wraps any existing list card (AnimalListCard, CalvingRecordCard, etc.) with
          a left-aligned 22px checkbox. Checked cards get a teal-filled checkbox with a
          white checkmark, a 2px teal left border, and a very subtle teal gradient tint.
          Unchecked cards show an empty bordered checkbox with the card at normal appearance.
        </p>
      </div>

      {/* ── Interactive card list ── */}
      <SectionHeading text="Interactive Demo" />

      <div
        className="rounded-2xl py-4 space-y-2.5"
        style={{ backgroundColor: "#F5F5F0" }}
      >
        <SelectableCardWrapper selected={!!demoSelections["a1"]} onToggle={() => toggleDemo("a1")}>
          <AnimalListCard
            tag="#2847"
            flag="teal"
            typePill="Cow"
            values={["Angus", "5 yrs", "Bred", "Pasture 3"]}
          />
        </SelectableCardWrapper>
        <SelectableCardWrapper selected={!!demoSelections["a2"]} onToggle={() => toggleDemo("a2")}>
          <AnimalListCard
            tag="#1923"
            typePill="Heifer"
            values={["Hereford", "2 yrs", "Open", "Pasture 1"]}
          />
        </SelectableCardWrapper>
        <SelectableCardWrapper selected={!!demoSelections["a3"]} onToggle={() => toggleDemo("a3")}>
          <AnimalListCard
            tag="#3056"
            flag="gold"
            typePill="Bull"
            values={["Charolais", "4 yrs", "Active", "Pasture 7"]}
          />
        </SelectableCardWrapper>
      </div>

      <div className="flex items-center justify-center">
        <span
          className="font-['Inter'] rounded-full px-3 py-1"
          style={{
            fontSize: 11,
            fontWeight: 700,
            backgroundColor: "#0E2646",
            color: "#55BAAA",
          }}
        >
          {Object.values(demoSelections).filter(Boolean).length} of 3 selected
        </span>
      </div>

      {/* ── Checkbox anatomy ── */}
      <SectionHeading text="Checkbox Anatomy" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 p-5">
        <div className="flex items-start justify-around">
          {/* Unchecked */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: "1.5px solid #D4D4D0",
                backgroundColor: "transparent",
              }}
            />
            <StateLabel text="Unchecked" />
          </div>
          {/* Checked */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: "1.5px solid #55BAAA",
                backgroundColor: "#55BAAA",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <StateLabel text="Checked" />
          </div>
          {/* Scaled up 3x for detail */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                border: "3px solid #55BAAA",
                backgroundColor: "#55BAAA",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <StateLabel text="2x Detail" />
          </div>
        </div>
      </div>

      {/* ── Specs B ── */}
      <SectionHeading text="Specs" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
        {[
          ["Checkbox size", "22px square"],
          ["Border radius", "6px (rounded-md)"],
          ["Position", "8px from left edge, vertically centered"],
          ["Unchecked", "border 1.5px #D4D4D0, bg transparent"],
          ["Checked bg", "#55BAAA"],
          ["Checked border", "1.5px #55BAAA"],
          ["Checkmark", "White, 12px, 1.8px stroke"],
          ["Card shift", "flex row with gap-2 (8px)"],
          ["Selected card", "2px left border #55BAAA, subtle teal tint"],
          ["Tap target", "Checkbox button, stopPropagation"],
          ["Transition", "150ms, active:scale-[0.92]"],
        ].map(([label, val]) => (
          <div key={label} className="flex items-start px-4 py-2.5">
            <span
              className="font-['Inter'] shrink-0 text-[#1A1A1A]/40"
              style={{ fontSize: 11, fontWeight: 600, width: 100 }}
            >
              {label}
            </span>
            <span
              className="font-['Inter'] text-[#1A1A1A]"
              style={{ fontSize: 11, fontWeight: 500 }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          COMPONENT C — Select All Bar
         ══════════════════════════════════════════ */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ backgroundColor: "rgba(85,186,170,0.08)" }}>
        <span className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 13, fontWeight: 700 }}>
          Component C
        </span>
        <span className="font-['Inter'] text-[#1A1A1A]/45" style={{ fontSize: 12, fontWeight: 500 }}>
          Select All Bar
        </span>
      </div>

      {/* ── Static states ── */}
      <SectionHeading text="All States" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 p-4 space-y-4">
        <div className="space-y-1.5">
          <StateLabel text="Partial selection (3 of 47)" />
          <SelectAllBar selectedCount={3} totalCount={47} onToggleAll={() => {}} />
        </div>
        <div className="space-y-1.5">
          <StateLabel text="None selected (0 of 47)" />
          <SelectAllBar selectedCount={0} totalCount={47} onToggleAll={() => {}} />
        </div>
        <div className="space-y-1.5">
          <StateLabel text="All selected (47 of 47)" />
          <SelectAllBar selectedCount={47} totalCount={47} onToggleAll={() => {}} />
        </div>
      </div>

      <div className="bg-[#0E2646]/[0.04] rounded-xl px-4 py-3 space-y-1.5">
        <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 12, fontWeight: 700 }}>
          Component C — Select All Bar
        </p>
        <p className="font-['Inter'] text-[#1A1A1A]/50" style={{ fontSize: 11, lineHeight: 1.55 }}>
          Appears at the top of the list when select mode is active. Full-width, 36px
          height, 5% navy background with rounded-lg corners. Left side shows a teal
          "Select All" text link (flips to "Deselect All" when all items are selected).
          Right side shows a muted "X of Y selected" count at 40% opacity.
        </p>
      </div>

      {/* ── Interactive: combined A + C + B ── */}
      <SectionHeading text="Interactive Demo — Full Stack" />

      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#F5F5F0" }}
      >
        {/* Toolbar with toggle */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between">
            <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 11, fontWeight: 600 }}>
              47 animals
            </p>
            <div className="flex items-center gap-2">
              <SelectModeToggle active={true} onToggle={() => {}} />
            </div>
          </div>
        </div>

        {/* Select All Bar */}
        <div className="px-3 pb-2">
          <SelectAllBar
            selectedCount={Object.values(demoSelections).filter(Boolean).length}
            totalCount={3}
            onToggleAll={() => {
              const allSelected = Object.values(demoSelections).every(Boolean);
              setDemoSelections({
                a1: !allSelected,
                a2: !allSelected,
                a3: !allSelected,
              });
            }}
          />
        </div>

        {/* Card list */}
        <div className="pb-4 space-y-2.5">
          <SelectableCardWrapper selected={!!demoSelections["a1"]} onToggle={() => toggleDemo("a1")}>
            <AnimalListCard
              tag="#2847"
              flag="teal"
              typePill="Cow"
              values={["Angus", "5 yrs", "Bred", "Pasture 3"]}
            />
          </SelectableCardWrapper>
          <SelectableCardWrapper selected={!!demoSelections["a2"]} onToggle={() => toggleDemo("a2")}>
            <AnimalListCard
              tag="#1923"
              typePill="Heifer"
              values={["Hereford", "2 yrs", "Open", "Pasture 1"]}
            />
          </SelectableCardWrapper>
          <SelectableCardWrapper selected={!!demoSelections["a3"]} onToggle={() => toggleDemo("a3")}>
            <AnimalListCard
              tag="#3056"
              flag="gold"
              typePill="Bull"
              values={["Charolais", "4 yrs", "Active", "Pasture 7"]}
            />
          </SelectableCardWrapper>
        </div>
      </div>

      {/* ── Specs C ── */}
      <SectionHeading text="Specs" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
        {[
          ["Height", "36px"],
          ["Width", "full width"],
          ["Background", "rgba(14,38,70,0.05) — #0E2646 at 5%"],
          ["Border radius", "8px (rounded-lg)"],
          ["Padding", "0 12px (px-3)"],
          ["Left text", "\"Select All\" / \"Deselect All\""],
          ["Left style", "Inter 13px/600, color #55BAAA"],
          ["Right text", "\"{n} of {total} selected\""],
          ["Right style", "Inter 12px/500, rgba(26,26,26,0.40)"],
          ["Toggle logic", "All selected → show Deselect All"],
          ["Placement", "Below toolbar, above card list"],
        ].map(([label, val]) => (
          <div key={label} className="flex items-start px-4 py-2.5">
            <span
              className="font-['Inter'] shrink-0 text-[#1A1A1A]/40"
              style={{ fontSize: 11, fontWeight: 600, width: 100 }}
            >
              {label}
            </span>
            <span
              className="font-['Inter'] text-[#1A1A1A]"
              style={{ fontSize: 11, fontWeight: 500 }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          COMPONENT D — Bulk Action Bar
         ══════════════════════════════════════════ */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ backgroundColor: "rgba(85,186,170,0.08)" }}>
        <span className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 13, fontWeight: 700 }}>
          Component D
        </span>
        <span className="font-['Inter'] text-[#1A1A1A]/45" style={{ fontSize: 12, fontWeight: 500 }}>
          Bulk Action Bar
        </span>
      </div>

      {/* ── Static: bar alone ── */}
      <SectionHeading text="Standalone" />

      <div className="rounded-2xl overflow-hidden border border-[#D4D4D0]/60">
        <BulkActionBar selectedCount={3} onFlag={() => {}} onEdit={() => {}} onDelete={() => {}} />
      </div>

      <div className="bg-[#0E2646]/[0.04] rounded-xl px-4 py-3 space-y-1.5">
        <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 12, fontWeight: 700 }}>
          Component D — Bulk Action Bar
        </p>
        <p className="font-['Inter'] text-[#1A1A1A]/50" style={{ fontSize: 11, lineHeight: 1.55 }}>
          Fixed at the bottom of the screen when 1+ items are selected. Navy background
          with 16px top-left/right radius and upward shadow. Top row shows the selection
          count in white @ 60%. Bottom row has three flex-1 pill buttons: Flag (teal),
          Edit (gold), and Delete (red) — each with a 15% tinted background and matching
          icon + label.
        </p>
      </div>

      {/* ── Variation: different counts ── */}
      <SectionHeading text="Count Variations" />

      <div className="space-y-3">
        <div className="space-y-1.5">
          <StateLabel text="1 animal selected" />
          <div className="rounded-2xl overflow-hidden border border-[#D4D4D0]/60">
            <BulkActionBar selectedCount={1} itemLabel="animal" onFlag={() => {}} onEdit={() => {}} onDelete={() => {}} />
          </div>
        </div>
        <div className="space-y-1.5">
          <StateLabel text="12 animals selected" />
          <div className="rounded-2xl overflow-hidden border border-[#D4D4D0]/60">
            <BulkActionBar selectedCount={12} onFlag={() => {}} onEdit={() => {}} onDelete={() => {}} />
          </div>
        </div>
        <div className="space-y-1.5">
          <StateLabel text="47 records selected (Calving context)" />
          <div className="rounded-2xl overflow-hidden border border-[#D4D4D0]/60">
            <BulkActionBar selectedCount={47} itemLabel="records" onFlag={() => {}} onEdit={() => {}} onDelete={() => {}} />
          </div>
        </div>
      </div>

      {/* ── In-context: full screen mockup ── */}
      <SectionHeading text="In-Context — Animals List Screen" />

      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#F5F5F0", height: 480 }}
      >
        {/* Fake header bar */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #0E2646 0%, #162F52 100%)" }}
        >
          <span className="font-['Inter'] text-white" style={{ fontSize: 15, fontWeight: 700 }}>
            Animals
          </span>
          <span className="font-['Inter'] text-white/40" style={{ fontSize: 11, fontWeight: 500 }}>
            ChuteSide
          </span>
        </div>

        {/* Toolbar row */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between">
            <p className="text-[#1A1A1A]/30 font-['Inter']" style={{ fontSize: 11, fontWeight: 600 }}>
              47 animals
            </p>
            <div className="flex items-center gap-2">
              <SelectModeToggle active={true} onToggle={() => {}} />
              <button
                type="button"
                className="rounded-lg font-['Inter'] flex items-center justify-center"
                style={{
                  width: 32, height: 32, fontSize: 20, fontWeight: 400, lineHeight: 1,
                  color: "#1A1A1A", backgroundColor: "#F3D12A",
                  boxShadow: "0 2px 8px rgba(243,209,42,0.30)",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Select All Bar */}
        <div className="px-3 pb-2">
          <SelectAllBar selectedCount={3} totalCount={47} onToggleAll={() => {}} />
        </div>

        {/* Card list — scrollable area */}
        <div className="space-y-2.5 pb-28">
          <SelectableCardWrapper selected={true} onToggle={() => {}}>
            <AnimalListCard tag="#2847" flag="teal" typePill="Cow" values={["Angus", "5 yrs", "Bred", "Pasture 3"]} />
          </SelectableCardWrapper>
          <SelectableCardWrapper selected={false} onToggle={() => {}}>
            <AnimalListCard tag="#1923" typePill="Heifer" values={["Hereford", "2 yrs", "Open", "Pasture 1"]} />
          </SelectableCardWrapper>
          <SelectableCardWrapper selected={true} onToggle={() => {}}>
            <AnimalListCard tag="#3056" flag="gold" typePill="Bull" values={["Charolais", "4 yrs", "Active", "Pasture 7"]} />
          </SelectableCardWrapper>
          <SelectableCardWrapper selected={true} onToggle={() => {}}>
            <AnimalListCard tag="#4102" flag="red" typePill="Cow" values={["Simmental", "7 yrs", "Bred", "Pasture 5"]} />
          </SelectableCardWrapper>
        </div>

        {/* Bulk Action Bar — fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <BulkActionBar selectedCount={3} onFlag={() => {}} onEdit={() => {}} onDelete={() => {}} />
        </div>
      </div>

      {/* ── Specs D ── */}
      <SectionHeading text="Specs" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
        {[
          ["Position", "Fixed bottom of screen"],
          ["Background", "#0E2646"],
          ["Border radius", "16px top-left/right, 0 bottom"],
          ["Shadow", "0 -4px 20px rgba(14,38,70,0.20)"],
          ["Padding", "12px 20px"],
          ["Count text", "Inter 13px/600, white @ 60%"],
          ["Button height", "40px, rounded-full"],
          ["Button layout", "flex, gap 10px, flex-1 each"],
          ["Flag btn", "bg rgba(85,186,170,0.15), text #55BAAA"],
          ["Edit btn", "bg rgba(243,209,42,0.15), text #F3D12A"],
          ["Delete btn", "bg rgba(231,76,60,0.15), text #E74C3C"],
          ["Icons", "14px, matching text color"],
          ["Visibility", "Shown when selectedCount ≥ 1"],
        ].map(([label, val]) => (
          <div key={label} className="flex items-start px-4 py-2.5">
            <span
              className="font-['Inter'] shrink-0 text-[#1A1A1A]/40"
              style={{ fontSize: 11, fontWeight: 600, width: 100 }}
            >
              {label}
            </span>
            <span
              className="font-['Inter'] text-[#1A1A1A]"
              style={{ fontSize: 11, fontWeight: 500 }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}