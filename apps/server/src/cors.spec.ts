import type { NextFunction, Request, Response } from "express";
import { createCorsMiddleware } from "./cors";

describe("createCorsMiddleware", () => {
  it("responds to Vercel preflight requests with CORS headers", () => {
    const middleware = createCorsMiddleware(["http://localhost:3000"]);
    const headers: Record<string, string> = {};
    const next = jest.fn() as NextFunction;
    const response = {
      header: jest.fn((key: string, value: string) => {
        headers[key] = value;
        return response;
      }),
      send: jest.fn(),
      status: jest.fn(() => response),
    } as unknown as Response;
    const request = {
      headers: {
        "access-control-request-headers": "content-type",
        origin: "https://rophim.vercel.app",
      },
      method: "OPTIONS",
    } as unknown as Request;

    middleware(request, response, next);

    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(headers["Access-Control-Allow-Origin"]).toBe(
      "https://rophim.vercel.app",
    );
    expect(headers["Access-Control-Allow-Credentials"]).toBe("true");
    expect(headers["Access-Control-Allow-Headers"]).toBe("content-type");
  });
});
