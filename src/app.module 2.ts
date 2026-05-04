import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb+srv://zoyidjonnasretdinovcoder_db_user:0u0nqnrLqmNK5BHU@cluster0.qrp7dt1.mongodb.net/?appName=Cluster0',
    ),
    UsersModule,
    AuthModule,
    DashboardModule,
  ],
})
export class AppModule {}
