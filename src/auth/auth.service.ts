import {BadRequestException, ForbiddenException, Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {PostUserDto} from "../users/dto/create-user.dto";
import {User} from "../users/entities/user.entity";
import {AuthConfirmCodeDto, AuthLoginDto, GetOnetimeRegCodeDto} from "./dto/auth.dto";
import {
    ConfirmCodeAnswerMessageDTO,
    DefaultAnswerMessageDto,
    PreSignupAnswerMessageDto
} from "../shared/shared-models/answer.model";
import {MailService} from "../mail/mail.service";
import {TemporaryDataService} from "../shared/tasks/temporary-data.service";
import {Success} from "../shared/constants/success";
import * as process from "process";

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private temporaryDataService: TemporaryDataService,
        private configService: ConfigService,
        private mailService: MailService
    ) {
    }

    async getOnetimeRegCode(checkedData: GetOnetimeRegCodeDto): Promise<PreSignupAnswerMessageDto> {
        const userExists = await this.usersService.findOneByEmail(checkedData.email);
        if (userExists) {
            throw new BadRequestException('User already exists');
        }
        if (this.temporaryDataService.registerSessions.has(checkedData.email)) {
            return Promise.resolve(new PreSignupAnswerMessageDto({
                message: Success.timeDurationCodeIsSet,
                code: this.temporaryDataService.registerSessions.get(checkedData.email).code,
                timeExpired: this.temporaryDataService.registerSessions.get(checkedData.email).expired - Date.now()
            }));
        }
        // const hashUrlSegment = require('crypto').randomBytes(256).toString('base64');
        const code = Math.floor(100000 + Math.random() * 900000);
        const expired = Date.now() + Number(process.env.EXPIRED_ONETIME_CODE);
        this.temporaryDataService.registerSessions.set(checkedData.email, {code, expired, taskDelete: true});
        return await this.mailService.sendUserConfirmation(checkedData.email, {
            message: Success.timeDurationCode,
            code,
            timeExpired: expired
        });
    }

    private updateOnetimeRegCode(email: string, taskDelete: boolean): void {
        const confirmedCodeData = this.temporaryDataService.registerSessions.get(email);
        confirmedCodeData.expired = taskDelete ? 0 : confirmedCodeData.expired * +process.env.COEF_REG_DELAY_AFTER_CODE_CONFIRM;
        this.temporaryDataService.registerSessions.set(email, confirmedCodeData);
    }

    public onetimeRegCodeConfirm(checkedData: AuthConfirmCodeDto): Promise<ConfirmCodeAnswerMessageDTO> {
        if (this.temporaryDataService.registerSessions.has(checkedData.email)) {
            this.updateOnetimeRegCode(checkedData.email, false);
            return Promise.resolve(new ConfirmCodeAnswerMessageDTO({
                message: 'Everything is fine, the code is confirmed. Continue registration.',
                result: true
            }));
        }
        return Promise.resolve(new ConfirmCodeAnswerMessageDTO({
            message: 'Error. Invalid confirmation code or email. Please, try again',
            result: false
        }));
    }

    async signUp(createUserDto: PostUserDto): Promise<any> {
        // Check if user exists
        const userExists = await this.usersService.findOneByEmail(createUserDto.email);
        if (userExists) {
            throw new BadRequestException('User already exists');
        }
        if (!this.temporaryDataService.registerSessions.has(createUserDto.email)) {
            throw new BadRequestException('Please, confirm your email');
        }
        this.temporaryDataService.registerSessions.delete(createUserDto.email);
        // Hash password
        const hash = await this.temporaryDataService.hashString(createUserDto.password);
        const newUser = await this.usersService.create({...createUserDto, password: hash});
        const tokens = await this.getTokens(newUser);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens;
    }

    async signIn(data: AuthLoginDto) {
        // Check if user exists
        const user = await this.usersService.findOneByEmail(data.email);
        if (!user) throw new BadRequestException('User does not exist');
        const passwordMatches = await this.temporaryDataService.compareSecuredData(data.password, user.password);
        if (!passwordMatches)
            throw new BadRequestException('Password is incorrect');
        const tokens = await this.getTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        this.temporaryDataService.sessions.set(user.id, tokens.accessToken);
        return tokens;
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.usersService.findOneById(userId);
        if (!user || !user.refreshToken)
            throw new ForbiddenException('Access Denied');
        const refreshTokenMatches = await this.temporaryDataService.compareSecuredData(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        this.temporaryDataService.sessions.set(user.id, tokens.accessToken);
        return tokens;
    }

    async logout(userId: string) {
        await this.usersService.update(userId, {refreshToken: null});
        this.temporaryDataService.sessions.set(userId, null);
        return new DefaultAnswerMessageDto(userId, 'User is logout');
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await this.temporaryDataService.hashString(refreshToken);
        return await this.usersService.update(userId, {refreshToken: hashedRefreshToken});
    }

    async getTokens(user: User) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {...user},
                {secret: this.configService.get<string>('JWT_ACCESS_SECRET'), expiresIn: '15m'},
            ),
            this.jwtService.signAsync(
                {...user},
                {secret: this.configService.get<string>('JWT_REFRESH_SECRET'), expiresIn: '7d'},
            ),
        ]);

        return {accessToken, refreshToken};
    }
}
