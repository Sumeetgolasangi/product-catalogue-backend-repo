import { describe, it, expect } from "vitest";
import { config } from "../../config.js";
describe("configuration", () => {
  it("exposes validated defaults", () => {
    expect(config.PORT).toBeGreaterThan(0);
    expect(config.FAKESTORE_BASE_URL).toMatch(/^https?:/);
    expect(["console", "smtp", "ses"]).toContain(config.EMAIL_PROVIDER);
  });
});
