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
import { redirectToApp, redirectToSocialAuth } from "@/lib/auth/redirect";
import { getCurrentLang } from "@/lib/i18n";
import { track } from "@/lib/analytics/track";
import { clearStoredUtm, readUtmParams } from "@/lib/utm";

export type SignupStage =
  | "phone"
  | "otpSending"
  | "otp"
  | "profile"
  | "submitting"
  | "submitted"
  // Earn flow only (socialAuthAfterVerify). Reached straight from a successful
  // OTP verify — the profile form and app redirect are skipped; the card shows
  // a "Verify your social account" panel whose CTA hands off to social-auth.
  | "social";

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
  // Manually trigger /verify with the current OTP value. Auto-verify still
  // fires when the user types/pastes the 4th digit; this exposes the same path
  // for explicit "Verify" buttons (e.g. /creator/earn Stage 2). Re-entry is
  // guarded by verifyingRef so double calls are safe.
  verifyOtp: () => Promise<void>;
  // Hand off to the social-account verification host. Only meaningful in the
  // earn flow (stage === "social"); wired to the "Verify Social & Continue" CTA.
  goToSocialAuth: () => void;
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

export function SignupProvider({
  children,
  socialAuthAfterVerify = false,
  namespace = "creatorPromo",
}: {
  children: React.ReactNode;
  // When true (earn page), a successful OTP verify lands on the "social" stage
  // instead of the profile form / app redirect. Other promo pages omit this and
  // keep the original new-user→profile, returning-user→app behaviour.
  socialAuthAfterVerify?: boolean;
  // i18n namespace for error copy (errors.*). Defaults to "creatorPromo",
  // which is Hinglish-only by design (en maps to the hi-Latn bundle — see
  // lib/i18n.ts). Bilingual pages like /creator/earn must pass their own
  // namespace so errors follow the page language instead of always Hinglish.
  namespace?: string;
}) {
  const { t, i18n } = useTranslation(namespace);

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
  const [utmSource, setUtmSource] = useState<string | null>(null);
  const [utmMedium, setUtmMedium] = useState<string | null>(null);

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

  // Pull referral code + UTM labels from URL or sessionStorage on mount.
  // Reading window.location directly (vs useSearchParams) keeps the provider
  // out of any Suspense-boundary requirement at the page level — referral
  // and UTM data are client-only anyway, same as the sessionStorage fallback.
  useEffect(() => {
    let search: URLSearchParams | null = null;
    try {
      search = new URLSearchParams(window.location.search);
    } catch {
      // ignore — non-browser env
    }

    const refFromUrl = search?.get("ref") ?? null;
    if (refFromUrl) {
      setReferralCode(refFromUrl);
      try {
        sessionStorage.setItem(REFERRAL_STORAGE_KEY, refFromUrl);
      } catch {
        // sessionStorage may be unavailable in private mode — tolerate silently.
      }
    } else {
      try {
        const stored = sessionStorage.getItem(REFERRAL_STORAGE_KEY);
        if (stored) setReferralCode(stored);
      } catch {
        // ignore
      }
    }

    // readUtmParams handles URL→sessionStorage write-through and falls back to
    // sessionStorage when the URL has no UTM (e.g. internal nav from /).
    if (search) {
      const utm = readUtmParams(search);
      if (utm.utm_source) setUtmSource(utm.utm_source);
      if (utm.utm_medium) setUtmMedium(utm.utm_medium);
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
      // New-user happy path complete — drop UTM sessionStorage so a future
      // signup in the same tab doesn't inherit stale attribution.
      clearStoredUtm();
      redirectToApp({ referralCode, lang: getCurrentLang(i18n) });
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

  // Core /auth/verify call. Takes an explicit otp so callers (auto-verify
  // useEffect, manual "Verify" button) share one code path. Re-entry is
  // guarded by verifyingRef — calling this concurrently is safe.
  //
  // No cancellation flag here on purpose. React StrictMode (Next 16 default)
  // does setup → cleanup → setup on mount; if the cleanup flipped a
  // `cancelled=true` flag, the in-flight verify's success branch would bail
  // and stage would never advance to "profile". verifyingRef alone gates
  // re-entry.
  const performVerify = useCallback(
    async (currentOtp: string) => {
      if (currentOtp.length !== 4) return;
      if (verifyingRef.current) return;
      if (!creatorId) return;

      verifyingRef.current = true;
      setVerifyStatus("verifying");
      setError(null);
      setErrorCode(null);

      try {
        await verify({
          user_id: creatorId,
          otp: currentOtp,
          referral_code: referralCode ?? undefined,
          utm_source: utmSource ?? undefined,
          utm_medium: utmMedium ?? undefined,
        });
        // OTP consumed — cookies are set, the 290s expiry guard no longer
        // applies.
        clearExpiryTimer();
        setVerifyStatus("verified");
        track("promo_otp_verified", { creator_id: creatorId });

        if (socialAuthAfterVerify) {
          // Earn flow: skip the profile form and the app redirect entirely.
          // The card swaps to the "Verify your social account" panel, whose
          // CTA hands off to social-auth via goToSocialAuth.
          //
          // No VERIFIED_HOLD here: flipping to "social" in the SAME synchronous
          // batch as verifyStatus="verified" makes the resend-row removal and
          // the panel mount net out to a single grow. With the hold, the two
          // landed in separate renders 150ms apart — the layout animation
          // shrank (resend row gone) then expanded (panel in), reading as a
          // mid-collapse bounce. The green "Verified" pill above the panel is
          // still visible, so we don't lose the success beat.
          clearStoredUtm();
          setStage((current) => (current === "otp" ? "social" : current));
          return;
        }

        await new Promise((r) => setTimeout(r, VERIFIED_HOLD_MS));

        if (requiresBasicInfo) {
          setStage((current) => (current === "otp" ? "profile" : current));
        } else {
          // Returning-user fast path: verify consumed any UTM the backend
          // would store, so drop the sessionStorage copies to avoid stale
          // attribution if the user opens the page again in this tab.
          clearStoredUtm();
          setStage((current) => (current === "otp" ? "submitted" : current));
          redirectToApp({ referralCode, lang: getCurrentLang(i18n) });
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
    },
    [
      creatorId,
      referralCode,
      utmSource,
      utmMedium,
      requiresBasicInfo,
      socialAuthAfterVerify,
      i18n,
      clearExpiryTimer,
      reportSignupError,
      t,
    ],
  );

  const goToSocialAuth = useCallback(() => {
    track("promo_social_auth_continue", { creator_id: creatorId });
    redirectToSocialAuth({ lang: getCurrentLang(i18n) });
  }, [creatorId, i18n]);

  // Auto-verify when the 4th digit lands. Calls /auth/verify with just
  // {user_id, otp, referral_code} per the new contract — basic info is
  // captured separately via PATCH /users/me on profile submit.
  useEffect(() => {
    if (stage !== "otp") return;
    if (otp.length !== 4) return;
    performVerify(otp);
  }, [otp, stage, performVerify]);

  const verifyOtp = useCallback(() => performVerify(otp), [performVerify, otp]);

  // Reset error + verify status once the user starts typing a new code.
  // Note: the INVALID_OTP catch above clears `otp` to "" while flipping
  // verifyStatus to "error" — so we must only fire on length > 0, otherwise
  // this effect wipes the error pill ~immediately after it appears.
  useEffect(() => {
    if (verifyStatus === "error" && otp.length > 0) {
      setVerifyStatus("idle");
      setError(null);
      setErrorCode(null);
    }
  }, [otp, verifyStatus]);

  // Auto-hide the "Incorrect OTP" pill 2s after it appears. If the user
  // starts typing during that window the effect above runs first, flipping
  // verifyStatus to "idle" and the cleanup here cancels the timer.
  useEffect(() => {
    if (verifyStatus !== "error") return;
    const id = setTimeout(() => {
      setVerifyStatus("idle");
      setError(null);
      setErrorCode(null);
    }, 2000);
    return () => clearTimeout(id);
  }, [verifyStatus]);

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
      verifyOtp,
      goToSocialAuth,
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
      verifyOtp,
      goToSocialAuth,
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
