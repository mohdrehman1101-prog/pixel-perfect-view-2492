const dishPhotos = import.meta.glob<{ url: string }>("../assets/dishes/*.png.asset.json", { eager: true, import: "default" });
const photoByName = Object.fromEntries(
  Object.entries(dishPhotos).map(([path, photo]) => [path.split("/").pop()?.replace(/\.png\.asset\.json$/, ""), photo.url]),
);

export type MenuItem = {
  id: string;
  name: string;
  price: string;
  description?: string | undefined;
  label?: string | undefined;
  category: string;
  veg: boolean;
  image?: string;
};

type Raw = [name: string, price: string, description?: string | undefined, label?: string | undefined];

const CATEGORIES: { name: string; icon: string; items: Raw[]; note?: string; label?: string }[] = [
  {
    name: "Pizzeria Mode",
    icon: "🍕",
    items: [
      ["Tripple Cheese Pizza", "199"],
      ["Vegetable Verona Pizza", "249"],
      ["Cheese Corn Pizza", "229"],
      ["Tandoori Paneer Pizza", "239", undefined, "MUST TRY"],
      ["Peri Peri Paneer Pizza", "249"],
      ["Chicken Tikka Pizza", "289"],
      ["Chicken Keema Pizza", "299", undefined, "MUST TRY"],
      ["Add on Vegetable", "30"],
      ["Add on Cheese", "50"],
      ["Extra Dip", "29"],
    ],
  },
  {
    name: "Chinese",
    icon: "🥡",
    note: "Add on Chicken — ₹80",
    items: [
      ["Crispy Corn", "149"],
      ["Honey Chilli Potato", "159"],
      ["Veg Noodles", "169"],
      ["Hakka Noodles", "179"],
      ["Garlic Noodles", "179"],
      ["Fried Rice", "169"],
      ["Chilli Paneer", "199"],
      ["Chilli Chicken", "209"],
      ["Maggi Ramen Bowl", "169", undefined, "CHEF CHOICE"],
      ["Asian Bowl", "209"],
      ["Burrito Bliss Bowl", "209"],
      ["Lemon Pepper Chicken", "209"],
      ["Dragon Paneer", "209", undefined, "CHEF CHOICE"],
      ["Dragon Chicken", "269", undefined, "CHEF CHOICE"],
      ["Add on Chicken", "80"],
    ],
  },
  {
    name: "Bruschetta",
    icon: "🥖",
    items: [
      ["Tomato Garlic Basil Bruschetta", "119"],
      ["Mince Chicken Bruschetta", "129"],
    ],
  },
  {
    name: "Sandwich",
    icon: "🥪",
    items: [
      ["Veggie Sandwich (Cold Serve)", "149"],
      ["Cheese & Corn Sandwich", "169"],
      ["Sunrise Egg Sandwich", "169"],
      ["Spinach Corn Sandwich", "189"],
      ["Creamy Mushroom Sandwich", "199"],
      ["Smoky Paneer Sandwich", "199"],
      ["Chicken Tikka Sandwich", "229"],
      ["Crispy Chicken Sandwich", "209"],
      ["Peri Peri Chicken Sandwich", "219"],
      ["Chicken Keema Sandwich", "229"],
      ["Extra Dip", "29"],
    ],
  },
  {
    name: "Burger",
    icon: "🍔",
    items: [
      ["Classic Aloo Tikki Burger", "129"],
      ["American Burger", "139"],
      ["Mushroom Sloppy Joy Burger", "169"],
      ["Peri Peri Paneer Burger", "169"],
      ["Crispy Chicken Burger", "199"],
      ["Smash Chicken Burger", "209"],
    ],
  },
  {
    name: "Iced Black Coffee",
    icon: "🧋",
    items: [
      ["Iced Black Coffee", "129", "Pure black coffee served chilled"],
      ["Citrus Spark Americano", "149", "Refreshing iced Americano with citrus twist"],
      ["Berry Blast Americano", "149", "Fruity iced Americano with berry flavor"],
      ["Minty Fresh Brew", "149", "Cool coffee infused with refreshing mint"],
    ],
  },
  {
    name: "Cold Brew",
    icon: "🧋",
    items: [
      ["Cold Brew", "159", "Slow-steeped coffee with smooth flavor"],
      ["Mocha Chilled Brew", "159", "Chilled espresso with chocolate and milk"],
      ["Citrus Cold Brew", "159", "Cold brew infused with fresh citrus notes"],
      ["Cranberry Cold Brew", "169", "Cold brew with a sweet-tart cranberry twist"],
      ["Citrus Mocha", "169"],
      ["Pomegranate Cold Brew", "179"],
      ["Tonic Cold Brew", "199", "Cold brew with tonic water for a fizzy kick"],
    ],
  },
  {
    name: "Cold Coffee",
    icon: "🧋",
    items: [
      ["Creamy Frappuccino", "149"],
      ["Classic Vanilla Cold Coffee", "169"],
      ["Hazelnut Frappe", "179"],
      ["Caramel Frappe", "179"],
      ["Dark Mocha", "189"],
      ["Choco Chip Frappe", "199"],
      ["Nutty Choco Frappe", "209"],
      ["Almond Frappe", "219"],
    ],
  },
  {
    name: "Coolers",
    icon: "🥤",
    items: [
      ["Virgin Mojito", "149"],
      ["Green Apple", "149"],
      ["Watermelon Hydration", "149"],
      ["Strawberry Mojito", "149"],
      ["Ginger Ale", "149"],
      ["Tonic Water", "149"],
      ["Fresh Lime Soda", "149"],
      ["Passion Fruit", "159"],
      ["Orange & Cranberry", "159"],
      ["Pomegranate Fizz", "159"],
      ["Redbull Mojito", "229"],
    ],
  },
  {
    name: "Eggs",
    icon: "🍳",
    items: [
      ["Morning Sunshine Egg White Bowl", "119"],
      ["The Bhurji Bowl", "119"],
      ["Masala Egg Fold", "119"],
      ["Royal Egg Affair", "119"],
      ["Anda Dabang with Pav", "129"],
      ["Chicken Keema Omelette", "149"],
    ],
  },
  {
    name: "Bites / Small Plates",
    icon: "🍟",
    items: [
      ["Farmhouse Potato Bites", "109"],
      ["Peri-Peri Potato Bites", "119"],
      ["Cheesy Potato Bites", "129"],
      ["Chicken Loaded Potato Bites", "149"],
      ["Chicken Pop Corn", "149"],
    ],
  },
  {
    name: "Platter",
    icon: "🍽️",
    note: "Choice of Sauce: Barbeque · Chilly Garlic · Peri Peri · Butter Garlic",
    items: [
      ["Hummus with Pita Bread", "189/219"],
      ["Grilled Paneer", "229"],
      ["Grilled Fish", "239"],
      ["Grilled Chicken", "259"],
      ["Chicken Wings (5pc)", "239", undefined, "MUST TRY"],
      ["Add on Rice", "49"],
    ],
  },
  {
    name: "Shake Laboratory",
    icon: "🥛",
    items: [
      ["Creamy Cookie Shake", "189"],
      ["Oreo Shakes", "189"],
      ["Silky Strawberry Shake", "209"],
      ["Kit-Kat Shake", "209"],
      ["Dark Mocha Shake", "209"],
      ["Blue Berry Shake", "209"],
      ["Nutella Shake", "219"],
      ["Biscoff Shake", "229"],
      ["Belgium Chocolate Shake", "229"],
    ],
  },
  {
    name: "Smoothies",
    icon: "🍓",
    items: [
      ["Mint Blueberry Smoothie", "249", "Refreshing blueberry smoothie with mint twist"],
      ["Nature Blend Smoothie", "249", "Mixed fruit smoothie packed with natural goodness"],
      ["Peanut Butter Dry Fruits Smoothie", "249", "Nutty smoothie with peanut butter and dry fruits"],
      ["Nutty Protein Smoothie", "249", "Protein-rich smoothie with nuts and energy boost"],
    ],
  },
  {
    name: "Waffle",
    icon: "🧇",
    items: [
      ["One serve of Waffle", "149"],
      ["Two serve of Waffle", "179"],
      ["Oreo", "199"],
      ["Kit Kat Crunch", "219"],
      ["Nutella Loaded", "219"],
      ["Biscoff", "229"],
      ["Death by Chocolate", "229"],
      ["Double Delight", "249"],
    ],
  },
  {
    name: "Cheese Cake",
    icon: "🍰",
    label: "BNL SPECIAL",
    items: [
      ["Blueberry Cheese Cake", "199"],
      ["Biscoff Cheese Cake", "199"],
      ["Nutella Cheese Cake", "199"],
    ],
  },
  {
    name: "Bakery & Dessert",
    icon: "🧁",
    items: [
      ["Strawberry Swiss Roll", "89"],
      ["Pineapple Pastry", "99"],
      ["Choco Chip Pastry", "99"],
      ["Choco Mini Ball Pastry", "109"],
      ["Pista Kaju Pastry", "109"],
      ["Doughnut", "79"],
      ["Chocolava", "79"],
      ["Walnut Brownie", "99"],
      ["Sizzling Brownie with Icecream", "199"],
    ],
  },
  {
    name: "Momo's",
    icon: "🥟",
    items: [
      ["Veggie Momo", "129"],
      ["Kurkure Momo", "179"],
      ["Butter Garlic Momo", "199", undefined, "MUST TRY"],
      ["Cheese & Corn Momo", "189"],
    ],
  },
  {
    name: "Wraps",
    icon: "🌯",
    items: [
      ["Aloo Wrap Express", "159"],
      ["Mix Veg", "179"],
      ["Paneer Bhurji", "189"],
      ["Masala Keema", "209"],
      ["Shawarma Chicken", "209"],
      ["Grilled Fajita Wrap", "179/209"],
    ],
  },
  {
    name: "Pasta",
    icon: "🍝",
    note: "Choice of Pasta: Penne · Spaghetti",
    items: [
      ["Arrabiata Pasta", "269"],
      ["Alfredo Pasta", "269"],
      ["Aglio-e-Olio Pasta", "269"],
      ["Pink Sauce Pasta", "269"],
      ["Mac & Cheese Pasta", "299", undefined, "MUST TRY"],
      ["Add on Chicken", "79"],
      ["Add on Vegetable", "49"],
    ],
  },
  {
    name: "Soups",
    icon: "🍲",
    items: [
      ["Mushroom Soup", "149"],
      ["Tomato Soup", "149"],
      ["Hot & Sour Soup", "149"],
    ],
  },
  {
    name: "Nachos",
    icon: "🧆",
    items: [
      ["Crunchy Nachos Bites", "149"],
      ["Melty Cheese Nachos", "169"],
      ["Nachos Overload", "179"],
    ],
  },
  {
    name: "Fries",
    icon: "🍟",
    items: [
      ["Classic Fries", "119"],
      ["Peri-Peri Fries", "129"],
      ["Cheesy Fries", "139"],
      ["Chicken Cheesy Fries", "159"],
      ["Extra Dip", "29"],
    ],
  },
  {
    name: "Bread & More",
    icon: "🥯",
    items: [
      ["Korean Bun", "99"],
      ["Garlic Bread", "99"],
      ["Cheesy Garlic Bread", "129"],
      ["Chilly Garlic Bread", "129"],
      ["Cheese Corn Garlic Bread", "139"],
    ],
  },
  {
    name: "Hot Coffee (Black)",
    icon: "☕",
    items: [
      ["Espresso", "99", "Coffee shot"],
      ["Macchiato", "99", "Coffee shot with milk or foam"],
      ["Americano", "109", "Black coffee"],
      ["Affagatto", "139", "No milk"],
    ],
  },
  {
    name: "Hot Coffee (With Milk)",
    icon: "☕",
    note: "Addon: Extra Shot — ₹49",
    items: [
      ["Cappuccino", "129"],
      ["Cafe Latte", "139"],
      ["Cafe Mocha", "149"],
      ["Caramel Macchiato", "159"],
      ["Spanish Latte", "159"],
      ["Hazelnut Latte", "159"],
      ["Caramel Latte", "159"],
      ["Irish Latte", "159"],
      ["Vanilla Latte", "169"],
      ["Kanpur Special Latte", "159"],
      ["Hot Chocolate", "159"],
      ["Addon: Extra Shot", "49"],
    ],
  },
];

const NON_VEG = /chicken|keema|fish|egg|anda|omelette|shawarma|bhurji/i;

function isVeg(name: string) {
  if (/paneer bhurji/i.test(name)) return true;
  return !NON_VEG.test(name);
}

export const categories = CATEGORIES.map((c) => ({ name: c.name, icon: c.icon, note: c.note }));

let itemCounter = 0;

export const menuItems: MenuItem[] = CATEGORIES.flatMap((c) =>
  c.items.map(([name, price, description, label]) => {
    const veg = isVeg(name);
    return {
      id: `item-${itemCounter++}`,
      name,
      price,
      description,
      label: label ?? c.label,
      category: c.name,
      veg,
      image: photoByName[name],
    };
  }),
);

export function getItem(id: string) {
  return menuItems.find((i) => i.id === id);
}

export function getCategory(name: string) {
  return categories.find((c) => c.name === name);
}

export function getCategoryItems(name: string) {
  return menuItems.filter((i) => i.category === name);
}
