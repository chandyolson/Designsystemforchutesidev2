import type { ReactNode, InputHTMLAttributes } from "react";
import { useMemo } from "react";

/* ═══════════════════════════════════════════════
   EYE TOGGLE ICON
   ═══════════════════════════════════════════════ */
export function EyeIcon({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-0.5"
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2.25 2.25L15.75 15.75" stroke="#0E2646" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7.41 7.41A2.25 2.25 0 0 0 10.59 10.59" stroke="#0E2646" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3.69 5.69C2.55 6.68 1.65 7.91 1.13 9a7.58 7.58 0 0 0 7.87 4.5M14.31 12.31C15.45 11.32 16.35 10.09 16.87 9a7.58 7.58 0 0 0-7.87-4.5" stroke="#0E2646" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M1.13 9a7.58 7.58 0 0 1 15.74 0 7.58 7.58 0 0 1-15.74 0Z" stroke="#0E2646" strokeOpacity="0.3" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="9" cy="9" r="2.25" stroke="#0E2646" strokeOpacity="0.3" strokeWidth="1.5" />
        </svg>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   GOOGLE ICON
   ═══════════════════════════════════════════════ */
export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   AUTH INPUT — shared styled input
   ═══════════════════════════════════════════════ */
interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  htmlId: string;
  /** Render something after the label (e.g. "Forgot password?" link) */
  labelRight?: ReactNode;
  /** Wrap input in relative div and append children (e.g. EyeIcon) */
  append?: ReactNode;
  error?: string;
}

export function AuthInput({
  label,
  htmlId,
  labelRight,
  append,
  error,
  ...inputProps
}: AuthInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
        <label
          htmlFor={htmlId}
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 700,
            color: "#0E2646",
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </label>
        {labelRight}
      </div>
      <div className={append ? "relative" : undefined}>
        <input
          id={htmlId}
          className="w-full outline-none transition-all placeholder:text-[#1A1A1A]/25"
          style={{
            height: 44,
            padding: append ? "0 42px 0 14px" : "0 14px",
            borderRadius: 10,
            border: `1.5px solid ${error ? "#E74C3C" : "#D4D4D0"}`,
            backgroundColor: "#FAFAF8",
            fontSize: 16,
            fontWeight: 400,
            color: "#1A1A1A",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? "#E74C3C" : "#F3D12A";
            e.currentTarget.style.boxShadow = error
              ? "0 0 0 3px rgba(231,76,60,0.12)"
              : "0 0 0 3px rgba(243,209,42,0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "#E74C3C" : "#D4D4D0";
            e.currentTarget.style.boxShadow = "none";
          }}
          {...inputProps}
        />
        {append}
      </div>
      {error && (
        <p style={{ fontSize: 11, fontWeight: 500, color: "#E74C3C", marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   AUTH LAYOUT — navy background + branding + card shell
   ═══════════════════════════════════════════════ */
interface AuthLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen font-['Inter'] flex flex-col"
      style={{
        background: "linear-gradient(180deg, #153566 0%, #0A1628 50%, #0E2646 100%)",
      }}
    >
      <div className="w-full max-w-[375px] md:max-w-[480px] mx-auto flex-1 flex flex-col justify-center px-6 py-10">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="#F3D12A" />
              <path
                d="M8 14.5L12 18.5L20 10.5"
                stroke="#0E2646"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: "#F3D12A",
              }}
            >
              CHUTESIDE
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "rgba(240,240,240,0.30)",
              letterSpacing: "0.04em",
            }}
          >
            Cattle Management Made Simple
          </p>
        </div>

        {/* White Card */}
        <div
          className="rounded-2xl"
          style={{
            backgroundColor: "#FFFFFF",
            padding: "28px 24px 24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {children}
        </div>

        {/* Footer area */}
        {footer}

        {/* Legal */}
        <p
          className="text-center mt-4"
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: "rgba(240,240,240,0.15)",
            lineHeight: 1.6,
          }}
        >
          By continuing you agree to our{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Terms</span>
          {" "}and{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ERROR BANNER
   ═══════════════════════════════════════════════ */
export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      className="mt-4 rounded-lg px-3 py-2.5 flex items-start gap-2"
      style={{ backgroundColor: "rgba(231,76,60,0.06)" }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
        <circle cx="7" cy="7" r="6" stroke="#E74C3C" strokeWidth="1.3" />
        <path d="M7 4.5V7.5M7 9.5V9.6" stroke="#E74C3C" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: 12, fontWeight: 500, color: "#E74C3C", lineHeight: 1.4 }}>
        {message}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PRIMARY BUTTON (yellow pill)
   ═══════════════════════════════════════════════ */
export function AuthPrimaryButton({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      style={{
        height: 46,
        borderRadius: 9999,
        backgroundColor: "#F3D12A",
        color: "#0E2646",
        fontSize: 15,
        fontWeight: 800,
        letterSpacing: "0.02em",
        boxShadow: "0 4px 16px rgba(243,209,42,0.35)",
        marginTop: 20,
      }}
    >
      {loading ? (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ animation: "spinnerRotate 0.8s linear infinite" }}
          >
            <circle cx="8" cy="8" r="6" stroke="#0E2646" strokeOpacity="0.15" strokeWidth="2" />
            <path d="M14 8a6 6 0 0 0-6-6" stroke="#0E2646" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   GOOGLE SSO BUTTON
   ═══════════════════════════════════════════════ */
export function GoogleSSOButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <>
      {/* Divider */}
      <div className="flex items-center gap-3 mt-5 mb-4">
        <div className="flex-1 h-px" style={{ backgroundColor: "rgba(14,38,70,0.08)" }} />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "rgba(26,26,26,0.25)",
            letterSpacing: "0.12em",
          }}
        >
          OR
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: "rgba(14,38,70,0.08)" }} />
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="w-full cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
        style={{
          height: 44,
          borderRadius: 9999,
          backgroundColor: "#FFFFFF",
          border: "1.5px solid #D4D4D0",
          fontSize: 13,
          fontWeight: 600,
          color: "#1A1A1A",
        }}
      >
        <GoogleIcon />
        Continue with Google
      </button>
    </>
  );
}

