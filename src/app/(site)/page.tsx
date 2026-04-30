"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  Star,
  MapPin,
  Heart,
  Wifi,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ApartmentCard from "@/components/apartment-card";
import ApartmentCardSkeleton from "@/components/apartment-card-skeleton";
import { useApartmentStore } from "@/lib/store";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Home() {
  const apartments = useApartmentStore((s) => s.apartments);
  const apartmentsLoaded = useApartmentStore((s) => s.apartmentsLoaded);
  const featured = apartments.filter((a) => a.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80"
            alt="Luxury apartment building"
            className="h-full w-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-40 lg:px-8 lg:py-56">
          <motion.div
            className="max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-md"
            >
              <MapPin className="h-4 w-4" />
              Anaji, Takoradi &mdash; Ghana
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl"
            >
              Your Perfect
              <br />
              Stay in{" "}
              <span className="bg-linear-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Takoradi
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-white/50"
            >
              PRIME DANMES APARTMENTS & SHORT STAYS
            </motion.p>
            <motion.p
              variants={fadeUp}
              custom={3}
              className="mt-4 max-w-lg text-lg leading-relaxed text-white/70"
            >
              Your Luxurious Home and Event Grounds. Beautifully designed,
              fully-furnished apartments in the heart of Anaji. Modern comfort
              meets warm Ghanaian hospitality &mdash; from a single night to
              your forever home.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={4}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link href="/apartments">
                <Button
                  size="lg"
                  className="rounded-full px-8 text-base shadow-xl shadow-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105"
                >
                  Explore Apartments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a
                href="https://wa.me/233244893605"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/30 bg-white/10 px-8 text-base text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:text-white hover:scale-105"
                >
                  WhatsApp Us
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
          className="relative z-10 mx-auto -mt-12 max-w-5xl px-4 pb-10 sm:-mt-14 sm:px-6 sm:pb-12 lg:px-8"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { value: "Luxury", label: "Apartments", icon: Building2 },
              { value: "24/7", label: "Security", icon: ShieldCheck },
              { value: "5★", label: "Guest Rating", icon: Star },
              { value: "GPS", label: "WK-391-2390", icon: MapPin },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white p-4 shadow-lg shadow-black/8 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 sm:p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:h-11 sm:w-11">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold tracking-tight text-foreground sm:text-base">
                    {stat.value}
                  </p>
                  <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Apartments */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="flex items-end justify-between"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Featured
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Our Top Apartments
              </h2>
              <p className="mt-2 max-w-lg text-muted-foreground">
                Hand-picked selections for the most discerning guests
              </p>
            </div>
            <Link
              href="/apartments"
              className="hidden items-center gap-1 text-sm font-semibold text-primary transition-all duration-200 hover:gap-2 sm:flex"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {!apartmentsLoaded
              ? Array.from({ length: 3 }).map((_, i) => (
                  <ApartmentCardSkeleton key={i} />
                ))
              : featured.map((apt, i) => (
                  <motion.div key={apt.id} variants={fadeUp} custom={i + 1}>
                    <ApartmentCard apartment={apt} />
                  </motion.div>
                ))}
          </div>
          <motion.div
            variants={fadeUp}
            custom={4}
            className="mt-10 text-center sm:hidden"
          >
            <Link href="/apartments">
              <Button variant="outline" className="rounded-full">
                View All Apartments
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Why PRIME DANMES
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Experience the Difference
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                We go above and beyond to make your stay unforgettable
              </p>
            </motion.div>
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Building2,
                  title: "Modern Design",
                  desc: "Every apartment features contemporary finishes, stylish interiors, and thoughtful layouts for maximum comfort.",
                },
                {
                  icon: ShieldCheck,
                  title: "Safe & Secure",
                  desc: "24/7 security, secure access, and round-the-clock surveillance for your complete peace of mind.",
                },
                {
                  icon: MapPin,
                  title: "Prime Location",
                  desc: "Located on SSNIT Street, Anaji Takoradi — minutes away from markets, restaurants, and key amenities.",
                },
                {
                  icon: Star,
                  title: "Top-Rated Stays",
                  desc: "Consistently rated 5 stars by our guests for cleanliness, comfort, and exceptional service.",
                },
                {
                  icon: Wifi,
                  title: "Fully Equipped",
                  desc: "High-speed WiFi, air conditioning, modern appliances — everything you need for a seamless stay.",
                },
                {
                  icon: Heart,
                  title: "Warm Hospitality",
                  desc: "Our team is dedicated to making you feel at home from check-in to check-out and beyond.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={i + 1}
                  className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-7 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/5 -translate-y-16 translate-x-16 transition-transform duration-500 group-hover:scale-150" />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/25">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleIn}
        >
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary/90 to-teal-900 px-8 py-20 text-center text-primary-foreground sm:px-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(255,255,255,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(0,0,0,0.15),transparent_50%)]" />
            <div className="relative z-10">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Ready to Book Your Stay?
              </h2>
              <p className="mx-auto mt-5 max-w-md text-lg text-primary-foreground/80">
                Browse our available apartments or reach out to us directly.
                We&apos;d love to host you.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link href="/apartments">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full px-8 text-base shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    Browse Apartments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a
                  href="https://wa.me/233244893605"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-primary-foreground/30 bg-transparent px-8 text-base text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/10 hover:text-primary-foreground hover:scale-105"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    WhatsApp Us
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Location Section */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center"
          >
            <motion.div variants={fadeUp} custom={0}>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Location
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Find Us in Takoradi
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Conveniently located on SSNIT Street in Anaji, Takoradi. Easy
                access to the city&apos;s best restaurants, shopping centers,
                and attractions.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Address</p>
                    <p className="text-sm text-muted-foreground">
                      House Number T, 26B SSNIT ST, Anaji Takoradi - Ghana
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">GPS Address</p>
                    <p className="text-sm text-muted-foreground">WK-391-2390</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Contact</p>
                    <p className="text-sm text-muted-foreground">
                      +233 59 816 4027 / +233 20 236 1616
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeUp}
              custom={1}
              className="overflow-hidden rounded-2xl shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                alt="Prime Danmes Apartments exterior"
                className="h-80 w-full object-cover lg:h-105 transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
