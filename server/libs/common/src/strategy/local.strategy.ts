import { Strategy, IStrategyOptions } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { InjectModel } from 'nestjs-typegoose'
import { User } from '@libs/db/models/user/user.model'
import { ReturnModelType } from '@typegoose/typegoose'
import { HttpException } from '@nestjs/common'
import { compareSync } from 'bcryptjs'
import { Coach } from '@libs/db/models/coach/coach.model'

export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(
        @InjectModel(User) private userModel: ReturnModelType<typeof User>,
        @InjectModel(Coach) private coachModel: ReturnModelType<typeof Coach>
    ) {
        super({
            usernameField: 'name',
            passwordField: 'password'
        } as IStrategyOptions)
    }

    async validate(name: string, password: string) {
        try {
            // 拿到用户名去查找，然后将 获取到的密码 进行解码和 输入的密码 进行对比
            const user = await this.userModel.findOne({ name })
            const coach = await this.coachModel.findOne({ name })
            console.log('LocalStrategy:', user || coach, 'name:', name, 'password:', password)
            if (user instanceof this.userModel) {
                if (!user) {
                    return { message: '检查用户名' }
                }
                // FIXME 2020年4月20日 没有设置密码的用户这里会报错，解决办法是给现有的用户批量一个密码
                if (!compareSync(password, user.password)) {
                    return { message: '检查密码' }
                }
                return { type: 'user', user }
            }
            if (coach instanceof this.coachModel) {
                if (!coach) {
                    return { message: '检查用户名' }
                }
                if (!compareSync(password, coach.password)) {
                    return { message: '检查密码' }
                }
                return { type: 'coach', coach }
            }
            return { type: 'any', message: '检查用户名和密码' }
        } catch (error) {
            console.log('LocalStrategy error:', error)
            // return { error, status: 400 }
        }
    }
}
