import { Controller, Get, HttpException, Param, Put, UseGuards, Body } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { Coach } from '@libs/db/models/coach/coach.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUserFromUser } from '../auth/decorator/current-user.decorator'
import { CoachDTO } from './dto/coach.dto'

@Controller('coach')
@ApiTags('教练')
export class CoachController {
    ActivityModel: any
    constructor(@InjectModel(Coach) private readonly CoachModel: ModelType<Coach>) {}
    @Get()
    @ApiOperation({ summary: '获取所有教练' })
    async getActivityList() {
        try {
            let list = await this.CoachModel.find()
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

    // 获取单个教练详情
    @Get(':id')
    @ApiOperation({ summary: '获取教练详情' })
    async getActivityDetail(@Param('id') id: string) {
        try {
            let one = await this.CoachModel.findById(id).populate('activity')
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

    // 指定活动
    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('JWT'))
    @ApiOperation({ summary: '教练接管活动' })
    async coachTakesActivity(
        @CurrentUserFromUser() checkedData: any,
        @Param('id') id: string,
        @Body() body: CoachDTO
    ) {
        try {
            if (!checkedData['jwtCheck']) {
                return { status: false, code: 400, message: '请先登录' }
            }
            if (checkedData['type'] === 'user') {
                return { status: false, code: 400, message: '你可以先注册成为教练，再来接管活动哦' }
            }
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

                    await this.CoachModel.updateOne({ _id: id }, body)

                    return { status: true, code: 200, message: `你指定了活动` }
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

                // TODO 2020年3月3日 我将 replace 都换成了 updateOne 语法有待测试
                await this.CoachModel.updateOne({ _id: id }, body)

                return { status: true, code: 200, message: '你修改了活动信息' }
            }

            /* 删除 */
            if (dbCoach.activity) {
                await this.ActivityModel.updateOne(
                    { _id: dbCoach.activity },
                    { $pull: { coaches: id } }
                )
                await this.CoachModel.updateOne({ _id: id }, body)
                return {
                    status: true,
                    code: 200,
                    message: '你删除了你的活动信息'
                }
            }

            // 普通修改 没有加上 activity
            await this.CoachModel.updateOne({ _id: id }, body)
            return {
                status: true,
                code: 200,
                message: '你好像没有修改活动，对吧'
            }
        } catch (error) {
            throw new HttpException({ message: '失败' }, 500)
        }
    }
}
