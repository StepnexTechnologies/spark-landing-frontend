"use client";

import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import { ArrowRight, Loader2 } from "lucide-react";
import { ValidatedPhoneInput } from "@/components/creator/earn/ValidatedPhoneInput";
import OtpInput from "@/components/creator/otp/OtpInput";
import TextInput from "@/components/common/TextInput";
import { useSignup } from "./SignupContext";
import {
  CARD_GRADIENT,
  PartnerFooter,
  ResendRow,
  SHEET_TRANSITION,
  VerifiedBadge,
  WhatsAppGlyph,
} from "./signup-card-shared";

interface FounderInviteSignupCardProps {
  founderName: string;
  friendName: string;
}

export default function FounderInviteSignupCard({
  founderName,
  friendName,
}: FounderInviteSignupCardProps) {
  const { t } = useTranslation(["creatorPromo", "creatorFounderInvite"]);
  const {
    phone,
    setPhone,
    setCountry,
    stage,
    otp,
    setOtp,
    verifyStatus,
    profile,
    setProfileField,
    error,
    fieldErrors,
    requiresBasicInfo,
    resendIn,
    sendOtp,
    resendOtp,
    submitProfile,
    changeNumber,
  } = useSignup();

  const checks = (() => {
    const raw = t("creatorFounderInvite:signupCard.checks", {
      returnObjects: true,
    });
    return Array.isArray(raw) ? (raw as string[]) : [];
  })();

  const otpVisible =
    stage === "otp" || stage === "profile" || stage === "submitting" || stage === "submitted";
  // Returning users (requires_basic_info=false) skip the profile sheet entirely;
  // /verify runs straight from the OTP stage with no name/email payload.
  const profileVisible =
    requiresBasicInfo &&
    (stage === "profile" || stage === "submitting" || stage === "submitted");
  // Once we move past Stage 1 the phone input is locked. The CTA button
  // toggles to "Edit" so the user can unlock it and pick a new number.
  const phoneLocked = stage !== "phone";

  const isFirstNameValid = profile.firstName.trim().length > 0;
  const isLastNameValid = profile.lastName.trim().length > 0;
  const emailTrimmed = profile.email.trim();
  const isEmailValid = emailTrimmed === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed);
  const canSubmitProfile = isFirstNameValid && isLastNameValid && isEmailValid;

  const submitButtonLabel =
    stage === "submitting"
      ? t("signupCard.creating")
      : stage === "submitted"
        ? t("signupCard.done")
        : t("creatorFounderInvite:signupCard.ctaCreateAccount");

  // Forward-only progressive reveal in Stage 3: lastName appears once
  // firstName has any non-whitespace text, email + submit appear once
  // lastName does. Once revealed, fields stay revealed even if the user
  // clears the field — collapsing mid-edit would be jarring.
  const [hasTypedFirstName, setHasTypedFirstName] = useState(false);
  const [hasTypedLastName, setHasTypedLastName] = useState(false);
  useEffect(() => {
    if (!hasTypedFirstName && profile.firstName.trim().length > 0) {
      setHasTypedFirstName(true);
    }
  }, [profile.firstName, hasTypedFirstName]);
  useEffect(() => {
    if (!hasTypedLastName && profile.lastName.trim().length > 0) {
      setHasTypedLastName(true);
    }
  }, [profile.lastName, hasTypedLastName]);

  return (
    <motion.div
      id="founder-hero-card"
      layout
      style={{ background: CARD_GRADIENT }}
      transition={{
        layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      }}
      className="relative mx-auto w-full max-w-[420px] rounded-[24px] border-[3px] border-[#DD2A7B] px-3 py-4 shadow-[0_18px_40px_rgba(245,166,35,0.25),0_8px_20px_rgba(0,0,0,0.25)]"
    >
      {/* Voucher / VIP INVITE row */}
      <div className="flex items-start gap-3">
        <VipInviteTicket label={t("creatorFounderInvite:signupCard.ribbon")} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-primary leading-tight">
              {t("creatorFounderInvite:signupCard.headline")}
            </h2>
            <s className="text-xs text-primary/60 font-normal">
              {t("creatorFounderInvite:signupCard.originalPrice")}
            </s>
          </div>
          <ul className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-normal text-primary">
            {checks.map((label, i) => (
              <li key={i} className="flex items-center gap-1">
                <span aria-hidden="true">•</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-1 text-[12px] font-medium text-primary leading-snug">
            {t("creatorFounderInvite:signupCard.topTierLine", {
              founder: founderName,
            })}
          </p>
          <p className="text-[11px] font-normal text-primary/85 leading-snug">
            {t("creatorFounderInvite:signupCard.exclusiveLine", {
              friend: friendName,
            })}
          </p>
        </div>
      </div>

      {/* Phone input + Claim Now. Once we leave stage 'phone' the input is
          locked and the button flips to "Edit", which calls changeNumber
          to unlock the field. */}
      <div className="mt-3">
        <p className="mb-1 px-1 text-[11px] font-medium text-primary/80">
          {t("creatorFounderInvite:signupCard.yourMobileNumber")}
        </p>
        <div className="flex items-center w-full rounded-[16px] bg-white border border-black/10 p-[6px] pl-3 gap-2">
          <Suspense fallback={null}>
            <ValidatedPhoneInput
              id="founder-hero-phone"
              value={phone}
              onChange={setPhone}
              onCountryChange={(c) => c && setCountry(c)}
              placeholder={t("hero.card.phonePlaceholder")}
              disabled={phoneLocked}
              autoComplete="off"
              inputClassName="bg-transparent border-none outline-none text-base placeholder:text-[#999999] focus:outline-none focus:ring-0 w-full text-[#212529] disabled:bg-transparent"
            />
          </Suspense>
          {(() => {
            const isVerifying = verifyStatus === "verifying";
            const ctaDisabled =
              stage === "otpSending" ||
              isVerifying ||
              (phoneLocked &&
                (verifyStatus === "verified" ||
                  stage === "submitting" ||
                  stage === "submitted"));
            return (
              <button
                type="button"
                onClick={phoneLocked ? changeNumber : sendOtp}
                disabled={ctaDisabled}
                className="flex-shrink-0 px-4 py-2 rounded-[8px] text-white text-sm font-semibold whitespace-nowrap bg-[linear-gradient(162deg,#dd2a7b_0%,#9747FF_64%)] hover:brightness-110 active:scale-95 transition-[filter,opacity,transform] duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {stage === "otpSending" ? (
                  t("otp.sending")
                ) : isVerifying ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t("signupCard.verifying")}
                  </span>
                ) : phoneLocked ? (
                  t("hero.card.edit")
                ) : (
                  t("creatorFounderInvite:signupCard.ctaSendOtp")
                )}
              </button>
            );
          })()}
        </div>

        {/* Phone-stage error — surfaces /authenticate failures (network,
            VALIDATION_ERROR) and the rollback path from /verify when we
            bumped back to phone (PHONE_ALREADY_IN_USE, USER_NOT_FOUND). */}
        <AnimatePresence initial={false}>
          {stage === "phone" && error && (
            <motion.p
              key="phone-error"
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 8 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={SHEET_TRANSITION}
              role="alert"
              className="overflow-hidden text-xs text-red-100 bg-red-600/20 px-2 py-1 rounded text-center"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Disclaimer — only shown in stage 1 (hidden once OTP is sent) */}
        <AnimatePresence initial={false}>
          {stage === "phone" && (
            <motion.p
              key="disclaimer"
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 8 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={SHEET_TRANSITION}
              className="overflow-hidden text-[10px] md:text-[11px] text-primary/85 text-center leading-snug px-1"
            >
              <Trans
                i18nKey="creatorFounderInvite:signupCard.disclaimer"
                t={t}
                components={[
                  <a
                    key="terms"
                    href="/legal/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  />,
                  <a
                    key="privacy"
                    href="/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  />,
                ]}
              />
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Stage 2: OTP block */}
      <AnimatePresence initial={false}>
        {otpVisible && (
          <motion.div
            key="otp-section"
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 12 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={SHEET_TRANSITION}
            className="overflow-hidden"
          >
            <div className="flex flex-col items-center gap-3 px-2">
              <p className="flex items-center justify-center gap-1.5 text-xs font-normal text-white text-center">
                <span>{t("signupCard.otpSentOverWhatsapp")}</span>
                <WhatsAppGlyph />
                <span className="font-medium text-white">
                  +91-{phone.replace(/^\+?91/, "").trim() || phone}
                </span>
              </p>

              <OtpInput
                length={4}
                value={otp}
                onChange={setOtp}
                autoFocus
                disabled={stage === "submitting" || stage === "submitted"}
                variant="light"
              />

              {verifyStatus === "verified" && (
                <VerifiedBadge status={verifyStatus} t={t} />
              )}

              {error && verifyStatus !== "verified" && verifyStatus !== "error" && (
                <p className="text-xs text-red-100 bg-red-600/20 px-2 py-0.5 rounded">{error}</p>
              )}

              {verifyStatus !== "verified" && (
                <ResendRow
                  resendIn={resendIn}
                  resendOtp={resendOtp}
                  disabled={verifyStatus === "verifying"}
                  t={t}
                />
              )}

              {/* "Incorrect OTP" pill drops to its own line under the resend
                  row and auto-hides after 2s — see the verifyStatus-watcher
                  effect in SignupContext. The verifying state is surfaced on
                  the Edit button itself, not here. */}
              <AnimatePresence initial={false}>
                {verifyStatus === "error" && (
                  <motion.div
                    key="pill-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <VerifiedBadge status={verifyStatus} t={t} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 3: profile form */}
      <AnimatePresence initial={false}>
        {profileVisible && (
          <motion.div
            key="profile-section"
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={SHEET_TRANSITION}
            className="overflow-hidden"
          >
            <div className="flex flex-col px-2">
              <TextInput
                label={t("signupCard.firstNameLabel")}
                placeholder={t("signupCard.firstNamePlaceholder")}
                value={profile.firstName}
                onChange={(e) => setProfileField("firstName", e.target.value)}
                autoComplete="off"
              />

              {/* Progressive reveal: lastName appears once firstName has
                  content. Forward-only — see hasTypedFirstName state above. */}
              <AnimatePresence initial={false}>
                {hasTypedFirstName && (
                  <motion.div
                    key="last-name-row"
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={SHEET_TRANSITION}
                    className="overflow-hidden"
                  >
                    <TextInput
                      label={t("signupCard.lastNameLabel")}
                      placeholder={t("signupCard.lastNamePlaceholder")}
                      value={profile.lastName}
                      onChange={(e) => setProfileField("lastName", e.target.value)}
                      autoComplete="off"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email + submit + partner logos all arrive together once
                  lastName has been touched. */}
              <AnimatePresence initial={false}>
                {hasTypedLastName && (
                  <motion.div
                    key="email-and-submit"
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={SHEET_TRANSITION}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2">
                      <TextInput
                        label={t("signupCard.emailLabel")}
                        placeholder={t("signupCard.emailPlaceholder")}
                        value={profile.email}
                        onChange={(e) => setProfileField("email", e.target.value)}
                        type="email"
                        autoComplete="off"
                        error={
                          fieldErrors.email ??
                          (emailTrimmed && !isEmailValid
                            ? "Please enter a valid email"
                            : undefined)
                        }
                      />

                      {stage === "profile" && error && !fieldErrors.email && (
                        <p
                          role="alert"
                          className="text-xs text-red-100 bg-red-600/20 px-2 py-1 rounded text-center"
                        >
                          {error}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={submitProfile}
                        disabled={!canSubmitProfile || stage === "submitting" || stage === "submitted"}
                        className="relative mt-1 w-full inline-flex items-center justify-center overflow-hidden rounded-full p-[1px] shadow-[0_4px_12px_rgba(129,52,165,0.18)] transition-[opacity] duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,rgba(221,42,123,1)_10%,rgba(151,71,255,1)_50%,rgba(221,42,123,0.5)_90%,#ffffff_100%)]"
                        />
                        <span className="relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-semibold">
                          <span className="bg-[linear-gradient(162.34deg,#DD2A7B_4.78%,#9747FF_89.95%)] bg-clip-text text-transparent">
                            {submitButtonLabel}
                          </span>
                          <motion.span
                            aria-hidden="true"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity }}
                            className="inline-flex"
                          >
                            <ArrowRight className="h-4 w-4 text-[#DD2A7B]" strokeWidth={2.5} />
                          </motion.span>
                        </span>
                      </button>

                      <PartnerFooter />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Small VIP-INVITE ticket glyph rendered top-left of the card. Inline SVG
// keeps the byte cost low (~600B compared with a PNG that has to be fetched)
// and lets us tint via currentColor if we ever need a different palette.
function VipInviteTicket({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-[78px] flex-shrink-0">
      <svg
        viewBox="0 0 78 50"
        width={78}
        height={50}
        className="drop-shadow-[0_2px_4px_rgba(122,53,8,0.25)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="vipTicketBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE07A" />
            <stop offset="100%" stopColor="#E59E20" />
          </linearGradient>
        </defs>
        {/* Ticket body with two semicircular notches on the left + right
            edges (path arcs cut inward) so it reads as a tear-strip ticket. */}
        <path
          d="M4,4 H74 a4,4 0 0 1 4,4 v10 a7,7 0 0 0 0,14 v8 a4,4 0 0 1 -4,4 H4 a4,4 0 0 1 -4,-4 v-8 a7,7 0 0 0 0,-14 V8 a4,4 0 0 1 4,-4 z"
          fill="url(#vipTicketBody)"
          stroke="#B97A12"
          strokeWidth={1}
        />
        {/* Stars row */}
        <g fill="#7A3508">
          {[12, 24, 36, 48, 60].map((cx) => (
            <polygon
              key={cx}
              points={`${cx},10 ${cx + 1.6},13.4 ${cx + 5.2},13.6 ${cx + 2.4},16 ${cx + 3.4},19.4 ${cx},17.4 ${cx - 3.4},19.4 ${cx - 2.4},16 ${cx - 5.2},13.6 ${cx - 1.6},13.4`}
            />
          ))}
        </g>
        <text
          x="39"
          y="33"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight={800}
          fill="#7A3508"
          letterSpacing="0.6"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
