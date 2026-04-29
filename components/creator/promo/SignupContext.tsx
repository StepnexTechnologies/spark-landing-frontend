"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { sendOtp, submitProfile, verifyOtp } from "@/components/creator/otp/api";
import { track } from "@/lib/analytics/track";

export type SignupStage =
  | "phone"
  | "otpSending"
  | "otp"
  | "profile"
  | "submitting"
  | "submitted";

export type VerifyStatus = "idle" | "verifying" | "verified" | "error";

export interface SignupProfile {
  firstName: string;
  lastName: string;
  email: string;
}

interface SignupContextValue {
  phone: string;
  setPhone: (value: string) => void;
  stage: SignupStage;
  otp: string;
  setOtp: (value: string) => void;
  verifyStatus: VerifyStatus;
  profile: SignupProfile;
  setProfileField: (field: keyof SignupProfile, value: string) => void;
  error: string | null;
  resendIn: number;
  sendOtp: () => Promise<void>;
  resendOtp: () => Promise<void>;
  submitProfile: () => Promise<void>;
  changeNumber: () => void;
}

const SignupContext = createContext<SignupContextValue | null>(null);

const RESEND_SECONDS = 30;
// Brief beat between the green tick and Stage 3 unfolding so the user sees the
// success state before the form appears.
const VERIFIED_HOLD_MS = 150;

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<SignupStage>("phone");
  const [otp, setOtp] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle");
  const [profile, setProfile] = useState<SignupProfile>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  // Guards re-entrancy in the auto-verify effect when the user pastes a 4-digit
  // code or types the last digit while a previous verify is still in flight.
  const verifyingRef = useRef(false);

  useEffect(() => {
    if (stage !== "otp" || resendIn <= 0) return;
    const id = setInterval(() => {
      setResendIn((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [stage, resendIn]);

  const handleSendOtp = useCallback(async () => {
    if (!phone || stage === "otpSending") return;
    setError(null);
    setStage("otpSending");
    setOtp("");
    setVerifyStatus("idle");
    track("promo_send_otp_click", { has_phone: Boolean(phone) });
    try {
      await sendOtp(phone);
      setStage("otp");
      setResendIn(RESEND_SECONDS);
    } catch {
      setError("Something went wrong. Please try again.");
      setStage("phone");
    }
  }, [phone, stage]);

  const handleResend = useCallback(async () => {
    if (resendIn > 0) return;
    setError(null);
    setOtp("");
    setVerifyStatus("idle");
    track("promo_resend_otp", {});
    try {
      await sendOtp(phone);
      setResendIn(RESEND_SECONDS);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }, [phone, resendIn]);

  const handleSubmitProfile = useCallback(async () => {
    if (stage === "submitting") return;
    setError(null);
    setStage("submitting");
    track("promo_profile_submit", { has_email: Boolean(profile.email) });
    try {
      const res = await submitProfile({
        phone,
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        email: profile.email.trim() || undefined,
      });
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setStage("profile");
        return;
      }
      setStage("submitted");
    } catch {
      setError("Something went wrong. Please try again.");
      setStage("profile");
    }
  }, [phone, profile, stage]);

  const changeNumber = useCallback(() => {
    setOtp("");
    setVerifyStatus("idle");
    setError(null);
    setResendIn(0);
    setStage("phone");
  }, []);

  const setProfileField = useCallback(
    (field: keyof SignupProfile, value: string) => {
      setProfile((p) => ({ ...p, [field]: value }));
    },
    [],
  );

  // Auto-verify on 4th digit. Once verified we hold for VERIFIED_HOLD_MS so the
  // green tick is visible, then advance to the profile stage.
  useEffect(() => {
    if (stage !== "otp") return;
    if (otp.length !== 4) return;
    if (verifyingRef.current) return;
    if (verifyStatus === "verified") return;

    let cancelled = false;
    verifyingRef.current = true;
    setVerifyStatus("verifying");
    setError(null);

    (async () => {
      try {
        const result = await verifyOtp(phone, otp);
        if (cancelled) return;
        if (!result.ok) {
          setVerifyStatus("error");
          setError("Invalid OTP. Please try again.");
          verifyingRef.current = false;
          return;
        }
        setVerifyStatus("verified");
        track("promo_otp_verified", {});
        // Stage advance is intentionally NOT gated on `cancelled` — the
        // verifyStatus -> "verified" state update causes this effect to
        // re-run and its cleanup to fire (flipping `cancelled` to true), but
        // by that point we've committed to advancing. Use functional setState
        // so we don't stomp on a concurrent changeNumber().
        setTimeout(() => {
          setStage((current) => (current === "otp" ? "profile" : current));
          verifyingRef.current = false;
        }, VERIFIED_HOLD_MS);
      } catch {
        if (cancelled) return;
        setVerifyStatus("error");
        setError("Something went wrong. Please try again.");
        verifyingRef.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [otp, stage, phone, verifyStatus]);

  // Reset error + verify status if user edits OTP after an error.
  useEffect(() => {
    if (verifyStatus === "error" && otp.length < 4) {
      setVerifyStatus("idle");
      setError(null);
    }
  }, [otp, verifyStatus]);

  const value = useMemo<SignupContextValue>(
    () => ({
      phone,
      setPhone,
      stage,
      otp,
      setOtp,
      verifyStatus,
      profile,
      setProfileField,
      error,
      resendIn,
      sendOtp: handleSendOtp,
      resendOtp: handleResend,
      submitProfile: handleSubmitProfile,
      changeNumber,
    }),
    [
      phone,
      stage,
      otp,
      verifyStatus,
      profile,
      setProfileField,
      error,
      resendIn,
      handleSendOtp,
      handleResend,
      handleSubmitProfile,
      changeNumber,
    ],
  );

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignup(): SignupContextValue {
  const ctx = useContext(SignupContext);
  if (!ctx) {
    throw new Error("useSignup must be used inside <SignupProvider>");
  }
  return ctx;
}
