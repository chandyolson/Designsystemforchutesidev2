import { useState } from "react";
import { useNavigate } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { CollapsibleSection } from "./collapsible-section";
import { PillButton } from "./pill-button";
import { useToast } from "./toast-context";
import { DuplicateAnimalWarning } from "./duplicate-animal-warning";
import type { DuplicateAnimal } from "./duplicate-animal-warning";

/* ── Mock existing herd for duplicate detection ── */
const existingAnimals: DuplicateAnimal[] = [
  { tag: "5520", tagColor: "Yellow", sex: "Cow", yearBorn: "2021", status: "Active", flag: "teal" },
  { tag: "3309", tagColor: "Pink", sex: "Cow", yearBorn: "2020", status: "Active", flag: "teal" },
  { tag: "8841", tagColor: "Green", sex: "Bull", yearBorn: "2025", status: "Active", flag: null },
];

export function AddAnimalScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  /* Pre-fill with "5520" and show dialog for demo */
  const [duplicateMatch, setDuplicateMatch] = useState<DuplicateAnimal | null>(
    existingAnimals.find((a) => a.tag === "5520") ?? null
  );
  const [fields, setFields] = useState({
    tag: "5520",
    tagColor: "Yellow",
    eid: "",
    eid2: "",
    otherId: "",
    lifetimeId: "",
    sex: "Cow",
    animalType: "Cow",
    yearBorn: "2021",
    status: "Active",
    sire: "",
    dam: "",
    regName: "",
    regNo: "",
    notes: "",
  });

  const update = (key: keyof typeof fields) => (val: string) =>
    setFields((prev) => ({ ...prev, [key]: val }));

  /* ── Duplicate check on save ── */
  const handleSave = () => {
    const tag = fields.tag.trim();
    if (!tag) {
      showToast("error", "Tag number is required");
      return;
    }
    const match = existingAnimals.find((a) => a.tag === tag);
    if (match) {
      setDuplicateMatch(match);
      return;
    }
    confirmSave();
  };

  const confirmSave = () => {
    setDuplicateMatch(null);
    showToast("success", `Animal ${fields.tag} added successfully`);
    navigate("/animals");
  };

  return (
    <div className="space-y-5">
      {/* ── Core Fields ── */}
      <div className="space-y-2.5">
        <FormFieldRow label="Tag" value={fields.tag} onChange={update("tag")} placeholder="Tag number" />
        <FormSelectRow label="Tag Color" value={fields.tagColor} onChange={update("tagColor")} placeholder="Select color" options={["Pink", "Yellow", "Orange", "Green", "Blue", "White", "Red", "Purple", "No Tag"]} />
        <FormFieldRow label="EID" value={fields.eid} onChange={update("eid")} placeholder="Electronic ID" />
        <FormSelectRow label="Sex" value={fields.sex} onChange={update("sex")} placeholder="Select sex" options={["Bull", "Cow", "Steer", "Spayed Heifer", "Heifer"]} />
        <FormSelectRow label="Animal Type" value={fields.animalType} onChange={update("animalType")} placeholder="Select type" options={["Calf", "Yearling", "Feeder", "Cow", "Bull", "Replacement Heifer"]} />
        <FormSelectRow label="Year Born" value={fields.yearBorn} onChange={update("yearBorn")} placeholder="Select year" options={["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"]} />
        <FormSelectRow label="Status" value={fields.status} onChange={update("status")} placeholder="Select status" options={["Active", "Dead", "Sold"]} />
        {/* ── Notes ── */}
        <div className="space-y-2 pt-1">
          <p className="text-[#1A1A1A] font-['Inter']" style={{ fontSize: 14, fontWeight: 600 }}>
            Notes
          </p>
          <textarea
            value={fields.notes}
            onChange={(e) => update("notes")(e.target.value)}
            placeholder="Additional notes about this animal…"
            className="w-full h-[100px] px-3 py-2.5 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all resize-none"
            style={{ fontSize: 16, fontWeight: 400 }}
          />
        </div>
      </div>

      {/* ── ID Details (collapsed) ── */}
      <CollapsibleSection title="ID Details">
        <div className="space-y-2.5 pt-2">
          <FormFieldRow label="EID 2" value={fields.eid2} onChange={update("eid2")} placeholder="Secondary Electronic ID" />
          <FormFieldRow label="Other ID" value={fields.otherId} onChange={update("otherId")} placeholder="Other identifier" />
          <FormFieldRow label="Lifetime ID" value={fields.lifetimeId} onChange={update("lifetimeId")} placeholder="Lifetime identifier" />
        </div>
      </CollapsibleSection>

      {/* ── Pedigree (collapsed) ── */}
      <CollapsibleSection title="Pedigree">
        <div className="space-y-2.5 pt-2">
          <FormFieldRow label="Sire" value={fields.sire} onChange={update("sire")} placeholder="Sire tag or name" />
          <FormFieldRow label="Dam" value={fields.dam} onChange={update("dam")} placeholder="Dam tag or name" />
          <FormFieldRow label="Reg. Name" value={fields.regName} onChange={update("regName")} placeholder="Registration name" />
          <FormFieldRow label="Reg. No." value={fields.regNo} onChange={update("regNo")} placeholder="Registration number" />
        </div>
      </CollapsibleSection>

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2">
        <PillButton variant="outline" size="md" onClick={() => navigate(-1)} style={{ flex: 1 }}>
          Cancel
        </PillButton>
        <PillButton size="md" onClick={handleSave} style={{ flex: 1 }}>
          Save Animal
        </PillButton>
      </div>

      {/* ── Duplicate Warning Dialog ── */}
      {duplicateMatch && (
        <DuplicateAnimalWarning
          animal={duplicateMatch}
          onViewExisting={() => {
            setDuplicateMatch(null);
            navigate(`/animals/${duplicateMatch.tag}`);
          }}
          onAddAnyway={confirmSave}
          onCancel={() => setDuplicateMatch(null)}
        />
      )}
    </div>
  );
}