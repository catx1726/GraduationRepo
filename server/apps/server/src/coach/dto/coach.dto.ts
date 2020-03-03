import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'
import { Activity } from '@libs/db/models/activity/activity.model'

export class CoachDTO {
    @ApiProperty({ description: '用户名' })
    @prop()
    name: string

    @ApiProperty({ description: '用户性别' })
    @prop()
    // TODO 2020年1月23日 这里应该还要检测字符，例如 只能1或2
    @IsNotEmpty({ message: '性别不能为空' })
    gender: string

    @ApiProperty({ description: '教练真实姓名', example: '金泰熙' })
    @prop()
    @IsNotEmpty({ message: '真实姓名不能为空' })
    realname: string

    @ApiProperty({ description: '教练头像' })
    @prop()
    avatar: string

    @ApiProperty({ description: '教练电话' })
    @prop()
    @IsNotEmpty({ message: '电话不能为空' })
    phone: string

    @ApiProperty({ description: '教练邮箱' })
    @prop()
    @IsNotEmpty({ message: '邮箱不能为空' })
    email: string

    @ApiProperty({ description: '教练状态' })
    @prop()
    status: boolean

    @ApiProperty({ description: '教练身份证号' })
    @prop()
    @IsNotEmpty({ message: '身份证不能为空' })
    identifier: string

    @ApiProperty({ description: '活动' })
    @prop({ ref: 'Activity', required: false })
    activity: Ref<Activity>
}
