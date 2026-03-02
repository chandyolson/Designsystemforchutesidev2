import { useState } from "react";
import { useNavigate } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { CollapsibleSection } from "./collapsible-section";
import { PillButton } from "./pill-button";
import { FlagIcon } from "./flag-icon";

/* ── Mock worked animals ── */
const workedAnimals = [
  { tag: "4782", weight: "1,247", notes: "Normal", flag: "teal" as const },
  { tag: "3091", weight: "983", notes: "Follow-up Thurs", flag: "gold" as const },
  { tag: "5520", weight: "1,102", notes: "Treatment administered", flag: "red" as const },
  { tag: "2218", weight: "1,340", notes: "Normal", flag: "teal" as const },
  { tag: "8812", weight: "1,156", notes: "Normal", flag: "teal" as const },
];

/* ── Mock products for the project ── */
const projectProducts = [
  { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM", inventory: "38 doses" },
  { name: "Ivermectin Pour-On", dosage: "1 mL / 22 lbs", route: "Topical", inventory: "1.2 L" },
  { name: "Multimin 90", dosage: "1 mL / 100 lbs", route: "SQ", inventory: "500 mL" },
  { name: "CIDR Insert", dosage: "1 unit", route: "Intravaginal", inventory: "42 units" },
  { name: "GnRH (Cystorelin)", dosage: "2 mL", route: "IM", inventory: "25 mL" },
];

export function ProjectDetailScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"input" | "animals" | "stats" | "details">("input");

  const [inputFields, setInputFields] = useState({
    tag: "",
    weight: "",
    notes: "",
    data1: "",
    data2: "",
  });

  const updateInput = (key: keyof typeof inputFields) => (val: string) =>
    setInputFields((prev) => ({ ...prev, [key]: val }));

  const tabs = ["input", "animals", "stats", "details"] as const;
  const tabLabels = { input: "Input", animals: "Animals", stats: "Stats", details: "Details" };

  return (
    <div className="space-y-0">
      {/* ══ GRADIENT TOTAL CARD ══ */}
      <div
        className="rounded-2xl px-5 py-5 font-['Inter'] mb-5"
        style={{ background: "linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)" }}
      >
        <p
          className="uppercase"
          style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)" }}
        >
          Total Animals Worked
        </p>
        <p className="text-white mt-1" style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {workedAnimals.length}
        </p>
        <p className="mt-1.5" style={{ fontSize: 12, fontWeight: 500, color: "#A8E6DA" }}>
          Spring Preg Check · In Progress
        </p>
        <button
          type="button"
          onClick={() => {}}
          className="mt-4 w-full rounded-xl py-2.5 cursor-pointer font-['Inter'] transition-all active:scale-[0.98]"
          style={{
            fontSize: 13,
            fontWeight: 700,
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          Complete Project
        </button>
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
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#0E2646" : "rgba(26,26,26,0.35)",
              }}
            >
              {tabLabels[tab]}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ width: 40, height: 3, backgroundColor: "#F3D12A" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ══ TAB CONTENT ══ */}
      <div className="py-5">
        {activeTab === "input" && (
          <div className="space-y-5">
            {/* Tag scan field — prominent */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <label
                  className="shrink-0 text-[#1A1A1A] font-['Inter']"
                  style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "46px" }}
                >
                  Tag Scan
                </label>
                <input
                  type="text"
                  value={inputFields.tag}
                  onChange={(e) => updateInput("tag")(e.target.value)}
                  placeholder="Scan or enter tag…"
                  className="flex-1 min-w-0 h-[46px] px-3 rounded-lg bg-white border-2 border-[#F3D12A] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
                  style={{ fontSize: 16, fontWeight: 600 }}
                />
              </div>
              <FormFieldRow label="Weight" value={inputFields.weight} onChange={updateInput("weight")} placeholder="lbs" type="number" />
              <FormFieldRow label="Data 1" value={inputFields.data1} onChange={updateInput("data1")} placeholder="Work-type specific" />
              <FormFieldRow label="Data 2" value={inputFields.data2} onChange={updateInput("data2")} placeholder="Work-type specific" />
              <FormFieldRow label="Notes" value={inputFields.notes} onChange={updateInput("notes")} placeholder="Quick note…" />
            </div>

            <div className="flex gap-3 pt-2">
              <PillButton variant="outline" size="md" style={{ flex: 1 }}>Skip</PillButton>
              <PillButton size="md" style={{ flex: 1 }}>Save &amp; Next</PillButton>
            </div>
          </div>
        )}

        {activeTab === "animals" && (
          <div className="space-y-2.5">
            {workedAnimals.map((a) => (
              <div
                key={a.tag}
                onClick={() => navigate(`/cow-work/spring-preg/animal/${a.tag}`)}
                className="rounded-xl px-4 py-3 font-['Inter'] flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
                style={{ backgroundColor: "#0E2646" }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#F0F0F0" }}>{a.tag}</span>
                    <FlagIcon color={a.flag} size="sm" />
                  </div>
                  <p className="mt-0.5 truncate" style={{ fontSize: 12, color: "rgba(240,240,240,0.45)" }}>
                    {a.weight} lbs · {a.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-4">
            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Worked", value: "5" },
                { label: "Avg Weight", value: "1,166" },
                { label: "Green Flags", value: "3" },
                { label: "Flagged", value: "2" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white border border-[#D4D4D0]/60 p-3.5 font-['Inter']">
                  <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(26,26,26,0.35)", letterSpacing: "0.06em" }} className="uppercase">
                    {s.label}
                  </p>
                  <p className="text-[#0E2646] mt-1" style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-5">
            {/* ── Project Info ── */}
            <div className="space-y-2.5">
              <FormFieldRow label="Project" value="Spring Preg Check" placeholder="" />
              <FormFieldRow label="Work Type" value="PREG" placeholder="" />
              <FormFieldRow label="Cattle Type" value="Cows" placeholder="" />
              <FormFieldRow label="Date" value="Feb 25, 2026" placeholder="" />
              <FormSelectRow label="Location" value="Working Facility" onChange={() => {}} options={["Working Facility", "North Pasture", "South Pasture", "Barn / Chute", "Corral", "Feedlot"]} />
              <FormSelectRow label="Group" value="Spring Calvers" onChange={() => {}} options={["Spring Calvers", "Fall Calvers", "Heifers — 1st Calf", "Bulls", "Replacement Heifers", "Feeders"]} />
              <FormFieldRow label="Status" value="In Progress" placeholder="" />
              <FormFieldRow label="Head Count" value="45" placeholder="" />
            </div>

            {/* ── Products ── */}
            <CollapsibleSection title={`Products (${projectProducts.length})`} defaultOpen>
              <div className="space-y-2 pt-1">
                {projectProducts.map((p) => (
                  <div
                    key={p.name}
                    className="rounded-lg px-3.5 py-2.5"
                    style={{ backgroundColor: "#0E2646" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className="text-[#F0F0F0] min-w-0 flex-1"
                        style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}
                      >
                        {p.name}
                      </p>
                      <span
                        className="shrink-0 rounded-full"
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          padding: "2px 8px",
                          backgroundColor: "rgba(85,186,170,0.15)",
                          color: "#55BAAA",
                        }}
                      >
                        {p.route}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.45)" }}>
                        {p.dosage}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.30)" }}>
                        ·
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.35)" }}>
                        {p.inventory} remaining
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            <div className="flex gap-3 pt-2">
              <PillButton variant="outline" size="md" onClick={() => navigate("/cow-work")} style={{ flex: 1 }}>
                Back to List
              </PillButton>
              <PillButton size="md" style={{ flex: 1 }}>
                Complete Project
              </PillButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}