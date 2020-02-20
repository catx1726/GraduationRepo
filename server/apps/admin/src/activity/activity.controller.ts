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

@Controller('activity')
@ApiTags('活动')
export class ActivityController {
    constructor(@InjectModel(Activity) private readonly ActivityModel: ModelType<Activity>) {}

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
            await this.ActivityModel.findByIdAndDelete(id)
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
            await this.ActivityModel.create(body)
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
