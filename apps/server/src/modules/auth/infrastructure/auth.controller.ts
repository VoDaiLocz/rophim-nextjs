import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "../application/auth.service";
import {
  clearSessionCookie,
  getSessionToken,
  setSessionCookie,
} from "./session-cookie";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body() body: { email: string; name: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(body);
    setSessionCookie(response, result.sessionToken);
    return { user: result.user };
  }

  @Post("login")
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(body);
    setSessionCookie(response, result.sessionToken);
    return { user: result.user };
  }

  @Get("me")
  async me(@Req() request: Request) {
    const user = await this.authService.getCurrentUser(
      getSessionToken(request),
    );
    return { user };
  }

  @Post("logout")
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(getSessionToken(request));
    clearSessionCookie(response);
    return { ok: true };
  }

  async requireUser(request: Request) {
    const user = await this.authService.getCurrentUser(
      getSessionToken(request),
    );
    if (!user) {
      throw new UnauthorizedException("Authentication required");
    }
    return user;
  }
}
