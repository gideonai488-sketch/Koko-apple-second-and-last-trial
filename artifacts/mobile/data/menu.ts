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
  calories?: string;
  prepTime?: string;
  isNew?: boolean;
}

export interface PromoSlide {
  id: string;
  title: string;
  subtitle: string;
  image: any;
  cta: string;
  tag: string;
}

export const restaurant = {
  name: "Bella Napoli",
  tagline: "Authentic wood-fired Italian cuisine",
  address: "24 Via Roma, Little Italy",
  phone: "+1 (555) 438-2901",
  hours: "Mon–Sun  11am – 10pm",
  rating: 4.8,
  reviewCount: 1240,
  deliveryTime: "25-35",
  deliveryFee: 1.99,
  minOrder: 12,
};

export const menuCategories = [
  "All",
  "Popular",
  "Pizza",
  "Pasta",
  "Starters",
  "Salads",
  "Desserts",
  "Drinks",
];

export const menuItems: MenuItem[] = [
  {
    id: "i1",
    name: "Margherita Pizza",
    description:
      "San Marzano tomatoes, fresh mozzarella di bufala, fragrant basil, extra-virgin olive oil, wood-fired to perfection",
    price: 16.99,
    originalPrice: 21.99,
    category: "Pizza",
    popular: true,
    trending: true,
    calories: "820 kcal",
    prepTime: "18 min",
    image: require("../assets/images/item_pizza.png"),
  },
  {
    id: "i2",
    name: "Diavola Pizza",
    description:
      "Spicy Calabrian salami, tomato sauce, fior di latte mozzarella, chilli flakes",
    price: 18.99,
    category: "Pizza",
    popular: true,
    calories: "940 kcal",
    prepTime: "18 min",
    image: require("../assets/images/item_pizza.png"),
  },
  {
    id: "i3",
    name: "Truffle Bianca Pizza",
    description:
      "White base, black truffle shavings, stracciatella cheese, wild mushrooms, fresh thyme",
    price: 22.99,
    category: "Pizza",
    isNew: true,
    calories: "780 kcal",
    prepTime: "20 min",
    image: require("../assets/images/item_pizza.png"),
  },
  {
    id: "i4",
    name: "Quattro Stagioni",
    description:
      "Artichokes, ham, mushrooms, olives, tomato sauce, mozzarella — four seasons on one pie",
    price: 19.99,
    category: "Pizza",
    calories: "900 kcal",
    prepTime: "18 min",
    image: require("../assets/images/item_pizza.png"),
  },
  {
    id: "i5",
    name: "Truffle Arancini (3pc)",
    description:
      "Crispy golden risotto balls stuffed with black truffle, mozzarella, and aged parmesan",
    price: 12.99,
    originalPrice: 15.99,
    category: "Starters",
    popular: true,
    calories: "420 kcal",
    prepTime: "10 min",
  },
  {
    id: "i6",
    name: "Bruschetta al Pomodoro",
    description:
      "Toasted sourdough, San Marzano tomatoes, fresh basil, aged balsamic, sea salt",
    price: 9.99,
    category: "Starters",
    calories: "290 kcal",
    prepTime: "8 min",
  },
  {
    id: "i7",
    name: "Burrata Caprese",
    description:
      "Hand-pulled burrata, heirloom tomatoes, fresh basil, basil oil, aged balsamic glaze",
    price: 14.99,
    category: "Starters",
    popular: true,
    isNew: true,
    calories: "380 kcal",
    prepTime: "6 min",
    image: require("../assets/images/item_pizza.png"),
  },
  {
    id: "i8",
    name: "Cacio e Pepe",
    description:
      "Tonnarelli pasta, aged Pecorino Romano, Parmigiano-Reggiano, generous cracked black pepper",
    price: 17.99,
    category: "Pasta",
    popular: true,
    trending: true,
    calories: "740 kcal",
    prepTime: "15 min",
  },
  {
    id: "i9",
    name: "Rigatoni Bolognese",
    description:
      "6-hour slow-cooked beef and pork ragu, bronze-die rigatoni, aged Parmigiano-Reggiano",
    price: 18.99,
    category: "Pasta",
    popular: true,
    calories: "860 kcal",
    prepTime: "15 min",
  },
  {
    id: "i10",
    name: "Pappardelle al Cinghiale",
    description:
      "Hand-rolled pappardelle, wild boar ragu, rosemary, red wine, juniper berries",
    price: 21.99,
    category: "Pasta",
    isNew: true,
    calories: "920 kcal",
    prepTime: "15 min",
  },
  {
    id: "i11",
    name: "Truffle Carbonara",
    description:
      "Rigatoni, guanciale, eggs, Pecorino, black truffle, cracked pepper",
    price: 20.99,
    originalPrice: 24.99,
    category: "Pasta",
    trending: true,
    calories: "880 kcal",
    prepTime: "15 min",
  },
  {
    id: "i12",
    name: "Burrata Salad",
    description:
      "Fresh burrata, heirloom tomatoes, arugula, basil oil, balsamic reduction, pine nuts",
    price: 14.99,
    category: "Salads",
    calories: "340 kcal",
    prepTime: "8 min",
    image: require("../assets/images/item_pizza.png"),
  },
  {
    id: "i13",
    name: "Rocket & Shaved Parmesan",
    description:
      "Wild rocket, shaved Parmigiano-Reggiano, lemon vinaigrette, toasted walnuts",
    price: 11.99,
    category: "Salads",
    calories: "280 kcal",
    prepTime: "6 min",
  },
  {
    id: "i14",
    name: "Classic Tiramisu",
    description:
      "Mascarpone cream, espresso-soaked Savoiardi ladyfingers, Valrhona cocoa, Marsala",
    price: 9.99,
    originalPrice: 13.99,
    category: "Desserts",
    popular: true,
    trending: true,
    calories: "460 kcal",
    prepTime: "5 min",
    image: require("../assets/images/item_dessert.png"),
  },
  {
    id: "i15",
    name: "Panna Cotta al Cioccolato",
    description:
      "Silky dark chocolate panna cotta, raspberry coulis, crushed pistachios",
    price: 8.99,
    category: "Desserts",
    isNew: true,
    calories: "380 kcal",
    prepTime: "5 min",
    image: require("../assets/images/item_dessert.png"),
  },
  {
    id: "i16",
    name: "San Pellegrino",
    description: "Sparkling mineral water, 500ml",
    price: 3.99,
    category: "Drinks",
    calories: "0 kcal",
    prepTime: "1 min",
  },
  {
    id: "i17",
    name: "Italian Lemonade",
    description: "Fresh squeezed lemons, sugar syrup, sparkling water, mint",
    price: 5.99,
    category: "Drinks",
    popular: true,
    calories: "120 kcal",
    prepTime: "3 min",
  },
  {
    id: "i18",
    name: "Espresso Martini",
    description:
      "Double espresso, vodka, Kahlúa, simple syrup — shaken cold",
    price: 12.99,
    category: "Drinks",
    isNew: true,
    calories: "190 kcal",
    prepTime: "3 min",
  },
];

