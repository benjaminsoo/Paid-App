"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import ProtectedRoute from "@/components/protected-route";

export default function ProfilePage() {
  const { currentUser, userProfile, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    } finally {
      setLoggingOut(false);
    }
  }

  const copyToClipboard = () => {
    if (userProfile?.username) {
      navigator.clipboard.writeText(`trypaid.io/${userProfile.username}`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Check if profile has been set up
  const hasProfileData = userProfile?.profile && 
    (userProfile.profile.name || 
     userProfile.profile.location || 
     userProfile.profile.profileImageUrl || 
     userProfile.profile.backgroundImageUrl ||
     (userProfile.profile.paymentMethods && 
      userProfile.profile.paymentMethods.some((method: { value: string }) => method.value)));

  return (
    <ProtectedRoute>
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
          
          <button 
            onClick={handleLogout} 
            disabled={loggingOut}
            className="px-4 py-2 rounded-full border border-white/10 text-white transition btn-sleek bg-[rgba(30,30,35,0.7)] backdrop-blur-sm shadow-md hover:bg-[rgba(40,40,45,0.8)] active:translate-y-0.5 active:shadow-sm"
          >
            {loggingOut ? "Logging out..." : "Sign Out"}
          </button>
        </header>
        
        <div className="flex-1 flex items-start justify-center relative z-10 px-6 py-6">
          <div className="max-w-3xl w-full">
            <div className="bg-[rgba(20,20,25,0.6)] backdrop-blur-xl p-10 rounded-3xl border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all hover:shadow-[0_8px_40px_rgba(var(--accent-color),0.15)]">
              <h2 className="text-3xl font-bold mb-8 accent-text bg-gradient-to-r from-white to-white/75 bg-clip-text text-transparent">My Profile</h2>
              
              {/* Profile URL Card - Special Styling */}
              {userProfile?.username && (
                <div className="mb-10 transform perspective-1000 overflow-x-auto">
                  <div className={`relative ${!hasProfileData ? 'bg-gradient-to-b from-[rgba(220,38,38,0.15)] to-[rgba(220,38,38,0.05)] border-[rgba(220,38,38,0.2)]' : 'bg-gradient-to-b from-[rgba(var(--accent-color),0.15)] to-[rgba(var(--accent-color),0.05)] border-[rgba(var(--accent-color),0.2)]'} p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border overflow-hidden group hover:shadow-[0_4px_25px_rgba(0,0,0,0.25)] transition-all duration-300 min-w-[300px]`}>
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${!hasProfileData ? 'via-[rgba(220,38,38,0.6)]' : 'via-[rgba(var(--accent-color),0.6)]'} to-transparent`}></div>
                    <div className={`absolute -top-40 -right-40 w-80 h-80 opacity-20 ${!hasProfileData ? 'bg-[rgba(220,38,38,0.4)]' : 'bg-[rgba(var(--accent-color),0.4)]'} rounded-full blur-3xl group-hover:opacity-30 transition-opacity`}></div>
                    
                    <h3 className="text-xl font-bold text-white/90 mb-3">
                      {hasProfileData ? "Your Personal Payment Link" : "Your Link has not been created yet"}
                    </h3>
                    <div className="flex items-center">
                      <div className={`bg-[rgba(15,15,20,0.5)] px-4 py-3 rounded-l-lg border-y border-l border-[rgba(255,255,255,0.1)] flex-1 font-mono ${!hasProfileData ? 'text-[rgba(220,38,38,1)]' : 'text-[rgba(var(--accent-color),1)]'} truncate`}>
                        trypaid.io/{userProfile.username}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          copyToClipboard();
                        }}
                        type="button"
                        className={`${!hasProfileData ? 'bg-[rgba(220,38,38,0.9)] hover:bg-[rgba(220,38,38,1)] border-[rgba(220,38,38,0.6)] shadow-[0_4px_12px_rgba(220,38,38,0.2)] hover:shadow-[0_4px_20px_rgba(220,38,38,0.4)]' : 'bg-[rgba(var(--accent-color),0.9)] hover:bg-[rgba(var(--accent-color),1)] border-[rgba(var(--accent-color),0.6)] shadow-[0_4px_12px_rgba(var(--accent-color),0.2)] hover:shadow-[0_4px_20px_rgba(var(--accent-color),0.4)]'} px-4 py-3 rounded-r-lg border text-white font-medium transition-all flex items-center relative z-20 cursor-pointer`}
                      >
                        {copied ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Copied
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="mt-3 text-white/60 text-sm">
                      {hasProfileData 
                        ? "Share this link with anyone to receive payments through any of your configured methods."
                        : "This is what your link address will be after you create it."}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Account Information */}
              <div className="mb-8 overflow-x-auto">
                <h3 className="text-lg font-medium text-white/80 mb-3 flex items-center">
                  <span className="inline-block w-7 h-7 rounded-full bg-[rgba(var(--accent-color),0.2)] mr-2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--accent-color), 1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  Account Information
                </h3>
                <div className="bg-[rgba(25,25,30,0.5)] p-5 rounded-xl border border-[rgba(255,255,255,0.08)] backdrop-blur-sm min-w-[300px]">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start">
                      <span className="text-white/50 w-24 flex-shrink-0">Email:</span> 
                      <span className="text-white/90 truncate">{currentUser?.email}</span>
                    </div>
                    {userProfile?.username && (
                      <div className="flex items-start">
                        <span className="text-white/50 w-24 flex-shrink-0">Username:</span> 
                        <span className="text-white/90 truncate">{userProfile.username}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Edit Profile Button */}
              <div>
                <Link 
                  href="/profile/edit"
                  className="block w-full py-4 px-6 rounded-xl bg-gradient-to-br from-[rgba(var(--accent-color),0.8)] to-[rgba(var(--accent-color),0.6)] hover:from-[rgba(var(--accent-color),0.9)] hover:to-[rgba(var(--accent-color),0.7)] text-white text-center transition-all font-medium shadow-[0_4px_20px_rgba(var(--accent-color),0.3)] hover:shadow-[0_6px_30px_rgba(var(--accent-color),0.5)] active:translate-y-0.5"
                >
                  {hasProfileData ? "Edit Profile" : "Create Your Link"}
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add bottom spacing */}
        <div className="pb-32"></div>
        
      </main>
    </ProtectedRoute>
  );
} 