"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

// framer-motion's `motion` component eagerly bundles every animation feature
// into whatever chunk imports it. On /creator/earn that put the full ~136 KiB
// framer-motion build on the critical hydration path — Lighthouse attributed
// 1,899 ms of mobile main-thread time to that chunk, the single largest script
// on the page.
//
// LazyMotion + `m` ships only the tiny component shell up front and streams the
// feature bundle in afterwards, so hydration no longer pays for it. Every
// component under components/creator/** uses `m.*` instead of `motion.*`; a
// single stray `motion.*` import anywhere in the route graph would pull the
// eager bundle back in and undo this.
//
// `domMax` rather than `domAnimation` because PromoSignupCard animates the
// `layout` prop, which needs layout projection. `strict` is deliberately NOT
// enabled: it throws on any missed `motion.*`, and a crash in a rarely-rendered
// branch is a worse failure mode than silently losing the size win.
const loadFeatures = () => import("framer-motion").then((mod) => mod.domMax);

export default function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
