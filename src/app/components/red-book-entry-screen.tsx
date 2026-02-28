import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PillButton } from "./pill-button";

const categories = ["Invoice/Receipt", "Cattle Note", "Computer Document", "Repairs"];

/* ── Mock attachment data ── */
const mockAttachments = [
  { id: "a1", name: "invoice_scan.jpg", type: "image" },
  { id: "a2", name: "receipt_photo.jpg", type: "image" },
];

export function RedBookEntryScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === "new" || !id;

  const [title, setTitle] = useState(isNew ? "" : "Vet Invoice — February");
  const [category, setCategory] = useState(isNew ? "" : "Invoice/Receipt");
  const [body, setBody] = useState(
    isNew ? "" : "Dr. Miller visit for preg checking 45 head. Total: $675.00. Includes mileage and supplies."
  );
  const [catOpen, setCatOpen] = useState(false);

  return (
    <div className="space-y-5">
      {/* ── Title ── */}
      <div className="flex items-center gap-3">
        <label
          className="shrink-0 text-[#1A1A1A] font-['Inter']"
          style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
        >
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title…"
          className="flex-1 min-w-0 h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all"
          style={{ fontSize: 14, fontWeight: 400 }}
        />
      </div>

      {/* ── Category Dropdown ── */}
      <div className="flex items-center gap-3 relative">
        <label
          className="shrink-0 text-[#1A1A1A] font-['Inter']"
          style={{ width: 105, fontSize: 14, fontWeight: 600, lineHeight: "40px" }}
        >
          Category
        </label>
        <div className="flex-1 min-w-0 relative">
          <button
            type="button"
            onClick={() => setCatOpen((v) => !v)}
            className="w-full h-[40px] px-3 rounded-lg bg-white border border-[#D4D4D0] text-left font-['Inter'] flex items-center justify-between cursor-pointer"
            style={{ fontSize: 14, fontWeight: 400, color: category ? "#1A1A1A" : "rgba(26,26,26,0.3)" }}
          >
            <span className="truncate">{category || "Select category…"}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 transition-transform duration-200" style={{ transform: catOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
              <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
            </svg>
          </button>
          {catOpen && (
            <div
              className="absolute left-0 right-0 top-full mt-1 rounded-xl bg-white border border-[#D4D4D0]/80 overflow-hidden z-20 font-['Inter']"
              style={{ boxShadow: "0 8px 24px rgba(14,38,70,0.12)" }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setCategory(cat); setCatOpen(false); }}
                  className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-[#F5F5F0]"
                  style={{ fontSize: 13, fontWeight: cat === category ? 700 : 500, color: cat === category ? "#0E2646" : "#1A1A1A" }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Body Textarea + Mic Button ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[#1A1A1A] font-['Inter']" style={{ fontSize: 14, fontWeight: 600 }}>
            Body
          </p>
          {/* Mic button */}
          <button
            type="button"
            className="rounded-full cursor-pointer transition-all duration-150 active:scale-[0.95] flex items-center justify-center"
            style={{ width: 32, height: 32, backgroundColor: "#0E2646" }}
            aria-label="Voice input"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="4.5" y="1" width="5" height="8" rx="2.5" fill="#F3D12A" />
              <path d="M3 6.5C3 8.71 4.79 10.5 7 10.5C9.21 10.5 11 8.71 11 6.5" stroke="#F3D12A" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="7" y1="10.5" x2="7" y2="13" stroke="#F3D12A" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your entry…"
          className="w-full h-[180px] px-3 py-2.5 rounded-lg bg-white border border-[#D4D4D0] text-[#1A1A1A] font-['Inter'] placeholder:text-[#1A1A1A]/30 outline-none focus:border-[#F3D12A] focus:ring-2 focus:ring-[#F3D12A]/25 transition-all resize-none"
          style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.6 }}
        />
      </div>

      {/* ── Attachments Grid ── */}
      <div className="space-y-2">
        <p className="text-[#1A1A1A] font-['Inter']" style={{ fontSize: 14, fontWeight: 600 }}>
          Attachments
        </p>
        <div className="grid grid-cols-3 gap-2">
          {!isNew && mockAttachments.map((att) => (
            <div
              key={att.id}
              className="rounded-lg flex items-center justify-center font-['Inter']"
              style={{ aspectRatio: "1/1", backgroundColor: "#0E2646" }}
            >
              <div className="text-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mx-auto mb-1">
                  <rect x="3" y="2" width="14" height="16" rx="2" stroke="rgba(240,240,240,0.3)" strokeWidth="1.5" fill="none" />
                  <path d="M7 10L9 8L12 11L14 9" stroke="#55BAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p style={{ fontSize: 9, color: "rgba(240,240,240,0.4)" }}>{att.name}</p>
              </div>
            </div>
          ))}
          {/* Add attachment slot */}
          <button
            type="button"
            className="rounded-lg border-2 border-dashed border-[#0E2646]/12 flex items-center justify-center cursor-pointer transition-colors hover:border-[#F3D12A]/40 hover:bg-[#F3D12A]/5"
            style={{ aspectRatio: "1/1" }}
          >
            <span className="text-[#0E2646]/20" style={{ fontSize: 24, fontWeight: 300 }}>+</span>
          </button>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2">
        <PillButton variant="outline" size="md" onClick={() => navigate(-1)} style={{ flex: 1 }}>
          Cancel
        </PillButton>
        <PillButton size="md" onClick={() => navigate("/red-book")} style={{ flex: 1 }}>
          {isNew ? "Save Entry" : "Update"}
        </PillButton>
      </div>
    </div>
  );
}