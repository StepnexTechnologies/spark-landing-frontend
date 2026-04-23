"use client";

import { useEffect, useState } from "react";

const FORCE_CREATOR_WEEK = false;

export function useIsCreatorWeek(): boolean {
  const [isCreatorWeek, setIsCreatorWeek] = useState(false);

  useEffect(() => {
    if (FORCE_CREATOR_WEEK) {
      setIsCreatorWeek(true);
      return;
    }
    const now = new Date();
    const start = new Date(2026, 3, 20);
    const end = new Date(2026, 3, 28);
    setIsCreatorWeek(now >= start && now < end);
  }, []);

  return isCreatorWeek;
}
