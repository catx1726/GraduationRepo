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
import { ArticleModule } from './article/article.module'
import { ArticleController } from './article/article.controller'

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
        AuthModule,
        ArticleModule
    ],
    controllers: [AppController, CoachController, ActivityController, ArticleController],
    providers: [AppService]
})
export class AppModule {}
