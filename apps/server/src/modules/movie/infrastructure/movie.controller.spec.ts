import { Test, TestingModule } from '@nestjs/testing';
import { GetMoviesUseCase } from '../application/use-cases/get-movies.use-case';
import { MovieController } from './movie.controller';

describe('MovieController', () => {
    let controller: MovieController;
    const execute = jest.fn();

    beforeEach(async () => {
        execute.mockReset();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [MovieController],
            providers: [
                {
                    provide: GetMoviesUseCase,
                    useValue: { execute },
                },
            ],
        }).compile();

        controller = module.get<MovieController>(MovieController);
    });

    it('delegates fetching movies to GetMoviesUseCase', async () => {
        const movies = [{ id: '1', title: 'Movie 1' }] as any[];
        execute.mockResolvedValue(movies);

        const result = await controller.getMovies();

        expect(execute).toHaveBeenCalledTimes(1);
        expect(result).toBe(movies);
    });
});
