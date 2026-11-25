import type { Product } from "@catalogue/contracts";
export const products: Product[] = [
  { id: 1, title: "Alpha shirt", price: 20, description: "Cotton shirt", category: "men", image: "https://example.com/1.png", rating: { rate: 4.2, count: 10 } },
  { id: 2, title: "Beta jacket", price: 50, description: "Warm jacket", category: "men", image: "https://example.com/2.png", rating: { rate: 4.8, count: 5 } },
  { id: 3, title: "Gamma ring", price: 80, description: "Silver ring", category: "jewelery", image: "https://example.com/3.png", rating: { rate: 4.8, count: 20 } }
];
