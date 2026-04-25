import { AppController } from "./app.controller";

describe("AppController", () => {
  it("returns a health payload for deployment checks", () => {
    const result = new AppController().getHealth();

    expect(result.status).toBe("ok");
    expect(result.service).toBe("rophim-server");
    expect(result.uptime).toEqual(expect.any(Number));
    expect(result.timestamp).toEqual(expect.any(String));
  });
});
