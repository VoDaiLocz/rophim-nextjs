"use client";

import { useEffect, useState, use } from "react";
import {
  Play,
  MessageSquare,
  Star,
  ChevronDown,
  List,
  Clock,
  Globe,
  Hash,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import {
  getMovieDetail,
  getLatestMovies,
  type DetailMovie,
  type Episode,
  type ListMovie,
} from "@/lib/ophim-client";
import Image from "next/image";
import { CommentsPanel } from "@/components/comments-panel";
import { MemberMovieActions } from "@/components/member-movie-actions";

export default function MovieDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [movie, setMovie] = useState<DetailMovie | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [latestMovies, setLatestMovies] = useState<ListMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tập phim");
  const [isCompact, setIsCompact] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, latestRes] = await Promise.all([
          getMovieDetail(slug),
          getLatestMovies(1),
        ]);

        if (movieRes && movieRes.status) {
          setMovie(movieRes.movie);
          setEpisodes(movieRes.episodes || []);
        }

        if (latestRes && latestRes.status) {
          setLatestMovies(latestRes.items);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#191b24] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-[#ffd875] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-[#ffd875] text-sm font-black uppercase tracking-[0.2em] animate-pulse">
            Khởi tạo dữ liệu phim...
          </div>
        </div>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="min-h-screen bg-[#191b24] text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Không tìm thấy phim này!
          </h1>
          <Link href="/" className="text-[#ffd875] hover:underline mt-4 block">
            Quay lại trang chủ
          </Link>
        </div>
      </main>
    );
  }

  const transformListMovies = (list: ListMovie[]) => {
    return list.map((m) => ({
      id: m._id,
      title: m.name,
      originalTitle: m.origin_name,
      posterUrl: m.poster_url,
      slug: m.slug,
      year: m.year,
      quality: m.quality || "HD",
      language: m.lang || "Vietsub",
      episodeCurrent: m.episode_current,
      isSeries: false,
    }));
  };

  const suggestedMovies = transformListMovies(latestMovies);

  return (
    <main className="min-h-screen bg-[#191b24] text-white font-sans overflow-x-hidden pb-20">
      {/* ========== BACKDROP SECTION ========== */}
      <div className="relative w-full h-[450px] md:h-[520px] overflow-hidden bg-[#191b24]">
        <div className="absolute inset-0 z-0">
          <Image
            src={movie.thumb_url || movie.poster_url}
            alt={movie.name}
            fill
            className="object-cover object-center"
            priority
            quality={75}
            unoptimized
          />
          {/* Bottom gradient fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#191b24] via-[#191b24]/50 to-transparent z-10" />
          {/* Left gradient for poster area */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#191b24]/60 to-transparent z-10" />
        </div>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <div className="max-w-[1640px] mx-auto px-5 md:px-[20px] -mt-48 relative z-30">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ===== LEFT COLUMN - Movie Info Sidebar ===== */}
          <div className="order-2 lg:order-1 lg:w-[440px] flex-shrink-0 space-y-5">
            {/* Poster */}
            <div className="relative w-[120px] h-[180px] rounded-lg overflow-hidden shadow-2xl border border-white/10 mx-auto lg:mx-0">
              <Image
                src={movie.poster_url}
                alt={movie.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Title */}
            <div className="text-center lg:text-left">
              <h2 className="text-[25px] font-semibold text-white leading-tight">
                {movie.name}
              </h2>
              <p className="text-sm text-[#ffd875] mt-1">{movie.origin_name}</p>
            </div>

            {/* "Thông tin phim" toggle */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-2 mx-auto lg:mx-0 text-[#ffd875] text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Thông tin phim
              <ChevronDown
                size={16}
                className={`transition-transform ${showInfo ? "rotate-180" : ""}`}
              />
            </button>

            {/* Meta Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="px-2.5 py-1 rounded border border-[#ffd875] text-[#ffd875] text-xs font-bold">
                IMDb 0
              </span>
              <span className="px-2.5 py-1 rounded border border-white/20 text-white/60 text-xs font-medium">
                {movie.year}
              </span>
              <span className="px-2.5 py-1 rounded border border-white/20 text-white/60 text-xs font-medium">
                {movie.episode_current || "Hoàn tất"}
              </span>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {movie.category?.map((c) => (
                <Link
                  key={c.id}
                  href={`/the-loai/${c.slug}`}
                  className="px-3 py-1 bg-white/5 rounded text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle size={18} className="text-green-500" />
              <span className="text-green-400 font-medium">
                Đã hoàn thành: {movie.episode_current}
              </span>
            </div>

            {/* NỘI DUNG PHIM Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <List size={16} className="text-white/60" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  NỘI DUNG PHIM
                </h3>
              </div>
              <div
                className="text-sm text-white/60 leading-relaxed text-justify"
                dangerouslySetInnerHTML={{ __html: movie.content }}
              />
            </div>

            {/* Details: Thời lượng, Quốc gia, Tags */}
            <div className="space-y-3 text-sm border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-white/40" />
                <span className="text-white font-bold">Thời lượng:</span>
                <span className="text-white/60">
                  {movie.time || "Đang cập nhật"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-white/40" />
                <span className="text-white font-bold">Quốc gia:</span>
                <span className="text-white/60">
                  {movie.country?.[0]?.name}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Hash size={14} className="text-white/40 mt-0.5" />
                <span className="text-white font-bold">Tags:</span>
                <span className="text-white/60">
                  {movie.origin_name}, {movie.name}
                </span>
              </div>
            </div>

            {/* ===== TOP PHIM XEM NHIỀU ===== */}
            <div className="space-y-5 border-t border-white/5 pt-6">
              <div className="flex items-center gap-3">
                <Star size={18} className="text-[#ffd875] fill-[#ffd875]" />
                <h3 className="text-lg font-black uppercase tracking-wider">
                  TOP PHIM XEM NHIỀU
                </h3>
              </div>

              <div className="space-y-5">
                {suggestedMovies.slice(0, 10).map((m, idx) => (
                  <Link
                    key={m.id}
                    href={`/phim/${m.slug}`}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    {/* Rank Number */}
                    <span className="text-4xl font-black text-white/15 w-10 text-center flex-shrink-0 group-hover:text-white/30 transition-colors">
                      {idx + 1}
                    </span>

                    {/* Poster */}
                    <div className="relative w-[60px] h-[80px] rounded overflow-hidden flex-shrink-0 border border-white/5">
                      <Image
                        src={m.posterUrl}
                        alt={m.title}
                        fill
                        sizes="60px"
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#ffd875] transition-colors">
                        {m.title}
                      </h4>
                      <p className="text-xs text-white/40 truncate mt-0.5">
                        {m.originalTitle}
                      </p>
                      <p className="text-xs text-white/30 mt-1">
                        {m.episodeCurrent || `Tập ${m.year}`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN - Main Content ===== */}
          <div className="order-1 lg:order-2 flex-1 min-w-0 space-y-6">
            <div className="lg:hidden space-y-1">
              <h1 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">
                {movie.name}
              </h1>
              <p className="text-sm font-semibold text-[#ffd875]">
                {movie.origin_name}
              </p>
            </div>
            {/* ===== ACTION BAR ===== */}
            <div className="flex items-center flex-wrap gap-4 md:gap-6 py-4">
              {/* Xem Ngay Button */}
              <Link
                href={`/xem-phim/${movie.slug}`}
                className="inline-flex items-center justify-center gap-3 bg-[#ffd875] text-[#191b24] font-bold text-base md:text-lg px-7 md:px-8 py-3.5 md:py-4 rounded-full hover:brightness-110 transition-all hover:scale-[1.02] shadow-lg"
              >
                <Play size={18} className="fill-[#191b24]" />
                Xem Ngay
              </Link>

              <MemberMovieActions
                movie={{
                  movieSlug: movie.slug,
                  movieTitle: movie.name,
                  posterUrl: movie.poster_url,
                }}
              />
            </div>

            {/* ===== TABS NAVIGATION (3 tabs only) ===== */}
            <div className="border-b border-white/10">
              <div className="flex items-center gap-8">
                {["Tập phim", "Trailer", "Diễn viên"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`pb-3 text-sm font-medium relative transition-colors ${
                      activeTab === tab.toLowerCase()
                        ? "text-[#ffd875]"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    {tab}
                    {activeTab === tab.toLowerCase() && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ffd875]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ===== EPISODE SELECTOR ===== */}
            {activeTab === "tập phim" && (
              <div className="space-y-4">
                {/* Header: Phần + Vietsub badge + Rút gọn */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {/* Season selector */}
                    <button className="flex items-center gap-2 text-white font-semibold text-base">
                      <List size={18} className="text-white/60" />
                      Phần 1
                      <ChevronDown size={16} className="text-white/40" />
                    </button>

                    {/* Vietsub badge */}
                    <button className="flex items-center gap-2 bg-[#282b3a] px-3 py-1.5 rounded text-sm text-white border border-white/10">
                      <MessageSquare size={14} />
                      Vietsub #1
                    </button>
                  </div>

                  {/* Rút gọn toggle */}
                  <button
                    onClick={() => setIsCompact(!isCompact)}
                    className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                  >
                    Rút gọn
                    <div
                      className={`w-9 h-5 rounded-full relative transition-colors ${isCompact ? "bg-[#ffd875]" : "bg-white/20"}`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${isCompact ? "left-[18px]" : "left-0.5"}`}
                      />
                    </div>
                  </button>
                </div>

                {/* Episode Grid */}
                <div
                  className={`grid gap-3 ${isCompact ? "grid-cols-6 sm:grid-cols-8 lg:grid-cols-10" : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"}`}
                >
                  {episodes[0]?.server_data.map((ep) => (
                    <Link
                      key={ep.slug}
                      href={`/xem-phim/${movie.slug}?tap=${ep.slug}`}
                      className={`flex items-center justify-center gap-2 bg-[#282b3a] text-white rounded-[6.4px] hover:bg-[#ffd875] hover:text-[#191b24] transition-all group ${
                        isCompact ? "h-10 text-xs" : "h-[50px] text-sm"
                      }`}
                    >
                      {!isCompact && (
                        <Play
                          size={12}
                          className="text-white/40 group-hover:text-[#191b24] fill-current"
                        />
                      )}
                      Tập {ep.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Trailer tab */}
            {activeTab === "trailer" && (
              <div className="py-8 text-center text-white/40">
                <p className="text-sm">Chưa có trailer cho phim này.</p>
              </div>
            )}

            {/* Diễn viên tab */}
            {activeTab === "diễn viên" && (
              <div className="py-8 text-center text-white/40">
                <p className="text-sm">
                  Thông tin diễn viên đang được cập nhật.
                </p>
              </div>
            )}

            <CommentsPanel
              movie={{
                movieSlug: movie.slug,
                movieTitle: movie.name,
                posterUrl: movie.poster_url,
              }}
            />

            {/* ===== CÓ THỂ BẠN SẼ THÍCH - Grid 5x2 ===== */}
            <div className="pt-8 space-y-4">
              <h3 className="text-2xl font-semibold text-white">
                Có thể bạn sẽ thích
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {suggestedMovies.slice(0, 10).map((m) => (
                  <Link
                    key={m.id}
                    href={`/phim/${m.slug}`}
                    className="group relative rounded-lg overflow-hidden"
                  >
                    {/* Poster */}
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <Image
                        src={m.posterUrl}
                        alt={m.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Episode badge */}
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-green-600/90 text-white text-[11px] font-bold px-2 py-1 rounded">
                          {m.episodeCurrent || "Full"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <ScrollToTopButton />
    </main>
  );
}

function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-50 bg-[#282b3a] border border-white/10 rounded-lg px-4 py-3 text-white/60 hover:text-white hover:border-white/30 transition-all flex flex-col items-center gap-1 shadow-xl"
    >
      <span className="text-lg">↑</span>
      <span className="text-[9px] font-bold uppercase tracking-wider">
        ĐẦU
        <br />
        TRANG
      </span>
    </button>
  );
}
