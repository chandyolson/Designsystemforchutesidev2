import { useState, useRef, useCallback } from "react";
import type { MicState } from "../floating-mic-button";
import type { VoiceFillState } from "../voice-filled-field";

/**
 * Simulated voice phrase → field mapping.
 * In production this would come from a speech-to-text + NLP parser.
 */
export interface VoiceParseResult {
  /** The field key */
  key: string;
  /** The parsed value to fill */
  value: string;
}

interface UseVoiceAutoFillOptions {
  /** How long the "recording" phase lasts (ms) */
  recordingDuration?: number;
  /** How long the "processing" phase lasts (ms) */
  processingDuration?: number;
  /** Delay between each field highlight starting (ms) */
  staggerDelay?: number;
  /** How long each field stays highlighted (ms) */
  highlightDuration?: number;
}

interface UseVoiceAutoFillReturn {
  /** Current mic button state */
  micState: MicState;
  /** Current form values keyed by field key */
  fieldValues: Record<string, string>;
  /** Per-field fill state (drives VoiceFilledField `state` prop) */
  fieldFillStates: Record<string, VoiceFillState>;
  /** Simulated transcript shown during recording */
  liveTranscript: string;
  /** Count of fields that were filled in the last parse */
  lastFillCount: number;
  /** Kick off the full voice flow with a set of simulated parse results */
  start: (results: VoiceParseResult[], transcript?: string) => void;
  /** Reset everything to idle */
  reset: () => void;
  /** Whether the full cycle (mic + all highlights) is still running */
  isActive: boolean;
}

export function useVoiceAutoFill(
  initialValues: Record<string, string> = {},
  options: UseVoiceAutoFillOptions = {}
): UseVoiceAutoFillReturn {
  const {
    recordingDuration = 3000,
    processingDuration = 2000,
    staggerDelay = 150,
    highlightDuration = 2200,
  } = options;

  const [micState, setMicState] = useState<MicState>("idle");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(initialValues);
  const [fieldFillStates, setFieldFillStates] = useState<Record<string, VoiceFillState>>({});
  const [liveTranscript, setLiveTranscript] = useState("");
  const [lastFillCount, setLastFillCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Keep track of all timers for cleanup
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  const start = useCallback(
    (results: VoiceParseResult[], transcript = "") => {
      if (isActive) return;

      clearAllTimers();
      setIsActive(true);
      setLastFillCount(results.length);

      // Phase 1 — Recording
      setMicState("recording");
      setLiveTranscript("");

      // Simulate transcript appearing word-by-word
      if (transcript) {
        const words = transcript.split(" ");
        const wordInterval = Math.floor((recordingDuration - 400) / words.length);
        words.forEach((_, i) => {
          addTimer(() => {
            setLiveTranscript(words.slice(0, i + 1).join(" "));
          }, 300 + i * wordInterval);
        });
      }

      // Phase 2 — Processing
      addTimer(() => {
        setMicState("processing");
        setLiveTranscript(transcript); // full transcript locked in
      }, recordingDuration);

      // Phase 3 — Fill fields with staggered highlights
      const fillStart = recordingDuration + processingDuration;

      addTimer(() => {
        setMicState("idle");
        setLiveTranscript("");

        // Set all values at once
        setFieldValues((prev) => {
          const next = { ...prev };
          results.forEach(({ key, value }) => {
            next[key] = value;
          });
          return next;
        });

        // Stagger the highlight triggers
        results.forEach(({ key }, i) => {
          addTimer(() => {
            setFieldFillStates((prev) => ({ ...prev, [key]: "filled" }));

            // Clear after highlight duration
            addTimer(() => {
              setFieldFillStates((prev) => ({ ...prev, [key]: "idle" }));

              // If this is the last field, mark flow as done
              if (i === results.length - 1) {
                addTimer(() => setIsActive(false), 100);
              }
            }, highlightDuration);
          }, i * staggerDelay);
        });
      }, fillStart);
    },
    [isActive, recordingDuration, processingDuration, staggerDelay, highlightDuration, clearAllTimers, addTimer]
  );

  const reset = useCallback(() => {
    clearAllTimers();
    setMicState("idle");
    setFieldFillStates({});
    setLiveTranscript("");
    setIsActive(false);
    setLastFillCount(0);
  }, [clearAllTimers]);

  return {
    micState,
    fieldValues,
    fieldFillStates,
    liveTranscript,
    lastFillCount,
    start,
    reset,
    isActive,
  };
}
