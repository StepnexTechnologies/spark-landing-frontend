// Beta creator app — landing page hands off here once the user is fully
// authenticated (returning user post-verify, or new user post-PATCH /users/me).
// Cookies set by /verify are scoped to .sparkonomy.com so the user lands
// authenticated.
export const APP_REDIRECT_URL = "https://beta.creator.sparkonomy.com/earn/new";

export interface RedirectToAppArgs {
  referralCode?: string | null;
  lang: string;
}

export function redirectToApp(args: RedirectToAppArgs): void {
  if (typeof window === "undefined") return;
  const url = new URL(APP_REDIRECT_URL);
  url.searchParams.set("lang", args.lang);
  if (args.referralCode) url.searchParams.set("ref", args.referralCode);
  window.location.href = url.toString();
}

// Social-account verification handoff. The earn flow sends the user here after
// OTP verify instead of straight into the app — they finish the 3-step social
// check on this host. Auth cookies set by /verify are scoped to
// .sparkonomy.com, so the session carries across the subdomain.
export const SOCIAL_AUTH_URL =
  "https://beta.creator.sparkonomy.com/social-auth/verify";

export interface RedirectToSocialAuthArgs {
  lang: string;
}

export function redirectToSocialAuth(args: RedirectToSocialAuthArgs): void {
  if (typeof window === "undefined") return;
  // Carry the landing page's language across the subdomain hop — the app is a
  // separate origin, so i18next's localStorage detection can't see the choice
  // made here and would otherwise default everyone to English. The app's
  // LanguageQueryParamSync reads ?lang and strips it after applying.
  const url = new URL(SOCIAL_AUTH_URL);
  url.searchParams.set("lang", args.lang);
  window.location.href = url.toString();
}
