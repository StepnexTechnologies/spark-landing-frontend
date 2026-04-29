"use client";

import { useEffect } from "react";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "dwiqlxestpk";

export default function ClarityInit() {
  useEffect(() => {
    import("@microsoft/clarity").then(({ default: Clarity }) => {
      Clarity.init(PROJECT_ID);
    });
  }, []);
  return null;
}