/* ═══════════════════════════════════════════════
   CARD HEADING
   ═══════════════════════════════════════════════ */
export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <h2
        className="text-center"
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#0E2646",
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      <p
        className="text-center mt-1"
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "rgba(26,26,26,0.40)",
          lineHeight: 1.4,
        }}
      >
        {subtitle}
      </p>
    </>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER LINK (below card)
   ═══════════════════════════════════════════════ */
export function AuthFooterLink({
  text,
  linkText,
  onClick,
}: {
  text: string;
  linkText: string;
  onClick: () => void;
}) {
  return (
    <p
      className="text-center mt-6"
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: "rgba(240,240,240,0.25)",
        lineHeight: 1.6,
      }}
    >
      {text}{" "}
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer"
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#55BAAA",
        }}
      >
        {linkText}
      </button>
    </p>
  );
}

/* ═══════════════════════════════════════════════
   PASSWORD STRENGTH LOGIC
   ═══════════════════════════════════════════════ */

/** Returns 0–4 score */
export function getPasswordStrength(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

export function usePasswordStrength(password: string) {
  return useMemo(() => getPasswordStrength(password), [password]);
}

const strengthConfig: Record<number, { label: string; color: string }> = {
  0: { label: "", color: "transparent" },
  1: { label: "Weak", color: "#E74C3C" },
  2: { label: "Fair", color: "#F39C12" },
  3: { label: "Good", color: "#F3D12A" },
  4: { label: "Strong", color: "#27AE60" },
};

export function PasswordStrengthBar({ strength }: { strength: number }) {
  if (strength === 0) return null;

  const { label, color } = strengthConfig[strength];

  return (
    <div className="mt-2.5 space-y-1.5">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className="flex-1 rounded-full transition-all duration-300"
            style={{
              height: 4,
              backgroundColor: seg <= strength ? color : "rgba(14,38,70,0.08)",
            }}
          />
        ))}
      </div>
      <p
        className="text-right transition-colors duration-300"
        style={{
          fontSize: 10,
          fontWeight: 700,
          color,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </p>
    </div>
  );
}