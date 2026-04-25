import { MemberService } from "./member.service";

const createPrismaMock = () => ({
  favorite: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  comment: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  watchHistory: {
    upsert: jest.fn(),
    findMany: jest.fn(),
  },
});

describe("MemberService", () => {
  it("adds a movie to favorites when it is not already saved", async () => {
    const prisma = createPrismaMock();
    prisma.favorite.findUnique.mockResolvedValue(null);
    prisma.favorite.create.mockResolvedValue({
      id: "favorite-1",
      userId: "user-1",
      movieSlug: "mua-he-nhung-nam-80",
    });

    const result = await new MemberService(prisma as never).toggleFavorite(
      "user-1",
      {
        movieSlug: "mua-he-nhung-nam-80",
        movieTitle: "Mùa Hè Những Năm 80",
        posterUrl: "https://img.test/poster.jpg",
      },
    );

    expect(result).toEqual({ favorited: true });
    expect(prisma.favorite.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-1",
          movieSlug: "mua-he-nhung-nam-80",
        }),
      }),
    );
  });

  it("keeps a movie saved when it is already in favorites", async () => {
    const prisma = createPrismaMock();
    prisma.favorite.findUnique.mockResolvedValue({ id: "favorite-1" });

    const result = await new MemberService(prisma as never).saveFavorite(
      "user-1",
      {
        movieSlug: "mua-he-nhung-nam-80",
        movieTitle: "Mùa Hè Những Năm 80",
      },
    );

    expect(result).toEqual({ favorited: true });
    expect(prisma.favorite.create).not.toHaveBeenCalled();
    expect(prisma.favorite.delete).not.toHaveBeenCalled();
  });

  it("removes a movie from favorites when it is already saved", async () => {
    const prisma = createPrismaMock();
    prisma.favorite.findUnique.mockResolvedValue({ id: "favorite-1" });
    prisma.favorite.delete.mockResolvedValue({ id: "favorite-1" });

    const result = await new MemberService(prisma as never).toggleFavorite(
      "user-1",
      {
        movieSlug: "mua-he-nhung-nam-80",
        movieTitle: "Mùa Hè Những Năm 80",
      },
    );

    expect(result).toEqual({ favorited: false });
    expect(prisma.favorite.delete).toHaveBeenCalledWith({
      where: { id: "favorite-1" },
    });
  });

  it("sanitizes comments before storing them", async () => {
    const prisma = createPrismaMock();
    prisma.comment.create.mockResolvedValue({
      id: "comment-1",
      body: "Phim hay alert(1)",
      user: { id: "user-1", name: "Ro Member" },
      createdAt: new Date("2026-04-25T00:00:00.000Z"),
    });

    await new MemberService(prisma as never).createComment("user-1", {
      movieSlug: "mua-he-nhung-nam-80",
      movieTitle: "Mùa Hè Những Năm 80",
      body: "Phim hay <script>alert(1)</script>",
    });

    expect(prisma.comment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          body: "Phim hay alert(1)",
        }),
      }),
    );
  });

  it("upserts watch history for the same movie and episode", async () => {
    const prisma = createPrismaMock();
    prisma.watchHistory.upsert.mockResolvedValue({
      id: "history-1",
      userId: "user-1",
      movieSlug: "mua-he-nhung-nam-80",
      episodeName: "1",
      progressSeconds: 42,
    });

    const result = await new MemberService(prisma as never).saveWatchHistory(
      "user-1",
      {
        movieSlug: "mua-he-nhung-nam-80",
        movieTitle: "Mùa Hè Những Năm 80",
        episodeName: "1",
        progressSeconds: 42,
      },
    );

    expect(result.progressSeconds).toBe(42);
    expect(prisma.watchHistory.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_movieSlug_episodeName: {
            userId: "user-1",
            movieSlug: "mua-he-nhung-nam-80",
            episodeName: "1",
          },
        },
      }),
    );
  });
});
