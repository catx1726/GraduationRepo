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
import { checkActivityLength } from 'apps/admin/src/utils/common'

@ApiTags('用户')
@Controller('user')
export class UserController {
    constructor(
        @InjectModel(User) private readonly User: ModelType<User>,
        @InjectModel(Activity) private readonly ActivityModel: ModelType<Activity>
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
            console.log('oldUser', oldUser, 'user', user)
            await this.User.updateMany({ _id: oldUser._id }, user)
            return {
                message: '修改成功',
                status: 200
            }
        } catch (error) {
            console.log(error)
        }
    }

    // @Put(':id')
    // @ApiBearerAuth()
    // @UseGuards(AuthGuard('JWT'))
    // @ApiOperation({ summary: '报名活动' })
    // async chooseActivity(
    //     @Param('id') id: string,
    //     @CurrentUserFromUser() checkedData: DocumentType<User>,
    //     @Body() curUser: User
    // ) {
    //     try {
    //         // 先登录
    //         if (!checkedData['jwtCheck']) {
    //             throw new HttpException({ message: checkedData['message'] || '失败' }, 400)
    //         }

    //         // Put中带的是 activity 的ID
    //         let dbUser = checkedData['user'],
    //             userId = dbUser._id,
    //             dbUserLen = dbUser.activitys.length
    //         // let dbUser = await this.User.findById(userId, { activitys: 1 })
    //         let curUserLen = curUser.activitys.length

    //         console.log('dbUser:', dbUser, 'curUser:', curUser)
    //         // OK 对活动的去重 activities
    //         if (dbUserLen) {
    //             // 用带来的ID去 dbUser.activities 中找
    //             dbUser['activitys'].forEach((i) => {
    //                 if (i === id) {
    //                     return { message: '已经添加过该活动', status: 200 }
    //                 }
    //             })
    //             // let tempList = []
    //             // user['activitys'].forEach((item) => {
    //             //     if (tempList.indexOf(item['_id']) === -1) {
    //             //         tempList.push(item)
    //             //     }
    //             // })
    //             // user['activitys'] = tempList
    //         }

    //         // 初始添加 ok
    //         if (curUserLen && !dbUserLen) {
    //             await this.ActivityModel.updateMany(
    //                 { _id: curUser.activitys },
    //                 { $push: { users: userId } }
    //             )
    //             await this.User.replaceOne({ _id: userId }, curUser)
    //             return {
    //                 sucess: true,
    //                 message: '你的活动突破0拉'
    //             }
    //         }

    //         // 后续增加 [1,2] [1] / [1,2] [3] 增加了 活动 可直接 push ok
    //         if (curUserLen > dbUserLen) {
    //             let activityArr = []
    //             curUser.activitys.forEach((item) => {
    //                 if (dbUser.activitys.indexOf(item['_id']) === -1) {
    //                     activityArr.push(item)
    //                 }
    //             })
    //             await checkActivityLength(this.ActivityModel, this.User)
    //             await this.ActivityModel.updateMany(
    //                 { _id: activityArr },
    //                 { $push: { users: userId } }
    //             )
    //             await this.User.replaceOne({ _id: userId }, curUser)
    //             return {
    //                 sucess: true,
    //                 message: '你增加了活动'
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
}
