import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Replicate from 'replicate';
import { v4 as uuidv4 } from 'uuid';
import { Clothing } from '../clothing/schemas/clothing.schema';

export interface TryonJob {
  jobId: string;
  status: 'processing' | 'done' | 'error';
  resultImageUrl?: string;
  error?: string;
  productName?: string;
  productImage?: string;
  createdAt: Date;
}

const jobs = new Map<string, TryonJob>();

@Injectable()
export class TryonService {
  private replicate: Replicate;

  constructor(
    @InjectModel(Clothing.name) private clothingModel: Model<Clothing>,
  ) {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }

  /** Start async job using Replicate (FASTEST) */
  async startTryOn(productId: string, userPhoto: Express.Multer.File): Promise<{ jobId: string; message: string }> {
    const product = await this.clothingModel.findById(productId);
    if (!product || !product.isActive) throw new NotFoundException('Mahsulot topilmadi');
    if (!product.images?.length) throw new BadRequestException('Mahsulotda rasm mavjud emas');

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new BadRequestException('REPLICATE_API_TOKEN o\'rnatilmagan. Iltimos, .env ni tekshiring.');
    }

    const jobId = uuidv4();
    jobs.set(jobId, {
      jobId,
      status: 'processing',
      productName: product.name,
      productImage: product.images[0],
      createdAt: new Date(),
    });

    // Background processing
    this.runReplicateJob(jobId, product.images[0], userPhoto);

    return { jobId, message: 'AI qayta ishlash boshlandi (Replicate FAST). Status: GET /tryon/status/' + jobId };
  }

  private async runReplicateJob(jobId: string, garmentUrl: string, userPhoto: Express.Multer.File) {
    const job = jobs.get(jobId)!;
    try {
      // 1. User rasm qismini base64 qilish
      const personBase64 = `data:${userPhoto.mimetype};base64,${userPhoto.buffer.toString('base64')}`;

      // 2. Replicate modelini chaqirish (IDM-VTON)
      const output = await this.replicate.run(
        "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
        {
          input: {
            human_img: personBase64,
            garm_img: garmentUrl,
            garment_des: job.productName,
            category: "upper_body",
            steps: 30,
            seed: 42,
            crop: true
          }
        }
      );

      // Replicate odatda massiv yoki string qaytaradi
      const resultUrl = Array.isArray(output) ? output[0] : output;
      
      job.status = 'done';
      job.resultImageUrl = resultUrl as string;
    } catch (err) {
      job.status = 'error';
      job.error = (err as Error).message;
    }
  }

  getJobStatus(jobId: string): TryonJob {
    const job = jobs.get(jobId);
    if (!job) throw new NotFoundException('Job topilmadi');
    return job;
  }
}
