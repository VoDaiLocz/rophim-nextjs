"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { MovieCard } from "./movie-card";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import { useRef } from "react";

interface TrendingCarouselProps {
  title: string;
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

export const TrendingCarousel = ({ title, items }: TrendingCarouselProps) => {
  const navigationPrevRef = useRef<HTMLButtonElement | null>(null);
  const navigationNextRef = useRef<HTMLButtonElement | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <section className="py-8 md:py-14 w-full relative overflow-hidden bg-gradient-to-b from-[#0b0d14] via-[#10121a] to-[#0b0d14]">
      <div className="container mx-auto px-4 md:px-10">
        {/* Header Style - Netflix Bold Italic */}
        <div className="flex min-w-0 items-center gap-3 md:gap-4 mb-7 md:mb-12">
          <div className="h-7 md:h-10 w-1.5 shrink-0 bg-rophim-primary rounded-full shadow-[0_0_15px_rgba(240,194,77,0.4)]"></div>
          <h2 className="min-w-0 text-xl md:text-4xl font-[950] text-white uppercase tracking-tight md:tracking-tighter italic drop-shadow-md leading-tight">
            {title}
          </h2>
        </div>

        {/* Swiper Container */}
        <div className="relative group/swiper">
          {/* Navigation Buttons */}
          <button
            ref={navigationPrevRef}
            className="absolute left-2 top-[45%] -translate-y-1/2 z-30 w-11 h-11 bg-black/70 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover/swiper:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-105 disabled:opacity-0 hidden md:flex shadow-2xl"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            ref={navigationNextRef}
            className="absolute right-2 top-[45%] -translate-y-1/2 z-30 w-11 h-11 bg-black/70 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover/swiper:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-105 disabled:opacity-0 hidden md:flex shadow-2xl"
          >
            <ChevronRight size={28} />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={2.2}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
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
              640: { slidesPerView: 3.2, spaceBetween: 15 },
              768: { slidesPerView: 4.2, spaceBetween: 20 },
              1024: { slidesPerView: 5.2, spaceBetween: 20 },
              1280: { slidesPerView: 6.5, spaceBetween: 20 },
            }}
            className="w-full !overflow-hidden !py-4"
          >
            {items.map((movie, index) => (
              <SwiperSlide
                key={movie.id}
                className="h-auto group/slide select-none"
              >
                <div className="flex flex-col gap-2 w-full">
                  {/* Poster Container */}
                  <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden shadow-xl transition-transform duration-500 group-hover/slide:-translate-y-2 z-10">
                    <MovieCard {...movie} hideInfo />
                  </div>

                  {/* Ranking & Info Bar */}
                  <div className="flex items-start gap-3 px-0.5 mt-2">
                    <span className="text-3xl md:text-4xl font-black italic text-[#ffd875] leading-none tracking-tighter shrink-0 pt-0.5">
                      {index + 1}
                    </span>

                    <div className="flex-1 min-w-0 font-italic">
                      <h3 className="text-[12.5px] md:text-[13px] font-black text-white line-clamp-1 group-hover/slide:text-[#ffd875] transition-colors leading-tight mb-1 italic uppercase tracking-tighter">
                        <Link href={`/phim/${movie.slug}`}>{movie.title}</Link>
                      </h3>
                      <p className="text-[10px] text-white/30 font-black line-clamp-1 truncate uppercase tracking-tighter italic opacity-40 leading-none">
                        {movie.originalTitle || movie.title}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
