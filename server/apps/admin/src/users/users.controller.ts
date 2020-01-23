import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Post,
  HttpException,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '@libs/db/models/user/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { IsString, IsNumber } from 'class-validator';
import { Search_Query } from '../decorator/search_query.decorator';
import { UserQueryDto } from '../dto/user_query.dto';

@ApiTags('用户')
@Controller('users')
export class UsersController {
  constructor(@InjectModel(User) private readonly User: ModelType<User>) {}

  // 查询所有用户
  @Get()
  @ApiOperation({ summary: '查询所有用户' })
  @ApiResponse({ status: 201, description: '查询成功' })
  @ApiResponse({ status: 403, description: '查询失败' })
  async getUserList(@Query() query: UserQueryDto) {
    // OK 2020年1月19日 届时根据用户传入的query进行判断 limit 的有无
    // OK 2020年1月19日 query可有 排序/分页/用户名查找/性别查找...
    let sort = query.sort || -1,
      limit = Number(query.limit),
      key = query.key,
      reg = new RegExp(key, 'i'); // 不区分大小写
    if (sort && limit && key) {
      return this.User.find({ name: { $regex: reg } })
        .limit(limit)
        .sort({ createdAt: sort })
        .select('-password');
    }
    if (key) {
      return this.User.find({ name: { $regex: reg } }).select('-password');
    }
    if (sort) {
      return this.User.find()
        .sort({ createdAt: sort })
        .select('-password');
    }
    if (limit) {
      return this.User.find()
        .limit(limit)
        .select('-password');
    }
    return this.User.find().select('-password');
  }

  // 修改用户
  @Put(':id')
  @ApiOperation({ summary: '修改用户' })
  async modifyUser(@Param('id') id: string, @Body() body: User) {
    try {
      await this.User.findByIdAndUpdate(id, body);
      return {
        sucess: true,
        message: '修改成功',
      };
    } catch (error) {
      throw new HttpException({ message: '修改失败' }, 500);
    }
  }

  // 删除用户
  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  async delUser(@Param('id') id: string) {
    try {
      await this.User.findByIdAndDelete(id);
      return {
        sucess: true,
        message: '删除成功',
      };
    } catch (error) {
      throw new HttpException({ message: '删除失败' }, 500);
    }
  }

  // 创建用户
  @Post()
  @IsString({ message: '必须是字符串' })
  @ApiOperation({ summary: '创建用户' })
  async createUser(@Body() body: User) {
    try {
      await this.User.create(body);
      return {
        sucess: true,
        message: '创建成功',
      };
    } catch (error) {
      throw new HttpException({ message: '创建失败' }, 500);
    }
  }
}
