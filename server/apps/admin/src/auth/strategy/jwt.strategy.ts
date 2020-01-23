import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '@libs/db/models/user/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { HttpException } from '@nestjs/common';
import { compareSync } from 'bcryptjs';

export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User) private userModel: ReturnModelType<typeof User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 取出 token 部分
      secretOrKey: process.env.JWT_SECRET_KEY, // 还原token（解出ID）
    } as StrategyOptions);
  }

  async validate(id) {
    return await this.userModel.findById(id);
  }
}
