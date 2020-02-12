import {
  Controller,
  Post,
  Body,
  HttpException,
  Get,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { InjectModel } from 'nestjs-typegoose'
import { Comment } from '@libs/db/models/comment/comment.model'
import { ModelType, ReturnModelType } from '@typegoose/typegoose/lib/types'
import { get } from 'http'
import { User } from '@libs/db/models/user/user.model'
import { QueryDto } from '../dto/query.dto'

@ApiTags('评论')
@Controller('comments')
export class CommentsController {
  constructor(
    @InjectModel(Comment)
    private readonly CommentModel: ReturnModelType<typeof Comment>,
    @InjectModel(User) private readonly UserModel: ReturnModelType<typeof User>,
  ) {}
  // 查看所有评论
  @Get()
  @ApiOperation({ summary: '查询所有评论' })
  async getComments(@Query() query: QueryDto) {
    try {
      let count = await this.CommentModel.find()
        .count()
        .exec()
      const key = query.key
      const reg = new RegExp(key, 'i')
      let list: any = []
      const currentPage = query.currentPage

      const _options = {
        $or: [{ content: { $regex: reg } }],
      }

      if (key) {
        list = await this.CommentModel.find(_options)
          .populate('user')
          .skip((currentPage - 1) * 10)
          .limit(10)
          .exec()
        count = list.length

        return {
          list,
          status: true,
          code: 200,
          message: '成功',
        }
      }

      return {
        list: await this.CommentModel.find()
          .populate('user')
          .skip((currentPage - 1) * 10)
          .limit(10)
          .exec(),
        count,
        status: true,
        code: 200,
        message: '成功',
      }
    } catch (error) {
      throw new HttpException({ message: '评论查询失败' }, 400)
    }
  }
  // 查询指定用户的评论
  @Get(':id')
  @ApiOperation({ summary: '查询用户的评论' })
  async getUserComment(@Param('id') id: string) {
    try {
      return await this.CommentModel.find()
        .where('user')
        .equals(id)
    } catch (error) {
      throw new HttpException({ message: '查询失败' }, 400)
    }
  }
  // 创建评论
  // TODO 此创建只能用于 网页端非管理端
  @Post(':id')
  @ApiOperation({ summary: '创建评论' })
  async createComment(@Param('id') id: string, @Body() body: Comment) {
    try {
      console.log(id, '——', body)
      await this.UserModel.findById(id)
      await this.CommentModel.create({ user: id, content: body.content })
      return {
        status: true,
        message: '添加成功',
        code: 200,
      }
    } catch (error) {
      throw new HttpException({ message: '添加评论失败，你这个loser' }, 400)
    }
  }

  // 删除评论
  @Delete(':id')
  @ApiOperation({ summary: '删除评论' })
  async deleteComment(@Param('id') id: string, @Body('ids') ids: []) {
    try {
      // TODO 2020年1月19日 届时根据ids的有无判断是否批量删除
      await this.CommentModel.findByIdAndDelete(id)
      return {
        status: true,
        code: 200,
        message: '删除成功',
      }
    } catch (error) {
      throw new HttpException({ message: '删除失败' }, 500)
    }
  }

  // 修改评论
  @Put(':id')
  @ApiOperation({ summary: '修改评论' })
  async editComment(@Param('id') id: string, @Body() body: Comment) {
    try {
      await this.CommentModel.findByIdAndUpdate(id, { content: body.content })
      return {
        status: true,
        message: '更新成功',
        code: 200,
      }
    } catch (error) {
      throw new HttpException({ message: '修改失败' }, 500)
    }
  }
}
