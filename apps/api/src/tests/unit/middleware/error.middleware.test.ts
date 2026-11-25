import { describe, it, expect, vi } from "vitest";
import { ZodError } from "zod";
import { errorHandler, notFoundHandler } from "../../../middleware/error.middleware.js";
import { UpstreamUnavailableError } from "../../../common.errors.js";
const response = () => { const res: any = { status: vi.fn(() => res), json: vi.fn(() => res) }; return res; };
describe("HTTP error middleware", () => {
  it("maps validation errors to 400", () => {
    const res = response();
    errorHandler(new ZodError([]), {} as any, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });
  it("maps upstream errors to 503", () => {
    const res = response();
    errorHandler(new UpstreamUnavailableError(), {} as any, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(503);
  });
  it("maps unknown errors to 500", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = response();
    errorHandler(new Error("secret"), {} as any, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    log.mockRestore();
  });
  it("returns standard route not found response", () => {
    const res = response();
    notFoundHandler({} as any, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
