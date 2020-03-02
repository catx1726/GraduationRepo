import { Controller, Get, HttpException, Param } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { Coach } from '@libs/db/models/coach/coach.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

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
}
