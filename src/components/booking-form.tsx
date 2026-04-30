"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { Apartment } from "@/lib/data";
import { useApartmentStore } from "@/lib/store";
import type { Booking } from "@/lib/store";

interface BookingFormProps {
  apartment: Apartment;
}

export default function BookingForm({ apartment }: BookingFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const addBooking = useApartmentStore((s) => s.addBooking);

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
      apartment: apartment.name,
      apartmentId: apartment.id,
      moveInDate: fd.get("moveIn") as string,
      leaseDuration: fd.get("leaseDuration") as string,
      occupants: fd.get("occupants") as string,
      employer: fd.get("employer") as string,
      emergencyName: fd.get("emergencyName") as string,
      emergencyPhone: fd.get("emergencyPhone") as string,
      notes: (fd.get("notes") as string) || "",
      status: "pending",
      amount: apartment.price,
    };
    const result = await addBooking(bookingData);
    setSubmitting(false);
    if (result) {
      setBookingId(result.id);
      setSuccess(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="text-sm font-medium text-muted-foreground">
            You are booking
          </p>
          <p className="text-lg font-bold">{apartment.name}</p>
          {apartment.showPrice && apartment.price > 0 && (
            <p className="text-2xl font-bold text-primary">
              GHS {apartment.price.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                {apartment.pricePeriod}
              </span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Kwame"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Mensah"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="kwame@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+233 24 000 0000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ghanaCard">Ghana Card Number *</Label>
          <Input
            id="ghanaCard"
            name="ghanaCard"
            placeholder="GHA-XXXXXXXXX-X"
            pattern="GHA-\d{9}-\d"
            title="Format: GHA-XXXXXXXXX-X (e.g. GHA-123456789-0)"
            required
          />
          <p className="text-xs text-muted-foreground">
            Format: GHA-123456789-0
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="moveIn">Check-in Date *</Label>
            <Input id="moveIn" name="moveIn" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leaseDuration">Stay Duration *</Label>
            <Select name="leaseDuration" required>
              <SelectTrigger id="leaseDuration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 Night">1 Night</SelectItem>
                <SelectItem value="2-3 Nights">2–3 Nights</SelectItem>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupants">Number of Occupants *</Label>
          <Select name="occupants" required>
            <SelectTrigger id="occupants">
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

        <div className="space-y-2">
          <Label htmlFor="employer">Purpose of Stay *</Label>
          <Input
            id="employer"
            name="employer"
            placeholder="e.g. Tourism, Business trip, Relocation, Family visit..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
          <Input
            id="emergencyName"
            name="emergencyName"
            placeholder="Full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
          <Input
            id="emergencyPhone"
            name="emergencyPhone"
            type="tel"
            placeholder="+233 20 000 0000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any special requests, questions, or information you'd like us to know..."
            rows={3}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full text-base shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Booking Request"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By submitting, you agree to our terms and conditions. A member of our
          team will contact you within 24 hours to confirm your booking.
        </p>
      </form>

      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="text-center sm:max-w-md">
          <DialogHeader className="items-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <DialogTitle className="text-xl">
              Booking Request Submitted!
            </DialogTitle>
            <DialogDescription className="text-center space-y-3">
              <span className="block">
                Thank you for your interest in <strong>{apartment.name}</strong>.
                Our team will review your application and contact you within 24
                hours.
              </span>
              {bookingId && (
                <span className="block rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
                  <span className="block text-xs text-muted-foreground mb-1">Your Booking Reference</span>
                  <span className="text-lg font-bold tracking-widest text-primary">{bookingId}</span>
                </span>
              )}
              <span className="block text-xs">
                You can also reach us on WhatsApp at +233 24 489 3605.
              </span>
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setSuccess(false)}
            className="mt-2 rounded-full"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
