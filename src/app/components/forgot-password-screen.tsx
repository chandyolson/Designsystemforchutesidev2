import { useState } from "react";
import { useNavigate } from "react-router";
import {
  AuthLayout,
  AuthHeading,
  AuthInput,
  AuthPrimaryButton,
  ErrorBanner,
  AuthFooterLink,
} from "./auth-shared";

/* ═══════════════════════════════════════════════
   FORGOT PASSWORD SCREEN
   ═══════════════════════════════════════════════ */
export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <AuthLayout
      footer={
        <AuthFooterLink
          text="Remember your password?"
          linkText="Sign in"
          onClick={() => navigate("/sign-in")}
        />
      }
    >
      {sent ? (
        /* ── Success state ── */
        <div className="py-4 text-center space-y-4">
          {/* Checkmark circle */}
          <div className="mx-auto flex items-center justify-center" style={{ width: 56, height: 56 }}>
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 56,
                height: 56,
                backgroundColor: "rgba(85,186,170,0.10)",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path
                  d="M6 13.5L11 18.5L20 9.5"
                  stroke="#55BAAA"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#0E2646",
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
              }}
            >
              Check Your Email
            </h2>
            <p
              className="mt-2"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(26,26,26,0.45)",
                lineHeight: 1.55,
              }}
            >
              We sent a password reset link to{" "}
              <span style={{ fontWeight: 700, color: "#0E2646" }}>{email}</span>.
              Check your inbox and follow the instructions.
            </p>
          </div>

          {/* Resend */}
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "rgba(26,26,26,0.30)",
              lineHeight: 1.6,
            }}
          >
            Didn't receive it?{" "}
            <button
              type="button"
              onClick={() => { setSent(false); }}
              className="cursor-pointer"
              style={{ fontSize: 12, fontWeight: 700, color: "#55BAAA" }}
            >
              Try again
            </button>
          </p>

          {/* Open Reset Link — demo shortcut to /reset-password */}
          <button
            type="button"
            onClick={() => navigate("/reset-password")}
            className="w-full cursor-pointer transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              height: 46,
              borderRadius: 9999,
              backgroundColor: "#F3D12A",
              color: "#0E2646",
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: "0.02em",
              boxShadow: "0 4px 16px rgba(243,209,42,0.35)",
              marginTop: 8,
            }}
          >
            Open Reset Link
          </button>

          {/* Back to Sign In — secondary */}
          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="w-full cursor-pointer transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              height: 42,
              borderRadius: 9999,
              backgroundColor: "transparent",
              border: "1.5px solid #D4D4D0",
              color: "rgba(26,26,26,0.50)",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        /* ── Form state ── */
        <>
          {/* Mail icon */}
          <div className="flex justify-center mb-3">
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                backgroundColor: "rgba(14,38,70,0.04)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="4" width="16" height="12" rx="2" stroke="#0E2646" strokeOpacity="0.25" strokeWidth="1.5" />
                <path d="M2 6.5L10 11.5L18 6.5" stroke="#0E2646" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <AuthHeading
            title="Forgot Password?"
            subtitle="Enter the email associated with your account and we'll send a reset link"
          />

          <ErrorBanner message={error} />

          <form onSubmit={handleReset} className="mt-5 space-y-4">
            <AuthInput
              label="Email"
              htmlId="forgot-email"
              type="email"
              placeholder="you@ranch.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              autoComplete="email"
            />

            <AuthPrimaryButton
              loading={loading}
              label="Send Reset Link"
              loadingLabel="Sending…"
            />
          </form>
        </>
      )}
    </AuthLayout>
  );
}
