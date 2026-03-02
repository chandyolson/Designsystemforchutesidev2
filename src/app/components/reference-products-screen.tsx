import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useToast } from "./toast-context";
import { useDeleteConfirm } from "./delete-confirmation";

/* ══════════════════════════════════════════
   Types & Data
   ══════════════════════════════════════════ */
type ProductCategory = "Vaccine" | "Antibiotic" | "Supplement" | "Parasiticide" | "Other";
type Route = "SQ" | "IM" | "IV" | "Oral" | "Topical" | "Intranasal";
type DosageBasis = "Fixed" | "Per 100 lbs";

interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  route: Route;
  dosage: string;
  dosageBasis: DosageBasis;
  meatWithdrawal?: number;
  milkWithdrawal?: number;
}

const CATEGORY_PILL_STYLES: Record<ProductCategory, { bg: string; color: string }> = {
  Vaccine:      { bg: "#E3F2FD", color: "#1565C0" },
  Antibiotic:   { bg: "#FFF3E0", color: "#E65100" },
  Supplement:   { bg: "#E8F5E9", color: "#2E7D32" },
  Parasiticide: { bg: "#F3E5F5", color: "#6A1B9A" },
  Other:        { bg: "rgba(14,38,70,0.08)", color: "#0E2646" },
};

const FILTER_CATEGORIES: (ProductCategory | "All")[] = ["All", "Vaccine", "Antibiotic", "Supplement", "Parasiticide"];
const CATEGORY_OPTIONS: ProductCategory[] = ["Vaccine", "Antibiotic", "Supplement", "Parasiticide", "Other"];
const ROUTE_OPTIONS: Route[] = ["SQ", "IM", "IV", "Oral", "Topical", "Intranasal"];
const DOSAGE_BASIS_OPTIONS: DosageBasis[] = ["Fixed", "Per 100 lbs"];

const initialProducts: Product[] = [
  { id: "p1", name: "Multimin 90", category: "Supplement", route: "SQ", dosage: "1", dosageBasis: "Per 100 lbs", meatWithdrawal: 21 },
  { id: "p2", name: "Bovi-Shield Gold 5", category: "Vaccine", route: "SQ", dosage: "2", dosageBasis: "Fixed" },
  { id: "p3", name: "Ivermectin", category: "Parasiticide", route: "SQ", dosage: "1", dosageBasis: "Per 100 lbs", meatWithdrawal: 35 },
  { id: "p4", name: "Draxxin", category: "Antibiotic", route: "SQ", dosage: "1.1", dosageBasis: "Per 100 lbs", meatWithdrawal: 64 },
  { id: "p5", name: "Vista Once SQ", category: "Vaccine", route: "SQ", dosage: "2", dosageBasis: "Fixed" },
  { id: "p6", name: "Excede", category: "Antibiotic", route: "SQ", dosage: "1.5", dosageBasis: "Per 100 lbs", meatWithdrawal: 13 },
  { id: "p7", name: "Lutalyse", category: "Supplement", route: "IM", dosage: "5", dosageBasis: "Fixed" },
  { id: "p8", name: "Safeguard", category: "Parasiticide", route: "Oral", dosage: "2.3", dosageBasis: "Per 100 lbs", meatWithdrawal: 8 },
];

/* ══════════════════════════════════════════
   Icons
   ══════════════════════════════════════════ */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <circle cx="7" cy="7" r="5" stroke="#1A1A1A" strokeOpacity="0.30" strokeWidth="1.4" />
      <path d="M11 11L14 14" stroke="#1A1A1A" strokeOpacity="0.30" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" fill="#1A1A1A" fillOpacity="0.10" />
      <path d="M5 5L9 9M9 5L5 9" stroke="#1A1A1A" strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3.75V14.25M3.75 9H14.25" stroke="#0E2646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3.5" r="1.25" fill="#0E2646" fillOpacity="0.45" />
      <circle cx="8" cy="8" r="1.25" fill="#0E2646" fillOpacity="0.45" />
      <circle cx="8" cy="12.5" r="1.25" fill="#0E2646" fillOpacity="0.45" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M6 4L10 8L6 12" stroke="#1A1A1A" strokeOpacity="0.20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="#0E2646" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity={0.3} />
    </svg>
  );
}

