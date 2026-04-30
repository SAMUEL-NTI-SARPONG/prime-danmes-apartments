"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/apartments", label: "Apartments" },
  { href: "/amenities", label: "Amenities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/40 bg-background/95 backdrop-blur-xl shadow-sm"
          : "bg-background/80 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/25">
            <Image
              src="/danmes-logo.jpeg"
              alt="Prime Danmes logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight leading-tight sm:text-base">
              PRIME DANMES
            </span>
            <span className="text-[9px] font-medium text-muted-foreground tracking-wide uppercase leading-tight sm:text-[10px]">
              Apartments & Short Stays
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="tel:+233598164027"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">+233 59 816 4027</span>
          </a>
          <Link href="/apartments">
            <Button
              size="sm"
              className="rounded-full px-6 shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
            >
              Book Now
            </Button>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-accent transition-colors">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-6 pt-8">
              <Link
                href="/"
                className="flex items-center gap-2.5"
                onClick={() => setOpen(false)}
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-xl">
                  <Image
                    src="/danmes-logo.jpeg"
                    alt="Prime Danmes logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold">PRIME DANMES</span>
                  <span className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">
                    Apartments & Short Stays
                  </span>
                </div>
              </Link>
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="space-y-3 pt-2">
                <a
                  href="tel:+233598164027"
                  className="flex items-center gap-2 px-4 text-sm text-muted-foreground"
                >
                  <Phone className="h-4 w-4" />
                  +233 59 816 4027
                </a>
                <Link href="/apartments" onClick={() => setOpen(false)}>
                  <Button className="w-full rounded-full shadow-md shadow-primary/20">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
