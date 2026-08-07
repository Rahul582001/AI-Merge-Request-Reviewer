import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('AI Merge Request Reviewer')
    .setDescription('Backend APIs for AI-MRR')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);

  Logger.log('===================================================');
  Logger.log(`🚀 Server is running successfully`);
  Logger.log(`🌐 Local URL : http://localhost:${process.env.port}`);
  Logger.log('===================================================');

  // console.log(
  //   `Swagger is available at http://localhost:${process.env.PORT ?? 3000}/docs`,
  // );
}

bootstrap();
