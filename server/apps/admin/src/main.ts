import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 指定服务框架为express,方便进行静态资源托管
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('uploads' , {
    prefix:'/uploads'
  });

  // 服务端允许跨域访问资源
  app.enableCors();

  // 将validationPipe全局引入
  app.useGlobalPipes(new ValidationPipe());

  // 引入swagger
  const options = new DocumentBuilder()
    .setTitle('毕业设计——后台接口文档')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('back-api-docs', app, document);

  // TODO 2020年1月5日 通过配置文件指定接口
  const PORT = process.env.ADMIN_PORT || 3001;
  await app.listen(PORT);
  console.log(`后台服务启动：http://localhost:${PORT}/back-api-docs`);
}
bootstrap();
