import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Activity } from '../activity/activity.model'

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class Article {
    @ApiProperty({ description: '文章标题', example: '随笔' })
    @prop()
    @IsNotEmpty({ message: '标题不能为空' })
    title: string

    @ApiProperty({ description: '文章内容' })
    @prop()
    content: string
}
// export const CoachModel = getModelForClass(Coach)
