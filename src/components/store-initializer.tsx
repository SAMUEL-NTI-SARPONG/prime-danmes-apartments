"use client";

import { useEffect } from "react";
import { useApartmentStore } from "@/lib/store";

export default function StoreInitializer() {
  const fetchApartments = useApartmentStore((s) => s.fetchApartments);

  useEffect(() => {
    let cancelled = false;
    let retries = 0;

    const attempt = async () => {
      if (cancelled || retries > 4) return;
      retries++;
      await fetchApartments();
      if (cancelled) return;
      // If still not loaded after fetch, retry after 2s
      if (!useApartmentStore.getState().apartmentsLoaded && retries <= 4) {
        setTimeout(attempt, 2000);
      }
    };

    attempt();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
