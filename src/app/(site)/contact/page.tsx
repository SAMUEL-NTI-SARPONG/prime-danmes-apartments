"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  CheckCircle2,
  Loader2,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/components/site-settings-provider";
import { phoneHref, whatsappHref } from "@/lib/site-settings";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function ContactPage() {
  const settings = useSiteSettings();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      firstName: fd.get("firstName") as string,
      lastName: fd.get("lastName") as string,
      email: fd.get("email") as string,
      phone: (fd.get("phone") as string) || "",
      subject: fd.get("subject") as string,
      message: fd.get("message") as string,
    };

    try {
      // Save to database
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setSuccess(true);
      form.reset();
    } catch {
      setError(
        "Something went wrong. Please try again or contact us via WhatsApp.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold uppercase tracking-widest text-primary"
            >
              Get in Touch
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Contact Us
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-3 max-w-2xl text-muted-foreground"
            >
              Have questions about our apartments? Want to schedule a viewing?
              We&apos;d love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
          {/* Contact Info */}
          <motion.div
            className="lg:col-span-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-xl font-semibold"
            >
              Contact Information
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-2 text-sm text-muted-foreground"
            >
              Reach out through any of the channels below, or fill in the form
              and we&apos;ll get back to you.
            </motion.p>

            <div className="mt-10 space-y-8">
              <motion.div
                variants={fadeUp}
                custom={2}
                className="flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Address</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {settings.addressLine1},
                    <br />
                    {settings.addressLine2}
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={3}
                className="flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">GPS Address</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {settings.gpsAddress}
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Phone</p>
                  <a
                    href={phoneHref(settings.phone1)}
                    className="mt-1 block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {settings.phone1}
                  </a>
                  {settings.phone2 && (
                    <a
                      href={phoneHref(settings.phone2)}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {settings.phone2}
                    </a>
                  )}
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={5}
                className="flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="mt-1 block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {settings.email}
                  </a>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={6}
                className="flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">WhatsApp</p>
                  <a
                    href={whatsappHref(settings.whatsapp1)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {settings.whatsapp1}
                  </a>
                  {settings.whatsapp2 && (
                    <a
                      href={whatsappHref(settings.whatsapp2)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {settings.whatsapp2}
                    </a>
                  )}
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={7}
                className="flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Office Hours</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {settings.officeHoursWeekdays}
                    <br />
                    {settings.officeHoursSaturday}
                    <br />
                    {settings.officeHoursSunday}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* WhatsApp CTA */}
            <motion.div variants={fadeUp} custom={8} className="mt-10">
              <a
                href={whatsappHref(settings.whatsapp1)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/25 transition-all duration-300 hover:bg-green-700 hover:scale-105 hover:shadow-xl hover:shadow-green-600/30"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="rounded-2xl border bg-card p-6 shadow-xl shadow-black/5 sm:p-10">
              <h2 className="text-xl font-semibold">Send Us a Message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in the form below and our team will respond within 24
                hours.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactFirstName">First Name *</Label>
                    <Input
                      id="contactFirstName"
                      name="firstName"
                      placeholder="Your first name"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactLastName">Last Name *</Label>
                    <Input
                      id="contactLastName"
                      name="lastName"
                      placeholder="Your last name"
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input
                    id="contactPhone"
                    name="phone"
                    type="tel"
                    placeholder="+233 24 000 0000"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactSubject">Subject *</Label>
                  <Input
                    id="contactSubject"
                    name="subject"
                    placeholder="E.g., Booking inquiry, Schedule a viewing"
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactMessage">Message *</Label>
                  <Textarea
                    id="contactMessage"
                    name="message"
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    required
                    className="rounded-xl"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full text-base shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold">Find Us</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {settings.addressLine1}, {settings.addressLine2}.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border shadow-inner">
            <iframe
              title="Prime Danmes Apartments location"
              src={settings.mapEmbedUrl}
              className="h-80 w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="text-center sm:max-w-md">
          <DialogHeader className="items-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <DialogTitle className="text-xl">Message Sent!</DialogTitle>
            <DialogDescription className="text-center">
              Thank you for reaching out. Our team will get back to you within
              24 hours.
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
