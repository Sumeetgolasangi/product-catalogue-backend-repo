import { describe, it, expect, vi } from "vitest";
import { ProductController } from "../../../controllers/product.controller.js";
import { products } from "../../fixtures/products.fixture.js";
function response() {
  const res: any = { status: vi.fn(() => res), json: vi.fn(() => res) };
  return res;
}
describe("ProductController", () => {
  it("returns featured products", async () => {
    const service: any = { featured: vi.fn().mockResolvedValue(products) };
    const res = response();
    await new ProductController(service).featured({} as any, res, vi.fn());
    expect(res.json).toHaveBeenCalledWith({ products });
  });
  it("passes validated query values to service", async () => {
    const service: any = { products: vi.fn().mockResolvedValue(products) };
    const res = response();
    await new ProductController(service).list({ query: { search: "alpha" } } as any, res, vi.fn());
    expect(service.products).toHaveBeenCalledWith("alpha", undefined);
  });
  it("forwards invalid query errors", async () => {
    const next = vi.fn();
    await new ProductController({} as any).list({ query: { search: "x".repeat(201) } } as any, response(), next);
    expect(next).toHaveBeenCalled();
  });
  it("returns 404 for unknown product", async () => {
    const res = response();
    await new ProductController({ product: vi.fn().mockResolvedValue(null) } as any).getById({ params: { id: "999" } } as any, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
  it("returns product when found", async () => {
    const res = response();
    await new ProductController({ product: vi.fn().mockResolvedValue(products[0]) } as any).getById({ params: { id: "1" } } as any, res, vi.fn());
    expect(res.json).toHaveBeenCalledWith(products[0]);
  });
});
