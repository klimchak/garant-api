import {Injectable} from '@nestjs/common';
import {BaseCustomerDto} from "./dto/customer.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {Customer} from "./entities/customer.entity";
import {PutUserDto} from "../users/dto/create-user.dto";

@Injectable()
export class CustomerService {

    constructor(
        @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
    ) {
    }

    public create(createCustomerDto: BaseCustomerDto) {
        return this.customerRepository.save(new Customer(createCustomerDto));
    }

    public findAll(): Promise<Customer[]> {
        return this.customerRepository.find();
    }

    public findOneById(id: string): Promise<Customer> {
        return this.customerRepository.findOneBy({id: id});
    }

    public findOneByEmail(email: string): Promise<Customer> {
        return this.customerRepository.findOneBy({email});
    }

    public update(id: string, updateUserDto: PutUserDto) {
        return this.customerRepository.update(id, updateUserDto);
    }

    public remove(id: string): Promise<DeleteResult> {
        return this.customerRepository.delete(id);
    }
}
