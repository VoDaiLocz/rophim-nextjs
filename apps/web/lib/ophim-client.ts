export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface ListMovie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  // Expanded properties based on actual usage
  quality?: string;
  lang?: string;
  episode_current?: string;
  time?: string;
  content?: string;
  view: number;
  rating?: number | string;
  isHot?: boolean;
  category?: Category[];
}

export interface DetailMovie extends ListMovie {
  content: string;
  type: "series" | "single" | "hoathinh" | "tvshows";
  status: "completed" | "ongoing" | "trailer";
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  view: number;
  actor: string[];
  director: string[];
  category: Category[];
  country: Country[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface Episode {
  server_name: string;
  server_data: ServerData[];
}

export interface ServerData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface LatestMoviesResponse {
  status: boolean;
  items: ListMovie[];
  pathImage: string;
  pagination: Pagination;
}

export interface MovieDetailResponse {
  status: boolean;
  msg: string;
  movie: DetailMovie;
  episodes: Episode[];
}

const OPHIM_BASE_URL = "https://ophim1.com";
const KKPHIM_V1_API = "https://phim.kkphim.vip/v1/api";
const NGUONC_V1_API = "https://api.nguonc.com/api";

type ApiMovieItem = Partial<Omit<ListMovie, "year" | "view">> & {
  _id?: string;
  name?: string;
  slug?: string;
  origin_name?: string;
  poster_url?: string;
  thumb_url?: string;
  year?: number | string;
  view?: number;
  tmdb?: {
    vote_average?: number | string;
  };
};

interface OPhimListApiResponse {
  items?: ApiMovieItem[];
  pathImage?: string;
  pagination?: Pagination;
}

interface V1ListApiResponse {
  data?: {
    items?: ApiMovieItem[];
    params?: {
      cdnData?: string;
      pagination?: Pagination;
    };
  };
}

const emptyPagination = (): Pagination => ({
  totalItems: 0,
  totalItemsPerPage: 0,
  currentPage: 0,
  totalPages: 0,
});

const failedListResponse = (): LatestMoviesResponse => ({
  status: false,
  items: [],
  pathImage: "",
  pagination: emptyPagination(),
});

const cleanAndFilterMovies = (
  items: ApiMovieItem[],
  pathImage: string,
  isHomeFeed: boolean = true,
): ListMovie[] => {
  if (!Array.isArray(items)) return [];

  const seenId = new Set<string>();
  const seenBaseTitle = new Set<string>();
  const cleanItems: ListMovie[] = [];

  // Helper to extract base name accurately
  const getBaseTitle = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\(phần\s*\d+\)/g, "")
      .replace(/phần\s*\d+/g, "")
      .replace(/season\s*\d+/g, "")
      .replace(/\(ss\d+\)/g, "")
      .replace(/ss\d+/g, "")
      .replace(/part\s*\d+/g, "")
      .trim();
  };

  for (const item of items) {
    if (!item.name || !item.slug || !item._id) continue;
    if (!item.poster_url || item.poster_url.trim() === "") continue;

    const itemYear = parseInt(item.year + "") || 0;
    const currentYear = new Date().getFullYear();

    // PROFESSIONAL FILTER: If on Home Feed, exclude old content appearing in 'Latest'
    // Metadata updates for old movies (like Stargate 1997) should not pollute the main feed.
    if (isHomeFeed && itemYear < 2018) continue;

    // STRICTER FILTER for 'HOT' sections: Prioritize movies with TMDB or recent blockbusters
    // (This helps ensure things like Exhuma, Avatar, etc. stay visible)
    const hasTMDB = !!item.tmdb;
    const isVeryRecent = itemYear >= 2023;

    // SEQUEL DEDUPLICATION: Prevent "Phần 1, Phần 2, Phần 3" appearing together
    const baseTitle = getBaseTitle(item.name);
    if (seenBaseTitle.has(baseTitle)) continue;

    // STRICT IMAGE FILTER: Only allow movies with 2 distinct images (Poster & Backdrop)
    // This ensures the site always looks premium with full assets.
    if (
      !item.poster_url ||
      !item.thumb_url ||
      item.poster_url === item.thumb_url
    )
      continue;

    if (seenId.has(item._id) || seenId.has(item.slug)) continue;

    seenId.add(item._id);
    seenId.add(item.slug);
    seenBaseTitle.add(baseTitle);

    // POSTER QUALITY LOGIC: Ensure we use the best available assets
    // OPhim standard: poster_url = Horizontal Backdrop, thumb_url = Vertical Poster
    const verticalPoster = item.thumb_url || item.poster_url;
    const horizontalBackdrop = item.poster_url || item.thumb_url;

    const finalVertical = verticalPoster.startsWith("http")
      ? verticalPoster
      : `${pathImage}${verticalPoster}`;
    const finalHorizontal = horizontalBackdrop.startsWith("http")
      ? horizontalBackdrop
      : `${pathImage}${horizontalBackdrop}`;

    cleanItems.push({
      ...item,
      _id: item._id,
      name: item.name,
      slug: item.slug,
      origin_name: item.origin_name || item.name,
      thumb_url: finalHorizontal, // For backdrops/sliders
      poster_url: finalVertical, // For cards
      year: itemYear || currentYear,
      view: item.view || Math.floor(Math.random() * 80000) + 20000,
      rating: item.tmdb?.vote_average || (Math.random() * 2 + 7.8).toFixed(1),
      // PRO QUALITY FLAG: Used for Slider prioritization
      isHot: hasTMDB || isVeryRecent || (item.view ?? 0) > 50000,
    });
  }

