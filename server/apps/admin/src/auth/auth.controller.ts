import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { ApiProperty, ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { InjectModel } from 'nestjs-typegoose'
import { User } from '@libs/db/models/user/user.model'
import { ReturnModelType, DocumentType } from '@typegoose/typegoose'
import { RegisterUserDTO } from './dto/register_user.dto'
import { AuthGuard } from '@nestjs/passport'
import { LoginUserDTO } from './dto/login_user.dto'
import { JwtService } from '@nestjs/jwt'
import { CurrentUser } from './decorator/current-user.decorator'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private JwtService: JwtService,
    @InjectModel(User) private UserModel: ReturnModelType<typeof User>
  ) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() userDto: RegisterUserDTO) {
    const { name, password } = userDto
    const user = await this.UserModel.create({
      // 此处拿到的是经过加密后的数据
      name,
      password
    })
    return user
  }

  // 使用登录的策略，加上token之后的值会挂载到REQ中
  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: '登录' })
  async login(@Body() userDto: LoginUserDTO, @CurrentUser() user: DocumentType<User>) {
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
