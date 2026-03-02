interface BulkActionBarProps {
  /** Number of currently selected items */
  selectedCount: number;
  /** Label for the item type, e.g. "animals", "records" */
  itemLabel?: string;
  /** Called when the Flag button is tapped */
  onFlag: () => void;
  /** Called when the Edit button is tapped */
  onEdit: () => void;
  /** Called when the Delete button is tapped */
  onDelete: () => void;
}

/**
 * Fixed bottom bar that appears when 1+ items are selected.
 *
 * - Background #0E2646, top-left/right radius 16px
 * - Shadow: 0 -4px 20px rgba(14,38,70,0.20)
 * - Top row: "{n} {label} selected" white @ 60%
 * - Bottom row: Flag (teal), Edit (gold), Delete (red) pill buttons
 */
export function BulkActionBar({
  selectedCount,
  itemLabel = "animals",
  onFlag,
  onEdit,
  onDelete,
}: BulkActionBarProps) {
  return (
    <div
      className="font-['Inter']"
      style={{
        padding: "12px 20px",
        backgroundColor: "#0E2646",
        borderRadius: "16px 16px 0 0",
        boxShadow: "0 -4px 20px rgba(14,38,70,0.20)",
      }}
    >
      {/* ── Count row ── */}
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "rgba(255,255,255,0.60)",
          lineHeight: 1,
          marginBottom: 10,
        }}
      >
        {selectedCount} {itemLabel} selected
      </p>

      {/* ── Action buttons row ── */}
      <div className="flex gap-2.5">
        {/* Flag */}
        <button
          type="button"
          onClick={onFlag}
          className="flex-1 flex items-center justify-center gap-1.5 cursor-pointer border-none active:opacity-80 transition-opacity duration-150"
          style={{
            height: 40,
            borderRadius: 9999,
            backgroundColor: "rgba(85,186,170,0.15)",
            fontSize: 13,
            fontWeight: 600,
            color: "#55BAAA",
          }}
        >
          {/* Flag icon 14px */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
              fill="currentColor"
              opacity="0.35"
            />
            <path
              d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Flag
        </button>

        {/* Edit */}
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 cursor-pointer border-none active:opacity-80 transition-opacity duration-150"
          style={{
            height: 40,
            borderRadius: 9999,
            backgroundColor: "rgba(243,209,42,0.15)",
            fontSize: 13,
            fontWeight: 600,
            color: "#F3D12A",
          }}
        >
          {/* Pencil icon 14px */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Edit
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-1.5 cursor-pointer border-none active:opacity-80 transition-opacity duration-150"
          style={{
            height: 40,
            borderRadius: 9999,
            backgroundColor: "rgba(231,76,60,0.15)",
            fontSize: 13,
            fontWeight: 600,
            color: "#E74C3C",
          }}
        >
          {/* Trash icon 14px */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}
