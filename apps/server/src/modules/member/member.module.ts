import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { AuthModule } from "../auth/auth.module";
import { MemberService } from "./application/member.service";
import { MemberController } from "./infrastructure/member.controller";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
