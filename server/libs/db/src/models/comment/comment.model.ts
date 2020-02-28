import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '../user/user.model'
import { IsNotEmpty, MaxLength } from 'class-validator'

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class Comment {
    @ApiProperty({ description: '评论主题' })
    @prop()
    @MaxLength(30, { message: '主题字数超过限制了吧' })
    @IsNotEmpty({ message: '填写主题吧，这样我能很快看出你的重点' })
    topic: string

    @ApiProperty({ description: '评论内容' })
    @prop()
    content: string

    @IsNotEmpty({ message: '评论人不能为空' })
    @ApiProperty({ description: '评论人' })
    @prop({ ref: 'User', required: true })
    user: Ref<User>

    @ApiProperty({ description: '评论状态' })
    @prop()
    status: string
}
