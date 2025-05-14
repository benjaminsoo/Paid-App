"use client";

import { ArrowRight, X, Copy, Check, DollarSign, MessageSquare, ChevronDown } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

// List of popular banks that support Zelle
const ZELLE_BANKS = [
  { name: "Bank of America", appScheme: "bofa://", logo: "bofa.png" },
  { name: "Chase", appScheme: "chase://", logo: "chase.png" },
  { name: "Wells Fargo", appScheme: "wellsfargo://", logo: "wellsfargo.png" },
  { name: "Citibank", appScheme: "citi://", logo: "citi.png" },
  { name: "Capital One", appScheme: "capitalone://", logo: "capitalone.png" },
  { name: "U.S. Bank", appScheme: "usbank://", logo: "usbank.png" },
  { name: "PNC Bank", appScheme: "pnc://", logo: "pnc.png" },
  { name: "TD Bank", appScheme: "tdbank://", logo: "tdbank.png" },
  { name: "Truist", appScheme: "truist://", logo: "truist.png" },
  { name: "Fifth Third Bank", appScheme: "fifththird://", logo: "fifththird.png" },
  { name: "Ally Bank", appScheme: "ally://", logo: "ally.png" },
  { name: "USAA", appScheme: "usaa://", logo: "usaa.png" },
  { name: "Zelle App", appScheme: "zellepay://", logo: "zelle.png" }
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

  // Handle opening bank app after copying for Zelle
  const copyAndOpenBankApp = () => {
    if (!selectedBank || copying) return;
    
    setCopying(true);
    
    // Copy the contact info (phone or email)
    copyToClipboard();
    
    // Delay opening the bank app
    setTimeout(() => {
      window.location.href = selectedBank.appScheme;
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
      
      if (isMobile) {
        setShowZellePopup(true);
        setBankSelectStep(true);
        setSelectedBank(null);
      } else {
        // Desktop fallback - open Zelle website
        window.open('https://www.zellepay.com/', '_blank');
      }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="apple-card max-w-sm w-full p-5 relative overflow-hidden rounded-2xl">
        <button 
          onClick={resetZelleFlow}
          className="absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)]"
        >
          <X className="h-4 w-4 text-white" />
        </button>
        
        <div className="flex items-center mb-4">
          <div className={`apple-icon h-10 w-10 rounded-full flex items-center justify-center mr-3 overflow-hidden`}>
            <Image 
              src={`/payment-icons/zelle.png`} 
              alt="Zelle" 
              width={32} 
              height={32} 
              className="w-full h-full object-cover" 
            />
          </div>
          <h3 className="font-medium text-lg">Zelle</h3>
        </div>
        
        {bankSelectStep ? (
          // Bank selection step
          <>
            <p className="text-[rgba(255,255,255,0.8)] text-sm mb-2">Select your bank:</p>
            <div className="max-h-[250px] overflow-y-auto mb-4 pr-1 custom-scrollbar">
              {ZELLE_BANKS.map((bank) => (
                <button
                  key={bank.name}
                  onClick={() => handleBankSelect(bank)}
                  className="w-full bg-[rgba(var(--profile-gray-medium),1)] hover:bg-[rgba(var(--profile-gray-light),0.8)] text-left rounded-lg p-3 mb-2 flex items-center transition-colors"
                >
                  <div className="w-7 h-7 bg-[rgba(255,255,255,0.1)] rounded-full flex items-center justify-center mr-3 overflow-hidden">
                    {/* If you have bank logos, you can use them here */}
                    <span className="text-xs text-white font-bold">{bank.name.charAt(0)}</span>
                  </div>
                  <span className="text-white">{bank.name}</span>
                  <ChevronDown className="h-4 w-4 text-white ml-auto transform -rotate-90" />
                </button>
              ))}
            </div>
            <p className="text-[rgba(255,255,255,0.5)] text-xs text-center">
              Don't see your bank? Visit <a href="https://www.zellepay.com/get-started" target="_blank" rel="noopener noreferrer" className="text-[rgba(var(--accent-color),1)]">zellepay.com</a>
            </p>
          </>
        ) : (
          // Contact info and bank app step
          <>
            <div className="mb-4">
              <p className="text-[rgba(255,255,255,0.8)] text-sm mb-1">Selected Bank:</p>
              <div className="bg-[rgba(var(--profile-gray-medium),1)] rounded-lg p-3 flex items-center justify-between">
                <span className="text-white">{selectedBank?.name}</span>
                <button onClick={() => setBankSelectStep(true)} className="text-[rgba(var(--accent-color),1)] text-sm">
                  Change
                </button>
              </div>
              
              <p className="text-[rgba(255,255,255,0.8)] text-sm mt-4 mb-1">Contact Information:</p>
              <div className="bg-[rgba(var(--profile-gray-medium),1)] rounded-lg p-3 flex items-center justify-between">
                <span className="text-white" ref={phoneRef}>{handle}</span>
                <button onClick={() => copyToClipboard(handle)} className="ml-2">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-white" />}
                </button>
              </div>
              
              <p className="text-[rgba(255,255,255,0.5)] text-xs mt-2">
                You'll need to manually enter this {handle.includes('@') ? 'email' : 'phone number'} in your banking app
              </p>
            </div>
            
            <button 
              onClick={copyAndOpenBankApp}
              disabled={copying}
              className={`w-full ${copying ? 'bg-[rgba(109,30,212,0.7)]' : 'bg-[#6D1ED4]'} text-white rounded-xl py-3 font-medium transition-transform active:scale-95 relative overflow-hidden`}
            >
              {copying ? (
                <>
                  <span className="opacity-0">Copy & Open {selectedBank?.name}</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-5 w-5 text-white mr-1" /> Copied! Opening {selectedBank?.name}...
                  </span>
                </>
              ) : (
                `Copy & Open ${selectedBank?.name}`
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
