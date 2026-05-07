import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS sozlamalari (Flowers proektidagidek)
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        /^http:\/\/localhost(:\d+)?$/,
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/.*\.railway\.app$/,
      ];
      if (!origin || allowedOrigins.some((regex) => regex.test(origin))) {
        callback(null, true);
      } else {
        callback(null, true); // Test uchun barchasiga ruxsat beramiz
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'x-auth-token',
    ],
    exposedHeaders: ['Set-Cookie', 'x-auth-token'],
    optionsSuccessStatus: 204,
  });

  // So'rovlarni kuzatish (Logging)
  app.use((req, res, next) => {
    if (req.method !== 'OPTIONS') {
      console.log(
        `[Request] Method: ${req.method}, Path: ${req.path}, Body: ${JSON.stringify(req.body)}`,
      );
    }
    next();
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger hujjatlari
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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: '👗 Fashion Shop API Docs',
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Fashion Shop: http://0.0.0.0:${port}/api/docs`);
}
bootstrap();
