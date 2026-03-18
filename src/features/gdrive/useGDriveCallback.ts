import { useEffect, useRef } from "react";

import { handleCallback } from "./auth";

/**
 * Detects and handles the OAuth redirect callback on first mount.
 * Must be called once near the app root.
 */
export function useGDriveCallback() {
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    if (window.location.search.includes("code=")) {
      handleCallback().catch(console.error);
    }
  }, []);
}
