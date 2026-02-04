"use client";

import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {useTranslation} from "react-i18next";
import Image from "next/image";
import {motion} from "framer-motion";

interface ReferrerInfo {
  first_name: string;
  profile_picture_url: string;
}

const DEFAULT_IMAGE = "/images/creator/earn/referal-default.png";

export default function ReferralBanner() {
  const { t, ready } = useTranslation("creatorEarn");
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  const [referrerInfo, setReferrerInfo] = useState<ReferrerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasReferral, setHasReferral] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (referralCode) {
      setHasReferral(true);
      fetchReferrerInfo(referralCode);
    }
  }, [referralCode]);

  const fetchReferrerInfo = async (code: string) => {
    setIsLoading(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE;
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

  // Don't render anything if there's no referral code in URL or not mounted
  if (!referralCode || !mounted || !ready) {
    return null;
  }

  const displayName = referrerInfo?.first_name || t("referral.defaultName");
  const hasProfileImage = !!referrerInfo?.profile_picture_url;

  const messageText = (
    <div className="font-semibold text-2xl md:text-3xl lg:text-4xl italic">
      <span>"{displayName}</span> {t("referral.message")}
      <br />
      <span>{t("referral.signUp")}"</span>
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
      {/* Profile Image - only show if API returns an image */}
      {hasProfileImage && (
        <div className="relative mb-4">
          <div className="w-[84px] h-[84px] md:w-[140px] md:h-[140px] rounded-full ">
            <div className="w-full h-full rounded-full overflow-hidden">
              <Image
                src={referrerInfo!.profile_picture_url}
                alt={`${displayName}'s profile`}
                width={140}
                height={140}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

      {/* Message Text */}
      <div className="text-white max-w-[350px] md:max-w-[550px]">
        {messageText}
      </div>
    </motion.div>
  );
}