export const promoSlides: PromoSlide[] = [
  {
    id: "p1",
    title: "25% Off All Pizzas",
    subtitle: "Today only · No minimum order",
    image: require("../assets/images/item_pizza.png"),
    cta: "Order Now",
    tag: "Flash Sale",
  },
  {
    id: "p2",
    title: "Free Delivery",
    subtitle: "On your first 3 orders · Code FIRST3",
    image: require("../assets/images/restaurant_italian.png"),
    cta: "Claim Offer",
    tag: "New Customer",
  },
  {
    id: "p3",
    title: "New: Truffle Bianca",
    subtitle: "Our most luxurious pizza yet",
    image: require("../assets/images/item_pizza.png"),
    cta: "Try It",
    tag: "New Arrival",
  },
];

export function getPopularItems() {
  return menuItems.filter((i) => i.popular);
}

export function getDealItems() {
  return menuItems.filter((i) => i.originalPrice);
}

export function getTrendingItems() {
  return menuItems.filter((i) => i.trending);
}

export function getNewItems() {
  return menuItems.filter((i) => i.isNew);
}

export function getItemsByCategory(category: string) {
  if (category === "All") return menuItems;
  if (category === "Popular") return getPopularItems();
  return menuItems.filter((i) => i.category === category);
}

export function findItem(id: string) {
  return menuItems.find((i) => i.id === id);
}
