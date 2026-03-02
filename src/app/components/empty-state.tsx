import { ReactNode } from "react";
import {
  FileText,
  ClipboardList,
  FolderOpen,
  BookOpen,
  Search,
  SlidersHorizontal,
} from "lucide-react";

type EmptyStateVariant =
  | "animals"
  | "calving"
  | "projects"
  | "redbook"
  | "search"
  | "filtered";

interface EmptyStateProps {
  variant: EmptyStateVariant;
  onAction?: () => void;
}

/* Simple inline cow silhouette – kept minimal */
function CowIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 7.5C3 6.5 3.8 5 5 5C5.8 5 6 5.8 6 6.5V8H4.5C3.5 8 3 8 3 7.5Z"
        fill="rgba(14,38,70,0.20)"
      />
      <path
        d="M21 7.5C21 6.5 20.2 5 19 5C18.2 5 18 5.8 18 6.5V8H19.5C20.5 8 21 8 21 7.5Z"
        fill="rgba(14,38,70,0.20)"
      />
      <rect
        x="5.5"
        y="7"
        width="13"
        height="9"
        rx="3"
        fill="rgba(14,38,70,0.20)"
      />
      <rect
        x="8"
        y="16"
        width="2.5"
        height="3.5"
        rx="1"
        fill="rgba(14,38,70,0.20)"
      />
      <rect
        x="13.5"
        y="16"
        width="2.5"
        height="3.5"
        rx="1"
        fill="rgba(14,38,70,0.20)"
      />
      <circle cx="9" cy="11" r="1" fill="rgba(14,38,70,0.35)" />
      <circle cx="15" cy="11" r="1" fill="rgba(14,38,70,0.35)" />
    </svg>
  );
}

const iconColor = "rgba(14,38,70,0.20)";
const iconSize = 28;

const variantConfig: Record<
  EmptyStateVariant,
  {
    icon: ReactNode;
    title: string;
    subtitle: string;
    buttonLabel?: string;
    buttonStyle?: "primary" | "outline";
  }
> = {
  animals: {
    icon: <CowIcon size={iconSize} />,
    title: "No Animals Yet",
    subtitle: "Add your first animal to get started",
    buttonLabel: "Add Animal",
    buttonStyle: "primary",
  },
  calving: {
    icon: <ClipboardList size={iconSize} color={iconColor} strokeWidth={1.8} />,
    title: "No Calving Records",
    subtitle: "Record your first calf",
    buttonLabel: "Add Calf",
    buttonStyle: "primary",
  },
  projects: {
    icon: <FolderOpen size={iconSize} color={iconColor} strokeWidth={1.8} />,
    title: "No Projects Yet",
    subtitle: "Create a project to start working cattle",
    buttonLabel: "New Project",
    buttonStyle: "primary",
  },
  redbook: {
    icon: <BookOpen size={iconSize} color={iconColor} strokeWidth={1.8} />,
    title: "No Entries Yet",
    subtitle: "Start your first note or receipt",
    buttonLabel: "New Entry",
    buttonStyle: "primary",
  },
  search: {
    icon: <Search size={iconSize} color={iconColor} strokeWidth={1.8} />,
    title: "No Results Found",
    subtitle: "Try a different search term",
  },
  filtered: {
    icon: (
      <SlidersHorizontal size={iconSize} color={iconColor} strokeWidth={1.8} />
    ),
    title: "No Matches",
    subtitle: "Adjust your filters to see results",
    buttonLabel: "Reset Filters",
    buttonStyle: "outline",
  },
};

export function EmptyState({ variant, onAction }: EmptyStateProps) {
  const config = variantConfig[variant];

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: 200 }}
    >
      {/* Icon circle */}
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 64,
          height: 64,
          backgroundColor: "rgba(14,38,70,0.06)",
        }}
      >
        {config.icon}
      </div>

      {/* Title */}
      <p
        className="text-center font-['Inter']"
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "rgba(26,26,26,0.50)",
          marginTop: 16,
          marginBottom: 0,
          lineHeight: 1.3,
        }}
      >
        {config.title}
      </p>

      {/* Subtitle */}
      <p
        className="text-center font-['Inter']"
        style={{
          fontSize: 13,
          fontWeight: 400,
          color: "rgba(26,26,26,0.30)",
          marginTop: 4,
          marginBottom: 0,
          lineHeight: 1.3,
        }}
      >
        {config.subtitle}
      </p>

      {/* Action button */}
      {config.buttonLabel && onAction && (
        <button
          onClick={onAction}
          className="cursor-pointer active:scale-[0.97] transition-transform duration-150 font-['Inter']"
          style={
            config.buttonStyle === "outline"
              ? {
                  marginTop: 16,
                  height: 40,
                  paddingLeft: 24,
                  paddingRight: 24,
                  borderRadius: 9999,
                  border: "1.5px solid #D4D4D0",
                  backgroundColor: "transparent",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "rgba(26,26,26,0.60)",
                }
              : {
                  marginTop: 16,
                  height: 40,
                  paddingLeft: 24,
                  paddingRight: 24,
                  borderRadius: 9999,
                  border: "none",
                  backgroundColor: "#F3D12A",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  boxShadow: "0 2px 10px rgba(243,209,42,0.35)",
                }
          }
        >
          {config.buttonLabel}
        </button>
      )}
    </div>
  );
}
