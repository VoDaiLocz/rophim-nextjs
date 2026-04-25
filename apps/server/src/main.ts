import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createCorsMiddleware, getAllowedOrigins } from "./cors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3001;

  app.use(createCorsMiddleware(getAllowedOrigins()));

  await app.listen(port, "0.0.0.0");
}
bootstrap();
