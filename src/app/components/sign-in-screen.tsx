import { useState } from "react";
import { useNavigate } from "react-router";

/* ── Visibility Toggle Icon ── */
function EyeIcon({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-0.5"
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? (
        /* Eye-off */
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2.25 2.25L15.75 15.75" stroke="#0E2646" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7.41 7.41A2.25 2.25 0 0 0 10.59 10.59" stroke="#0E2646" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3.69 5.69C2.55 6.68 1.65 7.91 1.13 9a7.58 7.58 0 0 0 7.87 4.5M14.31 12.31C15.45 11.32 16.35 10.09 16.87 9a7.58 7.58 0 0 0-7.87-4.5" stroke="#0E2646" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        /* Eye */
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M1.13 9a7.58 7.58 0 0 1 15.74 0 7.58 7.58 0 0 1-15.74 0Z" stroke="#0E2646" strokeOpacity="0.3" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="9" cy="9" r="2.25" stroke="#0E2646" strokeOpacity="0.3" strokeWidth="1.5" />
        </svg>
      )}
    </button>
  );
}

/* ── Google Icon ── */
function GoogleIcon() {
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
   SIGN IN SCREEN
   ═══════════════════════════════════════════════ */
export function SignInScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    /* Simulate sign-in */
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1200);
  };

  const handleGoogleSSO = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1200);
  };

  return (
    <div
      className="min-h-screen font-['Inter'] flex flex-col"
      style={{
        background: "linear-gradient(180deg, #153566 0%, #0A1628 50%, #0E2646 100%)",
      }}
    >
      {/* ── Centered mobile frame ── */}
      <div className="w-full max-w-[375px] mx-auto flex-1 flex flex-col justify-center px-6 py-10">

        {/* ── Branding ── */}
        <div className="text-center mb-8">
          {/* Brand mark */}
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

        {/* ── White Card ── */}
        <div
          className="rounded-2xl"
          style={{
            backgroundColor: "#FFFFFF",
            padding: "28px 24px 24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Card heading */}
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
            Sign In
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
            Welcome back to your operation
          </p>

          {/* ── Error message ── */}
          {error && (
            <div
              className="mt-4 rounded-lg px-3 py-2.5 flex items-start gap-2"
              style={{ backgroundColor: "rgba(231,76,60,0.06)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
                <circle cx="7" cy="7" r="6" stroke="#E74C3C" strokeWidth="1.3" />
                <path d="M7 4.5V7.5M7 9.5V9.6" stroke="#E74C3C" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#E74C3C", lineHeight: 1.4 }}>
                {error}
              </span>
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSignIn} className="mt-5 space-y-4">
            {/* Email field */}
            <div>
              <label
                htmlFor="signin-email"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#0E2646",
                  marginBottom: 6,
                  letterSpacing: "0.02em",
                }}
              >
                Email
              </label>
              <input
                id="signin-email"
                type="email"
                placeholder="you@ranch.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                autoComplete="email"
                className="w-full outline-none transition-all placeholder:text-[#1A1A1A]/25"
                style={{
                  height: 44,
                  padding: "0 14px",
                  borderRadius: 10,
                  border: "1.5px solid #D4D4D0",
                  backgroundColor: "#FAFAF8",
                  fontSize: 16,
                  fontWeight: 400,
                  color: "#1A1A1A",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#F3D12A";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(243,209,42,0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#D4D4D0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                <label
                  htmlFor="signin-password"
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#0E2646",
                    letterSpacing: "0.02em",
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {/* navigate to forgot password flow */}}
                  className="cursor-pointer"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#55BAAA",
                    lineHeight: 1,
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  autoComplete="current-password"
                  className="w-full outline-none transition-all placeholder:text-[#1A1A1A]/25"
                  style={{
                    height: 44,
                    padding: "0 42px 0 14px",
                    borderRadius: 10,
                    border: "1.5px solid #D4D4D0",
                    backgroundColor: "#FAFAF8",
                    fontSize: 16,
                    fontWeight: 400,
                    color: "#1A1A1A",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#F3D12A";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(243,209,42,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#D4D4D0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <EyeIcon
                  visible={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                />
              </div>
            </div>

            {/* Sign In button */}
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
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* ── Divider ── */}
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

          {/* ── Google SSO ── */}
          <button
            type="button"
            onClick={handleGoogleSSO}
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
        </div>

        {/* ── Bottom text ── */}
        <p
          className="text-center mt-6"
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(240,240,240,0.25)",
            lineHeight: 1.6,
          }}
        >
          Don't have an account?{" "}
          <button
            type="button"
            className="cursor-pointer"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#55BAAA",
            }}
          >
            Create one
          </button>
        </p>

        {/* ── Legal footer ── */}
        <p
          className="text-center mt-4"
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: "rgba(240,240,240,0.15)",
            lineHeight: 1.6,
          }}
        >
          By signing in you agree to our{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Terms</span>
          {" "}and{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
