import { ReactElement, CSSProperties } from "react";
import { T } from "../../lib/theme";

const outroSectionStyle: CSSProperties = {
  background: T.bgDeep,
  position: "relative",
  width: "100%",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const outroGlowStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(16,85,50,0.2) 0%, transparent 70%)",
  pointerEvents: "none",
};

const outroH3Style: CSSProperties = {
  fontSize: "clamp(1.5rem, 3vw, 2.8rem)",
  fontWeight: 400,
  width: "min(560px, 80vw)",
  lineHeight: 1.3,
  letterSpacing: "-0.02em",
  color: T.textMuted,
  fontFamily: T.display,
  margin: "0 auto 14px",
};

const outroSubStyle: CSSProperties = {
  fontSize: "11px",
  color: "rgba(110,231,183,0.4)",
  fontFamily: T.sans,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

export function OutroSection(): ReactElement {
  return (
    <section style={outroSectionStyle}>
      <div style={outroGlowStyle} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h3 style={outroH3Style}>
          Your next mistake might be someone else's breakthrough.
        </h3>
        <p style={outroSubStyle}>MistakeCount  built by devs, for devs</p>
      </div>
    </section>
  );
}
