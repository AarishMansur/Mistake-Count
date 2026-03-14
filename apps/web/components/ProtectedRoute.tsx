"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signup");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ 
        height: "100vh", 
        background: "#0a0f0a", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: "#6ee7b7",
        fontFamily: "'Syne', sans-serif"
      }}>
        Authenticating...
      </div>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
}
