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
