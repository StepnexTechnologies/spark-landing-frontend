// Typed client for the /v1/creator/auth/* surface used by the promo signup
// card. Only the three endpoints the card needs are wired here — /status,
// /refresh, /logout will be added when a consumer (logged-in dashboard etc.)
// lands. Cross-origin cookies + envelope parsing live in ./fetch.

import { authFetch } from "./fetch";

export type AuthChannel = "sms" | "whatsapp" | "email";

export interface AuthenticateRequest {
  // Send exactly one identifier. Server enforces the channels-vs-identifier
  // contract (e.g. whatsapp/sms require phone, email channel requires email).
  phone_number_e164?: string;
  email?: string;
  channels?: AuthChannel[];
}

export interface AuthenticateResponse {
  message_code: string;
  message_params: Record<string, unknown>;
  creator_id: string;
  is_new_user: boolean;
  // True until the row has at least first_name set. Drives whether to render
  // the basic-info form alongside (after) the OTP screen.
  requires_basic_info: boolean;
  has_email: boolean;
  is_email_verified: boolean;
}

export interface VerifyRequest {
  user_id: string;
  otp: string;
  // Basic-info fields — applied only when the row currently has
  // requires_basic_info=true; ignored for returning users.
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  country_code?: string; // ISO-3166-1 alpha-2
  // Optional secondary identifier: phone-signup users can attach an email
  // here (and vice versa). Stored unverified.
  email?: string;
  phone_number_e164?: string | null;
  // Only consumed on the user's very first verify. Safe to always include.
  referral_code?: string | null;
}

export interface VerifyResponse {
  message_code: string;
  message_params: Record<string, unknown>;
  is_phone_number_verified: boolean;
  is_email_verified: boolean;
  has_created_invoice: boolean;
}

export interface ResendOtpRequest {
  creator_id: string;
  channels: AuthChannel[];
  // Only consulted when the user has no email yet AND the channels include
  // "email"; otherwise ignored by the server.
  email?: string;
}

export interface ResendOtpResponse {
  message_code: string;
  message_params: Record<string, unknown>;
}

export function authenticate(body: AuthenticateRequest): Promise<AuthenticateResponse> {
  return authFetch<AuthenticateResponse>("/v1/creator/auth/authenticate", {
    method: "POST",
    body,
  });
}

export function verify(body: VerifyRequest): Promise<VerifyResponse> {
  return authFetch<VerifyResponse>("/v1/creator/auth/verify", {
    method: "POST",
    body,
  });
}

export function resendOtp(body: ResendOtpRequest): Promise<ResendOtpResponse> {
  return authFetch<ResendOtpResponse>("/v1/creator/auth/resend-otp", {
    method: "POST",
    body,
  });
}
