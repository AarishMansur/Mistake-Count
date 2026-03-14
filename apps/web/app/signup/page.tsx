"use client";

import { useState, CSSProperties, ReactElement, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apifetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const T = {
  bg: "#0a0f0a",
  card: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(110,231,183,0.12)",
  accent: "#6ee7b7",
  accentDim: "rgba(110,231,183,0.18)",
  text: "#e8f5f0",
  textMuted: "rgba(232,245,240,0.5)",
  textFaint: "rgba(232,245,240,0.3)",
  inputBg: "rgba(255,255,255,0.04)",
  inputBorder: "rgba(110,231,183,0.2)",
  inputFocus: "rgba(110,231,183,0.5)",
  error: "#f87171",
  success: "#6ee7b7",
  display: "'Instrument Serif', Georgia, serif",
  sans: "'Syne', sans-serif",
};

const ROLES: string[] = [
  "Junior Developer",
  "Mid-level Developer",
  "Senior Engineer",
  "Fullstack Dev",
  "Frontend Dev",
  "Backend Engineer",
  "ML Engineer",
  "DevOps Engineer",
  "Engineering Manager",
  "Other",
];

const adjectives = ["Silent", "Hidden", "Shadow", "Ghost", "Bug", "Lost", "Quiet", "Vivid", "Neon", "Cold", "Solar", "Lunar"];
const nouns = ["Fox", "Dev", "Hunter", "Coder", "Tiger", "Knight", "Falcon", "Wolf", "Owl", "Bear", "Phoenix", "Raven"];

type FormState = {
  password: string;
  role: string;
  company: string;
};

type FieldError = Partial<Record<keyof FormState, string>>;

export default function SignupPage(): ReactElement {
  const [form, setForm] = useState<FormState>({ password: "", role: "", company: "" });
  const [identity, setIdentity] = useState({ username: "Anonymous", avatar: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [focused, setFocused] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const { login: authLogin, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/feed");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 1000);
    const username = `${adj}-${noun}-${num}`;
    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;
    setIdentity({ username, avatar });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setForm((prev: FormState) => ({ ...prev, [name]: value }));
    setErrors((prev: FieldError) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FieldError = {};
    if (!form.password) newErrors.password = "Password is required";
    if (form.password.length < 6) newErrors.password = "At least 6 characters";
    if (!form.role) newErrors.role = "Please select your role";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await apifetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          password: form.password,
          role: form.role,
          company: form.company,
          username: identity.username,
          avatar: identity.avatar,
        }),
      });

      authLogin(data.token, {
        id: data.id,
        username: data.username,
        avatar: data.avatar,
        role: form.role,
      });
      setDone(true);
    } catch (err: any) {
      setErrors({ password: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name: string): CSSProperties => ({
    width: "100%",
    background: T.inputBg,
    border: `1px solid ${focused === name ? T.inputFocus : errors[name as keyof FieldError] ? T.error : T.inputBorder}`,
    borderRadius: "12px",
    padding: "14px 16px",
    color: T.text,
    fontSize: "14px",
    fontFamily: T.sans,
    outline: "none",
    transition: "border-color 0.2s",
  });

  const labelStyle: CSSProperties = {
    fontSize: "12px",
    color: T.textMuted,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: "8px",
    display: "block",
    fontFamily: T.sans,
  };

  if (done) {
    return (
      <main style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.sans, padding: 24 }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(16,85,50,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 380 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.accentDim, border: `1px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 28 }}>✓</div>
          <h2 style={{ fontFamily: T.display, fontSize: "1.8rem", color: T.text, marginBottom: 12, letterSpacing: "-0.02em" }}>
            You're <em style={{ color: T.accent, fontStyle: "italic" }}>in</em>
          </h2>
          <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.6, marginBottom: 8 }}>Your anonymous identity has been created.</p>
          <p style={{ fontSize: 16, color: T.accent, fontWeight: 600, marginBottom: 28 }}>Welcome to MistakeCount</p>
          <a href="/feed" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 30, background: T.accentDim, border: `1px solid ${T.accent}`, color: T.accent, fontSize: 14, fontWeight: 500, textDecoration: "none", fontFamily: T.sans }}>
            Go to feed →
          </a>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600&display=swap'); *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } body { background: #0a0f0a; }`}</style>
      </main>
    );
  }

  return (
    <main style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.sans, padding: "24px" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(16,85,50,0.12) 0%, transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontFamily: T.display, fontSize: 28, color: T.text, letterSpacing: "-0.02em" }}>
            Mistake<em style={{ color: T.accent, fontStyle: "italic" }}>Count</em>
          </span>
          <p style={{ marginTop: 8, fontSize: 13, color: T.textMuted }}>Join anonymously. No name. No face. Just honesty.</p>
        </div>

        <div style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: "24px", padding: "40px 36px", backdropFilter: "blur(16px)", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
          <h1 style={{ fontFamily: T.display, fontSize: "1.7rem", fontWeight: 400, color: T.text, marginBottom: 6, letterSpacing: "-0.02em" }}>
            Create account
          </h1>
          <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 28 }}>Your identity will be randomly generated.</p>

          <div style={{ background: "rgba(110,231,183,0.05)", border: `1px solid rgba(110,231,183,0.15)`, borderRadius: 16, padding: "16px 20px", marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}>
            {identity.avatar && (
              <img
                src={identity.avatar}
                alt="Your avatar"
                style={{ width: 44, height: 44, borderRadius: "50%", background: T.accentDim, flexShrink: 0 }}
              />
            )}
            <div>
              <p style={{ fontSize: 11, color: T.textFaint, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Your anonymous identity</p>
              <p style={{ fontSize: 15, color: T.accent, fontWeight: 600 }}>@{identity.username}</p>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 11, color: T.textFaint, textAlign: "center", lineHeight: 1.4 }}>
              🎲<br />randomly<br />assigned
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
                autoComplete="new-password"
              />
              {errors.password && <p style={{ marginTop: 6, fontSize: 12, color: T.error }}>{errors.password}</p>}
            </div>

            <div>
              <label style={labelStyle}>Your Role <span style={{ color: T.accent }}>*</span></label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                onFocus={() => setFocused("role")}
                onBlur={() => setFocused("")}
                style={{ ...inputStyle("role"), appearance: "none" as const }}
              >
                <option value="" disabled style={{ background: "#0a0f0a" }}>Select your role…</option>
                {ROLES.map((r: string) => (
                  <option key={r} value={r} style={{ background: "#0a0f0a" }}>{r}</option>
                ))}
              </select>
              {errors.role && <p style={{ marginTop: 6, fontSize: 12, color: T.error }}>{errors.role}</p>}
            </div>

            <div>
              <label style={labelStyle}>Company <span style={{ color: T.textFaint }}>(optional)</span></label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                onFocus={() => setFocused("company")}
                onBlur={() => setFocused("")}
                placeholder="Where you work"
                style={inputStyle("company")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: loading ? "rgba(110,231,183,0.1)" : T.accentDim,
                color: loading ? T.textFaint : T.accent,
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: T.sans,
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.04em",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${T.accent}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Creating your identity…
                </>
              ) : "Join anonymously →"}
            </button>
          </form>

          <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(110,231,183,0.08)", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: T.textMuted }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: T.accent, textDecoration: "none", fontWeight: 500 }}>Sign in →</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0f0a; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(232,245,240,0.2); }
        select option { background: #0a0f0a; color: #e8f5f0; }
        button:focus, input:focus, select:focus { outline: none; }
      `}</style>
    </main>
  );
}