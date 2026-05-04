import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // O'quvchilar tushunishi oson bo'lishi uchun Swagger sozlamalari
  const config = new DocumentBuilder()
    .setTitle('Fashion Shop API')
    .setDescription(
      "Tizimga kirish, ro'yxatdan o'tish va Dashboard logikalari (Admin, User, Seller) uchun API dokumentatsiyasi",
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // CORS ni yoqib olamiz
  app.enableCors();

  await app.listen(3000);
  console.log('🚀 Dastur ishga tushdi: http://localhost:3000');
  console.log(
    "📖 Swagger dokumentatsiyasi (O'quvchilar uchun): http://localhost:3000/api/docs",
  );
}
bootstrap();
