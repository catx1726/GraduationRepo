import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { ApiProperty, ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { InjectModel } from 'nestjs-typegoose'
import { User } from '@libs/db/models/user/user.model'
import { ReturnModelType, DocumentType } from '@typegoose/typegoose'
import { RegisterAdminDTO } from './dto/register_admin.dto'
import { AuthGuard } from '@nestjs/passport'
import { LoginAdminDTO } from './dto/login_admin.dto'
import { JwtService } from '@nestjs/jwt'
import { CurrentUser } from './decorator/current-user.decorator'
import { Admin } from '@libs/db/models/admin/admin.model'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private JwtService: JwtService,
        @InjectModel(Admin) private AdminModel: ReturnModelType<typeof Admin>
    ) {}

    @Post('register')
    @ApiOperation({ summary: '注册' })
    async register(@Body() userDto: RegisterAdminDTO) {
        let checkName = await this.AdminModel.findOne({ name: userDto.name })
        console.log(checkName)
        if (checkName instanceof this.AdminModel) {
            return { status: false, code: 400, message: '这个名字已经被注册了' }
        }
        const user = await this.AdminModel.create(userDto)
        return { user, status: true, code: 200, message: '新增成功' }
    }

    // 使用登录的策略，加上token之后的值会挂载到REQ中
    @Post('login')
    @UseGuards(AuthGuard('local'))
    @ApiOperation({ summary: '登录' })
    async login(@Body() userDto: LoginAdminDTO, @CurrentUser() user: DocumentType<Admin>) {
        return {
            code: 201,
            message: '登录成功',
            token: this.JwtService.sign(String(user._id))
        }
    }

    // 使用JWT的策略
    // 获取个人信息
    @Post('userinfo')
    @UseGuards(AuthGuard('JWT'))
    @ApiBearerAuth()
    @ApiOperation({ summary: '获取用户信息' })
    async info(@CurrentUser() user: DocumentType<User>) {
        // OK 2020年2月1日 临时写的头像
        // user['avatar'] =  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/FP_Snail_icon.svg/800px-FP_Snail_icon.svg.png'
        // 创建装饰器解决代码提示
        return user
    }
}
