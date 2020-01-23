import { modelOptions, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UserQueryDto {
  @ApiProperty({ description: '分页', required: false })
  @prop()
  limit: number;

  @ApiProperty({ description: '排序', required: false })
  @prop()
  // @IsNotEmpty({message:'不能为空'})
  sort: number;

  @ApiProperty({ description: '关键字', required: false })
  @prop()
  key: string;
}
