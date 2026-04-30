"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ApartmentCard from "@/components/apartment-card";
import ApartmentCardSkeleton from "@/components/apartment-card-skeleton";
import { useApartmentStore } from "@/lib/store";
import { motion } from "framer-motion";

const types = [
  { value: "all", label: "All Types" },
  { value: "1-bedroom", label: "1 Bedroom" },
  { value: "2-bedroom", label: "2 Bedrooms" },
  { value: "3-bedroom", label: "3 Bedrooms" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function ApartmentsPage() {
  const apartments = useApartmentStore((s) => s.apartments);
  const apartmentsLoaded = useApartmentStore((s) => s.apartmentsLoaded);
  const loadingApartments = useApartmentStore((s) => s.loadingApartments);
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const isLoading = !apartmentsLoaded || loadingApartments;

  const filtered = apartments.filter((apt) => {
    const matchesType = selectedType === "all" || apt.type === selectedType;
    const matchesSearch =
      searchQuery === "" ||
      apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <>
      {/* Page Header */}
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
              Browse
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Our Apartments
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-3 max-w-2xl text-muted-foreground"
            >
              Find your perfect space. Filter by type or search by name.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filters - Airbnb style sticky */}
      <section className="sticky top-18 z-40 border-b bg-background/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search apartments..."
                className="rounded-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full transition-all duration-200 ${
                    selectedType === type.value
                      ? "shadow-md shadow-primary/20"
                      : "hover:border-foreground/30"
                  }`}
                  onClick={() => setSelectedType(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isLoading ? (
          <>
            <div className="mb-8 h-4 w-36 animate-pulse rounded-md bg-muted" />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ApartmentCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mb-8 text-sm text-muted-foreground">
              Showing <strong>{filtered.length}</strong> apartment
              {filtered.length !== 1 ? "s" : ""}
            </p>
            {filtered.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                key={`${selectedType}-${searchQuery}`}
              >
                {filtered.map((apt, i) => (
                  <motion.div key={apt.id} variants={fadeUp} custom={i}>
                    <ApartmentCard apartment={apt} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="py-24 text-center">
                <SlidersHorizontal className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <h3 className="mt-4 text-lg font-semibold">No apartments found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters or search query.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full"
                  onClick={() => {
                    setSelectedType("all");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
