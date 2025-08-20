"use client";

import { useEffect } from "react";

export function HydrationSuppressor({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress hydration warnings for browser extension attributes
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Warning: Text content did not match') &&
        args[0].includes('data-gr-ext-installed')
      ) {
        return;
      }
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Warning: Expected server HTML to contain') &&
        args[0].includes('data-new-gr-c-s-check-loaded')
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return <>{children}</>;
}
