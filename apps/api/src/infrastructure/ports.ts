import type { Enquiry, Product } from "@catalogue/contracts";
export interface ProductSource {
  listProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | null>;
  listCategories(): Promise<string[]>;
}
export interface EmailSender {
  send(message: { to: string; from: string; subject: string; text: string; replyTo?: string }): Promise<void>;
}
export type EnquiryInput = Enquiry;
