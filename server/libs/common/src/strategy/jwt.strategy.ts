import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { InjectModel } from 'nestjs-typegoose'
import { User } from '@libs/db/models/user/user.model'
import { ReturnModelType } from '@typegoose/typegoose'
import { HttpException } from '@nestjs/common'
import { compareSync } from 'bcryptjs'
import { Coach } from '@libs/db/models/coach/coach.model'

export class JWTStrategy extends PassportStrategy(Strategy, 'JWT') {
    constructor(
        @InjectModel(User) private userModel: ReturnModelType<typeof User>,
        @InjectModel(Coach) private coachModel: ReturnModelType<typeof Coach>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 取出 token 部分
            secretOrKey: process.env.JWT_SECRET_KEY // 还原token（解出ID）
        } as StrategyOptions)
    }

    async validate(id) {
        try {
            let user = await this.userModel.findById(id)
            let coach = await this.coachModel.findById(id)
            let jwtCheck = true
            console.log('JWT user/coach:', user || coach)
            // DES 找不到的情况 user == null,但是 不可用 user 与 null的比较 做条件
            if (user instanceof this.userModel) {
                return {
                    type: 'user',
                    user,
                    jwtCheck
                }
            }
            if (coach instanceof this.coachModel) {
                return {
                    type: 'coach',
                    coach,
                    jwtCheck
                }
            }
            jwtCheck = false
            return { jwtCheck, message: '请先登录', status: 400 }
        } catch (error) {
            console.log('JWTStrategy error:', error)
            throw new HttpException({ message: '请先登录' }, 400)
        }
    }
}
