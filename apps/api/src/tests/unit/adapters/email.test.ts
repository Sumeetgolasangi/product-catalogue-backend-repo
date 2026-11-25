import { describe, it, expect, vi } from "vitest";
import { ConsoleEmailSender, createEmailSender } from "../../../infrastructure/adapters/email.js";
describe("Email adapters", () => {
  it("writes console email message", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    await new ConsoleEmailSender().send({ to: "a@b.com", from: "c@d.com", subject: "Hello", text: "Body" });
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });
  it("creates configured sender", () => {
    expect(createEmailSender()).toBeInstanceOf(ConsoleEmailSender);
  });
});
