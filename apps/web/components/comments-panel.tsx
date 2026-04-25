"use client";

import { useEffect, useState } from "react";
import { MessageSquare, SendHorizontal } from "lucide-react";
import {
  memberClient,
  type CommentItem,
  type MoviePayload,
} from "@/lib/member-client";
import { useMember } from "./member-provider";

export function CommentsPanel({ movie }: { movie: MoviePayload }) {
  const { user, openAuth } = useMember();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadComments = async () => {
      setLoading(true);
      try {
        const result = await memberClient.comments(movie.movieSlug);
        if (!cancelled) setComments(result.items);
      } catch {
        if (!cancelled) setComments([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadComments();
    return () => {
      cancelled = true;
    };
  }, [movie.movieSlug]);

  const submitComment = async () => {
    if (!user) {
      openAuth("login");
      return;
    }
    if (body.trim().length < 2) return;

    setSubmitting(true);
    try {
      const result = await memberClient.createComment({
        ...movie,
        body,
      });
      setComments((currentComments) => [result.item, ...currentComments]);
      setBody("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="comment-area" className="pt-6 space-y-4">
      <div className="flex items-center gap-3">
        <MessageSquare size={22} className="text-white/60" />
        <h3 className="text-xl font-bold text-white">Bình luận</h3>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#0f111a] p-4">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="min-h-[76px] w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          placeholder={
            user
              ? "Viết bình luận văn minh về phim..."
              : "Đăng nhập thành viên để bình luận..."
          }
        />
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/30">
            {user ? user.name : "Khách xem phim"}
          </span>
          <button
            onClick={submitComment}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-[#ffd875] px-4 py-2 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:brightness-110 disabled:opacity-60"
          >
            <SendHorizontal size={14} />
            Gửi
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-sm text-white/40">
            Đang tải bình luận...
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-white/40">
            Chưa có bình luận nào. Hãy là người mở màn cuộc trò chuyện.
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-white/5 bg-white/[0.03] p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffd875] text-xs font-black text-black">
                    {comment.user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {comment.user.name}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                      Thành viên
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-white/25">
                  {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white/65">
                {comment.body}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
