import { Controller, Get, Query, HttpException, Param } from '@nestjs/common'
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
            let keyword = query.key
            const reg = new RegExp(keyword, 'i')
            // DES 通过文章标题 做模糊查询
            const _options = {
                $or: [{ title: { $regex: reg } }]
            }
            let list = await this.ArticleModel.find(_options)
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

    @Get(':id')
    @ApiOperation({ summary: '根据ID获取文章' })
    async getArticleWithId(@Param('id') id: string) {
        try {
            let article = await this.ArticleModel.findById(id).populate('user')
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
