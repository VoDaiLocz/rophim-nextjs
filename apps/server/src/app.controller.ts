import { Controller, Get } from "@nestjs/common";

interface HealthResponse {
  status: "ok";
  service: string;
  uptime: number;
  timestamp: string;
}

@Controller()
export class AppController {
  @Get("health")
  getHealth(): HealthResponse {
    return {
      status: "ok",
      service: "rophim-server",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
