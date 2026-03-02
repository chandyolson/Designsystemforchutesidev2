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
} from "./auth-shared";
import { useAuth } from "./auth-context";

/* ═══════════════════════════════════════════════
   SIGN IN SCREEN
   ═══════════════════════════════════════════════ */
export function SignInScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password.trim()) { setError("Please enter your password."); return; }

    setLoading(true);
    setTimeout(() => { setLoading(false); login(); navigate("/"); }, 1200);
  };

  const handleGoogleSSO = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); login(); navigate("/"); }, 1200);
  };

  return (
    <AuthLayout
      footer={
        <AuthFooterLink
          text="Don't have an account?"
          linkText="Create one"
          onClick={() => navigate("/sign-up")}
        />
      }
    >
      <AuthHeading title="Sign In" subtitle="Welcome back to your operation" />

      <ErrorBanner message={error} />

      <form onSubmit={handleSignIn} className="mt-5 space-y-4">
        <AuthInput
          label="Email"
          htmlId="signin-email"
          type="email"
          placeholder="you@ranch.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          autoComplete="email"
        />

        <AuthInput
          label="Password"
          htmlId="signin-password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          autoComplete="current-password"
          labelRight={
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="cursor-pointer"
              style={{ fontSize: 11, fontWeight: 600, color: "#55BAAA", lineHeight: 1 }}
            >
              Forgot password?
            </button>
          }
          append={
            <EyeIcon visible={showPassword} onClick={() => setShowPassword((v) => !v)} />
          }
        />

        <AuthPrimaryButton loading={loading} label="Sign In" loadingLabel="Signing in…" />
      </form>

      <GoogleSSOButton onClick={handleGoogleSSO} loading={loading} />
    </AuthLayout>
  );
}