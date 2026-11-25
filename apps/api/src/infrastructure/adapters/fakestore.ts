import { ProductSchema, type Product } from "@catalogue/contracts";
import type { ProductSource } from "../ports.js";
import { UpstreamUnavailableError } from "../../common.errors.js";
import { config } from "../../config.js";

export class FakeStoreAdapter implements ProductSource {
  private cache: { products: Product[]; expiresAt: number } | null = null;
  constructor(
    private readonly baseUrl = config.FAKESTORE_BASE_URL,
    private readonly ttlMs = config.PRODUCT_CACHE_TTL_SECONDS * 1000,
    private readonly fetcher: typeof fetch = fetch
  ) {}
  async listProducts(): Promise<Product[]> {
    if (this.cache && this.cache.expiresAt > Date.now()) return this.cache.products;
    try {
      const response = await this.fetcher(`${this.baseUrl}/products`, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error(`Fake Store returned ${response.status}`);
      const raw: unknown = await response.json();
      const products = ProductSchema.array().parse(raw);
      this.cache = { products, expiresAt: Date.now() + this.ttlMs };
      return products;
    } catch {
      throw new UpstreamUnavailableError();
    }
  }
  async getProductById(id: number): Promise<Product | null> {
    return (await this.listProducts()).find(product => product.id === id) ?? null;
  }
  async listCategories(): Promise<string[]> {
    return [...new Set((await this.listProducts()).map(product => product.category))].sort();
  }
}
