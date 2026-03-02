import { useState } from "react";
import { useNavigate } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { FlagIcon } from "./flag-icon";
import type { FlagColor } from "./flag-icon";
import { PillButton } from "./pill-button";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";

/* ── Tag color → dot hex ── */
const tagColorDots: Record<string, string> = {
  Pink: "#E8A0BF",
  Yellow: "#F3D12A",
  Orange: "#E8863A",
  Green: "#55BAAA",
  Blue: "#5B8DEF",
  White: "#E0E0E0",
  Red: "#D4606E",
  Purple: "#A77BCA",
  "No Tag": "#999999",
};

/* ── Mock animal record ── */
const animalRecord = {
  tag: "3309",
  tagColor: "Pink",
  sex: "Cow",
  animalType: "Cow",
  yearBorn: "2020",
  status: "Active",
  flag: "teal" as FlagColor | null,
  flagReason: "Spring calving group — monitor BCS",
  eid: "982 000364507221",
  notes: "Good disposition, easy handler. Spring calving group.",
  weight: "1,187",
};

/* ── Flag config ── */
const flagOptions: { color: FlagColor; label: string; hex: string }[] = [
  { color: "teal", label: "Management", hex: "#55BAAA" },
  { color: "gold", label: "Production", hex: "#D4A017" },
  { color: "red", label: "Cull", hex: "#9B2335" },
];

const flagLabels: Record<FlagColor, string> = {
  teal: "Management",
  gold: "Production",
  red: "Cull",
};

/* ── Quick note pills ── */
const quickNoteOptions = [
  "Docile", "Aggressive", "Flighty", "Hard keeper", "Easy keeper",
  "Good mother", "Poor mother", "Calving ease", "Calving difficulty",
  "Prolapse history", "Foot rot", "Pinkeye", "Lump jaw",
  "Slow breeder", "Heavy milker", "Light milker",
];

/* ── Dropdown options ── */
const tagColorOptions = ["Pink", "Yellow", "Orange", "Green", "Blue", "White", "Red", "Purple", "No Tag"];
const sexOptions = ["Bull", "Cow", "Steer", "Spayed Heifer", "Heifer"];
const typeOptions = ["Calf", "Yearling", "Feeder", "Cow", "Bull", "Replacement Heifer"];
const yearOptions = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];
const statusOptions = ["Active", "Sold", "Dead", "Culled", "Missing"];

/* ═══════════════════════════════════════════════
   ANIMAL EDIT SCREEN
   ═══════════════════════════════════════════════ */
