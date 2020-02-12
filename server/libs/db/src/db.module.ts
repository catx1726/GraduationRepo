import { Module, Global } from '@nestjs/common'
import { DbService } from './db.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from './models/user/user.model'
import { Coach } from './models/coach/coach.model'
import { Activity } from './models/activity/activity.model'
import { Comment } from './models/comment/comment.model'
import { Typegoose } from '@typegoose/typegoose'

// 将模型挂载到全局
const models = TypegooseModule.forFeature([User, Coach, Activity, Comment])
@Global()
@Module({
  imports: [
    // TODO 2020年1月18日 因为用的是 nest config 来加载config文件，所以需要异步加载
    TypegooseModule.forRootAsync({
      useFactory() {
        return {
          uri: process.env.DB,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: true,
        }
      },
    }),
    // TypegooseModule.forRoot(process.env.DB, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: true,
    // }),
    models,
  ],
  providers: [DbService],
  exports: [DbService, models],
})
export class DbModule {}
