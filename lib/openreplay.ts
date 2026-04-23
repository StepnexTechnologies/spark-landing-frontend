// Lazy-loaded OpenReplay client. The tracker packages are pulled via dynamic
// import() so they stay out of the initial bundle on every route (author
// pages, blog, legal) where session replay is overhead-only until needed.

type TrackerLike = {
  event: (name: string, payload?: Record<string, unknown>) => void;
  setUserID: (id: string) => void;
  setMetadata: (key: string, value: string) => void;
  start: () => void;
  use: (plugin: unknown) => void;
};

const PROJECT_KEY =
  process.env.NEXT_PUBLIC_OPENREPLAY_KEY ?? "CMQ3LBleIxfH2tRSEq3R";
const IS_PROD = process.env.NODE_ENV === "production";

let _tracker: TrackerLike | null = null;
let _loading: Promise<TrackerLike | null> | null = null;
const _queue: Array<[string, Record<string, unknown> | undefined]> = [];

function loadTracker(): Promise<TrackerLike | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (_tracker) return Promise.resolve(_tracker);
  if (!_loading) {
    _loading = Promise.all([
      import("@openreplay/tracker"),
      import("@openreplay/tracker-assist"),
    ]).then(([trackerMod, assistMod]) => {
      const Tracker = trackerMod.default;
      const trackerAssist = assistMod.default;
      const t = new Tracker({
        projectKey: PROJECT_KEY,
        __DISABLE_SECURE_MODE: !IS_PROD,
      }) as unknown as TrackerLike;
      t.use(trackerAssist());
      _tracker = t;
      return t;
    });
  }
  return _loading;
}

export function initOpenReplay(): void {
  if (!IS_PROD) return;
  if (typeof window === "undefined") return;

  const kick = () => {
    loadTracker().then((t) => {
      if (!t) return;
      t.start();
      for (const [name, payload] of _queue.splice(0)) t.event(name, payload);
    });
  };

  const ric = (window as unknown as {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void;
  }).requestIdleCallback;
  if (typeof ric === "function") {
    ric(kick, { timeout: 3000 });
  } else {
    window.setTimeout(kick, 1500);
  }
}

export function trackEvent(
  name: string,
  payload?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  if (_tracker) {
    _tracker.event(name, payload);
    return;
  }
  _queue.push([name, payload]);
}

export function setUserID(id: string): void {
  if (_tracker) {
    _tracker.setUserID(id);
    return;
  }
  loadTracker().then((t) => t?.setUserID(id));
}

export function setMetadata(key: string, value: string): void {
  if (_tracker) {
    _tracker.setMetadata(key, value);
    return;
  }
  loadTracker().then((t) => t?.setMetadata(key, value));
}
