import { forwardRef, CSSProperties } from "react";
import { T } from "../../lib/theme";

const h1Style: CSSProperties = {
  fontSize: "clamp(3rem, 8vw, 7rem)",
  fontWeight: 400,
  width: "82%",
  letterSpacing: "-0.03em",
  lineHeight: 1,
  color: T.text,
};

const emStyle: CSSProperties = {
  color: T.accent,
  fontStyle: "italic",
};

const h3CopyStyle: CSSProperties = {
  fontSize: "clamp(1rem, 1.8vw, 1.45rem)",
  fontWeight: 400,
  width: "46%",
  lineHeight: 1.55,
  color: T.textMuted,
  fontFamily: T.sans,
};

const heroBackdropStyle: CSSProperties = {
  width: "100vw",
  height: "100vh",
  transform: "translate(-50%, -50%)",
  willChange: "width, height, border-radius",
  background: T.bg,
};

const glow1Style: CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "radial-gradient(ellipse 80% 65% at 15% 85%, rgba(16,85,50,0.45) 0%, transparent 65%)",
};

const glow2Style: CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "radial-gradient(ellipse 55% 45% at 85% 15%, rgba(6,78,59,0.25) 0%, transparent 60%)",
};

const dotGridStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: "radial-gradient(rgba(110,231,183,0.03) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

interface HeroProps { }

export const Hero = forwardRef<HTMLElement, {
  imageRef: React.RefObject<HTMLDivElement | null>;
  headerRef: React.RefObject<HTMLDivElement | null>;
  copyRef: React.RefObject<HTMLDivElement | null>;
}>((props, ref) => {
  return (
    <section
      ref={ref}
      className="relative w-full h-screen overflow-hidden"
      style={{ fontFamily: T.display }}
    >
      <div
        ref={props.imageRef}
        className="absolute top-1/2 left-1/2 overflow-hidden"
        style={heroBackdropStyle}
      >
        <div style={glow1Style} />
        <div style={glow2Style} />
        <div style={dotGridStyle} />
      </div>

      <div
        ref={props.headerRef}
        className="absolute inset-0 flex items-center text-center justify-center pb-16 px-12"
        style={{ willChange: "transform" }}
      >
        <h1 style={h1Style}>
          Where every mistake
          <br />
          <em style={emStyle}>becomes a lesson</em>
        </h1>
      </div>

      <div
        ref={props.copyRef}
        className="absolute inset-0 flex items-center justify-center pb-16 px-12"
        style={{ willChange: "opacity" }}
      >
        <h3 style={h3CopyStyle}>
          A community where developers share their real struggles
          anonymously and honestly, so others can grow faster.
        </h3>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
