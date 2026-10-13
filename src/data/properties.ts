export type ListingType = "buy" | "rent";

export type PropertyType = "House" | "Apartment" | "Land" | "Commercial";

export const propertyTypes: (PropertyType | "All")[] = [
  "All",
  "House",
  "Apartment",
  "Land",
  "Commercial",
];

export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  city: string;
  price: number;
  listingType: ListingType;
  propertyType: PropertyType;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  description: string;
  features: string[];
  image: string;
  gallery: string[];
  alt: string;
  dateAdded: string;
}

export const properties: Property[] = [
  {
    id: "p1",
    slug: "coral-residence-lekki",
    title: "The Coral Residence",
    location: "Lekki Phase 1, Lagos",
    city: "Lagos",
    price: 185000000,
    listingType: "buy",
    propertyType: "House",
    bedrooms: 5,
    bathrooms: 6,
    area: 420,
    description:
      "A contemporary five-bedroom detached home in the heart of Lekki Phase 1. The Coral Residence pairs clean architectural lines with warm interior finishes, offering spacious living areas, a modern kitchen, and a private garden. Each bedroom is en-suite, and the master suite features a panoramic window overlooking the terrace.",
    features: [
      "5 en-suite bedrooms",
      "Modern fitted kitchen",
      "Private landscaped garden",
      "Double garage with EV charging",
      "24/7 estate security",
      "Borehole water supply",
    ],
    image:
      "https://images.pexels.com/photos/8082328/pexels-photo-8082328.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    gallery: [
      "https://images.pexels.com/photos/8082328/pexels-photo-8082328.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/8082243/pexels-photo-8082243.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/8135492/pexels-photo-8135492.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    alt: "Modern luxury villa with large windows surrounded by lush green lawn and trees",
    dateAdded: "2026-09-20",
  },
  {
    id: "p2",
    slug: "ikoyi-skyline-apartment",
    title: "Ikoyi Skyline Apartment",
    location: "Ikoyi, Lagos",
    city: "Lagos",
    price: 8500000,
    listingType: "rent",
    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 210,
    description:
      "A bright three-bedroom apartment on a high floor of a sought-after Ikoyi tower. Floor-to-ceiling windows frame sweeping city views, while the open-plan living space flows into a sleek kitchen. The building includes a resident lounge, gym, and covered parking.",
    features: [
      "3 bedrooms, 2 bathrooms",
      "Open-plan living and dining",
      "Fitted modern kitchen",
      "Resident gym and lounge",
      "Covered parking for 2 cars",
      "24-hour concierge",
    ],
    image:
      "https://images.pexels.com/photos/14998334/pexels-photo-14998334.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    gallery: [
      "https://images.pexels.com/photos/14998334/pexels-photo-14998334.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/19263207/pexels-photo-19263207.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/27451770/pexels-photo-27451770.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/1693946/pexels-photo-1693946.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    alt: "Multi-story luxury apartment building with a contemporary facade against a clear sky",
    dateAdded: "2026-09-15",
  },
  {
    id: "p3",
    slug: "victoria-island-penthouse",
    title: "Victoria Island Penthouse",
    location: "Victoria Island, Lagos",
    city: "Lagos",
    price: 320000000,
    listingType: "buy",
    propertyType: "Apartment",
    bedrooms: 4,
    bathrooms: 4,
    area: 350,
    description:
      "An expansive four-bedroom penthouse atop a Victoria Island landmark. Wraparound terraces offer panoramic ocean and city views. The interior features double-height ceilings, designer finishes throughout, and a private elevator lobby. A rare offering in one of Lagos\u2019 most prestigious addresses.",
    features: [
      "4 bedrooms, 4 bathrooms",
      "Wraparound private terrace",
      "Double-height living area",
      "Private elevator access",
      "Smart home automation",
      "Two covered parking spaces",
    ],
    image:
      "https://images.pexels.com/photos/16110999/pexels-photo-16110999.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    gallery: [
      "https://images.pexels.com/photos/16110999/pexels-photo-16110999.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/16110997/pexels-photo-16110997.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/2771935/pexels-photo-2771935.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/18506889/pexels-photo-18506889.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    alt: "Contemporary architecture showcasing glass balconies and sleek design",
    dateAdded: "2026-09-25",
  },
  {
    id: "p4",
    slug: "ikeja-gra-family-home",
    title: "Ikeja GRA Family Home",
    location: "Ikeja GRA, Lagos",
    city: "Lagos",
    price: 120000000,
    listingType: "buy",
    propertyType: "House",
    bedrooms: 4,
    bathrooms: 5,
    area: 380,
    description:
      "A well-proportioned four-bedroom detached home in the established Ikeja GRA neighbourhood. The property features a generous living room, separate dining area, modern kitchen, and a paved driveway. The quiet, tree-lined street offers a calm setting while keeping you connected to the mainland.",
    features: [
      "4 bedrooms, 5 bathrooms",
      "Separate living and dining rooms",
      "Modern fitted kitchen",
      "Paved driveway for 3 cars",
      "Staff quarters included",
      "Quiet, established neighbourhood",
    ],
    image:
      "https://images.pexels.com/photos/8134821/pexels-photo-8134821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    gallery: [
      "https://images.pexels.com/photos/8134821/pexels-photo-8134821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/7031411/pexels-photo-7031411.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/5563473/pexels-photo-5563473.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/7174113/pexels-photo-7174113.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    alt: "Contemporary two-story luxury home with spacious paved driveway and garden",
    dateAdded: "2026-09-10",
  },
  {
    id: "p5",
    slug: "maitama-executive-villa",
    title: "Maitama Executive Villa",
    location: "Maitama, Abuja",
    city: "Abuja",
    price: 450000000,
    listingType: "buy",
    propertyType: "House",
    bedrooms: 6,
    bathrooms: 7,
    area: 560,
    description:
      "A landmark six-bedroom villa in Maitama, Abuja\u2019s most distinguished residential district. The property combines grand proportions with contemporary detailing \u2014 a double-height entrance hall, formal and informal living spaces, a private office, and a landscaped exterior with a swimming pool.",
    features: [
      "6 bedrooms, 7 bathrooms",
      "Swimming pool and pool deck",
      "Private home office",
      "Double-height entrance hall",
      " landscaped gardens",
      "Borehole and solar backup",
    ],
    image:
      "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    gallery: [
      "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/7031594/pexels-photo-7031594.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/8082323/pexels-photo-8082323.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/7546323/pexels-photo-7546323.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    alt: "Illuminated luxurious two storey villa with modern architecture and panoramic windows",
    dateAdded: "2026-09-28",
  },
  {
    id: "p6",
    slug: "asokoro-garden-apartment",
    title: "Asokoro Garden Apartment",
    location: "Asokoro, Abuja",
    city: "Abuja",
    price: 6500000,
    listingType: "rent",
    propertyType: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 145,
    description:
      "A comfortable two-bedroom apartment in a quiet Asokoro development. The unit opens to a covered balcony with garden views, and the building includes a shared gym and allocated parking. A practical, well-located home for professionals or a small family.",
    features: [
      "2 bedrooms, 2 bathrooms",
      "Covered balcony with garden views",
      "Shared resident gym",
      "Allocated parking",
      "Backup power generator",
      "Proximity to Asokoro District",
    ],
    image:
      "https://images.pexels.com/photos/31656167/pexels-photo-31656167.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    gallery: [
      "https://images.pexels.com/photos/31656167/pexels-photo-31656167.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/31656168/pexels-photo-31656168.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/14294074/pexels-photo-14294074.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/27164969/pexels-photo-27164969.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    alt: "Contemporary multistory apartment building with balconies and large windows",
    dateAdded: "2026-09-05",
  },
  {
    id: "p7",
    slug: "lekki-commercial-plot",
    title: "Lekki Commercial Plot",
    location: "Lekki Phase 1, Lagos",
    city: "Lagos",
    price: 95000000,
    listingType: "buy",
    propertyType: "Land",
    bedrooms: null,
    bathrooms: null,
    area: 1200,
    description:
      "A 1,200-square-metre commercial plot on a main road in Lekki Phase 1. The land is dry, fenced, and has a registered Certificate of Occupancy. Positioned for mixed-use or commercial development in one of Lagos\u2019 fastest-growing corridors.",
    features: [
      "1,200 sqm land area",
      "Dry, fenced plot",
      "Registered Certificate of Occupancy",
      "Main road frontage",
      "Suitable for mixed-use development",
      "Established neighbourhood access",
    ],
    image:
      "https://images.pexels.com/photos/7350889/pexels-photo-7350889.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    gallery: [
      "https://images.pexels.com/photos/7350889/pexels-photo-7350889.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/7350889/pexels-photo-7350889.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    alt: "Aerial view of a modern mansion showcasing its architectural design and scenic surroundings",
    dateAdded: "2026-08-28",
  },
  {
    id: "p8",
    slug: "vi-commercial-tower-space",
    title: "VI Commercial Tower Space",
    location: "Victoria Island, Lagos",
    city: "Lagos",
    price: 12000000,
    listingType: "rent",
    propertyType: "Commercial",
    bedrooms: null,
    bathrooms: 2,
    area: 500,
    description:
      "A 500-square-metre open-floor commercial space in a Grade-A office tower on Victoria Island. The unit features raised floors, suspended ceilings, and backup power. The building provides 24-hour security, ample parking, and direct access to the business district.",
    features: [
      "500 sqm open-plan floor",
      "Raised floors and suspended ceilings",
      "Central air conditioning",
      "Backup power supply",
      "Ample visitor parking",
      "24-hour building security",
    ],
    image:
      "https://images.pexels.com/photos/4424414/pexels-photo-4424414.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    gallery: [
      "https://images.pexels.com/photos/4424414/pexels-photo-4424414.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/5186362/pexels-photo-5186362.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    alt: "Contemporary residential buildings showcasing urban living architecture",
    dateAdded: "2026-08-22",
  },
  {
    id: "p9",
    slug: "lekki-penthouse-apartment",
    title: "Lekki Penthouse Apartment",
    location: "Lekki Phase 1, Lagos",
    city: "Lagos",
    price: 6200000,
    listingType: "rent",
    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 230,
    description:
      "A contemporary three-bedroom penthouse in a serviced Lekki Phase 1 estate. The apartment features a private rooftop terrace, an open-plan kitchen with island, and spacious bedrooms with fitted wardrobes. Estate amenities include a pool, gym, and 24-hour security.",
    features: [
      "3 bedrooms, 3 bathrooms",
      "Private rooftop terrace",
      "Open-plan kitchen with island",
      "Estate pool and gym",
      "Fitted wardrobes throughout",
      "24-hour estate security",
    ],
    image:
      "https://images.pexels.com/photos/31737859/pexels-photo-31737859.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    gallery: [
      "https://images.pexels.com/photos/31737859/pexels-photo-31737859.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/7031604/pexels-photo-7031604.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/34688219/pexels-photo-34688219.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/29012619/pexels-photo-29012619.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    alt: "Elegant residential architecture illuminated at night, showcasing modern design and lush garden",
    dateAdded: "2026-09-30",
  },
  {
    id: "p10",
    slug: "asokoro-detached-villa",
    title: "Asokoro Detached Villa",
    location: "Asokoro, Abuja",
    city: "Abuja",
    price: 275000000,
    listingType: "buy",
    propertyType: "House",
    bedrooms: 5,
    bathrooms: 6,
    area: 480,
    description:
      "A distinguished five-bedroom detached villa in a quiet Asokoro close. The property offers formal and informal living rooms, a large modern kitchen, and a family room opening to the garden. All bedrooms are en-suite, and the master suite includes a private terrace.",
    features: [
      "5 en-suite bedrooms",
      "Formal and informal living rooms",
      "Large modern kitchen",
      "Family room opening to garden",
      "Master suite with private terrace",
      "Borehole and solar inverter",
    ],
    image:
      "https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    gallery: [
      "https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/7031604/pexels-photo-7031604.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/8082323/pexels-photo-8082323.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/8135492/pexels-photo-8135492.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    alt: "Exterior of contemporary residential house with glass doors and panoramic windows near green lawn",
    dateAdded: "2026-09-18",
  },
  {
    id: "p11",
    slug: "ikoyi-terraced-house",
    title: "Ikoyi Terraced House",
    location: "Ikoyi, Lagos",
    city: "Lagos",
    price: 210000000,
    listingType: "buy",
    propertyType: "House",
    bedrooms: 4,
    bathrooms: 4,
    area: 290,
    description:
      "A modern four-bedroom terraced house in a serviced Ikoyi compound. The home features an open-plan ground floor, a fully fitted kitchen, and a rooftop terrace with city views. The compound offers shared amenities including a gym, pool, and 24-hour security.",
    features: [
      "4 bedrooms, 4 bathrooms",
      "Open-plan ground floor",
      "Rooftop terrace with city views",
      "Fully fitted kitchen",
      "Shared compound pool and gym",
      "24-hour security",
    ],
    image:
      "https://images.pexels.com/photos/30580640/pexels-photo-30580640.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    gallery: [
      "https://images.pexels.com/photos/30580640/pexels-photo-30580640.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/7598375/pexels-photo-7598375.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/8082242/pexels-photo-8082242.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    alt: "Front view of twin modern houses with a symmetrical architectural design under a cloudy sky",
    dateAdded: "2026-09-12",
  },
  {
    id: "p12",
    slug: "maitama-land-bank",
    title: "Maitama Land Bank",
    location: "Maitama, Abuja",
    city: "Abuja",
    price: 380000000,
    listingType: "buy",
    propertyType: "Land",
    bedrooms: null,
    bathrooms: null,
    area: 2500,
    description:
      "A substantial 2,500-square-metre parcel in Maitama, suitable for a private residence or boutique development. The plot is level, fenced, and holds a Certificate of Occupancy. A rare land offering in one of Abuja\u2019s most established districts.",
    features: [
      "2,500 sqm land area",
      "Level, fenced plot",
      "Certificate of Occupancy",
      "Suitable for residential development",
      "Established Maitama location",
      "Wide road access",
    ],
    image:
      "https://images.pexels.com/photos/37253217/pexels-photo-37253217.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    gallery: [
      "https://images.pexels.com/photos/37253217/pexels-photo-37253217.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    alt: "Contemporary house with sleek design, set amidst lush greenery, showcasing modern architectural elegance",
    dateAdded: "2026-08-15",
  },
];

export const budgetRanges = [
  { label: "Any Budget", min: 0, max: Infinity },
  { label: "Up to 50M", min: 0, max: 50000000 },
  { label: "50M - 200M", min: 50000000, max: 200000000 },
  { label: "200M - 500M", min: 200000000, max: 500000000 },
  { label: "500M+", min: 500000000, max: Infinity },
] as const;

export function formatPrice(price: number, listingType: ListingType): string {
  const formatted = new Intl.NumberFormat("en-NG", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(price);

  const suffix = listingType === "rent" ? "/yr" : "";
  return `\u20A6${formatted}${suffix}`;
}

export function formatPriceFull(
  price: number,
  listingType: ListingType,
): string {
  const formatted = new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(price);

  const suffix = listingType === "rent" ? "/year" : "";
  return `\u20A6${formatted}${suffix}`;
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug);
}

export type SortOption = "recommended" | "price-asc" | "price-desc" | "newest";

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];
