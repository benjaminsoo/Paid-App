"use client";

import Link from "next/link"
import Image from "next/image"
import PaymentOption from "@/components/payment-option"
import ProfileHeader from "@/components/profile-header"
import { useAuth } from "@/lib/auth"

// Define local types for the demo display
interface PaymentOptionForDemo {
  icon: string;
  name: string;
  handle: string;
  color: string;
  iconFormat: string;
  paypalAmount?: string;
}

// Create a local mock database for the demo display
const demoUser = {
  name: "Alex Johnson",
  location: "San Francisco, CA",
  occupation: "Software Engineer @Tech Company",
  profileImage: "/profile-picture.jpeg",
  backgroundImage: "/profile-background.jpg",
  paymentOptions: [
    { 
      icon: "venmo", 
      name: "Venmo", 
      handle: "@alex-johnson", 
      color: "bg-[#3D95CE]", 
      iconFormat: "png"
    },
    { 
      icon: "zelle", 
      name: "Zelle", 
      handle: "+1 (555) 123-4567", 
      color: "bg-[#6D1ED4]", 
      iconFormat: "png" 
    },
    { 
      icon: "cashapp", 
      name: "Cash App", 
      handle: "$alexjohnson", 
      color: "bg-[#00D632]", 
      iconFormat: "png" 
    },
    { 
      icon: "paypal", 
      name: "PayPal", 
      handle: "alex.johnson@email.com", 
      color: "bg-[#0079C1]", 
      iconFormat: "png",
      paypalAmount: "10" 
    },
    { 
      icon: "applepay", 
      name: "Apple Pay", 
      handle: "+1 (555) 123-4567", 
      color: "bg-[#000000]", 
      iconFormat: "jpg" 
    }
  ]
};

