import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ClothingModule } from './clothing/clothing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('MONGODB_URI environment variable is not defined!');
        }
        return { uri };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    DashboardModule,
    ClothingModule,
  ],
})
export class AppModule {}
