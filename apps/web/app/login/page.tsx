"use client";

import { useState, CSSProperties, ReactElement, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apifetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const T = {
  bg:          "#0a0f0a",
  card:        "rgba(255,255,255,0.04)",
  cardBorder:  "rgba(110,231,183,0.12)",
  accent:      "#6ee7b7",
  accentDim:   "rgba(110,231,183,0.18)",
  accentSolid: "#34d399",
  text:        "#e8f5f0",
  textMuted:   "rgba(232,245,240,0.5)",
  textFaint:   "rgba(232,245,240,0.3)",
  inputBg:     "rgba(255,255,255,0.04)",
  inputBorder: "rgba(110,231,183,0.2)",
  inputFocus:  "rgba(110,231,183,0.5)",
  error:       "#f87171",
  display:     "'Instrument Serif', Georgia, serif",
  sans:        "'Syne', sans-serif",
};

type FormState = {
  username: string;
  password: string;
};

type FieldError = {
  username?: string;
  password?: string;
};

export default function LoginPage(): ReactElement {
  const [form, setForm]         = useState<FormState>({ username: "", password: "" });
  const [errors, setErrors]     = useState<FieldError>({});
  const [loading, setLoading]   = useState<boolean>(false);
  const [focused, setFocused]   = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev: FormState) => ({ ...prev, [name]: value }));
    setErrors((prev: FieldError) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FieldError = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.password)        newErrors.password = "Password is required";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { login: authLogin, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/feed");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await apifetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      authLogin(data.token, data.user);
    } catch (err: any) {
      setErrors({ password: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name: string): CSSProperties => ({
    width:        "100%",
    background:   T.inputBg,
    border:       `1px solid ${focused === name ? T.inputFocus : errors[name as keyof FieldError] ? T.error : T.inputBorder}`,
    borderRadius: "12px",
    padding:      "14px 16px",
    color:        T.text,
    fontSize:     "14px",
    fontFamily:   T.sans,
    outline:      "none",
    transition:   "border-color 0.2s",
  });

  const labelStyle: CSSProperties = {
    fontSize:     "12px",
    color:        T.textMuted,
    letterSpacing:"0.06em",
    textTransform:"uppercase",
    marginBottom: "8px",
    display:      "block",
    fontFamily:   T.sans,
  };

  return (
    <main style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.sans, padding: "24px" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(16,85,50,0.12) 0%, transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontFamily: T.display, fontSize: 28, color: T.text, letterSpacing: "-0.02em" }}>
            Mistake<em style={{ color: T.accent, fontStyle: "italic" }}>Count</em>
          </span>
          <p style={{ marginTop: 8, fontSize: 13, color: T.textMuted }}>
            Welcome back. Your mistakes missed you.
          </p>
        </div>

        <div style={{
          background:    T.card,
          border:        `1px solid ${T.cardBorder}`,
          borderRadius:  "24px",
          padding:       "40px 36px",
          backdropFilter:"blur(16px)",
          boxShadow:     "0 24px 64px rgba(0,0,0,0.4)",
        }}>
          <h1 style={{ fontFamily: T.display, fontSize: "1.7rem", fontWeight: 400, color: T.text, marginBottom: 28, letterSpacing: "-0.02em" }}>
            Sign in
          </h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={labelStyle}>Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused("")}
                placeholder="SilentFox42"
                style={inputStyle("username")}
                autoComplete="username"
              />
              {errors.username && <p style={{ marginTop: 6, fontSize: 12, color: T.error }}>{errors.username}</p>}
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                placeholder="••••••••"
                style={inputStyle("password")}
                autoComplete="current-password"
              />
              {errors.password && <p style={{ marginTop: 6, fontSize: 12, color: T.error }}>{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop:    4,
                width:        "100%",
                padding:      "14px",
                borderRadius: "12px",
                border:       "none",
                background:   loading ? "rgba(110,231,183,0.15)" : T.accentDim,
                color:        loading ? T.textFaint : T.accent,
                fontSize:     "14px",
                fontWeight:   600,
                fontFamily:   T.sans,
                cursor:       loading ? "not-allowed" : "pointer",
                letterSpacing:"0.04em",
                transition:   "all 0.2s",
                display:      "flex",
                alignItems:   "center",
                justifyContent:"center",
                gap:          8,
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${T.accent}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Signing in…
                </>
              ) : "Sign in →"}
            </button>
          </form>

          <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid rgba(110,231,183,0.08)`, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: T.textMuted }}>
              No account?{" "}
              <a href="/signup" style={{ color: T.accent, textDecoration: "none", fontWeight: 500 }}>
                Join anonymously →
              </a>
            </p>
          </div>
        </div>

        <p style={{ marginTop: 20, textAlign: "center", fontSize: 11, color: T.textFaint, letterSpacing: "0.05em" }}>
          Your identity stays hidden. Always.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0f0a; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(232,245,240,0.2); }
        button:focus { outline: none; }
      `}</style>
    </main>
  );
}