import {ApiProperty} from "@nestjs/swagger";
import {v4 as uuidv4} from 'uuid';
import {Success} from "../constants/success";

export interface DefaultAnswerMessageModel {
    id: string;
    message: string;
}

export interface LoginMessageModel extends DefaultAnswerMessageModel {
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


export interface PreSignupAnswerMessageModel {
    message: string;
    code: number;
    timeExpired: number;
}

export class PreSignupAnswerMessageDto implements PreSignupAnswerMessageModel {
    @ApiProperty({example: 'Some text'})
    message: string;
    @ApiProperty({example: 123456, description: 'Only for dev'})
    code: number;
    @ApiProperty({example: 1234564546, description: Success.timeDurationCode})
    timeExpired: number;

    constructor(data: PreSignupAnswerMessageModel) {
        if (data) {
            Object.keys(data).forEach((modelKey) => this[modelKey] = data[modelKey]);
        }
    }
}

export interface ConfirmCodeAnswerMessageModel {
    message: string;
    result: boolean;
}

export class ConfirmCodeAnswerMessageDTO implements ConfirmCodeAnswerMessageModel {
    @ApiProperty({example: 'Some text'})
    message: string;
    @ApiProperty({example: true, description: 'True - when cod is confirmed'})
    result: boolean;

    constructor(data: ConfirmCodeAnswerMessageModel) {
        if (data) {
            Object.keys(data).forEach((modelKey) => this[modelKey] = data[modelKey]);
        }
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
