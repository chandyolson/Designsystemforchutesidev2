import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { AlertTriangle, X } from "lucide-react";

/* ── Types ── */
export interface DeleteConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
}

interface DeleteConfirmContextValue {
  showDeleteConfirm: (options: DeleteConfirmOptions) => void;
}

/* ── Context ── */
const DeleteConfirmContext = createContext<DeleteConfirmContextValue | null>(null);

export function useDeleteConfirm() {
  const ctx = useContext(DeleteConfirmContext);
  if (!ctx)
    throw new Error("useDeleteConfirm must be used inside DeleteConfirmProvider");
  return ctx;
}

/* ── Provider ── */
export function DeleteConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<DeleteConfirmOptions | null>(null);

  const showDeleteConfirm = useCallback((opts: DeleteConfirmOptions) => {
    setOptions(opts);
  }, []);

  const close = useCallback(() => setOptions(null), []);

  const handleCancel = useCallback(() => {
    options?.onCancel?.();
    close();
  }, [options, close]);

  const handleConfirm = useCallback(() => {
    options?.onConfirm();
    close();
  }, [options, close]);

  /* Lock body scroll when open */
  useEffect(() => {
    if (options) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [options]);

  return (
    <DeleteConfirmContext.Provider value={{ showDeleteConfirm }}>
      {children}
      {options && (
        <DeleteConfirmDialog
          title={options.title}
          message={options.message}
          confirmLabel={options.confirmLabel ?? "Delete"}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </DeleteConfirmContext.Provider>
  );
}

/* ── Dialog component ── */
function DeleteConfirmDialog({
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center animate-[fadeIn_0.15s_ease-out]"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl flex flex-col items-center animate-[scaleIn_0.2s_ease-out]"
        style={{
          width: "calc(100% - 48px)",
          maxWidth: 340,
          padding: 24,
          boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning icon */}
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: 48,
            height: 48,
            backgroundColor: "#FFEBEE",
          }}
        >
          <AlertTriangle size={24} color="#E74C3C" strokeWidth={2} />
        </div>

        {/* Title */}
        <p
          className="text-center font-['Inter']"
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#1A1A1A",
            marginTop: 16,
          }}
        >
          {title}
        </p>

        {/* Message */}
        <p
          className="text-center font-['Inter']"
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "rgba(26,26,26,0.55)",
            marginTop: 8,
            lineHeight: 1.45,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {message}
        </p>

        {/* Button row */}
        <div className="flex gap-3 w-full" style={{ marginTop: 16 }}>
          {/* Cancel */}
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 flex items-center justify-center rounded-full cursor-pointer font-['Inter'] transition-all active:scale-[0.97]"
            style={{
              height: 44,
              border: "1.5px solid #D4D4D0",
              background: "transparent",
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(26,26,26,0.60)",
            }}
          >
            Cancel
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center rounded-full cursor-pointer font-['Inter'] transition-all active:scale-[0.97]"
            style={{
              height: 44,
              border: "none",
              backgroundColor: "#E74C3C",
              fontSize: 14,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
