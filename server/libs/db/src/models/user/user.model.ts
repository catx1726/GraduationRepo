import { modelOptions, prop, Ref, arrayProp } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, ArrayUnique } from 'class-validator'
import { Exclude } from 'class-transformer'
import { hashSync } from 'bcryptjs'
import { Activity } from '../activity/activity.model'

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class User {
    @ApiProperty({ description: '用户名称', example: '金泰熙', required: true })
    @prop()
    @IsNotEmpty({ message: '名称不能为空' })
    name: string

    @ApiProperty({ description: '用户性别', example: '女' })
    @prop()
    // TODO 2020年1月23日 这里应该还要检测字符，例如 只能1或2
    @IsNotEmpty({ message: '性别不能为空' })
    gender: string

    @ApiProperty({ description: '用户密码', example: '123456' })
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

    @ApiProperty({ description: '用户头像' })
    @prop()
    avatar: string

    @ApiProperty({ description: '用户邮箱' })
    @prop()
    email: string

    @ApiProperty({ description: '用户手机号' })
    @prop()
    phone: string

    @ApiProperty({ description: '用户简介' })
    @prop()
    des: string

    @ApiProperty({ description: '用户身份' })
    @prop()
    isVip: boolean

    @Exclude()
    @ApiProperty({ description: '用户状态' })
    @prop()
    status: boolean

    @ApiProperty({ description: '报名的活动' })
    @arrayProp({ itemsRef: 'Activity' })
    @ArrayUnique({ message: '同一个活动不能报选多次' })
    activitys: Ref<Activity>[]
}

// export const UserModel = getModelForClass(User)
