export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image?: string;
  rating?: number;
  sold?: number;
  badge?: string | null;
  stock?: number | null;
  popular?: boolean;
  trending?: boolean;
  isNew?: boolean;
  calories?: string;
  prepTime?: string;
}

export interface PromoSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUri: string;
  cta: string;
  tag: string;
}

export const restaurant = {
  name: "1st Koko Spot",
  tagline: "Authentic West African home cooking",
  address: "14 Osu Road, Accra",
  phone: "+233 302 123 456",
  hours: "Mon–Sun  7am – 10pm",
  rating: 4.8,
  reviewCount: 2340,
  deliveryTime: "25-35",
  deliveryFee: 1.99,
  minOrder: 12,
};

export const promoSlides: PromoSlide[] = [
  {
    id: "p1",
    title: "Jollof Friday Special",
    subtitle: "25% off all rice dishes today only",
    imageUri:
      "https://whyclfpsjhmmckxgjcan.supabase.co/storage/v1/object/public/product-images/seed/jollof-rice.jpg",
    cta: "Order Now",
    tag: "Flash Sale",
  },
  {
    id: "p2",
    title: "Free Delivery",
    subtitle: "On your first 3 orders · No code needed",
    imageUri:
      "https://whyclfpsjhmmckxgjcan.supabase.co/storage/v1/object/public/product-images/seed/waakye.jpg",
    cta: "Claim Offer",
    tag: "New Customer",
  },
  {
    id: "p3",
    title: "Banku & Tilapia",
    subtitle: "Our most-loved coastal classic",
    imageUri:
      "https://whyclfpsjhmmckxgjcan.supabase.co/storage/v1/object/public/product-images/seed/banku-tilapia.jpg",
    cta: "Try It",
    tag: "Best Seller",
  },
];
