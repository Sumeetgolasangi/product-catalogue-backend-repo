import type { Request, Response, NextFunction } from "express";
import { ProductIdParamsSchema, ProductQuerySchema } from "@catalogue/contracts";
import type { CatalogueService } from "../services/catalogue.service.js";

export class ProductController {
  constructor(private readonly catalogue: CatalogueService) {}
  featured = async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json({ products: await this.catalogue.featured() }); } catch (error) { next(error); }
  };
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = ProductQuerySchema.parse(req.query);
      res.json({ products: await this.catalogue.products(query.search, query.category) });
    } catch (error) { next(error); }
  };
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = ProductIdParamsSchema.parse(req.params);
      const product = await this.catalogue.product(id);
      if (!product) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Product not found" } });
      return res.json(product);
    } catch (error) { next(error); }
  };
  categories = async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json({ categories: await this.catalogue.categories() }); } catch (error) { next(error); }
  };
}
