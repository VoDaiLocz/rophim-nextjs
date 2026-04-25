"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

export const Navbar = () => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        lastScrollY > 50
          ? "bg-[#0b0d14]/95 backdrop-blur-xl py-2.5 md:py-3 border-b border-white/5 shadow-2xl"
          : "bg-transparent py-3 md:py-4 bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="w-full px-3 sm:px-5 lg:px-12 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4 z-20">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Mở menu"
            className="menu-toggle cursor-pointer hover:bg-white/10 w-9 min-w-9 h-9 md:w-10 md:min-w-10 md:h-10 flex items-center justify-center rounded-full transition-colors z-[110] outline-none"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span
                className={`w-full h-[1.5px] bg-white rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
              ></span>
              <span
                className={`w-full h-[1.5px] bg-white rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`w-full h-[1.5px] bg-white rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
              ></span>
            </div>
          </button>

          <Link href="/" className="shrink-0 transition-opacity duration-300">
            <Image
              alt="logo"
              width={100}
              height={40}
              src="/images/logo.svg"
              className="h-6 sm:h-8 md:h-[34px] w-auto drop-shadow-md"
              priority
            />
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-4">
          <div className="relative flex min-w-0 items-center justify-end w-[min(42vw,150px)] sm:w-[240px] md:w-[350px]">
            <form className="w-full" action="/tim-kiem">
              <div className="relative group">
                <input
                  name="keyword"
                  className="w-full bg-white/5 border border-white/10 text-white text-[12px] sm:text-[13px] rounded-full py-1.5 sm:py-2 pl-3 sm:pl-5 pr-9 sm:pr-12 focus:bg-white/10 focus:border-[#ffd875]/40 outline-none shadow-2xl transition-all placeholder:text-white/35"
                  placeholder="Tìm phim..."
                />
                <button
                  type="submit"
                  aria-label="Tìm kiếm"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#ffd875]"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>
          </div>

          <Link
            href="/login"
            className="hidden lg:flex items-center gap-2 bg-[#ffd875] text-black px-5 py-2 rounded-full font-black text-[12px] uppercase tracking-tighter hover:bg-white transition-all"
          >
            THÀNH VIÊN
          </Link>
        </div>
      </div>

      {/* Reverted Dropdown Menu */}
      <div
        className={`absolute top-[calc(100%-4px)] left-3 sm:left-5 mt-3 w-[calc(100vw-24px)] max-w-[300px] bg-black/95 backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 transition-all duration-300 origin-top-left ${isMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}`}
      >
        <div className="p-6">
          <p className="text-[#ffd875] text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-40">
            Danh mục phim
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {[
              { name: "Trang Chủ", path: "/" },
              { name: "Cổ Trang", path: "/the-loai/co-trang" },
              { name: "Hài Hước", path: "/the-loai/hai-huoc" },
              { name: "Tình Cảm", path: "/the-loai/tinh-cam" },
              { name: "Hành Động", path: "/the-loai/hanh-dong" },
              { name: "Kinh Dị", path: "/the-loai/kinh-di" },
              { name: "Võ Thuật", path: "/the-loai/vo-thuat" },
              { name: "Hình Sự", path: "/the-loai/hinh-su" },
              { name: "Hoạt Hình", path: "/danh-sach/hoat-hinh" },
              { name: "Phim Bộ", path: "/danh-sach/phim-bo" },
              { name: "Phim Lẻ", path: "/danh-sach/phim-le" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-[13px] font-bold text-white/70 hover:text-[#ffd875] transition-all hover:translate-x-1 uppercase italic tracking-tighter"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
