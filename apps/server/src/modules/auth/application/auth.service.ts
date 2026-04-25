import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { PrismaService } from "../../../database/prisma.service";

const scryptAsync = promisify(scrypt);
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
}

interface AuthResult {
  user: PublicUser;
  sessionToken: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const email = this.normalizeEmail(input.email);
    const name = this.normalizeName(input.name);
    this.assertPassword(input.password);

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException("Email already registered");
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        passwordHash: await this.hashPassword(input.password),
      },
    });

    return this.createSessionForUser(this.toPublicUser(user));
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const email = this.normalizeEmail(input.email);
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      !(await this.verifyPassword(input.password, user.passwordHash))
    ) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return this.createSessionForUser(this.toPublicUser(user));
  }

  async getCurrentUser(
    sessionToken?: string | null,
  ): Promise<PublicUser | null> {
    if (!sessionToken) return null;

    const session = await this.prisma.session.findUnique({
      where: { tokenHash: this.hashSessionToken(sessionToken) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!session || session.expiresAt.getTime() <= Date.now()) {
      return null;
    }

    return session.user;
  }

  async logout(sessionToken?: string | null): Promise<void> {
    if (!sessionToken) return;

    await this.prisma.session.deleteMany({
      where: { tokenHash: this.hashSessionToken(sessionToken) },
    });
  }

  async hashPasswordForTest(password: string): Promise<string> {
    return this.hashPassword(password);
  }

  private async createSessionForUser(user: PublicUser): Promise<AuthResult> {
    const sessionToken = randomBytes(32).toString("base64url");
    await this.prisma.session.create({
      data: {
        tokenHash: this.hashSessionToken(sessionToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
      },
    });

    return { user, sessionToken };
  }

  private normalizeEmail(email: string): string {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new BadRequestException("Invalid email");
    }
    return normalizedEmail;
  }

  private normalizeName(name: string): string {
    const normalizedName = name.trim().replace(/\s+/g, " ");
    if (normalizedName.length < 2 || normalizedName.length > 60) {
      throw new BadRequestException("Name must be 2-60 characters");
    }
    return normalizedName;
  }

  private assertPassword(password: string): void {
    if (password.length < 8 || password.length > 128) {
      throw new BadRequestException("Password must be 8-128 characters");
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString("hex")}`;
  }

  private async verifyPassword(
    password: string,
    storedHash: string,
  ): Promise<boolean> {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;

    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    const storedKey = Buffer.from(key, "hex");
    return (
      storedKey.length === derivedKey.length &&
      timingSafeEqual(storedKey, derivedKey)
    );
  }

  private hashSessionToken(sessionToken: string): string {
    return createHash("sha256").update(sessionToken).digest("hex");
  }

  private toPublicUser(user: PublicUser): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
