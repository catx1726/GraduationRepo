import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import{ PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports:[PassportModule],
  controllers: [AuthController],
  providers:[LocalStrategy]
})
export class AuthModule {}
