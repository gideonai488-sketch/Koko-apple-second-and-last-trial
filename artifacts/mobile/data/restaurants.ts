export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  popular?: boolean;
  trending?: boolean;
  image?: any;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  image: any;
  categories: string[];
  menu: MenuItem[];
  promoted?: boolean;
  featured?: boolean;
  trending?: boolean;
  tagline?: string;
}

const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Bella Napoli",
    cuisine: "Italian",
    rating: 4.8,
    reviewCount: 342,
    deliveryTime: "25-35",
    deliveryFee: 1.99,
    minOrder: 12,
    image: require("../assets/images/restaurant_italian.png"),
    promoted: true,
    featured: true,
    trending: true,
    tagline: "Authentic wood-fired pizza since 1987",
    categories: ["Pizza", "Pasta", "Salads", "Desserts"],
    menu: [
      {
        id: "i1",
        name: "Margherita Pizza",
        description: "San Marzano tomatoes, fresh mozzarella, fragrant basil, extra-virgin olive oil",
        price: 16.99,
        originalPrice: 21.99,
        category: "Pizza",
        popular: true,
        trending: true,
        image: require("../assets/images/item_pizza.png"),
      },
      {
        id: "i2",
        name: "Pepperoni Pizza",
        description: "Tomato sauce, mozzarella, premium pepperoni slices, oregano",
        price: 18.99,
        category: "Pizza",
        popular: true,
        image: require("../assets/images/item_pizza.png"),
      },
      {
        id: "i3",
        name: "Truffle Arancini",
        description: "Crispy risotto balls stuffed with truffle, mozzarella, and parmesan",
        price: 12.99,
        originalPrice: 15.99,
        category: "Starters",
        popular: true,
      },
      {
        id: "i4",
        name: "Cacio e Pepe",
        description: "Spaghetti with Pecorino Romano, Parmigiano-Reggiano, and black pepper",
        price: 17.99,
        category: "Pasta",
      },
      {
        id: "i5",
        name: "Rigatoni Bolognese",
        description: "Slow-cooked beef and pork ragu, rigatoni, aged Parmigiano",
        price: 18.99,
        category: "Pasta",
      },
      {
        id: "i6",
        name: "Burrata Salad",
        description: "Fresh burrata, heirloom tomatoes, basil oil, balsamic reduction",
        price: 14.99,
        category: "Salads",
      },
      {
        id: "i7",
        name: "Tiramisu",
        description: "Classic mascarpone cream, espresso-soaked ladyfingers, cocoa",
        price: 9.99,
        originalPrice: 13.99,
        category: "Desserts",
        popular: true,
        trending: true,
        image: require("../assets/images/item_dessert.png"),
      },
    ],
  },
  {
    id: "2",
    name: "The Smokehouse",
    cuisine: "American",
    rating: 4.6,
    reviewCount: 518,
    deliveryTime: "20-30",
    deliveryFee: 0,
    minOrder: 10,
    image: require("../assets/images/restaurant_burger.png"),
    featured: true,
    trending: true,
    tagline: "Smash burgers done the right way",
    categories: ["Burgers", "Sides", "Drinks", "Desserts"],
    menu: [
      {
        id: "s1",
        name: "Classic Smash Burger",
        description: "Double smash patty, American cheese, pickles, special sauce, brioche bun",
        price: 13.99,
        originalPrice: 17.99,
        category: "Burgers",
        popular: true,
        trending: true,
        image: require("../assets/images/item_burger.png"),
      },
      {
        id: "s2",
        name: "Truffle Mushroom Burger",
        description: "Single patty, sautéed mushrooms, truffle aioli, gruyère, arugula",
        price: 16.99,
        category: "Burgers",
        popular: true,
        image: require("../assets/images/item_burger.png"),
      },
      {
        id: "s3",
        name: "Crispy Chicken Sandwich",
        description: "Fried chicken thigh, coleslaw, pickles, honey mustard, brioche",
        price: 14.99,
        originalPrice: 18.99,
        category: "Burgers",
        popular: true,
        image: require("../assets/images/item_burger.png"),
      },
      {
        id: "s4",
        name: "Loaded Fries",
        description: "Thick-cut fries, cheddar sauce, bacon bits, chives, sour cream",
        price: 8.99,
        category: "Sides",
      },
      {
        id: "s5",
        name: "Onion Rings",
        description: "Beer-battered onion rings, chipotle dipping sauce",
        price: 7.99,
        category: "Sides",
      },
      {
        id: "s6",
        name: "Vanilla Milkshake",
        description: "Thick creamy vanilla shake, whipped cream",
        price: 6.99,
        category: "Drinks",
      },
      {
        id: "s7",
        name: "Chocolate Brownie",
        description: "Warm fudge brownie, vanilla ice cream, chocolate drizzle",
        price: 7.99,
        category: "Desserts",
        image: require("../assets/images/item_dessert.png"),
      },
    ],
  },
  {
    id: "3",
    name: "Sakura Sushi",
    cuisine: "Japanese",
    rating: 4.9,
    reviewCount: 276,
    deliveryTime: "30-45",
    deliveryFee: 2.99,
    minOrder: 20,
    image: require("../assets/images/restaurant_sushi.png"),
    featured: true,
    tagline: "Omakase quality, delivered to your door",
    categories: ["Nigiri", "Rolls", "Starters", "Ramen"],
    menu: [
      {
        id: "j1",
        name: "Salmon Nigiri (2pc)",
        description: "Premium Atlantic salmon over seasoned shari rice",
        price: 8.99,
        category: "Nigiri",
        popular: true,
        image: require("../assets/images/item_sushi.png"),
      },
      {
        id: "j2",
        name: "Tuna Nigiri (2pc)",
        description: "Bluefin tuna over seasoned shari rice",
        price: 9.99,
        category: "Nigiri",
        image: require("../assets/images/item_sushi.png"),
      },
      {
        id: "j3",
        name: "Dragon Roll",
        description: "Shrimp tempura, cucumber, avocado, unagi sauce, sesame",
        price: 16.99,
        originalPrice: 20.99,
        category: "Rolls",
        popular: true,
        trending: true,
        image: require("../assets/images/item_sushi.png"),
      },
      {
        id: "j4",
        name: "Spicy Tuna Roll",
        description: "Fresh tuna, spicy mayo, cucumber, sesame, sriracha drizzle",
        price: 14.99,
        category: "Rolls",
        popular: true,
        image: require("../assets/images/item_sushi.png"),
      },
      {
        id: "j5",
        name: "Edamame",
        description: "Steamed salted edamame beans",
        price: 5.99,
        category: "Starters",
      },
      {
        id: "j6",
        name: "Miso Soup",
        description: "Classic dashi broth, tofu, seaweed, green onion",
        price: 3.99,
        category: "Starters",
      },
      {
        id: "j7",
        name: "Tonkotsu Ramen",
        description: "Rich pork bone broth, chashu pork, soft egg, nori, mushrooms",
        price: 17.99,
        originalPrice: 22.99,
        category: "Ramen",
        popular: true,
        trending: true,
      },
    ],
  },
  {
    id: "4",
    name: "Taqueria Sol",
    cuisine: "Mexican",
    rating: 4.7,
    reviewCount: 189,
    deliveryTime: "20-35",
    deliveryFee: 1.49,
    minOrder: 8,
    image: require("../assets/images/restaurant_mexican.png"),
    trending: true,
    tagline: "Street-style tacos with bold, authentic flavor",
    categories: ["Tacos", "Burritos", "Sides", "Drinks"],
    menu: [
      {
        id: "m1",
        name: "Carne Asada Tacos (3pc)",
        description: "Grilled skirt steak, onion, cilantro, salsa verde, corn tortilla",
        price: 13.99,
        originalPrice: 17.99,
        category: "Tacos",
        popular: true,
        trending: true,
        image: require("../assets/images/item_taco.png"),
      },
      {
        id: "m2",
        name: "Al Pastor Tacos (3pc)",
        description: "Achiote pork, pineapple, onion, cilantro, corn tortilla",
        price: 12.99,
        category: "Tacos",
        popular: true,
        image: require("../assets/images/item_taco.png"),
      },
      {
        id: "m3",
        name: "Fish Tacos (2pc)",
        description: "Beer-battered tilapia, chipotle slaw, avocado crema, flour tortilla",
        price: 13.99,
        category: "Tacos",
        image: require("../assets/images/item_taco.png"),
      },
      {
        id: "m4",
        name: "Carne Asada Burrito",
        description: "Grilled steak, rice, black beans, pico, guacamole, sour cream",
        price: 14.99,
        originalPrice: 18.99,
        category: "Burritos",
        popular: true,
      },
      {
        id: "m5",
        name: "Veggie Burrito",
        description: "Grilled peppers, black beans, rice, guacamole, salsa, cheese",
        price: 12.99,
        category: "Burritos",
      },
      {
        id: "m6",
        name: "Guacamole & Chips",
        description: "Fresh-made guacamole, crispy tortilla chips",
        price: 7.99,
        category: "Sides",
        popular: true,
      },
      {
        id: "m7",
        name: "Agua Fresca",
        description: "Choose: horchata, tamarind, or hibiscus",
        price: 4.99,
        category: "Drinks",
      },
    ],
  },
];

export default restaurants;

export const categories = [
  { id: "all", label: "All", icon: "grid" },
  { id: "Italian", label: "Pizza", icon: "circle" },
  { id: "American", label: "Burgers", icon: "zap" },
  { id: "Japanese", label: "Sushi", icon: "star" },
  { id: "Mexican", label: "Tacos", icon: "sun" },
  { id: "desserts", label: "Desserts", icon: "heart" },
];

export function getAllItems() {
  return restaurants.flatMap((r) =>
    r.menu.map((item) => ({ ...item, restaurantId: r.id, restaurantName: r.name }))
  );
}

export function getTrendingItems() {
  return getAllItems().filter((i) => i.trending);
}

export function getDealsItems() {
  return getAllItems().filter((i) => i.originalPrice);
}

export function getFeaturedRestaurants() {
  return restaurants.filter((r) => r.featured);
}

export function getTrendingRestaurants() {
  return restaurants.filter((r) => r.trending);
}
