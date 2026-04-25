import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma.service";

interface MovieInput {
  movieSlug: string;
  movieTitle: string;
  posterUrl?: string;
}

interface CommentInput extends MovieInput {
  body: string;
}

interface WatchHistoryInput extends MovieInput {
  episodeName: string;
  progressSeconds?: number;
}

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async listFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async toggleFavorite(userId: string, input: MovieInput) {
    const movie = this.normalizeMovieInput(input);
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_movieSlug: {
          userId,
          movieSlug: movie.movieSlug,
        },
      },
    });

    if (existingFavorite) {
      await this.prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
      return { favorited: false };
    }

    await this.prisma.favorite.create({
      data: {
        userId,
        ...movie,
      },
    });
    return { favorited: true };
  }

  async saveFavorite(userId: string, input: MovieInput) {
    const movie = this.normalizeMovieInput(input);
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_movieSlug: {
          userId,
          movieSlug: movie.movieSlug,
        },
      },
    });

    if (existingFavorite) {
      return { favorited: true };
    }

    await this.prisma.favorite.create({
      data: {
        userId,
        ...movie,
      },
    });
    return { favorited: true };
  }

  async listComments(movieSlug: string) {
    return this.prisma.comment.findMany({
      where: { movieSlug: this.normalizeSlug(movieSlug) },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async createComment(userId: string, input: CommentInput) {
    const movie = this.normalizeMovieInput(input);
    const body = this.sanitizeComment(input.body);

    return this.prisma.comment.create({
      data: {
        userId,
        ...movie,
        body,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async listWatchHistory(userId: string) {
    return this.prisma.watchHistory.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
  }

  async saveWatchHistory(userId: string, input: WatchHistoryInput) {
    const movie = this.normalizeMovieInput(input);
    const episodeName = `${input.episodeName || "1"}`.trim().slice(0, 40);
    const progressSeconds = Math.max(
      0,
      Math.floor(Number(input.progressSeconds || 0)),
    );

    return this.prisma.watchHistory.upsert({
      where: {
        userId_movieSlug_episodeName: {
          userId,
          movieSlug: movie.movieSlug,
          episodeName,
        },
      },
      update: {
        ...movie,
        progressSeconds,
      },
      create: {
        userId,
        ...movie,
        episodeName,
        progressSeconds,
      },
    });
  }

  private normalizeMovieInput(input: MovieInput): MovieInput {
    return {
      movieSlug: this.normalizeSlug(input.movieSlug),
      movieTitle: this.normalizeTitle(input.movieTitle),
      posterUrl: input.posterUrl?.trim() || undefined,
    };
  }

  private normalizeSlug(slug: string): string {
    const normalizedSlug = `${slug || ""}`.trim();
    if (!/^[a-z0-9-_]+$/i.test(normalizedSlug)) {
      throw new BadRequestException("Invalid movie slug");
    }
    return normalizedSlug;
  }

  private normalizeTitle(title: string): string {
    const normalizedTitle = `${title || ""}`.trim().replace(/\s+/g, " ");
    if (normalizedTitle.length < 1 || normalizedTitle.length > 180) {
      throw new BadRequestException("Invalid movie title");
    }
    return normalizedTitle;
  }

  private sanitizeComment(body: string): string {
    let withoutTags = "";
    let insideTag = false;

    for (const character of `${body || ""}`) {
      if (character === "<") {
        insideTag = true;
        continue;
      }
      if (character === ">") {
        insideTag = false;
        continue;
      }
      if (!insideTag) {
        withoutTags += character;
      }
    }

    const sanitizedBody = withoutTags.trim().replace(/\s+/g, " ").slice(0, 500);

    if (sanitizedBody.length < 2) {
      throw new BadRequestException("Comment is too short");
    }

    return sanitizedBody;
  }
}
