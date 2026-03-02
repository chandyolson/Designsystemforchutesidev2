import { Mic } from "lucide-react";
import type { MicState } from "./floating-mic-button";

interface InlineMicButtonProps {
  state: MicState;
  onClick?: () => void;
}

export function InlineMicButton({ state, onClick }: InlineMicButtonProps) {
  const isRecording = state === "recording";
  const isProcessing = state === "processing";

  const bg = isRecording ? "#E74C3C" : "#0E2646";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 38, height: 38 }}>
      {/* Thin pulse ring — recording only */}
      {isRecording && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            width: 38,
            height: 38,
            border: "1.5px solid rgba(231,76,60,0.30)",
            animation: "inlineMicPulse 1.4s ease-in-out infinite",
          }}
        />
      )}

      {/* Button */}
      <button
        type="button"
        onClick={onClick}
        className="rounded-full flex items-center justify-center cursor-pointer transition-colors duration-150 active:scale-90"
        style={{
          width: 32,
          height: 32,
          backgroundColor: bg,
          border: "none",
        }}
        aria-label={
          isRecording
            ? "Stop dictation"
            : isProcessing
            ? "Processing dictation"
            : "Start dictation"
        }
      >
        {isProcessing ? (
          <div
            className="rounded-full"
            style={{
              width: 12,
              height: 12,
              border: "2px solid transparent",
              borderTopColor: "#F3D12A",
              borderRightColor: "#F3D12A",
              animation: "spinnerRotate 0.8s linear infinite",
            }}
          />
        ) : (
          <Mic
            size={14}
            color={isRecording ? "#FFFFFF" : "#F3D12A"}
            strokeWidth={2.5}
          />
        )}
      </button>
    </div>
  );
}
