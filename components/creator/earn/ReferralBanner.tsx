"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

interface ReferrerInfo {
  first_name: string;
  profile_picture_url: string;
}

const DEFAULT_IMAGE = "/images/creator/earn/referal-default.png";
const DEFAULT_NAME = "Chulbuli";

export default function ReferralBanner() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  const [referrerInfo, setReferrerInfo] = useState<ReferrerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasReferral, setHasReferral] = useState(false);

  useEffect(() => {
    if (referralCode) {
      setHasReferral(true);
      fetchReferrerInfo(referralCode);
    }
  }, [referralCode]);

  const fetchReferrerInfo = async (code: string) => {
    setIsLoading(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://dev.api.sparkonomy.com";
      const response = await fetch(`${apiBaseUrl}/api/v1/creator/referrals/info/${code}`);

      if (response.ok) {
        const data: ReferrerInfo = await response.json();
        setReferrerInfo(data);
      } else {
        // If API fails, show default content
        setHasReferral(false);
      }
    } catch (error) {
      console.error("Failed to fetch referrer info:", error);
      setHasReferral(false);
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = hasReferral && referrerInfo ? referrerInfo.first_name : DEFAULT_NAME;
  const displayImage = hasReferral && referrerInfo?.profile_picture_url ? referrerInfo.profile_picture_url : DEFAULT_IMAGE;

  // Text based on whether we have a valid referral
  const messageText = hasReferral && referrerInfo
    ? (
      <div className="font-semibold text-2xl md:text-3xl lg:text-4xl italic">
        <span>"{displayName}</span> says{" "}
        <span>this is the easiest app for creator work — and wants you to try it.</span>
        <br />
        <span>Sign Up today!"</span>
      </div>
    )
    : (
      <div className="font-semibold text-2xl md:text-3xl lg:text-4xl italic">
        <span>"{DEFAULT_NAME}</span> wants you to get{" "}
        <span>4 free invoices every month, for life.</span> And, try free Pro access for a month on us.
        <br />
        <span>Sign Up today!"</span>
      </div>
    );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center text-center px-4 py-6">
        {/* Shimmer Profile Image */}
        <div className="relative mb-4">
          <div className="w-[84px] h-[84px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden bg-white/10">
            <div className="w-full h-full bg-gradient-to-r from-white/5 via-white/20 to-white/5 bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>
        {/* Shimmer Text Lines */}
        <div className="space-y-3 w-full max-w-[350px] md:max-w-[550px]">
          <div className="h-6 md:h-8 rounded-lg overflow-hidden bg-white/10">
            <div className="w-full h-full bg-gradient-to-r from-white/5 via-white/20 to-white/5 bg-[length:200%_100%] animate-shimmer" />
          </div>
          <div className="h-6 md:h-8 rounded-lg overflow-hidden bg-white/10 w-3/4 mx-auto">
            <div className="w-full h-full bg-gradient-to-r from-white/5 via-white/20 to-white/5 bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center px-4 py-6"
    >
      {/* Profile Image with gradient border */}
      <div className="relative mb-4">
        <div className="w-[84px] h-[84px] md:w-[140px] md:h-[140px] rounded-full ">
          <div className="w-full h-full rounded-full overflow-hidden">
            <Image
              src={displayImage}
              alt={`${displayName}'s profile`}
              width={140}
              height={140}
              className="w-full h-full object-cover"
              unoptimized={displayImage.startsWith("http")}
            />
          </div>
        </div>
      </div>

      {/* Message Text */}
      <div className="text-white max-w-[350px] md:max-w-[550px]">
        {messageText}
      </div>
    </motion.div>
  );
}
