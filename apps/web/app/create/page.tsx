"use client";

import { useState, CSSProperties, ReactElement, ChangeEvent, FormEvent } from "react";
import { apifetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { T } from "../../lib/theme";
import { Avatar } from "../../components/Avatar";

const SUGGESTED_TAGS: string[] = ["React", "Performance", "DevOps", "Career", "Culture", "Bugs", "Architecture", "ML", "Security", "Testing"];

type FormState = {
  title:    string;
  body:     string;
  tags:     string[];
  tagInput: string;
};

type FieldError = Partial<Record<"title" | "body" | "tags", string>>;

export default function CreatePage(): ReactElement {
  const [form, setForm]       = useState<FormState>({ title: "", body: "", tags: [], tagInput: "" });
  const [errors, setErrors]   = useState<FieldError>({});
  const [focused, setFocused] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone]       = useState<boolean>(false);
  const [preview, setPreview] = useState<boolean>(false);
  const { user, logout } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setForm((prev: FormState) => ({ ...prev, [name]: value }));
    setErrors((prev: FieldError) => ({ ...prev, [name]: undefined }));
  };

  const addTag = (tag: string): void => {
    const t = tag.trim().replace(/^#/, "");
    if (!t) return;
    if (form.tags.length >= 5) return;
    if (form.tags.includes(t)) {
      setForm((p: FormState) => ({ ...p, tagInput: "" }));
      return;
    }
    setForm((p: FormState) => ({ ...p, tags: [...p.tags, t], tagInput: "" }));
  };

  const removeTag = (tag: string): void => {
    setForm((p: FormState) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));
  };

  const validate = (): boolean => {
    const newErrors: FieldError = {};
    if (!form.title.trim())             newErrors.title = "A title is required";
    if (form.title.length < 10)         newErrors.title = "Try to be a bit more descriptive";
    if (!form.body.trim())              newErrors.body  = "Please tell the story";
    if (form.body.length < 30)          newErrors.body  = "The community learns from detail!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await apifetch("/post/create", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          content: form.body,
          tags: form.tags,
        }),
      });
      setDone(true);
    } catch (err: any) {
      setErrors({ title: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name: string, extra?: CSSProperties): CSSProperties => ({
    width:        "100%",
    background:   "rgba(255,255,255,0.03)",
    border:       `1px solid ${focused === name ? "rgba(110,231,183,0.4)" : errors[name as keyof FieldError] ? T.error : "rgba(110,231,183,0.12)"}`,
    borderRadius: "12px",
    padding:      "14px 16px",
    color:        T.text,
    fontSize:     "14px",
    fontFamily:   T.sans,
    outline:      "none",
    transition:   "all 0.2s",
    ...extra,
  });

  const labelStyle: CSSProperties = {
    fontSize:      "11px",
    color:         T.textFaint,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom:  "10px",
    display:       "block",
    fontFamily:    T.sans,
    fontWeight:    500,
  };

  if (done) {
    return (
      <main style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.sans, padding: 24 }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(16,85,50,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(110,231,183,0.1)", border: `1px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 24 }}>✨</div>
          <h2 style={{ fontFamily: T.display, fontSize: "2.2rem", color: T.text, marginBottom: 12, letterSpacing: "-0.02em" }}>Shared.</h2>
          <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.6, marginBottom: 32 }}>Your mistake is now helping other developers grow. Thank you for your honesty.</p>
          <a href="/feed" style={{ display: "inline-block", padding: "12px 32px", borderRadius: 30, background: T.accentDim, border: `1px solid ${T.accent}`, color: T.accent, fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: T.sans }}>
            Back to feed →
          </a>
        </div>
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <main style={{ background: T.bg, minHeight: "100vh", fontFamily: T.sans }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 40% at 80% 10%, rgba(16,85,50,0.12) 0%, transparent 60%)" }} />

        <nav style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(10,15,10,0.85)", backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${T.divider}`,
          padding: "0 32px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <a href="/feed" style={{ fontFamily: T.display, fontSize: 22, color: T.text, letterSpacing: "-0.02em", textDecoration: "none" }}>
            Mistake<em style={{ color: T.accent, fontStyle: "italic" }}>Count</em>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a href="/feed" style={{ fontSize: 13, color: T.textMuted, textDecoration: "none" }}>← Back to feed</a>
            {user && (
               <button onClick={logout} style={{ fontSize: 12, color: T.textFaint, background: "transparent", border: "none", cursor: "pointer" }}>Logout</button>
            )}
          </div>
        </nav>

        <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: T.display, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 400, color: T.text, letterSpacing: "-0.02em", marginBottom: 8 }}>
              Share a <em style={{ color: T.accent, fontStyle: "italic" }}>mistake</em>
            </h1>
            <p style={{ fontSize: 13, color: T.textMuted }}>Anonymous. Honest. Helpful. Someone out there needs to read this.</p>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {(["write", "preview"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setPreview(tab === "preview")}
                style={{
                  fontSize: 12, padding: "7px 18px", borderRadius: 20, cursor: "pointer",
                  background:  (tab === "preview") === preview ? T.accentDim : "transparent",
                  border:      `1px solid ${(tab === "preview") === preview ? T.accent : "rgba(110,231,183,0.18)"}`,
                  color:       (tab === "preview") === preview ? T.accent : T.textMuted,
                  fontFamily:  T.sans, textTransform: "capitalize", transition: "all 0.15s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {preview ? (
            <div style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: "20px", padding: "32px", minHeight: 300 }}>
              {form.title ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                     <Avatar username={user?.username || "anonymous"} src={user?.avatar} size={32} />
                    <div>
                      <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{user?.username || "anonymous"}</span>
                      <span style={{ fontSize: 11, color: T.textFaint, marginLeft: 8 }}>just now</span>
                    </div>
                  </div>
                  <h2 style={{ fontFamily: T.display, fontSize: "1.3rem", color: T.text, marginBottom: 14, lineHeight: 1.35 }}>{form.title}</h2>
                  {form.body && <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.65, marginBottom: 16 }}>{form.body}</p>}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                    {form.tags.map((tag: string) => (
                      <span key={tag} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: T.tagBg, color: T.tagText, border: `1px solid ${T.tagBorder}` }}>{tag}</span>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ color: T.textFaint, fontSize: 14, textAlign: "center", paddingTop: 60 }}>Start writing to see your preview…</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Title</label>
                  <span style={{ fontSize: 11, color: form.title.length > 100 ? T.error : T.textFaint }}>{form.title.length}/120</span>
                </div>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  onFocus={() => setFocused("title")}
                  onBlur={() => setFocused("")}
                  placeholder="I thought I understood async/await until…"
                  style={inputStyle("title")}
                  maxLength={120}
                />
                {errors.title && <p style={{ marginTop: 6, fontSize: 12, color: T.error }}>{errors.title}</p>}
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>What happened</label>
                  <span style={{ fontSize: 11, color: T.textFaint }}>{form.body.length} chars</span>
                </div>
                <textarea
                  name="body"
                  value={form.body}
                  onChange={handleChange}
                  onFocus={() => setFocused("body")}
                  onBlur={() => setFocused("")}
                  placeholder="Tell the story. What went wrong? What did you learn? Be honest — that's the whole point."
                  rows={6}
                  style={inputStyle("body", { lineHeight: 1.65 }) as CSSProperties}
                />
                {errors.body && <p style={{ marginTop: 6, fontSize: 12, color: T.error }}>{errors.body}</p>}
              </div>

              <div>
                <label style={labelStyle}>Tags <span style={{ color: T.textFaint }}>({form.tags.length}/5)</span></label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 12 }}>
                  {form.tags.map((tag: string) => (
                    <span
                      key={tag}
                      style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, background: T.accentDim, color: T.accent, border: `1px solid rgba(110,231,183,0.3)`, display: "flex", alignItems: "center", gap: 6 }}
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} style={{ background: "none", border: "none", color: T.accent, cursor: "pointer", padding: 0, fontSize: 14, lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                </div>
                <input
                  name="tagInput"
                  value={form.tagInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((p: FormState) => ({ ...p, tagInput: e.target.value }))}
                  onFocus={() => setFocused("tagInput")}
                  onBlur={() => setFocused("")}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(form.tagInput); } }}
                  placeholder="Type a tag and press Enter…"
                  style={inputStyle("tagInput")}
                  disabled={form.tags.length >= 5}
                />
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginTop: 10 }}>
                  {SUGGESTED_TAGS.filter((t: string) => !form.tags.includes(t)).slice(0, 8).map((tag: string) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      disabled={form.tags.length >= 5}
                      style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: "transparent", border: `1px solid rgba(110,231,183,0.15)`, color: T.textMuted, cursor: "pointer", fontFamily: T.sans, transition: "all 0.15s" }}
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ paddingTop: 8, borderTop: `1px solid ${T.divider}`, display: "flex", gap: 12, alignItems: "center" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex:          1,
                    padding:       "14px",
                    borderRadius:  "12px",
                    border:        "none",
                    background:    loading ? "rgba(110,231,183,0.1)" : T.accentDim,
                    color:         loading ? T.textFaint : T.accent,
                    fontSize:      "14px",
                    fontWeight:    600,
                    fontFamily:    T.sans,
                    cursor:        loading ? "not-allowed" : "pointer",
                    letterSpacing: "0.04em",
                    transition:    "all 0.2s",
                    display:       "flex",
                    alignItems:    "center",
                    justifyContent:"center",
                    gap:           8,
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${T.accent}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                      Posting…
                    </>
                  ) : "Publish anonymously →"}
                </button>
                <a href="/feed" style={{ padding: "14px 20px", borderRadius: "12px", border: "1px solid rgba(110,231,183,0.15)", color: T.textMuted, fontSize: 13, textDecoration: "none", fontFamily: T.sans, textAlign: "center" as const }}>
                  Cancel
                </a>
              </div>
            </form>
          )}
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #0a0f0a; }
          @keyframes spin { to { transform: rotate(360deg); } }
          input::placeholder, textarea::placeholder { color: rgba(232,245,240,0.2); }
          button:focus, input:focus, textarea:focus { outline: none; }
        `}</style>
      </main>
    </ProtectedRoute>
  );
}