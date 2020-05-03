import {
    Controller,
    Inject,
    Query,
    Get,
    HttpException,
    Delete,
    Param,
    Put,
    Body,
    Post
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { InjectModel } from 'nestjs-typegoose'
import { Coach } from '@libs/db/models/coach/coach.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { QueryDto } from '../dto/query.dto'
import { Activity } from '@libs/db/models/activity/activity.model'
import { threadId } from 'worker_threads'
import { checkActivityLength } from '../utils/common'

@ApiTags('教练')
@Controller('coach')
export class CoachController {
    // DES 这里的private/public 是将对象定义成 类级别的对象，可在类中使用
    // DES ModelType 是为了 mongoose 方法有提示
    constructor(
        @InjectModel(Coach) private readonly CoachModel: ModelType<Coach>,
        @InjectModel(Activity) private readonly ActivityModel: ModelType<Activity>
    ) {}

    // 所有教练带查询
    @Get()
    @ApiOperation({ summary: '查询所有教练，带查询功能' })
    async getCoachList(@Query() query: QueryDto) {
        try {
            let count = await this.CoachModel.find()
                .count()
                .exec()
            const key = query.key
            const reg = new RegExp(key, 'i')
            let list: any = []
            const currentPage = query.currentPage
            // TODO 届时可以根据 活动名/教练名/活动时间 进行查询
            const _options = {
                $or: [{ name: { $regex: reg } }]
            }

            if (key) {
                list = await this.CoachModel.find(_options)
                    .populate('activity')
                    .skip((currentPage - 1) * 10)
                    .limit(10)
                    .exec()
                count = list.length
                return { status: true, message: '查询成功', code: 200, list, count }
            }
            list = await this.CoachModel.find()
                .populate('activity')
                .skip((currentPage - 1) * 10)
                .limit(10)
                .exec()
            // console.log(list)
            return {
                list,
                count,
                status: true,
                code: 200,
                message: '教练查询成功'
            }
        } catch (error) {
            throw new HttpException({ message: '教练查询失败' }, 400)
        }
    }

    @Put(':id')
    @ApiOperation({ summary: '修改教练信息' })
    async editCoach(@Param('id') id: string, @Body() body: Coach) {
        try {
            let dbCoach = await this.CoachModel.findById(id, { activity: 1 })

            console.log('当前教练信息:', dbCoach)

            /* DES 修改了活动 删除了活动 */

            // 一对一(新增时没有指定活动 为空就检测 这次修改中有没有增加 activity , 而 coach 在创建时是不能携带空的 activity 的)
            if (dbCoach.activity === body.activity) {
                return { message: '教练已经指定了活动，无法继续指定', code: 500, status: false }
            }

            /* 修改/新增 */
            if (body.activity) {
                // 新增
                if (!dbCoach.activity) {
                    await this.ActivityModel.updateOne(
                        { _id: body.activity },
                        { $push: { coaches: id } }
                    )

                    await this.CoachModel.replaceOne({ _id: id }, body)

                    return { status: true, code: 200, message: '你终于给当前教练指定了活动' }
                }

                // 修改 先清除原 activity 中的 coaches[x] , 后添加到新的 activist ,后修改 coach
                await this.ActivityModel.updateOne(
                    { _id: body.activity },
                    { $pull: { coaches: id } }
                )

                await this.ActivityModel.updateOne(
                    { _id: body.activity },
                    { $push: { coaches: id } }
                )

                await this.CoachModel.replaceOne({ _id: id }, body)

                return { status: true, code: 200, message: '你修改了当前教练的活动信息' }
            }

            /* 删除 */
            if (dbCoach.activity) {
                await this.ActivityModel.updateOne(
                    { _id: dbCoach.activity },
                    { $pull: { coaches: id } }
                )
                await this.CoachModel.replaceOne({ _id: id }, body)
                return {
                    status: true,
                    code: 200,
                    message: '你删除了该教练的活动信息'
                }
            }

            // 普通修改 没有加上 activity
            await this.CoachModel.replaceOne({ _id: id }, body)
            return {
                status: true,
                code: 200,
                message: '你可能修改了,当前教练除开活动之外的部分'
            }
        } catch (error) {
            throw new HttpException({ message: '修改教练信息失败' }, 500)
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除教练' })
    async deleteCoach(@Param('id') id: string) {
        try {
            let res = await this.CoachModel.findById(id)
            console.log(`当前删除教练${res.name}，删除了相关联的活动教练`)

            // OK 删除用户或者管理员时，检测是否有活动，然后从活动中把相应用户/管理员删除
            if (res.activity) {
                await this.ActivityModel.updateOne(
                    { _id: res.activity },
                    { $pull: { coaches: id } }
                )
            }

            await this.CoachModel.updateOne({ _id: id }, { status: false })
            return {
                status: true,
                message: '删除成功',
                code: 200
            }
        } catch (error) {
            throw new HttpException({ message: '删除失败' }, 500)
        }
    }

    @Post()
    @ApiOperation({ summary: '增加教练' })
    async addCoach(@Body() body: Coach) {
        try {
            // DES 2020年5月3日 本来打算做教练在前台也可以登录，我给省略了，但是后台密码不能为空，所以在前台给一个占位符，然后再后台进行默认值写入
            let res = await this.CoachModel.create({ ...body, password: '123456' })

            // OK 增加/修改 都应该监控 是否有 活动相关数据,并更新到活动文档中
            if (res.activity) {
                await this.ActivityModel.updateOne(
                    { _id: res.activity },
                    { $push: { coaches: res._id } }
                )
                console.log(`当前新增教练${res.name}，附带指代了一个活动`)
            }
            return {
                status: true,
                code: 200,
                message: '增加教练成功'
            }
        } catch (error) {
            throw new HttpException({ message: '增加教练失败,请检查字段信息' }, 500)
        }
    }
}
