"use client";

import { useEffect, useState } from 'react';
import '@/lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR or initial hydration, render children directly
  // i18n will be initialized on the client
  if (!isClient) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

export default I18nProvider;
