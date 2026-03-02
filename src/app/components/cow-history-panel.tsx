import { useState } from "react";
import { FlagIcon } from "./flag-icon";
import type { FlagColor } from "./flag-icon";

/* ── Types ── */
export interface AnimalMatch {
  tag: string;
  tagColor: string;
  tagColorHex: string;
  type: string;
  breed: string;
  yearBorn: string;
  group: string;
  flag: FlagColor | null;
  eid: string;
  otherId: string;
  calvingRecords: {
    calfTag: string;
    sex: string;
    date: string;
    birthWeight: string;
    assistance: string;
  }[];
  historyRecords: {
    project: string;
    date: string;
    weight: string;
    preg?: string;
    treatments: string[];
  }[];
}

/* ── Mock animal data ── */
export const mockAnimals: Record<string, AnimalMatch> = {
  "4782": {
    tag: "4782",
    tagColor: "Pink",
    tagColorHex: "#E91E8C",
    type: "Cow",
    breed: "Black Angus",
    yearBorn: "2020",
    group: "Spring Calvers",
    flag: "teal",
    eid: "982 000364507221",
    otherId: "BG-4782",
    calvingRecords: [
      { calfTag: "C-2501", sex: "Bull", date: "Mar 12, 2025", birthWeight: "82 lbs", assistance: "None" },
      { calfTag: "C-2402", sex: "Heifer", date: "Feb 28, 2024", birthWeight: "75 lbs", assistance: "Easy Pull" },
      { calfTag: "C-2308", sex: "Bull", date: "Mar 5, 2023", birthWeight: "88 lbs", assistance: "None" },
      { calfTag: "C-2214", sex: "Heifer", date: "Mar 18, 2022", birthWeight: "72 lbs", assistance: "None" },
    ],
    historyRecords: [
      { project: "Fall Processing", date: "Oct 15, 2025", weight: "1,280", treatments: ["Bovi-Shield Gold 5", "Ivermectin"] },
      { project: "Spring Preg Check", date: "Mar 28, 2025", weight: "1,195", preg: "Bred", treatments: ["Multimin 90"] },
      { project: "Fall Processing", date: "Oct 8, 2024", weight: "1,210", treatments: ["Bovi-Shield Gold 5", "Pour-On"] },
    ],
  },
  "3091": {
    tag: "3091",
    tagColor: "Yellow",
    tagColorHex: "#F3D12A",
    type: "Cow",
    breed: "Red Angus",
    yearBorn: "2019",
    group: "Spring Calvers",
    flag: "gold",
    eid: "982 000364508112",
    otherId: "BG-3091",
    calvingRecords: [
      { calfTag: "C-2503", sex: "Heifer", date: "Mar 1, 2025", birthWeight: "70 lbs", assistance: "None" },
    ],
    historyRecords: [
      { project: "Fall Processing", date: "Oct 15, 2025", weight: "1,040", treatments: ["Bovi-Shield Gold 5"] },
    ],
  },
};

/* ── Already-processed tags for this project (mock) ── */
export const alreadyProcessedTags = ["5520", "2218"];

/* ═══════════════════════════════════════════════
   COW HISTORY PANEL
   ═══════════════════════════════════════════════ */
interface CowHistoryPanelProps {
  animal: AnimalMatch;
  defaultExpanded?: boolean;
}

type SubTab = "info" | "calving" | "history";

