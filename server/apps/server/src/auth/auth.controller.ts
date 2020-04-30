import { Controller, Get, Post, Body, HttpException, UseGuards } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { Activity } from '@libs/db/models/activity/activity.model'
import { User } from '@libs/db/models/user/user.model'
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types'
import { JwtService } from '@nestjs/jwt'
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { LoginUserDTO } from './dto/user_login.dto'
import { RegisterUserDTO } from './dto/user_register.dto'
import { CurrentUserFromUser } from './decorator/current-user.decorator'
import { RegisterCoachDTO } from './dto/coach_register.dto'
import { Coach } from '@libs/db/models/coach/coach.model'
import { PassWordDTO } from './dto/password.dto'

@Controller('auth')
@ApiTags('注册/登录/用户和教练信息')
export class AuthController {
    constructor(
        private JwtService: JwtService,
        @InjectModel(User) private readonly UserModel: ModelType<User>,
        @InjectModel(Coach) private readonly CoachModel: ModelType<Coach>
    ) {}

    @Post('register/user')
    @ApiOperation({ summary: '注册用户' })
    async registerFromUser(@Body() user: RegisterUserDTO) {
        try {
            console.log(user)
            let check = await this.checkName(user)
            // 检测是否重名，在后端给用户的一些参数赋默认值
            if (check['status']) {
                const { name, password } = user
                const newUser = await this.UserModel.create({
                    name,
                    password,
                    avatar: '',
                    des: '',
                    phone: '',
                    email: '',
                    isVip: false,
                    status: true
                })
                // const newUser = await this.UserModel.create(user)
                return { newUser, message: '注册成功', status: 200 }
            } else {
                return check
            }
        } catch (error) {
            throw new HttpException({ message: '注册失败' }, 500)
        }
    }

    @Post('register/coach')
    @ApiOperation({ summary: '注册教练' })
    async registerFromCoach(@Body() coach: RegisterCoachDTO) {
        try {
            let check = await this.checkName(coach)
            if (check['status']) {
                const { name, password } = coach
                const newCoach = await this.CoachModel.create({
                    name,
                    password
                })
                return newCoach
            } else {
                return check
            }
        } catch (error) {
            throw new HttpException({ message: '注册失败' }, 500)
        }
    }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    @ApiOperation({ summary: '前台登录' })
    async login(
        @Body() userDto: LoginUserDTO,
        @CurrentUserFromUser() checkedData: DocumentType<User>
    ) {
        try {
            console.log('checkedData', checkedData)
            if (checkedData['type'] === 'coach') {
                return {
                    code: 200,
                    message: '登录成功',
                    token: this.JwtService.sign(String(checkedData['coach']._id))
                }
            }
            if (checkedData['type'] === 'user') {
                return {
                    code: 200,
                    message: '登录成功',
                    token: this.JwtService.sign(String(checkedData['user']._id))
                }
            }
            throw new HttpException({ message: checkedData['message'] }, 400)
        } catch (error) {
            console.log(error)
            throw new HttpException({ message: checkedData['message'] }, 400)
        }
    }

    @Post('userInfo')
    @UseGuards(AuthGuard('JWT'))
    @ApiBearerAuth()
    @ApiOperation({ summary: '获取用户信息' })
    // DocumentType<User> 表示为 Mongo 类型的 User，让提示更友好
    async getUserInfo(@CurrentUserFromUser() checkedData: DocumentType<User>) {
        // console.log('data上应该有 jwtCheck 和 userInfo:', checkedData)
        // DES 这里应该去除 password属性，不能传到客户端(已在JWT策略中取出密码项)
        try {
            if (checkedData['type'] === 'coach') {
                return checkedData['coach']
            } else {
                return checkedData['user']
            }
        } catch (error) {
            console.log(error)
            throw new HttpException({ message: '获取信息失败' }, 500)
        }
    }

    @Post('edit')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('JWT'))
    @ApiOperation({ summary: '修改密码' })
    async editPassWord(@Body() body: PassWordDTO, @CurrentUserFromUser() checkedData: any) {
        try {
            let { password } = body
            console.log(`${checkedData} 的新密码:`, password)
            if (!checkedData['jwtCheck']) {
                return { message: '请登录', code: 200, status: true }
            }
            if (checkedData['type'] === 'user') {
                let pUser = await this.UserModel.updateOne(
                    { _id: checkedData['user']._id },
                    { $set: { password } }
                )
                return { message: '修改成功，请重新登录', code: 200, status: true }
            }
            if (checkedData['type'] === 'coach') {
                await this.CoachModel.updateOne(
                    { _id: checkedData['coach']._id },
                    { $set: { password } }
                )
                return { message: '修改成功，请重新登录', code: 200, status: true }
            }
        } catch (error) {
            console.log(error)
            throw new HttpException({ message: '请先登录' }, 400)
        }
    }

    // TODO 2020年3月3日 可优化 检测名称是否重复
    async checkName(user) {
        // 检测重名
        let checkUserName = await this.UserModel.findOne({ name: user.name })
        if (checkUserName instanceof this.UserModel) {
            console.log('checkUserName', user)
            return {
                status: false,
                message: '已经有用户注册了该名字',
                code: 400
            }
        }
        let checkCoachName = await this.CoachModel.findOne({ name: user.name })
        if (checkCoachName instanceof this.CoachModel) {
            console.log('checkCoachName', user)
            return {
                status: false,
                message: '已经有教练注册了该名字',
                code: 400
            }
        }
        return { status: true, message: '你可以使用改名字' }
    }
}
