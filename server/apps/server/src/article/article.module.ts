import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';

@Module({
  controllers: [ArticleController]
})
export class ArticleModule {}
