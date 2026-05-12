import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('❤️ Wishlist')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Sevimlilar ro\'yxatini ko\'rish' })
  getWishlist(@Request() req: any) {
    return this.wishlistService.getWishlist(req.user.sub);
  }

  @Post('toggle/:productId')
  @ApiOperation({ summary: 'Mahsulotni sevimliga qo\'shish/o\'chirish' })
  toggle(@Param('productId') productId: string, @Request() req: any) {
    return this.wishlistService.toggle(req.user.sub, productId);
  }
}
