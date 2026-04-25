import type { NextFunction, Request, Response } from "express";

const DEFAULT_ALLOWED_ORIGINS = "http://localhost:3000";
const DEFAULT_ALLOWED_HEADERS = "Content-Type, Authorization";
const ALLOWED_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";

export function getAllowedOrigins(
  corsOrigin = process.env.CORS_ORIGIN || DEFAULT_ALLOWED_ORIGINS,
): string[] {
  return corsOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function createCorsMiddleware(allowedOrigins: string[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const origin = request.headers.origin;
    const isAllowed = origin ? isAllowedOrigin(origin, allowedOrigins) : false;

    if (origin && isAllowed) {
      response.header("Access-Control-Allow-Origin", origin);
      response.header("Access-Control-Allow-Credentials", "true");
      response.header("Access-Control-Allow-Methods", ALLOWED_METHODS);
      response.header(
        "Access-Control-Allow-Headers",
        requestedHeaders(request) || DEFAULT_ALLOWED_HEADERS,
      );
      response.header("Access-Control-Max-Age", "86400");
      response.header("Vary", "Origin");
    }

    if (request.method === "OPTIONS") {
      response.status(origin && !isAllowed ? 403 : 204).send();
      return;
    }

    next();
  };
}

export function isAllowedOrigin(
  origin: string,
  allowedOrigins: string[],
): boolean {
  if (allowedOrigins.includes(origin)) return true;

  try {
    const url = new URL(origin);
    return (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname.endsWith(".vercel.app") ||
      url.hostname === "rophim.com.mx" ||
      url.hostname.endsWith(".rophim.com.mx")
    );
  } catch {
    return false;
  }
}

function requestedHeaders(request: Request): string | undefined {
  const headers = request.headers["access-control-request-headers"];
  return Array.isArray(headers) ? headers.join(",") : headers;
}
