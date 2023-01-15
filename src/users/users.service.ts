import {Injectable} from '@nestjs/common';
import {User} from "./entities/user.entity";
import {DeleteResult, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {PostUserDto, PutUserDto} from "./dto/create-user.dto";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
    ) {
    }

    public create(createUserDto: PostUserDto): Promise<User> {
        return this.usersRepository.save(new User(createUserDto));
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
