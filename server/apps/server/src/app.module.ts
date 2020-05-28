import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoachController } from './coach/coach.controller'
import { CoachModule } from './coach/coach.module'
import { AuthController } from './auth/auth.controller'
import { AuthModule } from './auth/auth.module'
import { CommentModule } from './comment/comment.module'
import { MulterModule } from '@nestjs/platform-express'
import { ActivitiesModule } from './activities/activities.module'
import { CommonModule } from '@app/common'
import { ArticleModule } from './article/article.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from '@app/common/strategy/local.strategy'
import { JWTStrategy } from '@app/common/strategy/jwt.strategy'
import { UserController } from './user/user.controller'
import { UserModule } from './user/user.module'
import { MeetingModule } from './meeting/meeting.module'

@Module({
    imports: [
        MulterModule.register({
            dest: 'uploads'
        }),
        CommonModule, // 之前把这个 module 给掉了，然后引入的 model 一直报错，教训
        CoachModule,
        AuthModule,
        CommentModule,
        ActivitiesModule,
        ArticleModule,
        PassportModule,
        UserModule,
        AppModule,
        MeetingModule
    ],
    controllers: [AppController, CoachController, AuthController, UserController],
    providers: [AppService, LocalStrategy, JWTStrategy]
})
export class AppModule {}
