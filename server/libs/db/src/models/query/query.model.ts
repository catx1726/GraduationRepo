import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Comment {
  @ApiProperty({ description: '评论内容' })
  @prop()
  content: string

  // @ApiProperty({ description: '评论时间' })
  // @prop()
  // time: string;

  @IsNotEmpty({ message: '评论人不能为空' })
  @ApiProperty({ description: '评论人' })
  @prop({ ref: 'User', required: true })
  user: string

  @ApiProperty({ description: '评论状态' })
  @prop()
  status: string
}
