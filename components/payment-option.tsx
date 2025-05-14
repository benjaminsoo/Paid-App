"use client";

import { ArrowRight, X, Copy, Check, DollarSign, MessageSquare, ChevronDown } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

// List of popular banks that support Zelle
const ZELLE_BANKS = [
  { name: "Bank of America", appScheme: "bofa://", logo: "bofa.png", webUrl: "https://www.bankofamerica.com/online-banking/sign-in/" },
  { name: "Chase", appScheme: "chase://", logo: "chase.png", webUrl: "https://secure.chase.com/web/auth/dashboard" },
  { name: "Wells Fargo", appScheme: "wellsfargo://", logo: "wellsfargo.png", webUrl: "https://www.wellsfargo.com/online-banking/sign-on/" },
  { name: "Citibank", appScheme: "citi://", logo: "citi.png", webUrl: "https://online.citi.com/US/login.do" },
  { name: "Capital One", appScheme: "capitalone://", logo: "capitalone.png", webUrl: "https://www.capitalone.com/sign-in/" },
  { name: "U.S. Bank", appScheme: "usbank://", logo: "usbank.png", webUrl: "https://onlinebanking.usbank.com/Auth/Login" },
  { name: "PNC Bank", appScheme: "pnc://", logo: "pnc.png", webUrl: "https://www.pnc.com/en/personal-banking/banking/online-and-mobile-banking.html" },
  { name: "TD Bank", appScheme: "tdbank://", logo: "tdbank.png", webUrl: "https://onlinebanking.tdbank.com/" },
  { name: "Truist", appScheme: "truist://", logo: "truist.png", webUrl: "https://digital.truist.com/signin" },
  { name: "Fifth Third Bank", appScheme: "fifththird://", logo: "fifththird.png", webUrl: "https://www.53.com/content/fifth-third/en/login.html" },
  { name: "Ally Bank", appScheme: "ally://", logo: "ally.png", webUrl: "https://secure.ally.com/" },
  { name: "USAA", appScheme: "usaa://", logo: "usaa.png", webUrl: "https://www.usaa.com/inet/ent_logon/Logon" },
  { name: "Zelle App", appScheme: "zellepay://", logo: "zelle.png", webUrl: "https://www.zellepay.com/" }
];

interface PaymentOptionProps {
  icon: string
  name: string
  handle: string
  color: string
  iconFormat?: string
  paymentUrl?: string
  paypalAmount?: string
}

