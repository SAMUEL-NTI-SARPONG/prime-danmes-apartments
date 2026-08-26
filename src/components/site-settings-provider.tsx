"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  defaultSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";

const SiteSettingsContext = createContext<SiteSettings>(defaultSiteSettings);

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings: SiteSettings;
}) {
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    const refreshSettings = () => {
      void fetch("/api/site-settings", { cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json() as Promise<SiteSettings>;
        })
        .then(setSettings)
        .catch(() => undefined);
    };

    window.addEventListener("focus", refreshSettings);
    return () => window.removeEventListener("focus", refreshSettings);
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
