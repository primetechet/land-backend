import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in the DTO
      forbidNonWhitelisted: true, // throws error for unknown properties
      transform: true, // auto-transforms payload to DTO class
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Land Backend API')
    .setDescription('API documentation for Integrated Land Management System')
    .setVersion('1.0')
    .addBearerAuth() // optional: adds JWT Bearer Auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // http://localhost:3000/api/docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
