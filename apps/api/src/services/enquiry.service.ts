import type { Enquiry } from "@catalogue/contracts";
import type { EmailSender } from "../infrastructure/ports.js";
import { config } from "../config.js";

export class EnquiryService {
  constructor(private readonly email: EmailSender) {}
  async submit(enquiry: Enquiry): Promise<void> {
    const clean = (value: string) => value.replace(/[\r\n]/g, " ");
    await this.email.send({
      to: config.SALES_INBOX_EMAIL, from: config.EMAIL_FROM,
      replyTo: clean(enquiry.email),
      subject: `Product enquiry: ${clean(enquiry.productTitle)}`,
      text: `Product ID: ${enquiry.productId}\nProduct: ${enquiry.productTitle}\nName: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone ?? "Not provided"}\n\n${enquiry.message}`
    });
  }
}
