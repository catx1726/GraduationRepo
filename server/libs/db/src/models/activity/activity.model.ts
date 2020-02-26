import { modelOptions, prop, Ref, arrayProp } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { Coach } from '../coach/coach.model'
import { MaxLength, IsNotEmpty, ArrayMaxSize, ArrayUnique } from 'class-validator'
import { User } from '../user/user.model'

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

    @ApiProperty({ description: '活动状态' })
    @prop()
    status: boolean

    // DES 一个教练只能有一个活动
    @ApiProperty({ description: '教练' })
    @IsNotEmpty({ message: '活动必须要有一个教练' })
    @ArrayUnique({ message: '一个教练不能重复指定到同一活动' })
    @arrayProp({ itemsRef: 'Coach', required: true })
    coaches: Ref<Coach>[]

    // DES 届时通过这个限制活动的报名
    @ApiProperty({ description: '已经参加活动的人' })
    @ArrayMaxSize(50, { message: '活动报名人数已满' })
    @ArrayUnique({ message: '一个用户不能重复报选同一活动' })
    @arrayProp({ itemsRef: 'User' })
    users?: Ref<User>[]
}

// export const ActivityModel = getModelForClass(Activity)
