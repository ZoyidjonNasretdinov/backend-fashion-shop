import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix qo'shish
  app.setGlobalPrefix('api');

  // Asosiy sahifani Swagger hujjatlariga yo'naltirish
  const server = app.getHttpServer();
  app.use('/', (req, res, next) => {
    if (req.path === '/' || req.path === '/api') {
      return res.redirect('/api/docs');
    }
    next();
  });

  // CORS sozlamalari
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        /^http:\/\/localhost(:\d+)?$/,
        /^http:\/\/127\.0\.0\.1(:\d+)?$/,
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/.*\.railway\.app$/,
      ];

      // Origin bo'lmasa (masalan, Postman yoki server-to-server) ruxsat beramiz
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed = allowedOrigins.some((regex) => regex.test(origin));
      if (isAllowed) {
        callback(null, true);
      } else {
        // Agar xavfsizlik juda muhim bo'lmasa, test davrida callback(null, true) qoldirish mumkin
        // Lekin hozircha xatolik qaytaramiz yoki ehtiyojga qarab true qilamiz
        callback(null, true); // Hozircha hamma originlarga ruxsat (test uchun)
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
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
| 👤 **Users** | Profil boshqaruv, avatar yuklash, parol o'zgartirish |
| 👗 **Clothing** | Kiyimlar CRUD + rasm yuklash |
| 📂 **Categories** | Kategoriyalar boshqaruvi |
| 🏷️ **Brands** | Brendlar boshqaruvi |
| 🛒 **Cart** | Savatcha (qo'shish, o'chirish) |
| ❤️ **Wishlist** | Sevimlilar ro'yxati |
| 📦 **Orders** | Buyurtmalar (berish, tasdiqlash, bekor qilish) |
| ⭐ **Reviews** | Mahsulot baholash va sharhlar |
| 📊 **Dashboard** | Admin va Seller statistikalari |
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
  console.log(`🚀 Fashion Shop is running on: http://0.0.0.0:${port}/api/docs`);
}
bootstrap();