export function CowHistoryPanel({ animal, defaultExpanded = false }: CowHistoryPanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [subTab, setSubTab] = useState<SubTab>("info");

  const subTabs: { key: SubTab; label: string }[] = [
    { key: "info", label: "Info" },
    { key: "calving", label: "Calving" },
    { key: "history", label: "History" },
  ];

  return (
    <div className="rounded-xl overflow-hidden font-['Inter']" style={{ backgroundColor: "#0E2646" }}>
      {/* ── Header ── */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
        style={{ background: "none", border: "none" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span style={{ fontSize: 15, fontWeight: 700, color: "#F0F0F0" }}>
            {animal.tag}
          </span>
          {animal.flag && <FlagIcon color={animal.flag} size="sm" />}
          <span
            className="rounded-full shrink-0"
            style={{
              width: 8,
              height: 8,
              backgroundColor: animal.tagColorHex,
              display: "inline-block",
            }}
          />
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M4 6L8 10L12 6" stroke="#F0F0F0" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {/* Subtitle below header */}
      <div className="px-4 -mt-2 pb-3">
        <p style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.45)" }}>
          {animal.type} · {animal.yearBorn} · EID: {animal.eid}
        </p>
      </div>

      {/* ── Expanded content ── */}
      {expanded && (
        <div>
          {/* Sub-tab bar */}
          <div className="flex border-b" style={{ borderColor: "rgba(240,240,240,0.08)" }}>
            {subTabs.map((t) => {
              const isActive = subTab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setSubTab(t.key)}
                  className="flex-1 pb-2.5 pt-1 cursor-pointer relative"
                  style={{
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#F0F0F0" : "rgba(240,240,240,0.35)",
                    background: "none",
                    border: "none",
                  }}
                >
                  {t.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                      style={{ width: 32, height: 2.5, backgroundColor: "#F3D12A" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sub-tab content */}
          <div className="px-4 py-3">
            {subTab === "info" && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {[
                  { label: "Type", value: animal.type },
                  { label: "Breed", value: animal.breed },
                  { label: "Year Born", value: animal.yearBorn },
                  { label: "Tag Color", value: animal.tagColor },
                  { label: "Group", value: animal.group },
                  { label: "Flag Status", value: animal.flag ? animal.flag.charAt(0).toUpperCase() + animal.flag.slice(1) : "None" },
                  { label: "EID", value: animal.eid },
                  { label: "Other ID", value: animal.otherId },
                ].map((kv) => (
                  <div key={kv.label}>
                    <p
                      className="uppercase"
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        color: "rgba(240,240,240,0.25)",
                      }}
                    >
                      {kv.label}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#F0F0F0", marginTop: 1 }}>
                      {kv.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {subTab === "calving" && (
              <div className="space-y-2">
                {animal.calvingRecords.slice(0, 3).map((c) => (
                  <div
                    key={c.calfTag}
                    className="rounded-lg px-3 py-2.5"
                    style={{ backgroundColor: "rgba(240,240,240,0.04)" }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#F0F0F0" }}>
                          {c.calfTag}
                        </span>
                        <span
                          className="rounded-full"
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "1px 7px",
                            backgroundColor: c.sex === "Bull" ? "rgba(14,38,70,0.3)" : "rgba(233,30,140,0.15)",
                            color: c.sex === "Bull" ? "rgba(240,240,240,0.5)" : "#E91E8C",
                          }}
                        >
                          {c.sex}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.35)" }}>
                        {c.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.45)" }}>
                        {c.birthWeight}
                      </span>
                      {c.assistance !== "None" && (
                        <span
                          className="rounded-full"
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            padding: "1px 6px",
                            backgroundColor: "rgba(243,209,42,0.12)",
                            color: "#D4A017",
                          }}
                        >
                          {c.assistance}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {animal.calvingRecords.length > 3 && (
                  <button
                    type="button"
                    className="cursor-pointer font-['Inter']"
                    style={{ fontSize: 12, fontWeight: 600, color: "#55BAAA", background: "none", border: "none", padding: 0 }}
                  >
                    View all →
                  </button>
                )}
              </div>
            )}

            {subTab === "history" && (
              <div className="space-y-2">
                {animal.historyRecords.slice(0, 3).map((h, i) => (
                  <div
                    key={`${h.project}-${i}`}
                    className="rounded-lg px-3 py-2.5"
                    style={{ backgroundColor: "rgba(240,240,240,0.04)" }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#F0F0F0" }}>
                        {h.project}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.35)" }}>
                        {h.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(240,240,240,0.45)" }}>
                        {h.weight} lbs
                      </span>
                      {h.preg && (
                        <span
                          className="rounded-full"
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "1px 7px",
                            backgroundColor: "rgba(85,186,170,0.15)",
                            color: "#55BAAA",
                          }}
                        >
                          {h.preg}
                        </span>
                      )}
                      {h.treatments.map((t) => (
                        <span
                          key={t}
                          className="rounded-full"
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            padding: "1px 6px",
                            backgroundColor: "rgba(85,186,170,0.08)",
                            color: "rgba(85,186,170,0.7)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {animal.historyRecords.length > 3 && (
                  <button
                    type="button"
                    className="cursor-pointer font-['Inter']"
                    style={{ fontSize: 12, fontWeight: 600, color: "#55BAAA", background: "none", border: "none", padding: 0 }}
                  >
                    View all →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
