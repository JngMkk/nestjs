import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { API_AUTH_TYPE } from './common/consts/swagger.const';
import { ENV_SERVER_PORT_KEY } from './core/config/consts/config.const';
import { HttpExceptionFilter } from './core/exception/exception-filters/http.exception-filter';

/**
 * Nest Application 시작점
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  // https://docs.nestjs.com/openapi/introduction
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS API description')
    .setVersion('1.0')
    .addTag('NestJS')
    .addBasicAuth(undefined, API_AUTH_TYPE.BASIC)
    .addBearerAuth(undefined, API_AUTH_TYPE.ACCESS)
    .addBearerAuth(undefined, API_AUTH_TYPE.REFRESH)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(process.env[ENV_SERVER_PORT_KEY] ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
