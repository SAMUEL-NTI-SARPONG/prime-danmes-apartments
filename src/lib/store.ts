"use client";

import { create } from "zustand";
import { type Apartment } from "./data";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked-in"
  | "completed"
  | "cancelled";

export type LeaseDuration = "6 Months" | "1 Year" | "2 Years" | "3 Years";

export interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ghanaCard: string;
  apartment: string;
  apartmentId: string;
  moveInDate: string;
  leaseDuration: string;
  occupants: string;
  employer: string;
  emergencyName: string;
  emergencyPhone: string;
  notes: string;
  status: BookingStatus;
  amount: number;
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string;
  apartment: string;
  apartmentId: string;
  issue: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved";
  reportedDate: string;
}

interface ApartmentStore {
  apartments: Apartment[];
  bookings: Booking[];
  maintenance: MaintenanceRequest[];
  apartmentsLoaded: boolean;
  loadingApartments: boolean;
  bookingsLoaded: boolean;
  maintenanceLoaded: boolean;

  // Apartment CRUD (API-backed)
  fetchApartments: () => Promise<void>;
  addApartment: (
    apartment: Omit<Apartment, "id"> & { id?: string },
  ) => Promise<Apartment | null>;
  removeApartment: (id: string) => Promise<void>;
  updateApartment: (id: string, updates: Partial<Apartment>) => Promise<void>;

  // Booking actions (API-backed)
  fetchBookings: () => Promise<void>;
  addBooking: (
    booking: Omit<Booking, "id" | "createdAt">,
  ) => Promise<Booking | null>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  removeBooking: (id: string) => Promise<void>;

  // Maintenance actions (API-backed)
  fetchMaintenance: () => Promise<void>;
  addMaintenance: (
    request: Omit<MaintenanceRequest, "id">,
  ) => Promise<MaintenanceRequest | null>;
  updateMaintenanceStatus: (
    id: string,
    status: "open" | "in-progress" | "resolved",
  ) => Promise<void>;
  removeMaintenance: (id: string) => Promise<void>;
}

export const useApartmentStore = create<ApartmentStore>((set, get) => ({
  apartments: [],
  bookings: [],
  maintenance: [],
  apartmentsLoaded: false,
  loadingApartments: false,
  bookingsLoaded: false,
  maintenanceLoaded: false,

  // Apartment CRUD — API-backed
  fetchApartments: async () => {
    if (get().loadingApartments) return; // prevent concurrent fetches
    set({ loadingApartments: true });
    try {
      const res = await fetch("/api/apartments");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Apartment[] = await res.json();
      set({ apartments: data, apartmentsLoaded: true, loadingApartments: false });
    } catch {
      // apartmentsLoaded stays false so StoreInitializer can retry
      set({ loadingApartments: false });
    }
  },

  addApartment: async (apartment) => {
    try {
      const res = await fetch("/api/apartments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apartment),
      });
      if (!res.ok) return null;
      const created: Apartment = await res.json();
      set((state) => ({ apartments: [...state.apartments, created] }));
      return created;
    } catch {
      return null;
    }
  },

  removeApartment: async (id) => {
    const prev = get().apartments;
    set((state) => ({
      apartments: state.apartments.filter((a) => a.id !== id),
    }));
    try {
      await fetch(`/api/apartments/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {
      set({ apartments: prev });
    }
  },

  updateApartment: async (id, updates) => {
    const prev = get().apartments;
    set((state) => ({
      apartments: state.apartments.map((a) =>
        a.id === id ? { ...a, ...updates } : a,
      ),
    }));
    try {
      await fetch(`/api/apartments/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch {
      set({ apartments: prev });
    }
  },

  // Booking actions — API-backed
  fetchBookings: async () => {
    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) return;
      const data = await res.json();
      const bookings: Booking[] = data.map((b: Record<string, unknown>) => ({
        ...b,
        createdAt:
          typeof b.createdAt === "string"
            ? b.createdAt.slice(0, 10)
            : new Date(b.createdAt as string).toISOString().slice(0, 10),
      }));
      set({ bookings, bookingsLoaded: true });
    } catch {
      // silently fail — bookings will be empty
    }
  },

  addBooking: async (booking) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      if (!res.ok) return null;
      const created = await res.json();
      const mapped: Booking = {
        ...created,
        createdAt: new Date(created.createdAt).toISOString().slice(0, 10),
      };
      set((state) => ({ bookings: [mapped, ...state.bookings] }));
      return mapped;
    } catch {
      return null;
    }
  },

  updateBookingStatus: async (id, status) => {
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
    }));
    try {
      await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      // rollback silently
    }
  },

  removeBooking: async (id) => {
    const prev = get().bookings;
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    }));
    try {
      await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {
      set({ bookings: prev });
    }
  },

  // Maintenance actions — API-backed
  fetchMaintenance: async () => {
    try {
      const res = await fetch("/api/maintenance");
      if (!res.ok) return;
      const data: MaintenanceRequest[] = await res.json();
      set({ maintenance: data, maintenanceLoaded: true });
    } catch {
      // silently fail
    }
  },

  addMaintenance: async (request) => {
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      if (!res.ok) return null;
      const created: MaintenanceRequest = await res.json();
      set((state) => ({ maintenance: [created, ...state.maintenance] }));
      return created;
    } catch {
      return null;
    }
  },

  updateMaintenanceStatus: async (id, status) => {
    set((state) => ({
      maintenance: state.maintenance.map((m) =>
        m.id === id ? { ...m, status } : m,
      ),
    }));
    try {
      await fetch(`/api/maintenance/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      // rollback silently
    }
  },

  removeMaintenance: async (id) => {
    const prev = get().maintenance;
    set((state) => ({
      maintenance: state.maintenance.filter((m) => m.id !== id),
    }));
    try {
      await fetch(`/api/maintenance/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {
      set({ maintenance: prev });
    }
  },
}));
