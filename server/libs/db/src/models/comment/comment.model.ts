import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '../user/user.model'
import { IsNotEmpty, MaxLength } from 'class-validator'
import { Coach } from '../coach/coach.model'

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class Comment {
    @ApiProperty({ description: '留言主题' })
    @prop()
    @MaxLength(30, { message: '主题字数超过限制了吧' })
    @IsNotEmpty({ message: '填写主题吧，这样我能很快看出你的重点' })
    topic: string

    @ApiProperty({ description: '留言内容' })
    @prop()
    content: string

    @ApiProperty({ description: '普通用户留言' })
    @prop({ ref: 'User' })
    user: Ref<User>

    @ApiProperty({ description: '教练留言' })
    @prop({ ref: 'Coach' })
    coach: Ref<Coach>

    @ApiProperty({ description: '留言状态' })
    @prop()
    status: string
}
