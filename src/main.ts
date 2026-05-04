import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('👗 Fashion Shop API')
    .setDescription(
      `
## 👗 Fashion Shop — API Qo'llanma

Kiyim-kechak va moda marketplace API.

---

### 🗺️ API bo'limlari:

| Bo'lim | Maqsad |
|--------|--------|
| 🔓 **Auth** | Kirish va Ro'yxatdan o'tish |
| 👗 **Clothing** | Kiyimlar ro'yxati |
| 🛡️ **Admin** | Foydalanuvchilarni boshqarish |
| 📊 **Dashboard** | Statistika va Kabinet |
      `,
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: '👗 Fashion Shop API Docs',
    swaggerOptions: { persistAuthorization: true },
  });

  app.enableCors();
  await app.listen(5000);
  console.log('🚀 Fashion Shop: http://localhost:5000/api/docs');
}
bootstrap();
