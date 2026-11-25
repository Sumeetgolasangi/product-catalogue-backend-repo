import { describe, it, expect, vi } from "vitest";
import { EnquiryService } from "../../../services/enquiry.service.js";
import type { EmailSender } from "../../../infrastructure/ports.js";
import { validEnquiry } from "../../fixtures/enquiry.fixture.js";

describe("EnquiryService", () => {
  it("sends a formatted email and sanitizes CR/LF in subject and reply-to", async () => {
    const email: EmailSender = { send: vi.fn().mockResolvedValue(undefined) };
    await new EnquiryService(email).submit({ ...validEnquiry, productTitle: "Alpha\r\nInjected", email: "test@example.com\r\nBcc:x" });
    const message = vi.mocked(email.send).mock.calls[0][0];
    expect(message.subject).not.toContain("\r");
    expect(message.replyTo).not.toContain("\n");
    expect(message.text).toContain("I would like more information.");
  });
  it("propagates email provider failures", async () => {
    const email: EmailSender = { send: vi.fn().mockRejectedValue(new Error("SMTP down")) };
    await expect(new EnquiryService(email).submit(validEnquiry)).rejects.toThrow("SMTP down");
  });
});
