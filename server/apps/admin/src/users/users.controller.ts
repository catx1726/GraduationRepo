import {
    Controller,
    Get,
    Put,
    Delete,
    Param,
    Body,
    Post,
    HttpException,
    Query,
    Req,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { InjectModel } from 'nestjs-typegoose'
import { User } from '@libs/db/models/user/user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { IsString, IsNumber } from 'class-validator'
import { UserQueryDto } from '../dto/user_query.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { uptime } from 'os'
import { UserDeco } from '../decorator/user.decorator'
import { UserDto } from '../dto/user.dto'
import { Activity } from '@libs/db/models/activity/activity.model'
import { resolve } from 'dns'
import { async } from 'rxjs/internal/scheduler/async'
import { threadId } from 'worker_threads'
import { checkActivityLength } from '../utils/common'

@ApiTags('用户')
@Controller('users')
export class UsersController {
    constructor(
        @InjectModel(User) private readonly User: ModelType<User>,
        @InjectModel(Activity) private readonly ActivityModel: ModelType<Activity>
    ) {}

    // 查询所有用户
    @Get()
    @ApiOperation({ summary: '查询所有用户' })
    @ApiResponse({ status: 201, description: '查询成功' })
    @ApiResponse({ status: 403, description: '查询失败' })
    async getUserList(@Query() query: UserQueryDto) {
        // OK 临时把新增的属性给附上默认值
        // await this.User.updateMany({'__v':0},{$set:{avatar:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'}})

        let sort = query.sort || '',
            page = query.page,
            limit = Number(query.limit) || 10,
            key = query.key || '',
            reg = new RegExp(key, 'i'), // 不区分大小写
            count = (await this.User.find()).length,
            list: any = [],
            date = query.date || ''

        const _options = {
            $or: [
                { name: { $regex: reg } },
                { phone: { $regex: reg } },
                { gender: { $regex: reg } },
                { email: { $regex: reg } }
            ]
        }

        if (sort && limit && key) {
            list = await this.User.find(_options)
                .skip((page - 1) * 10)
                .limit(limit)
                .sort({ createdAt: sort })
                .select('-password')
                .populate('activitys')
                .exec()
            count = list.length
            return {
                list,
                count
            }
        }

        if (key) {
            list = await this.User.find(_options)
                .select('-password')
                .populate('activitys')
                .exec()
            count = list.length
            console.log(key, reg, list.length)
            return {
                list,
                count
            }
        }

        if (sort) {
            list = await this.User.find()
                .sort({ createdAt: sort })
                .select('-password')
                .populate('activitys')
                .exec()
            console.log('sort-list:', list)
            return {
                list,
                count
            }
        }

        if (page) {
            list = await this.User.find()
                .skip((page - 1) * 10)
                .limit(limit)
                .select('-password')
                .populate('activitys')
                .exec()
            return {
                list,
                count
            }
        }

        return this.User.find()
            .select('-password')
            .populate('activitys')
    }

    // 修改用户
    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: '修改用户' })
    async modifyUser(@Param('id') id: string, @Body() user: UserDto) {
        try {
            // OK 对活动的去重 activities
            if (user['activitys'].length) {
                let tempList = []
                user['activitys'].forEach((item) => {
                    if (tempList.indexOf(item) === -1) {
                        tempList.push(item)
                    }
                })
                user['activitys'] = tempList
            }

            /* DES 一对多 */
            let dbUser = await this.User.findById(id, { activitys: 1 })

            let dbUserLen = dbUser.activitys.length,
                curUserLen = user.activitys.length

            console.log('len:', dbUserLen, '----', curUserLen)

            // 删除了所有活动 ok
            if (!curUserLen && dbUserLen) {
                await this.ActivityModel.updateMany(
                    { _id: dbUser.activitys },
                    { $pull: { users: id } }
                )
                await this.User.replaceOne({ _id: id }, user)
                return {
                    sucess: true,
                    message: '你清空了所有活动'
                }
            }

            // 初始添加 ok
            if (curUserLen && !dbUserLen) {
                await this.ActivityModel.updateMany(
                    { _id: user.activitys },
                    { $push: { users: id } }
                )
                await this.User.replaceOne({ _id: id }, user)
                return {
                    sucess: true,
                    message: '你的活动突破0拉'
                }
            }

            // 后续增加 [1,2] [1] / [1,2] [3] 增加了 活动 可直接 push ok
            if (curUserLen > dbUserLen) {
                let activityArr = []
                user.activitys.forEach((item) => {
                    if (dbUser.activitys.indexOf(item) === -1) {
                        activityArr.push(item)
                    }
                })
                await checkActivityLength(this.ActivityModel, this.User)
                await this.ActivityModel.updateMany({ _id: activityArr }, { $push: { users: id } })
                await this.User.replaceOne({ _id: id }, user)
                return {
                    sucess: true,
                    message: '你增加了活动'
                }
            }

            // 后续修改 [1] [2,3] ok
            if (curUserLen < dbUserLen) {
                // 清空后重加 ok
                let activityArr = []
                user.activitys.forEach((item) => {
                    if (-1 === dbUser.activitys.indexOf(item)) {
                        activityArr.push(item)
                    }
                })
                // 特殊情况 删除 某些活动 [1] [1,2] / [1,2] [2,1,3] ok
                if (activityArr.length === 0) {
                    let temp = dbUser.activitys
                    // 找到删除的活动，然后将该 activity.user 删除
                    user.activitys.forEach((item) => {
                        temp.splice(temp.indexOf(item), 1)
                    })
                    await this.ActivityModel.updateMany({ _id: temp }, { $pull: { users: id } })
                    await this.User.replaceOne({ _id: id }, user)
                    return {
                        sucess: true,
                        message: '你删除了某些活动'
                    }
                }
                // 清空关联用户的数据
                await this.ActivityModel.updateMany(
                    { _id: dbUser.activitys },
                    { $pull: { users: id } }
                )
                await this.ActivityModel.updateMany({ _id: activityArr }, { $push: { users: id } }) // 给新用户加关联
                await this.User.replaceOne({ _id: id }, user)
                return {
                    sucess: true,
                    message: '你重选了所有活动'
                }
            }

            // 特殊情况 后续修改 [1,2,3] [4,5,6] ok
            if (curUserLen === dbUserLen) {
                let activityArr = []
                user.activitys.forEach((item) => {
                    if (dbUser.activitys.indexOf(item) === -1) {
                        activityArr.push(item)
                    }
                })
                // 特殊情况 没改活动 [1,2,3] [1,2,3]
                if (activityArr.length === 0) {
                    // await this.User.findByIdAndUpdate(id, user).exec()
                    await this.User.replaceOne({ _id: id }, user)
                    return {
                        sucess: true,
                        message: '你修改了除活动之外的数据'
                    }
                }
                await this.ActivityModel.updateMany({ _id: activityArr }, { $push: { users: id } })
                await this.User.replaceOne({ _id: id }, user)
                return {
                    sucess: true,
                    message: '你可能完全改变了活动'
                }
            }
        } catch (error) {
            throw new HttpException({ message: '修改失败' }, 500)
        }
    }

    // 删除用户
    @Delete(':id')
    @ApiOperation({ summary: '删除用户' })
    async delUser(@Param('id') id: string) {
        try {
            if (id === '5e2a672faac7431d4cc8266a')
                return { sucess: true, message: '你不可以删除管理员账户' }
            // OK 删除用户或者管理员时，检测是否有活动，然后从活动中把相应用户/管理员删除
            let res = await this.User.findById(id)

            // DES 如果当前删除的用户中 有活动存在 就删除 ok
            if (res.activitys.length) {
                await this.ActivityModel.updateMany(
                    { _id: res.activitys },
                    { $pull: { users: id } }
                )
                console.log(`当前删除用户：${res.name}，删除了相关联活动的用户`)
            }

            await this.User.findByIdAndUpdate(id, { status: false, activitys: [] })
            return {
                sucess: true,
                message: '删除成功'
            }
        } catch (error) {
            throw new HttpException({ message: '删除失败' }, 500)
        }
    }

    // 创建用户
    @Post()
    @IsString({ message: '必须是字符串' })
    @ApiOperation({ summary: '创建用户' })
    // DES 这里和数据库交互 应该是 实体Entity
    async createUser(@Body() body: UserDto) {
        try {
            let res = await this.User.create(body)
            // OK 增加/修改 都应该监控 是否有 活动相关数据,并更新到活动文档中,且再用户这边需要循环一个 activity 数组
            if (res.activitys.length) {
                await this.ActivityModel.updateMany(
                    { _id: res.activitys },
                    { $push: { users: res._id } }
                )
                console.log(`当前新增用户${res.name}，附带指定了${res.activitys.length}个活动`)
            }
            return {
                sucess: true,
                message: '创建成功'
            }
        } catch (error) {
            throw new HttpException({ message: '创建失败' }, 500)
        }
    }
}
