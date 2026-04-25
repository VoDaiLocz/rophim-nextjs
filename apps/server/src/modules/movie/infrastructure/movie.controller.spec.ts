import { GetMoviesUseCase } from "../application/use-cases/get-movies.use-case";
import { Movie } from "../domain/movie.entity";
import { MovieController } from "./movie.controller";

describe("MovieController", () => {
  it("returns movies from the get movies use case", async () => {
    const movies = [new Movie("movie-1", "Movie One", "movie-one")];
    const getMoviesUseCase = {
      execute: jest.fn().mockResolvedValue(movies),
    } as unknown as GetMoviesUseCase;

    const result = await new MovieController(getMoviesUseCase).getMovies();

    expect(result).toBe(movies);
    expect(getMoviesUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
