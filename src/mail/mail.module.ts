import {Module} from '@nestjs/common';
import {MailService} from './mail.service';
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import {join} from "path";
import {environment} from "../environment/environment";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: environment.MAIL_HOST,
                port: environment.MAIL_PORT,
                auth: {user: environment.MAIL_USER, pass: environment.MAIL_PASS},
            },
            defaults: {from: '"No Reply" <noreply@example.com>'},
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {strict: true},
            },
        }),
    ],
    providers: [MailService]
})
export class MailModule {
}
