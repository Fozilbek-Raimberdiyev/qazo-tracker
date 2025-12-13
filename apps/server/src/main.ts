import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Qazo Tracker API')
    .setDescription('Qazo Tracker API documentation')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpointlari')
    .addTag('users', 'Foydalanuvchilar boshqaruvi')
    .addBearerAuth() // JWT autentifikatsiya
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Token saqlab qolinsin
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