/* ══════════════════════════════════════════
   Category Pill
   ══════════════════════════════════════════ */
function CategoryPill({ category }: { category: ProductCategory }) {
  const s = CATEGORY_PILL_STYLES[category];
  return (
    <span
      className="inline-flex items-center rounded-full font-['Inter']"
      style={{
        padding: "1px 8px",
        fontSize: 10,
        fontWeight: 700,
        backgroundColor: s.bg,
        color: s.color,
      }}
    >
      {category}
    </span>
  );
}

/* ══════════════════════════════════════════
   Withdrawal Pill
   ══════════════════════════════════════════ */
function WithdrawalPill({ days }: { days: number }) {
  return (
    <span
      className="inline-flex items-center rounded-full font-['Inter']"
      style={{
        padding: "1px 8px",
        fontSize: 10,
        fontWeight: 700,
        backgroundColor: "#FFF8E1",
        border: "1px solid rgba(243,209,42,0.30)",
        color: "#B8860B",
      }}
    >
      WD: {days}d
    </span>
  );
}

/* ══════════════════════════════════════════
   Filter Dropdown
   ══════════════════════════════════════════ */
function FilterDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options = ["Name A-Z", "Name Z-A", "Category", "Withdrawal Days"];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 cursor-pointer rounded-lg border border-[#D4D4D0] bg-white px-3 font-['Inter'] transition-colors hover:bg-[#F5F5F0]"
        style={{ height: 36, fontSize: 12, fontWeight: 600, color: "#0E2646" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1.75 3.5H12.25M3.5 7H10.5M5.25 10.5H8.75" stroke="#0E2646" strokeOpacity="0.5" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        Sort
        <ChevronDown />
      </button>
      {open && (
        <div className="absolute left-0 top-[40px] z-20 w-40 rounded-xl bg-white border border-[#D4D4D0] shadow-lg overflow-hidden font-['Inter']">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-3.5 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
              style={{
                fontSize: 13,
                fontWeight: opt === value ? 600 : 400,
                color: "#1A1A1A",
                background: opt === value ? "#F5F5F0" : "none",
                border: "none",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   3-Dot Actions Dropdown
   ══════════════════════════════════════════ */
function ActionsDropdown({ onExport }: { onExport: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center cursor-pointer rounded-lg border border-[#D4D4D0] bg-white transition-colors hover:bg-[#F5F5F0]"
        style={{ width: 32, height: 36 }}
        aria-label="Actions"
      >
        <DotsIcon />
      </button>
      {open && (
        <div className="absolute right-0 top-[40px] z-20 w-44 rounded-xl bg-white border border-[#D4D4D0] shadow-lg overflow-hidden font-['Inter']">
          {["Export Products", "Import Products"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setOpen(false);
                if (item === "Export Products") onExport();
              }}
              className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
              style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", background: "none", border: "none" }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Inline Form Label
   ══════════════════════════════════════════ */
function FormLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      className="block font-['Inter'] mb-1.5"
      style={{ fontSize: 12, fontWeight: 600, color: "rgba(26,26,26,0.50)" }}
    >
      {children}
      {required && (
        <span style={{ color: "#E74C3C", marginLeft: 2 }}>*</span>
      )}
    </label>
  );
}

/* ══════════════════════════════════════════
   SCREEN
   ══════════════════════════════════════════ */
export function ReferenceProductsScreen() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ProductCategory | "All">("All");
  const [sortBy, setSortBy] = useState("Name A-Z");
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();
  const { showDeleteConfirm } = useDeleteConfirm();
  const navigate = useNavigate();

  /* ── Add Form state ── */
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<ProductCategory | "">("");
  const [formRoute, setFormRoute] = useState<Route | "">("");
  const [formDosage, setFormDosage] = useState("");
  const [formBasis, setFormBasis] = useState<DosageBasis | "">("");
  const [formMeatWd, setFormMeatWd] = useState("");
  const [formMilkWd, setFormMilkWd] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const formRef = useRef<HTMLDivElement>(null);

  /* ── Filtered + sorted list ── */
  const displayed = useMemo(() => {
    let list = [...products];

    // Category filter
    if (activeFilter !== "All") {
      list = list.filter((p) => p.category === activeFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.route.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "Name A-Z":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Name Z-A":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Category":
        list.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "Withdrawal Days":
        list.sort((a, b) => (b.meatWithdrawal ?? 0) - (a.meatWithdrawal ?? 0));
        break;
    }

    return list;
  }, [products, activeFilter, search, sortBy]);

  /* ── Helpers ── */
  function formatDosage(p: Product): string {
    if (p.dosageBasis === "Per 100 lbs") {
      return `${p.dosage} mL/100 lbs`;
    }
    return `${p.dosage} mL`;
  }

  function resetForm() {
    setFormName("");
    setFormCategory("");
    setFormRoute("");
    setFormDosage("");
    setFormBasis("");
    setFormMeatWd("");
    setFormMilkWd("");
    setFormErrors({});
  }

  function handleSave() {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = "Product name is required";
    if (!formCategory) errors.category = "Select a category";
    if (!formRoute) errors.route = "Select a route";
    if (!formDosage.trim()) errors.dosage = "Enter a dosage";
    if (!formBasis) errors.basis = "Select dosage basis";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newProduct: Product = {
      id: `p${Date.now()}`,
      name: formName.trim(),
      category: formCategory as ProductCategory,
      route: formRoute as Route,
      dosage: formDosage.trim(),
      dosageBasis: formBasis as DosageBasis,
      meatWithdrawal: formMeatWd ? parseInt(formMeatWd) : undefined,
      milkWithdrawal: formMilkWd ? parseInt(formMilkWd) : undefined,
    };

    setProducts((prev) => [...prev, newProduct]);
    setShowForm(false);
    resetForm();
    showToast("success", `${newProduct.name} added`);
  }

  function handleOpenForm() {
    setShowForm(true);
    resetForm();
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  /* ── Input style ── */
  const inputClass = (error?: string) =>
    `w-full h-[44px] px-3 rounded-lg bg-white border text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all ${
      error
        ? "border-[#E74C3C] focus:border-[#E74C3C] focus:ring-2 focus:ring-[#E74C3C]/25"
        : "border-[#D4D4D0] focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
    }`;

  const selectClass = (error?: string) =>
    `w-full h-[44px] px-3 pr-8 rounded-lg bg-white border text-[#1A1A1A] font-['Inter'] outline-none transition-all appearance-none cursor-pointer ${
      error
        ? "border-[#E74C3C] focus:border-[#E74C3C] focus:ring-2 focus:ring-[#E74C3C]/25"
        : "border-[#D4D4D0] focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25"
    }`;

  return (
    <div className="font-['Inter']" style={{ padding: 20 }}>
      {/* ═══════════════════════════════
         TOOLBAR
         ═══════════════════════════════ */}
      <div className="flex items-center gap-2 mb-4">
        {/* + Add button */}
        <button
          type="button"
          onClick={handleOpenForm}
          className="flex items-center justify-center rounded-full cursor-pointer transition-all hover:brightness-95 active:scale-[0.97]"
          style={{
            width: 36,
            height: 36,
            backgroundColor: "#F3D12A",
            border: "none",
          }}
        >
          <PlusIcon />
        </button>

        <div className="flex-1" />

        <FilterDropdown value={sortBy} onChange={setSortBy} />
        <ActionsDropdown onExport={() => showToast("info", "Export started")} />
      </div>

      {/* ═══════════════════════════════
         FILTER CHIPS
         ═══════════════════════════════ */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        {FILTER_CATEGORIES.map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className="shrink-0 rounded-full cursor-pointer font-['Inter'] transition-all active:scale-[0.97]"
              style={{
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 600,
                color: isActive ? "#FFFFFF" : "#1A1A1A",
                backgroundColor: isActive ? "#0E2646" : "#FFFFFF",
                border: isActive ? "1px solid #0E2646" : "1px solid #D4D4D0",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════
         SEARCH BAR
         ═══════════════════════════════ */}
      <div className="relative mb-4">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#D4D4D0] rounded-xl pl-9 pr-9 font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none transition-all focus:border-[#55BAAA] focus:ring-2 focus:ring-[#55BAAA]/20"
          style={{ height: 40, fontSize: 16, fontWeight: 400, color: "#1A1A1A" }}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ background: "none", border: "none" }}
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {/* ═══════════════════════════════
         PRODUCT LIST
         ═══════════════════════════════ */}
      {displayed.length > 0 ? (
        <div className="rounded-xl bg-white border border-[#D4D4D0]/60 overflow-hidden divide-y divide-[#D4D4D0]/40 mb-6">
          {displayed.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 transition-colors hover:bg-[#F5F5F0] cursor-pointer"
              style={{ padding: "14px 16px" }}
              onClick={() => navigate(`/reference/products/${product.id}`)}
            >
              {/* Left content */}
              <div className="flex-1 min-w-0">
                <p
                  className="truncate"
                  style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.3 }}
                >
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <CategoryPill category={product.category} />
                  <span
                    style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.40)" }}
                  >
                    {product.route} · {formatDosage(product)}
                  </span>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2.5 shrink-0">
                {product.meatWithdrawal && (
                  <WithdrawalPill days={product.meatWithdrawal} />
                )}
                <ChevronRight />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="rounded-xl bg-white border border-[#D4D4D0]/60 flex flex-col items-center justify-center mb-6"
          style={{ padding: "40px 20px" }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-3">
            <circle cx="16" cy="16" r="14" stroke="#D4D4D0" strokeWidth="1.5" />
            <path d="M12 16H20M16 12V20" stroke="#D4D4D0" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}>
            No products found
          </p>
          <p className="mt-1" style={{ fontSize: 12, fontWeight: 400, color: "rgba(26,26,26,0.20)" }}>
            {search ? "Try a different search term" : "Add a product to get started"}
          </p>
        </div>
      )}

      {/* ═══════════════════════════════
         INLINE ADD FORM
         ═══════════════════════════════ */}
      {showForm && (
        <div ref={formRef} className="mb-6">
          {/* Section label */}
          <div className="flex items-center justify-between mb-3 px-1">
            <p
              className="text-[#0E2646] font-['Inter'] uppercase"
              style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", opacity: 0.35 }}
            >
              Add Product
            </p>
          </div>

          <div
            className="rounded-xl bg-white border border-[#D4D4D0]/60 overflow-hidden"
            style={{ padding: 16 }}
          >
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <FormLabel required>Product Name</FormLabel>
                <input
                  type="text"
                  placeholder="e.g. Bovi-Shield Gold 5"
                  value={formName}
                  onChange={(e) => { setFormName(e.target.value); setFormErrors((p) => ({ ...p, name: "" })); }}
                  className={inputClass(formErrors.name)}
                  style={{ fontSize: 16, fontWeight: 400 }}
                  autoFocus
                />
                {formErrors.name && (
                  <p className="mt-1" style={{ fontSize: 12, fontWeight: 500, color: "#E74C3C" }}>
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <FormLabel required>Category</FormLabel>
                <div className="relative">
                  <select
                    value={formCategory}
                    onChange={(e) => { setFormCategory(e.target.value as ProductCategory); setFormErrors((p) => ({ ...p, category: "" })); }}
                    className={selectClass(formErrors.category)}
                    style={{ fontSize: 16, fontWeight: 400, color: formCategory ? "#1A1A1A" : "rgba(26,26,26,0.30)" }}
                  >
                    <option value="" disabled>Select category…</option>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={14} />
                  </div>
                </div>
                {formErrors.category && (
                  <p className="mt-1" style={{ fontSize: 12, fontWeight: 500, color: "#E74C3C" }}>
                    {formErrors.category}
                  </p>
                )}
              </div>

              {/* Route */}
              <div>
                <FormLabel required>Route</FormLabel>
                <div className="relative">
                  <select
                    value={formRoute}
                    onChange={(e) => { setFormRoute(e.target.value as Route); setFormErrors((p) => ({ ...p, route: "" })); }}
                    className={selectClass(formErrors.route)}
                    style={{ fontSize: 16, fontWeight: 400, color: formRoute ? "#1A1A1A" : "rgba(26,26,26,0.30)" }}
                  >
                    <option value="" disabled>Select route…</option>
                    {ROUTE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={14} />
                  </div>
                </div>
                {formErrors.route && (
                  <p className="mt-1" style={{ fontSize: 12, fontWeight: 500, color: "#E74C3C" }}>
                    {formErrors.route}
                  </p>
                )}
              </div>

              {/* Default Dosage */}
              <div>
                <FormLabel required>Default Dosage</FormLabel>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 2"
                    value={formDosage}
                    onChange={(e) => { setFormDosage(e.target.value); setFormErrors((p) => ({ ...p, dosage: "" })); }}
                    className={inputClass(formErrors.dosage)}
                    style={{ fontSize: 16, fontWeight: 400, paddingRight: 44 }}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 font-['Inter']"
                    style={{ fontSize: 13, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}
                  >
                    mL
                  </span>
                </div>
                {formErrors.dosage && (
                  <p className="mt-1" style={{ fontSize: 12, fontWeight: 500, color: "#E74C3C" }}>
                    {formErrors.dosage}
                  </p>
                )}
              </div>

              {/* Dosage Basis */}
              <div>
                <FormLabel required>Dosage Basis</FormLabel>
                <div className="relative">
                  <select
                    value={formBasis}
                    onChange={(e) => { setFormBasis(e.target.value as DosageBasis); setFormErrors((p) => ({ ...p, basis: "" })); }}
                    className={selectClass(formErrors.basis)}
                    style={{ fontSize: 16, fontWeight: 400, color: formBasis ? "#1A1A1A" : "rgba(26,26,26,0.30)" }}
                  >
                    <option value="" disabled>Select basis…</option>
                    {DOSAGE_BASIS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={14} />
                  </div>
                </div>
                {formErrors.basis && (
                  <p className="mt-1" style={{ fontSize: 12, fontWeight: 500, color: "#E74C3C" }}>
                    {formErrors.basis}
                  </p>
                )}
              </div>

              {/* Meat Withdrawal */}
              <div>
                <FormLabel>Meat Withdrawal</FormLabel>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Optional"
                    value={formMeatWd}
                    onChange={(e) => setFormMeatWd(e.target.value.replace(/\D/g, ""))}
                    className={inputClass()}
                    style={{ fontSize: 16, fontWeight: 400, paddingRight: 52 }}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 font-['Inter']"
                    style={{ fontSize: 13, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}
                  >
                    days
                  </span>
                </div>
              </div>

              {/* Milk Withdrawal */}
              <div>
                <FormLabel>Milk Withdrawal</FormLabel>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Optional"
                    value={formMilkWd}
                    onChange={(e) => setFormMilkWd(e.target.value.replace(/\D/g, ""))}
                    className={inputClass()}
                    style={{ fontSize: 16, fontWeight: 400, paddingRight: 52 }}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 font-['Inter']"
                    style={{ fontSize: 13, fontWeight: 600, color: "rgba(26,26,26,0.30)" }}
                  >
                    days
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="flex-1 rounded-xl cursor-pointer font-['Inter'] transition-all hover:bg-[#F5F5F0] active:scale-[0.98]"
                style={{
                  height: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "rgba(26,26,26,0.45)",
                  border: "1.5px solid #D4D4D0",
                  background: "white",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-xl cursor-pointer font-['Inter'] transition-all hover:brightness-95 active:scale-[0.98]"
                style={{
                  height: 44,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0E2646",
                  backgroundColor: "#F3D12A",
                  border: "none",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}