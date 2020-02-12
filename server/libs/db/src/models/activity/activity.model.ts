import { modelOptions, prop } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Activity {
  @ApiProperty({ description: '活动名称' })
  @prop()
  name: string

  @ApiProperty({ description: '活动时间' })
  @prop()
  time: string
}

// export const ActivityModel = getModelForClass(Activity)
