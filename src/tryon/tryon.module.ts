import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Clothing, ClothingSchema } from '../clothing/schemas/clothing.schema';
import { TryonService } from './tryon.service';
import { TryonController } from './tryon.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Clothing.name, schema: ClothingSchema }]),
  ],
  controllers: [TryonController],
  providers: [TryonService],
})
export class TryonModule {}
