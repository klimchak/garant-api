import {ApiProperty} from "@nestjs/swagger";

export class AuthLoginDto {
    @ApiProperty({example: 'user@gmail.com', description: 'User e-mail'})
    email: string;
    @ApiProperty({example: 'QWERTY12345', description: 'User password'})
    password: string;
}
