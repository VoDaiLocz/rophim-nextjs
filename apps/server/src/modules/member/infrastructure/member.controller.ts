import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "../../auth/application/auth.service";
import { getSessionToken } from "../../auth/infrastructure/session-cookie";
import { MemberService } from "../application/member.service";

@Controller("member")
export class MemberController {
  constructor(
    private readonly authService: AuthService,
    private readonly memberService: MemberService,
  ) {}

  @Get("favorites")
  async favorites(@Req() request: Request) {
    const user = await this.requireUser(request);
    return { items: await this.memberService.listFavorites(user.id) };
  }

  @Post("favorites")
  async saveFavorite(
    @Req() request: Request,
    @Body()
    body: {
      movieSlug: string;
      movieTitle: string;
      posterUrl?: string;
    },
  ) {
    const user = await this.requireUser(request);
    return this.memberService.saveFavorite(user.id, body);
  }

  @Post("favorites/toggle")
  async toggleFavorite(
    @Req() request: Request,
    @Body()
    body: {
      movieSlug: string;
      movieTitle: string;
      posterUrl?: string;
    },
  ) {
    const user = await this.requireUser(request);
    return this.memberService.toggleFavorite(user.id, body);
  }

  @Get("comments")
  async comments(@Query("movieSlug") movieSlug: string) {
    return { items: await this.memberService.listComments(movieSlug) };
  }

  @Post("comments")
  async createComment(
    @Req() request: Request,
    @Body()
    body: {
      movieSlug: string;
      movieTitle: string;
      posterUrl?: string;
      body: string;
    },
  ) {
    const user = await this.requireUser(request);
    return { item: await this.memberService.createComment(user.id, body) };
  }

  @Get("history")
  async history(@Req() request: Request) {
    const user = await this.requireUser(request);
    return { items: await this.memberService.listWatchHistory(user.id) };
  }

  @Post("history")
  async saveHistory(
    @Req() request: Request,
    @Body()
    body: {
      movieSlug: string;
      movieTitle: string;
      posterUrl?: string;
      episodeName: string;
      progressSeconds?: number;
    },
  ) {
    const user = await this.requireUser(request);
    return {
      item: await this.memberService.saveWatchHistory(user.id, body),
    };
  }

  private async requireUser(request: Request) {
    const user = await this.authService.getCurrentUser(
      getSessionToken(request),
    );
    if (!user) {
      throw new UnauthorizedException("Authentication required");
    }
    return user;
  }
}
