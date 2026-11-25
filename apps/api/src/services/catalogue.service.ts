import type { Product } from "@catalogue/contracts";
import type { ProductSource } from "../infrastructure/ports.js";

export function rankProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => b.rating.rate - a.rating.rate || b.rating.count - a.rating.count);
}
export class CatalogueService {
  constructor(private readonly source: ProductSource) {}
  async featured(): Promise<Product[]> {
    return rankProducts(await this.source.listProducts()).slice(0, 5);
  }
  async products(search?: string, category?: string): Promise<Product[]> {
    let products = await this.source.listProducts();
    if (category) products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (search) {
      const term = search.trim().toLowerCase();
      products = products.filter(p => [p.title, p.description, p.category].some(v => v.toLowerCase().includes(term)));
    }
    const ranked = rankProducts(products);
    return category ? ranked.map((p, i) => ({ ...p, isTopRated: i < 4 })) : ranked;
  }
  async product(id: number): Promise<Product | null> { return this.source.getProductById(id); }
  async categories(): Promise<string[]> { return this.source.listCategories(); }
}
