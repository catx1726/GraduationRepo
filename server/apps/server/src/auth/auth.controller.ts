import { Controller, Get, Post, Body, HttpException, UseGuards } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { Activity } from '@libs/db/models/activity/activity.model'
import { User } from '@libs/db/models/user/user.model'
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types'
import { JwtService } from '@nestjs/jwt'
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { RegisterUserDTO } from 'apps/admin/src/auth/dto/register_user.dto'
import { AuthGuard } from '@nestjs/passport'
import { LoginUserDTOFromUser } from './dto/user_login.dto'
import { CurrentUserFromUser } from './decorator/current-user.decorator'

@Controller('auth')
@ApiTags('注册/登录/用户信息')
export class AuthController {
    constructor(
        private JwtService: JwtService,
        @InjectModel(User) private readonly UserModel: ModelType<User>
    ) {}

    @Post('register')
    @ApiOperation({ summary: '注册账户' })
    async register(@Body() user: RegisterUserDTO) {
        try {
            const { name, password } = user
            const newUser = await this.UserModel.create({
                name,
                password
            })
            return newUser
        } catch (error) {
            throw new HttpException({ message: '注册失败' }, 500)
        }
    }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    @ApiOperation({ summary: '前台登录' })
    async login(
        @Body() userDto: LoginUserDTOFromUser,
        @CurrentUserFromUser() user: DocumentType<User>
    ) {
        console.log(user)
        return {
            code: 200,
            message: '登录成功',
            token: this.JwtService.sign(String(user._id))
        }
    }

    @Post('userInfo')
    @UseGuards(AuthGuard('JWT'))
    @ApiBearerAuth()
    @ApiOperation({ summary: '获取用户信息' })
    // DocumentType<User> 表示为 Mongo 类型的 User，让提示更友好
    async getUserInfo(@CurrentUserFromUser() data: DocumentType<User>) {
        console.log('data上应该有 jwtCheck 和 userInfo:', data)
        return data
    }
}
