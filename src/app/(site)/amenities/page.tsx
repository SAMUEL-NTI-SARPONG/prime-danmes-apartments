"use client";

import {
  Waves,
  Dumbbell,
  ShieldCheck,
  Car,
  Wifi,
  Laptop,
  Baby,
  TreePine,
  BellRing,
  Zap,
  Droplets,
  Fingerprint,
} from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  waves: Waves,
  dumbbell: Dumbbell,
  "shield-check": ShieldCheck,
  car: Car,
  wifi: Wifi,
  laptop: Laptop,
  baby: Baby,
  trees: TreePine,
  "bell-ring": BellRing,
  zap: Zap,
  droplets: Droplets,
  fingerprint: Fingerprint,
};

import { amenities } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function AmenitiesPage() {
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
              World-Class
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Amenities
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-3 max-w-2xl text-muted-foreground"
            >
              Prime Danmes Apartments offers a thoughtful suite of amenities
              designed to make your stay comfortable and convenient.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative h-64 overflow-hidden sm:h-80 lg:h-96">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80"
          alt="Luxury amenities"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
      </section>

      {/* Amenities Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {amenities.map((amenity, i) => {
            const Icon = iconMap[amenity.icon] || ShieldCheck;
            return (
              <motion.div
                key={amenity.name}
                variants={fadeUp}
                custom={i}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-7 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/5 -translate-y-16 translate-x-16 transition-transform duration-500 group-hover:scale-150" />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/25">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{amenity.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {amenity.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Extra Section */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.div variants={fadeUp} custom={0}>
              <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                Designed for Your Comfort
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Every amenity at Prime Danmes Apartments has been thoughtfully
                selected with our guests in mind. Whether you&apos;re a business
                traveler who needs reliable WiFi and a quiet workspace, or a
                family looking for a comfortable home base in Takoradi &mdash;
                we&apos;ve got you covered.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Our team is committed to maintaining and improving our
                facilities to ensure they meet the highest standards of quality
                and comfort for every guest.
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              custom={1}
              className="overflow-hidden rounded-2xl shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                alt="Modern apartment interior"
                className="h-72 w-full object-cover lg:h-96 transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
