import { modelOptions, prop } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'

export class LoginUserDTO {
    @ApiProperty({ description: '用户名' })
    @IsNotEmpty({ message: '请输入用户名' })
    @prop()
    name: string

    @ApiProperty({ description: '密码' })
    @IsNotEmpty({ message: '请输入密码' })
    @prop()
    password: string
}
