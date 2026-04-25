"use client";

import { useState } from "react";
import { Heart, MessageSquare, Plus, Send, Star } from "lucide-react";
import { memberClient, type MoviePayload } from "@/lib/member-client";
import { useMember } from "./member-provider";

export function MemberMovieActions({ movie }: { movie: MoviePayload }) {
  const { user, openAuth } = useMember();
  const [favorited, setFavorited] = useState(false);
  const [pending, setPending] = useState(false);

  const requireMember = () => {
    if (!user) {
      openAuth("login");
      return false;
    }
    return true;
  };

  const toggleFavorite = async () => {
    if (!requireMember()) return;
    setPending(true);
    try {
      const result = await memberClient.toggleFavorite(movie);
      setFavorited(result.favorited);
    } finally {
      setPending(false);
    }
  };

  const shareMovie = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({
        title: movie.movieTitle,
        url: window.location.href,
      });
      return;
    }
    await navigator.clipboard?.writeText(window.location.href);
  };

  return (
    <>
      <div className="flex items-center gap-5 md:gap-6 flex-grow">
        <button
          onClick={toggleFavorite}
          disabled={pending}
          className={`flex flex-col items-center gap-1 transition-colors ${
            favorited ? "text-[#ffd875]" : "text-white/70 hover:text-[#ffd875]"
          }`}
        >
          <Heart size={20} className={favorited ? "fill-[#ffd875]" : ""} />
          <span className="text-[11px]">Yêu thích</span>
        </button>

        <button
          onClick={toggleFavorite}
          disabled={pending}
          className="flex flex-col items-center gap-1 text-white/70 transition-colors hover:text-[#ffd875]"
        >
          <Plus size={20} />
          <span className="text-[11px]">Tủ phim</span>
        </button>

        <button
          onClick={shareMovie}
          className="flex flex-col items-center gap-1 text-white/70 transition-colors hover:text-[#ffd875]"
        >
          <Send size={20} />
          <span className="text-[11px]">Chia sẻ</span>
        </button>

        <a
          href="#comment-area"
          className="flex flex-col items-center gap-1 text-white/70 transition-colors hover:text-[#ffd875]"
        >
          <MessageSquare size={20} />
          <span className="text-[11px]">Bình luận</span>
        </a>
      </div>

      <button
        onClick={() => (user ? undefined : openAuth("login"))}
        className="flex items-center gap-2 rounded-full bg-[#282b3a] px-4 py-2.5 transition-colors hover:bg-[#32364a] md:ml-auto"
      >
        <Star size={18} className="fill-[#ffd875] text-[#ffd875]" />
        <span className="text-sm font-bold text-white">0</span>
        <span className="text-xs text-white/60">Đánh giá</span>
      </button>
    </>
  );
}
