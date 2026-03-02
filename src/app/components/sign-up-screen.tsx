import { useState } from "react";
import { useNavigate } from "react-router";
import {
  AuthLayout,
  AuthHeading,
  AuthInput,
  AuthPrimaryButton,
  ErrorBanner,
  EyeIcon,
  GoogleSSOButton,
  AuthFooterLink,
  PasswordStrengthBar,
  usePasswordStrength,
} from "./auth-shared";

/* ═══════════════════════════════════════════════
   SIGN UP SCREEN
   ═══════════════════════════════════════════════ */
export function SignUpScreen() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = usePasswordStrength(password);

  const clearError = () => setError("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) { setError("Please enter your full name."); return; }
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password.trim()) { setError("Please create a password."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("/onboarding"); }, 1400);
  };

  const handleGoogleSSO = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("/onboarding"); }, 1200);
  };

  return (
    <AuthLayout
      footer={
        <AuthFooterLink
          text="Already have an account?"
          linkText="Sign in"
          onClick={() => navigate("/sign-in")}
        />
      }
    >
      <AuthHeading title="Create Account" subtitle="Start managing your operation" />

      <ErrorBanner message={error} />

      <form onSubmit={handleSignUp} className="mt-5 space-y-4">
        {/* Full Name */}
        <AuthInput
          label="Full Name"
          htmlId="signup-name"
          type="text"
          placeholder="John Rancher"
          value={fullName}
          onChange={(e) => { setFullName(e.target.value); clearError(); }}
          autoComplete="name"
        />

        {/* Email */}
        <AuthInput
          label="Email"
          htmlId="signup-email"
          type="email"
          placeholder="you@ranch.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); clearError(); }}
          autoComplete="email"
        />

        {/* Password */}
        <div>
          <AuthInput
            label="Password"
            htmlId="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError(); }}
            autoComplete="new-password"
            append={
              <EyeIcon visible={showPassword} onClick={() => setShowPassword((v) => !v)} />
            }
          />
          <PasswordStrengthBar strength={strength} />
        </div>

        {/* Confirm Password */}
        <AuthInput
          label="Confirm Password"
          htmlId="signup-confirm"
          type={showConfirm ? "text" : "password"}
          placeholder="Re-enter your password"
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
          label="Create Account"
          loadingLabel="Creating account…"
        />
      </form>

      <GoogleSSOButton onClick={handleGoogleSSO} loading={loading} />
    </AuthLayout>
  );
}