"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/signin");
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--background-rgb))] text-white">
        <div className="text-center">
          <h1 className="text-3xl font-black accent-text mb-4">Paid.</h1>
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return currentUser ? <>{children}</> : null;
} 