export default function PaymentOption({ 
  icon, 
  name, 
  handle, 
  color,
  iconFormat = "jpg",
  paymentUrl,
  paypalAmount = "0" 
}: PaymentOptionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showZellePopup, setShowZellePopup] = useState(false);
  const [showAppleCashPopup, setShowAppleCashPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const [selectedBank, setSelectedBank] = useState<typeof ZELLE_BANKS[0] | null>(null);
  const [bankSelectStep, setBankSelectStep] = useState(true);
  
  // For copying to clipboard
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  // Check if user is on mobile device
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Check if mobile
      const mobileRegex = /android|iphone|ipad|ipod|blackberry|windows phone/i;
      const isMobileDevice = mobileRegex.test(userAgent);
      setIsMobile(isMobileDevice);
      
      // Check specific platform
      const isIOSDevice = /iphone|ipad|ipod/i.test(userAgent);
      const isAndroidDevice = /android/i.test(userAgent);
      setIsIOS(isIOSDevice);
      setIsAndroid(isAndroidDevice);
    };
    
    checkDevice();
  }, []);

  // Reset copied state after some time
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Extract username from handle (remove @ or $ prefix)
  const getUsername = () => {
    if (handle.startsWith('@')) return handle.substring(1);
    if (handle.startsWith('$')) return handle.substring(1);
    if (handle.includes('@')) return handle.split('@')[0]; // For email addresses
    return handle;
  };

  const username = getUsername();

  // Generate appropriate payment URL based on platform
  const getPaymentUrl = () => {
    if (paymentUrl) return paymentUrl;
    
    switch (name.toLowerCase()) {
      case 'venmo':
        return isMobile 
          ? `venmo://paycharge?txn=pay&recipients=${username}`
          : `https://account.venmo.com/u/${username}`;
          
      case 'cash app':
        return `https://cash.app/$${username}`;
        
      case 'paypal':
        if (handle.includes('@')) {
          const encodedEmail = encodeURIComponent(handle);
          const encodedAmount = encodeURIComponent(paypalAmount);
          
          // For iOS, just open the app
          if (isIOS) {
            return 'paypal://';
          } else if (isAndroid) {
            return `com.paypal.android.p2pmobile://pay?recipient=${encodedEmail}&amount=${encodedAmount}&currency=USD`;
          } else {
            return `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodedEmail}&amount=${encodedAmount}&currency_code=USD`;
          }
        } else {
          return `https://www.paypal.com/paypalme/${username}${paypalAmount ? `/${paypalAmount}` : ''}`;
        }
        
      case 'zelle':
        // Let our custom handler deal with Zelle
        return '#';
        
      case 'apple pay':
      case 'apple cash':
        // For Apple Cash, we'll use a custom handler
        return '#';
        
      default:
        return `#`;
    }
  };

  // Copy contact info to clipboard
  const copyToClipboard = async (text = handle) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
      }
    }
  };

  // Handle opening PayPal app after copying
  const copyAndOpenPayPal = () => {
    // Prevent multiple clicks
    if (copying) return;
    
    // Set copying state to show button is pressed
    setCopying(true);
    
    // First copy the text
    copyToClipboard();
    
    // Show a status message and delay opening the app
    setTimeout(() => {
      window.location.href = 'paypal://';
      // Reset copying state after opening app
      setTimeout(() => setCopying(false), 500);
    }, 1500); // 1.5 second delay
  };

  // Handle opening bank app or website after copying for Zelle
  const copyAndOpenBankApp = () => {
    if (!selectedBank || copying) return;
    
    setCopying(true);
    
    // Copy the contact info (phone or email)
    copyToClipboard();
    
    // Delay opening the bank app or website
    setTimeout(() => {
      if (isMobile) {
        window.location.href = selectedBank.appScheme;
      } else {
        // For desktop, open the bank's website in a new tab
        window.open(selectedBank.webUrl, '_blank');
      }
      setTimeout(() => setCopying(false), 500);
    }, 1500);
  };

  // Handle opening Messages app for Apple Cash
  const copyAndOpenMessages = () => {
    if (copying) return;
    
    setCopying(true);
    
    // Copy the contact info
    copyToClipboard();
    
    // Delay opening Messages app
    setTimeout(() => {
      // Open Messages app - if phone number use sms:, if not use mailto:
      const isPhoneNumber = /^(\+)?[\d\s\-\(\)]+$/.test(handle);
      let messagesUrl = isPhoneNumber ? `sms:${handle}` : `sms:`;
      
      window.location.href = messagesUrl;
      setTimeout(() => setCopying(false), 500);
    }, 1500);
  };

  // Handle selecting a bank for Zelle
  const handleBankSelect = (bank: typeof ZELLE_BANKS[0]) => {
    setSelectedBank(bank);
    setBankSelectStep(false);
  };

  // Handle payment option click
  const handleClick = (e: React.MouseEvent) => {
    // For PayPal, show custom popup
    if (name.toLowerCase() === 'paypal') {
      e.preventDefault();
      
      if (isIOS || isAndroid) {
        setShowPopup(true);
      } else {
        // Desktop - open web URL
        const encodedEmail = encodeURIComponent(handle);
        const encodedAmount = encodeURIComponent(paypalAmount);
        window.open(`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodedEmail}&amount=${encodedAmount}&currency_code=USD`, '_blank');
      }
    }

    // For Zelle, show bank selection popup
    if (name.toLowerCase() === 'zelle') {
      e.preventDefault();
      
      // Show popup for both mobile and desktop
      setShowZellePopup(true);
      setBankSelectStep(true);
      setSelectedBank(null);
    }

    // For Apple Cash, show popup with instructions
    if (name.toLowerCase() === 'apple pay' || name.toLowerCase() === 'apple cash') {
      e.preventDefault();
      
      if (isIOS) {
        setShowAppleCashPopup(true);
      } else {
        // Desktop fallback - open Apple Cash website
        window.open('https://www.apple.com/apple-cash/', '_blank');
      }
    }

    // For Venmo on desktop
    if (name.toLowerCase() === 'venmo' && !isMobile) {
      e.preventDefault();
      window.open(`https://account.venmo.com/u/${username}`, '_blank');
    }
  };

  // Reset Zelle flow
  const resetZelleFlow = () => {
    setSelectedBank(null);
    setBankSelectStep(true);
    setShowZellePopup(false);
    setCopied(false);
    setCopying(false);
  };

  // Reset Apple Cash flow
  const resetAppleCashFlow = () => {
    setShowAppleCashPopup(false);
    setCopied(false);
    setCopying(false);
  };

  const PaymentCard = () => (
    <div className="apple-card flex items-center p-4 group">
      <div className={`apple-icon h-12 w-12 rounded-full flex items-center justify-center mr-5 transition-all group-hover:scale-110 overflow-hidden`}>
        <Image 
          src={`/payment-icons/${icon}.${iconFormat}`} 
          alt={name} 
          width={48} 
          height={48} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-lg">{name}</h3>
        <p className="text-[rgba(255,255,255,0.6)] text-sm">{handle}</p>
      </div>
      <div className="h-8 w-8 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="h-4 w-4 text-white" />
      </div>
    </div>
  );

  // PayPal popup component
  const PayPalPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="apple-card max-w-xs w-full p-5 relative overflow-hidden rounded-2xl">
        <button 
          onClick={() => setShowPopup(false)}
          className="absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)]"
        >
          <X className="h-4 w-4 text-white" />
        </button>
        
        <div className="flex items-center mb-4">
          <div className={`apple-icon h-10 w-10 rounded-full flex items-center justify-center mr-3 overflow-hidden`}>
            <Image 
              src={`/payment-icons/${icon}.${iconFormat}`} 
              alt={name} 
              width={32} 
              height={32} 
              className="w-full h-full object-cover" 
            />
          </div>
          <h3 className="font-medium text-lg">PayPal</h3>
        </div>
        
        <div className="mb-4">
          <p className="text-[rgba(255,255,255,0.8)] text-sm mb-1">PayPal Email:</p>
          <div className="bg-[rgba(var(--profile-gray-medium),1)] rounded-lg p-3 flex items-center justify-between">
            <span className="text-white" ref={emailRef}>{handle}</span>
            <button onClick={() => copyToClipboard()} className="ml-2">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-white" />}
            </button>
          </div>
          
          {/* Enhanced amount section */}
          <div className="mt-4 bg-[rgba(var(--accent-color),0.15)] rounded-lg p-3">
            <p className="text-[rgba(255,255,255,0.8)] text-sm mb-1">Amount:</p>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-[rgba(var(--accent-color),1)] mr-1" />
              <span className="text-white font-bold text-xl">{paypalAmount}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={copyAndOpenPayPal}
          disabled={copying}
          className={`w-full ${copying ? 'bg-[rgba(var(--accent-color),0.7)]' : 'bg-[rgba(var(--accent-color),1)]'} text-white rounded-xl py-3 font-medium transition-transform active:scale-95 relative overflow-hidden`}
        >
          {copying ? (
            <>
              <span className="opacity-0">Copy & Open PayPal</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <Check className="h-5 w-5 text-white mr-1" /> Copied! Opening PayPal...
              </span>
            </>
          ) : (
            'Copy & Open PayPal'
          )}
        </button>
      </div>
    </div>
  );

  // Zelle bank selection popup
  const ZellePopup = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
      <div className="apple-card max-w-sm w-full p-6 relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)]">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        
        <button 
          onClick={resetZelleFlow}
          className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
        >
          <X className="h-4 w-4 text-white" />
        </button>
        
        <div className="flex items-center mb-6">
          <div className="h-12 w-12 rounded-full bg-[#6D1ED4] flex items-center justify-center mr-4 shadow-[0_0_20px_rgba(109,30,212,0.3)]">
            <Image 
              src="/payment-icons/zelle.png" 
              alt="Zelle" 
              width={36} 
              height={36} 
              className="w-8 h-8 object-contain" 
            />
          </div>
          <div>
            <h3 className="font-bold text-xl text-white">Zelle</h3>
            <p className="text-white/60 text-sm">Select your bank to send money</p>
          </div>
        </div>
        
        {bankSelectStep ? (
          // Bank selection step
          <>
            <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-xl p-3 mb-5">
              <p className="text-[rgba(255,255,255,0.9)] text-sm font-medium mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mr-2 text-[#6D1ED4]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Select your bank to continue
              </p>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto mb-5 pr-1 custom-scrollbar">
              <div className="grid grid-cols-1 gap-2">
                {ZELLE_BANKS.map((bank) => (
                  <button
                    key={bank.name}
                    onClick={() => handleBankSelect(bank)}
                    className="w-full bg-[rgba(30,30,35,0.6)] hover:bg-[rgba(40,40,45,0.8)] text-left rounded-xl p-3.5 flex items-center transition-all border border-transparent hover:border-[rgba(255,255,255,0.1)] hover:translate-y-[-1px] active:translate-y-[1px]"
                  >
                    <div className="w-8 h-8 bg-[rgba(255,255,255,0.08)] rounded-full flex items-center justify-center mr-3 overflow-hidden shadow-sm">
                      <span className="text-sm text-white font-bold">{bank.name.charAt(0)}</span>
                    </div>
                    <span className="text-white font-medium flex-1">{bank.name}</span>
                    <div className="h-6 w-6 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                      <ChevronDown className="h-3.5 w-3.5 text-white/70 transform -rotate-90" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <p className="text-[rgba(255,255,255,0.6)] text-xs text-center">
              Don't see your bank? Visit <a href="https://www.zellepay.com/get-started" target="_blank" rel="noopener noreferrer" className="text-[#6D1ED4] hover:underline font-medium">zellepay.com</a>
            </p>
          </>
        ) : (
          // Contact info and bank app step
          <>
            <div className="mb-6">
              <div className="mb-4">
                <p className="text-white/60 text-sm mb-1.5 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mr-1.5 text-[#6D1ED4]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Selected Bank
                </p>
                <div className="bg-[rgba(30,30,35,0.6)] rounded-xl p-3.5 flex items-center justify-between border border-[rgba(255,255,255,0.08)]">
                  <div className="flex items-center">
                    <div className="w-7 h-7 bg-[rgba(255,255,255,0.08)] rounded-full flex items-center justify-center mr-2.5 overflow-hidden">
                      <span className="text-xs text-white font-bold">{selectedBank?.name.charAt(0)}</span>
                    </div>
                    <span className="text-white font-medium">{selectedBank?.name}</span>
                  </div>
                  <button onClick={() => setBankSelectStep(true)} className="text-[#6D1ED4] hover:text-[#8f45ef] text-sm font-medium transition-colors">
                    Change
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-white/60 text-sm mb-1.5 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mr-1.5 text-[#6D1ED4]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Contact Information
                </p>
                <div className="bg-[rgba(30,30,35,0.6)] rounded-xl p-3.5 flex items-center justify-between border border-[rgba(255,255,255,0.08)] group hover:border-[rgba(255,255,255,0.15)] transition-colors">
                  <span className="text-white font-medium" ref={phoneRef}>{handle}</span>
                  <button 
                    onClick={() => copyToClipboard(handle)} 
                    className="ml-2 h-8 w-8 rounded-lg flex items-center justify-center bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                  >
                    {copied ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <Copy className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
                    }
                  </button>
                </div>
                
                <p className="text-[rgba(255,255,255,0.5)] text-xs mt-2 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mr-1 text-[rgba(255,255,255,0.5)] flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>You'll need to manually enter this {handle.includes('@') ? 'email' : 'phone number'} in your {isMobile ? 'banking app' : 'bank website'}</span>
                </p>
              </div>
            </div>
            
            <button 
              onClick={copyAndOpenBankApp}
              disabled={copying}
              className={`w-full ${copying ? 'bg-[rgba(109,30,212,0.7)]' : 'bg-[#6D1ED4]'} hover:bg-[#8f45ef] text-white rounded-xl py-3.5 font-medium transition-all active:scale-[0.98] relative overflow-hidden flex items-center justify-center shadow-lg shadow-[rgba(109,30,212,0.25)]`}
            >
              {copying ? (
                <>
                  <span className="opacity-0">Copy & Open {selectedBank?.name}</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-5 w-5 text-white mr-2" /> 
                    {isMobile ? `Copied! Opening ${selectedBank?.name}...` : `Copied! Opening ${selectedBank?.name} website...`}
                  </span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {isMobile ? `Copy & Open ${selectedBank?.name} App` : `Copy & Go to ${selectedBank?.name} Website`}
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );

  // Apple Cash popup
  const AppleCashPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="apple-card max-w-xs w-full p-5 relative overflow-hidden rounded-2xl">
        <button 
          onClick={resetAppleCashFlow}
          className="absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)]"
        >
          <X className="h-4 w-4 text-white" />
        </button>
        
        <div className="flex items-center mb-4">
          <div className={`apple-icon h-10 w-10 rounded-full flex items-center justify-center mr-3 overflow-hidden`}>
            <Image 
              src={`/payment-icons/${icon}.${iconFormat}`} 
              alt={name} 
              width={32} 
              height={32} 
              className="w-full h-full object-cover" 
            />
          </div>
          <h3 className="font-medium text-lg">Apple Cash</h3>
        </div>
        
        <div className="mb-4">
          <div className="bg-[rgba(var(--profile-gray-medium),1)] rounded-lg p-3 mb-4">
            <p className="text-[rgba(255,255,255,0.8)] text-sm mb-2">Contact Information:</p>
            <div className="flex items-center justify-between">
              <span className="text-white">{handle}</span>
              <button onClick={() => copyToClipboard(handle)} className="ml-2">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-white" />}
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-[rgba(255,255,255,0.8)] text-sm mb-2">Apple Cash Instructions:</p>
            <ol className="list-decimal pl-5 text-[rgba(255,255,255,0.8)] text-sm space-y-2">
              <li>The Messages app will open</li>
              <li>Click the Apple Pay/Apple Cash button <span className="text-[rgba(var(--accent-color),1)]">$</span> in the app tray</li>
              <li>Enter the amount you want to send</li>
              <li>Tap "Pay"</li>
              <li>Confirm with Face ID or Touch ID</li>
            </ol>
          </div>
        </div>
        
        <button 
          onClick={copyAndOpenMessages}
          disabled={copying}
          className={`w-full ${copying ? 'bg-[rgba(0,120,0,0.7)]' : 'bg-[#00C300]'} text-white rounded-xl py-3 font-medium transition-transform active:scale-95 relative overflow-hidden`}
        >
          {copying ? (
            <>
              <span className="opacity-0">Copy & Open Messages</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <Check className="h-5 w-5 text-white mr-1" /> Copied! Opening Messages...
              </span>
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4 inline-block mr-2 -mt-0.5" />
              Open Messages
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <a 
        href={getPaymentUrl()} 
        className="block" 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        <PaymentCard />
      </a>
      
      {/* Custom PayPal popup */}
      {showPopup && <PayPalPopup />}
      
      {/* Zelle bank selection popup */}
      {showZellePopup && <ZellePopup />}
      
      {/* Apple Cash popup */}
      {showAppleCashPopup && <AppleCashPopup />}
    </>
  );
}
