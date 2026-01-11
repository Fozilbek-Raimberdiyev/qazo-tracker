import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
dotenv.config();
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Qazo Tracker API')
    .setDescription('Qazo Tracker API documentation')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpointlari')
    .addTag('users', 'Foydalanuvchilar boshqaruvi')
    .addTag('prayer', 'Qazo namozlari boshqaruvi')
    .addTag('fasting', "Qazo ro'zalari boshqaruvi")
    .addTag('statistic', 'Foydalanuvchi statistikasi')
    .addBearerAuth() // JWT autentifikatsiya
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Token saqlab qolinsin
    },
  });
  app.enableCors({
    origin: '*',
    
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
