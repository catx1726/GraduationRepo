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

@ApiTags('教练')
@Controller('coach')
export class CoachController {
    // DES 这里的private/public 是将对象定义成 类级别的对象，可在类中使用
    // DES ModelType 是为了 mongoose 方法有提示
    constructor(@InjectModel(Coach) private readonly CoachModel: ModelType<Coach>) {}

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

    // DES 这里教练删除之后相应的活动也应该删除
    @Delete(':id')
    @ApiOperation({ summary: '删除教练' })
    async deleteCoach(@Param('id') id: string) {
        try {
            await this.CoachModel.findByIdAndDelete(id)
            return {
                status: true,
                message: '删除成功',
                code: 200
            }
        } catch (error) {
            throw new HttpException({ message: '删除失败' }, 500)
        }
    }

    @Put(':id')
    @ApiOperation({ summary: '修改教练信息' })
    async editCoach(@Param('id') id: string, @Body() body: Coach) {
        try {
            console.log(body)
            let checkCoach = await this.CoachModel.replaceOne({ _id: id }, body)
            if (checkCoach.activity && body.activity) {
                return { message: '教练已经指定了活动，无法继续指定', code: 500, status: false }
            }
            return {
                status: true,
                code: 200,
                message: '修改教练信息成功'
            }
        } catch (error) {
            throw new HttpException({ message: '修改教练信息失败' }, 500)
        }
    }

    @Post()
    @ApiOperation({ summary: '增加教练' })
    async addCoach(@Body() body: Coach) {
        try {
            await this.CoachModel.create(body)
            console.log(body)
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
