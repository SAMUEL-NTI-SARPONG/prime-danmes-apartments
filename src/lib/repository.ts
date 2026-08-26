import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { apartments as seedApartments, type Apartment } from "./data";
import { bookingRef, cuid, ensureTables, sql } from "./db";
import {
  defaultSiteSettings,
  type SiteSettings,
} from "./site-settings";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked-in"
  | "completed"
  | "cancelled";

export interface BookingRecord {
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

export interface MaintenanceRecord {
  id: string;
  apartment: string;
  apartmentId: string;
  issue: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved";
  reportedDate: string;
  createdAt?: string;
}

export interface ContactRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface LocalState {
  apartments: Apartment[];
  bookings: BookingRecord[];
  maintenance: MaintenanceRecord[];
  contactMessages: ContactRecord[];
  siteSettings: SiteSettings;
}

const localDataDir = path.join(process.cwd(), ".data");
const localDataPath = path.join(localDataDir, "dev-db.json");
let localInitialization: Promise<void> | null = null;
let localMutationQueue: Promise<void> = Promise.resolve();

function shouldUseLocalDatabase() {
  if (process.env.DATABASE_URL) return false;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL is required in production. Create a free Neon database and add its connection string to the deployment environment.",
    );
  }
  return true;
}

async function initializeLocalDatabase() {
  if (!localInitialization) {
    localInitialization = (async () => {
      await mkdir(localDataDir, { recursive: true });
      try {
        await readFile(localDataPath, "utf8");
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        const initialState: LocalState = {
          apartments: structuredClone(seedApartments),
          bookings: [],
          maintenance: [],
          contactMessages: [],
          siteSettings: defaultSiteSettings,
        };
        await writeFile(localDataPath, JSON.stringify(initialState, null, 2));
      }
    })();
  }
  await localInitialization;
}

async function readLocalState(): Promise<LocalState> {
  await initializeLocalDatabase();
  const stored = JSON.parse(
    await readFile(localDataPath, "utf8"),
  ) as Partial<LocalState>;
  return {
    apartments: stored.apartments || structuredClone(seedApartments),
    bookings: stored.bookings || [],
    maintenance: stored.maintenance || [],
    contactMessages: stored.contactMessages || [],
    siteSettings: {
      ...defaultSiteSettings,
      ...(stored.siteSettings || {}),
    },
  };
}

