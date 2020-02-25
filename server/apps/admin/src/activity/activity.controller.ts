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
import { ApiTags, ApiOperation, ApiGatewayTimeoutResponse } from '@nestjs/swagger'
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
                    .populate('coaches')
                    .populate('users')
                    .skip((currentPage - 1) * 10)
                    .limit(10)
                    .exec()
                count = list.length
                return { status: true, message: '查询成功', code: 200, list, count }
            }
            list = await this.ActivityModel.find()
                .populate('coaches')
                .populate('users')
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
            // OK 对用户的去重 users
            if (body['users'].length) {
                let tempList = []
                body['users'].forEach((item) => {
                    if (tempList.indexOf(item['_id']) == -1) {
                        tempList.push(item)
                    }
                })
                body['users'] = tempList
            }

            // DES 活动模块的关联，只允许操作 教练，不允许操作用户
            let dbCoaches = await this.ActivityModel.findById(id, { coaches: 1 })
            let dbLen = dbCoaches.coaches.length,
                curLen = body.coaches.length
            console.log(`正在活动中做操作dbLen:${dbLen},curLen${curLen},dbCoaches:${dbCoaches}`)

            // 初始添加，活动再新建的时候，就必须有一个教练，所以这里不需要考虑这个

            // > >= [1,2] [1] [1,2] [3] 增加 ok
            if (curLen > dbLen) {
                let temp = []
                body.coaches.forEach((item) => {
                    console.log('增加教练：', item)
                    if (dbCoaches.coaches.indexOf(item['_id']) === -1) {
                        temp.push(item)
                    }
                })
                console.log('增加教练的temp:', temp)
                await this.CoachModel.updateOne({ _id: temp }, { $push: { activity: id } })
                await this.ActivityModel.replaceOne({ _id: id }, body)
                return {
                    status: true,
                    code: 200,
                    message: '你增加了教练,成功'
                }
            }

            // < <= [1] [2,3] [1] [1,2] 删除 ok
            if (curLen < dbLen) {
                // 清空重新添加 [2,3,4] [7,8,9,1]
                let temp = []
                body.coaches.forEach((item) => {
                    // OK 修复删除某个 却是清空 的情况，原来是没获取到 _id
                    if (dbCoaches.coaches.indexOf(item['_id']) == -1) {
                        temp.push(item)
                    }
                })
                // 删除某个元素 [1] [1,2]
                if (!temp.length) {
                    let delItem = dbCoaches.coaches
                    // 找到删除的教练，然后将该 coach 删除
                    body.coaches.forEach((item) => {
                        delItem.splice(delItem.indexOf(item['_id']), 1)
                    })
                    console.log('被删除的教练：', delItem)
                    await this.CoachModel.updateMany(
                        { _id: delItem }, // 教练id
                        { $pull: { activity: id } } // 将该教练的活动清除
                    )
                    await this.ActivityModel.replaceOne({ _id: id }, body)
                    return {
                        status: true,
                        code: 200,
                        message: '你删除了某些教练,成功'
                    }
                }
                await this.CoachModel.updateMany(
                    { _id: dbCoaches.coaches },
                    { $pull: { activity: id } }
                )
                await this.CoachModel.updateMany({ _id: temp }, { $push: { activity: id } })
                await this.ActivityModel.replaceOne({ _id: id }, body)
                return {
                    status: true,
                    code: 200,
                    message: '你清空了教练组,然后完全改变了教练组,总之成功了'
                }
            }

            // == [1,2] [2,3] [1,2] [1,2]
            if (curLen === dbLen) {
                let temp = []
                body.coaches.forEach((item) => {
                    if (dbCoaches.coaches.indexOf(item['_id']) === -1) {
                        temp.push(item)
                    }
                })
                if (!temp.length) {
                    // [1,2] [1,2]
                    await this.ActivityModel.replaceOne({ _id: id }, body)
                    return {
                        status: true,
                        code: 200,
                        message: '你可能修改了其他地方吧,总之没有修改教练'
                    }
                }

                await this.CoachModel.updateMany(
                    { _id: dbCoaches.coaches },
                    { $pull: { activity: id } }
                )
                console.log('1')
                await this.CoachModel.updateMany({ _id: temp }, { $push: { activity: id } })
                console.log('2')
                await this.ActivityModel.replaceOne({ _id: id }, body)
                console.log('3')

                return {
                    status: true,
                    code: 200,
                    message: '你完全改变了教练组'
                }
            }

            // 清空 ok
            if (!curLen && dbLen) {
                await this.CoachModel.updateMany(
                    { _id: dbCoaches.coaches },
                    { $pull: { activity: id } }
                )
                await this.ActivityModel.replaceOne({ _id: id }, body)
                return {
                    status: true,
                    code: 200,
                    message: '你清空了该活动的教练'
                }
            }

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
            // OK 删除活动时也要检测 是否 加入了 教练(数组)，循环
            // DES 找到 用户/教练 数据中当前活动，并删除此 活动 id
            // DES 这里 activitys 能删除成功，是因为 activitys 存的是 [ string ]
            // DES 教练和活动 是 一对一，所以直接用的 $unset
            // DES 用户和活动 则是 一对多，所以用$pull
            let res = await this.ActivityModel.findById(id)
            if (res.coaches.length && res.users.length) {
                await this.CoachModel.updateMany(
                    { activity: { _id: id } },
                    { $unset: { activity: 1 } }
                )
                await this.UserModel.updateMany({ activitys: id }, { $pull: { activitys: id } })
                await this.ActivityModel.findByIdAndUpdate(id, { status: false })
                console.log(
                    `当前删除活动：${res.name}，删除了相关联的教练：${res.coaches.length}个/${res.users.length}个用户的活动信息`
                )
            }
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
            // OK 这里需要检测，新增的活动所附带的教练是否已经指定活动了，如果制定了，则不能继续指定
            let repeatList = await this.CoachModel.find(
                { _id: { $in: body.coaches } },
                { activity: 1, name: true }
            )
            // 将其指定了活动的教练 名字拼接
            let nameStr = ''
            repeatList.forEach((item) => {
                if (item.activity) {
                    nameStr += item.name + ','
                }
            })
            // 去除最后一个逗号
            nameStr = nameStr.slice(0, nameStr.lastIndexOf(','))
            // 判断是否有某些教练已经指定了活动
            if (nameStr) {
                return { status: false, code: 200, message: `${nameStr}教练已经指定了活动` }
            }

            let res = await this.ActivityModel.create(body)
            // OK 新增活动时也要检测 是否 加入了 教练(数组)，循环
            if (res.coaches.length) {
                await this.CoachModel.updateMany(
                    { _id: res.coaches },
                    { $push: { activity: res._id } }
                )
                console.log(`当前新增活动${res.name}，附带指定了${body.coaches.length}个教练`)
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
