interface SelectAllBarProps {
  /** Number of currently selected items */
  selectedCount: number;
  /** Total number of items in the list */
  totalCount: number;
  /** Called when "Select All" / "Deselect All" is tapped */
  onToggleAll: () => void;
}

/**
 * Appears at the top of the list when select mode is active.
 *
 * - Full width, 36px height, bg #0E2646 at 5%, rounded-lg
 * - Left: "Select All" / "Deselect All" teal text link
 * - Right: "X of Y selected" muted count
 */
export function SelectAllBar({
  selectedCount,
  totalCount,
  onToggleAll,
}: SelectAllBarProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <div
      className="flex items-center justify-between rounded-lg px-3 font-['Inter']"
      style={{
        height: 36,
        backgroundColor: "rgba(14,38,70,0.05)",
      }}
    >
      {/* Left — Select / Deselect All */}
      <button
        type="button"
        onClick={onToggleAll}
        className="cursor-pointer bg-transparent border-none p-0 active:opacity-70 transition-opacity duration-150"
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#55BAAA",
          lineHeight: 1,
        }}
      >
        {allSelected ? "Deselect All" : "Select All"}
      </button>

      {/* Right — count */}
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(26,26,26,0.40)",
          lineHeight: 1,
        }}
      >
        {selectedCount} of {totalCount} selected
      </span>
    </div>
  );
}
