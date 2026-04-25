import type { Request, Response } from "express";

export const SESSION_COOKIE_NAME = "rophim_session";

const isProduction = process.env.NODE_ENV === "production";

export function getSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const sessionCookie = cookies.find((cookie) =>
    cookie.startsWith(`${SESSION_COOKIE_NAME}=`),
  );

  if (!sessionCookie) return null;
  return decodeURIComponent(sessionCookie.split("=").slice(1).join("="));
}

export function setSessionCookie(
  response: Response,
  sessionToken: string,
): void {
  response.cookie(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookie(response: Response): void {
  response.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
}
