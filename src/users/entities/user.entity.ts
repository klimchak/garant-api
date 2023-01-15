import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {PostUserDto} from "../dto/create-user.dto";

export interface UserModel {
    id: string;
    firstName: string;
    lastName: string;
    patronymic: string;
    email: string;
    password: string;
    photo: string;
    refreshToken: string;
    role: number;
    isActive: boolean;
    isApproved: boolean;
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    firstName: string;

    @Column('text')
    lastName: string;

    @Column('text', {nullable: true})
    patronymic: string;

    @Column('text')
    email: string;

    @Column('text')
    password: string;

    @Column('text')
    photo: string;

    @Column('text', {nullable: true})
    refreshToken: string;

    @Column('int')
    role: number;

    @Column('boolean', {default: false})
    isActive: boolean;

    @Column('boolean', {default: false})
    isApproved: boolean;

    constructor(user: PostUserDto) {
        if (user) {
            Object.keys(user).forEach((modelKey) => this[modelKey] = user[modelKey]);
        }
    }
}
