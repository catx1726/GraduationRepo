import { Module, Global } from '@nestjs/common';
import { DbService } from './db.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './models/user/user.model';
import { Coach } from './models/coach/coach.model';
import { Activity } from './models/activity/activity.model';
import { Comment } from './models/comment/comment.model';

// 将模型挂载到全局
const models = TypegooseModule.forFeature([User, Coach, Activity, Comment]);
@Global()
@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://localhost/graduationDataBase', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    }),
    models
  ],
  providers: [DbService],
  exports: [DbService , models],
})
export class DbModule {}
