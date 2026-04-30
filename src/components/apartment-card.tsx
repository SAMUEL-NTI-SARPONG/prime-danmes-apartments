import Link from "next/link";
import { Bed, Bath, Maximize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Apartment } from "@/lib/data";

const typeLabels: Record<string, string> = {
  "1-bedroom": "1 Bedroom",
  "2-bedroom": "2 Bedrooms",
  "3-bedroom": "3 Bedrooms",
};

export default function ApartmentCard({ apartment }: { apartment: Apartment }) {
  return (
    <div className="group block">
      <div className="overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-1">
        {/* Image Container - Airbnb style */}
        <div className="relative aspect-4/3 overflow-hidden rounded-xl">
          <Link href={`/apartments/${apartment.id}`}>
            <img
              src={apartment.image}
              alt={apartment.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </Link>

          {/* Guest favorite badge */}
          {apartment.featured && (
            <div className="absolute left-3 top-3">
              <Badge className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm hover:bg-white/95">
                Guest favourite
              </Badge>
            </div>
          )}

          {!apartment.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Badge className="bg-red-600 text-white text-sm px-3 py-1">
                Unavailable
              </Badge>
            </div>
          )}
        </div>

        {/* Content - Airbnb style */}
        <Link href={`/apartments/${apartment.id}`}>
          <div className="pt-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-semibold leading-tight text-foreground">
                {apartment.name}
              </h3>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {typeLabels[apartment.type] || apartment.type} &middot; Floor{" "}
              {apartment.floor}
            </p>
            <div className="mt-1 flex items-center gap-3.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5" />
                {apartment.beds}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" />
                {apartment.baths}
              </span>
              <span className="flex items-center gap-1">
                <Maximize className="h-3.5 w-3.5" />
                {apartment.sqft} sqft
              </span>
            </div>
            {apartment.showPrice && apartment.price > 0 && (
              <p className="mt-2">
                <span className="text-[15px] font-semibold">
                  GHS {apartment.price.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  {" "}
                  /{apartment.pricePeriod.replace("per ", "")}
                </span>
              </p>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
