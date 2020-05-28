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
import { QueryDto } from '../dto/query.dto'

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

    @Put(':id')
    @ApiOperation({ summary: '修改' })
    async updateMeeting(@Param('id') id: string, @Body() body: Meeting) {
        await this.MeetingModel.findByIdAndUpdate(id, {
            content: body.content,
            title: body.title,
            des: body.des,
            persons: body.persons,
            startTime: body.startTime,
            endTime: body.endTime
        })
        return {
            status: true,
            message: '更新成功',
            code: 200
        }
    }
    catch(error) {
        console.error('update meeting error:', error)
        throw new HttpException({ message: '修改失败' }, 400)
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除' })
    async deleteArticle(@Param('id') id: string) {
        try {
            await this.MeetingModel.findByIdAndDelete(id)
            return {
                status: true,
                code: 200,
                message: '删除成功'
            }
        } catch (error) {
            throw new HttpException({ message: '删除失败' }, 400)
        }
    }

    @Post(':id')
    @ApiOperation({ summary: '新增' })
    async postArticle(@Param('id') id: string, @Body() body: Meeting) {
        try {
            console.log('add meeting:', id, body)
            let res = await this.MeetingModel.create({
                user: id,
                content: body.content,
                title: body.title,
                des: body.des,
                persons: body.persons,
                startTime: body.startTime,
                endTime: body.endTime
            })
            console.log(res.user)
            return {
                status: true,
                message: '添加成功',
                code: 200
            }
        } catch (error) {
            throw new HttpException({ message: '添加失败' }, 400)
        }
    }
}
