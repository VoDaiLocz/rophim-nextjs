"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { MovieCard } from "./movie-card";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import { useRef } from "react";

interface MovieCarouselProps {
  title: string;
  icon?: string;
  viewMoreLink?: string;
  items: {
    id: string;
    title: string;
    originalTitle?: string;
    posterUrl: string;
    slug: string;
    year?: string | number;
    quality?: string;
    episodeCurrent?: string;
    language?: string;
    isSeries?: boolean;
    view?: number;
    rating?: number | string;
  }[];
}

export const MovieCarousel = ({
  title,
  icon,
  viewMoreLink,
  items,
}: MovieCarouselProps) => {
  // Custom Navigation Refs
  const navigationPrevRef = useRef<HTMLButtonElement | null>(null);
  const navigationNextRef = useRef<HTMLButtonElement | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <section className="py-4 md:py-6 w-full relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-5">
          <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
            {icon ? (
              <span className="text-xl md:text-2xl shrink-0">{icon}</span>
            ) : (
              <div className="w-1.5 h-5 md:h-6 shrink-0 bg-[#ffd875] rounded-full shadow-[0_0_10px_rgba(255,216,117,0.3)]"></div>
            )}
            <h2 className="min-w-0 text-lg md:text-2xl font-extrabold text-white leading-tight uppercase tracking-tight">
              <Link
                href={viewMoreLink || "#"}
                className="block truncate hover:text-[#ffd875] transition-colors"
              >
                {title}
              </Link>
            </h2>
          </div>
          {viewMoreLink && (
            <Link
              href={viewMoreLink}
              className="self-start sm:self-auto text-gray-400 hover:text-white text-[11px] md:text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5 md:gap-2 transition-all hover:translate-x-1 group/link whitespace-nowrap"
            >
              Xem tất cả
              <ChevronRight
                size={16}
                className="text-rophim-primary group-hover/link:translate-x-1 transition-transform"
              />
            </Link>
          )}
        </div>

        {/* Swiper Container */}
        <div className="relative group/swiper">
          {/* Navigation Buttons */}
          <button
            ref={navigationPrevRef}
            className="absolute left-2 top-[40%] -translate-y-1/2 z-20 w-11 h-11 bg-black/70 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover/swiper:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-105 disabled:opacity-0 hidden md:flex"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            ref={navigationNextRef}
            className="absolute right-2 top-[40%] -translate-y-1/2 z-20 w-11 h-11 bg-black/70 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover/swiper:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-105 disabled:opacity-0 hidden md:flex"
          >
            <ChevronRight size={28} />
          </button>

          <Swiper
            modules={[Navigation]}
            spaceBetween={12}
            slidesPerView={2.15}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            onBeforeInit={(swiper: SwiperType) => {
              const navigation = swiper.params.navigation;
              if (navigation && typeof navigation !== "boolean") {
                navigation.prevEl = navigationPrevRef.current;
                navigation.nextEl = navigationNextRef.current;
              }
            }}
            breakpoints={{
              480: { slidesPerView: 2.4, spaceBetween: 14 },
              768: { slidesPerView: 3.4, spaceBetween: 18 },
              1024: { slidesPerView: 4.4, spaceBetween: 18 },
              1440: { slidesPerView: 5.4, spaceBetween: 22 },
            }}
            className="w-full !overflow-hidden !pb-1"
          >
            {items.map((movie) => (
              <SwiperSlide key={movie.id} className="h-auto">
                <div className="p-1">
                  <MovieCard {...movie} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
