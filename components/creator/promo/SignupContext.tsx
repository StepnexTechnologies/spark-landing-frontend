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
import {
  authenticate,
  resendOtp,
  sendIdentifierOtp,
  updateMe,
  verify,
} from "@/lib/auth/api";
import { AuthApiError, type MessageCode } from "@/lib/auth/errors";
import { redirectToApp } from "@/lib/auth/redirect";
import { getCurrentLang } from "@/lib/i18n";
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
  const { t, i18n } = useTranslation("creatorPromo");

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

  const reportSignupError = useCallback(
    (
      signupStage: "phone" | "otp" | "verify" | "profile",
      err: unknown,
    ): { code: MessageCode; text: string } => {
      const apiErr = err instanceof AuthApiError ? err : null;
      const code: MessageCode = apiErr?.messageCode ?? "NETWORK_ERROR";
      track("promo_signup_error", {
        stage: signupStage,
        message_code: code,
        status: apiErr?.status ?? 0,
      });
      return { code, text: translateError(err).text };
    },
    [translateError],
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

  useEffect(() => {
    if (stage !== "otp" || resendIn <= 0) return;
    const id = setInterval(() => {
      setResendIn((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [stage, resendIn]);

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
      const { code, text } = reportSignupError("phone", err);
      setErrorCode(code);
      setError(text);
      setStage("phone");
    }
  }, [phone, stage, reportSignupError, startExpiryTimer]);

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
      const { code, text } = reportSignupError("otp", err);
      setErrorCode(code);
      setError(text);
    }
  }, [creatorId, reportSignupError, resendIn, startExpiryTimer]);

  // Only fires for new users — returning users (requires_basic_info=false)
  // skip the profile sheet and are marked submitted directly from the
  // auto-verify success branch.
  const handleSubmitProfile = useCallback(async () => {
    if (!creatorId) return;
    setStage("submitting");
    setError(null);
    setErrorCode(null);
    setFieldErrors({});

    track("promo_profile_submit", {
      creator_id: creatorId,
      is_returning: isNewUser === false,
      requires_basic_info: requiresBasicInfo,
      has_email: Boolean(profile.email),
    });

    try {
      await updateMe({
        first_name: profile.firstName.trim(),
        last_name: profile.lastName.trim(),
        country_code: country,
      });
      setStage("submitted");

      // PATCH /users/me doesn't accept email — POST /users/me/verify/send-otp
      // stores it on the row (and sends a verification OTP the user can
      // confirm later). Awaited before redirect so window.location assignment
      // doesn't abort the in-flight fetch; failures fall to analytics only.
      const emailToAttach = profile.email.trim();
      if (emailToAttach) {
        await sendIdentifierOtp({
          email: emailToAttach,
          channels: ["email"] as const,
        }).catch((err) => {
          const apiErr = err instanceof AuthApiError ? err : null;
          track("promo_attach_email_error", {
            creator_id: creatorId,
            message_code: apiErr?.messageCode ?? "NETWORK_ERROR",
            status: apiErr?.status ?? 0,
          });
        });
      }

      clearExpiryTimer();
      redirectToApp({ phone, referralCode, lang: getCurrentLang(i18n) });
    } catch (err) {
      const { code, text } = reportSignupError("profile", err);
      if (code === "EMAIL_ALREADY_IN_USE") {
        setFieldErrors({ email: t("errors.EMAIL_ALREADY_IN_USE") });
        setErrorCode(code);
        setStage("profile");
        return;
      }
      setErrorCode(code);
      setError(text);
      setStage("profile");
    }
  }, [
    clearExpiryTimer,
    country,
    creatorId,
    isNewUser,
    phone,
    profile.email,
    profile.firstName,
    profile.lastName,
    referralCode,
    reportSignupError,
    requiresBasicInfo,
    i18n,
    t,
  ]);

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

  // Auto-verify when the 4th digit lands. Calls /auth/verify with just
  // {user_id, otp, referral_code} per the new contract — basic info is
  // captured separately via PATCH /users/me on profile submit.
  //
  // No cancellation flag here on purpose. React StrictMode (Next 16 default)
  // does setup → cleanup → setup on mount; if the cleanup flipped a
  // `cancelled=true` flag, the in-flight verify's success branch would bail
  // and stage would never advance to "profile". verifyingRef alone gates
  // re-entry, and verifyStatus is deliberately out of the deps for the same
  // reason — its setter inside the effect must not retrigger cleanup.
  useEffect(() => {
    if (stage !== "otp") return;
    if (otp.length !== 4) return;
    if (verifyingRef.current) return;
    if (!creatorId) return;

    verifyingRef.current = true;

    setVerifyStatus("verifying");
    setError(null);
    setErrorCode(null);

    (async () => {
      try {
        await verify({
          user_id: creatorId,
          otp,
          referral_code: referralCode ?? undefined,
        });
        // OTP consumed — cookies are set, the 290s expiry guard no longer
        // applies.
        clearExpiryTimer();
        setVerifyStatus("verified");
        track("promo_otp_verified", { creator_id: creatorId });

        await new Promise((r) => setTimeout(r, VERIFIED_HOLD_MS));

        if (requiresBasicInfo) {
          setStage((current) => (current === "otp" ? "profile" : current));
        } else {
          setStage((current) => (current === "otp" ? "submitted" : current));
          redirectToApp({ phone, referralCode, lang: getCurrentLang(i18n) });
        }
      } catch (err) {
        const { code, text } = reportSignupError("verify", err);

        if (code === "INVALID_OTP") {
          setOtp("");
          setVerifyStatus("error");
          setErrorCode(code);
          setError(t("errors.INVALID_OTP"));
          return;
        }
        if (code === "OTP_EXPIRED") {
          clearExpiryTimer();
          setOtp("");
          setVerifyStatus("idle");
          setErrorCode(code);
          setError(t("errors.OTP_EXPIRED"));
          return;
        }
        if (code === "USER_NOT_FOUND") {
          // creator_id is stale (likely soft-deleted server-side); restart.
          clearExpiryTimer();
          setCreatorId(null);
          setOtp("");
          setVerifyStatus("idle");
          setResendIn(0);
          setErrorCode(code);
          setError(t("errors.USER_NOT_FOUND"));
          setStage("phone");
          return;
        }
        setVerifyStatus("error");
        setErrorCode(code);
        setError(text);
      } finally {
        verifyingRef.current = false;
      }
    })();
  }, [
    otp,
    stage,
    creatorId,
    referralCode,
    requiresBasicInfo,
    phone,
    i18n,
    clearExpiryTimer,
    reportSignupError,
    t,
  ]);

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
