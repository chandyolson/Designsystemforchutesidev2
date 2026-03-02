import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { FormFieldRow, FormSelectRow } from "./form-field-row";
import { useToast } from "./toast-context";

/* ═══════════════════════════════════════════════
   PRODUCT DATABASE (mock)
   ═══════════════════════════════════════════════ */
interface Product {
  id: string;
  name: string;
  description: string;
  withdrawalDays: number | null; // null = no withdrawal
  defaultRoute: string;
  defaultDosage: string;
}

const PRODUCTS: Product[] = [
  { id: "1", name: "Multimin 90", description: "Mineral supplement - Injectable", withdrawalDays: 21, defaultRoute: "SQ", defaultDosage: "12" },
  { id: "2", name: "Bovi-Shield Gold 5", description: "Modified live virus vaccine", withdrawalDays: null, defaultRoute: "IM", defaultDosage: "2" },
  { id: "3", name: "Ivermectin", description: "Parasiticide - Pour-on / Injectable", withdrawalDays: 35, defaultRoute: "SQ", defaultDosage: "10" },
  { id: "4", name: "Draxxin", description: "Antibiotic - Tulathromycin", withdrawalDays: 18, defaultRoute: "SQ", defaultDosage: "2.5" },
  { id: "5", name: "Excede", description: "Antibiotic - Ceftiofur", withdrawalDays: 13, defaultRoute: "SQ", defaultDosage: "6" },
  { id: "6", name: "Lutalyse", description: "Prostaglandin - Dinoprost", withdrawalDays: null, defaultRoute: "IM", defaultDosage: "5" },
  { id: "7", name: "Banamine", description: "NSAID - Flunixin meglumine", withdrawalDays: 4, defaultRoute: "IV", defaultDosage: "10" },
  { id: "8", name: "LA-200", description: "Antibiotic - Oxytetracycline", withdrawalDays: 28, defaultRoute: "SQ", defaultDosage: "9" },
  { id: "9", name: "Vision 7", description: "Clostridial vaccine - 7 way", withdrawalDays: null, defaultRoute: "SQ", defaultDosage: "2" },
  { id: "10", name: "Dectomax", description: "Parasiticide - Doramectin", withdrawalDays: 35, defaultRoute: "SQ", defaultDosage: "10" },
];

const RECENT_PRODUCT_IDS = ["1", "2", "3"];

const ROUTE_OPTIONS = ["SQ", "IM", "IV", "Oral", "Topical", "Intranasal"];
const LOCATION_OPTIONS = ["Left Neck", "Right Neck", "Left Hip", "Right Hip", "Other"];
const TEAM_MEMBERS = ["John Olson", "Sarah Mitchell", "Dave Krueger", "Amy Torres"];

/* ═══════════════════════════════════════════════
   SECTION LABEL
   ═══════════════════════════════════════════════ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-['Inter'] uppercase"
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: "rgba(14,38,70,0.35)",
        marginBottom: 10,
      }}
    >
      {children}
    </p>
  );
}

/* ═══════════════════════════════════════════════
   TREATMENT ENTRY SCREEN
   ═══════════════════════════════════════════════ */
