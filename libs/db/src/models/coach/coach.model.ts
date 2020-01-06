import { modelOptions, prop,  } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Coach{
  @ApiProperty({ description: '教练名称',example:'金泰熙' })
  @prop()
  @IsNotEmpty({message:'名称不能为空'})
  name: string;

  @ApiProperty({ description: '教练性别' ,example:"女"})
  @IsNotEmpty({message:'性别不能为空'})
  @prop()
  gender: string;
}
// export const CoachModel = getModelForClass(Coach)
