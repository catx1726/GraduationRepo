import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Post,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '@libs/db/models/user/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { IsString } from 'class-validator';

@ApiTags('用户')
@Controller('users')
export class UsersController {
  constructor(@InjectModel(User) private readonly User: ModelType<User>) {}

  // 查询所有用户
  @Get()
  @ApiOperation({ summary: '查询所有用户' })
  @ApiResponse({ status: 201, description: '查询成功' })
  @ApiResponse({ status: 403, description: '查询失败' })
  async getUserList() {
    return await this.User.find().limit(10);
  }

  // 修改用户
  @Put(':id')
  @ApiOperation({ summary: '修改用户' })
  async modifyUser(@Param('id') id: string, @Body() body: User) {
    try {
      await this.User.findByIdAndUpdate(id, body);
      return {
        sucess: true,
      };
    } catch (error) {
      throw new HttpException({ message: '修改失败' }, 500);
    }
  }

  // 删除用户
  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  async delUser(@Param('id') id: string) {
    await this.User.findByIdAndDelete(id);
    return {
      sucess: true,
    };
  }

  // 创建用户
  @Post()
  @IsString({message:'必须是字符串'})
  @ApiOperation({ summary: '创建用户' })
  async createUser(@Body() body: User) {
    await this.User.create(body);
    return {
      sucess: true,
    };
  }
}
