import {
    Controller,
    Put,
    UseInterceptors,
    Param,
    Body,
    UseGuards,
    HttpException
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types'
import { User } from '@libs/db/models/user/user.model'
import { Activity } from '@libs/db/models/activity/activity.model'
import { FileInterceptor } from '@nestjs/platform-express'
import { FrontUserDto } from './dto/user.dto'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUserFromUser } from '../auth/decorator/current-user.decorator'

@ApiTags('用户')
@Controller('user')
export class UserController {
    constructor(
        @InjectModel(User) private readonly User: ModelType<User>,
        @InjectModel(Activity) private readonly Activity: ModelType<Activity>
    ) {}

    // 修改用户信息 (img/name/des/password)
    @Put('edit')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('JWT'))
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: '修改个人信息' })
    async editUser(
        @Body() user: FrontUserDto,
        @CurrentUserFromUser() checkedData: DocumentType<User>
    ) {
        try {
            // 用户的 ID 从checkData['user']中拿
            // 改密码的话，前台要登出
            // 没有登录
            if (!checkedData['jwtCheck']) {
                throw new HttpException({ message: checkedData['message'] || '失败' }, 400)
            }
            let oldUser = checkedData['user']
            await this.User.updateMany({ _id: oldUser._id }, user)
            return {
                message: '修改成功',
                status: 200
            }
        } catch (error) {
            console.log(error)
        }
    }
}
