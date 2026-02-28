import { createContext, useContext, useState, type ReactNode } from "react";

export interface GradientOption {
  id: string;
  label: string;
  description: string;
  css: string;
}

export const topBarGradients: GradientOption[] = [
  {
    id: "tb-solid",
    label: "A · Solid Navy",
    description: "Current — flat #0E2646",
    css: "#0E2646",
  },
  {
    id: "tb-navy-teal-subtle",
    label: "B · Navy → Teal Hint",
    description: "Subtle teal bleed at bottom edge",
    css: "linear-gradient(180deg, #0E2646 60%, #0F3048 100%)",
  },
  {
    id: "tb-navy-teal",
    label: "C · Navy → Teal",
    description: "Vertical fade matching dashboard stat cards",
    css: "linear-gradient(180deg, #0E2646 0%, #1B5E54 100%)",
  },
  {
    id: "tb-navy-teal-bold",
    label: "D · Navy → Teal Bold",
    description: "Strong diagonal, more teal presence",
    css: "linear-gradient(135deg, #0E2646 0%, #2E8B7A 100%)",
  },
  {
    id: "tb-navy-deep",
    label: "E · Deep Navy Shift",
    description: "Rich navy to midnight — noticeable depth",
    css: "linear-gradient(180deg, #153566 0%, #081020 100%)",
  },
  {
    id: "tb-diagonal-warm",
    label: "F · Warm Diagonal",
    description: "Navy base with warm gold whisper at top-right",
    css: "linear-gradient(135deg, #0E2646 0%, #0E2646 70%, #1C3A50 100%)",
  },
  {
    id: "tb-peri-midnight",
    label: "G · Peri → Midnight",
    description: "Periwinkle blue fading to deep midnight",
    css: "linear-gradient(180deg, #5E81F4 0%, #0E1528 100%)",
  },
  {
    id: "tb-midnight-teal",
    label: "H · Midnight → Teal",
    description: "Deep midnight base rising into teal",
    css: "linear-gradient(180deg, #0E1528 0%, #54B6A7 100%)",
  },
  {
    id: "tb-peri-teal",
    label: "I · Peri → Teal",
    description: "Periwinkle to teal — cool spectrum sweep",
    css: "linear-gradient(180deg, #5E81F4 0%, #54B6A7 100%)",
  },
  {
    id: "tb-peri-mid-teal",
    label: "J · Peri → Mid → Teal",
    description: "Three-stop diagonal: blue through midnight to teal",
    css: "linear-gradient(135deg, #5E81F4 0%, #0E1528 50%, #54B6A7 100%)",
  },
  {
    id: "tb-mid-peri-diag",
    label: "K · Midnight + Peri Diagonal",
    description: "Dark base with diagonal periwinkle accent",
    css: "linear-gradient(135deg, #0E1528 0%, #5E81F4 100%)",
  },
  {
    id: "tb-teal-mid-peri",
    label: "L · Teal → Mid → Peri",
    description: "Inverted three-stop: teal through midnight to blue",
    css: "linear-gradient(180deg, #54B6A7 0%, #0E1528 50%, #5E81F4 100%)",
  },
];

export const drawerGradients: GradientOption[] = [
  {
    id: "dr-solid",
    label: "A · Solid Navy",
    description: "Current — flat #0E2646",
    css: "#0E2646",
  },
  {
    id: "dr-navy-darker",
    label: "B · Navy → Midnight",
    description: "Darkens toward bottom — adds depth",
    css: "linear-gradient(180deg, #0E2646 0%, #081829 100%)",
  },
  {
    id: "dr-navy-teal-edge",
    label: "C · Navy + Teal Edge",
    description: "Navy body with teal accent at bottom",
    css: "linear-gradient(180deg, #0E2646 0%, #0E2646 75%, #163D3A 100%)",
  },
  {
    id: "dr-navy-teal-full",
    label: "D · Navy → Teal Full",
    description: "Full vertical navy-to-teal sweep",
    css: "linear-gradient(180deg, #0E2646 0%, #1B5E54 100%)",
  },
  {
    id: "dr-teal-navy",
    label: "E · Teal → Navy",
    description: "Inverted — teal top fading to navy",
    css: "linear-gradient(180deg, #1B5E54 0%, #0E2646 40%)",
  },
  {
    id: "dr-angled",
    label: "F · Angled Navy-Teal",
    description: "Diagonal sweep for visual energy",
    css: "linear-gradient(160deg, #0E2646 0%, #1A4A44 100%)",
  },
];

interface GradientContextValue {
  topBarGradient: GradientOption;
  drawerGradient: GradientOption;
  setTopBarId: (id: string) => void;
  setDrawerId: (id: string) => void;
}

const GradientContext = createContext<GradientContextValue>({
  topBarGradient: topBarGradients[0],
  drawerGradient: drawerGradients[0],
  setTopBarId: () => {},
  setDrawerId: () => {},
});

export function GradientProvider({ children }: { children: ReactNode }) {
  const [topBarId, setTopBarId] = useState("tb-solid");
  const [drawerId, setDrawerId] = useState("dr-navy-teal-edge");

  const topBarGradient = topBarGradients.find((g) => g.id === topBarId) ?? topBarGradients[0];
  const drawerGradient = drawerGradients.find((g) => g.id === drawerId) ?? drawerGradients[0];

  return (
    <GradientContext.Provider value={{ topBarGradient, drawerGradient, setTopBarId, setDrawerId }}>
      {children}
    </GradientContext.Provider>
  );
}

export function useGradient() {
  return useContext(GradientContext);
}