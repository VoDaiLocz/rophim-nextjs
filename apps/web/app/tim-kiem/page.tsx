"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { InfiniteMovieGrid } from "@/components/infinite-movie-grid";
import { searchMovies, type ListMovie } from "@/lib/ophim-client";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("keyword");
  const [results, setResults] = useState<ListMovie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await searchMovies(query, 1, 24);
        if (res.status) {
          setResults(res.items);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="pt-24 container mx-auto px-4 lg:px-8 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Kết quả tìm kiếm cho:{" "}
          <span className="text-[#ffd875]">&quot;{query}&quot;</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Tìm thấy {results.length} kết quả
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="w-12 h-12 border-4 border-[#ffd875] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#ffd875]/40 animate-pulse text-xs font-black uppercase tracking-[0.3em]">
            Hệ não đang truy vấn dữ liệu...
          </p>
        </div>
      ) : results.length > 0 ? (
        <InfiniteMovieGrid
          initialItems={results}
          initialTotalPages={10}
          fetchMore={(page) => searchMovies(query || "", page, 24)}
        />
      ) : (
        <div className="text-center py-32 bg-white/5 rounded-[20px] border border-white/10 backdrop-blur-md">
          <p className="text-white/40 font-black uppercase tracking-[0.2em]">
            Hư vô - Không tìm thấy dấu vết của &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#0b0d14] text-white">
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchContent />
      </Suspense>
    </main>
  );
}
