import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageCircle, Navigation } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl">
                <Image
                  src="/danmes-logo.jpeg"
                  alt="Prime Danmes logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-background">
                  PRIME DANMES
                </span>
                <span className="text-[10px] font-medium text-background/50 tracking-wide uppercase">
                  Apartments & Short Stays
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-background/60">
              Your Luxurious Home and Event Grounds. Experience comfort, style,
              and warm Ghanaian hospitality at Prime Danmes Apartments and Short
              Stays.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/233244893605"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background/70 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/12404756569"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background/70 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110"
                aria-label="WhatsApp US"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/80">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/apartments", label: "Browse Apartments" },
                { href: "/amenities", label: "Amenities" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/50 transition-colors duration-200 hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/80">
              Apartment Types
            </h3>
            <ul className="space-y-3">
              {[
                "1-Bedroom Suites",
                "2-Bedroom Residences",
                "3-Bedroom Family Homes",
              ].map((type) => (
                <li key={type}>
                  <Link
                    href="/apartments"
                    className="text-sm text-background/50 transition-colors duration-200 hover:text-background"
                  >
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/80">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-background/60">
                  House Number T, 26B SSNIT ST,
                  <br />
                  Anaji Takoradi - Ghana
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-background/60">
                  GPS: WK-391-2390
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="text-sm text-background/60">
                  <a
                    href="tel:+233598164027"
                    className="transition-colors hover:text-background block"
                  >
                    +233 59 816 4027
                  </a>
                  <a
                    href="tel:+233202361616"
                    className="transition-colors hover:text-background block"
                  >
                    +233 20 236 1616
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="text-sm text-background/60">
                  <span className="text-xs font-semibold uppercase tracking-wider text-background/40 block mb-1">
                    WhatsApp
                  </span>
                  <a
                    href="https://wa.me/233244893605"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-background block"
                  >
                    +233 24 489 3605
                  </a>
                  <a
                    href="https://wa.me/12404756569"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-background block"
                  >
                    +1 240 475 6569
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-background/10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-background/40">
            &copy; {new Date().getFullYear()} Prime Danmes Apartments and Short
            Stays. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-background/40 transition-colors hover:text-background/70"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-background/40 transition-colors hover:text-background/70"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
