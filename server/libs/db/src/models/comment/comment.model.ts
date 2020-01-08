import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Comment {
  @ApiProperty({ description: '评论内容' })
  @prop()
  content: string;

  // @ApiProperty({ description: '评论时间' })
  // @prop()
  // time: string;

  @ApiProperty({ description: '评论人' })
  @prop({ref:'User',required: true})
  user:string;

  // @ApiProperty({ description: '评论状态' })
  // @prop()
  // status: string;
}
