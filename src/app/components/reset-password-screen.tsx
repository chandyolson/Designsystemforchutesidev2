import { useState } from "react";
import { useNavigate } from "react-router";
import {
  AuthLayout,
  AuthHeading,
  AuthInput,
  AuthPrimaryButton,
  ErrorBanner,
  EyeIcon,
  AuthFooterLink,
  PasswordStrengthBar,
  usePasswordStrength,
} from "./auth-shared";

/* ═══════════════════════════════════════════════
   RESET PASSWORD SCREEN
   Destination after clicking the email reset link.
   ═══════════════════════════════════════════════ */
export function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = usePasswordStrength(password);
  const clearError = () => setError("");

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Please enter a new password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (strength < 2) {
      setError("Please choose a stronger password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1400);
  };

  return (
    <AuthLayout
      footer={
        <AuthFooterLink
          text="Remember your old password?"
          linkText="Sign in instead"
          onClick={() => navigate("/sign-in")}
        />
      }
    >
      {success ? (
        /* ── Success state ── */
        <div className="py-4 text-center space-y-4">
          {/* Shield checkmark */}
          <div className="mx-auto flex items-center justify-center" style={{ width: 56, height: 56 }}>
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 56,
                height: 56,
                backgroundColor: "rgba(39,174,96,0.10)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path
                  d="M14 3L5 7V13C5 19.075 8.855 24.74 14 26C19.145 24.74 23 19.075 23 13V7L14 3Z"
                  stroke="#27AE60"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  fill="rgba(39,174,96,0.08)"
                />
                <path
                  d="M10 14L13 17L18 12"
                  stroke="#27AE60"
                  strokeWidth="2"
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
              Password Updated
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
              Your password has been successfully reset. You can now sign in with your new credentials.
            </p>
          </div>

          {/* Continue to Sign In */}
          <button
            type="button"
            onClick={() => navigate("/sign-in")}
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
            Continue to Sign In
          </button>
        </div>
      ) : (
        /* ── Form state ── */
        <>
          {/* Lock icon */}
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
                <rect
                  x="4"
                  y="9"
                  width="12"
                  height="9"
                  rx="2"
                  stroke="#0E2646"
                  strokeOpacity="0.25"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 9V6a3 3 0 0 1 6 0v3"
                  stroke="#0E2646"
                  strokeOpacity="0.25"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="13.5" r="1.25" fill="#0E2646" fillOpacity="0.2" />
              </svg>
            </div>
          </div>

          <AuthHeading
            title="Reset Password"
            subtitle="Choose a new, strong password for your account"
          />

          <ErrorBanner message={error} />

          {/* Password requirements hint */}
          <div
            className="mt-4 rounded-lg px-3 py-2.5"
            style={{ backgroundColor: "rgba(14,38,70,0.03)" }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(14,38,70,0.35)",
                lineHeight: 1.5,
                marginBottom: 4,
              }}
            >
              Password should include:
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {[
                { text: "6+ characters", met: password.length >= 6 },
                { text: "Upper & lowercase", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
                { text: "A number", met: /\d/.test(password) },
                { text: "A special character", met: /[^A-Za-z0-9]/.test(password) },
              ].map((rule) => (
                <span
                  key={rule.text}
                  className="flex items-center gap-1 transition-colors duration-200"
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: password
                      ? rule.met
                        ? "#27AE60"
                        : "rgba(14,38,70,0.25)"
                      : "rgba(14,38,70,0.25)",
                  }}
                >
                  {password && rule.met ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2.5 5L4.5 7L7.5 3" stroke="#27AE60" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="2" fill="currentColor" fillOpacity="0.3" />
                    </svg>
                  )}
                  {rule.text}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleReset} className="mt-4 space-y-4">
            {/* New Password */}
            <div>
              <AuthInput
                label="New Password"
                htmlId="reset-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                autoComplete="new-password"
                append={
                  <EyeIcon visible={showPassword} onClick={() => setShowPassword((v) => !v)} />
                }
              />
              <PasswordStrengthBar strength={strength} />
            </div>

            {/* Confirm New Password */}
            <AuthInput
              label="Confirm Password"
              htmlId="reset-confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
              autoComplete="new-password"
              error={
                confirmPassword.length > 0 && password !== confirmPassword
                  ? "Passwords do not match"
                  : undefined
              }
              append={
                <EyeIcon visible={showConfirm} onClick={() => setShowConfirm((v) => !v)} />
              }
            />

            <AuthPrimaryButton
              loading={loading}
              label="Reset Password"
              loadingLabel="Resetting…"
            />
          </form>
        </>
      )}
    </AuthLayout>
  );
}
