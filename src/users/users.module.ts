import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {CustomerService} from "../customer/customer.service";
import {CustomerModule} from "../customer/customer.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        CustomerModule,
    ],
    controllers: [UsersController],
    providers: [CustomerService, UsersService],
    exports: [TypeOrmModule]
})
export class UsersModule {
}
