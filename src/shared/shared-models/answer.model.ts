import {ApiProperty} from "@nestjs/swagger";
import {v4 as uuidv4} from 'uuid';

export interface DefaultAnswerMessageModel {
    id: string;
    message: string;
}

export interface LoginMessageModel extends DefaultAnswerMessageModel{
    token: string;
}

export class DefaultAnswerMessageDto {
    @ApiProperty({example: uuidv4(), description: 'Unique identifier'})
    id?: string;
    @ApiProperty({example: 'Some text', description: 'Message for display in toast'})
    message?: string;
    constructor(id?: string, message?: string) {
        this.id = id;
        this.message = message;
    }
}

export class LoginMessageModelDto {
    @ApiProperty({example: uuidv4(), description: 'Unique identifier'})
    id?: string;
    @ApiProperty({example: 'Some text', description: 'Message for display in toast'})
    message?: string;
    @ApiProperty({example: 'Some token', description: 'auth token'})
    token?: string;
}
