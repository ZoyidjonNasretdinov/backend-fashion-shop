import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Clothing } from '../clothing/schemas/clothing.schema';
import { GeminiService } from './gemini.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class TryonService {
  constructor(
    @InjectModel(Clothing.name) private clothingModel: Model<Clothing>,
    private geminiService: GeminiService,
    private cloudinaryService: CloudinaryService,
  ) {}

  /** Start try-on and wait for result (Synchronous) */
  async startTryOn(productId: string, userPhoto: Express.Multer.File): Promise<{ imageUrl: string }> {
    const product = await this.clothingModel.findById(productId);
    if (!product || !product.isActive) throw new NotFoundException('Mahsulot topilmadi');
    if (!product.images?.length) throw new BadRequestException('Mahsulotda rasm mavjud emas');

    try {
      // 1. Gemini orqali rasm generatsiya qilish
      const resultDataUrl = await this.geminiService.generateTryOn(
        userPhoto.buffer,
        product.images[0],
        userPhoto.mimetype,
      );

      // 2. Cloudinary-ga yuklash
      const uploadResult = await this.cloudinaryService.uploadBase64(resultDataUrl, 'tryon-results');

      return { imageUrl: uploadResult.secure_url };
    } catch (error) {
      throw new BadRequestException('AI kiyintirishda xatolik yuz berdi: ' + error.message);
    }
  }
}
