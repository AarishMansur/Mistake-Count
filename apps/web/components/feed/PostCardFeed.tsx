import { ReactElement, useState, CSSProperties } from "react";
import { T } from "../../lib/theme";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../Avatar";

interface PostCardFeedProps {
  post: any;
  onVote: (id: string) => void;
}

export function PostCardFeed({ post, onVote }: PostCardFeedProps): ReactElement {
  const [hovered, setHovered] = useState<boolean>(false);
  const { user } = useAuth();

  const cardStyle: CSSProperties = {
    background: hovered ? T.cardHover : T.card,
    border: `1px solid ${hovered ? "rgba(110,231,183,0.22)" : T.cardBorder}`,
    borderRadius: "20px",
    padding: "28px 32px",
    transition: "background 0.2s, border-color 0.2s",
    cursor: "default",
    fontFamily: T.sans,
  };

  const hasVoted = post.votes?.some((v: any) => v.userId === (user as any)?.id);

  return (
    <div style={cardStyle} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, paddingTop: 2 }}>
          <button
            onClick={() => onVote(post.id)}
            style={{
              background: hasVoted ? T.accentDim : "transparent",
              border: `1px solid ${hasVoted ? T.accent : "rgba(110,231,183,0.25)"}`,
              borderRadius: "10px",
              padding: "6px 10px",
              color: hasVoted ? T.accent : T.textFaint,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              transition: "all 0.15s",
              fontFamily: T.sans,
            }}
          >
            <span style={{ fontSize: 16 }}>↑</span>
            <span style={{ fontWeight: 600 }}>{post.votes?.length || 0}</span>
          </button>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Avatar
              username={post.author?.username || "anonymous"}
              src={post.author?.avatar}
              size={32}
            />
            <div>
              <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{post.author?.username || "anonymous"}</span>
              <span style={{ fontSize: 11, color: T.textFaint, marginLeft: 8 }}>{post.author?.role}</span>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 11, color: T.textFaint }}>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          <h2 style={{ fontSize: "clamp(1rem, 1.5vw, 1.15rem)", fontWeight: 400, color: T.text, lineHeight: 1.35, marginBottom: 10, fontFamily: T.display }}>
            {post.title}
          </h2>

          <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.65, marginBottom: 16 }}>
            {post.content}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
            {post.tags?.map((t: any) => (
              <span key={t.tag?.id} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: T.tagBg, color: T.tagText, border: `1px solid ${T.tagBorder}` }}>
                {t.tag?.name || "Mistake"}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
