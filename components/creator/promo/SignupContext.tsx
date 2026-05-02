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
import { useTranslation } from "react-i18next";
import { authenticate, resendOtp, verify } from "@/lib/auth/api";
import { AuthApiError, type MessageCode } from "@/lib/auth/errors";
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

export interface SignupFieldErrors {
  email?: string;
}

interface SignupContextValue {
  phone: string;
  setPhone: (value: string) => void;
  country: string;
  setCountry: (code: string) => void;
  stage: SignupStage;
  otp: string;
  setOtp: (value: string) => void;
  verifyStatus: VerifyStatus;
  profile: SignupProfile;
  setProfileField: (field: keyof SignupProfile, value: string) => void;
  error: string | null;
  errorCode: MessageCode | null;
  fieldErrors: SignupFieldErrors;
  requiresBasicInfo: boolean;
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
// Backend OTP TTL is 5 min. Bump back to the OTP stage 10s before that so the
// user sees an "expired, please resend" prompt instead of a confusing 401 only
// after they've filled the profile form.
const OTP_EXPIRY_MS = 290_000;
// Default channels — promo is WhatsApp-first (the card copy says "OTP sent
// over WhatsApp"). Resend uses the same default; user-facing channel switching
// would need this list to be wired through.
const DEFAULT_CHANNELS: Array<"whatsapp"> = ["whatsapp"];
const REFERRAL_STORAGE_KEY = "promo_ref";

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation("creatorPromo");

  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<string>("IN");
  const [stage, setStage] = useState<SignupStage>("phone");
  const [otp, setOtp] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle");
  const [profile, setProfile] = useState<SignupProfile>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<MessageCode | null>(null);
  const [fieldErrors, setFieldErrors] = useState<SignupFieldErrors>({});
  const [resendIn, setResendIn] = useState(0);

  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [requiresBasicInfo, setRequiresBasicInfo] = useState(true);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  // Guards re-entrancy in the auto-verify effect when the user pastes a 4-digit
  // code or types the last digit while a previous verify is still in flight.
  const verifyingRef = useRef(false);
  // Survives re-renders so changeNumber/submitted can clear an in-flight expiry.
  const expiryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Translate a thrown AuthApiError to user-facing copy via creatorPromo:errors.<code>.
  // Falls back to errors._default for unknown codes — tighter than echoing the
  // raw message_code and keeps Hinglish UX consistent.
  const translateError = useCallback(
    (err: unknown): { code: MessageCode; text: string } => {
      const code: MessageCode =
        err instanceof AuthApiError ? err.messageCode : "NETWORK_ERROR";
      const key = `errors.${code}`;
      const translated = t(key);
      const text = translated === key ? t("errors._default") : translated;
      return { code, text };
    },
    [t],
  );

