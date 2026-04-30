"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Building2,
  CalendarDays,
  Wrench,
  Star,
  Plus,
  Pencil,
  Trash2,
  Search,
  Save,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  X,
  ImagePlus,
  Upload,
  ChevronRight,
  User,
  Briefcase,
  FileText,
  CreditCard,
} from "lucide-react";
import { useApartmentStore } from "@/lib/store";
import type { Booking, BookingStatus, MaintenanceRequest } from "@/lib/store";
import type { Apartment, PricePeriod } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import emailjs from "@emailjs/browser";

// ─── Toast Notification ──────────────────────────────────
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-100 flex items-center gap-3 rounded-xl px-5 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-4 fade-in duration-300 ${
        type === "success"
          ? "bg-emerald-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
      ) : (
        <XCircle className="h-4.5 w-4.5 shrink-0" />
      )}
      {message}
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), 3500);
  };

  const ToastUI = toast ? (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { showToast, ToastUI };
}

// ─── Type helper ──────────────────────────────────────
const apartmentTypes = ["1-bedroom", "2-bedroom", "3-bedroom"] as const;

const pricePeriods: PricePeriod[] = [
  "per day",
  "per week",
  "per month",
  "per year",
];

const bookingStatuses: BookingStatus[] = [
  "pending",
  "confirmed",
  "checked-in",
  "completed",
  "cancelled",
];

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  "checked-in": "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-100 text-red-800",
};

const priorityColors: Record<string, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const maintenanceStatusColors: Record<string, string> = {
  open: "bg-red-100 text-red-800",
  "in-progress": "bg-amber-100 text-amber-800",
  resolved: "bg-emerald-100 text-emerald-800",
};

