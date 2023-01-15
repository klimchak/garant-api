import {ApiProperty} from "@nestjs/swagger";

export class AuthLoginDto {
    @ApiProperty({example: 'user@gmail.com', description: 'User e-mail'})
    email: string;
    @ApiProperty({example: 'QWERTY12345', description: 'User password'})
    password: string;
}


export class GetOnetimeRegCodeDto {
    @ApiProperty({example: 'user@gmail.com', description: 'User e-mail'})
    email: string;
}

export class AuthConfirmCodeDto extends GetOnetimeRegCodeDto{
    @ApiProperty({example: 123456, description: 'User code from email'})
    code: number;
}
