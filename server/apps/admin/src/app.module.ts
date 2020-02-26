import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbModule } from '@libs/db'
import { UsersModule } from './users/users.module'
import { CommentsModule } from './comments/comments.module'
import { CommonModule } from 'libs/common/src'
import { CoachController } from './coach/coach.controller'
import { CoachModule } from './coach/coach.module'
import { ActivityController } from './activity/activity.controller'
import { ActivityModule } from './activity/activity.module'
import { AuthModule } from './auth/auth.module'
import { MulterModule } from '@nestjs/platform-express'

@Module({
    imports: [
        MulterModule.register({
            dest: 'uploads'
        }),
        CommonModule,
        UsersModule,
        CommentsModule,
        CoachModule,
        ActivityModule,
        AuthModule
    ],
    controllers: [AppController, CoachController, ActivityController],
    providers: [AppService]
})
export class AppModule {}
