import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Activity } from '../activity/activity.model'
import { hashSync } from 'bcryptjs'

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class Coach {
    @ApiProperty({ description: '教练名称', example: 'cad317' })
    @prop()
    @IsNotEmpty({ message: '名称不能为空' })
    name: string

    @ApiProperty({ description: '密码' })
    @prop({
        get(val) {
            return val
        },
        set(val) {
            return val ? hashSync(val) : val // 对用户提交的密码进行加密
        }
    })
    @IsNotEmpty({ message: '密码不能为空' })
    password: string

    // @ApiProperty({ description: '教练真实姓名', example: '金泰熙' })
    // @prop()
    // @IsNotEmpty({ message: '真实姓名不能为空' })
    // realname: string

    @ApiProperty({ description: '教练头像' })
    @prop()
    avatar: string

    @ApiProperty({ description: '教练性别', example: '女' })
    @IsNotEmpty({ message: '性别不能为空' })
    @prop()
    gender: string

    @ApiProperty({ description: '教练电话' })
    @prop()
    @IsNotEmpty({ message: '电话不能为空' })
    phone: string

    @ApiProperty({ description: '教练邮箱' })
    @prop()
    @IsNotEmpty({ message: '邮箱不能为空' })
    email: string

    @ApiProperty({ description: '教练状态' })
    @prop()
    status: boolean

    @ApiProperty({ description: '教练身份证号' })
    @prop()
    @IsNotEmpty({ message: '身份证不能为空' })
    identifier: string

    @ApiProperty({ description: '活动' })
    @prop({ ref: 'Activity', required: false })
    activity: Ref<Activity>
}
// export const CoachModel = getModelForClass(Coach)
