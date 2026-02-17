"use client";

import { useEffect, useState, use } from "react";
import { Play, Star, Share2, Heart, MessageSquare, Plus, Info, ChevronRight, Zap, List } from "lucide-react";
import Link from "next/link";
import { MovieCarousel } from "@/components/movie-carousel";
import { getMovieDetail, getLatestMovies, type DetailMovie, type Episode, type ListMovie } from "@/lib/ophim-client";
import Image from "next/image";

const IMG_BASE_URL = "https://img.ophim.live/uploads/movies/";

export default function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [movie, setMovie] = useState<DetailMovie | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [latestMovies, setLatestMovies] = useState<ListMovie[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("tập phim");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [movieRes, latestRes] = await Promise.all([
                    getMovieDetail(slug),
                    getLatestMovies(1)
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
            <main className="min-h-screen bg-[#0b0d14] text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-[#ffd875] border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-[#ffd875] text-sm font-black uppercase tracking-[0.2em] animate-pulse">Khởi tạo dữ liệu phim...</div>
                </div>
            </main>
        );
    }

    if (!movie) {
        return (
            <main className="min-h-screen bg-[#0b0d14] text-white">
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-red-500">Không tìm thấy phim này!</h1>
                    <Link href="/" className="text-[#ffd875] hover:underline mt-4 block">Quay lại trang chủ</Link>
                </div>
            </main>
        );
    }

    const transformListMovies = (list: ListMovie[]) => {
        return list.map(m => ({
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
    const isSharedImage = movie.thumb_url === movie.poster_url;

    return (
        <main className="min-h-screen bg-[#0b0d14] text-white font-sans overflow-x-hidden pb-20">
            {/* Backdrop Section - Reference Design Implementation */}
            <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-[#0b0d14]">
                {/* Main Image - Center Focus as requested */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={movie.thumb_url || movie.poster_url}
                        alt={movie.name}
                        fill
                        className="object-cover object-center opacity-100"
                        priority
                        quality={100}
                        unoptimized
                    />

                    {/* Seamless Bottom Fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d14] via-[#0b0d14]/40 to-transparent z-10" />
                </div>
            </div>

            {/* Main Content Area - Aligned Layout (Poster Left, Actions Right) */}
            <div className="container mx-auto px-5 md:px-[20px] -mt-24 md:-mt-32 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* LEFT COLUMN - Information Sidebar (3/12) */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        {/* 1. Poster */}
                        <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border border-white/5 mx-auto lg:mx-0 max-w-[200px] lg:max-w-full group">
                            <Image
                                src={movie.poster_url}
                                alt={movie.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        {/* 2. Titles */}
                        <div className="text-center lg:text-left space-y-1">
                            <h1 className="text-2xl font-bold text-white leading-tight">{movie.name}</h1>
                            <h2 className="text-sm font-medium text-[#ffd875] tracking-wide">{movie.origin_name}</h2>
                        </div>

                        {/* 3. Meta Capsules */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                            <span className="px-2 py-0.5 rounded border border-[#ffd875] text-[#ffd875] text-xs font-bold uppercase">IMDb 0</span>
                            <span className="px-2 py-0.5 rounded border border-white/20 text-white/60 text-xs font-bold">{movie.year}</span>
                            <span className="px-2 py-0.5 rounded border border-white/20 text-white/60 text-xs font-bold">Phần 1</span>
                        </div>

                        {/* 4. Categories */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                            {movie.category?.map(c => (
                                <Link key={c.id} href={`/the-loai/${c.slug}`} className="px-3 py-1 bg-white/5 rounded text-xs text-white/70 hover:text-white transition-colors cursor-pointer">
                                    {c.name}
                                </Link>
                            ))}
                        </div>

                        {/* 5. Status Banner */}
                        <div className="bg-[#1f2333] border-l-4 border-[#ff7300] p-3 rounded-r flex items-center gap-2">
                            <span className="text-[#ff7300] font-bold text-sm">Đã chiếu:</span>
                            <span className="text-white/60 text-xs truncate">{movie.episode_current}</span>
                        </div>

                        {/* 6. Description */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-white uppercase">Giới thiệu:</h3>
                            <p className="text-sm text-white/60 leading-relaxed text-justify"
                                dangerouslySetInnerHTML={{ __html: movie.content }}
                            />
                        </div>

                        {/* 7. Details Table */}
                        <div className="space-y-2 text-sm">
                            <div className="flex">
                                <span className="text-white font-bold min-w-[100px]">Thời lượng:</span>
                                <span className="text-white/60">{movie.time || "Đang cập nhật"}</span>
                            </div>
                            <div className="flex">
                                <span className="text-white font-bold min-w-[100px]">Quốc gia:</span>
                                <span className="text-white/60">{movie.country?.[0]?.name}</span>
                            </div>
                        </div>
                    </div>


                    {/* RIGHT COLUMN - Main Content (9/12) */}
                    <div className="lg:col-span-9 space-y-8">
                        {/* 1. Navigation Tabs */}
                        <div className="border-b border-white/10">
                            <div className="flex items-center gap-8">
                                {['Tập phim', 'Trailer', 'Diễn viên', 'Gallery', 'Đề xuất'].map((tab, idx) => (
                                    <button
                                        key={tab}
                                        className={`pb-4 text-sm font-bold uppercase tracking-wider relative ${idx === 0 ? 'text-[#ffd875]' : 'text-white/40 hover:text-white transition-colors'}`}
                                    >
                                        {tab}
                                        {idx === 0 && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ffd875]" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Viewing Options Selection (Các bản chiếu) */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white">Các bản chiếu</h3>

                            <div className="bg-[#181a25] rounded-lg p-5 flex flex-col sm:flex-row gap-5 relative overflow-hidden group">
                                {/* Background Image for Card */}
                                <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 pointer-events-none">
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#181a25] z-10" />
                                    <Image
                                        src={movie.thumb_url || movie.poster_url}
                                        alt="bg"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="relative z-10 flex-1 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#5a4af4] text-white text-xs font-bold px-2 py-1 rounded">Vietsub</span>
                                    </div>

                                    <div>
                                        <span className="text-white font-bold block mb-1">Tập</span>
                                        {/* Episode List Placeholder */}
                                        <div className="flex gap-2">
                                            {episodes[0]?.server_data.slice(0, 5).map((ep) => (
                                                <Link key={ep.slug} href={`/xem-phim/${movie.slug}?tap=${ep.slug}`} className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-sm font-bold hover:bg-[#ffd875] hover:text-black transition-colors">
                                                    {ep.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <Link
                                        href={`/xem-phim/${movie.slug}`}
                                        className="inline-flex items-center justify-center bg-white text-black font-extrabold text-sm px-6 py-2.5 rounded hover:scale-105 transition-transform"
                                    >
                                        Xem bản này
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* 3. Ad Banner Placeholder */}
                        <div className="w-full h-[100px] bg-[#224] rounded flex items-center justify-center border border-white/5 relative overflow-hidden">
                            {/* Decorative content to mimic ad */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-green-900 opacity-50" />
                            <span className="relative z-10 text-white font-bold text-2xl tracking-widest animate-pulse">HUGE MEMECOIN MONSTER IS HERE</span>
                            <button className="absolute right-10 z-10 bg-[#76b900] text-white font-black px-6 py-2 rounded-full skew-x-[-10deg]">BUY NOW</button>
                        </div>

                        {/* 4. Comments Section Placeholder */}
                        <div className="pt-8 border-t border-white/5">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold text-lg">Bình luận (0)</span>
                                </div>
                                <div className="flex bg-[#1f2333] rounded overflow-hidden text-xs font-bold">
                                    <button className="px-3 py-1.5 bg-white text-black">Bình luận</button>
                                    <button className="px-3 py-1.5 text-white/60 hover:text-white">Đánh giá</button>
                                </div>
                            </div>

                            {/* Comment Input */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 relative overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center text-xs text-white/40">Guest</div>
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        className="w-full bg-[#0b0d14] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#ffd875] min-h-[80px]"
                                        placeholder="Viết bình luận..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Movies */}
            <div className="mt-24 pt-12 border-t border-white/5">
                <MovieCarousel title="Phim cùng thể loại" items={suggestedMovies} />
            </div>
        </main>
    );
}
