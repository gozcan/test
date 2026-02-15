import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { AppError } from "./errors";

export function requestContext(req: Request, res: Response, next: NextFunction): void {
  const requestIdHeader = req.header("x-request-id");
  const requestId = requestIdHeader && requestIdHeader.trim().length > 0 ? requestIdHeader : randomUUID();
  res.locals.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
    request_id: res.locals.requestId,
  });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      request_id: res.locals.requestId,
    });
    return;
  }

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Unexpected error",
    },
    request_id: res.locals.requestId,
  });
}
