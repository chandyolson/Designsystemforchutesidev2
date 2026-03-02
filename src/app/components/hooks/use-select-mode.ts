import { useState, useCallback } from "react";

/**
 * Shared hook for mass-selection state on list screens.
 *
 * Manages `selectMode` (on/off) and `selectedIds` (Set<string>).
 * Turning off select mode clears the selection automatically.
 */
export function useSelectMode() {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  /** Toggle select mode. Turning off clears selection. */
  const toggleSelectMode = useCallback(() => {
    setSelectMode((prev) => {
      if (prev) setSelectedIds(new Set());
      return !prev;
    });
  }, []);

  /** Toggle a single item in/out of the selected set. */
  const toggleItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /** Select all or deselect all (if already all selected). */
  const toggleAll = useCallback((allIds: string[]) => {
    setSelectedIds((prev) => {
      const allSelected = allIds.length > 0 && allIds.every((id) => prev.has(id));
      return allSelected ? new Set() : new Set(allIds);
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  return {
    selectMode,
    selectedIds,
    toggleSelectMode,
    toggleItem,
    toggleAll,
    clearSelection,
  } as const;
}
