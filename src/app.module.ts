import {Global, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from "@nestjs/typeorm";
import path from "path";
import {ServeStaticModule} from "@nestjs/serve-static";
import {User} from "./users/entities/user.entity";
import {JwtService} from "@nestjs/jwt";
import {CustomerModule} from './customer/customer.module';
import {MailModule} from './mail/mail.module';
import {ScheduleModule} from "@nestjs/schedule";
import {TasksModule} from "./shared/tasks/tasks.module";

@Global()
@Module({
    imports: [
        TasksModule,
        ConfigModule.forRoot({envFilePath: `.${process.env.NODE_ENV}.env`, isGlobal: true}),
        ServeStaticModule.forRoot({
            rootPath: path?.resolve(__dirname, 'static'),
        }),
        ScheduleModule.forRoot(),
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
            }
        ),
        AuthModule,
        MailModule,
        UsersModule,
        CustomerModule,
        MailModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        JwtService,
        ConfigService,
    ],
})
export class AppModule {
}
