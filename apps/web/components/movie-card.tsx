"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface MovieCardProps {
  title: string;
  originalTitle?: string;
  posterUrl: string;
  slug: string;
  year?: string | number;
  quality?: string;
  episodeCurrent?: string;
  language?: string;
  isSeries?: boolean;
  hideInfo?: boolean;
  view?: number;
  rating?: number | string;
}

export const MovieCard = ({
  title,
  originalTitle,
  posterUrl,
  slug,
  quality = "HD",
  language,
  hideInfo = false,
  view,
  rating,
}: MovieCardProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  // Reset loading state when route actually changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const handleLinkClick = () => {
    setIsNavigating(true);
  };
  return (
    <div className="group relative w-full">
      {/* Poster Container */}
      <Link
        href={`/phim/${slug}`}
        onClick={handleLinkClick}
        className="block relative aspect-[2/3] overflow-hidden rounded-[5px] premium-border-container shadow-2xl"
      >
        <div className="premium-border-inner relative w-full h-full overflow-hidden rounded-[4px] group-hover:opacity-80 transition-opacity duration-300">
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
            quality={75}
            loading="lazy"
          />
        </div>

        {/* Badges - Premium style */}
        <div className="absolute top-2 right-2 z-20">
          {rating && (
            <div className="bg-black/60 backdrop-blur-md text-[#ffd875] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#ffd875]/30 flex items-center gap-1 shadow-lg">
              <span className="text-[8px]">★</span> {rating}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 flex z-20 pointer-events-none gap-0.5 p-0.5">
          {language && (
            <div className="bg-[#4a4c5a]/90 backdrop-blur-sm text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm min-w-[24px] text-center uppercase tracking-tighter">
              {language === "Vietsub" || language === "PĐ" ? "PĐ" : "TM"}
            </div>
          )}
          {quality && (
            <div className="bg-[#248a4d]/90 backdrop-blur-sm text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm min-w-[24px] text-center uppercase tracking-tighter">
              {quality}
            </div>
          )}
        </div>

        {/* Hover Play Button or Loader */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-hover transition-all duration-500 flex items-center justify-center z-10 ${isNavigating ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          {isNavigating ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-10 h-10 text-[#ffd875] animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#ffd875]">
                Đang tải...
              </span>
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#ffd875] flex items-center justify-center text-[#1c1c1c] scale-75 group-hover:scale-100 transition-all duration-300 shadow-[0_0_30px_rgba(255,216,117,0.5)]">
              <Play className="fill-current w-6 h-6 ml-1" />
            </div>
          )}
        </div>
      </Link>

      {/* Typography */}
      {!hideInfo && (
        <div className="mt-2.5 px-0.5">
          <h3 className="text-[13px] md:text-[13.5px] font-black text-white leading-tight mb-1 line-clamp-1 group-hover:text-[#ffd875] transition-colors tracking-tighter italic uppercase">
            <Link
              href={`/phim/${slug}`}
              title={title}
              onClick={handleLinkClick}
            >
              {title}
            </Link>
          </h3>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-[10px] text-[#717382] font-black leading-tight line-clamp-1 truncate uppercase tracking-tighter italic opacity-50">
              {originalTitle || title}
            </p>
            {view && (
              <span className="text-[8.5px] text-white/20 font-black flex items-center gap-1 uppercase tracking-tighter">
                {view.toLocaleString()} xem
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
