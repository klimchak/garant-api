import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PostUserDto} from "../dto/create-user.dto";
import {Customer} from "../../customer/entities/customer.entity";

export enum UserRoleEnum {
    Super_admin = 1,
    Admin,
    Moderator,
    Customer
}

export type UserRoleType = UserRoleEnum.Super_admin | UserRoleEnum.Admin | UserRoleEnum.Moderator | UserRoleEnum.Customer;


export interface UserModel {
    id: string;
    firstName: string;
    lastName: string;
    patronymic: string;
    email: string;
    password: string;
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

    @Column('text', {unique: true})
    email: string;

    @Column('text')
    password: string;

    @Column('text', {nullable: true})
    refreshToken: string;

    @Column({type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.Customer, nullable: false})
    role: UserRoleEnum;

    @Column('boolean', {default: false})
    isActive: boolean;

    @Column('boolean', {default: false})
    isApproved: boolean;

    @OneToOne(() => Customer)
    @JoinColumn()
    customer: Customer

    constructor(user: PostUserDto) {
        if (user) {
            Object.keys(user).forEach((modelKey) => this[modelKey] = user[modelKey]);
        }
    }
}
