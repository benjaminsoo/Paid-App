"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-y-none bg-[rgb(var(--background-rgb))] text-white flex flex-col">
      {/* Background elements */}
      <div className="main-background"></div>
      <div className="noise-overlay"></div>
      <div className="accent-glow accent-glow-1"></div>
      <div className="accent-glow accent-glow-2"></div>
      
      {/* Header */}
      <header className="py-8 px-6 max-w-6xl mx-auto flex justify-between items-center relative z-20 w-full">
        <Link href="/">
          <h1 className="text-3xl font-black accent-text">Paid.</h1>
        </Link>
      </header>
      
      <div className="flex-1 flex items-center justify-center relative z-10 px-6 py-12">
        <div className="max-w-md w-full bg-[rgba(30,30,35,0.5)] backdrop-blur-xl p-8 rounded-2xl border border-[rgba(255,255,255,0.1)]">
          <h2 className="text-2xl font-bold mb-6">Sign In</h2>
          
          {error && (
            <Alert className="mb-4 bg-red-500/10 text-red-500 border-red-500/20">
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]"
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-[rgba(var(--accent-color),1)] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[rgba(var(--accent-color),1)] hover:bg-[rgba(var(--accent-color),0.9)]"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-[rgba(255,255,255,0.6)]">
              Don't have an account?{" "}
              <Link 
                href="/signup" 
                className="text-[rgba(var(--accent-color),1)] hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 