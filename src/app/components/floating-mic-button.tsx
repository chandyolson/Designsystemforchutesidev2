import { Mic } from "lucide-react";

export type MicState = "idle" | "recording" | "processing";

interface FloatingMicButtonProps {
  state: MicState;
  onClick?: () => void;
  /** Render as a positioned demo piece instead of fixed overlay */
  demo?: boolean;
}

export function FloatingMicButton({
  state,
  onClick,
  demo = false,
}: FloatingMicButtonProps) {
  const isIdle = state === "idle";
  const isRecording = state === "recording";
  const isProcessing = state === "processing";

  const bg = isRecording ? "#E74C3C" : "#0E2646";

  const wrapperStyle: React.CSSProperties = demo
    ? { position: "relative", width: 72, height: 88 }
    : {
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 70,
        width: 72,
        height: 88,
      };

  return (
    <div style={wrapperStyle} className="flex flex-col items-center">
      {/* Pulse ring — recording only */}
      {isRecording && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 72,
            height: 72,
            top: 30,
            left: 36,
            border: "2px solid rgba(231,76,60,0.40)",
            animation: "micPulse 1.6s ease-in-out infinite",
          }}
        />
      )}

      {/* Main button */}
      <button
        type="button"
        onClick={onClick}
        className="rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors duration-150 active:scale-95"
        style={{
          width: 60,
          height: 60,
          backgroundColor: bg,
          boxShadow: "0 6px 20px rgba(14,38,70,0.30)",
          border: "none",
        }}
        aria-label={
          isIdle
            ? "Start voice input"
            : isRecording
            ? "Stop recording"
            : "Processing voice"
        }
      >
        {isProcessing ? (
          /* Spinner */
          <div
            className="rounded-full"
            style={{
              width: 22,
              height: 22,
              border: "2px solid transparent",
              borderTopColor: "#F3D12A",
              borderRightColor: "#F3D12A",
              animation: "spinnerRotate 0.8s linear infinite",
            }}
          />
        ) : (
          /* Mic icon */
          <Mic
            size={26}
            color={isRecording ? "#FFFFFF" : "#F3D12A"}
            strokeWidth={2}
          />
        )}
      </button>

      {/* Label below */}
      {(isRecording || isProcessing) && (
        <span
          className="font-['Inter'] mt-1.5 whitespace-nowrap"
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: isRecording ? "#E74C3C" : "#55BAAA",
          }}
        >
          {isRecording ? "Listening..." : "Processing..."}
        </span>
      )}
    </div>
  );
}