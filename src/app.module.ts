import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {UsersController} from "./users/users.controller";
import {UsersService} from "./users/users.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import path from "path";
import {ServeStaticModule} from "@nestjs/serve-static";
import {User} from "./users/entities/user.entity";
import {AuthController} from "./auth/auth.controller";
import {AuthService} from "./auth/auth.service";
import {AccessTokenStrategy} from "./auth/strategies/accessToken.strategy";
import {RefreshTokenStrategy} from "./auth/strategies/refreshToken.strategy";
import {JwtService} from "@nestjs/jwt";
import {CustomerModule} from './customer/customer.module';

@Module({
    imports: [
        ConfigModule.forRoot({envFilePath: `.${process.env.NODE_ENV}.env`, isGlobal: true}),
        ServeStaticModule.forRoot({
            rootPath: path?.resolve(__dirname, 'static'),
        }),
        TypeOrmModule.forRoot(
            {
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: +process.env.POSTGRESS_PORT,
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRESS_PASSWORD,
                database: process.env.POSTGRES_DB,
                autoLoadEntities: true,
                synchronize: true,
                entities: [User],
                ssl: {requestCert: true, rejectUnauthorized: false}
                // dialectOptions: {
                //     ssl: {
                //         require: true,
                //         rejectUnauthorized: false,
                //     },
                // },
            }
        ),
        UsersModule,
        AuthModule,
        CustomerModule
    ],
    controllers: [
        AppController,
        // AuthController,
        // UsersController
    ],
    providers: [
        AppService,JwtService, ConfigService
    ],
})
export class AppModule {
}
