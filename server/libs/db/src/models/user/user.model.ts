import { modelOptions, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @ApiProperty({ description: '用户名称', example: '金泰熙' })
  @prop()
  @IsNotEmpty({ message: '名称不能为空' })
  name: string;

  @ApiProperty({ description: '用户性别', example: '女' })
  @prop()
  @IsString()
  @IsNotEmpty({ message: '性别不能为空' })
  gender: string;
}

// export const UserModel = getModelForClass(User)
