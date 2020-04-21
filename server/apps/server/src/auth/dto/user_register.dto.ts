import { modelOptions, prop } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'
import { Exclude } from 'class-transformer'

export class RegisterUserDTO {
    @ApiProperty({ description: '用户名' })
    @prop()
    name: string

    @ApiProperty({ description: '密码' })
    @prop()
    password: string

    @ApiProperty({ description: '用户头像' })
    @prop()
    avatar: string

    @ApiProperty({ description: '用户邮箱', example: 'catx@email.com' })
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
