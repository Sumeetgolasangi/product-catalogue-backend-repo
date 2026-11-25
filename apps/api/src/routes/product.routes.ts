import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import type { CatalogueService } from "../services/catalogue.service.js";

export function createProductRouter(catalogue: CatalogueService): Router {
  const router = Router();
  const controller = new ProductController(catalogue);
  router.get("/featured", controller.featured);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  return router;
}
