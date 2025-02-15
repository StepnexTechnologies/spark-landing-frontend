"use client";

import type React from "react";
import { cn } from "@/lib/utils";

export const AuroraBackground = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "fixed inset-0 min-h-screen w-full overflow-hidden",
        containerClassName
      )}
    >
      <div
        className={cn(
          "absolute inset-0 -z-10 h-full w-full bg-black",
          "before:fixed before:inset-0 before:bg-[linear-gradient(to_right,transparent_0%,rgba(168,85,247,0.2)_20%,rgba(168,85,247,0.3)_50%,rgba(168,85,247,0.2)_80%,transparent_100%)] before:animate-aurora",
          "after:fixed after:inset-0 after:bg-[linear-gradient(to_right,transparent_0%,rgba(139,92,246,0.2)_20%,rgba(139,92,246,0.3)_50%,rgba(139,92,246,0.2)_80%,transparent_100%)] after:animate-aurora-delayed",
          className
        )}
      />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
};
