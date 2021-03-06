import { Strategy, IStrategyOptions } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { InjectModel } from 'nestjs-typegoose'
import { User } from '@libs/db/models/user/user.model'
import { ReturnModelType } from '@typegoose/typegoose'
import { HttpException } from '@nestjs/common'
import { compareSync } from 'bcryptjs'
import { Admin } from '@libs/db/models/admin/admin.model'

export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(@InjectModel(Admin) private AdminModel: ReturnModelType<typeof Admin>) {
        super({
            usernameField: 'name',
            passwordField: 'password'
        } as IStrategyOptions)
    }

    async validate(name: string, password: string) {
        // 拿到用户名去查找，然后将 获取到的密码 进行解码和 输入的密码 进行对比
        const user = await this.AdminModel.findOne({ name })
        if (!user) {
            throw new HttpException({ message: '检查用户名' }, 400)
        }
        if (!compareSync(password, user.password)) {
            throw new HttpException({ message: '检查密码' }, 400)
        }
        if (!user.status) {
            throw new HttpException({ message: '该用户已注销' }, 400)
        }
        return user
    }
}
