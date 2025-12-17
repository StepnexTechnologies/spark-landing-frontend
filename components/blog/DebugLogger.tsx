"use client";

import { useEffect } from "react";

interface DebugLoggerProps {
  data: unknown;
  label?: string;
}

export default function DebugLogger({ data, label = "Debug Data" }: DebugLoggerProps) {
  useEffect(() => {
    console.log(label, data);
  }, [data, label]);

  return null;
}
