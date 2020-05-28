import {
    Controller,
    Get,
    Query,
    HttpException,
    Put,
    Param,
    Body,
    Delete,
    Post
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { InjectModel } from 'nestjs-typegoose'
import { Meeting } from '@libs/db/models/meeting/meeting.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { QueryDto } from 'apps/admin/src/dto/query.dto'

@Controller('meeting')
@ApiTags('会议')
export class MeetingController {
    constructor(@InjectModel(Meeting) private readonly MeetingModel: ModelType<Meeting>) {}

    @Get()
    @ApiOperation({ summary: '获取所有会议' })
    async getMeetingList(@Query() query: QueryDto) {
        try {
            let count = await this.MeetingModel.find()
                .count()
                .exec()
            const key = query.key
            const reg = new RegExp(key, 'i')
            let list: any = []
            const currentPage = query.currentPage

            const _options = {
                $or: [{ content: { $regex: reg } }]
            }
            if (key) {
                list = await this.MeetingModel.find(_options)
                    .populate('user')
                    .skip((currentPage - 1) * 10)
                    .limit(10)
                    .exec()
                count = list.length

                return {
                    list,
                    status: true,
                    code: 200,
                    message: '成功'
                }
            }

            return {
                list: await this.MeetingModel.find()
                    .populate({ path: 'user' })
                    .populate({ path: 'admin' })
                    .skip((currentPage - 1) * 10)
                    .limit(10)
                    .exec(),
                count,
                status: true,
                code: 200,
                message: '成功'
            }
        } catch (error) {
            console.error('meeting list error:', error)
            throw new HttpException({ message: '查询失败' }, 400)
        }
    }

    @Get(':id')
    @ApiOperation({ summary: '根据ID获取会议记录' })
    async getArticleWithId(@Param('id') id: string) {
        try {
            let article = await this.MeetingModel.findById(id).populate('user')
            return {
                status: true,
                code: 200,
                article
            }
        } catch (error) {
            throw new HttpException({ message: '失败' }, 500)
        }
    }
}
