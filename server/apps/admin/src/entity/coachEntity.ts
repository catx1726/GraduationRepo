import { prop } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'

export class CoachEntity {
    @ApiProperty({ description: '教练姓名', required: false })
    @prop()
    name: number

    @ApiProperty({ description: '教练邮箱', required: false })
    @prop()
    email: number

    @ApiProperty({ description: '教练头像', required: false })
    @prop()
    // @IsNotEmpty({message:'不能为空'})
    sort: number

    @ApiProperty({ description: '教练组织的活动', required: false })
    @prop()
    activity: string
}
