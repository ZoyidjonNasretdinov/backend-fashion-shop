import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async create(productId: string, userId: string, dto: CreateReviewDto) {
    const existing = await this.reviewModel.findOne({ productId, userId });
    if (existing) throw new ConflictException('Siz bu mahsulotni allaqachon baholagansiz');
    return await new this.reviewModel({ ...dto, productId, userId }).save();
  }

  async findByProduct(productId: string) {
    return await this.reviewModel.find({ productId }).populate('userId', 'fullName');
  }

  async getProductRating(productId: string) {
    const reviews = await this.reviewModel.find({ productId });
    if (!reviews.length) return { averageRating: 0, totalReviews: 0 };
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return { averageRating: +avg.toFixed(1), totalReviews: reviews.length };
  }

  async remove(id: string, userId: string) {
    const review = await this.reviewModel.findOneAndDelete({ _id: id, userId });
    if (!review) throw new NotFoundException('Review topilmadi yoki ruxsat yo\'q');
    return { message: 'Review o\'chirildi' };
  }
}
