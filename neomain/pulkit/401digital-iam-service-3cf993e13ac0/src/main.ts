import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './middlewares/app.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(morgan('combined'));

  app.setGlobalPrefix('/api');

  const options = new DocumentBuilder()
    .addServer(process.env.SWAGGER_HOST)
    .setTitle('Dealer Microservices')
    .setDescription('Api Dealer Service')
    .setVersion('1.0.0')
    .addSecurity('ApiKey', {
      type: 'apiKey',
      in: 'header',
      name: 'x-api-key',
    })
    .addSecurityRequirements('ApiKey', [])
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AppExceptionFilter());

  await app.listen(process.env.PORT);

  process.on('SIGINT', () => {
    app.enableShutdownHooks();
    app.close();
  });
}
bootstrap();
