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
      <header className="py-6 md:py-8 px-4 md:px-6 max-w-6xl mx-auto flex justify-between items-center relative z-20">
        <h1 className="text-3xl md:text-4xl font-black accent-text">Paid.</h1>
        <div className="flex gap-2 md:gap-4">
          {currentUser ? (
            <Link href="/profile" className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 hover:bg-white/5 transition btn-sleek text-center text-sm md:text-base">
              My Profile
            </Link>
          ) : (
            <>
          <Link href="/signin" className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 hover:bg-white/5 transition btn-sleek text-center text-sm md:text-base">
            Sign In
          </Link>
          <Link href="/signup" className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[rgba(var(--accent-color),1)] hover:bg-[rgba(var(--accent-color),0.9)] transition btn-sleek btn-accent text-center text-sm md:text-base">
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
            <h2 className="text-4xl md:text-5xl font-bold leading-tight fade-in">One link for all your payment methods</h2>
            <p className="mt-6 text-xl text-white/70 fade-in delay-1">From IOU to <span className="accent-text font-black">Paid.</span> Your money shouldn't wait in someone else's wallet.</p>
            <div className="mt-8 flex flex-wrap gap-3 fade-in delay-2">
              {currentUser ? (
                <Link href="/profile" className="inline-flex px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto rounded-full bg-[rgba(var(--accent-color),1)] hover:bg-[rgba(var(--accent-color),0.9)] transition font-medium md:font-semibold md:text-lg btn-sleek btn-accent text-center">
                  Manage Your Page
                </Link>
              ) : (
              <Link href="/signup" className="inline-flex px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto rounded-full bg-[rgba(var(--accent-color),1)] hover:bg-[rgba(var(--accent-color),0.9)] transition font-medium md:font-semibold md:text-lg btn-sleek btn-accent text-center">
                Create Your Page
              </Link>
              )}
              <Link href="/alexjohnson" className="inline-flex px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto rounded-full border border-white/10 hover:bg-white/5 transition font-medium md:font-semibold md:text-lg btn-sleek text-center">
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
                            {userData.paymentOptions.map((option: PaymentOptionForDemo, index: number) => (
                              <PaymentOption 
                                key={index}
                                icon={option.icon} 
                                name={option.name} 
                                handle={option.handle} 
                                color={option.color} 
                                iconFormat={option.iconFormat}
                                paypalAmount={option.paypalAmount}
                              />
                            ))}
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

      {/* Mobile App Integration Section */}
      <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative order-2 md:order-1">
            {/* Mobile app integration animation */}
            <div className="relative h-[400px] md:h-[500px] w-full mb-0 mt-8 md:mt-0">
              {/* Phone outline with glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[480px] bg-[rgba(20,20,25,0.6)] rounded-[40px] border-2 border-[rgba(var(--accent-color),0.4)] shadow-[0_0_60px_rgba(var(--accent-color),0.2)] z-10 overflow-hidden app-float-animation">
                {/* Phone screen */}
                <div className="absolute inset-[2px] rounded-[38px] bg-[rgba(15,15,20,0.9)] overflow-hidden">
                  {/* Browser with Paid page */}
                  <div className="absolute inset-0 paid-screen opacity-100">
                    {/* Status bar */}
                    <div className="h-8 px-5 flex justify-between items-center bg-[rgba(10,10,12,0.8)]">
                      <div className="text-xs text-white/80">9:41</div>
                      <div className="flex space-x-1">
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
                    
                    {/* Browser header */}
                    <div className="h-10 px-3 flex items-center bg-[rgba(20,20,22,0.8)]">
                      <div className="flex-1 mx-1 h-6 rounded-lg bg-[rgba(40,40,45,0.8)] flex items-center px-2">
                        <div className="text-xs text-white/80 truncate">trypaid.io/alexjohnson</div>
                      </div>
                    </div>
                    
                    {/* Paid page content */}
                    <div className="h-full pt-3 px-4 pb-10">
                      {/* Profile header */}
                      <div className="w-full text-center mb-3">
                        <h1 className="text-lg font-black text-[rgba(var(--accent-color),1)]">Paid.</h1>
                      </div>
                      
                      {/* Profile card */}
                      <div className="w-full h-20 rounded-xl bg-[rgba(25,25,30,0.6)] overflow-hidden relative mb-5">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.7)]"></div>
                        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-base font-bold text-white">Alex Johnson</div>
                            <div className="text-xs text-white/60">San Francisco, CA</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment methods */}
                      <div className="space-y-3">
                        {/* Venmo payment option - highlighted */}
                        <div className="relative venmo-button h-14 rounded-xl bg-[#3D95CE] flex items-center px-3 shadow-lg transform transition-transform cursor-pointer active-payment-button">
                          <div className="absolute inset-0 bg-white/10 venmo-highlight rounded-xl opacity-0"></div>
                          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center mr-3">
                            <span className="text-white font-bold">V</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">Venmo</div>
                            <div className="text-white/80 text-xs">@alex-johnson</div>
                          </div>
                          <div className="ml-auto">
                            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          
                          {/* Enhanced click effect */}
                          <div className="absolute inset-0 rounded-xl bg-white/30 click-ripple opacity-0"></div>
                        </div>
                        
                        {/* Other payment options - blurred out during animation */}
                        <div className="h-14 rounded-xl bg-[rgba(30,30,35,0.6)] flex items-center px-3 other-payment-option">
                          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center mr-3">
                            <span className="text-white font-bold">$</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">Cash App</div>
                            <div className="text-white/80 text-xs">$alexjohnson</div>
                          </div>
                        </div>
                        
                        <div className="h-14 rounded-xl bg-[rgba(30,30,35,0.6)] flex items-center px-3 other-payment-option">
                          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center mr-3">
                            <span className="text-white font-bold">P</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">PayPal</div>
                            <div className="text-white/80 text-xs">alex.johnson@email.com</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Loading transition screen */}
                  <div className="absolute inset-0 bg-[#3D95CE] transition-screen opacity-0 flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-2xl">V</span>
                    </div>
                    <div className="text-white font-medium">Opening Venmo...</div>
                    <div className="w-16 h-1 bg-white/20 rounded-full mt-4 relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-8 bg-white loading-bar"></div>
                    </div>
                  </div>
                  
                  {/* Venmo app screen */}
                  <div className="absolute inset-0 venmo-screen opacity-0">
                    {/* Status bar */}
                    <div className="h-8 px-5 flex justify-between items-center bg-[#0074DE]">
                      <div className="text-xs text-white">9:41</div>
                      <div className="flex space-x-1">
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
                    
                    {/* Venmo header */}
                    <div className="h-14 px-4 flex items-center justify-between bg-[#0074DE]">
                      <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="text-lg font-bold text-white">Pay</div>
                      <div className="w-7"></div> {/* For balance */}
                    </div>
                    
                    {/* Venmo payment form */}
                    <div className="bg-white h-full pt-5 px-4">
                      {/* Recipient info */}
                      <div className="flex items-center mb-6">
                        <div className="h-14 w-14 rounded-full bg-[#3D95CE] flex items-center justify-center text-white font-bold text-xl">
                          A
                        </div>
                        <div className="ml-3">
                          <div className="font-bold text-[#0074DE]">Alex Johnson</div>
                          <div className="text-xs text-gray-500">@alex-johnson</div>
                        </div>
                      </div>
                      
                      {/* Amount field */}
                      <div className="border-b border-gray-200 pb-4 mb-4">
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-black">$</span>
                          <span className="text-5xl font-bold text-black ml-1 amount-input-animation">25.00</span>
                        </div>
                      </div>
                      
                      {/* For what */}
                      <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
                        <span className="text-gray-400">For</span>
                        <span className="ml-2 text-gray-800">Dinner last night 🍕</span>
                      </div>
                      
                      {/* Pay button */}
                      <div className="mt-8">
                        <button className="w-full py-3 rounded-full bg-[#0074DE] text-white font-bold text-lg pay-button-pulse">
                          Pay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background app icons floating */}
              <div className="absolute top-1/4 left-1/5 w-16 h-16 rounded-xl bg-[rgba(0,116,222,0.2)] border border-[rgba(0,116,222,0.3)] backdrop-blur-sm rotating-icon rotate-12"></div>
              <div className="absolute bottom-1/4 right-1/5 w-14 h-14 rounded-xl bg-[rgba(61,149,206,0.2)] border border-[rgba(61,149,206,0.3)] backdrop-blur-sm rotating-icon -rotate-12 delay-2"></div>
              <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-xl bg-[rgba(0,121,193,0.2)] border border-[rgba(0,121,193,0.3)] backdrop-blur-sm rotating-icon rotate-45 delay-3"></div>
              <div className="absolute bottom-1/3 left-1/4 w-10 h-10 rounded-xl bg-[rgba(109,30,212,0.2)] border border-[rgba(109,30,212,0.3)] backdrop-blur-sm rotating-icon -rotate-12 delay-4"></div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="space-y-6">
              <div className="bg-[rgba(20,20,25,0.6)] p-6 rounded-xl border border-[rgba(255,255,255,0.1)] shadow-lg container-3d">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-[rgba(var(--accent-color),0.2)] flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                    <svg className="h-5 w-5 text-[rgba(var(--accent-color),1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">One Tap. Save Time.</h3>
                    <p className="text-white/70">When your friend clicks on a payment method, the corresponding app opens directly to your payment page – No more wasted time sending your details through DM.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[rgba(20,20,25,0.6)] p-6 rounded-xl border border-[rgba(255,255,255,0.1)] shadow-lg container-3d">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-[rgba(var(--accent-color),0.2)] flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                    <svg className="h-5 w-5 text-[rgba(var(--accent-color),1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Easy Creation</h3>
                    <p className="text-white/70">Creating your link is a breeze. Get up and running in under 3 minutes.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[rgba(20,20,25,0.6)] p-6 rounded-xl border border-[rgba(255,255,255,0.1)] shadow-lg container-3d">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-[rgba(var(--accent-color),0.2)] flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                    <svg className="h-5 w-5 text-[rgba(var(--accent-color),1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Secure and Seamless</h3>
                    <p className="text-white/70">No need to sign in to any app. All you need to do is input your username, email, or # for your payment methods.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Let's add the required CSS animations for this section */}
      <style jsx>{`
        @keyframes app-float {
          0%, 100% { transform: translate(-50%, -50%); }
          50% { transform: translate(-50%, -52%); }
        }
        
        .app-float-animation {
          animation: app-float 6s ease-in-out infinite;
        }
        
        @keyframes rotating {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .rotating-icon {
          animation: rotating 20s linear infinite;
          opacity: 0.7;
        }
        
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
        .delay-4 { animation-delay: 0.8s; }
        
        /* Animation sequence for screens */
        .paid-screen {
          animation: fade-screen 10s infinite;
        }
        
        .transition-screen {
          animation: transition-in-out 10s infinite;
        }
        
        .venmo-screen {
          animation: venmo-screen 10s infinite;
        }
        
        @keyframes fade-screen {
          0%, 33% { opacity: 1; }
          36%, 100% { opacity: 0; }
        }
        
        @keyframes transition-in-out {
          0%, 33% { opacity: 0; }
          36%, 46% { opacity: 1; }
          49%, 100% { opacity: 0; }
        }
        
        @keyframes venmo-screen {
          0%, 46% { opacity: 0; }
          52%, 96% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        /* Button and element animations */
        .active-payment-button {
          animation: button-pulse 10s infinite;
        }
        
        .venmo-highlight {
          animation: highlight-pulse 10s infinite;
        }
        
        .other-payment-option {
          animation: fade-others 10s infinite;
        }
        
        /* Click ripple effect */
        .click-ripple {
          animation: click-effect 10s infinite;
        }
        
        @keyframes click-effect {
          0%, 14% { opacity: 0; transform: scale(0.8); }
          16% { opacity: 1; transform: scale(1.1); }
          18% { opacity: 0.7; transform: scale(1.05); }
          20% { opacity: 0; transform: scale(1); }
          100% { opacity: 0; }
        }
        
        @keyframes button-pulse {
          0%, 10% { transform: scale(1); box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          15% { transform: scale(1.05); box-shadow: 0 8px 15px rgba(0,0,0,0.2); }
          17% { transform: scale(0.98); box-shadow: 0 2px 3px rgba(0,0,0,0.1); }
          20% { transform: scale(1); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
          23%, 100% { transform: scale(1); box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        }
        
        @keyframes highlight-pulse {
          0%, 10% { opacity: 0; }
          15%, 22% { opacity: 1; }
          26%, 100% { opacity: 0; }
        }
        
        @keyframes fade-others {
          0%, 15% { opacity: 1; }
          19%, 100% { opacity: 0.5; }
        }
        
        .loading-bar {
          animation: loading-bar-move 1.5s ease-in-out infinite;
        }
        
        @keyframes loading-bar-move {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        
        .pay-button-pulse {
          animation: pay-button-glow 10s infinite;
        }
        
        @keyframes pay-button-glow {
          0%, 65% { box-shadow: 0 0 0 rgba(0,116,222,0); }
          75% { box-shadow: 0 0 20px rgba(0,116,222,0.5); }
          85%, 100% { box-shadow: 0 0 0 rgba(0,116,222,0); }
        }
      `}</style>

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
      <section className="py-16 md:py-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="bg-[rgba(var(--accent-color),0.1)] rounded-2xl p-8 md:p-12 text-center container-3d-accent">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to get Paid?</h2>
          <p className="mt-4 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">Create your link in under 3 minutes — Free of charge.</p>
          <div className="mt-8">
            {currentUser ? (
              <Link href="/profile" className="inline-flex px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto rounded-full bg-[rgba(var(--accent-color),1)] hover:bg-[rgba(var(--accent-color),0.9)] transition font-medium md:font-semibold md:text-lg text-center btn-sleek btn-accent">
                Manage Your Page
              </Link>
            ) : (
            <Link href="/signup" className="inline-flex px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto rounded-full bg-[rgba(var(--accent-color),1)] hover:bg-[rgba(var(--accent-color),0.9)] transition font-medium md:font-semibold md:text-lg text-center btn-sleek btn-accent">
              Get Started Now
            </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-6 max-w-6xl mx-auto border-t border-white/10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-black accent-text mb-4 md:mb-0">Paid.</h1>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <Link href="/about" className="text-white/70 hover:text-white text-sm md:text-base">About</Link>
            <Link href="/privacy" className="text-white/70 hover:text-white text-sm md:text-base">Privacy</Link>
            <Link href="/terms" className="text-white/70 hover:text-white text-sm md:text-base">Terms</Link>
            <Link href="/contact" className="text-white/70 hover:text-white text-sm md:text-base">Contact</Link>
          </div>
        </div>
        <div className="mt-6 md:mt-8 text-center text-white/50 text-xs md:text-sm">
          © {new Date().getFullYear()} Paid. All rights reserved.
      </div>
      </footer>
    </main>
  )
}