export function TreatmentEntryScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  /* Product selection */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(PRODUCTS[0]);
  const [showResults, setShowResults] = useState(false);

  /* Form fields */
  const [date, setDate] = useState("2026-02-28");
  const [route, setRoute] = useState("SQ");
  const [dosage, setDosage] = useState("12");
  const [location, setLocation] = useState("Left Neck");
  const [lotNumber, setLotNumber] = useState("");
  const [administeredBy, setAdministeredBy] = useState("John Olson");
  const [notes, setNotes] = useState("");
  const [linkedProject] = useState<string | null>("Spring Preg Check");

  /* Search results */
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery]);

  /* Recent products */
  const recentProducts = PRODUCTS.filter((p) => RECENT_PRODUCT_IDS.includes(p.id));

  /* Withdrawal date calculation */
  const withdrawalDate = useMemo(() => {
    if (!selectedProduct?.withdrawalDays) return null;
    const d = new Date(date);
    d.setDate(d.getDate() + selectedProduct.withdrawalDays);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, [selectedProduct, date]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSearchQuery("");
    setShowResults(false);
    setRoute(product.defaultRoute);
    setDosage(product.defaultDosage);
  };

  const handleSave = () => {
    if (!selectedProduct) {
      showToast("error", "Please select a product");
      return;
    }
    showToast("success", "Treatment recorded successfully");
    setTimeout(() => navigate(-1), 600);
  };

  return (
    <div className="space-y-5">
      {/* ═══════════════════════════════════════════
          SECTION 1 — PRODUCT SELECTION
          ═══════════════════════════════════════════ */}
      <div>
        <SectionLabel>Product</SectionLabel>

        {/* Search input */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width="16" height="16" viewBox="0 0 16 16" fill="none"
          >
            <circle cx="7" cy="7" r="5.25" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="#1A1A1A" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => { if (searchQuery.trim()) setShowResults(true); }}
            className="w-full bg-white border border-[#D4D4D0] rounded-xl pl-10 pr-4 font-['Inter'] text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
            style={{ height: 44, fontSize: 16 }}
          />
        </div>

        {/* Search results dropdown */}
        {showResults && searchResults.length > 0 && (
          <div
            className="mt-1 bg-white border border-[#D4D4D0] rounded-xl overflow-hidden"
            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
          >
            {searchResults.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelectProduct(product)}
                className="w-full text-left px-4 py-3 cursor-pointer hover:bg-[#0E2646]/4 transition-colors border-b border-[#D4D4D0]/50 last:border-b-0"
              >
                <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 14, fontWeight: 600 }}>
                  {product.name}
                </p>
                <p className="font-['Inter']" style={{ fontSize: 12, color: "rgba(26,26,26,0.4)" }}>
                  {product.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Recent product chips */}
        {!selectedProduct && (
          <div className="flex flex-wrap gap-2 mt-3">
            {recentProducts.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectProduct(p)}
                className="rounded-full font-['Inter'] cursor-pointer transition-colors hover:bg-[#0E2646]/10"
                style={{
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  backgroundColor: "rgba(14,38,70,0.06)",
                  color: "#0E2646",
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* Selected product card */}
        {selectedProduct && (
          <div
            className="mt-3 bg-white rounded-xl flex items-center justify-between"
            style={{ border: "1.5px solid #55BAAA", padding: "14px 16px" }}
          >
            <div className="min-w-0 flex-1">
              <p className="font-['Inter'] text-[#0E2646]" style={{ fontSize: 15, fontWeight: 700 }}>
                {selectedProduct.name}
              </p>
              <p className="font-['Inter'] mt-0.5" style={{ fontSize: 12, color: "rgba(26,26,26,0.4)" }}>
                {selectedProduct.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="shrink-0 ml-3 flex items-center justify-center rounded-full cursor-pointer transition-colors hover:bg-[#0E2646]/8"
              style={{ width: 28, height: 28, backgroundColor: "rgba(14,38,70,0.06)" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 3L9 9M9 3L3 9" stroke="#0E2646" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Recent chips when product is selected (compact) */}
        {selectedProduct && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {recentProducts
              .filter((p) => p.id !== selectedProduct.id)
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProduct(p)}
                  className="rounded-full font-['Inter'] cursor-pointer transition-colors hover:bg-[#0E2646]/10"
                  style={{
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: "rgba(14,38,70,0.06)",
                    color: "#0E2646",
                  }}
                >
                  {p.name}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 2 — TREATMENT DETAILS
          ═══════════════════════════════════════════ */}
      <div>
        <SectionLabel>Treatment Details</SectionLabel>
        <div className="space-y-2.5">
          {/* Date field — custom since FormFieldRow doesn't handle date display well */}
          <div className="flex items-start gap-3">
            <label
              className="shrink-0 text-[#1A1A1A] font-['Inter']"
              style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
            >
              Date
            </label>
            <div className="flex-1 min-w-0 relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
                style={{ fontSize: 16, colorScheme: "light" }}
              />
            </div>
          </div>

          <FormSelectRow
            label="Route"
            value={route}
            onChange={setRoute}
            options={ROUTE_OPTIONS}
          />

          {/* Dosage with mL suffix */}
          <div className="flex items-start gap-3">
            <label
              className="shrink-0 text-[#1A1A1A] font-['Inter']"
              style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
            >
              Dosage
            </label>
            <div className="flex-1 min-w-0 relative">
              <input
                type="text"
                inputMode="decimal"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full h-[40px] px-3 pr-10 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
                style={{ fontSize: 16 }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 font-['Inter'] pointer-events-none"
                style={{ fontSize: 13, fontWeight: 600, color: "rgba(26,26,26,0.35)" }}
              >
                mL
              </span>
            </div>
          </div>

          <FormSelectRow
            label="Location"
            value={location}
            onChange={setLocation}
            options={LOCATION_OPTIONS}
          />

          <FormFieldRow
            label="Lot Number"
            placeholder="Optional"
            value={lotNumber}
            onChange={setLotNumber}
          />

          <FormSelectRow
            label="Admin. By"
            value={administeredBy}
            onChange={setAdministeredBy}
            options={TEAM_MEMBERS}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 3 — WITHDRAWAL (conditional)
          ═══════════════════════════════════════════ */}
      {selectedProduct?.withdrawalDays && withdrawalDate && (
        <div
          className="rounded-xl flex items-start gap-3"
          style={{
            backgroundColor: "#FFF8E1",
            border: "1px solid rgba(243,209,42,0.30)",
            padding: "14px 16px",
          }}
        >
          {/* Clock icon */}
          <svg
            className="shrink-0 mt-0.5"
            width="20" height="20" viewBox="0 0 20 20" fill="none"
          >
            <circle cx="10" cy="10" r="8.25" stroke="#B8860B" strokeWidth="1.5" />
            <path d="M10 5.5V10L13 12.5" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="font-['Inter']" style={{ fontSize: 14, fontWeight: 600, color: "#B8860B" }}>
              Meat Withdrawal: {selectedProduct.withdrawalDays} days
            </p>
            <p className="font-['Inter'] mt-0.5" style={{ fontSize: 12, color: "rgba(184,134,11,0.6)" }}>
              Do not sell before {withdrawalDate}
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          SECTION 4 — NOTES
          ═══════════════════════════════════════════ */}
      <div>
        <SectionLabel>Notes</SectionLabel>
        <div className="relative">
          <textarea
            placeholder="Treatment notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2.5 pr-12 rounded-xl bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all resize-none"
            style={{ fontSize: 16 }}
          />
          {/* Mic button */}
          <button
            type="button"
            className="absolute right-2.5 top-2.5 flex items-center justify-center rounded-full cursor-pointer transition-colors hover:bg-[#55BAAA]/15"
            style={{ width: 32, height: 32, backgroundColor: "rgba(85,186,170,0.08)" }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="5" y="1" width="5" height="8.5" rx="2.5" stroke="#55BAAA" strokeWidth="1.4" />
              <path d="M3 7.5C3 9.98528 5.01472 12 7.5 12C9.98528 12 12 9.98528 12 7.5" stroke="#55BAAA" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M7.5 12V14" stroke="#55BAAA" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 5 — LINKED PROJECT
          ═══════════════════════════════════════════ */}
      {linkedProject && (
        <div
          className="rounded-lg flex items-center justify-between"
          style={{
            backgroundColor: "rgba(14,38,70,0.04)",
            padding: "10px 14px",
          }}
        >
          <p className="font-['Inter']" style={{ fontSize: 12, fontWeight: 500, color: "#55BAAA" }}>
            Linked to: {linkedProject}
          </p>
          <button
            type="button"
            className="shrink-0 ml-2 flex items-center justify-center cursor-pointer rounded transition-colors hover:bg-[#0E2646]/8"
            style={{ width: 24, height: 24 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M8.5 5.5L5.5 8.5M5 3.5L6.5 2C7.88071 0.619288 10.1193 0.619288 11.5 2C12.8807 3.38071 12.8807 5.61929 11.5 7L10 8.5M9 10.5L7.5 12C6.11929 13.3807 3.88071 13.3807 2.5 12C1.11929 10.6193 1.11929 8.38071 2.5 7L4 5.5"
                stroke="#55BAAA"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Break in the chain */}
              <path d="M4.5 4.5L3 3" stroke="#55BAAA" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M9.5 9.5L11 11" stroke="#55BAAA" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          BOTTOM BUTTONS
          ═══════════════════════════════════════════ */}
      <div className="flex gap-3 pt-2 pb-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 rounded-xl font-['Inter'] cursor-pointer transition-colors hover:bg-[#0E2646]/6"
          style={{
            height: 48,
            fontSize: 15,
            fontWeight: 600,
            color: "#0E2646",
            border: "1.5px solid #D4D4D0",
            backgroundColor: "transparent",
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 rounded-xl font-['Inter'] cursor-pointer transition-colors hover:opacity-90"
          style={{
            height: 48,
            fontSize: 15,
            fontWeight: 700,
            color: "#0E2646",
            backgroundColor: "#F3D12A",
            border: "1.5px solid #F3D12A",
          }}
        >
          Save Treatment
        </button>
      </div>
    </div>
  );
}