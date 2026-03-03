import { useState } from "react";
import { useNavigate } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { CollapsibleSection } from "./collapsible-section";
import { PillButton } from "./pill-button";
import { FlagIcon } from "./flag-icon";
import {
  CalvingQuickNotes,
  getActiveFlagColor,
  CALVING_QUICK_NOTES,
  type NoteFlag,
} from "./calving-quick-notes";

/* Flag label map */
const FLAG_LABEL_MAP: Record<string, string> = {
  cull: "Cull",
  production: "Production",
  management: "Management",
};

export function AddCalfScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"entry" | "dam">("entry");

  /* Auto-filled calving date */
  const today = new Date();
  const calvingDate = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const [fields, setFields] = useState({
    damTag: "",
    calfTag: "",
    tagColor: "",
    sex: "",
    status: "Alive",
    size: "Average",
    sire: "",
    location: "",
    group: "",
    assistance: "",
    birthWeight: "",
    disposition: "",
    notes: "",
  });

  /* Quick notes — color-coded with flag behavior */
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>(["qn2", "qn11"]); // Bad Bag + Needs Tag mock
  const [activeFlag, setActiveFlag] = useState<NoteFlag>("production"); // production wins

  const [cowTraits, setCowTraits] = useState({
    udderScore: "",
    teatScore: "",
    clawScore: "",
    footScore: "",
    motheringScore: "",
  });

  const [calfTraits, setCalfTraits] = useState({
    vigor: "",
    size: "",
  });

  const update = (key: keyof typeof fields) => (val: string) =>
    setFields((prev) => ({ ...prev, [key]: val }));
  const updateCowTraits = (key: keyof typeof cowTraits) => (val: string) =>
    setCowTraits((prev) => ({ ...prev, [key]: val }));
  const updateCalfTraits = (key: keyof typeof calfTraits) => (val: string) =>
    setCalfTraits((prev) => ({ ...prev, [key]: val }));

  const tabs = ["entry", "dam"] as const;
  const tabLabels = { entry: "Entry", dam: "Dam Info" };

  const displayTag = fields.calfTag || "—";
  const flagColor = getActiveFlagColor(selectedNoteIds);

  return (
    <div className="space-y-0">
      {/* ══ CALVING DATE BADGE + FLAG INDICATOR ══ */}
      <div
        className="flex items-center justify-between py-2.5 px-4 mb-4 rounded-xl font-['Inter']"
        style={{ backgroundColor: "rgba(14,38,70,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(26,26,26,0.45)" }}>
            Calving Date
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0E2646" }}>
            {calvingDate}
          </span>
        </div>
        {flagColor && (
          <div className="flex items-center gap-1.5">
            <FlagIcon color={flagColor} size="sm" />
            <span
              className="font-['Inter']"
              style={{ fontSize: 10, fontWeight: 700, color: flagColor === "red" ? "#9B2335" : flagColor === "gold" ? "#B8860B" : "#55BAAA" }}
            >
              {FLAG_LABEL_MAP[activeFlag]}
            </span>
          </div>
        )}
      </div>

      {/* ══ TABS ══ */}
      <div className="flex border-b border-[#D4D4D0]/50">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="flex-1 pb-3 cursor-pointer transition-colors duration-150 font-['Inter'] relative"
              style={{
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#0E2646" : "rgba(26,26,26,0.35)",
              }}
            >
              {tabLabels[tab]}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ width: 48, height: 3, backgroundColor: "#F3D12A" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ══ TAB CONTENT ══ */}
      <div className="py-5">
        {activeTab === "entry" && (
          <div className="space-y-5">
            {/* ── Primary Fields ── */}
            <div className="space-y-2.5">
              <FormFieldRow label="Dam Tag" value={fields.damTag} onChange={update("damTag")} placeholder="Scan or enter dam tag" />
              <FormFieldRow label="Calf Tag" value={fields.calfTag} onChange={update("calfTag")} placeholder="Calf tag number" />
              <FormSelectRow label="Tag Color" value={fields.tagColor} onChange={update("tagColor")} placeholder="Select color" options={["Pink", "Yellow", "Orange", "Green", "Blue", "White", "Red", "Purple", "No Tag"]} />
              <FormSelectRow label="Sex" value={fields.sex} onChange={update("sex")} placeholder="Select sex" options={["Bull Calf", "Heifer Calf"]} />
              <FormSelectRow label="Status" value={fields.status} onChange={update("status")} placeholder="Select status" options={["Alive", "Dead", "Assisted"]} />
              <FormFieldRow label="Sire" value={fields.sire} onChange={update("sire")} placeholder="Sire tag or name" />
              <FormSelectRow label="Location" value={fields.location} onChange={update("location")} placeholder="Select location" options={["Working Facility", "North Pasture", "South Pasture", "Calving Barn", "Heifer Lot", "Maternity Pen", "Corral"]} />
              <FormSelectRow label="Group" value={fields.group} onChange={update("group")} placeholder="Select group" options={["Spring Calvers", "Fall Calvers", "Heifers — 1st Calf", "Replacement Heifers", "Bred Heifers"]} />
              {/* Size + Birth Weight on one line */}
              <div className="flex items-center gap-3">
                <label
                  className="shrink-0 text-[#1A1A1A] font-['Inter']"
                  style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
                >
                  Size / Wt
                </label>
                <div className="flex flex-1 min-w-0 gap-2">
                  <div className="relative flex-1 min-w-0">
                    <select
                      value={fields.size}
                      onChange={(e) => update("size")(e.target.value)}
                      className="w-full h-[40px] px-3 pr-8 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all appearance-none cursor-pointer"
                      style={{ fontSize: 16, fontWeight: 400, color: fields.size ? "#1A1A1A" : "rgba(26,26,26,0.30)" }}
                    >
                      <option value="" disabled>Size</option>
                      {["Small", "Average", "Large"].map((opt) => (
                        <option key={opt} value={opt} style={{ color: "#1A1A1A" }}>{opt}</option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                    >
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    placeholder="lbs"
                    value={fields.birthWeight}
                    onChange={(e) => update("birthWeight")(e.target.value)}
                    className="w-[80px] h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
                    style={{ fontSize: 16, fontWeight: 400 }}
                  />
                </div>
              </div>
            </div>

            {/* ── Quick Notes (color-coded pills) ── */}
            <CollapsibleSection
              title="Quick Notes"
              collapsedContent={
                selectedNoteIds.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {selectedNoteIds.map((id) => {
                      const note = CALVING_QUICK_NOTES.find((n) => n.id === id);
                      if (!note) return null;
                      const bg =
                        note.flag === "cull" ? "rgba(155,35,53,0.12)" :
                        note.flag === "production" ? "rgba(212,160,23,0.12)" :
                        note.flag === "management" ? "rgba(85,186,170,0.12)" :
                        "rgba(14,38,70,0.08)";
                      const color =
                        note.flag === "cull" ? "#9B2335" :
                        note.flag === "production" ? "#B8860B" :
                        note.flag === "management" ? "#55BAAA" :
                        "#0E2646";
                      return (
                        <span
                          key={id}
                          className="px-2.5 py-1 rounded-full font-['Inter']"
                          style={{ fontSize: 11, fontWeight: 600, backgroundColor: bg, color }}
                        >
                          {note.text}
                        </span>
                      );
                    })}
                  </div>
                ) : undefined
              }
            >
              <div className="pt-2">
                <CalvingQuickNotes
                  selectedIds={selectedNoteIds}
                  onSelectedChange={setSelectedNoteIds}
                  tag={displayTag}
                  onFlagChange={setActiveFlag}
                />
              </div>
            </CollapsibleSection>

            {/* ── Notes ── */}
            <div className="space-y-2">
              <p className="text-[#1A1A1A] font-['Inter']" style={{ fontSize: 14, fontWeight: 600 }}>
                Notes
              </p>
              <textarea
                value={fields.notes}
                onChange={(e) => update("notes")(e.target.value)}
                placeholder="Calving notes…"
                className="w-full h-[100px] px-3 py-2.5 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all resize-none"
                style={{ fontSize: 16, fontWeight: 400 }}
              />
            </div>

            {/* ── Cow Traits (collapsed) ── */}
            <CollapsibleSection title="Cow Traits (7)">
              <div className="space-y-2.5 pt-2">
                <FormSelectRow label="Assistance" value={fields.assistance} onChange={update("assistance")} placeholder="Select level" options={["1 — None", "2 — Easy pull", "3 — Moderate", "4 — Hard pull", "5 — Surgery"]} />
                <FormSelectRow label="Disposition" value={fields.disposition} onChange={update("disposition")} placeholder="Select score" options={["1 — Docile", "2 — Restless", "3 — Nervous", "4 — Flighty", "5 — Aggressive", "6 — Very aggressive"]} />
                <FormFieldRow label="Udder Score" value={cowTraits.udderScore} onChange={updateCowTraits("udderScore")} placeholder="1-9" />
                <FormFieldRow label="Teat Score" value={cowTraits.teatScore} onChange={updateCowTraits("teatScore")} placeholder="1-9" />
                <FormFieldRow label="Claw Score" value={cowTraits.clawScore} onChange={updateCowTraits("clawScore")} placeholder="1-9" />
                <FormFieldRow label="Foot Score" value={cowTraits.footScore} onChange={updateCowTraits("footScore")} placeholder="1-9" />
                <FormFieldRow label="Mothering" value={cowTraits.motheringScore} onChange={updateCowTraits("motheringScore")} placeholder="1-5" />
              </div>
            </CollapsibleSection>

            {/* ── Calf Traits (collapsed) ── */}
            <CollapsibleSection title="Calf Traits (2)">
              <div className="space-y-2.5 pt-2">
                <FormFieldRow label="Calf Vigor" value={calfTraits.vigor} onChange={updateCalfTraits("vigor")} placeholder="1-5" />
                <FormFieldRow label="Calf Size" value={calfTraits.size} onChange={updateCalfTraits("size")} placeholder="1-5" />
              </div>
            </CollapsibleSection>

            {/* ── Actions ── */}
            <div className="flex gap-3 pt-2">
              <PillButton variant="outline" size="md" onClick={() => navigate(-1)} style={{ flex: 1 }}>
                Cancel
              </PillButton>
              <PillButton size="md" onClick={() => navigate("/calving")} style={{ flex: 1 }}>
                Save Record
              </PillButton>
            </div>
          </div>
        )}

        {activeTab === "dam" && (
          <div className="space-y-5">
            {/* ── Dam summary (populated when dam tag entered) ── */}
            {fields.damTag ? (
              <>
                {/* Animal card */}
                <div
                  className="rounded-2xl px-4 py-4"
                  style={{ backgroundColor: "#0E2646" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="font-['Inter'] text-white"
                      style={{ fontSize: 20, fontWeight: 700 }}
                    >
                      {fields.damTag}
                    </span>
                    <span
                      className="font-['Inter'] text-white/50"
                      style={{ fontSize: 12, fontWeight: 600 }}
                    >
                      Cow
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                    <div>
                      <p className="font-['Inter'] text-white/40" style={{ fontSize: 11, fontWeight: 600 }}>Tag Color</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#F3D12A" }} />
                        <span className="font-['Inter'] text-white" style={{ fontSize: 13, fontWeight: 600 }}>Yellow</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-['Inter'] text-white/40" style={{ fontSize: 11, fontWeight: 600 }}>Year Born</p>
                      <p className="font-['Inter'] text-white mt-0.5" style={{ fontSize: 13, fontWeight: 600 }}>2019</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-['Inter'] text-white/40" style={{ fontSize: 11, fontWeight: 600 }}>Sire</p>
                      <p className="font-['Inter'] text-white mt-0.5" style={{ fontSize: 13, fontWeight: 600 }}>Thunder 42B</p>
                    </div>
                  </div>
                </div>

                {/* ── Calving Records ── */}
                <div>
                  <p
                    className="text-[#0E2646] font-['Inter'] uppercase mb-3"
                    style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}
                  >
                    Calving Records
                  </p>
                  <div className="space-y-2">
                    {[
                      { date: "Mar 12, 2025", calf: "25-102", sex: "Heifer", status: "Alive" },
                      { date: "Feb 28, 2024", calf: "24-088", sex: "Bull", status: "Alive" },
                      { date: "Mar 5, 2023", calf: "23-041", sex: "Heifer", status: "Alive" },
                    ].map((rec) => (
                      <div
                        key={rec.calf}
                        className="flex items-center justify-between rounded-xl px-3.5 py-3"
                        style={{ backgroundColor: "#0E2646" }}
                      >
                        <div>
                          <p className="font-['Inter'] text-white" style={{ fontSize: 14, fontWeight: 700 }}>
                            {rec.calf}
                          </p>
                          <p className="font-['Inter'] text-white/45" style={{ fontSize: 12, fontWeight: 500 }}>
                            {rec.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-['Inter'] text-white/70" style={{ fontSize: 13, fontWeight: 600 }}>
                            {rec.sex}
                          </p>
                          <p className="font-['Inter']" style={{ fontSize: 12, fontWeight: 600, color: "#55BAAA" }}>
                            {rec.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Work Records (collapsed) ── */}
                <CollapsibleSection title="Work Records (3)">
                  <div className="space-y-2 pt-2">
                    {[
                      { date: "Oct 15, 2025", type: "Preg Check", note: "Confirmed bred — 120 days" },
                      { date: "Apr 8, 2025", type: "Vaccination", note: "Vira Shield 6 + L5" },
                      { date: "Oct 20, 2024", type: "Preg Check", note: "Confirmed bred — 90 days" },
                    ].map((rec, i) => (
                      <div
                        key={i}
                        className="rounded-xl px-3.5 py-3"
                        style={{ backgroundColor: "#0E2646" }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-['Inter'] text-white" style={{ fontSize: 14, fontWeight: 700 }}>
                            {rec.type}
                          </p>
                          <p className="font-['Inter'] text-white/45" style={{ fontSize: 12, fontWeight: 500 }}>
                            {rec.date}
                          </p>
                        </div>
                        <p className="font-['Inter'] text-white/60 mt-1" style={{ fontSize: 12, fontWeight: 500 }}>
                          {rec.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                {/* ── Treatment Records (collapsed) ── */}
                <CollapsibleSection title="Treatment Records (2)">
                  <div className="space-y-2 pt-2">
                    {[
                      { date: "Jan 10, 2025", treatment: "Excede", note: "Foot rot — left rear" },
                      { date: "Mar 22, 2024", treatment: "LA-200", note: "Eye infection — right eye" },
                    ].map((rec, i) => (
                      <div
                        key={i}
                        className="rounded-xl px-3.5 py-3"
                        style={{ backgroundColor: "#0E2646" }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-['Inter'] text-white" style={{ fontSize: 14, fontWeight: 700 }}>
                            {rec.treatment}
                          </p>
                          <p className="font-['Inter'] text-white/45" style={{ fontSize: 12, fontWeight: 500 }}>
                            {rec.date}
                          </p>
                        </div>
                        <p className="font-['Inter'] text-white/60 mt-1" style={{ fontSize: 12, fontWeight: 500 }}>
                          {rec.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              </>
            ) : (
              <p className="text-[#1A1A1A]/40 font-['Inter'] text-center py-8" style={{ fontSize: 14 }}>
                Enter a Dam Tag on the Entry tab to view dam info
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}