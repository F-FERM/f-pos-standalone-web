export interface CategoryItem {
  id: string;
  label: string;
  icon: "combo" | "snacks" | "cake" | "scoop" | "burger";
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryId: string;
}

export interface CartLine {
  product: Product;
  qty: number;
}

// Matches the repeating rail shown in the Figma reference (Scoop active).
export const CATEGORIES: CategoryItem[] = [
  { id: "combo", label: "Combo", icon: "combo" },
  { id: "snacks", label: "Snakes", icon: "snacks" },
  { id: "cake-1", label: "Cake & Wafers", icon: "cake" },
  { id: "scoop", label: "Scoop", icon: "scoop" },
  { id: "burger-1", label: "Burgers & Pizza", icon: "burger" },
  { id: "cake-2", label: "Cake & Wafers", icon: "cake" },
  { id: "burger-2", label: "Burgers & Pizza", icon: "burger" },
];

export const FILTER_TABS = ["All", "Scoop", "Corn", "Stick"] as const;

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Butter scotch crunch", price: 200, image: "/images/scoops/butterscotch.jpg", categoryId: "scoop" },
  { id: "p2", name: "Vanilla Classic", price: 80, image: "/images/scoops/vanilla.jpg", categoryId: "scoop" },
  { id: "p3", name: "chocolate chip", price: 200, image: "/images/scoops/choc-chip.jpg", categoryId: "scoop" },
  { id: "p4", name: "cookies and cream", price: 180, image: "/images/scoops/cookies-cream.jpg", categoryId: "scoop" },
  { id: "p5", name: "rocky road", price: 220, image: "/images/scoops/rocky-road.jpg", categoryId: "scoop" },
  { id: "p6", name: "peanut butter", price: 90, image: "/images/scoops/peanut-butter.jpg", categoryId: "scoop" },
  { id: "p7", name: "pistachio", price: 100, image: "/images/scoops/pistachio.jpg", categoryId: "scoop" },
  { id: "p8", name: "mint chocolate", price: 100, image: "/images/scoops/mint-choc.jpg", categoryId: "scoop" },

];