import "dotenv/config";
import { z } from "zod";

const ConfigSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  FAKESTORE_BASE_URL: z.string().url().default("https://fakestoreapi.com"),
  PRODUCT_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  EMAIL_PROVIDER: z.enum(["console", "smtp", "ses"]).default("console"),
  SALES_INBOX_EMAIL: z.string().email().default("sales@example.com"),
  EMAIL_FROM: z.string().email().default("catalogue@example.com"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional()
});
export const config = ConfigSchema.parse(process.env);
