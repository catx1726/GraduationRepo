import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategy/local.strategy'
import { JWTStrategy } from './strategy/jwt.strategy'

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [LocalStrategy, JWTStrategy]
})
export class AuthModule {}
