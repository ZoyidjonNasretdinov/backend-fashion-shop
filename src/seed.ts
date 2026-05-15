import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { Role } from './users/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './users/schemas/user.schema';
import { Model } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  const userModel = app.get<Model<User>>(getModelToken(User.name));

  console.log('🚀 Seeding users...');

  const users = [
    {
      fullName: 'Asosiy Admin',
      email: 'admin@fashionshop.uz',
      password: 'admin123',
      role: Role.ADMIN,
    },
    {
      fullName: 'Sifatli Kiyimlar Seller',
      email: 'seller@fashionshop.uz',
      password: 'seller123',
      role: Role.SELLER,
    },
  ];

  for (const userData of users) {
    const exists = await userModel.findOne({ email: userData.email });
    if (!exists) {
      // Manually hash if service doesn't allow role override in register
      // But we modified registerSeller in previous turn, so let's use it or direct creation
      await authService.registerSeller({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
      });
      
      // If it was admin, we need to manually update the role since registerSeller sets SELLER
      if (userData.role === Role.ADMIN) {
        await userModel.updateOne({ email: userData.email }, { role: Role.ADMIN });
      }
      
      console.log(`✅ Created ${userData.role}: ${userData.email}`);
    } else {
      console.log(`ℹ️ User ${userData.email} already exists.`);
    }
  }

  console.log('✨ Seeding completed!');
  await app.close();
}

bootstrap();
