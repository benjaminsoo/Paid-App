import PaymentOption from "@/components/payment-option"
import ProfileHeader from "@/components/profile-header"
import { firestore } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import Link from "next/link"

// Define interfaces for our data structures
export interface PaymentOptionType {
  type: string;
  value: string;
  valueType?: string;
}

interface UserProfile {
  name: string;
  location: string;
  profileImageUrl: string;
  backgroundImageUrl: string;
  paymentMethods: PaymentOptionType[];
}

interface UserData {
  username: string;
  email: string;
  profile?: UserProfile;
  createdAt?: string;
}

// Map payment method types to display properties
const paymentMethodProps: Record<string, { name: string; color: string; iconFormat: string; prefix?: string }> = {
  "venmo": { name: "Venmo", color: "bg-[#3D95CE]", iconFormat: "png", prefix: "@" },
  "zelle": { name: "Zelle", color: "bg-[#6D1ED4]", iconFormat: "png" },
  "cashapp": { name: "Cash App", color: "bg-[#00D632]", iconFormat: "png", prefix: "$" },
  "paypal": { name: "PayPal", color: "bg-[#0079C1]", iconFormat: "png" },
  "applepay": { name: "Apple Pay", color: "bg-[#000000]", iconFormat: "jpg" }
};

export default async function UserProfile({ params }: { params: { username: string } }) {
  // Get username from URL
  const { username } = params;
  
  // Get user data from Firestore
  let userData: UserData | null = null;
  
  try {
    // Get the username document directly (based on your screenshots)
    const usernameDoc = doc(firestore, "usernames", username);
    const usernameSnapshot = await getDoc(usernameDoc);
    
    if (usernameSnapshot.exists()) {
      // Get the user ID from the username document
      const userId = usernameSnapshot.data().uid;
      
      // Get the user document directly
      const userDoc = doc(firestore, "users", userId);
      const userSnapshot = await getDoc(userDoc);
      
      if (userSnapshot.exists()) {
        userData = userSnapshot.data() as UserData;
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
  
  // If user not found
  if (!userData || !userData.profile) {
    return (
      <main className="h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-y-none flex flex-col items-center justify-center bg-[rgb(var(--background-rgb))] text-white">
        <a href="/">
          <h1 className="text-3xl font-black accent-text cursor-pointer">Paid.</h1>
        </a>
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold">User Link Not Found</h2>
          <p className="mt-2 text-gray-400">A link for the username "{username}" doesn't exist.</p>
          <a href="/" className="mt-4 inline-block px-6 py-2 rounded-full bg-[rgba(var(--accent-color),1)] text-white">
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  // Format payment methods
  const formattedPaymentOptions = userData.profile.paymentMethods
    .filter(method => method.value) // Only include methods with values
    .map(method => {
      const props = paymentMethodProps[method.type] || { 
        name: method.type, 
        color: "bg-gray-500", 
        iconFormat: "png" 
      };
      
      return {
        icon: method.type,
        name: props.name,
        handle: (props.prefix || '') + method.value,
        color: props.color,
        iconFormat: props.iconFormat
      };
    });

  return (
    <main className="h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-y-none bg-[rgb(var(--profile-background-rgb))] text-white">
      {/* Back to Home button */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[rgba(var(--accent-color),0.8)] to-[rgba(var(--accent-color),0.6)] hover:from-[rgba(var(--accent-color),0.9)] hover:to-[rgba(var(--accent-color),0.7)] text-white shadow-[0_4px_12px_rgba(var(--accent-color),0.2)] hover:shadow-[0_4px_20px_rgba(var(--accent-color),0.4)] border border-[rgba(var(--accent-color),0.3)] transition-all duration-200 active:translate-y-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
      </div>

      <ProfileHeader
        name={userData.profile.name || ""}
        location={userData.profile.location || ""}
        occupation="" // We don't store occupation in our data model
        profileImage={userData.profile.profileImageUrl || "/placeholder.svg"}
        backgroundImage={userData.profile.backgroundImageUrl || "/placeholder.svg"}
      />

      <div className="px-6 py-8 max-w-md mx-auto">
        <div className="space-y-5 pb-16">
          {formattedPaymentOptions.map((option, index) => (
            <PaymentOption 
              key={index}
              icon={option.icon} 
              name={option.name} 
              handle={option.handle} 
              color={option.color} 
              iconFormat={option.iconFormat}
            />
          ))}
        </div>
      </div>
    </main>
  )
} 