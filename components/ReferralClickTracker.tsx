"use client";

import {Suspense, useEffect} from "react";
import {useSearchParams} from "next/navigation";

function ReferralClickTrackerInner() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  useEffect(() => {
    if (!referralCode) return;

    const storageKey = `referral_tracked_${referralCode}`;
    if (sessionStorage.getItem(storageKey)) return;

    sessionStorage.setItem(storageKey, "true");

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    fetch(`${apiBaseUrl}/api/v1/creator/referrals/track-click/${referralCode}`, {
      method: "POST",
    }).catch(() => {}); // Fire-and-forget
  }, [referralCode]);

  return null;
}

export default function ReferralClickTracker() {
  return (
    <Suspense fallback={null}>
      <ReferralClickTrackerInner />
    </Suspense>
  );
}