export default function Home() {
  // Get the demo user data for the mock phone preview
  const userData = demoUser;
  const { currentUser } = useAuth();

  return (
    <main className="h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-y-none bg-[rgb(var(--background-rgb))] text-white relative">
      {/* Background elements */}
      <div className="main-background"></div>
      <div className="noise-overlay"></div>
      <div className="accent-glow accent-glow-1"></div>
      <div className="accent-glow accent-glow-2"></div>
      <div className="light-beam light-beam-1"></div>
      <div className="light-beam light-beam-2"></div>
      
      {/* Header */}
      <header className="py-8 px-6 max-w-6xl mx-auto flex justify-between items-center relative z-20">
        <h1 className="text-3xl font-black accent-text">Paid.</h1>
        <div className="flex space-x-4">
          {currentUser ? (
            <Link href="/profile" className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition btn-sleek flex items-center justify-center">
              My Profile
            </Link>
          ) : (
            <>
          <Link href="/signin" className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition btn-sleek flex items-center justify-center">
            Sign In
          </Link>
          <Link href="/signup" className="px-4 py-2 rounded-full bg-[rgba(var(--accent-color),1)] hover:bg-[rgba(var(--accent-color),0.9)] transition btn-sleek btn-accent flex items-center justify-center">
            Sign Up
          </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold leading-tight fade-in">One link for all your payment methods</h2>
            <p className="mt-6 text-xl text-white/70 fade-in delay-1">From IOU to Paid. Your money shouldn't wait in someone else's wallet.</p>
            <div className="mt-8 flex space-x-4 fade-in delay-2">
              {currentUser ? (
                <Link href="/profile" className="px-8 py-4 rounded-full bg-[rgba(var(--accent-color),1)] hover:bg-[rgba(var(--accent-color),0.9)] transition font-medium btn-sleek btn-accent text-lg flex items-center justify-center">
                  Manage Your Page
                </Link>
              ) : (
              <Link href="/signup" className="px-8 py-4 rounded-full bg-[rgba(var(--accent-color),1)] hover:bg-[rgba(var(--accent-color),0.9)] transition font-medium btn-sleek btn-accent text-lg flex items-center justify-center">
                Create Your Page
              </Link>
              )}
              <Link href="/alexjohnson" className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition font-medium btn-sleek flex items-center justify-center">
                View Demo
              </Link>
            </div>
          </div>
          
          {/* Mock iPhone displaying Alex's profile */}
          <div className="relative flex justify-center mt-16 hero-float fade-in delay-3">
            {/* Try Demo text and arrow */}
            <div className="absolute -top-24 flex flex-col items-center w-full">
              <div className="curved-text-container mb-2">
                <div className="curved-text text-2xl md:text-3xl font-extrabold text-white">
                  Try Scrolling/Clicking
                </div>
              </div>
              <div className="bouncing-arrow mt-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L12 20M12 20L18 14M12 20L6 14" stroke="rgba(var(--accent-color),1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="relative w-[320px] h-[650px] mx-auto iphone-container iphone-colors">
              {/* iPhone Frame with realistic details - green stroke */}
              <div className="absolute inset-0 bg-[#1A1A1C] rounded-[40px] border-[5px] border-[rgba(var(--accent-color),0.9)] shadow-lg iphone-shadow">
                {/* Green frame shine overlay */}
                <div className="absolute inset-[-5px] rounded-[40px] green-frame opacity-70 pointer-events-none"></div>
                
                {/* Side buttons */}
                <div className="absolute -left-[0.5px] top-[120px] w-[2px] h-[30px] bg-[rgba(var(--accent-color),0.8)] rounded-l-lg iphone-button"></div>
                <div className="absolute -left-[0.5px] top-[165px] w-[2px] h-[60px] bg-[rgba(var(--accent-color),0.8)] rounded-l-lg iphone-button"></div>
                <div className="absolute -right-[0.5px] top-[120px] w-[2px] h-[40px] bg-[rgba(var(--accent-color),0.8)] rounded-r-lg iphone-button"></div>
                
                {/* iPhone notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[180px] h-[30px] bg-black rounded-b-3xl z-50 iphone-notch">
                  {/* Camera dot */}
                  <div className="absolute right-[50px] top-[11px] w-[6px] h-[6px] rounded-full bg-[#1a1a1a]">
                    <div className="absolute inset-0.5 rounded-full bg-[#0c0c0c]"></div>
                  </div>
                </div>
                
                {/* Screen with bezels */}
                <div className="absolute inset-[2px] rounded-[38px] overflow-hidden iphone-content">
                  {/* Status Bar */}
                  <div className="relative h-[45px] bg-transparent flex justify-between items-center px-6 z-10">
                    <div className="text-white text-xs font-medium">9:41</div>
                    <div className="flex items-center">
                      <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Battery body */}
                        <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="white" strokeOpacity="0.8"/>
                        {/* Battery tip */}
                        <path d="M23 4V8C23.8047 7.66122 24.328 6.87313 24.328 6C24.328 5.12687 23.8047 4.33878 23 4Z" fill="white" fillOpacity="0.8"/>
                        {/* Battery charge level - green fill */}
                        <rect x="2" y="2" width="9" height="8" rx="1.5" fill="#50DC78"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Search/URL bar */}
                  <div className="relative px-4 pb-3">
                    <div className="h-9 bg-[rgba(40,40,45,0.6)] rounded-xl flex items-center px-3">
                      <div className="flex items-center w-full">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 opacity-60">
                          <path d="M13 13L10.1 10.1M11.6667 6.33333C11.6667 9.27885 9.27885 11.6667 6.33333 11.6667C3.38781 11.6667 1 9.27885 1 6.33333C1 3.38781 3.38781 1 6.33333 1C9.27885 1 11.6667 3.38781 11.6667 6.33333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="text-white text-xs opacity-90 flex-1 truncate">
                          <span>trypaid.io/alexjohnson</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Phone Content - Alex's Profile */}
                  <div className="absolute top-[90px] left-0 right-0 bottom-0 overflow-y-auto scrollbar-hide">
                    <div className="scale-[0.88] origin-top pt-1">
                      {/* Mini version of the profile */}
                      <div className="relative flex flex-col items-center">
                        {/* App name */}
                        <div className="w-full py-3 text-center">
                          <h1 className="text-2xl font-black accent-text">Paid.</h1>
                        </div>

                        {/* Background image with overlay */}
                        <div className="w-full h-32 relative overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.05)] mx-4">
                          <Image 
                            src={userData.backgroundImage} 
                            alt="Background" 
                            fill 
                            className="object-cover" 
                            priority 
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
                        </div>

                        {/* Profile image */}
                        <div className="relative mx-auto -mt-12 h-24 w-24 overflow-hidden rounded-full border-4 border-[rgba(var(--iphone-bg),0.9)] z-20">
                          <Image src={userData.profileImage} alt={userData.name} fill className="object-cover" priority />
                        </div>

                        {/* Profile info */}
                        <div className="text-center mt-2 px-4 z-20">
                          <h2 className="text-xl font-black">{userData.name}</h2>
                          <p className="text-[rgba(255,255,255,0.6)] text-xs">{userData.location}</p>
                        </div>

                        {/* Payment options */}
                        <div className="px-4 py-4 w-full">
                          <div className="space-y-3">
                            {userData.paymentOptions.map((option: PaymentOptionForDemo, index: number) => {
                              // Generate payment URL based on the payment method
                              let paymentUrl = "#";
                              const username = option.handle.startsWith('@') ? option.handle.substring(1) : 
                                      option.handle.startsWith('$') ? option.handle.substring(1) : 
                                      option.handle.includes('@') ? option.handle.split('@')[0] : option.handle;
                              
                              switch(option.name.toLowerCase()) {
                                case 'venmo':
                                  paymentUrl = `https://account.venmo.com/u/${username}`;
                                  break;
                                case 'cash app':
                                  paymentUrl = `https://cash.app/$${username}`;
                                  break;
                                case 'paypal':
                                  if (option.handle.includes('@')) {
                                    paymentUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(option.handle)}&amount=${option.paypalAmount || "0"}&currency_code=USD`;
                                  } else {
                                    paymentUrl = `https://www.paypal.com/paypalme/${username}${option.paypalAmount ? `/${option.paypalAmount}` : ''}`;
                                  }
                                  break;
                                case 'zelle':
                                  paymentUrl = "https://www.zellepay.com/";
                                  break;
                                case 'apple pay':
                                case 'apple cash':
                                  paymentUrl = "https://www.apple.com/apple-cash/";
                                  break;
                                default:
                                  paymentUrl = "#";
                              }
                              
                              return (
                                <a 
                                  key={index}
                                  href={paymentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block"
                                >
                                  <div className="group flex items-center p-3 rounded-xl iphone-card border border-[rgba(255,255,255,0.05)] transition-all duration-150 hover:bg-[rgba(var(--iphone-gray-medium),1)] hover:translate-y-[-2px] hover:shadow-md cursor-pointer">
                                    <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                                      <Image 
                                        src={`/payment-icons/${option.icon}.${option.iconFormat}`} 
                                        alt={option.name} 
                                        width={40} 
                                        height={40} 
                                        className="object-cover" 
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-medium text-sm">{option.name}</h3>
                                      <p className="text-[rgba(255,255,255,0.6)] text-xs">{option.handle}</p>
                                    </div>
                                    <div className="h-5 w-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                      <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.5 1L6.5 6L1.5 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </div>
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[134px] h-[5px] bg-white rounded-full opacity-80"></div>
              </div>
              
              {/* Multiple layered shadows for realistic effect */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-[280px] h-[20px] bg-black/20 rounded-full blur-md"></div>
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-[220px] h-[15px] bg-black/10 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/*
      <section className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center">Why choose Paid</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 p-6 rounded-xl container-3d">
            <div className="h-12 w-12 rounded-full bg-[rgba(var(--accent-color),0.2)] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[rgba(var(--accent-color),1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Multiple Payment Methods</h3>
            <p className="text-white/70">Support for Venmo, Cash App, Zelle, PayPal, Apple Pay and more.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-xl container-3d">
            <div className="h-12 w-12 rounded-full bg-[rgba(var(--accent-color),0.2)] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[rgba(var(--accent-color),1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Secure and Private</h3>
            <p className="text-white/70">Your payment details are protected and only shown to those you share with.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-xl container-3d">
            <div className="h-12 w-12 rounded-full bg-[rgba(var(--accent-color),0.2)] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[rgba(var(--accent-color),1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Share Anywhere</h3>
            <p className="text-white/70">One link to share on social media, business cards, or with friends.</p>
          </div>
        </div>
      </section>
      */}

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="bg-[rgba(var(--accent-color),0.1)] rounded-2xl p-12 text-center container-3d-accent">
          <h2 className="text-3xl font-bold">Ready to get Paid?</h2>
          <p className="mt-4 text-xl text-white/70 max-w-2xl mx-auto">Create your link in under 3 minutes — Free of charge.</p>
          <div className="mt-8">
            {currentUser ? (
              <Link href="/profile" className="px-8 py-3 rounded-full bg-[rgba(var(--accent-color),1)] hover:bg-[rgba(var(--accent-color),0.9)] transition font-medium text-lg btn-sleek btn-accent flex items-center justify-center">
                Manage Your Page
              </Link>
            ) : (
            <Link href="/signup" className="px-8 py-3 rounded-full bg-[rgba(var(--accent-color),1)] hover:bg-[rgba(var(--accent-color),0.9)] transition font-medium text-lg btn-sleek btn-accent flex items-center justify-center">
              Get Started Now
            </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 max-w-6xl mx-auto border-t border-white/10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-black accent-text mb-4 md:mb-0">Paid.</h1>
          <div className="flex space-x-8">
            <Link href="/about" className="text-white/70 hover:text-white">About</Link>
            <Link href="/privacy" className="text-white/70 hover:text-white">Privacy</Link>
            <Link href="/terms" className="text-white/70 hover:text-white">Terms</Link>
            <Link href="/contact" className="text-white/70 hover:text-white">Contact</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-white/50 text-sm">
          © {new Date().getFullYear()} Paid. All rights reserved.
      </div>
      </footer>
    </main>
  )
}
