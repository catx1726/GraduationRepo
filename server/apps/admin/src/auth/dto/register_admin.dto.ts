import { modelOptions, prop } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'
import { Exclude } from 'class-transformer'

export class RegisterAdminDTO {
    @ApiProperty({ description: '用户名' })
    @prop()
    name: string

    @ApiProperty({ description: '用户性别' })
    @prop()
    // TODO 2020年1月23日 这里应该还要检测字符，例如 只能1或2
    @IsNotEmpty({ message: '性别不能为空' })
    gender: string

    @ApiProperty({ description: '密码' })
    @prop()
    password: string

    @ApiProperty({ description: '管理员头像' })
    @prop()
    avatar: string

    @ApiProperty({ description: '管理员邮箱' })
    @prop()
    email: string

    @ApiProperty({ description: '管理员手机号' })
    @prop()
    phone: string

    @ApiProperty({ description: '管理员身份' })
    @prop()
    isVip: boolean

    @Exclude()
    @ApiProperty({ description: '管理员状态', default: true })
    @prop()
    status: boolean
}
