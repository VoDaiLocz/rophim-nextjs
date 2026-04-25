import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { AuthService } from "./application/auth.service";
import { AuthController } from "./infrastructure/auth.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