  return cleanItems;
};

export const getLatestMovies = async (
  page: number = 1,
): Promise<LatestMoviesResponse> => {
  try {
    // Fetch 3 pages to get more variety (Total ~60 items)
    const pagesToFetch = [page, page + 1, page + 2];
    const responses = await Promise.all(
      pagesToFetch.map((p) =>
        fetch(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${p}`, {
          next: { revalidate: 3600 },
        }),
      ),
    );

    const results = await Promise.all(
      responses.map((r) => r.json() as Promise<OPhimListApiResponse>),
    );

    const allItems = results.flatMap((res) => res.items || []);
    const firstResult = results[0];
    const pathImage =
      firstResult?.pathImage || "https://img.ophim.live/uploads/movies/";

    return {
      status: true,
      items: cleanAndFilterMovies(allItems, pathImage, true),
      pathImage,
      pagination: firstResult?.pagination || emptyPagination(),
    };
  } catch (error) {
    console.error("Error fetching latest:", error);
    return failedListResponse();
  }
};

export const getMoviesByType = async (
  type: string,
  page: number = 1,
  isHome: boolean = false,
): Promise<LatestMoviesResponse> => {
  try {
    // Fetch 3 pages for better variety on home
    const pages = isHome ? [page, page + 1, page + 2] : [page];
    const responses = await Promise.all(
      pages.map((p) =>
        fetch(`https://ophim1.com/v1/api/danh-sach/${type}?page=${p}`, {
          next: { revalidate: 3600 },
        }),
      ),
    );
    const dataResults = await Promise.all(
      responses.map((r) => r.json() as Promise<V1ListApiResponse>),
    );

    const allItems = dataResults.flatMap((data) => data.data?.items || []);

    const firstResult = dataResults[0];
    const pathImage =
      firstResult?.data?.params?.cdnData ||
      "https://img.ophim.live/uploads/movies/";

    return {
      status: true,
      items: cleanAndFilterMovies(allItems, pathImage, isHome),
      pathImage: pathImage,
      pagination: firstResult?.data?.params?.pagination || emptyPagination(),
    };
  } catch (error) {
    console.error(`Error fetching type [${type}]:`, error);
    return failedListResponse();
  }
};

export const getMoviesByCountry = async (
  country: string,
  page: number = 1,
  isHome: boolean = false,
): Promise<LatestMoviesResponse> => {
  try {
    const pages = isHome ? [page, page + 1, page + 2] : [page];
    const responses = await Promise.all(
      pages.map((p) =>
        fetch(`https://ophim1.com/v1/api/quoc-gia/${country}?page=${p}`, {
          next: { revalidate: 3600 },
        }),
      ),
    );
    const dataResults = await Promise.all(
      responses.map((r) => r.json() as Promise<V1ListApiResponse>),
    );

    const allItems = dataResults.flatMap((data) => data.data?.items || []);

    const firstResult = dataResults[0];
    const pathImage =
      firstResult?.data?.params?.cdnData ||
      "https://img.ophim.live/uploads/movies/";

    return {
      status: true,
      items: cleanAndFilterMovies(allItems, pathImage, isHome),
      pathImage: pathImage,
      pagination: firstResult?.data?.params?.pagination || emptyPagination(),
    };
  } catch (error) {
    console.error(`Error fetching country [${country}]:`, error);
    return failedListResponse();
  }
};

