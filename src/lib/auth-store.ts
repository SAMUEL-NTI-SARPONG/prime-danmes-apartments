"use client";

import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;
  loginAttempts: number;
  lastAttempt: number;
  login: (passkey: string) => boolean;
  logout: () => void;
}

// The admin passkey — change this to your own secret
const ADMIN_PASSKEY = "danmes2026#admin";

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  loginAttempts: 0,
  lastAttempt: 0,

  login: (passkey: string) => {
    const state = get();
    const now = Date.now();

    // Rate limiting: lock out for 60 seconds after 5 failed attempts
    if (state.loginAttempts >= 5 && now - state.lastAttempt < 60_000) {
      return false;
    }

    // Reset attempts if cooldown has passed
    if (now - state.lastAttempt >= 60_000) {
      set({ loginAttempts: 0 });
    }

    if (passkey === ADMIN_PASSKEY) {
      set({ isAuthenticated: true, loginAttempts: 0 });
      return true;
    }

    set({ loginAttempts: state.loginAttempts + 1, lastAttempt: now });
    return false;
  },

  logout: () => set({ isAuthenticated: false }),
}));
