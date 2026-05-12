import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('⭐ Reviews')
@Controller('products/:productId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mahsulotga review qoldirish' })
  create(@Param('productId') productId: string, @Body() dto: CreateReviewDto, @Request() req: any) {
    return this.reviewsService.create(productId, req.user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Mahsulot reviewlari' })
  findAll(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @Get('rating')
  @ApiOperation({ summary: 'Mahsulot o\'rtacha reytingi' })
  getRating(@Param('productId') productId: string) {
    return this.reviewsService.getProductRating(productId);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Review o\'chirish' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.reviewsService.remove(id, req.user.sub);
  }
}
