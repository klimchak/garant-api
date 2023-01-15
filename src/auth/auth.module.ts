import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {AccessTokenStrategy} from "./strategies/accessToken.strategy";
import {RefreshTokenStrategy} from "./strategies/refreshToken.strategy";
import {UsersModule} from "../users/users.module";
import {UsersService} from "../users/users.service";
import {PassportModule} from "@nestjs/passport";
import {AppService} from "../app.service";

@Module({
  imports: [
      PassportModule.register({ session: true }),
      JwtModule.register({}),
      UsersModule
  ],
  controllers: [AuthController],
  providers: [AppService, UsersService, AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
