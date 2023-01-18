import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from "@nestjs/core";
import {UserModel, UserRoleEnum} from "../../../users/entities/user.entity";
import {JwtService} from "@nestjs/jwt";
import {get} from "lodash";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService
        ) {
    }

    private matchRoles(roles: UserRoleEnum[], userRole: UserRoleEnum) {
        return roles.some((role) => role <= userRole);
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<UserRoleEnum[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest<Request>();
        const userTokenInfo = this.jwtService.decode((get(request.headers, 'authorization') as string).split('Bearer ')[1]) as UserModel;
        console.log('check role: ');
        console.log('roles on api: ', roles);
        console.log('role in token: ', userTokenInfo.role);
        console.log('match role: ', this.matchRoles(roles, userTokenInfo.role) ? 'APPROVE' : 'REJECT');
        console.log( );
        console.log( );
        return this.matchRoles(roles, userTokenInfo.role);
    }
}
