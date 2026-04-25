import { NextRequest } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://rophim-server.onrender.com";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxyBackend(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const targetUrl = new URL(
    path.join("/"),
    `${API_BASE_URL.replace(/\/$/, "")}/`,
  );
  targetUrl.search = request.nextUrl.search;

  const requestHeaders = new Headers();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");
  const cookie = request.headers.get("cookie");

  if (contentType) requestHeaders.set("content-type", contentType);
  if (accept) requestHeaders.set("accept", accept);
  if (cookie) requestHeaders.set("cookie", cookie);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers: requestHeaders,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const responseContentType = upstreamResponse.headers.get("content-type");
  if (responseContentType) {
    responseHeaders.set("content-type", responseContentType);
  }

  const upstreamHeaders = upstreamResponse.headers as Headers & {
    getSetCookie?: () => string[];
  };
  const setCookies =
    upstreamHeaders.getSetCookie?.() ||
    [upstreamResponse.headers.get("set-cookie")].filter(Boolean);

  for (const setCookie of setCookies) {
    responseHeaders.append("set-cookie", setCookie);
  }

  return new Response(await upstreamResponse.arrayBuffer(), {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export const GET = proxyBackend;
export const POST = proxyBackend;
export const PUT = proxyBackend;
export const PATCH = proxyBackend;
export const DELETE = proxyBackend;
export const OPTIONS = proxyBackend;
