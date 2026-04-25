import { PrismaClient } from "@rophim/database";
import { Movie } from "../../domain/movie.entity";
import { GetMoviesUseCase } from "./get-movies.use-case";

jest.mock("@rophim/database", () => ({
  PrismaClient: jest.fn(),
}));

describe("GetMoviesUseCase", () => {
  const findMany = jest.fn();
  const prismaClient = PrismaClient as unknown as jest.Mock;

  beforeEach(() => {
    findMany.mockReset();
    prismaClient.mockClear();
    prismaClient.mockImplementation(() => ({
      movie: {
        findMany,
      },
    }));
  });

  it("loads movies newest first and maps database records to domain movies", async () => {
    findMany.mockResolvedValue([
      {
        id: "movie-1",
        title: "Movie One",
        slug: "movie-one",
        description: null,
        posterUrl: "poster.jpg",
        backdropUrl: null,
        releaseYear: 2026,
        imdbRating: 8.4,
      },
    ]);

    const result = await new GetMoviesUseCase().execute();

    expect(findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });
    expect(result).toEqual([
      new Movie(
        "movie-1",
        "Movie One",
        "movie-one",
        undefined,
        "poster.jpg",
        undefined,
        2026,
        8.4,
      ),
    ]);
  });
});
