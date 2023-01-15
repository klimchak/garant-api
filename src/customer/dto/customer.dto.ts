import {ApiProperty} from "@nestjs/swagger";
import {CustomerTypeEnum} from "../entities/customer.entity";
import {v4 as uuidv4} from 'uuid';

export class BaseCustomerDto {
    @ApiProperty({example: 'Keanu', description: 'User first name'})
    firstName?: string;
    @ApiProperty({example: 'Reeves', description: 'User last name'})
    lastName?: string;
    @ApiProperty({example: 'Il`ich', description: 'User patronymic name'})
    patronymic?: string;
    @ApiProperty({example: new Date().toISOString(), description: 'Birthday date'})
    birthday?: Date;
    @ApiProperty({example: 'base64 data', description: 'User photo'})
    photo?: string;
    @ApiProperty({example: 'any phone number'})
    phoneNumber?: string;
    @ApiProperty({enum: CustomerTypeEnum, example: '0', description: 'Customer type'})
    customerType?: CustomerTypeEnum;
    @ApiProperty({example: 'user@gmail.com', description: 'User e-mail'})
    email?: string;
    @ApiProperty({example: 'Minsk', description: 'User city'})
    city?: string;
}

export class GetCustomerDto extends BaseCustomerDto{
    @ApiProperty({example: uuidv4()})
    id: string;
}
