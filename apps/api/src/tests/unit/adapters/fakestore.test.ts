import { describe, it, expect, vi } from "vitest";
import { FakeStoreAdapter } from "../../../infrastructure/adapters/fakestore.js";
import { products } from "../../fixtures/products.fixture.js";
describe("FakeStoreAdapter", () => {
  it("fetches and caches valid products", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => products });
    const adapter = new FakeStoreAdapter("https://example.com", 10000, fetcher as any);
    expect(await adapter.listProducts()).toEqual(products);
    expect(await adapter.listProducts()).toEqual(products);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("maps upstream failure to UpstreamUnavailableError", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    const adapter = new FakeStoreAdapter("https://example.com", 10000, fetcher as any);
    await expect(adapter.listProducts()).rejects.toThrow("temporarily unavailable");
  });
  it("finds product and derives sorted unique categories", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => products });
    const adapter = new FakeStoreAdapter("https://example.com", 10000, fetcher as any);
    expect((await adapter.getProductById(2))?.title).toBe("Beta jacket");
    expect(await adapter.listCategories()).toEqual(["jewelery", "men"]);
  });
});
