import { ReactElement, CSSProperties } from "react";
import { T } from "../../lib/theme";

export type Post = {
  id: string;
  username: string;
  role: string;
  title: string;
  tags: string[];
  votes: number;
};

export type AvatarConfig = {
  style: string;
  colors: string;
};

type PostCardProps = {
  post: Post;
  avatarConfig: AvatarConfig;
};

export function PostCardLanding({ post, avatarConfig }: PostCardProps): ReactElement {
  const cardStyle: CSSProperties = {
    background: T.card,
    border: `1px solid ${T.cardBorder}`,
    borderRadius: "16px",
    padding: "20px 22px",
    width: "220px",
    backdropFilter: "blur(14px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(110,231,183,0.05)",
    fontFamily: T.sans,
  };

  const headerRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  };

  const avatarStyle: CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: "50%",
    flexShrink: 0,
    background: T.accentDim,
  };

  const usernameStyle: CSSProperties = {
    fontSize: "12px",
    color: T.text,
    fontWeight: 500,
  };

  const roleStyle: CSSProperties = {
    fontSize: "11px",
    color: T.textFaint,
  };

  const titleStyle: CSSProperties = {
    fontSize: "13px",
    lineHeight: 1.55,
    color: T.textMuted,
    marginBottom: "14px",
  };

  const footerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const tagsRowStyle: CSSProperties = {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  };

  const tagStyle: CSSProperties = {
    fontSize: "10px",
    padding: "3px 8px",
    borderRadius: "20px",
    background: T.tagBg,
    color: T.tagText,
    border: `1px solid ${T.tagBorder}`,
  };

  const votesStyle: CSSProperties = {
    fontSize: "12px",
    color: T.textFaint,
    display: "flex",
    alignItems: "center",
    gap: 3,
  };

  const arrowStyle: CSSProperties = {
    fontSize: "14px",
    color: T.accent,
  };

  return (
    <div style={cardStyle}>
      <div style={headerRowStyle}>
        <img
          src={`https://api.dicebear.com/9.x/${avatarConfig.style}/svg?seed=${encodeURIComponent(post.username)}&backgroundColor=${avatarConfig.colors}`}
          alt={post.username}
          style={avatarStyle}
        />
        <div>
          <div style={usernameStyle}>{post.username}</div>
          <div style={roleStyle}>{post.role}</div>
        </div>
      </div>

      <p style={titleStyle}>{post.title}</p>

      <div style={footerStyle}>
        <div style={tagsRowStyle}>
          {post.tags.map((tag: string) => (
            <span key={tag} style={tagStyle}>{tag}</span>
          ))}
        </div>
        <div style={votesStyle}>
          <span style={arrowStyle}>↑</span>
          {post.votes}
        </div>
      </div>
    </div>
  );
}
