import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {AccessTokenStrategy} from "./strategies/accessToken.strategy";
import {RefreshTokenStrategy} from "./strategies/refreshToken.strategy";
import {UsersModule} from "../users/users.module";
import {UsersService} from "../users/users.service";
import {PassportModule} from "@nestjs/passport";
import {CustomerModule} from "../customer/customer.module";
import {CustomerService} from "../customer/customer.service";
import {MailModule} from "../mail/mail.module";
import {MailService} from "../mail/mail.service";

@Module({
  imports: [
      PassportModule.register({ session: true }),
      JwtModule.register({}),
      MailModule,
      UsersModule,
      CustomerModule,
  ],
  controllers: [AuthController],
  providers: [
      AuthService, AccessTokenStrategy, RefreshTokenStrategy,
      MailService,
      UsersService,
      CustomerService
  ],
})
export class AuthModule {}
