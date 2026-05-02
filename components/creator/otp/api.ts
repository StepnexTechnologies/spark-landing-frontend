// Legacy stub surface kept only for `PhoneOtpFlow` (creator/earn hero), which
// hard-redirects to the beta auth host after verifying. New surfaces should
// import from `lib/auth/api.ts` instead — that module wraps the real
// /v1/creator/auth/* endpoints and handles cookies/error envelopes.

export interface VerifyOtpResult {
  ok: boolean;
  redirectUrl?: string;
}

// Dev stub: simulates a 600ms network round-trip and always succeeds. Replace
// with a real fetch to the OTP-send endpoint when available.
export async function sendOtp(phone: string): Promise<void> {
  void phone;
  await new Promise((resolve) => setTimeout(resolve, 600));
}

// Dev stub: hardcoded auto-accept with no simulated latency so Stage 3 lands
// immediately after the 4th digit is typed. Replace with the real verify call
// when shared — only this function changes.
export async function verifyOtp(
  phone: string,
  code: string,
): Promise<VerifyOtpResult> {
  void phone;
  void code;
  return { ok: true };
}

export interface SubmitProfileResult {
  ok: boolean;
}

export interface SubmitProfileInput {
  phone: string;
  firstName: string;
  lastName: string;
  email?: string;
}

// Dev stub for the promo signup card's profile step. Real endpoint is TBD;
// when wired, only this function changes.
export async function submitProfile(input: SubmitProfileInput): Promise<SubmitProfileResult> {
  void input;
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { ok: true };
}
