"use client";

import { useEffect, useState } from "react";
import { HeroSlider } from "@/components/hero-slider";
import { MovieCarousel } from "@/components/movie-carousel";
import { TrendingCarousel } from "@/components/trending-carousel";
import { TopicGrid } from "@/components/topic-grid";
import { AdsBanner } from "@/components/ads-banner";
import { GhibliSection } from "@/components/ghibli-section";
import {
  getLatestMovies,
  getMoviesByType,
  getMoviesByCountry,
  getMoviesByCategory,
  searchMovies,
  type ListMovie,
} from "@/lib/ophim-client";

export default function Home() {
  const [data, setData] = useState<{
    latest: ListMovie[];
    korean: ListMovie[];
    chinese: ListMovie[];
    usuk: ListMovie[];
    series: ListMovie[];
    single: ListMovie[];
    cartoon: ListMovie[];
    cinema: ListMovie[];
    japanese: ListMovie[];
    thai: ListMovie[];
    hongkong: ListMovie[];
    costume: ListMovie[];
    horror: ListMovie[];
    romance: ListMovie[];
    hero: ListMovie[];
  }>({
    latest: [],
    korean: [],
    chinese: [],
    usuk: [],
    series: [],
    single: [],
    cartoon: [],
    cinema: [],
    japanese: [],
    thai: [],
    hongkong: [],
    costume: [],
    horror: [],
    romance: [],
    hero: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          latestRes,
          koreanRes,
          chineseRes,
          usukRes,
          seriesRes,
          singleRes,
          cartoonRes,
          cinemaRes,
          japaneseRes,
          thaiRes,
          hongkongRes,
          costumeRes,
          horrorRes,
          romanceRes,
          // Specific searches for 6 FIXED posters as requested by USER
          fixed1,
          fixed2,
          fixed3,
          fixed4,
          fixed5,
          fixed6,
        ] = await Promise.all([
          getLatestMovies(1),
          getMoviesByCountry("han-quoc", 1, true),
          getMoviesByCountry("trung-quoc", 1, true),
          getMoviesByCountry("au-my", 1, true),
          getMoviesByType("phim-bo", 1, true),
          getMoviesByType("phim-le", 1, true),
          getMoviesByType("hoat-hinh", 1, true),
          getMoviesByCategory("chiếu rạp", 1, true),
          getMoviesByCountry("nhat-ban", 1, true),
          getMoviesByCountry("thai-lan", 1, true),
          getMoviesByCountry("hong-kong", 1, true),
          getMoviesByCategory("co-trang", 1, true),
          getMoviesByCategory("kinh-di", 1, true),
          getMoviesByCategory("tình cảm", 1, true),
          // Search queries for user's 6 fixed items (Using page=1, limit=1, isHome=true)
          searchMovies("Còn ra thể thống gì nữa", 1, 1, true),
          searchMovies("Sự trở lại của thẩm phán", 1, 1, true),
          searchMovies("mùa hè những năm 80", 1, 1, true),
          searchMovies("nghệ thuật lừa dối của sarah", 1, 1, true),
          searchMovies("bake your dream", 1, 1, true),
          searchMovies("phong lâm hỏa sơn", 1, 1, true),
        ]);

        // CONSOLDIDATE FIXED POSTERS (6 items)
        const userFixedItems: ListMovie[] = [];
        const searchResults = [fixed1, fixed2, fixed3, fixed4, fixed5, fixed6];

        searchResults.forEach((res) => {
          const firstMovie = res?.items?.[0];
          if (firstMovie) {
            if (
              !userFixedItems.some(
                (existing) => existing._id === firstMovie._id,
              )
            ) {
              userFixedItems.push(firstMovie);
            }
          }
        });

        // CURATED HERO SLIDER: Exactly 6 user-specified movies
        const curatedHero = userFixedItems.slice(0, 6);

        setData({
          latest: latestRes.items,
          korean: koreanRes.items,
          chinese: chineseRes.items,
          usuk: usukRes.items,
          series: seriesRes.items,
          single: singleRes.items,
          cartoon: cartoonRes.items,
          cinema: cinemaRes.items,
          japanese: japaneseRes.items,
          thai: thaiRes.items,
          hongkong: hongkongRes.items,
          costume: costumeRes.items,
          horror: horrorRes.items,
          romance: romanceRes.items,
          hero: curatedHero, // Use curated for slider
        });
      } catch (error) {
        console.error("Failed to fetch movies", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const transformMovies = (movies: ListMovie[]) => {
    return (movies || []).map((m) => ({
      id: m._id,
      title: m.name,
      originalTitle: m.origin_name,
      posterUrl: m.poster_url,
      slug: m.slug,
      year: m.year,
      quality: m.quality || "HD",
      language: m.lang || "Vietsub",
      episodeCurrent: m.episode_current,
      view: m.view,
      rating: m.rating,
      isSeries: false,
    }));
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <HeroSlider movies={data.hero.slice(0, 6)} />

      {/* Main Content */}
      <div className="flex flex-col gap-0 pb-20 -mt-8 relative z-30">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 space-y-4">
            <div className="w-12 h-12 border-4 border-[#ffd875] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/40 animate-pulse text-sm font-medium tracking-wider uppercase">
              Đang đồng bộ dữ liệu RoPhim...
            </p>
          </div>
        ) : (
          <>
            {/* Topic Navigation */}
            <div className="mb-0">
              <TopicGrid />
            </div>

            <div className="container mx-auto space-y-4 md:space-y-8">
              <MovieCarousel
                title="Phim Hàn Quốc mới"
                icon="🇰🇷"
                viewMoreLink="/quoc-gia/han-quoc"
                items={transformMovies(data.korean)}
              />

              <MovieCarousel
                title="Phim Trung Quốc mới"
                icon="🇨🇳"
                viewMoreLink="/quoc-gia/trung-quoc"
                items={transformMovies(data.chinese)}
              />

              <MovieCarousel
                title="Phim US-UK mới"
                icon="🇺🇸"
                viewMoreLink="/quoc-gia/au-my"
                items={transformMovies(data.usuk)}
              />

              {/* REAL TOP TRENDING: Sorted by Views across all categories */}
              <TrendingCarousel
                title="Đây Rồi Top Phim Xem Nhiều Nhất"
                items={transformMovies(
                  [...data.latest, ...data.series, ...data.single]
                    .sort((a, b) => b.view - a.view)
                    .slice(0, 10),
                )}
              />

              <MovieCarousel
                title="Phim Điện Ảnh Mới Coóng"
                icon="🚀"
                viewMoreLink="/danh-sach/phim-le"
                items={transformMovies(data.single)}
              />

              <TrendingCarousel
                title="Top 10 phim bộ hôm nay"
                items={transformMovies(
                  [...data.series].sort((a, b) => b.view - a.view).slice(0, 10),
                )}
              />

              <MovieCarousel
                title="Mãn Nhãn Với Phim Chiếu Rạp"
                icon="🍿"
                viewMoreLink="/the-loai/chieu-rap"
                items={transformMovies(data.cinema)}
              />

              <AdsBanner />

              <TrendingCarousel
                title="Top 10 phim lẻ hôm nay"
                items={transformMovies(
                  [...data.single].sort((a, b) => b.view - a.view).slice(0, 10),
                )}
              />

              <MovieCarousel
                title="Phim Nhật Mới Oanh Tạc Chốn Này"
                icon="🍣"
                viewMoreLink="/quoc-gia/nhat-ban"
                items={transformMovies(data.japanese)}
              />

              <MovieCarousel
                title="Phim Thái Now: Không drama đời không nể"
                icon="🐘"
                viewMoreLink="/quoc-gia/thai-lan"
                items={transformMovies(data.thai)}
              />

              {/* Mini Hero Slider placeholder for Anime section */}
              <div className="py-10">
                <MovieCarousel
                  title="Kho Tàng Anime Mới Nhất"
                  icon="⚡"
                  viewMoreLink="/danh-sach/hoat-hinh"
                  items={transformMovies(data.cartoon)}
                />
              </div>

              <MovieCarousel
                title="Điện Ảnh Hồng Kông Ở Chỗ Này Nầy"
                icon="🐲"
                viewMoreLink="/quoc-gia/hong-kong"
                items={transformMovies(data.hongkong)}
              />

              <MovieCarousel
                title="Phim Cổ Trang Hay"
                icon="⚔️"
                viewMoreLink="/the-loai/co-trang"
                items={transformMovies(data.costume)}
              />

              <MovieCarousel
                title="Yêu Kiểu Hàn"
                icon="💖"
                viewMoreLink="/the-loai/tinh-cam"
                items={transformMovies(data.romance)}
              />

              <GhibliSection />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
