import { beforeEach, describe, it, expect, vi } from "vitest";
import { CatalogueService, rankProducts } from "../../../services/catalogue.service.js";
import type { ProductSource } from "../../../infrastructure/ports.js";
import { products } from "../../fixtures/products.fixture.js";

const makeSource = (): ProductSource => ({
  listProducts: vi.fn().mockResolvedValue(products),
  getProductById: vi.fn(async id => products.find(p => p.id === id) ?? null),
  listCategories: vi.fn().mockResolvedValue(["jewelery", "men"])
});

describe("CatalogueService", () => {
  let source: ProductSource;
  beforeEach(() => { source = makeSource(); });

  it("ranks by rating then count without mutating input", () => {
    const input = [...products];
    expect(rankProducts(input).map(p => p.id)).toEqual([3, 2, 1]);
    expect(input.map(p => p.id)).toEqual([1, 2, 3]);
  });
  it("returns top five featured products", async () => {
    expect((await new CatalogueService(source).featured()).map(p => p.id)).toEqual([3, 2, 1]);
  });
  it("filters by case-insensitive category and marks top rated", async () => {
    const result = await new CatalogueService(source).products(undefined, "MEN");
    expect(result.map(p => p.id)).toEqual([2, 1]);
    expect(result.every(p => p.isTopRated !== undefined)).toBe(true);
  });
  it("searches title, description and category", async () => {
    expect((await new CatalogueService(source).products("cotton")).map(p => p.id)).toEqual([1]);
  });
  it("delegates product and category lookups", async () => {
    const service = new CatalogueService(source);
    expect((await service.product(2))?.title).toBe("Beta jacket");
    expect(await service.categories()).toEqual(["jewelery", "men"]);
  });
});
