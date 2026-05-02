// Typed client for the /v1/creator/auth/* + /v1/creator/users/me surface used
// by the promo signup card. /status, /refresh, /logout will be added when a
// consumer (logged-in dashboard etc.) lands. Cross-origin cookies + envelope
// parsing live in ./fetch.

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

// Basic-info onboarding step. Send only what changed; writing first_name flips
// has_basic_information=true server-side.
export interface UpdateMeRequest {
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  country_code?: string; // ISO-3166-1 alpha-2
  currency_code?: string;
  language_code?: string;
}

export interface UpdateMeResponse {
  id: string;
  has_basic_information: boolean;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone_number_e164?: string | null;
  // Other UserResponse fields are returned but unused by the promo card.
  [key: string]: unknown;
}

export function updateMe(body: UpdateMeRequest): Promise<UpdateMeResponse> {
  return authFetch<UpdateMeResponse>("/v1/creator/users/me", {
    method: "PATCH",
    body,
  });
}

// Attach a secondary identifier (e.g. email after a phone signup). The server
// stores the identifier on the row and sends an OTP — the user can complete
// verification later via /users/me/verify/confirm, or skip it; the email
// remains attached unverified either way.
export interface SendIdentifierOtpRequest {
  email?: string;
  phone_number_e164?: string;
  channels?: AuthChannel[];
}

export interface SendIdentifierOtpResponse {
  message_code: string;
  message_params: Record<string, unknown>;
}

export function sendIdentifierOtp(
  body: SendIdentifierOtpRequest,
): Promise<SendIdentifierOtpResponse> {
  return authFetch<SendIdentifierOtpResponse>(
    "/v1/creator/users/me/verify/send-otp",
    { method: "POST", body },
  );
}
