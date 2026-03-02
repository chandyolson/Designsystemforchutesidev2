import { useToast, type ToastVariant } from "./toast-context";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

const variantStyles: Record<
  ToastVariant,
  {
    bg: string;
    borderColor: string;
    iconColor: string;
    textColor: string;
    icon: React.ReactNode;
  }
> = {
  success: {
    bg: "#E8F5E9",
    borderColor: "#27AE60",
    iconColor: "#27AE60",
    textColor: "#1B5E20",
    icon: <CheckCircle size={20} color="#27AE60" strokeWidth={2} />,
  },
  error: {
    bg: "#FFEBEE",
    borderColor: "#E74C3C",
    iconColor: "#E74C3C",
    textColor: "#B71C1C",
    icon: <AlertTriangle size={20} color="#E74C3C" strokeWidth={2} />,
  },
  info: {
    bg: "#E3F2FD",
    borderColor: "#2196F3",
    iconColor: "#2196F3",
    textColor: "#0D47A1",
    icon: <Info size={20} color="#2196F3" strokeWidth={2} />,
  },
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="absolute left-0 right-0 z-50 flex flex-col gap-2 pointer-events-none"
      style={{ top: 12, paddingLeft: 20, paddingRight: 20 }}
    >
      {toasts.map((toast) => {
        const style = variantStyles[toast.variant];
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 rounded-xl font-['Inter'] animate-[toastSlideIn_0.25s_ease-out]"
            style={{
              minHeight: 44,
              padding: "12px 16px",
              backgroundColor: style.bg,
              borderLeft: `3px solid ${style.borderColor}`,
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            }}
          >
            {/* Icon */}
            <div className="shrink-0">{style.icon}</div>

            {/* Message */}
            <p
              className="flex-1 min-w-0 truncate"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: style.textColor,
                lineHeight: 1.3,
              }}
            >
              {toast.message}
            </p>

            {/* Dismiss */}
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 flex items-center justify-center cursor-pointer"
              style={{ width: 20, height: 20 }}
              aria-label="Dismiss"
            >
              <X
                size={10}
                color={style.textColor}
                strokeWidth={2.5}
                style={{ opacity: 0.4 }}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
