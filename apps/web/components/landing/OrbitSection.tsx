import { forwardRef, CSSProperties, ReactElement } from "react";
import { T } from "../../lib/theme";
import { PostCardLanding, Post, AvatarConfig, AvatarConfig as AvatarConfigType } from "./PostCardLanding";

const orbitSectionStyle: CSSProperties = {
  marginTop: "350vh",
  minHeight: "100vh",
  overflow: "hidden",
};

const centerGlowStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 440,
  height: 440,
  borderRadius: "50%",
  background: `radial-gradient(circle, ${T.accentGlow} 0%, transparent 70%)`,
  pointerEvents: "none",
};

const centerTextStyle: CSSProperties = {
  position: "relative",
  zIndex: 10,
  textAlign: "center",
  maxWidth: 300,
};

const eyebrowStyle: CSSProperties = {
  fontSize: "10px",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: T.accent,
  marginBottom: "14px",
  fontFamily: T.sans,
};

const centerH3Style: CSSProperties = {
  fontSize: "clamp(1.5rem, 2.6vw, 2.2rem)",
  fontWeight: 400,
  lineHeight: 1.25,
  color: T.text,
  letterSpacing: "-0.02em",
  fontFamily: T.display,
};

const ctaButtonStyle: CSSProperties = {
  marginTop: "28px",
  padding: "11px 28px",
  borderRadius: "40px",
  border: "1px solid rgba(110,231,183,0.3)",
  color: T.accent,
  fontSize: "13px",
  letterSpacing: "0.05em",
  background: "transparent",
  fontFamily: T.sans,
  cursor: "pointer",
};

type OrbitEntry = {
  angle: number;
  radius: number;
  travel: number;
};

type OrbitXY = {
  x: number;
  y: number;
};

function getOrbitXY(angle: number, radius: number): OrbitXY {
  const rad: number = (angle * Math.PI) / 180;
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
}

interface OrbitSectionProps {
  posts: Post[];
  avatarConfigs: AvatarConfigType[];
  orbitConfig: OrbitEntry[];
  onStartSharing: () => void;
}

export const OrbitSection = forwardRef<HTMLElement, OrbitSectionProps>((props, ref) => {
  const { posts, avatarConfigs, orbitConfig, onStartSharing } = props;

  return (
    <section
      ref={ref}
      className="relative w-full flex items-center justify-center"
      style={orbitSectionStyle}
    >
      {([880, 660] as number[]).map((size: number) => (
        <div
          key={size}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: size,
            height: size,
            borderRadius: "50%",
            border: `1px dashed ${T.ring}`,
            pointerEvents: "none",
          }}
        />
      ))}

      <div style={centerGlowStyle} />

      {posts.map((post: Post, i: number): ReactElement => {
        const orbit: OrbitEntry = orbitConfig[i] ?? orbitConfig[0]!;
        const avatar: AvatarConfig = avatarConfigs[i] ?? avatarConfigs[0]!;
        const { x, y }: OrbitXY = getOrbitXY(orbit.angle, orbit.radius);
        return (
          <div
            key={post.id}
            id={`post-card-${post.id}`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              willChange: "transform",
              zIndex: 2,
            }}
          >
            <PostCardLanding post={post} avatarConfig={avatar} />
          </div>
        );
      })}

      <div style={centerTextStyle}>
        <p style={eyebrowStyle}>Real stories · Anonymous voices</p>
        <h3 style={centerH3Style}>
          Every post is a mistake someone else won't have to make
        </h3>
        <button style={ctaButtonStyle} onClick={onStartSharing}>
          Start sharing →
        </button>
      </div>
    </section>
  );
});

OrbitSection.displayName = "OrbitSection";
