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
import { InjectModel } from 'nestjs-typegoose'
import { Article } from '@libs/db/models/article/article.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { QueryDto } from '../dto/query.dto'
import { threadId } from 'worker_threads'

@Controller('article')
@ApiTags('文章')
export class ArticleController {
    constructor(@InjectModel(Article) private readonly ArticleModel: ModelType<Article>) {}

    // DES 文章模块没有涉及到其他 model，所以 CRUD 比较简单

    @Get()
    @ApiOperation({ summary: '获取所有文章' })
    async getArticleList(@Query() query: QueryDto) {
        try {
            let count = await this.ArticleModel.find()
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
                list = await this.ArticleModel.find(_options)
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
                list: await this.ArticleModel.find()
                    .populate('user')
                    .skip((currentPage - 1) * 10)
                    .limit(10)
                    .exec(),
                count,
                status: true,
                code: 200,
                message: '成功'
            }
        } catch (error) {
            throw new HttpException({ message: '文章查询失败' }, 400)
        }
    }

    @Put(':id')
    @ApiOperation({ summary: '修改' })
    async putArticle(@Param('id') id: string, @Body() body: Article) {
        try {
            console.log('modify article:', id, body)
            await this.ArticleModel.findByIdAndUpdate(id, {
                content: body.content,
                title: body.title
            })
            return {
                status: true,
                message: '更新成功',
                code: 200
            }
        } catch (error) {
            throw new HttpException({ message: '文章修改失败' }, 400)
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除' })
    async deleteArticle(@Param('id') id: string) {
        try {
            await this.ArticleModel.findByIdAndDelete(id)
            return {
                status: true,
                code: 200,
                message: '删除成功'
            }
        } catch (error) {
            throw new HttpException({ message: '文章删除失败' }, 400)
        }
    }

    @Post(':id')
    @ApiOperation({ summary: '新增' })
    async postArticle(@Param('id') id: string, @Body() body: Article) {
        try {
            await this.ArticleModel.create({ user: id, content: body.content, title: body.title })
            return {
                status: true,
                message: '添加成功',
                code: 200
            }
        } catch (error) {
            throw new HttpException({ message: '添加文章失败，你这个loser' }, 400)
        }
    }
}
