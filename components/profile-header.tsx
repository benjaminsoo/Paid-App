import Image from "next/image"
import Link from "next/link"

interface ProfileHeaderProps {
  name: string
  location: string
  occupation: string
  profileImage: string
  backgroundImage: string
}

export default function ProfileHeader({
  name,
  location,
  occupation,
  profileImage,
  backgroundImage,
}: ProfileHeaderProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* App name */}
      <div className="w-full py-8 text-center">
        <Link href="/">
          <h1 className="text-3xl font-black accent-text cursor-pointer inline-block">Paid.</h1>
        </Link>
      </div>

      {/* Background image */}
      <div className="max-w-md w-full h-48 relative overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.05)]">
        <Image 
          src={backgroundImage || "/placeholder.svg"} 
          alt="Background" 
          fill 
          className="object-cover rounded-[18px]" 
          priority 
          style={{ borderRadius: '18px' }}
        />
      </div>

      {/* Profile image */}
      <div className="relative mx-auto -mt-16 h-32 w-32 overflow-hidden rounded-full border-4 border-[rgba(18,18,20,0.9)]">
        <Image src={profileImage || "/placeholder.svg"} alt={name} fill className="object-cover" priority />
      </div>

      {/* Profile info */}
      <div className="text-center mt-4 px-4">
        <h2 className="text-2xl font-black">{name}</h2>
        {location && (
          <p className="text-white/60 mt-1">{location}</p>
        )}
      </div>
    </div>
  )
}
