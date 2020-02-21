import {
    Controller,
    Post,
    Body,
    HttpException,
    Get,
    Query,
    Put,
    Param,
    Delete
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { InjectModel } from 'nestjs-typegoose'
import { Activity } from '@libs/db/models/activity/activity.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { QueryDto } from '../dto/query.dto'
import { identity } from 'rxjs'
import { User } from '@libs/db/models/user/user.model'
import { Coach } from '@libs/db/models/coach/coach.model'

@Controller('activity')
@ApiTags('活动')
export class ActivityController {
    constructor(
        @InjectModel(Activity) private readonly ActivityModel: ModelType<Activity>,
        @InjectModel(User) private readonly UserModel: ModelType<User>,
        @InjectModel(Coach) private readonly CoachModel: ModelType<Coach>
    ) {}

    @Get()
    @ApiOperation({ summary: '获取所有活动' })
    async getActivity(@Query() query: QueryDto) {
        try {
            let count = await this.ActivityModel.find()
                .count()
                .exec()
            const key = query.key
            const reg = new RegExp(key, 'i')
            let list: any = []
            const currentPage = query.currentPage

            const _options = {
                $or: [{ name: { $regex: reg } }]
            }

            if (key) {
                list = await this.ActivityModel.find(_options)
                    // .populate('coachs')
                    .skip((currentPage - 1) * 10)
                    .limit(10)
                    .exec()
                count = list.length
                return { status: true, message: '查询成功', code: 200, list, count }
            }
            list = await this.ActivityModel.find()
                // .populate('coachs')
                .skip((currentPage - 1) * 10)
                .limit(10)
                .exec()
            console.log(list)
            return {
                list,
                count,
                status: true,
                code: 200,
                message: '活动查询成功'
            }
        } catch (error) {}
    }

    @Put(':id')
    @ApiOperation({ summary: '修改活动' })
    async editActivity(@Param('id') id: string, @Body() body: Activity) {
        try {
            // DES 活动模块的关联，只允许操作 教练，不允许操作用户
            let dbCoaches = await this.ActivityModel.findById(id, { coaches: 1 })
            let dbLen = dbCoaches.coaches.length,
                curLen = body.coaches.length

            // 初始添加，活动再新建的时候，就必须有一个教练，所以这里不需要考虑这个

            // > >= [1,2] [1] [1,2] [3]
            if (curLen > dbLen) {
                let temp = []
                // body.coaches.forEach((item) => {})
            }

            // < <=

            // ==

            // 清空

            await this.ActivityModel.findOneAndUpdate(id, body)
            return {
                status: true,
                code: 200,
                message: '修改成功'
            }
        } catch (error) {
            throw new HttpException({ message: '修改失败' }, 500)
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除活动' })
    async deleteActivity(@Param('id') id: string) {
        try {
            console.log('当前删除活动的ID:', id)
            // TODO 删除活动时也要检测 是否 加入了 教练(数组)，循环
            // DES 找到 用户/教练 数据中当前活动，并删除此 活动 id
            // DES 这里 activitys 能删除成功，是因为 activitys 存的是 [ string ]
            await this.CoachModel.updateMany({ activity: { _id: id } }, { $unset: { activity: 1 } }) // OK
            await this.UserModel.updateMany({ activitys: id }, { $pull: { activitys: id } }) // OK
            await this.ActivityModel.findByIdAndUpdate(id, { status: false })
            return {
                status: true,
                code: 200,
                message: '删除成功'
            }
        } catch (error) {
            throw new HttpException({ message: '删除失败' }, 500)
        }
    }

    @Post()
    @ApiOperation({ summary: '新增活动' })
    async addActivity(@Body() body: Activity) {
        try {
            let res = await this.ActivityModel.create(body)
            // TODO 新增活动时也要检测 是否 加入了 教练(数组)，循环
            if (res.coaches.length) {
                res.coaches.forEach((id) => {
                    this.CoachModel.findByIdAndUpdate({ _id: id }, { activity: res._id })
                })
            }
            console.log(res)
            return {
                status: true,
                code: 200,
                message: '新增活动成功'
            }
        } catch (error) {
            return new HttpException({ message: '新增失败' }, 500)
        }
    }
}
