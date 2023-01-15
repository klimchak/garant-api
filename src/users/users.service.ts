import {BadRequestException, Injectable} from '@nestjs/common';
import {User} from "./entities/user.entity";
import {DeleteResult, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {PostUserDto, PutUserDto} from "./dto/create-user.dto";
import {CustomerService} from "../customer/customer.service";
import {TemporaryDataService} from "../shared/tasks/temporary-data.service";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private customerService: CustomerService,
        private temporaryDataService: TemporaryDataService,
    ) {
    }

    public async create(createUserDto: PostUserDto, needSecurePass = false): Promise<User> {
        let hash: string
        let check: User | null;
        if (needSecurePass){
            hash = await this.temporaryDataService.hashString(createUserDto.password);
        }
        if (needSecurePass){
            check = await this.findOneByEmail(createUserDto.email);
            if (check){
                throw new BadRequestException('User already exists');
            }
        }
        console.log('check', check)
        const savedUser = await this.usersRepository.save(new User(needSecurePass ? {...createUserDto, password: hash} : createUserDto));
        console.log('savedUser', savedUser);
        savedUser.customer = await this.customerService.create({
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            patronymic: createUserDto.patronymic,
            email: createUserDto.email
        });
        console.log('savedUser with customer', savedUser);
        await this.update(savedUser.id, savedUser);
        return savedUser;
    }

    public findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    public findOneById(id: string): Promise<User> {
        return this.usersRepository.findOneBy({id: id});
    }

    public findOneByEmail(email: string): Promise<User> {
        return this.usersRepository.findOneBy({email});
    }

    public update(id: string, updateUserDto: PutUserDto) {
        return this.usersRepository.update(id, updateUserDto);
    }

    public remove(id: string): Promise<DeleteResult> {
        return this.usersRepository.delete(id);
    }
}
