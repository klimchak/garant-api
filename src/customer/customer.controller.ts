import {Body, Controller, Delete, Get, Param, Patch, Post, Req, SetMetadata, UseGuards} from '@nestjs/common';
import {CustomerService} from './customer.service';
import {BaseCustomerDto, GetCustomerDto} from "./dto/customer.dto";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AccessTokenGuard} from "../shared/guargs/access-token/access-token.guard";
import {DeleteResult} from "typeorm";
import {Customer} from "./entities/customer.entity";
import {RoleGuard} from "../shared/guargs/role/role.guard";
import {UserRoleEnum} from "../users/entities/user.entity";

export const Roles = (...roles: UserRoleEnum[]) => SetMetadata('roles', roles);

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiBearerAuth('authorization')
  @ApiOperation({summary: 'Customer creation'})
  @ApiResponse({status: 200, type: GetCustomerDto})
  @Post()
  @Roles(UserRoleEnum.Admin, UserRoleEnum.Customer)
  @UseGuards(AccessTokenGuard)
  @UseGuards(RoleGuard)
  public create(@Body() baseCustomerDto: BaseCustomerDto, @Req() data: any): Promise<Customer> {
    // return this.customerService.create(baseCustomerDto);
    return null;
  }
  @ApiBearerAuth('authorization')
  @ApiOperation({summary: 'Get all Customers'})
  @ApiResponse({status: 200, type: Array<GetCustomerDto>})
  @Get()
  @Roles(UserRoleEnum.Super_admin)
  @UseGuards(AccessTokenGuard)
  @UseGuards(RoleGuard)
  public findAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @ApiBearerAuth('authorization')
  @ApiOperation({summary: 'Find Customer by Id'})
  @ApiResponse({status: 200, type: GetCustomerDto})
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  public findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findOneById(id);
  }

  @ApiBearerAuth('authorization')
  @ApiOperation({summary: 'Update Customer by id'})
  @ApiResponse({status: 200, type: BaseCustomerDto})
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  public update(@Param('id') id: string, @Body() baseCustomerDto: BaseCustomerDto) {
    return this.customerService.update(id, baseCustomerDto);
  }

  @ApiBearerAuth('authorization')
  @ApiOperation({summary: 'Customer creation'})
  @ApiResponse({status: 200, type: DeleteResult})
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.customerService.remove(id);
  }
}
