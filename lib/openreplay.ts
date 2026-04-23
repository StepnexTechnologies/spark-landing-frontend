import Tracker from "@openreplay/tracker";
import trackerAssist from "@openreplay/tracker-assist";

const PROJECT_KEY =
  process.env.NEXT_PUBLIC_OPENREPLAY_KEY ?? "CMQ3LBleIxfH2tRSEq3R";

let _tracker: Tracker | null = null;

function getTracker(): Tracker | null {
  if (typeof window === "undefined") return null;
  if (!_tracker) {
    _tracker = new Tracker({
      projectKey: PROJECT_KEY,
      __DISABLE_SECURE_MODE: process.env.NODE_ENV !== "production",
    });
    _tracker.use(trackerAssist());
  }
  return _tracker;
}

export function initOpenReplay(): void {
  const t = getTracker();
  if (!t) return;
  if (process.env.NODE_ENV === "production") t.start();
}

export function trackEvent(
  name: string,
  payload?: Record<string, unknown>,
): void {
  getTracker()?.event(name, payload);
}

export function setUserID(id: string): void {
  getTracker()?.setUserID(id);
}

export function setMetadata(key: string, value: string): void {
  getTracker()?.setMetadata(key, value);
}
