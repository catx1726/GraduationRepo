import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // 指定服务框架为express,方便进行静态资源托管
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 服务端允许跨域访问资源
  app.enableCors();

  // 引入swagger
  const options = new DocumentBuilder()
  .setTitle('毕业设计——后台接口文档')
  .build();
  const document = SwaggerModule.createDocument(app , options);
  SwaggerModule.setup('back-api-docs' , app , document);
  
  // TODO 2020年1月5日 通过配置文件指定接口 
  await app.listen(3003);
  console.log(`后台服务启动：http://localhost:3003/back-api-docs`);
}
bootstrap();
