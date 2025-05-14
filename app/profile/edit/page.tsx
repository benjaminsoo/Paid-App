"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import ProtectedRoute from "@/components/protected-route";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";

// Interface for payment method types
interface PaymentMethod {
  type: string;
  value: string;
  valueType?: string; // For methods that can accept multiple types (email/phone)
}

// Interface for the profile form data
interface ProfileFormData {
  name: string;
  location: string;
  profileImageUrl: string;
  backgroundImageUrl: string;
  paymentMethods: PaymentMethod[];
}

export default function EditProfilePage() {
  const router = useRouter();
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [backgroundImagePreview, setBackgroundImagePreview] = useState("");
  
  // Form state for profile data
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    location: "",
    profileImageUrl: "",
    backgroundImageUrl: "",
    paymentMethods: [
      { type: "venmo", value: "" },
      { type: "zelle", value: "", valueType: "email" },
      { type: "cashapp", value: "" },
      { type: "paypal", value: "", valueType: "email" },
      { type: "applepay", value: "" }
    ]
  });

  // Check if user has filled out their profile
  const [hasProfileData, setHasProfileData] = useState(false);

  // Fetch existing profile data if available
  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(firestore, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists() && userDoc.data().profile) {
            const profileData = userDoc.data().profile;
            
            setFormData({
              name: profileData.name || "",
              location: profileData.location || "",
              profileImageUrl: profileData.profileImageUrl || "",
              backgroundImageUrl: profileData.backgroundImageUrl || "",
              paymentMethods: profileData.paymentMethods || [
                { type: "venmo", value: "" },
                { type: "zelle", value: "", valueType: "email" },
                { type: "cashapp", value: "" },
                { type: "paypal", value: "", valueType: "email" },
                { type: "applepay", value: "" }
              ]
            });
            
            setProfileImagePreview(profileData.profileImageUrl || "");
            setBackgroundImagePreview(profileData.backgroundImageUrl || "");
            
            // Check if user has already filled out profile data
            const hasData = !!(
              profileData.name || 
              profileData.location || 
              profileData.profileImageUrl || 
              profileData.backgroundImageUrl ||
              (profileData.paymentMethods && 
               profileData.paymentMethods.some((method: { value: string }) => method.value))
            );
            setHasProfileData(hasData);
          }
        } catch (err) {
          console.error("Error fetching profile data:", err);
        }
      }
    };
    
    fetchProfileData();
  }, [currentUser]);

  // Handle profile image upload
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle background image upload
  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input changes for basic info
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle payment method changes
  const handlePaymentMethodChange = (index: number, value: string) => {
    const updatedPaymentMethods = [...formData.paymentMethods];
    updatedPaymentMethods[index].value = value;
    setFormData(prev => ({
      ...prev,
      paymentMethods: updatedPaymentMethods
    }));
  };

  // Handle payment method type changes (for methods with multiple value types)
  const handlePaymentMethodTypeChange = (index: number, valueType: string) => {
    const updatedPaymentMethods = [...formData.paymentMethods];
    updatedPaymentMethods[index].valueType = valueType;
    setFormData(prev => ({
      ...prev,
      paymentMethods: updatedPaymentMethods
    }));
  };

  // Upload files to Firebase Storage
  const uploadFile = async (file: File, path: string): Promise<string> => {
    if (!currentUser) throw new Error("User not authenticated");
    
    // Use the storage object from our Firebase module
    const storageRef = ref(storage, `${path}/${currentUser.uid}/${file.name}`);
    
    try {
      // Set metadata to help with CORS issues
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'Access-Control-Allow-Origin': '*'
        }
      };
      
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (err) {
      console.error(`Error uploading ${path}:`, err);
      
      // Log more details about CORS errors
      if (err instanceof Error && err.message.includes('CORS')) {
        console.error('CORS error detected. This is likely a Firebase Storage configuration issue.');
        console.error('Please configure CORS for your Firebase Storage bucket.');
      }
      
      throw err;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !userProfile) {
      setError("You must be logged in to update your profile");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      // Create a copy of the form data to update
      const updatedProfileData = { ...formData };
      
      // Upload profile image if provided
      if (profileImage) {
        updatedProfileData.profileImageUrl = await uploadFile(profileImage, "profileImages");
      }
      
      // Upload background image if provided
      if (backgroundImage) {
        updatedProfileData.backgroundImageUrl = await uploadFile(backgroundImage, "backgroundImages");
      }
      
      // Update the user document in Firestore
      const userDocRef = doc(firestore, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userDocRef, {
          profile: updatedProfileData
        });
      } else {
        // Create new document
        await setDoc(userDocRef, {
          email: currentUser.email,
          username: userProfile.username,
          createdAt: new Date().toISOString(),
          profile: updatedProfileData
        });
      }
      
      setSuccess(true);
      // Redirect immediately to profile page
      router.push(`/profile`);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          
          <Link href="/profile">
            <button className="px-4 py-2 rounded-full border border-white/10 text-white transition btn-sleek bg-[rgba(30,30,35,0.7)] backdrop-blur-sm shadow-md hover:bg-[rgba(40,40,45,0.8)] active:translate-y-0.5 active:shadow-sm">
              Back to Profile
            </button>
          </Link>
        </header>
        
        <div className="flex-1 flex items-start justify-center relative z-10 px-6 py-4 pb-20">
          <div className="max-w-3xl w-full">
            <div className="bg-[rgba(30,30,35,0.5)] backdrop-blur-xl p-8 rounded-2xl border border-[rgba(255,255,255,0.1)] mb-8">
              <h2 className="text-2xl font-bold mb-6">{hasProfileData ? "Edit Your Link" : "Create Your Link"}</h2>
              
              {error && (
                <Alert className="mb-4 bg-red-500/10 text-red-500 border-red-500/20">
                  {error}
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white/70 mb-4">Basic Information</h3>
                  
                  <div className="mb-4">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="location">Location (City, State)</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]"
                    />
                  </div>
                </div>
                
                {/* Profile Images */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white/70 mb-4">Profile Images</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Profile Image Upload */}
                    <div className="mb-4">
                      <Label htmlFor="profileImage" className="block mb-2">Profile Picture</Label>
                      <div className="flex flex-col items-center">
                        <div className="h-32 w-32 relative rounded-full overflow-hidden mb-4 border-2 border-[rgba(var(--accent-color),0.3)] bg-[rgba(255,255,255,0.05)]">
                          {profileImagePreview ? (
                            <Image 
                              src={profileImagePreview} 
                              alt="Profile Preview" 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full text-white/30">
                              No Image
                            </div>
                          )}
                        </div>
                        <label className="px-4 py-2 rounded-full bg-[rgba(var(--accent-color),0.1)] hover:bg-[rgba(var(--accent-color),0.2)] text-[rgba(var(--accent-color),1)] transition-colors cursor-pointer">
                          Select Image
                          <input
                            id="profileImage"
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    
                    {/* Background Image Upload */}
                    <div className="mb-4">
                      <Label htmlFor="backgroundImage" className="block mb-2">Cover Image</Label>
                      <div className="flex flex-col items-center">
                        <div className="h-32 w-full relative rounded-xl overflow-hidden mb-4 border-2 border-[rgba(var(--accent-color),0.3)] bg-[rgba(255,255,255,0.05)]">
                          {backgroundImagePreview ? (
                            <Image 
                              src={backgroundImagePreview} 
                              alt="Cover Preview" 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full text-white/30">
                              No Image
                            </div>
                          )}
                        </div>
                        <label className="px-4 py-2 rounded-full bg-[rgba(var(--accent-color),0.1)] hover:bg-[rgba(var(--accent-color),0.2)] text-[rgba(var(--accent-color),1)] transition-colors cursor-pointer">
                          Select Image
                          <input
                            id="backgroundImage"
                            type="file"
                            accept="image/*"
                            onChange={handleBackgroundImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white/70 mb-4">Payment Methods</h3>
                  
                  {/* Venmo */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="h-7 w-7 mr-2 flex-shrink-0 rounded-full bg-[#3D95CE] flex items-center justify-center overflow-hidden">
                        <Image 
                          src="/payment-icons/venmo.png" 
                          alt="Venmo" 
                          width={20} 
                          height={20}
                        />
                      </div>
                      <Label htmlFor="venmo">Venmo</Label>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white/50 mr-2">@</span>
                      <Input
                        id="venmo"
                        value={formData.paymentMethods[0].value}
                        onChange={(e) => handlePaymentMethodChange(0, e.target.value)}
                        placeholder="username"
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]"
                      />
                    </div>
                  </div>
                  
                  {/* Zelle */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="h-7 w-7 mr-2 flex-shrink-0 rounded-full bg-[#6D1ED4] flex items-center justify-center overflow-hidden">
                        <Image 
                          src="/payment-icons/zelle.png" 
                          alt="Zelle" 
                          width={20} 
                          height={20}
                        />
                      </div>
                      <Label htmlFor="zelle">Zelle</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select
                        value={formData.paymentMethods[1].valueType || "email"}
                        onValueChange={(value) => handlePaymentMethodTypeChange(1, value)}
                      >
                        <SelectTrigger className="w-[140px] bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="zelle"
                        value={formData.paymentMethods[1].value}
                        onChange={(e) => handlePaymentMethodChange(1, e.target.value)}
                        placeholder={formData.paymentMethods[1].valueType === "phone" ? "(123) 456-7890" : "email@example.com"}
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]"
                      />
                    </div>
                  </div>
                  
                  {/* Cash App */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="h-7 w-7 mr-2 flex-shrink-0 rounded-full bg-[#00D632] flex items-center justify-center overflow-hidden">
                        <Image 
                          src="/payment-icons/cashapp.png" 
                          alt="Cash App" 
                          width={20} 
                          height={20}
                        />
                      </div>
                      <Label htmlFor="cashapp">Cash App</Label>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white/50 mr-2">$</span>
                      <Input
                        id="cashapp"
                        value={formData.paymentMethods[2].value}
                        onChange={(e) => handlePaymentMethodChange(2, e.target.value)}
                        placeholder="username"
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]"
                      />
                    </div>
                  </div>
                  
                  {/* PayPal */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="h-7 w-7 mr-2 flex-shrink-0 rounded-full bg-[#0079C1] flex items-center justify-center overflow-hidden">
                        <Image 
                          src="/payment-icons/paypal.png" 
                          alt="PayPal" 
                          width={20} 
                          height={20}
                        />
                      </div>
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select
                        value={formData.paymentMethods[3].valueType || "email"}
                        onValueChange={(value) => handlePaymentMethodTypeChange(3, value)}
                      >
                        <SelectTrigger className="w-[140px] bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="username">Username</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="paypal"
                        value={formData.paymentMethods[3].value}
                        onChange={(e) => handlePaymentMethodChange(3, e.target.value)}
                        placeholder={
                          formData.paymentMethods[3].valueType === "phone" 
                            ? "(123) 456-7890" 
                            : formData.paymentMethods[3].valueType === "username"
                              ? "username"
                              : "email@example.com"
                        }
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]"
                      />
                    </div>
                  </div>
                  
                  {/* Apple Pay */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="h-7 w-7 mr-2 flex-shrink-0 rounded-full bg-[#000000] flex items-center justify-center overflow-hidden">
                        <Image 
                          src="/payment-icons/applepay.jpg" 
                          alt="Apple Pay" 
                          width={20} 
                          height={20}
                        />
                      </div>
                      <Label htmlFor="applepay">Apple Pay</Label>
                    </div>
                    <Input
                      id="applepay"
                      value={formData.paymentMethods[4].value}
                      onChange={(e) => handlePaymentMethodChange(4, e.target.value)}
                      placeholder="(123) 456-7890"
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]"
                    />
                  </div>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full py-4 rounded-xl bg-[rgba(var(--accent-color),1)] hover:bg-[rgba(var(--accent-color),0.9)] text-white font-medium transition-colors disabled:opacity-70"
                >
                  {success 
                    ? "Profile updated successfully! Redirecting..." 
                    : (loading ? "Saving..." : hasProfileData ? "Save Profile" : "Create Profile")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
} 