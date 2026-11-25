import { Router } from "express";
import rateLimit from "express-rate-limit";
import { EnquiryController } from "../controllers/enquiry.controller.js";
import type { EnquiryService } from "../services/enquiry.service.js";

export function createEnquiryRouter(enquiries: EnquiryService): Router {
  const router = Router();
  const controller = new EnquiryController(enquiries);
  router.post("/", rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 }), controller.submit);
  return router;
}
