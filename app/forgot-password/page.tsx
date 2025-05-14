"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(email);
      setMessage("Check your email for password reset instructions");
    } catch (err) {
      setError("Failed to reset password. Please check your email address.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-screen overflow-y-auto overscroll-behavior-y-none bg-[rgb(var(--background-rgb))] text-white flex flex-col">
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
          <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
          
          {error && (
            <Alert className="mb-4 bg-red-500/10 text-red-500 border-red-500/20">
              {error}
            </Alert>
          )}
          
          {message && (
            <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
              {message}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
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
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[rgba(var(--accent-color),1)] hover:bg-[rgba(var(--accent-color),0.9)]"
            >
              {loading ? "Sending Reset Link..." : "Reset Password"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              href="/signin" 
              className="text-[rgba(var(--accent-color),1)] hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 