import { modelOptions, prop, Ref, arrayProp } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { Coach } from '../coach/coach.model'
import { MaxLength, IsNotEmpty } from 'class-validator'

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class Activity {
    @ApiProperty({ description: '活动名称' })
    @prop()
    name: string

    @ApiProperty({ description: '活动时间' })
    @prop()
    time: string

    @ApiProperty({ description: '限制人数' })
    @prop()
    person: number

    @ApiProperty({ description: '活动地点' })
    @prop()
    local: string

    @ApiProperty({ description: '活动内容' })
    @prop()
    content: string

    // DES 一个教练只能有一个活动
    @ApiProperty({ description: '教练' })
    @IsNotEmpty({ message: '活动必须要有一个教练' })
    @arrayProp({ itemsRef: 'Coach', required: true })
    coachs: Ref<Coach>[]
}

// export const ActivityModel = getModelForClass(Activity)
