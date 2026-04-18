import { GetMoviesUseCase } from './get-movies.use-case';
import { Movie } from '../../domain/movie.entity';

const mockFindMany = jest.fn();

jest.mock('@rophim/database', () => ({
    PrismaClient: jest.fn(() => ({
        movie: {
            findMany: mockFindMany,
        },
    })),
}));

describe('GetMoviesUseCase', () => {
    let useCase: GetMoviesUseCase;

    beforeEach(() => {
        mockFindMany.mockReset();
        useCase = new GetMoviesUseCase();
    });

    it('returns movies ordered by newest first and maps optional fields', async () => {
        const moviesData = [
            {
                id: '1',
                title: 'First Movie',
                slug: 'first-movie',
                description: 'Test description',
                posterUrl: 'poster-1.jpg',
                backdropUrl: null,
                releaseYear: 2024,
                imdbRating: 8.4,
                createdAt: new Date('2024-03-10'),
            },
            {
                id: '2',
                title: 'Second Movie',
                slug: 'second-movie',
                description: null,
                posterUrl: null,
                backdropUrl: 'backdrop-2.jpg',
                releaseYear: null,
                imdbRating: null,
                createdAt: new Date('2023-02-10'),
            },
        ] as any[];

        mockFindMany.mockResolvedValue(moviesData);

        const result = await useCase.execute();

        expect(mockFindMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
        expect(result).toHaveLength(2);

        expect(result[0]).toBeInstanceOf(Movie);
        expect(result[0]).toMatchObject({
            id: '1',
            title: 'First Movie',
            slug: 'first-movie',
            description: 'Test description',
            posterUrl: 'poster-1.jpg',
            backdropUrl: undefined,
            releaseYear: 2024,
            imdbRating: 8.4,
        });

        expect(result[1]).toMatchObject({
            id: '2',
            title: 'Second Movie',
            slug: 'second-movie',
            description: undefined,
            posterUrl: undefined,
            backdropUrl: 'backdrop-2.jpg',
            releaseYear: undefined,
            imdbRating: undefined,
        });
    });
});
