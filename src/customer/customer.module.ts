import {Module} from '@nestjs/common';
import {CustomerService} from './customer.service';
import {CustomerController} from './customer.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Customer} from "./entities/customer.entity";
import {AccessTokenGuard} from "../shared/guargs/access-token/access-token.guard";
import {JwtService} from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController],
  providers: [AccessTokenGuard, JwtService, CustomerService],
  exports: [TypeOrmModule]
})
export class CustomerModule {}
