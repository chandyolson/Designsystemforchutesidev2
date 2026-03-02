import { useState } from "react";
import { FloatingMicButton, type MicState } from "./floating-mic-button";
import { InlineMicButton } from "./inline-mic-button";
import { VoiceFilledFieldStatic, VoiceFilledField } from "./voice-filled-field";
import { VoiceFilledSelectRow } from "./voice-filled-select";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { useVoiceAutoFill } from "./hooks/use-voice-auto-fill";
import type { VoiceParseResult } from "./hooks/use-voice-auto-fill";
import { Mic } from "lucide-react";

export function VoiceInputExplorer() {
  /* Live demo state cycling */
  const [liveState, setLiveState] = useState<MicState>("idle");

  const cycleLive = () => {
    if (liveState === "idle") {
      setLiveState("recording");
      setTimeout(() => {
        setLiveState("processing");
        setTimeout(() => setLiveState("idle"), 2200);
      }, 3000);
    }
  };

  /* Component C — interactive demo */
  const [fillDemo, setFillDemo] = useState<"idle" | "filled">("idle");
  const triggerFill = () => {
    if (fillDemo === "idle") setFillDemo("filled");
  };
  const onFillEnd = () => setFillDemo("idle");

  /* ── End-to-End Flow — useVoiceAutoFill hook ── */
  const SIMULATED_PARSE: VoiceParseResult[] = [
    { key: "damTag", value: "4782" },
    { key: "calfTag", value: "8851" },
    { key: "tagColor", value: "Yellow" },
    { key: "sex", value: "Heifer Calf" },
    { key: "status", value: "Alive" },
  ];
  const SIMULATED_TRANSCRIPT =
    "dam tag forty seven eighty two calf tag eighty eight fifty one yellow heifer calf alive";

  const e2e = useVoiceAutoFill(
    {
      damTag: "",
      calfTag: "",
      tagColor: "",
      sex: "",
      status: "",
      sire: "",
    },
    { staggerDelay: 150, highlightDuration: 2200 }
  );

  const startE2E = () => {
    if (!e2e.isActive) {
      e2e.reset();
      setTimeout(() => e2e.start(SIMULATED_PARSE, SIMULATED_TRANSCRIPT), 50);
    }
  };

  return (
    <div className="space-y-6">
      {/* ════════════════════════════════════════════
          SECTION 1 — Three states side-by-side
         ════════════════════════════════════════════ */}
      <SectionHeading text="Floating Mic — All States" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 p-5">
        <div className="flex items-start justify-around">
          <div className="flex flex-col items-center gap-3">
            <FloatingMicButton state="idle" demo />
            <StateLabel text="Idle" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <FloatingMicButton state="recording" demo />
            <StateLabel text="Recording" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <FloatingMicButton state="processing" demo />
            <StateLabel text="Processing" />
          </div>
        </div>
      </div>

      <div className="bg-[#0E2646]/[0.04] rounded-xl px-4 py-3 space-y-1.5">
        <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 12, fontWeight: 700 }}>
          Component A — Floating Mic Button
        </p>
        <p className="font-['Inter'] text-[#1A1A1A]/50" style={{ fontSize: 11, lineHeight: 1.55 }}>
          60px circle, fixed bottom-right (20px inset). Navy idle → red recording with 72px pulse ring → navy processing with spinner. Designed for gloved hands and bright sunlight — high contrast, large touch target.
        </p>
      </div>

      {/* ════════════════════════════════════════════
          SECTION 2 — Interactive demo
         ════════════════════════════════════════════ */}
      <SectionHeading text="Interactive Demo" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 p-5 flex flex-col items-center gap-4">
        <p className="font-['Inter'] text-[#1A1A1A]/45 text-center" style={{ fontSize: 12 }}>
          Tap the mic to see idle → recording → processing → idle
        </p>
        <FloatingMicButton state={liveState} onClick={cycleLive} demo />
        <span
          className="font-['Inter'] rounded-full px-3 py-1"
          style={{
            fontSize: 11,
            fontWeight: 700,
            backgroundColor:
              liveState === "idle" ? "#0E2646" : liveState === "recording" ? "#E74C3C" : "#55BAAA",
            color: "#FFFFFF",
          }}
        >
          {liveState.toUpperCase()}
        </span>
      </div>

      {/* ════════════════════════════════════════════
          SECTION 3 — Overlaid on calving form
         ════════════════════════════════════════════ */}
      <SectionHeading text="On Calving Entry Form" />

      <div
        className="relative rounded-2xl border border-[#D4D4D0]/60 overflow-hidden"
        style={{ height: 520, backgroundColor: "#FFFDF5" }}
      >
        <div className="px-4 pt-4 space-y-4 overflow-hidden">
          <div
            className="rounded-xl px-4 py-3 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #0E2646 0%, #162F52 100%)" }}
          >
            <div className="flex items-center gap-2.5">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11.25 4.5L6.75 9L11.25 13.5" stroke="rgba(240,240,240,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-['Inter'] text-white" style={{ fontSize: 16, fontWeight: 700 }}>
                New Calf
              </span>
            </div>
          </div>

          <div
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-['Inter']"
            style={{ backgroundColor: "rgba(14,38,70,0.06)" }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(26,26,26,0.45)" }}>Calving Date</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0E2646" }}>Mar 1, 2026</span>
          </div>

          <div className="flex border-b border-[#D4D4D0]/50 -mx-4 px-4">
            <div className="flex-1 pb-3 relative text-center">
              <span className="font-['Inter']" style={{ fontSize: 14, fontWeight: 700, color: "#0E2646" }}>Entry</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full" style={{ width: 48, height: 3, backgroundColor: "#F3D12A" }} />
            </div>
            <div className="flex-1 pb-3 text-center">
              <span className="font-['Inter']" style={{ fontSize: 14, fontWeight: 500, color: "rgba(26,26,26,0.35)" }}>Dam Info</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <FormFieldRow label="Dam Tag" value="4782" placeholder="Scan or enter dam tag" />
            <FormFieldRow label="Calf Tag" value="26-003" placeholder="Calf tag number" />
            <FormSelectRow label="Tag Color" value="Yellow" options={["Pink", "Yellow", "Orange", "Green", "Blue", "White", "Red", "Purple", "No Tag"]} />
            <FormSelectRow label="Sex" value="Heifer Calf" options={["Bull Calf", "Heifer Calf"]} />
            <FormSelectRow label="Status" value="Alive" options={["Alive", "Dead", "Assisted"]} />
            <FormFieldRow label="Sire" value="" placeholder="Sire tag or name" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 80, background: "linear-gradient(to top, #FFFDF5 20%, transparent)" }} />

        <div className="absolute flex flex-col items-center" style={{ bottom: 20, right: 20, zIndex: 10 }}>
          <FloatingMicButton state="idle" demo />
        </div>
      </div>

      <div className="bg-[#0E2646]/[0.04] rounded-xl px-4 py-3 space-y-1.5">
        <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 12, fontWeight: 700 }}>Field Positioning</p>
        <p className="font-['Inter'] text-[#1A1A1A]/50" style={{ fontSize: 11, lineHeight: 1.55 }}>
          Fixed 20px from bottom-right edge. Always visible over scroll content. 60px diameter provides a &gt;44pt touch target for gloved operation. Navy/yellow idle state maintains high visibility in direct sunlight; red recording state is unmistakable even at peripheral glance.
        </p>
      </div>

      {/* ════════════════════════════════════════════
          SECTION 4 — Specs table
         ════════════════════════════════════════════ */}
      <SectionHeading text="Specs" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
        {[
          ["Size", "60px diameter (72px pulse ring)"],
          ["Position", "fixed, bottom 20px, right 20px"],
          ["Z-index", "70 (above content & nav)"],
          ["Idle bg", "#0E2646 → mic #F3D12A"],
          ["Recording bg", "#E74C3C → mic white"],
          ["Processing bg", "#0E2646 → spinner #F3D12A"],
          ["Shadow", "0 6px 20px rgba(14,38,70,0.30)"],
          ["Touch target", "60px (>44pt minimum)"],
        ].map(([label, val]) => (
          <div key={label} className="flex items-start px-4 py-2.5">
            <span className="font-['Inter'] shrink-0 text-[#1A1A1A]/40" style={{ fontSize: 11, fontWeight: 600, width: 100 }}>{label}</span>
            <span className="font-['Inter'] text-[#1A1A1A]" style={{ fontSize: 11, fontWeight: 500 }}>{val}</span>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════
          COMPONENT B — Inline Mic Button
         ════════════════════════════════════════════════ */}
      <div className="pt-4">
        <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ backgroundColor: "rgba(85,186,170,0.08)" }}>
          <span className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 13, fontWeight: 700 }}>Component B</span>
          <span className="font-['Inter'] text-[#1A1A1A]/45" style={{ fontSize: 12, fontWeight: 500 }}>Inline Mic — Level 1 Dictation</span>
        </div>
      </div>

      <SectionHeading text="Inline Mic — All States" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 p-5">
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center gap-3">
            <InlineMicButton state="idle" />
            <StateLabel text="Idle" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <InlineMicButton state="recording" />
            <StateLabel text="Recording" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <InlineMicButton state="processing" />
            <StateLabel text="Processing" />
          </div>
        </div>
      </div>

      <div className="bg-[#0E2646]/[0.04] rounded-xl px-4 py-3 space-y-1.5">
        <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 12, fontWeight: 700 }}>Component B — Inline Mic Button</p>
        <p className="font-['Inter'] text-[#1A1A1A]/50" style={{ fontSize: 11, lineHeight: 1.55 }}>
          32px circle, positioned inside or beside individual text fields. Navy/yellow idle → red recording with 38px thin pulse ring → navy processing with 12px spinner. Single-field dictation for hands-busy use — tap field mic, speak value, done.
        </p>
      </div>

      {/* ── Notes Textarea with Inline Mic — All 3 States ── */}
      <SectionHeading text="Notes Field — All States" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 p-4 space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[#1A1A1A] font-['Inter']" style={{ fontSize: 14, fontWeight: 600 }}>Notes</p>
            <InlineMicButton state="idle" />
          </div>
          <textarea
            readOnly
            value=""
            placeholder="Calving notes…"
            className="w-full h-[88px] px-3 py-2.5 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none resize-none"
            style={{ fontSize: 16, fontWeight: 400 }}
          />
          <StateLabel text="Idle — mic ready, no dictation" />
        </div>

        <div className="h-px bg-[#D4D4D0]/40" />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[#1A1A1A] font-['Inter']" style={{ fontSize: 14, fontWeight: 600 }}>Notes</p>
            <InlineMicButton state="recording" />
          </div>
          <textarea
            readOnly
            value="Pulled calf, breach presentation. Cow slow to..."
            className="w-full h-[88px] px-3 py-2.5 rounded-lg bg-white border border-[#E74C3C] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none resize-none ring-2 ring-[#E74C3C]/15"
            style={{ fontSize: 16, fontWeight: 400 }}
          />
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#E74C3C", animation: "inlineMicPulse 1.4s ease-in-out infinite" }} />
            <span className="font-['Inter'] text-[#E74C3C]" style={{ fontSize: 11, fontWeight: 600 }}>Listening — speak into mic</span>
          </div>
        </div>

        <div className="h-px bg-[#D4D4D0]/40" />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[#1A1A1A] font-['Inter']" style={{ fontSize: 14, fontWeight: 600 }}>Notes</p>
            <InlineMicButton state="processing" />
          </div>
          <textarea
            readOnly
            value="Pulled calf, breach presentation. Cow slow to mother — gave 30 min before intervening."
            className="w-full h-[88px] px-3 py-2.5 rounded-lg bg-white border border-[#55BAAA] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none resize-none ring-2 ring-[#55BAAA]/15"
            style={{ fontSize: 16, fontWeight: 400 }}
          />
          <div className="flex items-center gap-2">
            <span className="font-['Inter'] text-[#55BAAA]" style={{ fontSize: 11, fontWeight: 600 }}>Processing transcription…</span>
          </div>
        </div>
      </div>

      {/* ── Inline Mic Specs ── */}
      <SectionHeading text="Inline Mic Specs" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
        {[
          ["Size", "32px diameter (38px pulse ring)"],
          ["Position", "Right of label / inside field"],
          ["Idle bg", "#0E2646 → mic 14px #F3D12A"],
          ["Recording bg", "#E74C3C → mic 14px white"],
          ["Processing bg", "#0E2646 → spinner 12px #F3D12A"],
          ["Ring", "38px, 1.5px border, #E74C3C/30%"],
          ["Touch target", "38px (pulse ring area)"],
          ["Use case", "Single-field dictation"],
        ].map(([label, val]) => (
          <div key={label} className="flex items-start px-4 py-2.5">
            <span className="font-['Inter'] shrink-0 text-[#1A1A1A]/40" style={{ fontSize: 11, fontWeight: 600, width: 100 }}>{label}</span>
            <span className="font-['Inter'] text-[#1A1A1A]" style={{ fontSize: 11, fontWeight: 500 }}>{val}</span>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════
          COMPONENT C — Voice Filled Field
         ════════════════════════════════════════════════ */}
      <div className="pt-4">
        <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ backgroundColor: "rgba(85,186,170,0.08)" }}>
          <span className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 13, fontWeight: 700 }}>Component C</span>
          <span className="font-['Inter'] text-[#1A1A1A]/45" style={{ fontSize: 12, fontWeight: 500 }}>Voice Auto-Fill Indicator</span>
        </div>
      </div>

      <SectionHeading text="Voice-filled field indicator vs normal field" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 p-4 space-y-4">
        <div className="space-y-1.5">
          <span className="font-['Inter'] text-[#F3D12A] flex items-center gap-1.5" style={{ fontSize: 11, fontWeight: 700 }}>
            <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#F3D12A" /></svg>
            Voice-filled
          </span>
          <VoiceFilledFieldStatic label="Calf Tag" value="8851" highlighted />
        </div>
        <div className="h-px bg-[#D4D4D0]/40" />
        <div className="space-y-1.5">
          <span className="font-['Inter'] text-[#1A1A1A]/35 flex items-center gap-1.5" style={{ fontSize: 11, fontWeight: 700 }}>
            <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#D4D4D0" /></svg>
            Normal field
          </span>
          <FormFieldRow label="Calf Tag" value="8851" placeholder="Calf tag number" />
        </div>
      </div>

      <div className="bg-[#0E2646]/[0.04] rounded-xl px-4 py-3 space-y-1.5">
        <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 12, fontWeight: 700 }}>Component C — Voice Auto-Fill Indicator</p>
        <p className="font-['Inter'] text-[#1A1A1A]/50" style={{ fontSize: 11, lineHeight: 1.55 }}>
          When voice parsing fills a field, the input gets a subtle yellow background flash (#F3D12A at 8% opacity), a 2px left border accent (#F3D12A), and a 12px mic icon in the top-right corner that fades out. Entire treatment auto-dismisses after ~2.2s.
        </p>
      </div>

      <SectionHeading text="Interactive Demo" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 p-4 space-y-4">
        <p className="font-['Inter'] text-[#1A1A1A]/45 text-center" style={{ fontSize: 12 }}>
          Tap the button to simulate a voice auto-fill
        </p>
        <VoiceFilledField label="Calf Tag" value="8851" state={fillDemo} onAnimationEnd={onFillEnd} placeholder="Calf tag number" />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={triggerFill}
            className="px-4 py-2 rounded-lg cursor-pointer font-['Inter'] transition-all active:scale-95"
            style={{
              fontSize: 12,
              fontWeight: 700,
              backgroundColor: fillDemo === "idle" ? "#0E2646" : "#D4D4D0",
              color: fillDemo === "idle" ? "#F3D12A" : "#1A1A1A",
            }}
          >
            {fillDemo === "idle" ? "Simulate Voice Fill" : "Animating…"}
          </button>
        </div>
      </div>

      <SectionHeading text="Auto-Fill Indicator Specs" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
        {[
          ["Background", "rgba(243,209,42, 0.08)"],
          ["Left border", "2px solid #F3D12A"],
          ["Mic icon", "12px, #F3D12A, top-right"],
          ["Fade-out", "0.6s ease-out"],
          ["Total duration", "~2.2s then revert"],
          ["Use case", "Post-voice field confirmation"],
        ].map(([label, val]) => (
          <div key={label} className="flex items-start px-4 py-2.5">
            <span className="font-['Inter'] shrink-0 text-[#1A1A1A]/40" style={{ fontSize: 11, fontWeight: 600, width: 100 }}>{label}</span>
            <span className="font-['Inter'] text-[#1A1A1A]" style={{ fontSize: 11, fontWeight: 500 }}>{val}</span>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          END-TO-END FLOW — Mic → Record → Parse → Staggered Fill
         ════════════════════════════════════════════════════════ */}
      <div className="pt-6">
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: "linear-gradient(135deg, #0E2646 0%, #162F52 100%)" }}
        >
          <p className="font-['Inter'] text-white" style={{ fontSize: 13, fontWeight: 700 }}>End-to-End Flow</p>
          <p className="font-['Inter'] text-white/50 mt-0.5" style={{ fontSize: 11, lineHeight: 1.5 }}>
            Floating mic → recording → processing → staggered field auto-fill
          </p>
        </div>
      </div>

      <SectionHeading text="Voice Auto-Fill Demo" />

      <div className="relative rounded-2xl border border-[#D4D4D0]/60 overflow-hidden" style={{ backgroundColor: "#FFFDF5" }}>
        {/* Header bar */}
        <div className="px-4 pt-4 pb-0">
          <div
            className="rounded-xl px-4 py-3 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #0E2646 0%, #162F52 100%)" }}
          >
            <div className="flex items-center gap-2.5">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11.25 4.5L6.75 9L11.25 13.5" stroke="rgba(240,240,240,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-['Inter'] text-white" style={{ fontSize: 16, fontWeight: 700 }}>New Calf</span>
            </div>
            <span
              className="font-['Inter'] rounded-full px-2 py-0.5"
              style={{ fontSize: 10, fontWeight: 700, backgroundColor: "rgba(243,209,42,0.15)", color: "#F3D12A" }}
            >
              VOICE
            </span>
          </div>
        </div>

        {/* Live transcript bar */}
        {(e2e.micState === "recording" || e2e.micState === "processing") && (
          <div className="px-4 pt-3">
            <div
              className="rounded-lg px-3 py-2.5 font-['Inter']"
              style={{
                backgroundColor: e2e.micState === "recording" ? "rgba(231,76,60,0.06)" : "rgba(85,186,170,0.06)",
                border: `1px solid ${e2e.micState === "recording" ? "rgba(231,76,60,0.15)" : "rgba(85,186,170,0.15)"}`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                {e2e.micState === "recording" ? (
                  <>
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#E74C3C", animation: "inlineMicPulse 1.4s ease-in-out infinite" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#E74C3C" }}>LISTENING</span>
                  </>
                ) : (
                  <>
                    <div
                      className="rounded-full"
                      style={{
                        width: 10,
                        height: 10,
                        border: "1.5px solid transparent",
                        borderTopColor: "#55BAAA",
                        borderRightColor: "#55BAAA",
                        animation: "spinnerRotate 0.8s linear infinite",
                      }}
                    />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#55BAAA" }}>PARSING</span>
                  </>
                )}
              </div>
              <p className="font-['Inter'] text-[#1A1A1A]/70" style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, minHeight: 20 }}>
                {e2e.liveTranscript || <span className="text-[#1A1A1A]/25 italic">Waiting for speech…</span>}
              </p>
            </div>
          </div>
        )}

        {/* Filled count badge */}
        {e2e.micState === "idle" && e2e.lastFillCount > 0 && (
          <div className="px-4 pt-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(243,209,42,0.08)" }}>
              <Mic size={12} color="#F3D12A" strokeWidth={2.5} />
              <span className="font-['Inter']" style={{ fontSize: 12, fontWeight: 600, color: "#0E2646" }}>
                {e2e.lastFillCount} fields auto-filled
              </span>
            </div>
          </div>
        )}

        {/* Form fields */}
        <div className="px-4 py-4 space-y-2.5">
          <VoiceFilledField label="Dam Tag" value={e2e.fieldValues.damTag ?? ""} state={e2e.fieldFillStates.damTag ?? "idle"} placeholder="Scan or enter dam tag" />
          <VoiceFilledField label="Calf Tag" value={e2e.fieldValues.calfTag ?? ""} state={e2e.fieldFillStates.calfTag ?? "idle"} placeholder="Calf tag number" />
          <VoiceFilledSelectRow label="Tag Color" value={e2e.fieldValues.tagColor ?? ""} state={e2e.fieldFillStates.tagColor ?? "idle"} options={["Pink", "Yellow", "Orange", "Green", "Blue", "White", "Red", "Purple", "No Tag"]} />
          <VoiceFilledSelectRow label="Sex" value={e2e.fieldValues.sex ?? ""} state={e2e.fieldFillStates.sex ?? "idle"} options={["Bull Calf", "Heifer Calf"]} />
          <VoiceFilledSelectRow label="Status" value={e2e.fieldValues.status ?? ""} state={e2e.fieldFillStates.status ?? "idle"} options={["Alive", "Dead", "Assisted"]} />
          <FormFieldRow label="Sire" value={e2e.fieldValues.sire ?? ""} placeholder="Sire tag or name" />
        </div>

        {/* Floating mic */}
        <div className="absolute flex flex-col items-center" style={{ bottom: 16, right: 16, zIndex: 10 }}>
          <FloatingMicButton state={e2e.micState} onClick={startE2E} demo />
        </div>
      </div>

      {/* Instruction card */}
      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 p-4 space-y-3">
        <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 12, fontWeight: 700 }}>How it works</p>
        {[
          { step: "1", label: "Tap mic", desc: "Starts recording (3s simulated)" },
          { step: "2", label: "Speak", desc: "Live transcript appears word-by-word" },
          { step: "3", label: "Parse", desc: "Processing spinner for 2s, NLP maps phrases to fields" },
          { step: "4", label: "Fill", desc: "Fields populate with 150ms stagger, each highlights for 2.2s" },
        ].map((item) => (
          <div key={item.step} className="flex items-start gap-3">
            <span
              className="shrink-0 flex items-center justify-center rounded-full font-['Inter']"
              style={{ width: 22, height: 22, fontSize: 11, fontWeight: 700, backgroundColor: "#0E2646", color: "#F3D12A" }}
            >
              {item.step}
            </span>
            <div>
              <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 12, fontWeight: 700 }}>{item.label}</p>
              <p className="font-['Inter'] text-[#1A1A1A]/45" style={{ fontSize: 11 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stagger timing note */}
      <div className="bg-[#0E2646]/[0.04] rounded-xl px-4 py-3 space-y-1.5">
        <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 12, fontWeight: 700 }}>Stagger Timing</p>
        <p className="font-['Inter'] text-[#1A1A1A]/50" style={{ fontSize: 11, lineHeight: 1.55 }}>
          Fields highlight in parse order with a 150ms offset between each. This creates a visual "cascade" that lets the operator track exactly which fields were populated — critical when reviewing in bright sunlight with gloves on. Each highlight holds for 1.6s then fades over 0.6s, so the full cascade across 5 fields takes ~3s total.
        </p>
      </div>

      {/* Hook API specs */}
      <SectionHeading text="useVoiceAutoFill Hook API" />

      <div className="bg-white rounded-2xl border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40">
        {[
          ["micState", "MicState — drives FloatingMicButton"],
          ["fieldValues", "Record<string, string> — current form data"],
          ["fieldFillStates", "Record<string, VoiceFillState> — per-field"],
          ["liveTranscript", "string — word-by-word during recording"],
          ["start(results)", "Begin cycle with parse results"],
          ["reset()", "Clear all state to idle"],
          ["isActive", "boolean — true while cycle is running"],
          ["staggerDelay", "150ms between field highlights"],
          ["highlightDuration", "2200ms per field (1600 hold + 600 fade)"],
        ].map(([label, val]) => (
          <div key={label} className="flex items-start px-4 py-2.5">
            <span className="font-['Inter'] shrink-0 text-[#55BAAA]" style={{ fontSize: 11, fontWeight: 600, width: 115 }}>{label}</span>
            <span className="font-['Inter'] text-[#1A1A1A]" style={{ fontSize: 11, fontWeight: 500 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tiny helpers ── */
function SectionHeading({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-[#0E2646] font-['Inter'] uppercase" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>{text}</span>
      <div className="flex-1 h-px bg-[#0E2646]/10" />
    </div>
  );
}

function StateLabel({ text }: { text: string }) {
  return (
    <span className="font-['Inter'] text-[#1A1A1A]/40" style={{ fontSize: 11, fontWeight: 600 }}>{text}</span>
  );
}
