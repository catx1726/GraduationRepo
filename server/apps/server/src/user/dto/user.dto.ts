import { modelOptions, prop, arrayProp, Ref } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { Exclude } from 'class-transformer'
import { hashSync } from 'bcryptjs'
import { Activity } from '@libs/db/models/activity/activity.model'

// DES 后台管理员不能更改用户的密码,也不能查看
@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class FrontUserDto {
    @ApiProperty({ description: '用户名称', example: '金泰熙', required: true })
    @prop()
    @IsNotEmpty({ message: '名称不能为空' })
    name: string

    @ApiProperty({ description: '用户头像' })
    @prop()
    avatar: string

    @ApiProperty({ description: '用户邮箱' })
    @prop()
    email: string

    @ApiProperty({ description: '用户手机号' })
    @prop()
    phone: string

    @ApiProperty({ description: '用户身份' })
    @prop()
    isVip: boolean

    @Exclude()
    @ApiProperty({ description: '用户状态' })
    @prop()
    status: boolean

    @ApiProperty({ description: '用户简介' })
    @prop()
    des: string
}

// export const UserModel = getModelForClass(User)
