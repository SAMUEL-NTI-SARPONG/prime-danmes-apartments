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
// All 5 units share the same interior. Each unit uses a different
// "hero" image (first in array) so the cards look distinct, then
// the remaining shots form a shared gallery showing every angle.
const sharedGallery = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", // living room wide
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", // bedroom
  "https://images.unsplash.com/photo-1560440021-33f9b867899d?w=800&q=80", // kitchen
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80", // bathroom
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", // exterior
];

// Each unit picks a different index as its cover photo
function buildImages(heroIndex: number): string[] {
  const hero = sharedGallery[heroIndex];
  const rest = sharedGallery.filter((_, i) => i !== heroIndex);
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
    image: sharedGallery[0],
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
    image: sharedGallery[1],
    images: buildImages(1),
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
    image: sharedGallery[2],
    images: buildImages(2),
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
    image: sharedGallery[3],
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
    id: "apt-05",
    name: "Danmes Suite E",
    type: "2-bedroom",
    price: 0,
    pricePeriod: "per month",
    showPrice: false,
    image: sharedGallery[4],
    images: buildImages(4),
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
