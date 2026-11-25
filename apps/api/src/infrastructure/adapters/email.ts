import nodemailer from "nodemailer";
import type { EmailSender } from "../ports.js";
import { config } from "../../config.js";

export class ConsoleEmailSender implements EmailSender {
  async send(message: Parameters<EmailSender["send"]>[0]): Promise<void> {
    console.info("[Enquiry email]", JSON.stringify(message, null, 2));
  }
}
export class SmtpEmailSender implements EmailSender {
  private transporter = nodemailer.createTransport({
    host: config.SMTP_HOST, port: config.SMTP_PORT ?? 587,
    auth: config.SMTP_USER ? { user: config.SMTP_USER, pass: config.SMTP_PASS } : undefined
  });
  async send(message: Parameters<EmailSender["send"]>[0]): Promise<void> {
    await this.transporter.sendMail(message);
  }
}
export function createEmailSender(): EmailSender {
  if (config.EMAIL_PROVIDER === "smtp") return new SmtpEmailSender();
  return new ConsoleEmailSender();
}
