import { Controller, Inject, Query, Get, HttpException } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { InjectModel } from 'nestjs-typegoose'
import { Coach } from '@libs/db/models/coach/coach.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { QueryDto } from '../dto/query.dto'

@Controller('coach')
@ApiTags('教练')
export class CoachController {
  // DES 这里的private/public 是将对象定义成 类级别的对象，可在类中使用
  // DES ModelType 是为了 mongoose 方法有提示
  constructor(@InjectModel(Coach) private readonly CoachModel: ModelType<Coach>) {}

  // 所有教练带查询
  @Get()
  @ApiOperation({ summary: '查询所有教练，带查询功能' })
  async getCoachList(@Query() query: QueryDto) {
    try {
      const count = await this.CoachModel.find()
          .count()
          .exec(),
        key = query.key,
        reg = new RegExp(key, 'i'),
        list: any = [],
        currentPage = query.currentPage
    } catch (error) {
      throw new HttpException({ message: '评论查询失败' }, 400)
    }
  }
}
