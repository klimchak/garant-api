import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {UsersService} from './users.service';
import {User} from "./entities/user.entity";
import {DeleteResult} from "typeorm";
import {GetUserDto, PostUserDto, PutUserDto} from "./dto/create-user.dto";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AccessTokenGuard} from "../shared/guargs/access-token/access-token.guard";

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @ApiOperation({summary: 'User creation'})
    @ApiResponse({status: 200, type: GetUserDto})
    @Post()
    public create(@Body() createUserDto: PostUserDto): Promise<User> {
        return this.usersService.create(createUserDto, true);
    }
    @ApiBearerAuth('authorization')
    @ApiOperation({summary: 'Get all users'})
    @ApiResponse({status: 200, type: Array<GetUserDto>})
    @UseGuards(AccessTokenGuard)
    @Get()
    public findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @ApiBearerAuth('authorization')
    @ApiOperation({summary: 'Find user by Id'})
    @ApiResponse({status: 200, type: GetUserDto})
    @UseGuards(AccessTokenGuard)
    @Get(':id')
    public findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOneById(id);
    }

    @ApiBearerAuth('authorization')
    @ApiOperation({summary: 'Update user by id'})
    @ApiResponse({status: 200, type: PutUserDto})
    @UseGuards(AccessTokenGuard)
    @Patch(':id')
    public update(@Param('id') id: string, @Body() updateUserDto: PutUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @ApiBearerAuth('authorization')
    @ApiOperation({summary: 'User creation'})
    @ApiResponse({status: 200, type: DeleteResult})
    @UseGuards(AccessTokenGuard)
    @Delete(':id')
    public remove(@Param('id') id: string): Promise<DeleteResult> {
        return this.usersService.remove(id);
    }
}
