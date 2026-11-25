import type { Request, Response, NextFunction } from "express";
import { EnquirySchema } from "@catalogue/contracts";
import type { EnquiryService } from "../services/enquiry.service.js";

export class EnquiryController {
  constructor(private readonly enquiries: EnquiryService) {}
  submit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const enquiry = EnquirySchema.parse(req.body);
      if (enquiry.website) return res.status(400).json({ error: { code: "INVALID_SUBMISSION", message: "Invalid submission" } });
      await this.enquiries.submit(enquiry);
      return res.status(201).json({ message: "Thank you. Your enquiry has been sent." });
    } catch (error) { next(error); }
  };
}
