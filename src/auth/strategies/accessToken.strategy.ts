import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {GetUserDto} from "../../users/dto/create-user.dto";
import {AppService} from "../../app.service";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private appService: AppService,) {
        super({jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWT_ACCESS_SECRET});
    }

    public validate(payload: GetUserDto) {
        return this.appService.sessions.has(payload.id) && this.appService.sessions.get(payload.id) !== null ? payload : null;
    }
}
