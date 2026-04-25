import { AuthService } from "./auth.service";

const createPrismaMock = () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  session: {
    create: jest.fn(),
    findUnique: jest.fn(),
    deleteMany: jest.fn(),
  },
});

describe("AuthService", () => {
  it("registers a new member and returns a session token without exposing password hash", async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: "user-1",
      email: "member@rophim.test",
      name: "Ro Member",
      passwordHash: "stored-hash",
      createdAt: new Date("2026-04-25T00:00:00.000Z"),
    });
    prisma.session.create.mockResolvedValue({
      id: "session-1",
      tokenHash: "token-hash",
      userId: "user-1",
      expiresAt: new Date("2026-05-25T00:00:00.000Z"),
    });

    const result = await new AuthService(prisma as never).register({
      email: " MEMBER@ROPHIM.TEST ",
      name: " Ro Member ",
      password: "strong-password",
    });

    expect(result.user).toEqual({
      id: "user-1",
      email: "member@rophim.test",
      name: "Ro Member",
    });
    expect(result.sessionToken).toEqual(expect.any(String));
    expect(result.sessionToken.length).toBeGreaterThan(40);
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "member@rophim.test",
          name: "Ro Member",
          passwordHash: expect.not.stringContaining("strong-password"),
        }),
      }),
    );
  });

  it("rejects duplicate registration emails", async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue({ id: "existing-user" });

    await expect(
      new AuthService(prisma as never).register({
        email: "member@rophim.test",
        name: "Member",
        password: "strong-password",
      }),
    ).rejects.toThrow("Email already registered");
  });

  it("logs in an existing member with a valid password", async () => {
    const prisma = createPrismaMock();
    const service = new AuthService(prisma as never);
    const passwordHash = await service.hashPasswordForTest("strong-password");
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "member@rophim.test",
      name: "Ro Member",
      passwordHash,
    });
    prisma.session.create.mockResolvedValue({
      id: "session-1",
      tokenHash: "token-hash",
      userId: "user-1",
      expiresAt: new Date("2026-05-25T00:00:00.000Z"),
    });

    const result = await service.login({
      email: "member@rophim.test",
      password: "strong-password",
    });

    expect(result.user.email).toBe("member@rophim.test");
    expect(result.sessionToken).toEqual(expect.any(String));
  });

  it("returns the current member from a valid session token", async () => {
    const prisma = createPrismaMock();
    prisma.session.findUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() + 60_000),
      user: {
        id: "user-1",
        email: "member@rophim.test",
        name: "Ro Member",
      },
    });

    const result = await new AuthService(prisma as never).getCurrentUser(
      "session-token",
    );

    expect(result).toEqual({
      id: "user-1",
      email: "member@rophim.test",
      name: "Ro Member",
    });
  });
});