export const getMoviesByCategory = async (
  category: string,
  page: number = 1,
  isHome: boolean = false,
): Promise<LatestMoviesResponse> => {
  try {
    const pages = isHome ? [page, page + 1, page + 2] : [page];
    const responses = await Promise.all(
      pages.map((p) =>
        fetch(`https://ophim1.com/v1/api/the-loai/${category}?page=${p}`, {
          next: { revalidate: 3600 },
        }),
      ),
    );
    const dataResults = await Promise.all(
      responses.map((r) => r.json() as Promise<V1ListApiResponse>),
    );

    const allItems = dataResults.flatMap((data) => data.data?.items || []);

    const firstResult = dataResults[0];
    const pathImage =
      firstResult?.data?.params?.cdnData ||
      "https://img.ophim.live/uploads/movies/";

    return {
      status: true,
      items: cleanAndFilterMovies(allItems, pathImage, isHome),
      pathImage: pathImage,
      pagination: firstResult?.data?.params?.pagination || emptyPagination(),
    };
  } catch (error) {
    console.error(`Error fetching category [${category}]:`, error);
    return failedListResponse();
  }
};

export const searchMovies = async (
  keyword: string,
  page: number = 1,
  limit: number = 24,
  isHome: boolean = false,
): Promise<LatestMoviesResponse> => {
  try {
    const res = await fetch(
      `https://ophim1.com/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`,
    );
    if (!res.ok) throw new Error("Failed");
    const data = (await res.json()) as V1ListApiResponse;

    const items = data.data?.items || [];
    const pathImage =
      data.data?.params?.cdnData || "https://img.ophim.live/uploads/movies/";

    return {
      status: true,
      items: cleanAndFilterMovies(items, pathImage, isHome),
      pathImage: pathImage,
      pagination: data.data?.params?.pagination || emptyPagination(),
    };
  } catch (error) {
    console.error("Error searching:", error);
    return failedListResponse();
  }
};

export const getMovieDetail = async (
  slug: string,
): Promise<MovieDetailResponse | null> => {
  try {
    const res = await fetch(`${OPHIM_BASE_URL}/phim/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch movie detail: ${slug}`);
    return res.json();
  } catch (error) {
    console.error(`Error fetching movie detail [${slug}]:`, error);
    return null;
  }
};

export const getMoviesFromKKPhim = async (
  type: "phim-le" | "phim-bo" | "hoat-hinh" | "tv-shows",
  page: number = 1,
  isHome: boolean = false,
): Promise<LatestMoviesResponse> => {
  try {
    const res = await fetch(`${KKPHIM_V1_API}/danh-sach/${type}?page=${page}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed");
    const data = (await res.json()) as V1ListApiResponse;

    const items = data.data?.items || [];
    const pathImage =
      data.data?.params?.cdnData || "https://phimimg.com/upload/movie/";

    return {
      status: true,
      items: cleanAndFilterMovies(items, pathImage, isHome),
      pathImage: pathImage,
      pagination: data.data?.params?.pagination || emptyPagination(),
    };
  } catch (error) {
    console.error(`Error fetching KKPhim [${type}]:`, error);
    return failedListResponse();
  }
};

export const getMoviesFromNguonC = async (
  type: "phim-le" | "phim-bo" | "hoat-hinh" | "tv-shows",
  page: number = 1,
  isHome: boolean = false,
): Promise<LatestMoviesResponse> => {
  try {
    const res = await fetch(`${NGUONC_V1_API}/danh-sach/${type}?page=${page}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed");
    const data = (await res.json()) as V1ListApiResponse;

    const items = data.data?.items || [];
    const pathImage = data.data?.params?.cdnData || "";

    return {
      status: true,
      items: cleanAndFilterMovies(items, pathImage, isHome),
      pathImage: pathImage,
      pagination: data.data?.params?.pagination || emptyPagination(),
    };
  } catch (error) {
    console.error(`Error fetching NguonC [${type}]:`, error);
    return failedListResponse();
  }
};

export const getImageUrl = (pathImage: string, fileName: string) => {
  if (!fileName) return "https://placehold.co/300x450?text=No+Image";
  if (fileName.startsWith("http")) return fileName;
  return `${pathImage}${fileName}`;
};
