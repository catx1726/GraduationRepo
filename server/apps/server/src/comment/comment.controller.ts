import {
    Controller,
    Get,
    HttpException,
    Query,
    Post,
    Param,
    Body,
    Delete,
    UseGuards
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types'
import { User } from '@libs/db/models/user/user.model'
import { Coach } from '@libs/db/models/coach/coach.model'
import { QueryDto } from 'apps/admin/src/dto/query.dto'
import { Comment } from '@libs/db/models/comment/comment.model'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUserFromUser } from '../auth/decorator/current-user.decorator'

@Controller('comment')
@ApiTags('留言')
export class CommentController {
    constructor(
        @InjectModel(Comment) private readonly CommentModel: ModelType<Comment>,
        @InjectModel(User) private readonly UserModel: ModelType<User>,
        @InjectModel(Coach) private readonly CoachModel: ModelType<Coach>
    ) {}

    // DES
    // 留言，前台需要分页/新增/删除，关联用户/教练

    @Get()
    @ApiOperation({ summary: '所有留言' })
    async getCommentList(@Query() query: QueryDto) {
        try {
            let count = await this.CommentModel.find().count()
            let currentPage = query.currentPage
            let list = await this.CommentModel.find()
                .populate('coache')
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

    // TODO 2020年3月2日 创建评论，也需要权限
    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('JWT'))
    @ApiOperation({ summary: '创建留言' })
    async createComment(@Body() body: Comment, @CurrentUserFromUser() data: DocumentType<User>) {
        try {
            console.log(body)
            // OK 2020年3月2日 此处检验是用户在留言还是教练
            await this.UserModel.findById(data._id)
                .then(() => {
                    this.CommentModel.create({
                        user: data._id,
                        content: body.content,
                        topic: body.topic
                    })
                    return {
                        status: true,
                        message: '添加成功',
                        code: 200
                    }
                })
                .catch(() => {
                    console.log('当前留言的人不是普通用户，或者是没注册的陌生人')
                })

            // 教练
            await this.CommentModel.create({ coach: data._id, content: body.content })
            return {
                status: true,
                message: '添加成功',
                code: 200
            }
        } catch (error) {
            throw new HttpException({ message: '新增留言失败' }, 400)
        }
    }

    // TODO 2020年3月2日 删除留言，只能删除自己的，需要权限

    // TODO 2020年3月2日 修改，和删除一样也是需要权限的
}
