import { modelOptions, prop, Ref, } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Activity } from '../activity/activity.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Coach {
  @ApiProperty({ description: '教练名称', example: '金泰熙' })
  @prop()
  @IsNotEmpty({ message: '名称不能为空' })
  name: string;

  @ApiProperty({ description: '教练头像' })
  @prop()
  avatar: string;

  @ApiProperty({ description: '教练性别', example: "女" })
  @IsNotEmpty({ message: '性别不能为空' })
  @prop()
  gender: string;

  @ApiProperty({ description: '教练电话' })
  @prop()
  @IsNotEmpty({ message: '电话不能为空' })
  phone: string;

  @ApiProperty({ description: '教练身份证号' })
  @prop()
  @IsNotEmpty({ message: '身份证不能为空' })
  identifier: string;

  @ApiProperty({ description: '教练组织的活动' })
  @prop({ ref: 'Activity', required: true })
  activity: Ref<Activity>;
}
// export const CoachModel = getModelForClass(Coach)
