import {Injectable} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {PreSignupAnswerMessageDto, PreSignupAnswerMessageModel} from "../shared/shared-models/answer.model";

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {
    }

    async sendUserConfirmation(email: string, data: PreSignupAnswerMessageModel): Promise<PreSignupAnswerMessageDto> {
        await this.mailerService.sendMail({
            to: email,
            from: '"Support Team" <gobizy-support@gobizy.com>',
            subject: 'Welcome to GoBizy! Confirm your Email',
            template: './confirmation',
            context: {code: data.code},
        });
        return Promise.resolve(new PreSignupAnswerMessageDto({
            code: data.code,
            message: data.message,
            timeExpired: data.timeExpired
        }));
    }
}
