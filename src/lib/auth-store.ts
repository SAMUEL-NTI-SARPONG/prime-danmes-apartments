"use client";

import { create } from "zustand";

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  isChecking: boolean;
  checkSession: () => Promise<void>;
  login: (passkey: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isChecking: true,

  checkSession: async () => {
    try {
      const response = await fetch("/api/admin/session", { cache: "no-store" });
      const data = response.ok ? await response.json() : null;
      set({ isAuthenticated: Boolean(data?.authenticated), isChecking: false });
    } catch {
      set({ isAuthenticated: false, isChecking: false });
    }
  },

  login: async (passkey) => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        set({ isAuthenticated: false, isChecking: false });
        return { success: false, error: data.error || "Unable to sign in." };
      }
      set({ isAuthenticated: true, isChecking: false });
      return { success: true };
    } catch {
      return {
        success: false,
        error: "Unable to reach the server. Please try again.",
      };
    }
  },

  logout: async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      set({ isAuthenticated: false, isChecking: false });
    }
  },
}));
