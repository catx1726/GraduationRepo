import { Controller, Get, Query, HttpException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { Article } from '@libs/db/models/article/article.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { QueryDto } from 'apps/admin/src/dto/query.dto'

@Controller('article')
@ApiTags('文章')
export class ArticleController {
    constructor(@InjectModel(Article) private readonly ArticleModel: ModelType<Article>) {}

    @Get()
    @ApiOperation({ summary: '获取文章' })
    async getArticleList(@Query() query: QueryDto) {
        try {
            let count = await this.ArticleModel.find().count()
            let currentPage = query.currentPage
            let list = await this.ArticleModel.find()
                .populate('user')
                .skip((currentPage - 1) * 10)
                .limit(10)
            console.log(count)
            return {
                status: true,
                code: 200,
                list,
                count
            }
        } catch (error) {
            throw new HttpException({ message: '失败' }, 500)
        }
    }
}
