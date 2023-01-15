import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {GetUserDto} from "../../users/dto/create-user.dto";
import {TemporaryDataService} from "../../shared/tasks/temporary-data.service";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private temporaryDataService: TemporaryDataService) {
        super({jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWT_ACCESS_SECRET});
    }

    public validate(payload: GetUserDto) {
        return this.temporaryDataService.sessions.has(payload.id) && this.temporaryDataService.sessions.get(payload.id) !== null ? payload : null;
    }
}
