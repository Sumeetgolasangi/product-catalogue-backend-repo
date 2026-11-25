import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config.js";
import { FakeStoreAdapter } from "./infrastructure/adapters/fakestore.js";
import { createEmailSender } from "./infrastructure/adapters/email.js";
import { CatalogueService } from "./services/catalogue.service.js";
import { EnquiryService } from "./services/enquiry.service.js";
import { createProductRouter } from "./routes/product.routes.js";
import { createEnquiryRouter } from "./routes/enquiry.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

export function createApp(deps?: { catalogue: CatalogueService; enquiries: EnquiryService }) {
  const app = express();
  const catalogue = deps?.catalogue ?? new CatalogueService(new FakeStoreAdapter());
  const enquiries = deps?.enquiries ?? new EnquiryService(createEmailSender());
  app.use(helmet());
  app.use(cors({ origin: config.CORS_ORIGIN.split(",").map(v => v.trim()) }));
  app.use(express.json({ limit: "10kb" }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/products", createProductRouter(catalogue));
  app.get("/api/categories", async (_req, res, next) => {
    try { res.json({ categories: await catalogue.categories() }); } catch (error) { next(error); }
  });
  app.use("/api/enquiries", createEnquiryRouter(enquiries));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
