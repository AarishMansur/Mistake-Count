"use client";

import { useEffect, useState, ReactElement } from "react";
import { apifetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { T } from "../../lib/theme";
import { FILTERS } from "../../lib/data";
import { Avatar } from "../../components/Avatar";
import { PostCardFeed } from "../../components/feed/PostCardFeed";

export default function FeedPage(): ReactElement {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"top" | "new">("top");
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await apifetch("/post/feed");
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id: string): Promise<void> => {
    if (!user) {
      alert("Please sign in to vote!");
      return;
    }
    try {
      await apifetch("/post/vote", {
        method: "POST",
        body: JSON.stringify({ postId: id }),
      });
      fetchPosts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = posts
    .filter((p: any) => {
      if (activeFilter === "All") return true;
      return p.tags?.some((t: any) => t.tag?.name === activeFilter);
    })
    .sort((a, b) => {
      if (sortBy === "top") return (b.votes?.length || 0) - (a.votes?.length || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <ProtectedRoute>
      <main style={{ background: T.bg, minHeight: "100vh", fontFamily: T.sans }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 40% at 80% 10%, rgba(16,85,50,0.1) 0%, transparent 60%)" }} />

        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(10,15,10,0.85)", backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${T.divider}`,
          padding: "0 40px", height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <a href="/" style={{ fontFamily: T.display, fontSize: 26, color: T.text, letterSpacing: "-0.02em", textDecoration: "none" }}>
              Mistake<em style={{ color: T.accent, fontStyle: "italic" }}>Count</em>
            </a>
            <div style={{ display: "flex", gap: 6 }}>
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    fontSize: 12, padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                    background: activeFilter === f ? T.accentDim : "transparent",
                    border: `1px solid ${activeFilter === f ? T.accent : "transparent"}`,
                    color: activeFilter === f ? T.accent : T.textMuted,
                    fontFamily: T.sans, transition: "all 0.2s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: 20, padding: 3, border: `1px solid ${T.divider}` }}>
              <button onClick={() => setSortBy("top")} style={{ fontSize: 11, padding: "5px 12px", borderRadius: 18, border: "none", cursor: "pointer", background: sortBy === "top" ? T.accentDim : "transparent", color: sortBy === "top" ? T.accent : T.textFaint, transition: "all 0.2s" }}>Top</button>
              <button onClick={() => setSortBy("new")} style={{ fontSize: 11, padding: "5px 12px", borderRadius: 18, border: "none", cursor: "pointer", background: sortBy === "new" ? T.accentDim : "transparent", color: sortBy === "new" ? T.accent : T.textFaint, transition: "all 0.2s" }}>New</button>
            </div>
            <a href="/create" style={{ background: T.accentDim, border: `1px solid ${T.accent}`, color: T.accent, padding: "10px 24px", borderRadius: 30, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "transform 0.2s" }}>
              Share Mistake
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {user && (
                <>
                  <Avatar
                    username={user.username}
                    src={user.avatar}
                  />
                  <button
                    onClick={logout}
                    style={{
                      fontSize: 12,
                      color: T.textFaint,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = T.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = T.textFaint)}
                  >
                    Logout
                  </button>
                </>
              )}
              {!user && !loading && (
                <a href="/login" style={{ fontSize: 13, color: T.textMuted, textDecoration: "none" }}>Sign In</a>
              )}
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: 740, margin: "0 auto", padding: "48px 20px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {filtered.map((post: any) => (
              <PostCardFeed key={post.id} post={post} onVote={handleVote} />
            ))}

            {filtered.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "80px 0", color: T.textFaint }}>
                <p style={{ fontSize: 15 }}>No mistakes found in this category yet.</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>Be the first to share one!</p>
              </div>
            )}
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #0a0f0a; }
          button:focus { outline: none; }
        `}</style>
      </main>
    </ProtectedRoute>
  );
}
