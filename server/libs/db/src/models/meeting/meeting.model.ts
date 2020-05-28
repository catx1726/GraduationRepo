import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { User } from '../user/user.model'
import { Admin } from '../admin/admin.model'

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class Meeting {
    @ApiProperty({ description: '会议标题', example: '随笔' })
    @prop()
    @IsNotEmpty({ message: '标题不能为空' })
    title: string

    @ApiProperty({ description: '会议内容' })
    @IsNotEmpty({ message: '内容不能为空' })
    @prop()
    content: string

    @ApiProperty({ description: '会议概要' })
    @IsNotEmpty({ message: '概要不能为空' })
    @prop()
    des: string

    @ApiProperty({ description: '会议开始时间' })
    @prop()
    startTime: string

    @ApiProperty({ description: '会议结束时间' })
    @prop()
    endTime: string

    @ApiProperty({ description: '参会人员' })
    @prop({ required: false })
    persons: Array<any>

    @ApiProperty({ description: '撰写人' })
    @prop({ ref: 'User', required: false })
    user: Ref<User>

    @ApiProperty({ description: '撰写人' })
    @prop({ ref: 'Admin', required: false })
    admin: Ref<Admin>
}
// export const CoachModel = getModelForClass(Coach)
