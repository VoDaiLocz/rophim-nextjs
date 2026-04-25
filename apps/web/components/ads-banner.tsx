"use client";

import Link from "next/link";
import { PlayCircle, Sparkles } from "lucide-react";

export const AdsBanner = () => {
  return (
    <div className="container mx-auto px-4 md:px-10 py-7 md:py-10">
      <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-[#191b24] shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="relative flex min-h-[96px] flex-col items-center justify-center gap-4 px-5 py-6 text-center md:min-h-[112px] md:flex-row md:justify-between md:px-9 md:text-left">
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,216,117,0.12),transparent_36%,rgba(255,255,255,0.04)_68%,rgba(255,216,117,0.08))]" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ffd875] text-black shadow-[0_0_26px_rgba(255,216,117,0.25)]">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-base md:text-xl font-black uppercase tracking-tight text-white">
                RoPhim cập nhật phim mới mỗi ngày
              </h4>
              <p className="mt-1 text-[11px] md:text-xs font-bold uppercase tracking-widest text-white/45">
                Chọn nhanh phim hot, vietsub rõ, giao diện sạch và mượt.
              </p>
            </div>
          </div>
          <Link
            href="/danh-sach/phim-moi-cap-nhat"
            className="relative inline-flex items-center gap-2 rounded-full bg-[#ffd875] px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03]"
          >
            <PlayCircle size={16} />
            Xem phim mới
          </Link>
        </div>
      </div>
    </div>
  );
};
