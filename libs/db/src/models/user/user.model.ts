import { modelOptions, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @ApiProperty({ description: '用户名称' })
  @prop()
  name: string;

  @ApiProperty({ description: '用户性别' })
  @prop()
  gender: string;
}
