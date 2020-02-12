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
  UseInterceptors,
  UploadedFile
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { InjectModel } from 'nestjs-typegoose'
import { User } from '@libs/db/models/user/user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { IsString, IsNumber } from 'class-validator'
import { Search_Query } from '../decorator/search_query.decorator'
import { UserQueryDto } from '../dto/user_query.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { uptime } from 'os'
import { UserDeco } from '../decorator/user.decorator'
import { UserDto } from '../dto/user.dto'

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
    // OK 临时把新增的属性给附上默认值
    // await this.User.updateMany({'__v':0},{$set:{avatar:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'}})

    let sort = query.sort || '',
      page = query.page,
      limit = Number(query.limit) || 10,
      key = query.key || '',
      reg = new RegExp(key, 'i'), // 不区分大小写
      count = (await this.User.find()).length,
      list: any = [],
      date = query.date || ''

    const _options = {
      $or: [
        { name: { $regex: reg } },
        { phone: { $regex: reg } },
        { gender: { $regex: reg } },
        { email: { $regex: reg } }
      ]
    }

    if (sort && limit && key) {
      list = await this.User.find(_options)
        .skip((page - 1) * 10)
        .limit(limit)
        .sort({ createdAt: sort })
        .select('-password')
        .exec()
      count = list.length
      return {
        list,
        count
      }
    }

    if (key) {
      list = await this.User.find(_options)
        .select('-password')
        .exec()
      count = list.length
      console.log(key, reg, list.length)
      return {
        list,
        count
      }
    }

    if (sort) {
      list = await this.User.find()
        .sort({ createdAt: sort })
        .select('-password')
        .exec()
      console.log('sort-list:', list)
      return {
        list,
        count
      }
    }

    if (page) {
      list = await this.User.find()
        .skip((page - 1) * 10)
        .limit(limit)
        .select('-password')
        .exec()
      return {
        list,
        count
      }
    }

    return this.User.find().select('-password')
  }

  // 修改用户
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '修改用户' })
  async modifyUser(@Param('id') id: string, @Body() user: UserDto) {
    try {
      await this.User.findByIdAndUpdate(id, user).exec()
      return {
        sucess: true,
        message: '修改成功'
      }
    } catch (error) {
      throw new HttpException({ message: '修改失败' }, 500)
    }
  }

  // 删除用户
  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  async delUser(@Param('id') id: string) {
    try {
      if (id === '5e2a672faac7431d4cc8266a')
        return { sucess: true, message: '你不可以删除管理员账户' }
      await this.User.findByIdAndUpdate(id, { status: false })
      return {
        sucess: true,
        message: '删除成功'
      }
    } catch (error) {
      throw new HttpException({ message: '删除失败' }, 500)
    }
  }

  // 创建用户
  @Post()
  @IsString({ message: '必须是字符串' })
  @ApiOperation({ summary: '创建用户' })
  // DES 这里和数据库交互 应该是 实体Entity
  async createUser(@Body() body: UserDto) {
    try {
      await this.User.create(body)
      return {
        sucess: true,
        message: '创建成功'
      }
    } catch (error) {
      throw new HttpException({ message: '创建失败' }, 500)
    }
  }
}
