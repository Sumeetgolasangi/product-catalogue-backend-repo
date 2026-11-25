import { describe, it, expect, vi } from "vitest";
import { EnquiryController } from "../../../controllers/enquiry.controller.js";
import { validEnquiry } from "../../fixtures/enquiry.fixture.js";
const response = () => { const res: any = { status: vi.fn(() => res), json: vi.fn(() => res) }; return res; };
describe("EnquiryController", () => {
  it("submits valid enquiry and returns 201", async () => {
    const service = { submit: vi.fn() };
    const res = response();
    await new EnquiryController(service as any).submit({ body: validEnquiry } as any, res, vi.fn());
    expect(service.submit).toHaveBeenCalledWith(validEnquiry);
    expect(res.status).toHaveBeenCalledWith(201);
  });
  it("rejects invalid body", async () => {
    const next = vi.fn();
    await new EnquiryController({} as any).submit({ body: { email: "bad" } } as any, response(), next);
    expect(next).toHaveBeenCalled();
  });
  it("rejects honeypot submissions", async () => {
    const res = response();
    await new EnquiryController({ submit: vi.fn() } as any).submit({ body: { ...validEnquiry, website: "bot" } } as any, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
