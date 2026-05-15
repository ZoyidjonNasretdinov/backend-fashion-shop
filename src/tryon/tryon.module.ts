import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Clothing, ClothingSchema } from '../clothing/schemas/clothing.schema';
import { TryonService } from './tryon.service';
import { TryonController } from './tryon.controller';
import { GeminiService } from './gemini.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Clothing.name, schema: ClothingSchema }]),
    CloudinaryModule,
  ],
  controllers: [TryonController],
  providers: [TryonService, GeminiService],
})
export class TryonModule {}
