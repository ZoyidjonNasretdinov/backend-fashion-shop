import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('🛒 Cart')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Korzinani ko\'rish' })
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.sub);
  }

  @Post('add')
  @ApiOperation({ summary: 'Korzinaga mahsulot qo\'shish' })
  addItem(@Body() dto: AddToCartDto, @Request() req: any) {
    return this.cartService.addItem(req.user.sub, dto);
  }

  @Delete('item/:productId')
  @ApiOperation({ summary: 'Korzinadan mahsulot o\'chirish' })
  removeItem(@Param('productId') productId: string, @Request() req: any) {
    return this.cartService.removeItem(req.user.sub, productId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Korzinani tozalash' })
  clearCart(@Request() req: any) {
    return this.cartService.clearCart(req.user.sub);
  }
}
