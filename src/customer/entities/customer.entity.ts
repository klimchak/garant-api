import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {BaseCustomerDto} from "../dto/customer.dto";

export interface CustomerModel {
    id?: string;
    firstName?: string;
    lastName?: string;
    patronymic?: string;
    birthday?: Date;
    photo?: string;
    phoneNumber?: string;
    customerType?: CustomerTypeEnum;
    email?: string;
    city?: string;
}

export enum CustomerTypeEnum {
    Individual = 1,
    Entity,
    Individual_entrepreneur
}

@Entity()
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    firstName: string;

    @Column('text')
    lastName: string;

    @Column('text', {nullable: true})
    patronymic: string;

    @Column('date', {nullable: true})
    birthday: Date;

    @Column('text', {nullable: true})
    photo: string;

    @Column('text', {nullable: true})
    phoneNumber: string;

    @Column({type: 'enum', enum: CustomerTypeEnum, default: CustomerTypeEnum.Individual, nullable: false})
    customerType: CustomerTypeEnum;

    @Column('text')
    email: string;

    @Column('text', {nullable: true})
    city: string;

    constructor(user: BaseCustomerDto) {
        if (user) {
            Object.keys(user).forEach((modelKey) => this[modelKey] = user[modelKey]);
        }
    }
}
