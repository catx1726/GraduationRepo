import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from '@libs/db';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [DbModule, UsersModule, CommentsModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