// ─── Empty apartment template ──────────────────────────────────────
function createEmptyApartment(): Apartment {
  return {
    id: `apt-${Date.now()}`,
    name: "",
    type: "1-bedroom",
    price: 0,
    pricePeriod: "per month",
    showPrice: false,
    image: "",
    images: [],
    beds: 1,
    baths: 1,
    sqft: 0,
    floor: 1,
    description: "",
    features: [],
    available: true,
    featured: false,
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AdminPage() {
  const { showToast, ToastUI } = useToast();

  const apartments = useApartmentStore((s) => s.apartments);
  const bookings = useApartmentStore((s) => s.bookings);
  const maintenance = useApartmentStore((s) => s.maintenance);

  const addApartment = useApartmentStore((s) => s.addApartment);
  const removeApartment = useApartmentStore((s) => s.removeApartment);
  const updateApartment = useApartmentStore((s) => s.updateApartment);
  const fetchApartments = useApartmentStore((s) => s.fetchApartments);
  const apartmentsLoaded = useApartmentStore((s) => s.apartmentsLoaded);

  const fetchBookings = useApartmentStore((s) => s.fetchBookings);
  const bookingsLoaded = useApartmentStore((s) => s.bookingsLoaded);
  const updateBookingStatus = useApartmentStore((s) => s.updateBookingStatus);
  const removeBooking = useApartmentStore((s) => s.removeBooking);

  const addMaintenance = useApartmentStore((s) => s.addMaintenance);
  const fetchMaintenance = useApartmentStore((s) => s.fetchMaintenance);
  const maintenanceLoaded = useApartmentStore((s) => s.maintenanceLoaded);
  const updateMaintenanceStatus = useApartmentStore(
    (s) => s.updateMaintenanceStatus,
  );
  const removeMaintenance = useApartmentStore((s) => s.removeMaintenance);

  useEffect(() => {
    if (!apartmentsLoaded) fetchApartments();
    if (!bookingsLoaded) fetchBookings();
    if (!maintenanceLoaded) fetchMaintenance();
  }, [
    apartmentsLoaded,
    fetchApartments,
    bookingsLoaded,
    fetchBookings,
    maintenanceLoaded,
    fetchMaintenance,
  ]);

  // Stats
  const occupiedCount = apartments.filter((a) => !a.available).length;
  const featuredCount = apartments.filter((a) => a.featured).length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      {ToastUI}

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={Building2}
          label="Total Units"
          value={apartments.length}
          sub={`${occupiedCount} occupied`}
        />
        <StatCard
          icon={CalendarDays}
          label="Pending Bookings"
          value={pendingBookings}
          sub={`${bookings.length} total`}
        />
        <StatCard
          icon={Star}
          label="Featured"
          value={featuredCount}
          sub="apartments"
        />
        <StatCard
          icon={Wrench}
          label="Open Issues"
          value={maintenance.filter((m) => m.status !== "resolved").length}
          sub={`${maintenance.length} total`}
        />
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="listings">
        <TabsList variant="line">
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-4">
          <ListingsTab
            apartments={apartments}
            addApartment={addApartment}
            removeApartment={removeApartment}
            updateApartment={updateApartment}
            showToast={showToast}
          />
        </TabsContent>

        <TabsContent value="bookings" className="mt-4">
          <BookingsTab
            bookings={bookings}
            apartments={apartments}
            updateBookingStatus={updateBookingStatus}
            removeBooking={removeBooking}
            showToast={showToast}
          />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          <MaintenanceTab
            maintenance={maintenance}
            apartments={apartments}
            addMaintenance={addMaintenance}
            updateMaintenanceStatus={updateMaintenanceStatus}
            removeMaintenance={removeMaintenance}
            showToast={showToast}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-11 sm:w-11 sm:rounded-xl">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xl font-bold tracking-tight sm:text-2xl">
            {value}
          </p>
          <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
            {label} &middot; {sub}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// LISTINGS TAB
// ═══════════════════════════════════════════════════════════════
function ListingsTab({
  apartments,
  addApartment,
  removeApartment,
  updateApartment,
  showToast,
}: {
  apartments: Apartment[];
  addApartment: (a: Apartment) => void;
  removeApartment: (id: string) => void;
  updateApartment: (id: string, u: Partial<Apartment>) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editApt, setEditApt] = useState<Apartment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = apartments.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search apartments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger
            render={
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" /> Add Apartment
              </Button>
            }
          />
          <ApartmentFormDialog
            mode="add"
            onSave={(apt) => {
              addApartment(apt);
              setAddOpen(false);
              showToast("Apartment added successfully");
            }}
            onCancel={() => setAddOpen(false)}
            showToast={showToast}
          />
        </Dialog>
      </div>

      {/* Apartment Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((apt) => (
          <ApartmentAdminCard
            key={apt.id}
            apartment={apt}
            onEdit={() => setEditApt({ ...apt })}
            onDelete={() => setDeleteId(apt.id)}
            onToggleAvailability={() => {
              updateApartment(apt.id, { available: !apt.available });
              showToast(
                `${apt.name} marked as ${!apt.available ? "available" : "unavailable"}`,
              );
            }}
            onToggleFeatured={() => {
              updateApartment(apt.id, { featured: !apt.featured });
              showToast(
                `${apt.name} ${!apt.featured ? "added to" : "removed from"} featured`,
              );
            }}
            onToggleShowPrice={() => {
              updateApartment(apt.id, { showPrice: !apt.showPrice });
              showToast(
                `${apt.name} price ${!apt.showPrice ? "visible" : "hidden"} on public site`,
              );
            }}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No apartments found.
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editApt} onOpenChange={(o) => !o && setEditApt(null)}>
        {editApt && (
          <ApartmentFormDialog
            mode="edit"
            initial={editApt}
            onSave={(updated) => {
              updateApartment(updated.id, updated);
              setEditApt(null);
              showToast(`${updated.name} updated successfully`);
            }}
            onCancel={() => setEditApt(null)}
            showToast={showToast}
          />
        )}
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Apartment</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this apartment? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" size="sm" />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (deleteId) {
                  removeApartment(deleteId);
                  showToast("Apartment deleted");
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Apartment admin card ────────────────────────
function ApartmentAdminCard({
  apartment: apt,
  onEdit,
  onDelete,
  onToggleAvailability,
  onToggleFeatured,
  onToggleShowPrice,
}: {
  apartment: Apartment;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
  onToggleFeatured: () => void;
  onToggleShowPrice: () => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40">
        <Image
          src={apt.image || "/placeholder.jpg"}
          alt={apt.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-2 right-2 flex gap-1.5">
          {apt.featured && (
            <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-semibold text-white">
              Featured
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white ${
              apt.available ? "bg-emerald-500" : "bg-red-500"
            }`}
          >
            {apt.available ? "Available" : "Occupied"}
          </span>
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-sm leading-tight">{apt.name}</h3>
          <p className="text-xs text-muted-foreground capitalize">
            {apt.type} &middot; Floor {apt.floor}
          </p>
        </div>
        {apt.showPrice && apt.price > 0 ? (
          <div className="flex items-baseline gap-1 text-sm">
            <span className="font-bold text-primary">
              GHS {apt.price.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              /{apt.pricePeriod.replace("per ", "")}
            </span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">Price hidden</p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            {apt.beds} bed{apt.beds !== 1 ? "s" : ""}
          </span>
          <span>
            {apt.baths} bath{apt.baths !== 1 ? "s" : ""}
          </span>
          <span>{apt.sqft} sqft</span>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 border-t">
          <div className="flex items-center gap-2">
            <Switch
              checked={apt.available}
              onCheckedChange={onToggleAvailability}
            />
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={apt.featured} onCheckedChange={onToggleFeatured} />
            <span className="text-xs text-muted-foreground">Featured</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={apt.showPrice}
              onCheckedChange={onToggleShowPrice}
            />
            <span className="text-xs text-muted-foreground">Show Price</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onEdit}
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Apartment form dialog (add / edit) ──────────
function ApartmentFormDialog({
  mode,
  initial,
  onSave,
  onCancel,
  showToast,
}: {
  mode: "add" | "edit";
  initial?: Apartment;
  onSave: (apt: Apartment) => void;
  onCancel: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const [form, setForm] = useState<Apartment>(
    initial ?? createEmptyApartment(),
  );
  const [featureInput, setFeatureInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (updates: Partial<Apartment>) =>
    setForm((prev) => ({ ...prev, ...updates }));

  const addFeature = () => {
    const f = featureInput.trim();
    if (f && !form.features.includes(f)) {
      set({ features: [...form.features, f] });
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) =>
    set({ features: form.features.filter((_, i) => i !== idx) });

  const addImage = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(
          data.error ?? `Upload failed (${res.status}). Check your connection and try again.`,
          "error",
        );
        setUploading(false);
        return;
      }
      const { url } = await res.json();
      set({
        images: [...form.images, url],
        image: form.image || url,
      });
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Image upload failed. Please try again.",
        "error",
      );
    }
    setUploading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => addImage(file));
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    const newImages = form.images.filter((_, i) => i !== idx);
    set({
      images: newImages,
      image: newImages[0] || "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {mode === "add" ? "Add New Apartment" : `Edit: ${form.name}`}
        </DialogTitle>
        <DialogDescription>
          {mode === "add"
            ? "Fill in the details for the new apartment."
            : "Update the apartment details below."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="apt-name">Name *</Label>
          <Input
            id="apt-name"
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="e.g. Ocean Breeze Studio"
            required
          />
        </div>

        {/* Type + Floor */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => set({ type: v as Apartment["type"] })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {apartmentTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="apt-floor">Floor</Label>
            <Input
              id="apt-floor"
              type="number"
              min={1}
              value={form.floor}
              onChange={(e) => set({ floor: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Price + Period */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="apt-price">Price (GHS)</Label>
            <Input
              id="apt-price"
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => set({ price: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label>Payment Period</Label>
            <Select
              value={form.pricePeriod}
              onValueChange={(v) => set({ pricePeriod: v as PricePeriod })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pricePeriods.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Beds, Baths, Sqft */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="apt-beds">Beds</Label>
            <Input
              id="apt-beds"
              type="number"
              min={0}
              value={form.beds}
              onChange={(e) => set({ beds: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="apt-baths">Baths</Label>
            <Input
              id="apt-baths"
              type="number"
              min={0}
              value={form.baths}
              onChange={(e) => set({ baths: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="apt-sqft">Sqft</Label>
            <Input
              id="apt-sqft"
              type="number"
              min={0}
              value={form.sqft}
              onChange={(e) => set({ sqft: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="apt-desc">Description</Label>
          <Textarea
            id="apt-desc"
            rows={3}
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Describe the apartment..."
          />
        </div>

        {/* Features */}
        <div>
          <Label>Features</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add a feature..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFeature}
            >
              Add
            </Button>
          </div>
          {form.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.features.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs"
                >
                  {f}
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div>
          <Label>Images</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="mt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="mr-1.5 h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload Images
                </>
              )}
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">
              Max 5 MB per image. JPEG, PNG, WebP, AVIF.
            </p>
          </div>
          {form.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
              {form.images.map((img, i) => (
                <div
                  key={i}
                  className="group relative aspect-video rounded-lg overflow-hidden border"
                >
                  <Image
                    src={img}
                    alt={`Image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {form.image === img && (
                    <span className="absolute bottom-0 inset-x-0 bg-primary text-primary-foreground text-[9px] text-center py-0.5 font-medium">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.available}
              onCheckedChange={(v) => set({ available: !!v })}
            />
            Available
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.featured}
              onCheckedChange={(v) => set({ featured: !!v })}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.showPrice}
              onCheckedChange={(v) => set({ showPrice: !!v })}
            />
            Show Price
          </label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {mode === "add" ? "Add Apartment" : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

// ═══════════════════════════════════════════════════════════════
// BOOKINGS TAB — Card layout (no wide table)
// ═══════════════════════════════════════════════════════════════
function BookingsTab({
  bookings,
  apartments,
  updateBookingStatus,
  removeBooking,
  showToast,
}: {
  bookings: Booking[];
  apartments: Apartment[];
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  removeBooking: (id: string) => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [emailDialog, setEmailDialog] = useState<Booking | null>(null);
  const [sending, setSending] = useState(false);
  const [deleteBookingId, setDeleteBookingId] = useState<string | null>(null);

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const fullName = `${b.firstName} ${b.lastName}`.toLowerCase();
    return (
      fullName.includes(q) ||
      b.apartment.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)
    );
  });

  const handleStatusChange = async (
    booking: Booking,
    newStatus: BookingStatus,
  ) => {
    await updateBookingStatus(booking.id, newStatus);
    showToast(`Booking ${booking.id} → ${newStatus}`);
    if (newStatus === "confirmed") {
      setEmailDialog(booking);
    }
  };

  const sendConfirmationEmail = async (booking: Booking) => {
    setSending(true);
    try {
      await emailjs.send(
        "service_danmes",
        "template_booking",
        {
          to_name: `${booking.firstName} ${booking.lastName}`,
          to_email: booking.email,
          booking_id: booking.id,
          apartment: booking.apartment,
          move_in: booking.moveInDate,
          lease: booking.leaseDuration,
          amount: `GHS ${booking.amount.toLocaleString()}`,
          from_name: "Prime Danmes Apartments & Short Stays",
        },
        "YOUR_PUBLIC_KEY",
      );
      showToast(`Confirmation email sent to ${booking.email}`);
    } catch {
      showToast(
        "Email sending failed. Please check your EmailJS configuration.",
        "error",
      );
    } finally {
      setSending(false);
      setEmailDialog(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Booking cards — responsive, no horizontal scroll */}
      <div className="space-y-3">
        {filtered.map((b) => (
          <Card
            key={b.id}
            className="group cursor-pointer transition-all hover:shadow-md"
            onClick={() => setSelectedBooking(b)}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h4 className="font-semibold text-sm">
                      {b.firstName} {b.lastName}
                    </h4>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {b.id}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">
                    {b.apartment}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      Move-in:{" "}
                      <strong className="text-foreground">
                        {b.moveInDate}
                      </strong>
                    </span>
                    <span>
                      Lease:{" "}
                      <strong className="text-foreground">
                        {b.leaseDuration}
                      </strong>
                    </span>
                    <span className="font-semibold text-foreground">
                      GHS {b.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusColors[b.status]}`}
                  >
                    {b.status}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No bookings found.
          </div>
        )}
      </div>

      {/* ──── Booking Detail Dialog ──── */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={(o) => !o && setSelectedBooking(null)}
      >
        {selectedBooking && (
          <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Booking {selectedBooking.id}</DialogTitle>
              <DialogDescription>
                Submitted on {selectedBooking.createdAt}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Status + actions row */}
              <div className="flex items-center justify-between">
                <Select
                  value={selectedBooking.status}
                  onValueChange={(v) => {
                    handleStatusChange(selectedBooking, v as BookingStatus);
                    setSelectedBooking({
                      ...selectedBooking,
                      status: v as BookingStatus,
                    });
                  }}
                >
                  <SelectTrigger size="sm" className="h-8 w-auto">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusColors[selectedBooking.status]}`}
                    >
                      {selectedBooking.status}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {bookingStatuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[s]}`}
                        >
                          {s}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-1">
                  {selectedBooking.status === "confirmed" && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Send email"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmailDialog(selectedBooking);
                      }}
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-red-600 hover:bg-red-50"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteBookingId(selectedBooking.id);
                      setSelectedBooking(null);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Section: Personal */}
              <DetailSection icon={User} title="Personal Information">
                <DetailRow
                  label="Name"
                  value={`${selectedBooking.firstName} ${selectedBooking.lastName}`}
                />
                <DetailRow label="Email" value={selectedBooking.email} />
                <DetailRow label="Phone" value={selectedBooking.phone} />
                <DetailRow
                  label="Ghana Card"
                  value={selectedBooking.ghanaCard}
                />
              </DetailSection>

              {/* Section: Booking */}
              <DetailSection icon={CreditCard} title="Booking Details">
                <DetailRow
                  label="Apartment"
                  value={selectedBooking.apartment}
                />
                <DetailRow
                  label="Move-in Date"
                  value={selectedBooking.moveInDate}
                />
                <DetailRow
                  label="Lease Duration"
                  value={selectedBooking.leaseDuration}
                />
                <DetailRow
                  label="Occupants"
                  value={`${selectedBooking.occupants} ${Number(selectedBooking.occupants) === 1 ? "person" : "people"}`}
                />
                <DetailRow
                  label="Amount"
                  value={`GHS ${selectedBooking.amount.toLocaleString()}`}
                  highlight
                />
              </DetailSection>

              {/* Section: Employment & Emergency */}
              <DetailSection icon={Briefcase} title="Employment & Emergency">
                <DetailRow label="Purpose of Stay" value={selectedBooking.employer} />
                <DetailRow
                  label="Emergency Contact"
                  value={selectedBooking.emergencyName}
                />
                <DetailRow
                  label="Emergency Phone"
                  value={selectedBooking.emergencyPhone}
                />
              </DetailSection>

              {/* Section: Notes */}
              {selectedBooking.notes && (
                <DetailSection icon={FileText} title="Additional Notes">
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.notes}
                  </p>
                </DetailSection>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Email dialog */}
      <Dialog
        open={!!emailDialog}
        onOpenChange={(o) => !o && setEmailDialog(null)}
      >
        {emailDialog && (
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Send Confirmation Email</DialogTitle>
              <DialogDescription>
                Send a booking confirmation to{" "}
                <strong>
                  {emailDialog.firstName} {emailDialog.lastName}
                </strong>
                ?
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-sm">
              <p>
                <strong>To:</strong> {emailDialog.email}
              </p>
              <p>
                <strong>Booking:</strong> {emailDialog.id}
              </p>
              <p>
                <strong>Apartment:</strong> {emailDialog.apartment}
              </p>
              <p>
                <strong>Move-in:</strong> {emailDialog.moveInDate}
              </p>
              <p>
                <strong>Lease:</strong> {emailDialog.leaseDuration}
              </p>
              <p>
                <strong>Amount:</strong> GHS{" "}
                {emailDialog.amount.toLocaleString()}
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEmailDialog(null)}
                disabled={sending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => sendConfirmationEmail(emailDialog)}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <span className="mr-1.5 h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-1.5 h-3.5 w-3.5" /> Send Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete booking confirmation */}
      <Dialog
        open={!!deleteBookingId}
        onOpenChange={(o) => !o && setDeleteBookingId(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteBookingId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                if (deleteBookingId) {
                  await removeBooking(deleteBookingId);
                  showToast("Booking deleted");
                  setDeleteBookingId(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ──── Detail section helpers ────
function DetailSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-muted/30 p-3 sm:p-4">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary mb-2.5">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span
        className={`text-right ${highlight ? "font-semibold text-primary" : "font-medium"}`}
      >
        {value}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAINTENANCE TAB
// ═══════════════════════════════════════════════════════════════
function MaintenanceTab({
  maintenance,
  apartments,
  addMaintenance,
  updateMaintenanceStatus,
  removeMaintenance,
  showToast,
}: {
  maintenance: MaintenanceRequest[];
  apartments: Apartment[];
  addMaintenance: (
    r: Omit<MaintenanceRequest, "id">,
  ) => Promise<MaintenanceRequest | null>;
  updateMaintenanceStatus: (
    id: string,
    status: "open" | "in-progress" | "resolved",
  ) => Promise<void>;
  removeMaintenance: (id: string) => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newIssue, setNewIssue] = useState("");
  const [newAptId, setNewAptId] = useState(apartments[0]?.id || "");
  const [newPriority, setNewPriority] = useState<
    "low" | "medium" | "high" | "urgent"
  >("medium");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newIssue.trim()) return;
    setAdding(true);
    const apt = apartments.find((a) => a.id === newAptId);
    const result = await addMaintenance({
      apartment: apt?.name || "Unknown",
      apartmentId: newAptId,
      issue: newIssue.trim(),
      priority: newPriority,
      status: "open",
      reportedDate: new Date().toISOString().slice(0, 10),
    });
    setAdding(false);
    if (result) {
      showToast("Maintenance request created");
      setAddOpen(false);
      setNewIssue("");
      setNewPriority("medium");
    } else {
      showToast("Failed to create maintenance request", "error");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {maintenance.length} request{maintenance.length !== 1 ? "s" : ""}
        </p>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger
            render={
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" /> New Request
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Maintenance Request</DialogTitle>
              <DialogDescription>
                Log a new maintenance issue for an apartment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Apartment</Label>
                <Select
                  value={newAptId}
                  onValueChange={(v) => setNewAptId(v ?? "")}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {apartments.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={newPriority}
                  onValueChange={(v) => setNewPriority(v as typeof newPriority)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["low", "medium", "high", "urgent"] as const).map((p) => (
                      <SelectItem key={p} value={p}>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityColors[p]}`}
                        >
                          {p}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Issue Description *</Label>
                <Textarea
                  className="mt-1"
                  rows={3}
                  placeholder="Describe the maintenance issue..."
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={adding || !newIssue.trim()}
              >
                {adding ? "Creating..." : "Create Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {maintenance.map((m) => (
          <Card key={m.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{m.apartment}</p>
                  <p className="text-xs text-muted-foreground">
                    Reported: {m.reportedDate}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityColors[m.priority]}`}
                  >
                    {m.priority}
                  </span>
                </div>
              </div>

              <p className="text-sm">{m.issue}</p>

              <div className="flex items-center justify-between pt-1 border-t">
                <Select
                  value={m.status}
                  onValueChange={(v) => {
                    updateMaintenanceStatus(
                      m.id,
                      v as "open" | "in-progress" | "resolved",
                    );
                    showToast(`${m.id.slice(0, 8)}... → ${v}`);
                  }}
                >
                  <SelectTrigger size="sm" className="h-7 text-xs">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${maintenanceStatusColors[m.status]}`}
                    >
                      {m.status}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {(["open", "in-progress", "resolved"] as const).map((s) => (
                      <SelectItem key={s} value={s}>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${maintenanceStatusColors[s]}`}
                        >
                          {s}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => setDeleteId(m.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {maintenance.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No maintenance requests.
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Request</DialogTitle>
            <DialogDescription>
              Remove this maintenance request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                if (deleteId) {
                  await removeMaintenance(deleteId);
                  showToast("Maintenance request deleted");
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
