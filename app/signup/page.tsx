"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!username.trim()) {
      return setError("Username is required");
    }

    // Validate username format (letters, numbers, underscores, hyphens only)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return setError("Username can only contain letters, numbers, underscores, and hyphens");
    }
    
    try {
      setError("");
      setLoading(true);
      
      // Check if username is already taken
      const usernameDoc = doc(firestore, "usernames", username.toLowerCase());
      const usernameSnapshot = await getDoc(usernameDoc);
      
      if (usernameSnapshot.exists()) {
        setError("Username is already taken");
        setLoading(false);
        return;
      }
      
      // Create user account
      const userCredential = await signup(email, password);
      const user = userCredential.user;
      
      // Store username in Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        email: user.email,
        username: username.toLowerCase(),
        createdAt: new Date().toISOString()
      });
      
      // Create username entry for uniqueness check
      await setDoc(doc(firestore, "usernames", username.toLowerCase()), {
        uid: user.uid
      });
      
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create an account");
      }
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
          <h2 className="text-2xl font-bold mb-6">Create an Account</h2>
          
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
            
            <div className="mb-4">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]"
                required
              />
              <p className="text-xs text-white/50 mt-1">
                This will be your public profile URL: trypaid.io/{username}
              </p>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="password">Password</Label>
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
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-[rgba(255,255,255,0.6)]">
              Already have an account?{" "}
              <Link 
                href="/signin" 
                className="text-[rgba(var(--accent-color),1)] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 