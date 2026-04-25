"use client";

const RENDER_API_BASE_URL = "https://rophim-server.onrender.com";
const BACKEND_PROXY_BASE_URL = "/api/backend";

export interface MemberUser {
  id: string;
  email: string;
  name: string;
}

export interface FavoriteItem {
  id: string;
  movieSlug: string;
  movieTitle: string;
  posterUrl?: string;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  movieSlug: string;
  movieTitle: string;
  body: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface WatchHistoryItem {
  id: string;
  movieSlug: string;
  movieTitle: string;
  posterUrl?: string;
  episodeName: string;
  progressSeconds: number;
  updatedAt: string;
}

export interface MoviePayload {
  movieSlug: string;
  movieTitle: string;
  posterUrl?: string;
}

export const memberApiBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost") {
      return configuredUrl?.replace(/\/$/, "") || "http://localhost:3001";
    }

    return BACKEND_PROXY_BASE_URL;
  }

  return configuredUrl?.replace(/\/$/, "") || RENDER_API_BASE_URL;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${memberApiBaseUrl()}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(
      payload?.message || "Không thể kết nối tài khoản thành viên",
    );
  }

  return response.json() as Promise<T>;
}

export const memberClient = {
  async me() {
    return request<{ user: MemberUser | null }>("/auth/me");
  },
  async register(input: { email: string; name: string; password: string }) {
    return request<{ user: MemberUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async login(input: { email: string; password: string }) {
    return request<{ user: MemberUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async logout() {
    return request<{ ok: true }>("/auth/logout", {
      method: "POST",
    });
  },
  async toggleFavorite(input: MoviePayload) {
    return request<{ favorited: boolean }>("/member/favorites/toggle", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async saveFavorite(input: MoviePayload) {
    return request<{ favorited: boolean }>("/member/favorites", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async favorites() {
    return request<{ items: FavoriteItem[] }>("/member/favorites");
  },
  async history() {
    return request<{ items: WatchHistoryItem[] }>("/member/history");
  },
  async comments(movieSlug: string) {
    return request<{ items: CommentItem[] }>(
      `/member/comments?movieSlug=${encodeURIComponent(movieSlug)}`,
    );
  },
  async createComment(input: MoviePayload & { body: string }) {
    return request<{ item: CommentItem }>("/member/comments", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async saveHistory(
    input: MoviePayload & { episodeName: string; progressSeconds?: number },
  ) {
    return request<{ item: unknown }>("/member/history", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};
