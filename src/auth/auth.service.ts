import {BadRequestException, ForbiddenException, HttpStatus, Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {PostUserDto} from "../users/dto/create-user.dto";
import {User, UserModel} from "../users/entities/user.entity";
import * as bcrypt from 'bcryptjs';
import {AuthLoginDto} from "./dto/auth.dto";
import {Request} from "express";
import {DefaultAnswerMessageDto} from "../shared/shared-models/answer.model";
import {AppService} from "../app.service";

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private appService: AppService,
        private configService: ConfigService,
    ) {
    }

    async signUp(createUserDto: PostUserDto): Promise<any> {
        // Check if user exists
        const userExists = await this.usersService.findOneByEmail(createUserDto.email);
        if (userExists) {
            throw new BadRequestException('User already exists');
        }

        // Hash password
        const hash = await this.hashPassword(createUserDto.password);
        const newUser = await this.usersService.create({...createUserDto, password: hash});
        const tokens = await this.getTokens(newUser);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens;
    }

    async signIn(data: AuthLoginDto) {
        // Check if user exists
        const user = await this.usersService.findOneByEmail(data.email);
        if (!user) throw new BadRequestException('User does not exist');
        const passwordMatches = await this.compareSecuredData(data.password, user.password);
        if (!passwordMatches)
            throw new BadRequestException('Password is incorrect');
        const tokens = await this.getTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        this.appService.sessions.set(user.id, tokens.accessToken);
        return tokens;
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.usersService.findOneById(userId);
        if (!user || !user.refreshToken)
            throw new ForbiddenException('Access Denied');
        const refreshTokenMatches = await this.compareSecuredData(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        this.appService.sessions.set(user.id, tokens.accessToken);
        return tokens;
    }

    async logout(userId: string) {
        await this.usersService.update(userId, {refreshToken: null});
        this.appService.sessions.set(userId, null);
        return new DefaultAnswerMessageDto(userId, 'User is logout');
    }

    public async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    public async compareSecuredData(password: string, storedPasswordHash: string): Promise<any> {
        return bcrypt.compare(password, storedPasswordHash);
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await this.hashPassword(refreshToken);
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
