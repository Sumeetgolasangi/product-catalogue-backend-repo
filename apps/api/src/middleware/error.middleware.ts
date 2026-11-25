import type { ErrorRequestHandler, RequestHandler } from "express";
import { z } from "zod";
import { UpstreamUnavailableError } from "../common.errors.js";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: { code: "ROUTE_NOT_FOUND", message: "Route not found" } });
};
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof z.ZodError) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Please check your input" } });
  if (error instanceof UpstreamUnavailableError) return res.status(503).json({ error: { code: "UPSTREAM_UNAVAILABLE", message: error.message } });
  console.error(error);
  return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "The request could not be completed" } });
};
