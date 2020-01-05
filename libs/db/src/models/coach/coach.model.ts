import { modelOptions, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Coach {
  @ApiProperty({ description: '教练名称' })
  @prop()
  name: string;

  @ApiProperty({ description: '教练性别' })
  @prop()
  gender: string;
}
