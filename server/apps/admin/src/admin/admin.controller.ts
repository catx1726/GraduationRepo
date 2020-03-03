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
import { ModelType } from '@typegoose/typegoose/lib/types'
import { IsString, IsNumber } from 'class-validator'
import { UserQueryDto } from '../dto/user_query.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { uptime } from 'os'
import { UserDeco } from '../decorator/user.decorator'
import { UserDto } from '../dto/user.dto'
import { Activity } from '@libs/db/models/activity/activity.model'
import { resolve } from 'dns'
import { async } from 'rxjs/internal/scheduler/async'
import { threadId } from 'worker_threads'
import { checkActivityLength } from '../utils/common'
import { Admin } from '@libs/db/models/admin/admin.model'

@ApiTags('管理员')
@Controller('admin')
export class AdminController {
    constructor(@InjectModel(Admin) private readonly AdminModel: ModelType<Admin>) {}

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
            count = (await this.AdminModel.find()).length,
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
            list = await this.AdminModel.find(_options)
                .skip((page - 1) * 10)
                .limit(limit)
                .sort({ createdAt: sort })
                .exec()
            count = list.length
            return {
                list,
                count,
                status: true,
                code: 200,
                message: '查询成功'
            }
        }

        if (key) {
            list = await this.AdminModel.find(_options).exec()
            count = list.length
            console.log(key, reg, list.length)
            return {
                list,
                count,
                status: true,
                code: 200,
                message: '查询成功'
            }
        }

        if (sort) {
            list = await this.AdminModel.find()
                .sort({ createdAt: sort })
                .exec()
            console.log('sort-list:', list)
            return {
                list,
                count,
                status: true,
                code: 200,
                message: '查询成功'
            }
        }

        if (page) {
            list = await this.AdminModel.find()
                .skip((page - 1) * 10)
                .limit(limit)
                .exec()
            return {
                list,
                count,
                status: true,
                code: 200,
                message: '查询成功'
            }
        }

        return this.AdminModel.find()
    }

    @Put(':id')
    @ApiOperation({ summary: '更新管理员信息' })
    async putAdmin(@Param('id') id: string, @Body() body: Admin) {
        try {
            console.log(body)
            await this.AdminModel.updateOne({ _id: id }, body)
            return {
                message: '修改成功',
                status: true,
                code: 200
            }
        } catch (error) {
            console.log(error)
            throw new HttpException({ message: '修改失败' }, 500)
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除管理员' })
    async deleteAdmin(@Param('id') id: string) {
        try {
            // DES 限制用户以免将用户全部清除
            let checkNum = await this.AdminModel.find({ status: true }).count()
            if (checkNum === 1) {
                return {
                    status: true,
                    code: 200,
                    message: '这是您的最后一个管理员用户，删除可能不能继续登陆了'
                }
            }
            await this.AdminModel.updateOne({ _id: id }, { status: false })
            return {
                status: true,
                code: 200,
                message: '删除的时候，一定要多加小心哦，删除是不可逆的 '
            }
        } catch (error) {
            console.log(error)
            throw new HttpException({ message: '删除失败' }, 500)
        }
    }

    // @Post()
    // @ApiOperation({ summary: '新增管理员' })
    // async addAdmin(@Body() body: Admin) {
    //     try {
    //         await this.AdminModel.create(body)
    //         return {
    //             message: '新增成功',
    //             code: 200,
    //             status: true
    //         }
    //     } catch (error) {
    //         throw new HttpException({ message: '新增失败' }, 500)
    //     }
    // }
}