async function writeLocalState(state: LocalState) {
  const temporaryPath = `${localDataPath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(state, null, 2));
  await rename(temporaryPath, localDataPath);
}

async function mutateLocalState<T>(
  mutation: (state: LocalState) => T | Promise<T>,
): Promise<T> {
  let result!: T;
  const operation = localMutationQueue.then(async () => {
    const state = await readLocalState();
    result = await mutation(state);
    await writeLocalState(state);
  });
  localMutationQueue = operation.catch(() => undefined);
  await operation;
  return result;
}

function normalizeArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeApartment(row: Record<string, unknown>): Apartment {
  return {
    ...(row as unknown as Apartment),
    price: Number(row.price || 0),
    images: normalizeArray(row.images),
    features: normalizeArray(row.features),
  };
}

function normalizeBooking(row: Record<string, unknown>): BookingRecord {
  return {
    ...(row as unknown as BookingRecord),
    amount: Number(row.amount || 0),
    createdAt: new Date(String(row.createdAt)).toISOString(),
  };
}

export async function listApartments(): Promise<Apartment[]> {
  if (shouldUseLocalDatabase()) {
    const state = await readLocalState();
    return state.apartments.toSorted((a, b) => a.name.localeCompare(b.name));
  }
  await ensureTables();
  const rows = await sql`SELECT * FROM "Apartment" ORDER BY name ASC`;
  return rows.map((row) => normalizeApartment(row));
}

export async function createApartment(
  input: Omit<Apartment, "id"> & { id?: string },
): Promise<Apartment> {
  const apartment: Apartment = {
    ...input,
    id: input.id || cuid(),
    images: input.images || [],
    features: input.features || [],
  };
  if (shouldUseLocalDatabase()) {
    return mutateLocalState((state) => {
      state.apartments.push(apartment);
      return apartment;
    });
  }
  await ensureTables();
  const [row] = await sql`
    INSERT INTO "Apartment" (
      id, name, type, price, "pricePeriod", "showPrice", image, images,
      beds, baths, sqft, floor, description, features, available, featured
    ) VALUES (
      ${apartment.id}, ${apartment.name}, ${apartment.type}, ${apartment.price},
      ${apartment.pricePeriod}, ${apartment.showPrice}, ${apartment.image},
      ${JSON.stringify(apartment.images)}, ${apartment.beds}, ${apartment.baths},
      ${apartment.sqft}, ${apartment.floor}, ${apartment.description},
      ${JSON.stringify(apartment.features)}, ${apartment.available},
      ${apartment.featured}
    ) RETURNING *
  `;
  return normalizeApartment(row);
}

export async function updateApartmentRecord(
  id: string,
  updates: Partial<Apartment>,
): Promise<Apartment | null> {
  if (shouldUseLocalDatabase()) {
    return mutateLocalState((state) => {
      const index = state.apartments.findIndex((item) => item.id === id);
      if (index < 0) return null;
      state.apartments[index] = { ...state.apartments[index], ...updates, id };
      return state.apartments[index];
    });
  }
  await ensureTables();
  const [existing] = await sql`SELECT * FROM "Apartment" WHERE id = ${id}`;
  if (!existing) return null;
  const current = normalizeApartment(existing);
  const merged = { ...current, ...updates, id };
  const [row] = await sql`
    UPDATE "Apartment" SET
      name = ${merged.name}, type = ${merged.type}, price = ${merged.price},
      "pricePeriod" = ${merged.pricePeriod}, "showPrice" = ${merged.showPrice},
      image = ${merged.image}, images = ${JSON.stringify(merged.images)},
      beds = ${merged.beds}, baths = ${merged.baths}, sqft = ${merged.sqft},
      floor = ${merged.floor}, description = ${merged.description},
      features = ${JSON.stringify(merged.features)},
      available = ${merged.available}, featured = ${merged.featured}
    WHERE id = ${id}
    RETURNING *
  `;
  return normalizeApartment(row);
}

export async function deleteApartmentRecord(id: string): Promise<boolean> {
  if (shouldUseLocalDatabase()) {
    return mutateLocalState((state) => {
      const before = state.apartments.length;
      state.apartments = state.apartments.filter((item) => item.id !== id);
      return state.apartments.length < before;
    });
  }
  await ensureTables();
  const rows = await sql`DELETE FROM "Apartment" WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function listBookings(): Promise<BookingRecord[]> {
  if (shouldUseLocalDatabase()) {
    const state = await readLocalState();
    return state.bookings.toSorted((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }
  await ensureTables();
  const rows = await sql`SELECT * FROM "Booking" ORDER BY "createdAt" DESC`;
  return rows.map((row) => normalizeBooking(row));
}

export async function getBooking(id: string): Promise<BookingRecord | null> {
  if (shouldUseLocalDatabase()) {
    const state = await readLocalState();
    return state.bookings.find((item) => item.id === id) || null;
  }
  await ensureTables();
  const [row] = await sql`SELECT * FROM "Booking" WHERE id = ${id}`;
  return row ? normalizeBooking(row) : null;
}

export async function createBookingRecord(
  input: Omit<BookingRecord, "id" | "createdAt" | "status">,
): Promise<BookingRecord> {
  const booking: BookingRecord = {
    ...input,
    id: bookingRef(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  if (shouldUseLocalDatabase()) {
    return mutateLocalState((state) => {
      state.bookings.unshift(booking);
      return booking;
    });
  }
  await ensureTables();
  const [row] = await sql`
    INSERT INTO "Booking" (
      id, "firstName", "lastName", email, phone, "ghanaCard", apartment,
      "apartmentId", "moveInDate", "leaseDuration", occupants, employer,
      "emergencyName", "emergencyPhone", notes, status, amount
    ) VALUES (
      ${booking.id}, ${booking.firstName}, ${booking.lastName}, ${booking.email},
      ${booking.phone}, ${booking.ghanaCard}, ${booking.apartment},
      ${booking.apartmentId}, ${booking.moveInDate}, ${booking.leaseDuration},
      ${booking.occupants}, ${booking.employer}, ${booking.emergencyName},
      ${booking.emergencyPhone}, ${booking.notes}, 'pending', ${booking.amount}
    ) RETURNING *
  `;
  return normalizeBooking(row);
}

export async function updateBookingStatusRecord(
  id: string,
  status: BookingStatus,
): Promise<BookingRecord | null> {
  if (shouldUseLocalDatabase()) {
    return mutateLocalState((state) => {
      const booking = state.bookings.find((item) => item.id === id);
      if (!booking) return null;
      booking.status = status;
      return booking;
    });
  }
  await ensureTables();
  const [row] = await sql`
    UPDATE "Booking" SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  return row ? normalizeBooking(row) : null;
}

export async function deleteBookingRecord(id: string): Promise<boolean> {
  if (shouldUseLocalDatabase()) {
    return mutateLocalState((state) => {
      const before = state.bookings.length;
      state.bookings = state.bookings.filter((item) => item.id !== id);
      return state.bookings.length < before;
    });
  }
  await ensureTables();
  const rows = await sql`DELETE FROM "Booking" WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function listMaintenance(): Promise<MaintenanceRecord[]> {
  if (shouldUseLocalDatabase()) {
    const state = await readLocalState();
    return state.maintenance.toSorted((a, b) =>
      String(b.createdAt || b.reportedDate).localeCompare(
        String(a.createdAt || a.reportedDate),
      ),
    );
  }
  await ensureTables();
  const rows = await sql`SELECT * FROM "Maintenance" ORDER BY "createdAt" DESC`;
  return rows as unknown as MaintenanceRecord[];
}

export async function createMaintenanceRecord(
  input: Omit<MaintenanceRecord, "id" | "createdAt" | "status">,
): Promise<MaintenanceRecord> {
  const record: MaintenanceRecord = {
    ...input,
    id: cuid(),
    status: "open",
    createdAt: new Date().toISOString(),
  };
  if (shouldUseLocalDatabase()) {
    return mutateLocalState((state) => {
      state.maintenance.unshift(record);
      return record;
    });
  }
  await ensureTables();
  const [row] = await sql`
    INSERT INTO "Maintenance" (
      id, apartment, "apartmentId", issue, priority, status, "reportedDate"
    ) VALUES (
      ${record.id}, ${record.apartment}, ${record.apartmentId}, ${record.issue},
      ${record.priority}, 'open', ${record.reportedDate}
    ) RETURNING *
  `;
  return row as unknown as MaintenanceRecord;
}

export async function updateMaintenanceStatusRecord(
  id: string,
  status: MaintenanceRecord["status"],
): Promise<MaintenanceRecord | null> {
  if (shouldUseLocalDatabase()) {
    return mutateLocalState((state) => {
      const record = state.maintenance.find((item) => item.id === id);
      if (!record) return null;
      record.status = status;
      return record;
    });
  }
  await ensureTables();
  const [row] = await sql`
    UPDATE "Maintenance" SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  return (row as unknown as MaintenanceRecord) || null;
}

export async function deleteMaintenanceRecord(id: string): Promise<boolean> {
  if (shouldUseLocalDatabase()) {
    return mutateLocalState((state) => {
      const before = state.maintenance.length;
      state.maintenance = state.maintenance.filter((item) => item.id !== id);
      return state.maintenance.length < before;
    });
  }
  await ensureTables();
  const rows =
    await sql`DELETE FROM "Maintenance" WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function createContactRecord(
  input: Omit<ContactRecord, "id" | "createdAt">,
): Promise<ContactRecord> {
  const record: ContactRecord = {
    ...input,
    id: cuid(),
    createdAt: new Date().toISOString(),
  };
  if (shouldUseLocalDatabase()) {
    return mutateLocalState((state) => {
      state.contactMessages.unshift(record);
      return record;
    });
  }
  await ensureTables();
  await sql`
    INSERT INTO "ContactMessage" (
      id, "firstName", "lastName", email, phone, subject, message
    ) VALUES (
      ${record.id}, ${record.firstName}, ${record.lastName}, ${record.email},
      ${record.phone}, ${record.subject}, ${record.message}
    )
  `;
  return record;
}

export async function listContactRecords(): Promise<ContactRecord[]> {
  if (shouldUseLocalDatabase()) {
    const state = await readLocalState();
    return state.contactMessages.toSorted((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }
  await ensureTables();
  const rows =
    await sql`SELECT * FROM "ContactMessage" ORDER BY "createdAt" DESC`;
  return rows as unknown as ContactRecord[];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (shouldUseLocalDatabase()) {
    const state = await readLocalState();
    return state.siteSettings;
  }
  await ensureTables();
  const [row] = await sql`
    SELECT data FROM "SiteSettings" WHERE id = 'primary'
  `;
  if (!row) return defaultSiteSettings;
  const data =
    typeof row.data === "string" ? JSON.parse(row.data) : row.data;
  return {
    ...defaultSiteSettings,
    ...(data as Partial<SiteSettings>),
  };
}

export async function updateSiteSettings(
  updates: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const settings = {
    ...(await getSiteSettings()),
    ...updates,
  };
  if (shouldUseLocalDatabase()) {
    return mutateLocalState((state) => {
      state.siteSettings = settings;
      return settings;
    });
  }
  await ensureTables();
  await sql`
    INSERT INTO "SiteSettings" (id, data, "updatedAt")
    VALUES ('primary', ${JSON.stringify(settings)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE
    SET data = EXCLUDED.data, "updatedAt" = now()
  `;
  return settings;
}
