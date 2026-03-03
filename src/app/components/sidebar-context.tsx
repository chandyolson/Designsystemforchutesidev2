import { createContext, useContext } from "react";

interface SidebarContextValue {
  /** Current sidebar width in px (0 on mobile) */
  sidebarWidth: number;
  collapsed: boolean;
}

export const SidebarContext = createContext<SidebarContextValue>({
  sidebarWidth: 0,
  collapsed: false,
});

export function useSidebarWidth() {
  return useContext(SidebarContext);
}
