import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "../../app.js";
import { products } from "../fixtures/products.fixture.js";
import { validEnquiry } from "../fixtures/enquiry.fixture.js";

function setup() {
  const catalogue: any = {
    featured: vi.fn().mockResolvedValue(products),
    products: vi.fn(async (search?: string, category?: string) => products.filter(p =>
      (!search || `${p.title} ${p.description}`.toLowerCase().includes(search.toLowerCase())) &&
      (!category || p.category.toLowerCase() === category.toLowerCase())
    )),
    product: vi.fn(async (id: number) => products.find(p => p.id === id) ?? null),
    categories: vi.fn().mockResolvedValue(["jewelery", "men"])
  };
  const enquiries: any = { submit: vi.fn().mockResolvedValue(undefined) };
  return { app: createApp({ catalogue, enquiries }), catalogue, enquiries };
}
describe("Catalogue API E2E", () => {
  it("GET /api/health returns healthy status", async () => {
    const { app } = setup();
    await request(app).get("/api/health").expect(200, { status: "ok" });
  });
  it("GET /api/products returns products", async () => {
    const { app } = setup();
    const response = await request(app).get("/api/products").expect(200);
    expect(response.body.products).toHaveLength(3);
  });
  it("GET /api/products?search filters products", async () => {
    const { app } = setup();
    const response = await request(app).get("/api/products?search=cotton").expect(200);
    expect(response.body.products.map((p: any) => p.id)).toEqual([1]);
  });
  it("GET /api/products?category filters category", async () => {
    const { app } = setup();
    const response = await request(app).get("/api/products?category=men").expect(200);
    expect(response.body.products).toHaveLength(2);
  });
  it("GET /api/products/featured returns featured list", async () => {
    const { app } = setup();
    await request(app).get("/api/products/featured").expect(200);
  });
  it("GET /api/products/:id returns a product", async () => {
    const { app } = setup();
    const response = await request(app).get("/api/products/1").expect(200);
    expect(response.body.id).toBe(1);
  });
  it("GET /api/products/:id returns 404 when absent", async () => {
    const { app } = setup();
    await request(app).get("/api/products/999").expect(404);
  });
  it("GET /api/products/:id rejects invalid id", async () => {
    const { app } = setup();
    await request(app).get("/api/products/nope").expect(400);
  });
  it("GET /api/categories returns categories", async () => {
    const { app } = setup();
    const response = await request(app).get("/api/categories").expect(200);
    expect(response.body.categories).toEqual(["jewelery", "men"]);
  });
  it("POST /api/enquiries accepts valid enquiry", async () => {
    const { app, enquiries } = setup();
    await request(app).post("/api/enquiries").send(validEnquiry).expect(201);
    expect(enquiries.submit).toHaveBeenCalled();
  });
  it("POST /api/enquiries rejects invalid body", async () => {
    const { app } = setup();
    await request(app).post("/api/enquiries").send({ email: "bad" }).expect(400);
  });
  it("POST /api/enquiries rejects honeypot", async () => {
    const { app } = setup();
    await request(app).post("/api/enquiries").send({ ...validEnquiry, website: "spam" }).expect(400);
  });
  it("unknown route returns 404", async () => {
    const { app } = setup();
    await request(app).get("/missing").expect(404);
  });
});
