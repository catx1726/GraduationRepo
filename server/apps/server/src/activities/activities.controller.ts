import { Controller, Get, Inject, forwardRef, HttpException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ApiOperation, ApiRequestTimeoutResponse, ApiTags } from '@nestjs/swagger'
import { Activity } from '@libs/db/models/activity/activity.model'
import { ModelType } from '@typegoose/typegoose/lib/types'

@Controller('activities')
@ApiTags('活动')
export class ActivitiesController {
    constructor(@InjectModel(Activity) private readonly ActivityModel: ModelType<Activity>) {}

    @Get()
    @ApiOperation({ summary: '获取所有活动' })
    async getActivityList() {
        try {
            let list = await this.ActivityModel.find()
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

    // TODO 2020年2月27日 报名活动(关联付款) 需要检测用户是否登录
}
