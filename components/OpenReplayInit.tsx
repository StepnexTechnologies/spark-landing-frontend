"use client";
import { useEffect } from "react";
import { initOpenReplay } from "@/lib/openreplay";

export default function OpenReplayInit() {
  useEffect(() => {
    initOpenReplay();
  }, []);
  return null;
}
