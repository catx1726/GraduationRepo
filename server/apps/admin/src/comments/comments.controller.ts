import { Controller, Post, Body, HttpException, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { Comment } from '@libs/db/models/comment/comment.model';
import { ModelType, ReturnModelType } from '@typegoose/typegoose/lib/types';
import { get } from 'http';
import { User } from '@libs/db/models/user/user.model';

@ApiTags('评论')
@Controller('comments')
export class CommentsController {
    constructor(
        @InjectModel(Comment) private readonly CommentModel: ReturnModelType<typeof Comment>,
        @InjectModel(User) private readonly UserModel: ReturnModelType<typeof User>,
    ){}
    // 查看所有评论
    @Get()
    @ApiOperation({summary:'查询所有评论'})
    async getComments(){
        try {
            return await this.CommentModel.find()
        } catch (error) {
            throw new HttpException({message:'评论查询失败'},400)            
        }
    }
    // 查询指定用户的评论
    @Get(':id')
    @ApiOperation({summary:'查询用户的评论'})
    async getUserComment(@Param('id') id:string){
        try {
            return await this.CommentModel.find().where('user').equals(id)
        } catch (error) {
            throw new HttpException({message:'查询失败'},400)            
        }
    }
    // 创建评论
    @Post()
    @ApiOperation({summary:'创建评论'})
    async createComment(@Body() body:Comment){
        try {
            await this.UserModel.findById(body.user) 
            await this.CommentModel.create(body)
            return{
                sucess:'添加成功'
            }
        } catch (error) {
            throw new HttpException({message:'添加评论失败，你这个loser'},400)            
        }
    }
}

