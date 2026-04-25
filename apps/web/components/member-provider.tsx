"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { X } from "lucide-react";
import Link from "next/link";
import {
  memberClient,
  type FavoriteItem,
  type MemberUser,
  type WatchHistoryItem,
} from "@/lib/member-client";

interface MemberContextValue {
  user: MemberUser | null;
  loading: boolean;
  openAuth: (mode?: "login" | "register") => void;
  openLibrary: (view: "favorites" | "history") => void;
  logout: () => Promise<void>;
}

const MemberContext = createContext<MemberContextValue | null>(null);

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MemberUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [libraryView, setLibraryView] = useState<
    "favorites" | "history" | null
  >(null);

  const refreshUser = useCallback(async () => {
    try {
      const result = await memberClient.me();
      setUser(result.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const openAuth = useCallback((mode: "login" | "register" = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  }, []);

  const logout = useCallback(async () => {
    await memberClient.logout();
    setUser(null);
  }, []);

  const openLibrary = useCallback((view: "favorites" | "history") => {
    setLibraryView(view);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      openAuth,
      openLibrary,
      logout,
    }),
    [user, loading, openAuth, openLibrary, logout],
  );

  return (
    <MemberContext.Provider value={value}>
      {children}
      <MemberAuthModal
        mode={authMode}
        open={isAuthOpen}
        onModeChange={setAuthMode}
        onClose={() => setIsAuthOpen(false)}
        onAuthenticated={(nextUser) => {
          setUser(nextUser);
          setIsAuthOpen(false);
        }}
      />
      <MemberLibraryModal
        view={libraryView}
        onClose={() => setLibraryView(null)}
      />
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error("useMember must be used inside MemberProvider");
  }
  return context;
}

function MemberLibraryModal({
  view,
  onClose,
}: {
  view: "favorites" | "history" | null;
  onClose: () => void;
}) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!view) return;
    let cancelled = false;

    const loadItems = async () => {
      setLoading(true);
      try {
        if (view === "favorites") {
          const result = await memberClient.favorites();
          if (!cancelled) setFavorites(result.items);
        } else {
          const result = await memberClient.history();
          if (!cancelled) setHistory(result.items);
        }
      } catch {
        if (!cancelled) {
          setFavorites([]);
          setHistory([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadItems();
    return () => {
      cancelled = true;
    };
  }, [view]);

  if (!view) return null;

  const title = view === "favorites" ? "Tủ phim của bạn" : "Lịch sử xem";
  const items = view === "favorites" ? favorites : history;

  return (
    <div className="fixed inset-0 z-[190] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-white/10 bg-[#11131d] shadow-[0_30px_90px_rgba(0,0,0,0.65)]">
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd875]">
            Thành viên RoPhim
          </p>
          <h2 className="mb-5 text-2xl font-black uppercase tracking-tight text-white">
            {title}
          </h2>

          {loading ? (
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5 text-sm text-white/45">
              Đang tải dữ liệu thành viên...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm leading-relaxed text-white/45">
              Chưa có dữ liệu. Hãy yêu thích phim hoặc xem phim để RoPhim lưu
              lại cho bạn.
            </div>
          ) : (
            <div className="max-h-[430px] space-y-3 overflow-y-auto pr-1 custom-scrollbar">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/phim/${item.movieSlug}`}
                  onClick={onClose}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-colors hover:border-[#ffd875]/30 hover:bg-white/[0.06]"
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-black uppercase tracking-tight text-white">
                      {item.movieTitle}
                    </h3>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-white/35">
                      {view === "history" && "episodeName" in item
                        ? `Tập ${item.episodeName}`
                        : "Đã lưu vào tủ phim"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#ffd875] px-3 py-1 text-[10px] font-black uppercase text-black">
                    Xem
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MemberAuthModal({
  mode,
  open,
  onModeChange,
  onClose,
  onAuthenticated,
}: {
  mode: "login" | "register";
  open: boolean;
  onModeChange: (mode: "login" | "register") => void;
  onClose: () => void;
  onAuthenticated: (user: MemberUser) => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const isRegister = mode === "register";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = isRegister
        ? await memberClient.register({ email, name, password })
        : await memberClient.login({ email, password });
      onAuthenticated(result.user);
      setPassword("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Không thể đăng nhập lúc này",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-[430px] overflow-hidden rounded-2xl border border-white/10 bg-[#11131d] shadow-[0_30px_90px_rgba(0,0,0,0.65)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,216,117,0.14),transparent_38%)]" />
        <div className="relative p-6 md:p-7">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>

          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd875]">
            Thành viên RoPhim
          </p>
          <h2 className="mb-2 text-2xl font-black uppercase tracking-tight text-white">
            {isRegister ? "Tạo tài khoản" : "Đăng nhập"}
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-white/45">
            Lưu tủ phim, bình luận và tiếp tục xem tập đang dang dở trên mọi
            thiết bị.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#ffd875]/60"
                placeholder="Tên hiển thị"
                autoComplete="name"
                required
              />
            )}
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#ffd875]/60"
              placeholder="Email"
              type="email"
              autoComplete="email"
              required
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#ffd875]/60"
              placeholder="Mật khẩu"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={8}
              required
            />

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-full bg-[#ffd875] text-sm font-black uppercase tracking-widest text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Đang xử lý..."
                : isRegister
                  ? "Gia nhập"
                  : "Vào RoPhim"}
            </button>
          </form>

          <button
            onClick={() => onModeChange(isRegister ? "login" : "register")}
            className="mt-5 w-full text-center text-xs font-bold uppercase tracking-widest text-white/45 transition-colors hover:text-[#ffd875]"
          >
            {isRegister
              ? "Đã có tài khoản? Đăng nhập"
              : "Chưa có tài khoản? Đăng ký"}
          </button>
        </div>
      </div>
    </div>
  );
}
