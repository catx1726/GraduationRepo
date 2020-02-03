import { modelOptions, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UserQueryDto {
  @ApiProperty({ description: '每页条数', required: false })
  @prop()
  limit: number;

  @ApiProperty({ description: '页数', required: false })
  @prop()
  page: number;

  @ApiProperty({ description: '排序', required: false })
  @prop()
  // @IsNotEmpty({message:'不能为空'})
  sort: number;

  @ApiProperty({ description: '关键字', required: false })
  @prop()
  key: string;
}