export function AnimalEditScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();

  const [isEditing, setIsEditing] = useState(false);

  /* Form state pre-filled from mock record */
  const [fields, setFields] = useState({
    tag: animalRecord.tag,
    tagColor: animalRecord.tagColor,
    eid: animalRecord.eid,
    sex: animalRecord.sex,
    animalType: animalRecord.animalType,
    yearBorn: animalRecord.yearBorn,
    status: animalRecord.status,
    flag: animalRecord.flag,
    flagReason: animalRecord.flagReason,
    notes: animalRecord.notes,
  });

  const [selectedQuickNotes, setSelectedQuickNotes] = useState<string[]>([
    "Good mother", "Easy keeper",
  ]);

  /* Original state for cancel revert */
  const [originalFields] = useState({ ...fields });
  const [originalQuickNotes] = useState([...selectedQuickNotes]);

  const update = (key: keyof typeof fields) => (val: string) =>
    setFields((prev) => ({ ...prev, [key]: val }));

  const toggleQuickNote = (note: string) => {
    if (!isEditing) return;
    setSelectedQuickNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleCancel = () => {
    setFields({ ...originalFields });
    setSelectedQuickNotes([...originalQuickNotes]);
    setIsEditing(false);
  };

  const handleSave = () => {
    showToast("success", "Animal 3309 updated successfully");
    setIsEditing(false);
  };

  const handleDelete = () => {
    showDeleteConfirm({
      title: "Delete Animal 3309?",
      message: "This will permanently remove this animal and all associated records. This action cannot be undone.",
      confirmLabel: "Delete Animal",
      onConfirm: () => {
        showToast("success", "Animal 3309 deleted");
        navigate("/animals");
      },
    });
  };

  /* Current dot color based on selected tag color */
  const dotColor = tagColorDots[fields.tagColor] || "#E8A0BF";

  return (
    <div className="space-y-0">
      {/* ══ GRADIENT HEADER CARD ══ */}
      <div
        className="rounded-2xl px-5 py-5 font-['Inter'] relative"
        style={{
          background: "linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)",
        }}
      >
        {/* Edit / Editing pill — top right */}
        <button
          type="button"
          onClick={handleToggleEdit}
          className="absolute top-4 right-4 rounded-full cursor-pointer transition-all duration-200 active:scale-95 font-['Inter']"
          style={{
            padding: "4px 14px",
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: isEditing ? "rgba(255,255,255,0.15)" : "#F3D12A",
            color: isEditing ? "#FFFFFF" : "#1A1A1A",
            border: "none",
          }}
        >
          {isEditing ? "Editing" : "Edit"}
        </button>

        <div className="flex items-start justify-between gap-3 pr-16">
          {/* Left — Tag & info */}
          <div className="min-w-0 flex-1">
            <p
              className="text-white"
              style={{
                fontSize: 36,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {fields.tag}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className="rounded-full shrink-0"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: dotColor,
                  display: "inline-block",
                }}
              />
              <p
                className="truncate"
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: "rgba(240,240,240,0.45)",
                  lineHeight: 1.4,
                }}
              >
                {fields.tagColor} · {fields.sex} · {fields.animalType} · {fields.yearBorn}
              </p>
            </div>
            <p
              className="mt-1"
              style={{ fontSize: 11, fontWeight: 500, color: "#A8E6DA" }}
            >
              {fields.status} · {animalRecord.weight} lbs
            </p>
          </div>

          {/* Right — Flag */}
          {fields.flag && (
            <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
              <FlagIcon color={fields.flag} size="md" />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: flagOptions.find((f) => f.color === fields.flag)?.hex || "#55BAAA",
                  letterSpacing: "0.02em",
                }}
              >
                {flagLabels[fields.flag]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ══ FORM CONTENT ══ */}
      <div className="py-5">
        <div className="space-y-5">
          {/* ── Core Fields ── */}
          <div className="space-y-2.5">
            {isEditing ? (
              <>
                <FormFieldRow
                  label="Tag"
                  placeholder="Tag number"
                  value={fields.tag}
                  onChange={update("tag")}
                />
                <FormSelectRow
                  label="Tag Color"
                  placeholder="Select color"
                  value={fields.tagColor}
                  onChange={update("tagColor")}
                  options={tagColorOptions}
                />
                <FormFieldRow
                  label="EID"
                  placeholder="Electronic ID"
                  value={fields.eid}
                  onChange={update("eid")}
                />
                <FormSelectRow
                  label="Sex"
                  placeholder="Select sex"
                  value={fields.sex}
                  onChange={update("sex")}
                  options={sexOptions}
                />
                <FormSelectRow
                  label="Animal Type"
                  placeholder="Select type"
                  value={fields.animalType}
                  onChange={update("animalType")}
                  options={typeOptions}
                />
                <FormSelectRow
                  label="Year Born"
                  placeholder="Select year"
                  value={fields.yearBorn}
                  onChange={update("yearBorn")}
                  options={yearOptions}
                />
                <FormSelectRow
                  label="Status"
                  placeholder="Select status"
                  value={fields.status}
                  onChange={update("status")}
                  options={statusOptions}
                />
              </>
            ) : (
              <>
                <ReadOnlyRow label="Tag" value={fields.tag} />
                <ReadOnlyRow label="Tag Color" value={fields.tagColor} dotColor={dotColor} />
                <ReadOnlyRow label="EID" value={fields.eid} />
                <ReadOnlyRow label="Sex" value={fields.sex} />
                <ReadOnlyRow label="Animal Type" value={fields.animalType} />
                <ReadOnlyRow label="Year Born" value={fields.yearBorn} />
                <ReadOnlyRow label="Status" value={fields.status} />
              </>
            )}
          </div>

          {/* ── Flag Section ── */}
          <div>
            <p
              className="font-['Inter'] uppercase mb-3"
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "rgba(26,26,26,0.30)",
              }}
            >
              FLAG
            </p>

            {isEditing ? (
              <div className="space-y-3">
                {/* Flag pill options */}
                <div className="flex gap-2">
                  {flagOptions.map((opt) => {
                    const isActive = fields.flag === opt.color;
                    return (
                      <button
                        key={opt.color}
                        type="button"
                        onClick={() =>
                          setFields((prev) => ({
                            ...prev,
                            flag: isActive ? null : opt.color,
                          }))
                        }
                        className="flex items-center gap-1.5 rounded-full cursor-pointer transition-all duration-150 active:scale-[0.96] font-['Inter']"
                        style={{
                          padding: "6px 14px",
                          fontSize: 12,
                          fontWeight: 600,
                          backgroundColor: isActive ? opt.hex : "transparent",
                          color: isActive ? "#FFFFFF" : opt.hex,
                          border: `1.5px solid ${isActive ? opt.hex : `${opt.hex}40`}`,
                        }}
                      >
                        <FlagIcon color={opt.color} size="sm" />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Flag reason input */}
                <div className="flex items-start gap-3">
                  <label
                    className="shrink-0 text-[#1A1A1A] font-['Inter']"
                    style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
                  >
                    Reason
                  </label>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      placeholder="Flag reason"
                      value={fields.flagReason}
                      onChange={(e) => update("flagReason")(e.target.value)}
                      className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
                      style={{ fontSize: 16, fontWeight: 400 }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {fields.flag ? (
                  <div className="flex items-center gap-2">
                    <FlagIcon color={fields.flag} size="sm" />
                    <span
                      className="font-['Inter']"
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: flagOptions.find((f) => f.color === fields.flag)?.hex || "#55BAAA",
                      }}
                    >
                      {flagLabels[fields.flag]}
                    </span>
                  </div>
                ) : (
                  <p className="font-['Inter']" style={{ fontSize: 13, color: "rgba(26,26,26,0.30)" }}>
                    No flag set
                  </p>
                )}
                {fields.flagReason && (
                  <p className="font-['Inter']" style={{ fontSize: 13, color: "rgba(26,26,26,0.55)", lineHeight: 1.5 }}>
                    {fields.flagReason}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Notes ── */}
          <div>
            <p
              className="font-['Inter'] uppercase mb-3"
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "rgba(26,26,26,0.30)",
              }}
            >
              NOTES
            </p>
            {isEditing ? (
              <textarea
                value={fields.notes}
                onChange={(e) => update("notes")(e.target.value)}
                placeholder="Add notes about this animal…"
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 resize-none"
                style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.5 }}
              />
            ) : (
              <p className="font-['Inter']" style={{ fontSize: 13, color: "rgba(26,26,26,0.70)", lineHeight: 1.5 }}>
                {fields.notes || "No notes"}
              </p>
            )}
          </div>

          {/* ── Quick Notes ── */}
          <div>
            <p
              className="font-['Inter'] uppercase mb-3"
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "rgba(26,26,26,0.30)",
              }}
            >
              QUICK NOTES
            </p>
            <div className="flex flex-wrap gap-2">
              {quickNoteOptions.map((note) => {
                const isSelected = selectedQuickNotes.includes(note);
                return (
                  <button
                    key={note}
                    type="button"
                    onClick={() => toggleQuickNote(note)}
                    className={`px-3 py-1.5 rounded-full border font-['Inter'] transition-all duration-150 ${
                      isEditing ? "cursor-pointer active:scale-[0.96]" : "cursor-default"
                    }`}
                    style={{
                      fontSize: 13,
                      fontWeight: isSelected ? 700 : 500,
                      backgroundColor: isSelected ? "#0E2646" : "white",
                      borderColor: isSelected ? "#0E2646" : "#D4D4D0",
                      color: isSelected ? "white" : isEditing ? "#1A1A1A" : "rgba(26,26,26,0.40)",
                      opacity: !isEditing && !isSelected ? 0.5 : 1,
                    }}
                  >
                    {note}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Bottom Action Bar ── */}
          {isEditing && (
            <div
              className="flex items-center gap-2 pt-2"
              style={{ animation: "fadeIn 0.2s ease-out" }}
            >
              {/* Cancel */}
              <PillButton
                variant="outline"
                size="md"
                onClick={handleCancel}
                style={{ flex: 1 }}
              >
                Cancel
              </PillButton>

              {/* Save — navy background */}
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 inline-flex items-center justify-center rounded-full font-['Inter'] transition-all duration-150 cursor-pointer active:scale-[0.97]"
                style={{
                  padding: "10px 24px",
                  fontSize: 14,
                  fontWeight: 700,
                  backgroundColor: "#0E2646",
                  color: "#FFFFFF",
                  border: "none",
                }}
              >
                Save
              </button>

              {/* Delete icon button */}
              <button
                type="button"
                onClick={handleDelete}
                className="shrink-0 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.95]"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(231,76,60,0.10)",
                  border: "none",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 4H14"
                    stroke="#E74C3C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5.333 4V2.667C5.333 2.298 5.632 2 6 2H10C10.368 2 10.667 2.298 10.667 2.667V4"
                    stroke="#E74C3C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.333 4L4 13.333C4 13.702 4.298 14 4.667 14H11.333C11.702 14 12 13.702 12 13.333L12.667 4"
                    stroke="#E74C3C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M6.667 7V11" stroke="#E74C3C" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M9.333 7V11" stroke="#E74C3C" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}

          {/* ── Read-only: Back button ── */}
          {!isEditing && (
            <div className="pt-2">
              <PillButton variant="outline" size="md" onClick={() => navigate(-1)} style={{ width: "100%" }}>
                Back to Animals
              </PillButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   READ-ONLY ROW — matches FormFieldRow spacing
   ═══════════════════════════════════════════════ */
function ReadOnlyRow({
  label,
  value,
  dotColor,
}: {
  label: string;
  value: string;
  dotColor?: string;
}) {
  return (
    <div className="flex items-center gap-3" style={{ minHeight: 40 }}>
      <span
        className="shrink-0 text-[#1A1A1A] font-['Inter']"
        style={{ width: 105, fontSize: 14, fontWeight: 600, opacity: 0.55 }}
      >
        {label}
      </span>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        {dotColor && (
          <span
            className="shrink-0 rounded-full"
            style={{ width: 8, height: 8, backgroundColor: dotColor }}
          />
        )}
        <span
          className="font-['Inter'] truncate"
          style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
