import {
    Controller,
    Get,
    Inject,
    forwardRef,
    HttpException,
    Param,
    UseGuards,
    Post,
    Body
} from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ApiOperation, ApiRequestTimeoutResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { Activity } from '@libs/db/models/activity/activity.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { AuthGuard } from '@nestjs/passport'
import { post } from '@typegoose/typegoose'
import { CurrentUserFromUser } from '../auth/decorator/current-user.decorator'
import { User } from '@libs/db/models/user/user.model'

@Controller('activities')
@ApiTags('活动')
export class ActivitiesController {
    constructor(
        @InjectModel(Activity) private readonly ActivityModel: ModelType<Activity>,
        @InjectModel(User) private readonly UserModel: ModelType<User>
    ) {}

    @Get()
    @ApiOperation({ summary: '获取所有活动' })
    async getActivityList() {
        try {
            let list = await this.ActivityModel.find().populate('coaches')
            return {
                status: true,
                message: '成功',
                code: 200,
                list
            }
        } catch (error) {
            throw new HttpException({ message: '失败' }, 500)
        }
    }

    // 获取单个活动详情
    @Get(':id')
    @ApiOperation({ summary: '获取活动详情' })
    async getActivityDetail(@Param('id') id: string) {
        try {
            let one = await this.ActivityModel.findById(id).populate('coaches')
            return {
                status: true,
                message: '成功',
                code: 200,
                one
            }
        } catch (error) {
            throw new HttpException({ message: '失败' }, 500)
        }
    }

    // TODO 2020年2月27日 报名活动(关联付款) 需要检测用户是否登录
    @Post(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('JWT'))
    @ApiOperation({ summary: '报名活动' })
    async enterActivity(
        @Param('id') id: string,
        @CurrentUserFromUser() checkedData,
        @Body() user: User
    ) {
        try {
            // 先检查登录状态
            if (!checkedData['jwtCheck']) {
                return { status: false, meesage: '请先登录', code: 401 }
            }
            // TODO 后付款接口

            // 再同步状态
            await this.UserModel.updateOne(
                { _id: checkedData['user']._id },
                { $push: { activitys: id } }
            )
            await this.ActivityModel.updateOne(
                { _id: id },
                { $push: { users: checkedData['user']._id } }
            )
            return { message: '报名成功', status: true, code: 200 }
        } catch (error) {
            throw new HttpException({ message: '报名失败' }, 500)
        }
    }
}
