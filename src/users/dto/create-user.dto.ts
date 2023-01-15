import {ApiProperty} from "@nestjs/swagger";
import {v4 as uuidv4} from 'uuid';


export class PostUserDto {
    @ApiProperty({example: 'user@gmail.com', description: 'User e-mail'})
    email?: string;
    @ApiProperty({example: 'QWERTY12345', description: 'User password'})
    password?: string;
    @ApiProperty({example: 'Keanu', description: 'User first name'})
    firstName?: string;
    @ApiProperty({example: 'Reeves', description: 'User last name'})
    lastName?: string;
    @ApiProperty({example: 'Il`ich', description: 'User patronymic name'})
    patronymic?: string;
    @ApiProperty({example: 1, description: 'User role'})
    role?: number;
    @ApiProperty({example: false})
    isApproved?: boolean;
    @ApiProperty({example: false})
    isActive?: boolean;
}

export class GetUserDto extends PostUserDto {
    @ApiProperty({example: uuidv4(), description: 'item id'})
    id?: string;
}

export class PutUserDto {
    @ApiProperty({example: 'Keanu', description: 'User first name'})
    firstName?: string;
    @ApiProperty({example: 'Reeves', description: 'User last name'})
    lastName?: string;
    @ApiProperty({example: 'Il`ich', description: 'User patronymic name'})
    patronymic?: string;
    @ApiProperty({example: false})
    isApproved?: boolean;
    @ApiProperty({example: false})
    isActive?: boolean;
    @ApiProperty({example: 'looooong text', description: 'refresh token'})
    refreshToken?: string;
}

export class DeleteUserDto {
    @ApiProperty({example: uuidv4(), description: 'item id'})
    id: string;
}

export class PaginateDto {
    @ApiProperty({example: 1, description: 'item id'})
    page: number;
    @ApiProperty({example: 10, description: 'item id'})
    offset?: number;
    // @ApiProperty({example: uuidv4(), description: 'item id'})
    // path: string;
    // @ApiProperty({example: uuidv4(), description: 'item id'})
    // url: string;
}

