export type PricePeriod = "per day" | "per week" | "per month" | "per year";

export interface Apartment {
  id: string;
  name: string;
  type: "1-bedroom" | "2-bedroom" | "3-bedroom";
  price: number;
  pricePeriod: PricePeriod;
  showPrice: boolean;
  image: string;
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  floor: number;
  description: string;
  features: string[];
  available: boolean;
  featured: boolean;
}

// ─── Shared gallery images ────────────────────────────────
// These are the 17 photos from the property's Airbnb photo tour. All five
// apartments share the same layout, so every unit gets the complete gallery
// with a different first image to keep the listing cards visually distinct.
export const propertyGallery = [
  "/images/danmes/living-room-bright.avif",
  "/images/danmes/living-room-wide.avif",
  "/images/danmes/living-room-evening.avif",
  "/images/danmes/dining-kitchen-wide.avif",
  "/images/danmes/dining-area-close.avif",
  "/images/danmes/bedroom-primary-front.avif",
  "/images/danmes/bedroom-primary-angle.avif",
  "/images/danmes/bedroom-secondary-front.avif",
  "/images/danmes/bedroom-secondary-tv.avif",
  "/images/danmes/bedroom-secondary-vanity.avif",
  "/images/danmes/bathroom-shower.avif",
  "/images/danmes/bathroom-vanity.avif",
  "/images/danmes/exterior-front-day.avif",
  "/images/danmes/exterior-entrance.avif",
  "/images/danmes/exterior-side.avif",
  "/images/danmes/exterior-garden.avif",
  "/images/danmes/exterior-front-night.avif",
];

// Each unit picks a different index as its cover photo
function buildImages(heroIndex: number): string[] {
  const hero = propertyGallery[heroIndex];
  const rest = propertyGallery.filter((_, i) => i !== heroIndex);
  return [hero, ...rest];
}

const sharedFeatures = [
  "Fully Furnished",
  "2 Bedroom Luxury Suite",
  "24/7 Power Supply",
  "Steady Water Supply",
  "Fully Equipped Kitchen",
  "Air Conditioning Units",
  "24/7 Security",
];

const sharedDescription =
  "A beautifully designed, fully-furnished 2-bedroom luxury suite featuring modern finishes, 24/7 power and water supply, a fully equipped kitchen, air conditioning throughout, and round-the-clock security. Located in the heart of Anaji, Takoradi — perfect for business travellers, couples, and families seeking comfort and convenience.";

export const apartments: Apartment[] = [
  {
    id: "apt-01",
    name: "Danmes Suite A",
    type: "2-bedroom",
    price: 0,
    pricePeriod: "per month",
    showPrice: false,
    image: propertyGallery[0],
    images: buildImages(0),
    beds: 2,
    baths: 2,
    sqft: 980,
    floor: 1,
    description: sharedDescription,
    features: [...sharedFeatures],
    available: true,
    featured: true,
  },
  {
    id: "apt-02",
    name: "Danmes Suite B",
    type: "2-bedroom",
    price: 0,
    pricePeriod: "per month",
    showPrice: false,
    image: propertyGallery[5],
    images: buildImages(5),
    beds: 2,
    baths: 2,
    sqft: 980,
    floor: 1,
    description: sharedDescription,
    features: [...sharedFeatures],
    available: true,
    featured: true,
  },
  {
    id: "apt-03",
    name: "Danmes Suite C",
    type: "2-bedroom",
    price: 0,
    pricePeriod: "per month",
    showPrice: false,
    image: propertyGallery[3],
    images: buildImages(3),
    beds: 2,
    baths: 2,
    sqft: 980,
    floor: 2,
    description: sharedDescription,
    features: [...sharedFeatures],
    available: true,
    featured: false,
  },
  {
    id: "apt-04",
    name: "Danmes Suite D",
    type: "2-bedroom",
    price: 0,
    pricePeriod: "per month",
    showPrice: false,
    image: propertyGallery[12],
    images: buildImages(12),
    beds: 2,
    baths: 2,
    sqft: 980,
    floor: 2,
    description: sharedDescription,
    features: [...sharedFeatures],
    available: true,
    featured: false,
  },
  {
    id: "apt-05",
    name: "Danmes Suite E",
    type: "2-bedroom",
    price: 0,
    pricePeriod: "per month",
    showPrice: false,
    image: propertyGallery[1],
    images: buildImages(1),
    beds: 2,
    baths: 2,
    sqft: 980,
    floor: 3,
    description: sharedDescription,
    features: [...sharedFeatures],
    available: true,
    featured: true,
  },
];

export const amenities = [
  {
    name: "24/7 Power Supply",
    icon: "zap",
    description: "Uninterrupted electricity with full generator backup",
  },
  {
    name: "Steady Water Supply",
    icon: "droplets",
    description: "Reliable water supply with overhead tank storage",
  },
  {
    name: "24/7 Security",
    icon: "shield-check",
    description: "Round-the-clock security with CCTV monitoring",
  },
  {
    name: "Fully Equipped Kitchen",
    icon: "chef-hat",
    description: "Modern kitchen with fridge, cooker, and cookware",
  },
  {
    name: "Air Conditioning",
    icon: "wind",
    description: "Split AC units in every room for year-round comfort",
  },
  {
    name: "Fully Furnished",
    icon: "sofa",
    description: "Premium furniture, bedding, and decor throughout",
  },
  {
    name: "High-Speed Internet",
    icon: "wifi",
    description: "Fiber optic internet throughout the building",
  },
  {
    name: "Landscaped Compound",
    icon: "trees",
    description: "Beautiful compound with parking and green spaces",
  },
];

export function getApartmentById(id: string): Apartment | undefined {
  return apartments.find((apt) => apt.id === id);
}

export function getApartmentsByType(type: string): Apartment[] {
  if (type === "all") return apartments;
  return apartments.filter((apt) => apt.type === type);
}
