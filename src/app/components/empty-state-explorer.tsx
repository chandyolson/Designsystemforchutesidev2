import { EmptyState } from "./empty-state";

const variants = [
  "animals",
  "calving",
  "projects",
  "redbook",
  "search",
  "filtered",
] as const;

export function EmptyStateExplorer() {
  return (
    <div
      className="flex flex-col gap-6 px-4 py-6"
      style={{ backgroundColor: "#F5F5F0", minHeight: "100%" }}
    >
      <p
        className="font-['Inter'] text-center"
        style={{ fontSize: 17, fontWeight: 700, color: "#0E2646" }}
      >
        Empty State Variants
      </p>

      {variants.map((v) => (
        <div
          key={v}
          className="rounded-xl"
          style={{
            backgroundColor: "#F5F5F0",
            border: "1px dashed rgba(14,38,70,0.12)",
            padding: "20px 8px",
          }}
        >
          <p
            className="font-['Inter'] text-center"
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(14,38,70,0.35)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            {v}
          </p>
          <EmptyState
            variant={v}
            onAction={() => alert(`Action for "${v}"`)}
          />
        </div>
      ))}
    </div>
  );
}
