import { useState, useRef, useEffect } from "react";

/* ── Shared animal list for pickers ── */
const herdAnimals = [
  { tag: "4782", type: "COW", sex: "Cow", yearBorn: "2020" },
  { tag: "3091", type: "COW", sex: "Cow", yearBorn: "2021" },
  { tag: "5520", type: "COW", sex: "Cow", yearBorn: "2019" },
  { tag: "2218", type: "COW", sex: "Cow", yearBorn: "2018" },
  { tag: "6610", type: "COW", sex: "Cow", yearBorn: "2022" },
  { tag: "7801", type: "COW", sex: "Cow", yearBorn: "2017" },
  { tag: "1134", type: "HEIFER", sex: "Heifer", yearBorn: "2024" },
  { tag: "9027", type: "BULL", sex: "Bull", yearBorn: "2019" },
  { tag: "4455", type: "COW", sex: "Cow", yearBorn: "2020" },
  { tag: "3320", type: "STEER", sex: "Steer", yearBorn: "2023" },
  { tag: "8812", type: "COW", sex: "Cow", yearBorn: "2021" },
  { tag: "5501", type: "COW", sex: "Cow", yearBorn: "2020" },
  { tag: "7744", type: "HEIFER", sex: "Heifer", yearBorn: "2024" },
  { tag: "2290", type: "COW", sex: "Cow", yearBorn: "2019" },
  { tag: "3309", type: "COW", sex: "Cow", yearBorn: "2020" },
];

interface AnimalPickerRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Optionally filter to specific sex types, e.g. ["Bull"] for sire */
  filterSex?: string[];
}

export function AnimalPickerRow({
  label,
  value,
  onChange,
  placeholder = "Search by tag…",
  filterSex,
}: AnimalPickerRowProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const baseList = filterSex
    ? herdAnimals.filter((a) => filterSex.some((s) => s.toLowerCase() === a.sex.toLowerCase()))
    : herdAnimals;

  const filtered = search
    ? baseList.filter((a) => a.tag.includes(search))
    : baseList;

  const selectedAnimal = herdAnimals.find((a) => a.tag === value);

  const handleSelect = (tag: string) => {
    onChange(tag);
    setOpen(false);
    setSearch("");
  };

  const handleClear = () => {
    onChange("");
    setSearch("");
    setOpen(false);
  };

  return (
    <div className="flex items-start gap-3" ref={containerRef}>
      <label
        className="shrink-0 text-[#1A1A1A] font-['Inter']"
        style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
      >
        {label}
      </label>
      <div className="flex-1 min-w-0 relative">
        {/* Input / display */}
        {value && !open ? (
          <button
            type="button"
            onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
            className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] font-['Inter'] text-left flex items-center gap-2 cursor-pointer transition-all hover:border-[#F3D12A]"
            style={{ fontSize: 16 }}
          >
            <span className="text-[#1A1A1A]" style={{ fontWeight: 600 }}>
              {selectedAnimal?.tag || value}
            </span>
            {selectedAnimal && (
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(26,26,26,0.4)" }}>
                {selectedAnimal.sex} · {selectedAnimal.yearBorn}
              </span>
            )}
            <span className="ml-auto flex items-center gap-1.5">
              {/* Clear button */}
              <span
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                className="rounded-full flex items-center justify-center transition-colors hover:bg-[#F5F5F0]"
                style={{ width: 20, height: 20 }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 2L8 8M8 2L2 8" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </button>
        ) : (
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); if (!open) setOpen(true); }}
            onFocus={() => setOpen(true)}
            className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
            style={{ fontSize: 16, fontWeight: 400 }}
          />
        )}

        {/* Dropdown */}
        {open && (
          <div
            className="absolute left-0 right-0 top-full mt-1.5 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-30 font-['Inter']"
            style={{ maxHeight: 220, overflowY: "auto", boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
          >
            {filtered.length === 0 ? (
              <div className="px-4 py-3" style={{ fontSize: 13, fontWeight: 500, color: "rgba(26,26,26,0.35)" }}>
                No animals found
              </div>
            ) : (
              filtered.map((animal) => {
                const isSelected = animal.tag === value;
                return (
                  <button
                    key={animal.tag}
                    type="button"
                    onClick={() => handleSelect(animal.tag)}
                    className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0] flex items-center gap-2.5"
                    style={{ backgroundColor: isSelected ? "rgba(85,186,170,0.06)" : undefined }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: isSelected ? 700 : 600,
                        color: isSelected ? "#55BAAA" : "#1A1A1A",
                      }}
                    >
                      {animal.tag}
                    </span>
                    <span
                      className="rounded-full"
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "1px 7px",
                        backgroundColor: animal.sex === "Bull" ? "rgba(14,38,70,0.08)" : "rgba(232,160,191,0.15)",
                        color: animal.sex === "Bull" ? "#0E2646" : "#C27A9A",
                      }}
                    >
                      {animal.sex}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(26,26,26,0.35)" }}>
                      {animal.yearBorn}
                    </span>
                    {isSelected && (
                      <svg className="ml-auto" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7L6 10L11 4" stroke="#55BAAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
