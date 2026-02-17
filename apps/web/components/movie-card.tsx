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
    year,
    quality = "HD",
    episodeCurrent,
    language,
    isSeries = false,
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

                <div className="absolute bottom-0 left-0 flex z-20 pointer-events-none">
                    {language && (
                        <div className="bg-[#4a4c5a] text-white text-[10px] font-bold px-1.5 py-0.5 min-w-[24px] text-center uppercase tracking-wider">
                            {language === "Vietsub" || language === "PĐ" ? "PĐ" : "TM"}
                        </div>
                    )}
                    {quality && (
                        <div className="bg-[#248a4d] text-white text-[10px] font-bold px-1.5 py-0.5 min-w-[24px] text-center uppercase tracking-wider">
                            {quality}
                        </div>
                    )}
                </div>

                {/* Hover Play Button or Loader */}
                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center z-10 ${isNavigating ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    {isNavigating ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-10 h-10 text-[#ffd875] animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#ffd875]">Đang tải...</span>
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-[#d9aa52] flex items-center justify-center text-[#1c1c1c] scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                            <Play className="fill-current w-5 h-5 ml-0.5" />
                        </div>
                    )}
                </div>
            </Link>

            {/* Typography */}
            {!hideInfo && (
                <div className="mt-3 px-0.5">
                    <h3 className="text-[14.5px] font-bold text-white leading-tight mb-1 line-clamp-1 group-hover:text-[#d9aa52] transition-colors tracking-tight">
                        <Link href={`/phim/${slug}`} title={title} onClick={handleLinkClick}>
                            {title}
                        </Link>
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-[12px] text-[#717382] font-medium leading-tight line-clamp-1 truncate uppercase tracking-tight max-w-[70%]">
                            {originalTitle || title}
                        </p>
                        {view && (
                            <span className="text-[10px] text-white/30 font-bold flex items-center gap-1">
                                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                {view.toLocaleString()} lượt xem
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
