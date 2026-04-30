"use client";

import Link from "next/link";
import { ArrowRight, Award, Users, Heart, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

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

export default function AboutPage() {
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
              Our Story
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
            >
              About Prime Danmes Apartments
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-3 max-w-2xl text-muted-foreground"
            >
              Setting the standard for comfortable living and short stays in
              Takoradi, Ghana.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative h-64 overflow-hidden sm:h-80 lg:h-112">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
          alt="Prime Danmes Apartments"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-heading text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Your Home Away From Home in Takoradi
          </motion.h2>
          <div className="mt-6 space-y-5 text-muted-foreground leading-relaxed">
            <motion.p variants={fadeUp} custom={1}>
              Prime Danmes Apartments and Short Stays was born from a passion
              for hospitality and a desire to offer guests in Takoradi a truly
              comfortable, modern living experience. Located on SSNIT Street in
              Anaji, we provide the perfect base for business travelers,
              tourists, and families alike.
            </motion.p>
            <motion.p variants={fadeUp} custom={2}>
              Our apartments are thoughtfully designed with modern amenities,
              stylish interiors, and everything you need for a seamless stay.
              Whether you&apos;re here for a few nights or a few months, we make
              sure you feel right at home.
            </motion.p>
            <motion.p variants={fadeUp} custom={3}>
              We believe that where you stay matters. That&apos;s why we&apos;ve
              invested in quality furnishings, reliable utilities, 24/7
              security, and a dedicated team that treats every guest like
              family.
            </motion.p>
          </div>
        </motion.div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div variants={fadeUp} custom={0} className="text-center">
            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              What We Stand For
            </h2>
          </motion.div>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Award,
                title: "Excellence",
                desc: "We set the highest standards in comfort, cleanliness, and service. Nothing less than the best for our guests.",
              },
              {
                icon: Users,
                title: "Community",
                desc: "We foster a welcoming environment where guests from all walks of life feel valued and at home.",
              },
              {
                icon: Heart,
                title: "Care",
                desc: "Our dedicated team is committed to addressing every concern promptly and with genuine warmth.",
              },
              {
                icon: Target,
                title: "Reliability",
                desc: "From consistent quality to dependable utilities, you can count on us every time you visit.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i + 1}
                className="text-center group"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/25">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Image Section */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="overflow-hidden rounded-2xl shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                alt="Luxury apartment interior"
                className="h-72 w-full object-cover lg:h-96 transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                Proudly Ghanaian Hospitality
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Prime Danmes Apartments and Short Stays is proudly owned and
                operated by a Ghanaian team who understands the unique needs of
                both local and international guests. We blend modern comfort
                with the warm hospitality Ghana is known for.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Located in the vibrant Anaji neighborhood of Takoradi, we offer
                easy access to the city&apos;s attractions while providing a
                peaceful retreat at the end of the day.
              </p>
              <div className="mt-8">
                <Link href="/contact">
                  <Button className="rounded-full px-6 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105">
                    Get in Touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
