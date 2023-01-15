import {Body, Controller, Get, HttpCode, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {GetUserDto, PostUserDto} from "../users/dto/create-user.dto";
import {AuthConfirmCodeDto, AuthLoginDto, GetOnetimeRegCodeDto} from "./dto/auth.dto";
import {Request} from 'express';
import {AccessTokenGuard} from "../shared/guargs/access-token/access-token.guard";
import {
    ConfirmCodeAnswerMessageDTO,
    DefaultAnswerMessageDto,
    PreSignupAnswerMessageDto
} from "../shared/shared-models/answer.model";
import {get} from "lodash";
import {RefreshTokenGuard} from "../shared/guargs/refresh-token/refresh-token.guard";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @ApiOperation({summary: 'Check email and send code/url api'})
    @ApiResponse({status: 200, type: PreSignupAnswerMessageDto})
    @HttpCode(200)
    @Post('get-onetime-reg-code')
    public getOnetimeRegCode(@Body() checkedData: GetOnetimeRegCodeDto): Promise<PreSignupAnswerMessageDto> {
        return this.authService.getOnetimeRegCode(checkedData);
    }

    @ApiOperation({summary: 'Check code/url for continue registration api'})
    @ApiResponse({status: 200, type: ConfirmCodeAnswerMessageDTO})
    @HttpCode(200)
    @Post('onetime-reg-code-confirm')
    public onetimeRegCodeConfirm(@Body() checkedData: AuthConfirmCodeDto): Promise<ConfirmCodeAnswerMessageDTO> {
        return this.authService.onetimeRegCodeConfirm(checkedData);
    }

    @ApiOperation({summary: 'Create account api'})
    @ApiResponse({status: 200, type: GetUserDto})
    @HttpCode(200)
    @Post('signup')
    public signup(@Body() createUserDto: PostUserDto) {
        return this.authService.signUp(createUserDto);
    }

    @ApiOperation({summary: 'Login api'})
    @ApiResponse({status: 200, type: GetUserDto})
    @HttpCode(200)
    @Post('signin')
    public signin(@Body() data: AuthLoginDto) {
        return this.authService.signIn(data);
    }

    @ApiBearerAuth('authorization')
    @ApiOperation({summary: 'Logout api'})
    @ApiResponse({status: 200, type: DefaultAnswerMessageDto})
    @UseGuards(AccessTokenGuard)
    @Get('logout')
    public logout(@Req() req: Request) {
        return this.authService.logout(get(req, 'user.id'));
    }

    @ApiBearerAuth('authorization')
    @ApiOperation({summary: 'Update token api'})
    @ApiResponse({status: 200, type: null})
    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    public refreshTokens(@Req() req: Request) {
        return this.authService.refreshTokens(get(req, 'user.id'), get(req, 'user.refreshToken'));
    }

    // TODO: method for example with query params
    // @ApiBearerAuth('authorization')
    // @ApiOperation({summary: 'Logout api'})
    // @ApiQuery({ name: 'role', type: 'string' })
    // @ApiResponse({status: 200, type: DefaultAnswerMessageDto})
    // @UseGuards(AccessTokenGuard)
    // @Get('logout')
    // public logout(@Req() req: Request, @Query() query: { isEndangered?: boolean }) {
    //   return this.authService.logout(get(req, 'user.id'));
    // }
}
