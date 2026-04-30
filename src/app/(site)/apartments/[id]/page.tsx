"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Bed,
  Bath,
  Maximize,
  ChevronLeft,
  Check,
  Phone,
  Mail,
  Star,
  Building2,
  User,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useApartmentStore } from "@/lib/store";
import type { Booking } from "@/lib/store";
import { motion } from "framer-motion";

const typeLabels: Record<string, string> = {
  "1-bedroom": "1 Bedroom",
  "2-bedroom": "2 Bedrooms",
  "3-bedroom": "3 Bedrooms",
};

export default function ApartmentDetailPage() {
  const params = useParams();
  const apartments = useApartmentStore((s) => s.apartments);
  const apartmentsLoaded = useApartmentStore((s) => s.apartmentsLoaded);
  const addBooking = useApartmentStore((s) => s.addBooking);
  const apartment = apartments.find((a) => a.id === params.id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Show loading spinner while apartments are being fetched from API
  if (!apartmentsLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!apartment) {
    notFound();
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const bookingData: Omit<Booking, "id" | "createdAt"> = {
      firstName: fd.get("firstName") as string,
      lastName: fd.get("lastName") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      ghanaCard: fd.get("ghanaCard") as string,
      apartment: apartment!.name,
      apartmentId: apartment!.id,
      moveInDate: fd.get("moveIn") as string,
      leaseDuration: fd.get("leaseDuration") as string,
      occupants: fd.get("occupants") as string,
      employer: fd.get("employer") as string,
      emergencyName: fd.get("emergencyName") as string,
      emergencyPhone: fd.get("emergencyPhone") as string,
      notes: (fd.get("notes") as string) || "",
      status: "pending",
      amount: apartment!.price,
    };
    const result = await addBooking(bookingData);
    setSubmitting(false);
    if (result) {
      setFormSubmitted(true);
    }
  };

  return (
    <>
      {/* Back navigation */}
      <div className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/apartments"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Apartments
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image Gallery — Single large image + thumbnail carousel beneath */}
          <div className="overflow-hidden rounded-2xl bg-muted">
            {/* Main image */}
            <div className="relative aspect-video sm:aspect-21/9 overflow-hidden">
              <img
                src={apartment.images[selectedImage]}
                alt={apartment.name}
                className="h-full w-full object-cover transition-all duration-500"
              />
              {apartment.featured && (
                <Badge className="absolute left-4 top-4 gap-1 bg-white/95 text-foreground backdrop-blur-sm shadow-sm">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  Guest favourite
                </Badge>
              )}
              {!apartment.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Badge className="bg-red-600 text-white text-lg px-4 py-2">
                    Currently Unavailable
                  </Badge>
                </div>
              )}
              {/* Prev / Next arrows */}
              {apartment.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        (selectedImage - 1 + apartment.images.length) %
                          apartment.images.length,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        (selectedImage + 1) % apartment.images.length,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white rotate-180"
                    aria-label="Next image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </>
              )}
              {/* Image counter */}
              <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {selectedImage + 1} / {apartment.images.length}
              </span>
            </div>
          </div>

          {/* Thumbnail strip */}
          {apartment.images.length > 1 && (
            <div className="mt-3 flex justify-center gap-2 sm:gap-3">
              {apartment.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-14 w-20 overflow-hidden rounded-xl border-2 transition-all duration-200 sm:h-18 sm:w-28 ${
                    selectedImage === i
                      ? "border-primary shadow-md shadow-primary/20 scale-105"
                      : "border-transparent opacity-50 hover:opacity-90 hover:border-border"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${apartment.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Content Grid */}
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
            {/* Left - Details */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {typeLabels[apartment.type] || apartment.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Floor {apartment.floor}
                    </span>
                  </div>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    {apartment.name}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Anaji, Takoradi — Ghana
                  </p>
                </div>
                {apartment.showPrice && apartment.price > 0 && (
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      GH₵ {apartment.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {apartment.pricePeriod}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 flex flex-wrap gap-6 rounded-xl border bg-muted/20 p-5">
                <div className="flex items-center gap-2.5">
                  <Bed className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">
                      {apartment.beds}{" "}
                      {apartment.beds === 1 ? "Bedroom" : "Bedrooms"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Bath className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">
                      {apartment.baths}{" "}
                      {apartment.baths === 1 ? "Bathroom" : "Bathrooms"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Maximize className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold">{apartment.sqft} sqft</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold">
                    Floor {apartment.floor}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold">About This Apartment</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {apartment.description}
                </p>
              </div>

              {/* Features */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold">
                  What This Place Offers
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {apartment.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Booking Card */}
            <div>
              <div className="sticky top-24 rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold">Book This Apartment</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Complete the form below and we&apos;ll get back to you
                    within 24 hours.
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="rounded-xl bg-emerald-50 p-6 text-center">
                    <Check className="mx-auto h-10 w-10 text-emerald-600" />
                    <p className="mt-3 font-semibold text-emerald-800">
                      Booking Request Sent!
                    </p>
                    <p className="mt-1 text-sm text-emerald-600">
                      We&apos;ll review your application and contact you
                      shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Section: Personal Information */}
                    <div className="space-y-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                        <User className="h-3.5 w-3.5" />
                        Personal Information
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="firstName" className="text-sm">
                            First Name *
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="Kwame"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-sm">
                            Last Name *
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Mensah"
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+233 XX XXX XXXX"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="ghanaCard" className="text-sm">
                          Ghana Card Number *
                        </Label>
                        <Input
                          id="ghanaCard"
                          name="ghanaCard"
                          placeholder="GHA-XXXXXXXXX-X"
                          className="mt-1"
                          pattern="GHA-\d{9}-\d"
                          title="Format: GHA-XXXXXXXXX-X (e.g. GHA-123456789-0)"
                          required
                        />
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Format: GHA-123456789-0
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t" />

                    {/* Section: Booking Details */}
                    <div className="space-y-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Building2 className="h-3.5 w-3.5" />
                        Booking Details
                      </p>
                      <div>
                        <Label htmlFor="moveIn" className="text-sm">
                          Preferred Move-in Date *
                        </Label>
                        <Input
                          id="moveIn"
                          name="moveIn"
                          type="date"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Lease Duration *</Label>
                        <Select name="leaseDuration" defaultValue="" required>
                          <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Select lease duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1 Night">1 Night</SelectItem>
                            <SelectItem value="2-3 Nights">
                              2–3 Nights
                            </SelectItem>
                            <SelectItem value="1 Week">1 Week</SelectItem>
                            <SelectItem value="2 Weeks">2 Weeks</SelectItem>
                            <SelectItem value="1 Month">1 Month</SelectItem>
                            <SelectItem value="3 Months">3 Months</SelectItem>
                            <SelectItem value="6 Months">6 Months</SelectItem>
                            <SelectItem value="1 Year">1 Year</SelectItem>
                            <SelectItem value="2+ Years">2+ Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Number of Occupants *</Label>
                        <Select name="occupants" defaultValue="" required>
                          <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Select occupants" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Person</SelectItem>
                            <SelectItem value="2">2 People</SelectItem>
                            <SelectItem value="3">3 People</SelectItem>
                            <SelectItem value="4">4 People</SelectItem>
                            <SelectItem value="5+">5+ People</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t" />

                    {/* Section: Employment & Emergency */}
                    <div className="space-y-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Briefcase className="h-3.5 w-3.5" />
                        Employment & Emergency
                      </p>
                      <div>
                        <Label htmlFor="employer" className="text-sm">
                          Employer / Occupation *
                        </Label>
                        <Input
                          id="employer"
                          name="employer"
                          placeholder="e.g. Ghana Commercial Bank"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyName" className="text-sm">
                          Emergency Contact Name *
                        </Label>
                        <Input
                          id="emergencyName"
                          name="emergencyName"
                          placeholder="Full name"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone" className="text-sm">
                          Emergency Contact Phone *
                        </Label>
                        <Input
                          id="emergencyPhone"
                          name="emergencyPhone"
                          type="tel"
                          placeholder="+233 XX XXX XXXX"
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t" />

                    {/* Section: Additional Notes */}
                    <div>
                      <Label htmlFor="notes" className="text-sm">
                        Additional Notes{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Any special requests or extra information?"
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting…" : "Submit Booking Request"}
                    </Button>
                  </form>
                )}

                {/* Contact info */}
                <div className="mt-6 space-y-3 border-t pt-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Or contact us directly
                  </p>
                  <a
                    href="tel:+233302123456"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    +233 302 123 456
                  </a>
                  <a
                    href="mailto:info@primedanmes.com"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    info@primedanmes.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