  const clearExpiryTimer = useCallback(() => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
  }, []);

  const startExpiryTimer = useCallback(() => {
    clearExpiryTimer();
    expiryTimerRef.current = setTimeout(() => {
      // Only act if the user hasn't already moved on (submitted) or restarted
      // the flow (back to "phone"). Use functional setState so we don't stomp
      // on a concurrent transition.
      setStage((current) => {
        if (current !== "otp" && current !== "profile") return current;
        setOtp("");
        setVerifyStatus("idle");
        setErrorCode("OTP_EXPIRED");
        setError(t("errors.OTP_EXPIRED"));
        return "otp";
      });
    }, OTP_EXPIRY_MS);
  }, [clearExpiryTimer, t]);

  // Resend countdown
  useEffect(() => {
    if (stage !== "otp" || resendIn <= 0) return;
    const id = setInterval(() => {
      setResendIn((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [stage, resendIn]);

  // Cleanup on unmount.
  useEffect(() => clearExpiryTimer, [clearExpiryTimer]);

  // Pull referral code from ?ref or sessionStorage on mount. Reading
  // window.location directly (vs useSearchParams) keeps the provider out of
  // any Suspense-boundary requirement at the page level — referral data is
  // client-only anyway, same as the sessionStorage fallback below.
  useEffect(() => {
    let fromUrl: string | null = null;
    try {
      fromUrl = new URLSearchParams(window.location.search).get("ref");
    } catch {
      // ignore — non-browser env
    }
    if (fromUrl) {
      setReferralCode(fromUrl);
      try {
        sessionStorage.setItem(REFERRAL_STORAGE_KEY, fromUrl);
      } catch {
        // sessionStorage may be unavailable in private mode — tolerate silently.
      }
      return;
    }
    try {
      const stored = sessionStorage.getItem(REFERRAL_STORAGE_KEY);
      if (stored) setReferralCode(stored);
    } catch {
      // ignore
    }
  }, []);

  const handleSendOtp = useCallback(async () => {
    if (!phone || stage === "otpSending") return;
    setError(null);
    setErrorCode(null);
    setFieldErrors({});
    setStage("otpSending");
    setOtp("");
    setVerifyStatus("idle");
    track("promo_send_otp_click", { has_phone: Boolean(phone) });
    try {
      const res = await authenticate({ phone_number_e164: phone });
      setCreatorId(res.creator_id);
      setRequiresBasicInfo(res.requires_basic_info);
      setIsNewUser(res.is_new_user);
      setStage("otp");
      setResendIn(RESEND_SECONDS);
      startExpiryTimer();
      track("promo_send_otp_success", {
        creator_id: res.creator_id,
        is_new_user: res.is_new_user,
        requires_basic_info: res.requires_basic_info,
      });
    } catch (err) {
      const { code, text } = translateError(err);
      setErrorCode(code);
      setError(text);
      setStage("phone");
      track("promo_signup_error", {
        stage: "phone",
        message_code: code,
        status: err instanceof AuthApiError ? err.status : 0,
      });
    }
  }, [phone, stage, startExpiryTimer, translateError]);

  const handleResend = useCallback(async () => {
    if (resendIn > 0 || !creatorId) return;
    setError(null);
    setErrorCode(null);
    setOtp("");
    setVerifyStatus("idle");
    track("promo_resend_otp", { creator_id: creatorId });
    try {
      await resendOtp({ creator_id: creatorId, channels: DEFAULT_CHANNELS });
      setResendIn(RESEND_SECONDS);
      startExpiryTimer();
    } catch (err) {
      const { code, text } = translateError(err);
      setErrorCode(code);
      setError(text);
      track("promo_signup_error", {
        stage: "otp",
        message_code: code,
        status: err instanceof AuthApiError ? err.status : 0,
      });
    }
  }, [creatorId, resendIn, startExpiryTimer, translateError]);

  // Forward-declared so the auto-verify effect can call it for the
  // returning-user short-circuit path. Stable identity via useCallback.
  const handleSubmitProfile = useCallback(async () => {
    if (!creatorId) return;
    setStage((current) => (current === "submitting" ? current : "submitting"));
    setError(null);
    setErrorCode(null);
    setFieldErrors({});

    track("promo_profile_submit", {
      creator_id: creatorId,
      is_returning: isNewUser === false,
      requires_basic_info: requiresBasicInfo,
      has_email: Boolean(profile.email),
    });

    // Returning users (requires_basic_info=false) get a minimal payload — the
    // server ignores name/country/email anyway, but skipping them keeps the
    // request honest and easier to read in the network tab.
    const basicInfo = requiresBasicInfo
      ? {
          first_name: profile.firstName.trim(),
          last_name: profile.lastName.trim(),
          country_code: country,
          email: profile.email.trim() || undefined,
        }
      : {};

    try {
      await verify({
        user_id: creatorId,
        otp,
        ...basicInfo,
        // referral_code is only consumed on the user's very first verify;
        // safe to always include per the spec.
        referral_code: referralCode ?? undefined,
      });
      clearExpiryTimer();
      setStage("submitted");
    } catch (err) {
      const apiErr = err instanceof AuthApiError ? err : null;
      const code: MessageCode = apiErr?.messageCode ?? "NETWORK_ERROR";

      track("promo_signup_error", {
        stage: "verify",
        message_code: code,
        status: apiErr?.status ?? 0,
      });

      // Map the documented failure codes back to the right stage. Anything
      // not enumerated falls through to a generic in-place error.
      if (code === "INVALID_OTP") {
        setOtp("");
        setVerifyStatus("error");
        setErrorCode(code);
        setError(t("errors.INVALID_OTP"));
        setStage("otp");
        return;
      }
      if (code === "OTP_EXPIRED") {
        clearExpiryTimer();
        setOtp("");
        setVerifyStatus("idle");
        setErrorCode(code);
        setError(t("errors.OTP_EXPIRED"));
        setStage("otp");
        return;
      }
      if (code === "EMAIL_ALREADY_IN_USE") {
        setFieldErrors({ email: t("errors.EMAIL_ALREADY_IN_USE") });
        setErrorCode(code);
        setStage("profile");
        return;
      }
      if (code === "PHONE_ALREADY_IN_USE" || code === "USER_NOT_FOUND") {
        // Both require restarting from the phone stage — PHONE_ALREADY_IN_USE
        // because the number itself is wrong, USER_NOT_FOUND because the
        // creator_id we held is stale (likely soft-deleted server-side).
        clearExpiryTimer();
        setCreatorId(null);
        setOtp("");
        setVerifyStatus("idle");
        setResendIn(0);
        setErrorCode(code);
        setError(t(`errors.${code}`));
        setStage("phone");
        return;
      }

      const { text } = translateError(err);
      setErrorCode(code);
      setError(text);
      setStage(requiresBasicInfo ? "profile" : "otp");
    }
  }, [
    clearExpiryTimer,
    country,
    creatorId,
    isNewUser,
    otp,
    profile.email,
    profile.firstName,
    profile.lastName,
    referralCode,
    requiresBasicInfo,
    t,
    translateError,
  ]);

  // Stable ref so the auto-verify effect can call the latest handler without
  // forcing the effect to re-run when the handler identity changes.
  const submitRef = useRef(handleSubmitProfile);
  useEffect(() => {
    submitRef.current = handleSubmitProfile;
  }, [handleSubmitProfile]);

  const changeNumber = useCallback(() => {
    clearExpiryTimer();
    setOtp("");
    setVerifyStatus("idle");
    setError(null);
    setErrorCode(null);
    setFieldErrors({});
    setResendIn(0);
    setCreatorId(null);
    setRequiresBasicInfo(true);
    setIsNewUser(null);
    setStage("phone");
  }, [clearExpiryTimer]);

  const setProfileField = useCallback(
    (field: keyof SignupProfile, value: string) => {
      setProfile((p) => ({ ...p, [field]: value }));
      // Clear the inline server error on the field once the user edits it,
      // otherwise the stale error sits next to the corrected value.
      if (field === "email") {
        setFieldErrors((fe) => (fe.email ? { ...fe, email: undefined } : fe));
      }
    },
    [],
  );

  // Optimistic verify. We do NOT call /verify here — the new auth API merges
  // OTP verification with basic-info capture into a single atomic call, so
  // /verify only fires on profile submit. The green tick + 150ms hold are a
  // UX cue; bad-OTP feedback surfaces on the profile-submit failure path.
  // (This trade-off is intentional — see the plan file for context.)
  useEffect(() => {
    if (stage !== "otp") return;
    if (otp.length !== 4) return;
    if (verifyingRef.current) return;
    if (verifyStatus === "verified") return;

    verifyingRef.current = true;
    setVerifyStatus("verifying");
    setError(null);
    setErrorCode(null);

    setVerifyStatus("verified");
    track("promo_otp_verified", { creator_id: creatorId });

    const id = setTimeout(() => {
      // Returning users (requires_basic_info=false) skip the profile form
      // entirely — go straight into submitting and let /verify run with no
      // basic-info fields.
      if (!requiresBasicInfo) {
        setStage((current) => (current === "otp" ? "submitting" : current));
        verifyingRef.current = false;
        // Fire AFTER the state flush so handleSubmitProfile sees stage="submitting".
        void submitRef.current();
        return;
      }
      setStage((current) => (current === "otp" ? "profile" : current));
      verifyingRef.current = false;
    }, VERIFIED_HOLD_MS);

    return () => {
      clearTimeout(id);
    };
  }, [otp, stage, verifyStatus, requiresBasicInfo, creatorId]);

  // Reset error + verify status if user edits OTP after an error.
  useEffect(() => {
    if (verifyStatus === "error" && otp.length < 4) {
      setVerifyStatus("idle");
      setError(null);
      setErrorCode(null);
    }
  }, [otp, verifyStatus]);

  const value = useMemo<SignupContextValue>(
    () => ({
      phone,
      setPhone,
      country,
      setCountry,
      stage,
      otp,
      setOtp,
      verifyStatus,
      profile,
      setProfileField,
      error,
      errorCode,
      fieldErrors,
      requiresBasicInfo,
      resendIn,
      sendOtp: handleSendOtp,
      resendOtp: handleResend,
      submitProfile: handleSubmitProfile,
      changeNumber,
    }),
    [
      phone,
      country,
      stage,
      otp,
      verifyStatus,
      profile,
      setProfileField,
      error,
      errorCode,
      fieldErrors,
      requiresBasicInfo,
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
